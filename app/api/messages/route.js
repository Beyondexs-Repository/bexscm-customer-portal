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

async function loadMessages(conversationId, currentUserId) {
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
      u.avatar AS sender_avatar
    FROM chat_messages m
    INNER JOIN users u ON m.sender_user_id = u.id
    INNER JOIN roles r ON u.role_id = r.id
    WHERE m.conversation_id = ?
      AND m.deleted_at IS NULL
    ORDER BY m.created_at ASC, m.id ASC
    LIMIT 200
    `,
    [conversationId]
  );

  const messages = messageRows.map((row) => formatMessage(row, currentUserId));
  const messageIds = messages.map((message) => message.id);

  if (!messageIds.length) return messages;

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

  return messages.map((message) => ({
    ...message,
    attachments: attachmentsByMessageId.get(message.id) ?? [],
  }));
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
  const messages = await loadMessages(conversationId, currentUser.id);

  return Response.json({
    currentUser,
    conversationId,
    messages,
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

  const messageId = await db.transaction(async (connection) => {
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

    for (const attachment of attachments) {
      await connection.execute(
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
    }

    await connection.execute(
      `
      UPDATE chat_conversations
      SET last_message_id = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
      `,
      [messageResult.insertId, targetConversationId]
    );

    return messageResult.insertId;
  });

  const messages = await loadMessages(targetConversationId, currentUser.id);
  const message = messages.find((item) => item.id === messageId);

  return Response.json(
    {
      conversationId: targetConversationId,
      message,
    },
    { status: 201 }
  );
}
