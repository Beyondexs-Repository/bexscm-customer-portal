import "server-only";

import { db } from "@/lib/db";

function normalizePhone(value) {
  return String(value ?? "").replace(/\D/g, "");
}

function decodeCookieValue(value) {
  try {
    return decodeURIComponent(value ?? "");
  } catch {
    return value ?? "";
  }
}

function getLoginUserId(cookieStore) {
  const userId = Number(
    decodeCookieValue(cookieStore.get("aloha-login-user-id")?.value)
  );

  return Number.isInteger(userId) && userId > 0 ? userId : null;
}

function getLoginPhone(cookieStore) {
  return normalizePhone(
    decodeCookieValue(cookieStore.get("aloha-login-phone")?.value)
  );
}

function normalizedPhoneSql(alias = "u") {
  return `
    REPLACE(
      REPLACE(
        REPLACE(
          REPLACE(
            REPLACE(
              REPLACE(${alias}.phone, '+', ''),
              '-', ''
            ),
            ' ',
            ''
          ),
          '(',
          ''
        ),
        ')',
        ''
      ),
      '.',
      ''
    )
  `;
}

function formatProfile(user) {
  if (!user) return null;

  return {
    id: user.id,
    firstName: user.first_name,
    lastName: user.last_name,
    email: user.email,
    phone: user.phone,
    avatar: user.avatar ?? "",
    roleKey: user.role_key,
    roleName: user.role_name,
    isActive: Boolean(user.is_active),
  };
}

export async function getProfileById(id) {
  const [rows] = await db.execute(
    `
    SELECT
      u.id,
      u.first_name,
      u.last_name,
      u.email,
      u.phone,
      u.avatar,
      u.is_active,
      r.role_key,
      r.role_name
    FROM users u
    INNER JOIN roles r ON u.role_id = r.id
    WHERE u.id = ?
    LIMIT 1
    `,
    [id]
  );

  return rows[0] ?? null;
}

export async function getProfileByPhone(phone) {
  const lastTenDigits = phone.slice(-10);
  const phoneSearchTerms = Array.from(
    new Set([phone, lastTenDigits].filter(Boolean))
  );

  const [rows] = await db.execute(
    `
    SELECT
      u.id,
      u.first_name,
      u.last_name,
      u.email,
      u.phone,
      u.avatar,
      u.is_active,
      r.role_key,
      r.role_name
    FROM users u
    INNER JOIN roles r ON u.role_id = r.id
    WHERE ${normalizedPhoneSql("u")} LIKE ?
      OR ${normalizedPhoneSql("u")} LIKE ?
    LIMIT 1
    `,
    [
      `%${phoneSearchTerms[0]}`,
      `%${phoneSearchTerms[1] ?? phoneSearchTerms[0]}`,
    ]
  );

  return rows[0] ?? null;
}

export async function getCurrentProfile(cookieStore) {
  const userId = getLoginUserId(cookieStore);
  const phone = getLoginPhone(cookieStore);

  if (!userId && !phone) return null;

  const profile = userId
    ? await getProfileById(userId)
    : await getProfileByPhone(phone);

  return formatProfile(profile);
}

export { formatProfile };
