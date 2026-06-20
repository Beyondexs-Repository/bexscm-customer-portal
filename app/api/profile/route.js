import { db } from "@/lib/db";
import { cookies } from "next/headers";
import { requireAnyPageAccess } from "@/lib/security/server-role-access";
import {
  formatProfile,
  getProfileById,
  getProfileByPhone,
} from "@/lib/server-profile";

const PROFILE_PATHS = ["/profile", "/backoffice/profile"];

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

export async function GET(request) {
  const permissionError = await requireAnyPageAccess(request, PROFILE_PATHS);
  if (permissionError) return permissionError;

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
  const permissionError = await requireAnyPageAccess(request, PROFILE_PATHS);
  if (permissionError) return permissionError;

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
