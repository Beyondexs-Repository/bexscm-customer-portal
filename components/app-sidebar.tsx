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

function getCookieValue(name: string) {
  if (typeof document === "undefined") return "";

  return (
    document.cookie
      .split("; ")
      .find((cookie) => cookie.startsWith(`${name}=`))
      ?.split("=")[1] ?? ""
  );
}

function getLoginRole() {
  return decodeURIComponent(getCookieValue("aloha-login-role"));
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname()
  const t = useTranslations("nav")
  const isBackoffice = pathname === "/backoffice" || pathname.startsWith("/backoffice/")
  const [role, setRole] = React.useState(getLoginRole)

  React.useEffect(() => {
    setRole(getLoginRole())
  }, [pathname])

  const effectiveRole = role || (isBackoffice ? "global-admin" : "store-employee")
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
