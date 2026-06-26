import { db } from "@/lib/db";
import {
  requireAnyPageAccess,
  requireAnyPageAction,
} from "@/lib/security/server-role-access";

const USER_PATHS = ["/users", "/backoffice/users"];

function normalizePhone(value) {
  return String(value ?? "").replace(/\D/g, "");
}

function getDuplicateUserMessage(error) {
  if (error?.code !== "ER_DUP_ENTRY") return null;

  const duplicateKey = String(error.sqlMessage ?? error.message ?? "").toLowerCase();

  if (duplicateKey.includes("phone")) {
    return "Phone number already exists.";
  }

  if (duplicateKey.includes("email")) {
    return "Email already exists.";
  }

  return "A user with this email or phone number already exists.";
}

function formatUser(row) {
  const isRemoved = Boolean(row.deleted_at);

  return {
    id: row.id,
    firstName: row.first_name,
    lastName: row.last_name,
    email: row.email,
    phone: row.phone,
    avatar: row.avatar ?? "",
    roleId: row.role_id,
    roleKey: row.role_key,
    roleName: row.role_name,
    userType: row.user_type,
    status: isRemoved ? "removed" : row.is_active ? "active" : "inactive",
    isActive: Boolean(row.is_active) && !isRemoved,
    isRemoved,
  };
}

export async function GET(request) {
  const permissionError = await requireAnyPageAccess(request, USER_PATHS);
  if (permissionError) return permissionError;

  const [rows] = await db.execute(
    `
    SELECT
      u.id,
      u.first_name,
      u.last_name,
      u.email,
      u.phone,
      u.avatar,
      u.role_id,
      u.user_type,
      u.is_active,
      u.deleted_at,
      r.role_key,
      r.role_name
    FROM users u
    INNER JOIN roles r ON u.role_id = r.id
    WHERE u.deleted_at IS NULL
    ORDER BY u.id DESC
    `
  );

  return Response.json({
    users: rows.map(formatUser),
  });
}

export async function POST(request) {
  try {
    const permissionError = await requireAnyPageAction(
      request,
      USER_PATHS,
      "createUser"
    );
    if (permissionError) return permissionError;

    const body = await request.json().catch(() => ({}));

    const firstName = String(body.firstName ?? "").trim();
    const lastName = String(body.lastName ?? "").trim();
    const email = String(body.email ?? "").trim();
    const phone = normalizePhone(body.phone);
    const avatar = String(body.avatar ?? "");
    const roleId = Number(body.roleId);
    const isActive = body.status
      ? body.status === "active"
      : Boolean(body.isActive ?? true);

    if (
      !firstName ||
      !lastName ||
      !email ||
      !phone ||
      !Number.isInteger(roleId) ||
      roleId <= 0
    ) {
      return Response.json(
        { message: "First name, last name, email, phone, and role are required." },
        { status: 400 }
      );
    }

    const [roleRows] = await db.execute(
      `SELECT id, role_key, user_type FROM roles WHERE id = ? LIMIT 1`,
      [roleId]
    );

    if (!roleRows[0]) {
      return Response.json({ message: "Role not found." }, { status: 404 });
    }

    const userType = roleRows[0].user_type;

    const [result] = await db.execute(
      `
      INSERT INTO users (
        first_name,
        last_name,
        email,
        phone,
        avatar,
        role_id,
        user_type,
        is_active
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [firstName, lastName, email, phone, avatar, roleId, userType, isActive]
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
        u.role_id,
        u.user_type,
        u.is_active,
        u.deleted_at,
        r.role_key,
        r.role_name
      FROM users u
      INNER JOIN roles r ON u.role_id = r.id
      WHERE u.id = ?
      LIMIT 1
      `,
      [result.insertId]
    );

    return Response.json({ user: formatUser(rows[0]) }, { status: 201 });
  } catch (error) {
    console.error("Create user error:", error);

    const duplicateMessage = getDuplicateUserMessage(error);

    return Response.json(
      { message: duplicateMessage ?? "Failed to create user." },
      { status: duplicateMessage ? 409 : 500 }
    );
  }
}
