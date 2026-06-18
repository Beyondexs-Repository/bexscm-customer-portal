import { db } from "@/lib/db";

const STORE_MANAGER = "store-manager";
const STORE_EMPLOYEE = "store-employee";
const EMPLOYEE_MANAGER_ROLES = new Set([
  STORE_MANAGER,
  "global-admin",
  "application-admin",
]);
const EMPLOYEE_VIEWER_ROLES = new Set([
  ...EMPLOYEE_MANAGER_ROLES,
  STORE_EMPLOYEE,
]);

function normalizePhone(value) {
  return String(value ?? "").replace(/\D/g, "");
}

function formatEmployee(row) {
  return {
    id: row.id,
    firstName: row.first_name,
    lastName: row.last_name,
    email: row.email,
    contact: row.phone,
    avatarImage: row.avatar ?? "",
    status: row.is_active ? "active" : "inactive",
  };
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

async function requireEmployeeManager(request) {
  const role = await getLoginRole(request);

  if (!EMPLOYEE_MANAGER_ROLES.has(role)) {
    return Response.json(
      { message: "Only employee managers can manage employees." },
      { status: 403 }
    );
  }

  return null;
}

async function requireEmployeeViewer(request) {
  const role = await getLoginRole(request);

  if (!EMPLOYEE_VIEWER_ROLES.has(role)) {
    return Response.json(
      { message: "Only employee viewers can view employees." },
      { status: 403 }
    );
  }

  return null;
}

export async function GET(request) {
  const permissionError = await requireEmployeeViewer(request);
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
      u.is_active
    FROM users u
    INNER JOIN roles r ON u.role_id = r.id
    WHERE r.role_key = ?
      AND u.deleted_at IS NULL
    ORDER BY u.id DESC
    `,
    [STORE_EMPLOYEE]
  );

  return Response.json({
    employees: rows.map(formatEmployee),
  });
}

export async function POST(request) {
  const permissionError = await requireEmployeeManager(request);
  if (permissionError) return permissionError;

  const body = await request.json().catch(() => ({}));

  const firstName = String(body.firstName ?? "").trim();
  const lastName = String(body.lastName ?? "").trim();
  const email = String(body.email ?? "").trim();
  const phone = normalizePhone(body.contact ?? body.phone);
  const avatar = String(body.avatarImage ?? body.avatar ?? "");

  if (!firstName || !lastName || !email || !phone) {
    return Response.json(
      { message: "First name, last name, email, and phone are required." },
      { status: 400 }
    );
  }

  const [roleRows] = await db.execute(
    `SELECT id FROM roles WHERE role_key = ? LIMIT 1`,
    [STORE_EMPLOYEE]
  );

  if (!roleRows[0]) {
    return Response.json(
      { message: "Store Employee role not found." },
      { status: 500 }
    );
  }

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
    VALUES (?, ?, ?, ?, ?, ?, ?, TRUE)
    `,
    [firstName, lastName, email, phone, avatar, roleRows[0].id, "customer"]
  );

  const [rows] = await db.execute(
    `
    SELECT id, first_name, last_name, email, phone, avatar, is_active
    FROM users
    WHERE id = ?
    LIMIT 1
    `,
    [result.insertId]
  );

  return Response.json(
    { employee: formatEmployee(rows[0]) },
    { status: 201 }
  );
}
