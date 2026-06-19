import { db } from "@/lib/db";
import {
  requireAnyPageAccess,
  requireAnyPageAction,
} from "@/lib/security/server-role-access";

const STORE_EMPLOYEE = "store-employee";
const EMPLOYEE_PATHS = ["/employees", "/backoffice/employees"];

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

export async function GET(request) {
  const permissionError = await requireAnyPageAccess(request, EMPLOYEE_PATHS);
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
  const permissionError = await requireAnyPageAction(
    request,
    EMPLOYEE_PATHS,
    "createEmployee"
  );
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
    `SELECT id, user_type FROM roles WHERE role_key = ? LIMIT 1`,
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
    [
      firstName,
      lastName,
      email,
      phone,
      avatar,
      roleRows[0].id,
      roleRows[0].user_type,
    ]
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
