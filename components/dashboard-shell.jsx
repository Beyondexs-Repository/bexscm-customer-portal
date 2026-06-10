"use client";

import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";

import { AppShell } from "@/components/app-shell";

export function DashboardShell({ children }) {
  const pathname = usePathname();
  const t = useTranslations("dashboard");
  const meta =
    pathname === "/"
      ? t.raw("overview")
      : pathname.startsWith("/catalog/")
        ? t.raw("catalog")
        : pathname === "/order-guide"
          ? t.raw("orderGuide")
          : pathname === "/my-orders"
            ? t.raw("myOrders")
            : pathname === "/profile"
              ? t.raw("profile")
              : pathname === "/messages"
                ? t.raw("messages")
                : pathname === "/employees"
                  ? t.raw("employees")
                  : t.raw("overview");

  return (
    <AppShell title={meta.title} description={meta.description}>
      {children}
    </AppShell>
  );
}
