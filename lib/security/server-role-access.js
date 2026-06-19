import { canRoleUsePageAction, canRoleViewPath } from "@/config/role-pages"
import { db } from "@/lib/db"

function decodeCookieValue(value) {
  try {
    return decodeURIComponent(value ?? "")
  } catch {
    return value ?? ""
  }
}

export function getLoginUserId(request) {
  const userId = Number(
    decodeCookieValue(request.cookies.get("aloha-login-user-id")?.value),
  )

  return Number.isInteger(userId) && userId > 0 ? userId : null
}

export async function getRequestRole(request) {
  const userId = getLoginUserId(request)

  if (!userId) return ""

  const [rows] = await db.execute(
    `
    SELECT r.role_key
    FROM users u
    INNER JOIN roles r ON u.role_id = r.id
    WHERE u.id = ?
      AND u.is_active = TRUE
      AND u.deleted_at IS NULL
    LIMIT 1
    `,
    [userId],
  )

  return rows[0]?.role_key ?? ""
}

export async function requirePageAccess(request, pathname) {
  const role = await getRequestRole(request)

  if (!canRoleViewPath(role, pathname)) {
    return Response.json(
      { message: "You do not have permission to access this page." },
      { status: 403 },
    )
  }

  return null
}

export async function requirePageAction(request, pathname, action) {
  const role = await getRequestRole(request)

  if (!canRoleUsePageAction(role, pathname, action)) {
    return Response.json(
      { message: "You do not have permission to perform this action." },
      { status: 403 },
    )
  }

  return null
}

export async function requireAnyPageAccess(request, pathnames) {
  const role = await getRequestRole(request)

  if (!pathnames.some((pathname) => canRoleViewPath(role, pathname))) {
    return Response.json(
      { message: "You do not have permission to access this page." },
      { status: 403 },
    )
  }

  return null
}

export async function requireAnyPageAction(request, pathnames, action) {
  const role = await getRequestRole(request)

  if (
    !pathnames.some((pathname) =>
      canRoleUsePageAction(role, pathname, action),
    )
  ) {
    return Response.json(
      { message: "You do not have permission to perform this action." },
      { status: 403 },
    )
  }

  return null
}
