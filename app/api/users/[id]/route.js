import { db } from "@/lib/db";
import {
  getLoginUserId,
  requireAnyPageAction,
} from "@/lib/security/server-role-access";

const USER_PATHS = ["/users", "/backoffice/users"];

function normalizePhone(value) {
  return String(value ?? "").replace(/\D/g, "");
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

async function getUser(id) {
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
    [id]
  );

  return rows[0] ?? null;
}

export async function PUT(request, { params }) {
  const permissionError = await requireAnyPageAction(
    request,
    USER_PATHS,
    "editUser"
  );
  if (permissionError) return permissionError;

  const { id: userId } = await params;
  const id = Number(userId);

  if (!Number.isInteger(id) || id <= 0) {
    return Response.json({ message: "Invalid user id." }, { status: 400 });
  }

  const existingUser = await getUser(id);

  if (!existingUser) {
    return Response.json({ message: "User not found." }, { status: 404 });
  }

  if (existingUser.deleted_at) {
    return Response.json(
      { message: "Removed users cannot be edited." },
      { status: 409 }
    );
  }

  const body = await request.json().catch(() => ({}));

  const firstName = String(body.firstName ?? "").trim();
  const lastName = String(body.lastName ?? "").trim();
  const email = String(body.email ?? "").trim();
  const phone = normalizePhone(body.phone);
  const roleId = Number(body.roleId);
  const isActive = body.status === "active";

  if (!firstName || !lastName || !email || !phone || !Number.isInteger(roleId) || roleId <= 0) {
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

  await db.execute(
    `
    UPDATE users
    SET
      first_name = ?,
      last_name = ?,
      email = ?,
      phone = ?,
      role_id = ?,
      user_type = ?,
      is_active = ?
    WHERE id = ?
    `,
    [firstName, lastName, email, phone, roleId, userType, isActive, id]
  );

  const updatedUser = await getUser(id);

  return Response.json({
    user: formatUser(updatedUser),
  });
}

export async function PATCH(request, { params }) {
  const permissionError = await requireAnyPageAction(
    request,
    USER_PATHS,
    "editUser"
  );
  if (permissionError) return permissionError;

  const { id: userId } = await params;
  const id = Number(userId);

  if (!Number.isInteger(id) || id <= 0) {
    return Response.json({ message: "Invalid user id." }, { status: 400 });
  }

  const existingUser = await getUser(id);

  if (!existingUser) {
    return Response.json({ message: "User not found." }, { status: 404 });
  }

  if (existingUser.deleted_at) {
    return Response.json(
      { message: "Removed users cannot be enabled or disabled." },
      { status: 409 }
    );
  }

  const body = await request.json().catch(() => ({}));

  const action = body.action;

  if (action !== "disable" && action !== "enable") {
    return Response.json({ message: "Unsupported user action." }, { status: 400 });
  }

  if (action === "disable" && getLoginUserId(request) === id) {
    return Response.json(
      { message: "You cannot disable your own account." },
      { status: 409 }
    );
  }

  await db.execute(
    `
    UPDATE users
    SET is_active = ?
    WHERE id = ?
    `,
    [action === "enable", id]
  );

  const updatedUser = await getUser(id);

  return Response.json({
    message: `User ${action}d successfully.`,
    user: formatUser(updatedUser),
  });
}

export async function DELETE(request, { params }) {
  const permissionError = await requireAnyPageAction(
    request,
    USER_PATHS,
    "deleteUser"
  );
  if (permissionError) return permissionError;

  const { id: userId } = await params;
  const id = Number(userId);

  if (!Number.isInteger(id) || id <= 0) {
    return Response.json({ message: "Invalid user id." }, { status: 400 });
  }

  const existingUser = await getUser(id);

  if (!existingUser) {
    return Response.json({ message: "User not found." }, { status: 404 });
  }

  if (getLoginUserId(request) === id) {
    return Response.json(
      { message: "You cannot remove your own account." },
      { status: 409 }
    );
  }

  if (existingUser.deleted_at) {
    return Response.json(
      { message: "User has already been removed." },
      { status: 409 }
    );
  }

  await db.execute(
    `
    UPDATE users
    SET
      is_active = FALSE,
      deleted_at = CURRENT_TIMESTAMP
    WHERE id = ?
    `,
    [id]
  );

  const removedUser = await getUser(id);

  return Response.json({
    message: "User removed successfully. Chat history was preserved.",
    user: formatUser(removedUser),
  });
}
