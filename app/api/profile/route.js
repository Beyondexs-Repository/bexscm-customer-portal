import { db } from "@/lib/db";
import { cookies } from "next/headers";

function normalizePhone(value) {
  return String(value ?? "").replace(/\D/g, "");
}

function getPhoneSearchTerms(phoneNumber) {
  const lastTenDigits = phoneNumber.slice(-10);

  return Array.from(new Set([phoneNumber, lastTenDigits].filter(Boolean)));
}

function decodeCookieValue(value) {
  try {
    return decodeURIComponent(value ?? "");
  } catch {
    return value ?? "";
  }
}

function getLoginPhone(cookieStore) {
  return normalizePhone(
    decodeCookieValue(cookieStore.get("aloha-login-phone")?.value)
  );
}

function getLoginUserId(cookieStore) {
  const userId = Number(
    decodeCookieValue(cookieStore.get("aloha-login-user-id")?.value)
  );

  return Number.isInteger(userId) && userId > 0 ? userId : null;
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

async function getProfileByPhone(phone) {
  const phoneSearchTerms = getPhoneSearchTerms(phone);

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

async function getProfileById(id) {
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

export async function GET() {
  const cookieStore = await cookies();
  const userId = getLoginUserId(cookieStore);
  const phone = getLoginPhone(cookieStore);

  if (!userId && !phone) {
    return Response.json({ message: "Not logged in." }, { status: 401 });
  }

  const profile = userId
    ? await getProfileById(userId)
    : await getProfileByPhone(phone);

  if (!profile) {
    return Response.json({ message: "User not found." }, { status: 404 });
  }

  return Response.json({
    profile: formatProfile(profile),
  });
}

export async function PUT(request) {
  const cookieStore = await cookies();
  const userId = getLoginUserId(cookieStore);
  const phone = getLoginPhone(cookieStore);

  if (!userId && !phone) {
    return Response.json({ message: "Not logged in." }, { status: 401 });
  }

  const profile = userId
    ? await getProfileById(userId)
    : await getProfileByPhone(phone);

  if (!profile) {
    return Response.json({ message: "User not found." }, { status: 404 });
  }

  const body = await request.json().catch(() => ({}));

  const firstName = String(body.firstName ?? "").trim();
  const lastName = String(body.lastName ?? "").trim();
  const email = String(body.email ?? "").trim();
  const avatar = String(body.avatar ?? "");

  if (!firstName || !lastName || !email) {
    return Response.json(
      { message: "First name, last name, and email are required." },
      { status: 400 }
    );
  }

  await db.execute(
    `
    UPDATE users
    SET
      first_name = ?,
      last_name = ?,
      email = ?,
      avatar = ?
    WHERE id = ?
    `,
    [firstName, lastName, email, avatar, profile.id]
  );

  const updatedProfile = await getProfileById(profile.id);

  return Response.json({
    message: "Profile updated successfully.",
    profile: formatProfile(updatedProfile),
  });
}
