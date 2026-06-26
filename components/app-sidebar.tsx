"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";

import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import { TeamSwitcher } from "@/components/team-switcher";
import { LocaleSwitcher } from "@/components/locale-switcher";
import { ModeToggle } from "@/components/mode-toggle";
import { getVisiblePagesForRole } from "@/config/role-pages";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import {
  GalleryVerticalEndIcon,
  AudioLinesIcon,
  TerminalIcon,
  CircleIcon,
  Star,
  MessageCircle,
  Users,
  UserCog,
  ShieldCheckIcon,
  BookOpenIcon,
  ClipboardListIcon,
} from "lucide-react";
import { RxDashboard } from "react-icons/rx";
import { LuNotepadText } from "react-icons/lu";

// This is sample data.
const data = {
  user: {
    name: "Crate Inc.",
    avatar: "",
  }
};

function getPageTitle(t: (key: string) => string, page: { titleKey?: string; title: string }) {
  if (!page.titleKey) return page.title;

  try {
    return t(page.titleKey);
  } catch {
    return page.title;
  }
}

type AppSidebarProps = React.ComponentProps<typeof Sidebar> & {
  initialRole?: string
  initialProfile?: {
    firstName?: string
    lastName?: string
    phone?: string
    avatar?: string
    roleName?: string
    roleKey?: string
  } | null
}

export function AppSidebar({
  initialRole = "",
  initialProfile = null,
  ...props
}: AppSidebarProps) {
  const pathname = usePathname()
  const t = useTranslations("nav")
  const isBackoffice = pathname === "/backoffice" || pathname.startsWith("/backoffice/")
  const effectiveRole = initialRole
  const pageIcons: Record<string, React.ReactNode> = {
    overview: <RxDashboard />,
    "order-guide": <Star />,
    catalog: <BookOpenIcon />,
    "my-orders": <LuNotepadText />,
    messages: <MessageCircle />,
    employees: <Users />,
    users: <UserCog />,
    orders: <ClipboardListIcon />,
    "roles-permissions": <ShieldCheckIcon />,
  }
  const navMain = getVisiblePagesForRole(effectiveRole, {
    area: isBackoffice ? "backoffice" : "customer",
    nav: true,
  }).map((page) => ({
    title: getPageTitle(t, page),
    url: page.path,
    icon: pageIcons[page.id] ?? <CircleIcon />,
  }))

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navMain} label={t("main")} />
      </SidebarContent>
      <SidebarFooter>
        <LocaleSwitcher />
        <ModeToggle />
        <Separator className="my-1" />
        <NavUser user={data.user} initialProfile={initialProfile} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
