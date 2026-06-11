"use client";

import * as React from "react";
import { useTranslations } from "next-intl";

import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import { TeamSwitcher } from "@/components/team-switcher";
import { LocaleSwitcher } from "@/components/locale-switcher";
import { ModeToggle } from "@/components/mode-toggle";
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
  BookOpenIcon,
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

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const t = useTranslations("nav")

  const navMain = [
    {
      title: t("overview"),
      url: "/",
      icon: <RxDashboard />,
      isActive: true,
    },
    {
      title: t("orderGuide"),
      url: "/order-guide",
      icon: <Star />,
      isActive: false,
    },
    {
      title: t("catalog"),
      url: "/catalog",
      icon: <BookOpenIcon />,
    },
    {
      title: t("myOrders"),
      url: "/my-orders",
      icon: <LuNotepadText />,
    },
    {
      title: t("messages"),
      url: "/messages",
      icon: <MessageCircle />,
    },
    {
      title: t("employees"),
      url: "/employees",
      icon: <Users />,
    },
  ]

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
