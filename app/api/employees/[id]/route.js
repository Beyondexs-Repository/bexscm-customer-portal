import { db } from "@/lib/db";

const STORE_MANAGER = "store-manager";
const STORE_EMPLOYEE = "store-employee";
const EMPLOYEE_MANAGER_ROLES = new Set([
  STORE_MANAGER,
  "global-admin",
  "application-admin",
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

async function getStoreEmployee(id) {
  const [rows] = await db.execute(
    `
    SELECT
      u.id,
      u.first_name,
      u.last_name,
      u.email,
      u.phone,
      u.avatar
    FROM users u
    INNER JOIN roles r ON u.role_id = r.id
    WHERE u.id = ?
      AND r.role_key = ?
    LIMIT 1
    `,
    [id, STORE_EMPLOYEE]
  );

  return rows[0] ?? null;
}

export async function PUT(request, { params }) {
  const permissionError = await requireEmployeeManager(request);
  if (permissionError) return permissionError;

  const { id: employeeId } = await params;
  const id = Number(employeeId);

  if (!Number.isInteger(id) || id <= 0) {
    return Response.json({ message: "Invalid employee id." }, { status: 400 });
  }

  const existingEmployee = await getStoreEmployee(id);

  if (!existingEmployee) {
    return Response.json({ message: "Employee not found." }, { status: 404 });
  }

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

  await db.execute(
    `
    UPDATE users
    SET
      first_name = ?,
      last_name = ?,
      email = ?,
      phone = ?,
      avatar = ?
    WHERE id = ?
    `,
    [firstName, lastName, email, phone, avatar, id]
  );

  const updatedEmployee = await getStoreEmployee(id);

  return Response.json({
    employee: formatEmployee(updatedEmployee),
  });
}

export async function DELETE(request, { params }) {
  const permissionError = await requireEmployeeManager(request);
  if (permissionError) return permissionError;

  const { id: employeeId } = await params;
  const id = Number(employeeId);

  if (!Number.isInteger(id) || id <= 0) {
    return Response.json({ message: "Invalid employee id." }, { status: 400 });
  }

  const existingEmployee = await getStoreEmployee(id);

  if (!existingEmployee) {
    return Response.json({ message: "Employee not found." }, { status: 404 });
  }

  await db.execute(
    `
    UPDATE users
    SET is_active = FALSE
    WHERE id = ?
    `,
    [id]
  );

  return Response.json({
    message: "Employee disabled successfully.",
  });
}
