"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BookOpenIcon,
  ClipboardListIcon,
  LayoutDashboardIcon,
  MessageCircleIcon,
  StarIcon,
} from "lucide-react";

import { cn } from "@/lib/utils";

const footerNavItems = [
  {
    title: "Overview",
    url: "/",
    icon: LayoutDashboardIcon,
  },
  {
    title: "Order Guide",
    url: "/order-guide",
    icon: StarIcon,
  },
  {
    title: "Catalog",
    url: "/catalog",
    icon: BookOpenIcon,
  },
  {
    title: "My Orders",
    url: "/my-orders",
    icon: ClipboardListIcon,
  },
  {
    title: "Chat",
    url: "/messages",
    icon: MessageCircleIcon,
  },
];

export function FooterNav() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Mobile primary navigation"
      className="fixed inset-x-0 bottom-0 z-40 border-t bg-background/95 px-2 pb-[calc(env(safe-area-inset-bottom)+0.5rem)] pt-2 shadow-[0_-8px_24px_rgba(15,23,42,0.08)] backdrop-blur md:hidden"
    >
      <div className="grid grid-cols-5 items-end gap-1">
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
                "flex min-h-14 flex-col items-center justify-center gap-1 rounded-md px-1 text-[10px] font-medium leading-tight text-muted-foreground transition-colors hover:bg-primary/10 hover:text-primary active:bg-primary/10 active:text-primary focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
                isActive && "bg-primary/10 text-primary",
              )}
            >
              <Icon className="size-5 shrink-0" aria-hidden="true" />
              <span className="max-w-full truncate">{item.title}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
