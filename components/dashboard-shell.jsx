"use client";

import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";

import { AppShell } from "@/components/app-shell";

export function DashboardShell({ children }) {
  const pathname = usePathname();
  const t = useTranslations("dashboard");
  const isCatalogPage = pathname === "/catalog" || pathname.startsWith("/catalog/");
  const isBackoffice = pathname === "/backoffice" || pathname.startsWith("/backoffice/");
  const backofficeRoute = pathname === "/backoffice" ? "/backoffice/overview" : pathname;

  if (isBackoffice) {
    const backofficeTitles = {
      "/backoffice/overview": {
        title: "Backoffice Overview",
        description: "Review internal activity and operational status",
      },
      "/backoffice/orders": {
        title: "Backoffice Orders",
        description: "Review and manage customer order activity",
      },
      "/backoffice/catalog": {
        title: "Backoffice Catalog",
        description: "Browse products, pricing, and availability",
      },
      "/backoffice/users": {
        title: t("users.title"),
        description: t("users.description"),
      },
      "/backoffice/employees": {
        title: t("employees.title"),
        description: t("employees.description"),
      },
      "/backoffice/roles-permissions": {
        title: "Roles and Permissions",
        description: "Review access rules and role-based capabilities",
      },
      "/backoffice/profile": {
        title: t("profile.title"),
        description: t("profile.description"),
      },
    };
    const page =
      backofficeTitles[backofficeRoute] ??
      (backofficeRoute.startsWith("/backoffice/catalog/")
        ? backofficeTitles["/backoffice/catalog"]
        : backofficeTitles["/backoffice/overview"]);

    return (
      <AppShell
        title={page.title}
        description={page.description}
      >
        {children}
      </AppShell>
    );
  }

  const title =
    pathname === "/"
      ? t("overview.title")
      : isCatalogPage
        ? t("catalog.title")
        : pathname === "/order-guide"
          ? t("orderGuide.title")
          : pathname === "/my-orders"
            ? t("myOrders.title")
            : pathname === "/users"
              ? t("users.title")
            : pathname === "/profile"
              ? t("profile.title")
              : pathname === "/messages"
                ? t("messages.title")
                  : pathname === "/employees"
                    ? t("employees.title")
                  : t("overview.title");
  const description =
    pathname === "/"
      ? t("overview.description")
      : isCatalogPage
        ? t("catalog.description")
        : pathname === "/order-guide"
          ? t("orderGuide.description")
          : pathname === "/my-orders"
            ? t("myOrders.description")
            : pathname === "/users"
              ? t("users.description")
            : pathname === "/profile"
              ? t("profile.description")
              : pathname === "/messages"
                ? t("messages.description")
                  : pathname === "/employees"
                    ? t("employees.description")
                  : t("overview.description");

  return (
    <AppShell
      title={title}
      description={description}
    >
      {children}
    </AppShell>
  );
}
