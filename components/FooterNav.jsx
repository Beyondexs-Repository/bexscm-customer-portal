"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import {
  BookOpenIcon,
  ClipboardListIcon,
  LayoutDashboardIcon,
  MessageCircleIcon,
  StarIcon,
} from "lucide-react";

import { getVisiblePagesForRole } from "@/config/role-pages";
import { cn } from "@/lib/utils";

export function FooterNav({ initialRole = "" }) {
  const pathname = usePathname();
  const t = useTranslations("footerNav");
  const isBackoffice = pathname === "/backoffice" || pathname.startsWith("/backoffice/");
  const effectiveRole =
    initialRole || (isBackoffice ? "global-admin" : "store-employee");
  const pageIcons = {
    "customer-overview": LayoutDashboardIcon,
    "customer-order-guide": StarIcon,
    "customer-catalog": BookOpenIcon,
    "customer-my-orders": ClipboardListIcon,
    "customer-messages": MessageCircleIcon,
    "backoffice-overview": LayoutDashboardIcon,
    "backoffice-orders": ClipboardListIcon,
    "backoffice-catalog": BookOpenIcon,
  };
  const footerNavItems = getVisiblePagesForRole(effectiveRole, {
    area: isBackoffice ? "backoffice" : "customer",
    footerNav: true,
  }).map((page) => ({
    title: page.titleKey ? t(page.titleKey) : page.title,
    url: page.path,
    icon: pageIcons[page.id],
  }));

  return (
    <nav
      aria-label={t("ariaLabel")}
      className="fixed inset-x-0 bottom-0 z-40 border-t bg-background/95 px-2 pb-[calc(env(safe-area-inset-bottom)+0.75rem)] pt-2 shadow-[0_-8px_24px_rgba(15,23,42,0.08)] backdrop-blur md:hidden"
    >
      <div
        className={cn(
          "grid items-stretch gap-1",
          isBackoffice ? "grid-cols-3" : "grid-cols-5",
        )}
      >
        {footerNavItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            item.url === "/" || item.url === "/backoffice"
              ? pathname === item.url
              : pathname.startsWith(item.url);

          return (
            <Link
              key={item.title}
              href={item.url}
              aria-current={isActive ? "page" : undefined}
              className={cn(
                "flex min-h-16 flex-col items-center justify-center gap-1 rounded-md px-1 py-1 text-[9px] font-medium leading-tight text-muted-foreground transition-colors hover:bg-primary/10 hover:text-primary active:bg-primary/10 active:text-primary focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none sm:text-[10px]",
                isActive && "bg-primary/10 text-primary",
              )}
            >
              <Icon className="size-5 shrink-0" aria-hidden="true" />
              <span className="max-w-full text-center text-pretty line-clamp-2 leading-tight">
                {item.title}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
