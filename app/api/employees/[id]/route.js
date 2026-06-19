import { db } from "@/lib/db";
import { requireAnyPageAction } from "@/lib/security/server-role-access";

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

async function getStoreEmployee(id) {
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
    WHERE u.id = ?
      AND r.role_key = ?
      AND u.deleted_at IS NULL
    LIMIT 1
    `,
    [id, STORE_EMPLOYEE]
  );

  return rows[0] ?? null;
}

export async function PUT(request, { params }) {
  const permissionError = await requireAnyPageAction(
    request,
    EMPLOYEE_PATHS,
    "editEmployee"
  );
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

export async function PATCH(request, { params }) {
  const permissionError = await requireAnyPageAction(
    request,
    EMPLOYEE_PATHS,
    "editEmployee"
  );
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
  const action = String(body.action ?? "");

  if (action !== "disable" && action !== "enable") {
    return Response.json(
      { message: "Unsupported employee action." },
      { status: 400 }
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

  const updatedEmployee = await getStoreEmployee(id);

  return Response.json({
    message: `Employee ${action}d successfully.`,
    employee: formatEmployee(updatedEmployee),
  });
}

export async function DELETE(request, { params }) {
  const permissionError = await requireAnyPageAction(
    request,
    EMPLOYEE_PATHS,
    "deleteEmployee"
  );
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

  const disabledEmployee = await getStoreEmployee(id);

  return Response.json({
    message: "Employee disabled successfully.",
    employee: formatEmployee(disabledEmployee),
  });
}
