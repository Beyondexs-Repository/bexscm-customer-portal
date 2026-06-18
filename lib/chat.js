import { db } from "@/lib/db";

export const STORE_MANAGER = "store-manager";
export const STORE_EMPLOYEE = "store-employee";
export const CHAT_ROLES = new Set([STORE_MANAGER, STORE_EMPLOYEE]);
export const ALLOWED_ATTACHMENT_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "application/pdf",
]);
export const MAX_ATTACHMENT_BYTES = 10 * 1024 * 1024;
export const MAX_ATTACHMENTS_PER_MESSAGE = 5;
export const STORE_TEAM_CONVERSATION_KEY = "store-team";

function decodeCookieValue(value) {
  try {
    return decodeURIComponent(value ?? "");
  } catch {
    return value ?? "";
  }
}

export function getLoginUserId(request) {
  const userId = Number(
    decodeCookieValue(request.cookies.get("aloha-login-user-id")?.value)
  );

  return Number.isInteger(userId) && userId > 0 ? userId : null;
}

export async function getCurrentChatUser(request) {
  const userId = getLoginUserId(request);

  if (!userId) return null;

  const [rows] = await db.execute(
    `
    SELECT
      u.id,
      u.first_name,
      u.last_name,
      u.email,
      u.avatar,
      r.role_key
    FROM users u
    INNER JOIN roles r ON u.role_id = r.id
    WHERE u.id = ?
      AND u.is_active = TRUE
    LIMIT 1
    `,
    [userId]
  );

  const user = rows[0];

  if (!user || !CHAT_ROLES.has(user.role_key)) return null;

  return {
    id: user.id,
    name: [user.first_name, user.last_name].filter(Boolean).join(" "),
    email: user.email,
    avatar: user.avatar ?? "",
    roleKey: user.role_key,
  };
}

export async function getPeerUser(currentUser, requestedPeerUserId = null) {
  const peerRole =
    currentUser.roleKey === STORE_MANAGER ? STORE_EMPLOYEE : STORE_MANAGER;
  const values = [peerRole];
  let userFilter = "";

  if (requestedPeerUserId) {
    userFilter = "AND u.id = ?";
    values.push(requestedPeerUserId);
  }

  const [rows] = await db.execute(
    `
    SELECT
      u.id,
      u.first_name,
      u.last_name,
      u.email,
      u.avatar,
      r.role_key
    FROM users u
    INNER JOIN roles r ON u.role_id = r.id
    WHERE r.role_key = ?
      AND u.is_active = TRUE
      ${userFilter}
    ORDER BY u.id ASC
    LIMIT 1
    `,
    values
  );

  const peer = rows[0];

  if (!peer) return null;

  return {
    id: peer.id,
    name: [peer.first_name, peer.last_name].filter(Boolean).join(" "),
    email: peer.email,
    avatar: peer.avatar ?? "",
    roleKey: peer.role_key,
  };
}

export async function getOrCreateStoreTeamConversation(createdByUserId) {
  async function findExistingConversation() {
    const [rows] = await db.execute(
      `
      SELECT id
      FROM chat_conversations
      WHERE conversation_type = 'group'
        AND direct_conversation_key = ?
      LIMIT 1
      `,
      [STORE_TEAM_CONVERSATION_KEY]
    );

    return rows[0]?.id ?? null;
  }

  const existingConversationId = await findExistingConversation();

  if (existingConversationId) {
    await syncStoreTeamParticipants(existingConversationId);
    return existingConversationId;
  }

  try {
    return await db.transaction(async (connection) => {
      const [conversationResult] = await connection.execute(
        `
        INSERT INTO chat_conversations (
          conversation_type,
          direct_conversation_key,
          title,
          created_by_user_id
        )
        VALUES ('group', ?, 'Store Team Chat', ?)
        `,
        [STORE_TEAM_CONVERSATION_KEY, createdByUserId]
      );

      const conversationId = conversationResult.insertId;

      await syncStoreTeamParticipants(conversationId, connection);

      return conversationId;
    });
  } catch (error) {
    if (error?.code === "ER_DUP_ENTRY") {
      const racedConversationId = await findExistingConversation();
      if (racedConversationId) {
        await syncStoreTeamParticipants(racedConversationId);
        return racedConversationId;
      }
    }

    throw error;
  }
}

async function syncStoreTeamParticipants(conversationId, connection = db) {
  const [users] = await connection.execute(
    `
    SELECT u.id
    FROM users u
    INNER JOIN roles r ON u.role_id = r.id
    WHERE r.role_key IN (?, ?)
      AND u.is_active = TRUE
    `,
    [STORE_MANAGER, STORE_EMPLOYEE]
  );

  for (const user of users) {
    await connection.execute(
      `
      INSERT IGNORE INTO chat_conversation_participants (
        conversation_id,
        user_id,
        participant_role
      )
      VALUES (?, ?, 'member')
      `,
      [conversationId, user.id]
    );
  }
}

export async function getOrCreateDirectConversation(userAId, userBId) {
  const lowUserId = Math.min(userAId, userBId);
  const highUserId = Math.max(userAId, userBId);
  const directKey = `${lowUserId}:${highUserId}`;

  async function findExistingConversation() {
    const [existingRows] = await db.execute(
      `
      SELECT c.id
      FROM chat_conversations c
      WHERE c.conversation_type = 'direct'
        AND c.direct_conversation_key = ?
      LIMIT 1
      `,
      [directKey]
    );

    return existingRows[0]?.id ?? null;
  }

  const existingConversationId = await findExistingConversation();

  if (existingConversationId) return existingConversationId;

  try {
    return await db.transaction(async (connection) => {
      const [conversationResult] = await connection.execute(
        `
        INSERT INTO chat_conversations (
          conversation_type,
          direct_conversation_key,
          created_by_user_id
        )
        VALUES ('direct', ?, ?)
        `,
        [directKey, userAId]
      );

      const conversationId = conversationResult.insertId;

      await connection.execute(
        `
        INSERT INTO chat_conversation_participants (
          conversation_id,
          user_id,
          participant_role
        )
        VALUES (?, ?, 'member'), (?, ?, 'member')
        `,
        [conversationId, lowUserId, conversationId, highUserId]
      );

      return conversationId;
    });
  } catch (error) {
    if (error?.code === "ER_DUP_ENTRY") {
      const racedConversationId = await findExistingConversation();
      if (racedConversationId) return racedConversationId;
    }

    throw error;
  }
}

export async function userCanAccessConversation(userId, conversationId) {
  const [rows] = await db.execute(
    `
    SELECT id
    FROM chat_conversation_participants
    WHERE conversation_id = ?
      AND user_id = ?
    LIMIT 1
    `,
    [conversationId, userId]
  );

  return Boolean(rows[0]);
}

export function formatMessage(row, currentUserId) {
  const senderAccountStatus = row.sender_deleted_at
    ? "removed"
    : row.sender_is_active
      ? "active"
      : "inactive";

  return {
    id: row.id,
    conversationId: row.conversation_id,
    senderId: row.sender_user_id,
    senderName: row.sender_name,
    senderRoleKey: row.sender_role_key,
    senderAccountStatus,
    senderAvatar: row.sender_avatar ?? "",
    type: row.sender_user_id === currentUserId ? "sent" : "received",
    text: row.body ?? "",
    status: row.message_status,
    createdAt: row.created_at,
    attachments: [],
  };
}

export function formatAttachment(row) {
  return {
    id: row.id,
    messageId: row.message_id,
    fileName: row.original_file_name,
    mimeType: row.mime_type,
    sizeBytes: row.size_bytes,
    url: row.storage_url,
  };
}
