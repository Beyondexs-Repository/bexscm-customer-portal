import {
  getCurrentChatUser,
  getOrCreateStoreTeamConversation,
  userCanAccessConversation,
} from "@/lib/chat";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

function getPositiveInteger(value) {
  const number = Number(value);

  return Number.isInteger(number) && number > 0 ? number : null;
}

function wait(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

async function getLatestMessageId(conversationId) {
  const [rows] = await db.execute(
    `
    SELECT COALESCE(MAX(id), 0) AS latest_message_id
    FROM chat_messages
    WHERE conversation_id = ?
      AND deleted_at IS NULL
    `,
    [conversationId]
  );

  return Number(rows[0]?.latest_message_id ?? 0);
}

export async function GET(request) {
  const currentUser = await getCurrentChatUser(request);

  if (!currentUser) {
    return Response.json({ message: "Not authorized." }, { status: 401 });
  }

  const url = new URL(request.url);
  const requestedConversationId = getPositiveInteger(
    url.searchParams.get("conversationId")
  );
  const storeTeamConversationId = await getOrCreateStoreTeamConversation(
    currentUser.id
  );
  const conversationId = requestedConversationId ?? storeTeamConversationId;
  const canAccess = await userCanAccessConversation(currentUser.id, conversationId);

  if (!canAccess) {
    return Response.json({ message: "Conversation not found." }, { status: 404 });
  }

  let lastMessageId = getPositiveInteger(url.searchParams.get("lastMessageId")) ?? 0;
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      controller.enqueue(encoder.encode("retry: 3000\n\n"));

      while (!request.signal.aborted) {
        const latestMessageId = await getLatestMessageId(conversationId);

        if (latestMessageId > lastMessageId) {
          lastMessageId = latestMessageId;
          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({ latestMessageId })}\n\n`
            )
          );
        } else {
          controller.enqueue(encoder.encode(": keepalive\n\n"));
        }

        await wait(2500);
      }

      controller.close();
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  });
}
