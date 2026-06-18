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
  },
  teams: [
    {
      name: "Acme Inc",
      logo: <GalleryVerticalEndIcon />,
      plan: "Enterprise",
    },
    {
      name: "Acme Corp.",
      logo: <AudioLinesIcon />,
      plan: "Startup",
    },
    {
      name: "Evil Corp.",
      logo: <TerminalIcon />,
      plan: "Free",
    },
  ],
};

type AppSidebarProps = React.ComponentProps<typeof Sidebar> & {
  initialRole?: string
}

export function AppSidebar({ initialRole = "", ...props }: AppSidebarProps) {
  const pathname = usePathname()
  const t = useTranslations("nav")
  const isBackoffice = pathname === "/backoffice" || pathname.startsWith("/backoffice/")
  const effectiveRole =
    initialRole || (isBackoffice ? "global-admin" : "store-employee")
  const pageIcons: Record<string, React.ReactNode> = {
    "customer-overview": <RxDashboard />,
    "customer-order-guide": <Star />,
    "customer-catalog": <BookOpenIcon />,
    "customer-my-orders": <LuNotepadText />,
    "customer-messages": <MessageCircle />,
    "customer-employees": <Users />,
    "backoffice-overview": <RxDashboard />,
    "backoffice-orders": <ClipboardListIcon />,
    "backoffice-catalog": <BookOpenIcon />,
    "backoffice-users": <UserCog />,
    "backoffice-employees": <Users />,
    "backoffice-roles-permissions": <ShieldCheckIcon />,
  }
  const navMain = getVisiblePagesForRole(effectiveRole, {
    area: isBackoffice ? "backoffice" : "customer",
    nav: true,
  }).map((page) => ({
    title: page.titleKey ? t(page.titleKey) : page.title,
    url: page.path,
    icon: pageIcons[page.id],
  }))

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navMain} label={t("main")} />
      </SidebarContent>
      <SidebarFooter>
        <LocaleSwitcher />
        <ModeToggle />
        <Separator className="my-1" />
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
