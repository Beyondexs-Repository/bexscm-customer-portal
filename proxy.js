import { NextResponse } from "next/server";
import {
  canRoleViewPath,
  getDefaultRouteForRole,
  isConfiguredPagePath,
} from "@/config/role-pages";
import { db } from "@/lib/db";

const AUTH_COOKIE = "aloha-login-verified";
const USER_ID_COOKIE = "aloha-login-user-id";

const PUBLIC_ROUTES = new Set(["/login"]);

function getAllowedRoute(role) {
  return getDefaultRouteForRole(role);
}

function decodeCookieValue(value) {
  try {
    return decodeURIComponent(value ?? "");
  } catch {
    return value ?? "";
  }
}

function getLoginUserId(request) {
  const userId = Number(decodeCookieValue(request.cookies.get(USER_ID_COOKIE)?.value));

  return Number.isInteger(userId) && userId > 0 ? userId : null;
}

async function getUserRoleFromDb(userId) {
  const [rows] = await db.execute(
    `
    SELECT r.role_key
    FROM users u
    INNER JOIN roles r ON u.role_id = r.id
    WHERE u.id = ?
      AND u.is_active = 1
    LIMIT 1
    `,
    [userId]
  );

  return rows[0]?.role_key ?? null;
}

function redirectTo(pathname, request) {
  return NextResponse.redirect(new URL(pathname, request.url));
}

export async function proxy(request) {
  const { pathname } = request.nextUrl;

  const isVerified =
    request.cookies.get(AUTH_COOKIE)?.value === "true";

  const userId = getLoginUserId(request);
  let role = null;

  if (userId) {
    try {
      role = await getUserRoleFromDb(userId);
    } catch (error) {
      console.error("Proxy role lookup failed:", error);
      role = null;
    }
  }

  const allowedRoute = getAllowedRoute(role);

  const isLoginPage = PUBLIC_ROUTES.has(pathname);
  const isProtectedRoute = isConfiguredPagePath(pathname);

  // Not logged in
  if (isProtectedRoute && (!isVerified || !allowedRoute)) {
    return redirectTo("/login", request);
  }

  // Already logged in
  if (isLoginPage && isVerified && allowedRoute) {
    return redirectTo(allowedRoute, request);
  }

  if (!isProtectedRoute || !role) {
    return NextResponse.next();
  }

  if (!canRoleViewPath(role, pathname)) {
    return redirectTo(allowedRoute, request);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/backoffice/:path*",
    "/order-guide/:path*",
    "/catalog/:path*",
    "/my-orders/:path*",
    "/messages/:path*",
    "/employees/:path*",
    "/profile/:path*",
    "/login",
    "/",
  ],
};
