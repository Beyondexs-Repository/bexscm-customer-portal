"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import {
  BookOpenIcon,
  CircleIcon,
  ClipboardListIcon,
  LayoutDashboardIcon,
  MessageCircleIcon,
  StarIcon,
  UsersIcon,
  UserCogIcon,
} from "lucide-react";

import { cn } from "@/lib/utils";
import routes from "@/data/routes.json";

export function FooterNav() {
  const pathname = usePathname();
  const t = useTranslations("footerNav");
  const routeGroup = pathname.startsWith(routes.internal.basePath)
    ? routes.internal
    : routes.customer;
  const pageIcons = {
    overview: LayoutDashboardIcon,
    "order-guide": StarIcon,
    catalog: BookOpenIcon,
    "my-orders": ClipboardListIcon,
    messages: MessageCircleIcon,
    orders: ClipboardListIcon,
    employees: UsersIcon,
    users: UserCogIcon,
  };
  const footerNavItems = routeGroup.routes
    .filter((page) => page.footer)
    .map((page) => ({
    title: page.title,
    url: page.path,
    icon: pageIcons[page.id] ?? CircleIcon,
  }));

  return (
    <nav
      aria-label={t("ariaLabel")}
      className="fixed inset-x-0 bottom-0 z-40 border-t bg-background/95 px-2 pb-[calc(env(safe-area-inset-bottom)+0.75rem)] pt-2 shadow-[0_-8px_24px_rgba(15,23,42,0.08)] backdrop-blur md:hidden"
    >
      <div
        className={cn(
          "grid items-stretch gap-1",
          "grid-cols-5",
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
