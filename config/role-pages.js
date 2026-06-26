import rolePagesConfig from "./role-pages.json";

export const ROLE_PAGES = rolePagesConfig.pages;
export const ROLE_PERMISSIONS = rolePagesConfig.permissions;
export const ROLE_MENUS = rolePagesConfig.menus;
export const ROLE_FOOTER_MENUS = rolePagesConfig.footerMenus;
export const ROLE_DEFAULT_ROUTES = rolePagesConfig.defaultRoutes;

function asArray(value) {
  return Array.isArray(value) ? value : [];
}

function normalizeRoute(route) {
  if (typeof route === "string") return route;
  if (route && typeof route.path === "string") return route.path;

  return null;
}

function pathMatches(configuredPath, pathname, matchPrefix) {
  if (!configuredPath) return false;

  return configuredPath === "/"
    ? pathname === "/"
    : pathname === configuredPath ||
        (matchPrefix && pathname.startsWith(`${configuredPath}/`));
}

function getPagePathForArea(page, area) {
  return normalizeRoute(page.routes?.[area]);
}

function getPageAliasesForArea(page, area) {
  return asArray(page.aliases?.[area]).map(normalizeRoute).filter(Boolean);
}

function getPermission(role) {
  return ROLE_PERMISSIONS[role] ?? null;
}

function roleCanUsePageInArea(role, pageId, area) {
  const permission = getPermission(role);

  return Boolean(
    permission &&
      permission.areas?.includes(area) &&
      permission.pages?.includes(pageId),
  );
}

function roleCanUseAction(role, action) {
  return Boolean(action && getPermission(role)?.actions?.includes(action));
}

function getPageAreas(page) {
  return Object.keys(page.routes ?? {});
}

function createVisiblePage(page, area) {
  return {
    ...page,
    area,
    path: getPagePathForArea(page, area),
  };
}

export function getDefaultRouteForRole(role) {
  return ROLE_DEFAULT_ROUTES[role] ?? null;
}

export function getVisiblePagesForRole(role, options = {}) {
  const { area, nav, footerNav } = options;

  if (!role) return [];

  const areas = area ? [area] : asArray(getPermission(role)?.areas);

  return areas.flatMap((currentArea) => {
    const pages = ROLE_PAGES.filter(
      (page) =>
        getPagePathForArea(page, currentArea) &&
        roleCanUsePageInArea(role, page.id, currentArea),
    );

    if (nav === true || footerNav === true) {
      const configuredMenus = footerNav === true ? ROLE_FOOTER_MENUS : ROLE_MENUS;
      const menuPageIds = configuredMenus[currentArea] ?? pages.map((page) => page.id);

      return menuPageIds
        .map((pageId) => pages.find((page) => page.id === pageId))
        .filter(Boolean)
        .map((page) => createVisiblePage(page, currentArea));
    }

    return pages.map((page) => createVisiblePage(page, currentArea));
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

  for (const page of ROLE_PAGES) {
    for (const area of getPageAreas(page)) {
      if (role && !roleCanUsePageInArea(role, page.id, area)) continue;

      const primaryPath = getPagePathForArea(page, area);
      const aliases = getPageAliasesForArea(page, area);
      const matchesPrimary = pathMatches(primaryPath, pathname, page.matchPrefix);
      const matchesAlias = aliases.some((alias) =>
        pathMatches(alias, pathname, page.matchPrefix),
      );

      if (matchesPrimary || matchesAlias) {
        return createVisiblePage(page, area);
      }
    }
  }

  return null;
}

export function getPageActionsForRole(role, pathname) {
  const page = findPageForPath(pathname, { role });

  if (!page) return [];

  return asArray(getPermission(role)?.actions);
}

export function canRoleUsePageAction(role, pathname, action) {
  const page = findPageForPath(pathname, { role });

  return Boolean(page && roleCanUseAction(role, action));
}

export function getRolesForPageAction(pathname, action) {
  return Object.entries(ROLE_PERMISSIONS)
    .filter(([role]) => canRoleUsePageAction(role, pathname, action))
    .map(([role]) => role);
}
