"use client";

import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";

import { AppShell } from "@/components/app-shell";

export function DashboardShell({ children }) {
  const pathname = usePathname();
  const t = useTranslations("dashboard");
  const isCatalogPage = pathname === "/catalog" || pathname.startsWith("/catalog/");
  const title =
    pathname === "/"
      ? t("overview.title")
      : isCatalogPage
        ? t("catalog.title")
        : pathname === "/order-guide"
          ? t("orderGuide.title")
          : pathname === "/my-orders"
            ? t("myOrders.title")
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
            : pathname === "/profile"
              ? t("profile.description")
              : pathname === "/messages"
                ? t("messages.description")
                : pathname === "/employees"
                  ? t("employees.description")
                  : t("overview.description");

  return (
    <AppShell title={title} description={description}>
      {children}
    </AppShell>
  );
}
