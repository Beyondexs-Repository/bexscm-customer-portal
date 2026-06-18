import { db } from "@/lib/db";

const USER_MANAGER_ROLES = new Set(["global-admin", "application-admin"]);
const CUSTOMER_ROLE_KEYS = new Set(["store-manager", "store-employee"]);

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
    userType: getUserType(row.role_key),
    status: isRemoved ? "removed" : row.is_active ? "active" : "inactive",
    isActive: Boolean(row.is_active) && !isRemoved,
    isRemoved,
  };
}

function getUserType(roleKey) {
  return CUSTOMER_ROLE_KEYS.has(roleKey) ? "customer" : "internal";
}

function decodeCookieValue(value) {
  try {
    return decodeURIComponent(value ?? "");
  } catch {
    return value ?? "";
  }
}

function getLoginUserId(request) {
  const userId = Number(
    decodeCookieValue(request.cookies.get("aloha-login-user-id")?.value)
  );

  return Number.isInteger(userId) && userId > 0 ? userId : null;
}

async function getLoginRole(request) {
  const userId = getLoginUserId(request);

  if (!userId) return "";

  const [rows] = await db.execute(
    `
    SELECT r.role_key
    FROM users u
    INNER JOIN roles r ON u.role_id = r.id
    WHERE u.id = ?
      AND u.is_active = TRUE
    LIMIT 1
    `,
    [userId]
  );

  return rows[0]?.role_key ?? "";
}

async function requireUserManager(request) {
  const role = await getLoginRole(request);

  if (!USER_MANAGER_ROLES.has(role)) {
    return Response.json(
      { message: "Only administrators can manage users." },
      { status: 403 }
    );
  }

  return null;
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
  const permissionError = await requireUserManager(request);
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
    `SELECT id, role_key FROM roles WHERE id = ? LIMIT 1`,
    [roleId]
  );

  if (!roleRows[0]) {
    return Response.json({ message: "Role not found." }, { status: 404 });
  }

  const userType = getUserType(roleRows[0].role_key);

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
  const permissionError = await requireUserManager(request);
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
  const permissionError = await requireUserManager(request);
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
