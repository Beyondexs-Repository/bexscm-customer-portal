import { db } from "@/lib/db";

const USER_MANAGER_ROLES = new Set(["global-admin", "application-admin"]);
const CUSTOMER_ROLE_KEYS = new Set(["store-manager", "store-employee"]);

function normalizePhone(value) {
  return String(value ?? "").replace(/\D/g, "");
}

function formatRole(row) {
  return {
    id: row.id,
    key: row.role_key,
    name: row.role_name,
  };
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

async function getRoles() {
  const [rows] = await db.execute(
    `
    SELECT id, role_key, role_name
    FROM roles
    ORDER BY role_name ASC
    `
  );

  return rows.map(formatRole);
}

export async function GET() {
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
    ORDER BY u.id DESC
    `
  );

  const roles = await getRoles();

  return Response.json({
    users: rows.map(formatUser),
    roles,
  });
}

export async function POST(request) {
  const permissionError = await requireUserManager(request);
  if (permissionError) return permissionError;

  const body = await request.json().catch(() => ({}));

  const firstName = String(body.firstName ?? "").trim();
  const lastName = String(body.lastName ?? "").trim();
  const email = String(body.email ?? "").trim();
  const phone = normalizePhone(body.phone);
  const avatar = String(body.avatar ?? "");
  const roleId = Number(body.roleId);
  const isActive = body.status ? body.status === "active" : Boolean(body.isActive ?? true);

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
}
