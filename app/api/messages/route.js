import path from "path";
import { createHash, randomUUID } from "crypto";
import { put } from "@vercel/blob";

import {
  ALLOWED_ATTACHMENT_TYPES,
  MAX_ATTACHMENT_BYTES,
  MAX_ATTACHMENTS_PER_MESSAGE,
  formatAttachment,
  formatMessage,
  getCurrentChatUser,
  getOrCreateStoreTeamConversation,
  userCanAccessConversation,
} from "@/lib/chat";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const MESSAGE_PAGE_SIZE = 20;

function getPositiveInteger(value) {
  const number = Number(value);

  return Number.isInteger(number) && number > 0 ? number : null;
}

function sanitizeFileName(fileName) {
  return String(fileName ?? "attachment")
    .replace(/[/\\?%*:|"<>]/g, "-")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 180);
}

async function loadMessages(
  conversationId,
  currentUserId,
  { afterMessageId = null, beforeMessageId = null } = {}
) {
  const isOlderPage = Boolean(beforeMessageId);
  const messageFilter = afterMessageId
    ? "AND m.id > ?"
    : beforeMessageId
      ? "AND m.id < ?"
      : "";
  const values = [conversationId];

  if (afterMessageId) values.push(afterMessageId);
  if (beforeMessageId) values.push(beforeMessageId);

  const [messageRows] = await db.execute(
    `
    SELECT
      m.id,
      m.conversation_id,
      m.sender_user_id,
      m.body,
      m.message_status,
      m.created_at,
      CONCAT_WS(' ', u.first_name, u.last_name) AS sender_name,
      r.role_key AS sender_role_key,
      u.avatar AS sender_avatar,
      u.is_active AS sender_is_active,
      u.deleted_at AS sender_deleted_at
    FROM chat_messages m
    INNER JOIN users u ON m.sender_user_id = u.id
    INNER JOIN roles r ON u.role_id = r.id
    WHERE m.conversation_id = ?
      AND m.deleted_at IS NULL
      ${messageFilter}
    ORDER BY m.id ${isOlderPage || !afterMessageId ? "DESC" : "ASC"}
    LIMIT ${MESSAGE_PAGE_SIZE + 1}
    `,
    values
  );

  const hasMoreOlder = isOlderPage
    ? messageRows.length > MESSAGE_PAGE_SIZE
    : !afterMessageId && messageRows.length > MESSAGE_PAGE_SIZE;
  const pageRows = messageRows.slice(0, MESSAGE_PAGE_SIZE);
  const orderedRows = isOlderPage || !afterMessageId ? pageRows.reverse() : pageRows;
  const messages = orderedRows.map((row) => formatMessage(row, currentUserId));
  const messageIds = messages.map((message) => message.id);

  if (!messageIds.length) {
    return {
      messages,
      hasMoreOlder,
    };
  }

  const placeholders = messageIds.map(() => "?").join(", ");
  const [attachmentRows] = await db.execute(
    `
    SELECT
      id,
      message_id,
      original_file_name,
      mime_type,
      size_bytes,
      storage_url
    FROM chat_message_attachments
    WHERE message_id IN (${placeholders})
      AND deleted_at IS NULL
    ORDER BY id ASC
    `,
    messageIds
  );

  const attachmentsByMessageId = new Map();

  for (const row of attachmentRows) {
    const attachments = attachmentsByMessageId.get(row.message_id) ?? [];
    attachments.push(formatAttachment(row));
    attachmentsByMessageId.set(row.message_id, attachments);
  }

  return {
    messages: messages.map((message) => ({
      ...message,
      attachments: attachmentsByMessageId.get(message.id) ?? [],
    })),
    hasMoreOlder,
  };
}

async function prepareAttachments(files) {
  if (files.length > MAX_ATTACHMENTS_PER_MESSAGE) {
    throw new Error(`Maximum ${MAX_ATTACHMENTS_PER_MESSAGE} attachments allowed.`);
  }

  return Promise.all(
    files.map(async (file) => {
      if (!ALLOWED_ATTACHMENT_TYPES.has(file.type)) {
        throw new Error("Only JPG, PNG, WebP, and PDF attachments are allowed.");
      }

      if (file.size > MAX_ATTACHMENT_BYTES) {
        throw new Error("Each attachment must be 10 MB or smaller.");
      }

      const originalFileName = sanitizeFileName(file.name);
      const extension = path.extname(originalFileName).toLowerCase();
      const storedFileName = `${randomUUID()}${extension}`;
      const storagePath = `chat/${storedFileName}`;
      const buffer = Buffer.from(await file.arrayBuffer());
      const checksum = createHash("sha256").update(buffer).digest("hex");
      const blob = await put(storagePath, buffer, {
        access: "public",
        contentType: file.type,
      });

      return {
        originalFileName,
        mimeType: file.type,
        sizeBytes: file.size,
        storagePath: blob.pathname,
        storageUrl: blob.url,
        checksum,
      };
    })
  );
}

export async function GET(request) {
  const currentUser = await getCurrentChatUser(request);

  if (!currentUser) {
    return Response.json({ message: "Not authorized." }, { status: 401 });
  }

  const conversationId = await getOrCreateStoreTeamConversation(currentUser.id);
  const url = new URL(request.url);
  const afterMessageId = getPositiveInteger(url.searchParams.get("afterMessageId"));
  const beforeMessageId = getPositiveInteger(
    url.searchParams.get("beforeMessageId")
  );
  const { messages, hasMoreOlder } = await loadMessages(conversationId, currentUser.id, {
    afterMessageId,
    beforeMessageId: afterMessageId ? null : beforeMessageId,
  });

  return Response.json({
    currentUser,
    conversationId,
    messages,
    hasMoreOlder,
  });
}

export async function POST(request) {
  const currentUser = await getCurrentChatUser(request);

  if (!currentUser) {
    return Response.json({ message: "Not authorized." }, { status: 401 });
  }

  const formData = await request.formData().catch(() => null);

  if (!formData) {
    return Response.json({ message: "Invalid message payload." }, { status: 400 });
  }

  const conversationId = getPositiveInteger(formData.get("conversationId"));
  const storeTeamConversationId = await getOrCreateStoreTeamConversation(currentUser.id);
  let targetConversationId = storeTeamConversationId;

  if (conversationId) {
    const canAccess = await userCanAccessConversation(
      currentUser.id,
      conversationId
    );

    if (!canAccess) {
      return Response.json({ message: "Conversation not found." }, { status: 404 });
    }

    targetConversationId = conversationId;
  }

  const body = String(formData.get("body") ?? "").trim().slice(0, 4000);
  const files = formData
    .getAll("attachments")
    .filter((file) => file && typeof file === "object" && file.size > 0);

  if (!body && files.length === 0) {
    return Response.json(
      { message: "Write a message or attach a file." },
      { status: 400 }
    );
  }

  let attachments = [];

  try {
    attachments = await prepareAttachments(files);
  } catch (error) {
    return Response.json(
      { message: error.message || "Attachment upload failed." },
      { status: 400 }
    );
  }

  const message = await db.transaction(async (connection) => {
    const [messageResult] = await connection.execute(
      `
      INSERT INTO chat_messages (
        conversation_id,
        sender_user_id,
        body,
        message_type,
        message_status
      )
      VALUES (?, ?, ?, ?, 'sent')
      `,
      [
        targetConversationId,
        currentUser.id,
        body,
        attachments.length ? "mixed" : "text",
      ]
    );

    const messageAttachments = [];

    for (const attachment of attachments) {
      const [attachmentResult] = await connection.execute(
        `
        INSERT INTO chat_message_attachments (
          message_id,
          uploaded_by_user_id,
          original_file_name,
          mime_type,
          size_bytes,
          storage_provider,
          storage_path,
          storage_url,
          checksum_sha256,
          scan_status
        )
        VALUES (?, ?, ?, ?, ?, 's3', ?, ?, ?, 'pending')
        `,
        [
          messageResult.insertId,
          currentUser.id,
          attachment.originalFileName,
          attachment.mimeType,
          attachment.sizeBytes,
          attachment.storagePath,
          attachment.storageUrl,
          attachment.checksum,
        ]
      );

      messageAttachments.push({
        id: attachmentResult.insertId,
        messageId: messageResult.insertId,
        fileName: attachment.originalFileName,
        mimeType: attachment.mimeType,
        sizeBytes: attachment.sizeBytes,
        url: attachment.storageUrl,
      });
    }

    await connection.execute(
      `
      UPDATE chat_conversations
      SET last_message_id = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
      `,
      [messageResult.insertId, targetConversationId]
    );

    return {
      id: messageResult.insertId,
      conversationId: targetConversationId,
      senderId: currentUser.id,
      senderName: currentUser.name,
      senderRoleKey: currentUser.roleKey,
      senderAccountStatus: "active",
      senderAvatar: currentUser.avatar,
      type: "sent",
      text: body,
      status: "sent",
      createdAt: new Date().toISOString(),
      attachments: messageAttachments,
    };
  });

  return Response.json(
    {
      conversationId: targetConversationId,
      message,
    },
    { status: 201 }
  );
}
