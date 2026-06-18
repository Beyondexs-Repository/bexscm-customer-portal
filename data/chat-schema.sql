-- Production-shaped chat schema for store manager <-> store employee messaging.
-- Run this after the existing users table exists. The current app uses users.id
-- as INT, so every *_user_id column below matches that type.

CREATE TABLE IF NOT EXISTS chat_conversations (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  conversation_type ENUM('direct', 'group', 'support') NOT NULL DEFAULT 'direct',
  direct_conversation_key VARCHAR(80) NULL,
  title VARCHAR(160) NULL,
  created_by_user_id INT NOT NULL,
  last_message_id BIGINT UNSIGNED NULL,
  metadata JSON NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  archived_at TIMESTAMP NULL,
  deleted_at TIMESTAMP NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uq_chat_direct_conversation_key (direct_conversation_key),
  INDEX idx_chat_conversations_updated_at (updated_at),
  INDEX idx_chat_conversations_created_by (created_by_user_id),
  INDEX idx_chat_conversations_last_message (last_message_id),
  CONSTRAINT fk_chat_conversations_created_by
    FOREIGN KEY (created_by_user_id) REFERENCES users(id)
    ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS chat_conversation_participants (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  conversation_id BIGINT UNSIGNED NOT NULL,
  user_id INT NOT NULL,
  participant_role ENUM('owner', 'admin', 'member') NOT NULL DEFAULT 'member',
  joined_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  last_read_message_id BIGINT UNSIGNED NULL,
  muted_until TIMESTAMP NULL,
  archived_at TIMESTAMP NULL,
  deleted_at TIMESTAMP NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uq_chat_participant (conversation_id, user_id),
  INDEX idx_chat_participants_user (user_id, deleted_at),
  CONSTRAINT fk_chat_participants_conversation
    FOREIGN KEY (conversation_id) REFERENCES chat_conversations(id)
    ON DELETE CASCADE,
  CONSTRAINT fk_chat_participants_user
    FOREIGN KEY (user_id) REFERENCES users(id)
    ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS chat_messages (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  conversation_id BIGINT UNSIGNED NOT NULL,
  sender_user_id INT NOT NULL,
  body TEXT NULL,
  message_type ENUM('text', 'attachment', 'mixed', 'system') NOT NULL DEFAULT 'text',
  message_status ENUM('sent', 'delivered', 'read', 'failed') NOT NULL DEFAULT 'sent',
  reply_to_message_id BIGINT UNSIGNED NULL,
  metadata JSON NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  edited_at TIMESTAMP NULL,
  deleted_at TIMESTAMP NULL,
  PRIMARY KEY (id),
  INDEX idx_chat_messages_conversation_created (conversation_id, created_at, id),
  INDEX idx_chat_messages_sender (sender_user_id, created_at),
  FULLTEXT KEY ft_chat_messages_body (body),
  CONSTRAINT fk_chat_messages_conversation
    FOREIGN KEY (conversation_id) REFERENCES chat_conversations(id)
    ON DELETE CASCADE,
  CONSTRAINT fk_chat_messages_sender
    FOREIGN KEY (sender_user_id) REFERENCES users(id)
    ON DELETE RESTRICT,
  CONSTRAINT fk_chat_messages_reply_to
    FOREIGN KEY (reply_to_message_id) REFERENCES chat_messages(id)
    ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS chat_message_attachments (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  message_id BIGINT UNSIGNED NOT NULL,
  uploaded_by_user_id INT NOT NULL,
  original_file_name VARCHAR(255) NOT NULL,
  mime_type VARCHAR(120) NOT NULL,
  size_bytes BIGINT UNSIGNED NOT NULL,
  storage_provider ENUM('local', 's3', 'gcs', 'azure') NOT NULL DEFAULT 's3',
  storage_bucket VARCHAR(180) NULL,
  storage_path VARCHAR(1024) NOT NULL,
  storage_url VARCHAR(2048) NULL,
  checksum_sha256 CHAR(64) NULL,
  scan_status ENUM('pending', 'clean', 'infected', 'failed') NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP NULL,
  PRIMARY KEY (id),
  INDEX idx_chat_attachments_message (message_id),
  INDEX idx_chat_attachments_uploaded_by (uploaded_by_user_id),
  CONSTRAINT fk_chat_attachments_message
    FOREIGN KEY (message_id) REFERENCES chat_messages(id)
    ON DELETE CASCADE,
  CONSTRAINT fk_chat_attachments_uploaded_by
    FOREIGN KEY (uploaded_by_user_id) REFERENCES users(id)
    ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS chat_message_receipts (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  message_id BIGINT UNSIGNED NOT NULL,
  user_id INT NOT NULL,
  delivered_at TIMESTAMP NULL,
  read_at TIMESTAMP NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_chat_receipt (message_id, user_id),
  INDEX idx_chat_receipts_user_read (user_id, read_at),
  CONSTRAINT fk_chat_receipts_message
    FOREIGN KEY (message_id) REFERENCES chat_messages(id)
    ON DELETE CASCADE,
  CONSTRAINT fk_chat_receipts_user
    FOREIGN KEY (user_id) REFERENCES users(id)
    ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Recommended production controls:
-- 1. Store attachment files in object storage, not the app server filesystem.
-- 2. Serve attachments through short-lived signed URLs after authorization.
-- 3. Run malware scanning before marking scan_status = 'clean'.
-- 4. Add application rate limits per sender and conversation.
-- 5. Encrypt transport with HTTPS and encrypt storage at rest.
-- 6. Keep audit logs for moderation, deletion, and attachment access.
