import rolePagesConfig from "./role-pages.json";

export const ROLE_PAGES = rolePagesConfig.pages;
export const ROLE_DEFAULT_ROUTES = rolePagesConfig.defaultRoutes;

export function getDefaultRouteForRole(role) {
  return ROLE_DEFAULT_ROUTES[role] ?? null;
}

export function getVisiblePagesForRole(role, options = {}) {
  const { area, nav, footerNav } = options;

  if (!role) return [];

  return ROLE_PAGES.filter((page) => {
    if (!page.roles.includes(role)) return false;
    if (area && page.area !== area) return false;
    if (typeof nav === "boolean" && page.nav !== nav) return false;
    if (typeof footerNav === "boolean" && page.footerNav !== footerNav) return false;

    return true;
  });
}

export function canRoleViewPath(role, pathname) {
  return Boolean(findPageForPath(pathname, { role }));
}

export function isConfiguredPagePath(pathname) {
  return Boolean(findPageForPath(pathname));
}

export function findPageForPath(pathname, options = {}) {
  const { role } = options;

  return ROLE_PAGES.find((page) => {
    if (role && !page.roles.includes(role)) return false;

    return (
      page.path === "/"
        ? pathname === "/"
        : pathname === page.path || (page.matchPrefix && pathname.startsWith(`${page.path}/`))
    );
  }) ?? null;
}

export function getPageActionsForRole(role, pathname) {
  const page = findPageForPath(pathname);

  if (!role || !page?.actions) return [];

  return Object.entries(page.actions)
    .filter(([, roles]) => roles.includes(role))
    .map(([action]) => action);
}

export function canRoleUsePageAction(role, pathname, action) {
  const page = findPageForPath(pathname);

  return Boolean(role && action && page?.actions?.[action]?.includes(role));
}

export function getRolesForPageAction(pathname, action) {
  const page = findPageForPath(pathname);

  return page?.actions?.[action] ?? [];
}
