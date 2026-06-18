import { db } from "@/lib/db";

function formatRole(row) {
  return {
    id: row.id,
    key: row.role_key,
    name: row.role_name,
    userType: row.user_type,
  };
}

export async function GET() {
  const [rows] = await db.execute(
    `
    SELECT id, role_key, role_name, user_type
    FROM roles
    ORDER BY role_name ASC
    `
  );

  return Response.json({
    roles: rows.map(formatRole),
  });
}
