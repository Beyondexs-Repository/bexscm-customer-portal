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

import { cn } from "@/lib/utils";

export function FooterNav() {
  const pathname = usePathname();
  const t = useTranslations("footerNav");

  const footerNavItems = [
    {
      title: t("overview"),
      url: "/",
      icon: LayoutDashboardIcon,
    },
    {
      title: t("orderGuide"),
      url: "/order-guide",
      icon: StarIcon,
    },
    {
      title: t("catalog"),
      url: "/catalog",
      icon: BookOpenIcon,
    },
    {
      title: t("myOrders"),
      url: "/my-orders",
      icon: ClipboardListIcon,
    },
    {
      title: t("messages"),
      url: "/messages",
      icon: MessageCircleIcon,
    },
  ];

  return (
    <nav
      aria-label={t("ariaLabel")}
      className="fixed inset-x-0 bottom-0 z-40 border-t bg-background/95 px-2 pb-[calc(env(safe-area-inset-bottom)+0.75rem)] pt-2 shadow-[0_-8px_24px_rgba(15,23,42,0.08)] backdrop-blur md:hidden"
    >
      <div className="grid grid-cols-5 items-stretch gap-1">
        {footerNavItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            item.url === "/" ? pathname === "/" : pathname.startsWith(item.url);

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
