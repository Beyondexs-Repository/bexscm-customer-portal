"use client";

import * as React from "react";

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
  CircleIcon,
  Star,
  MessageCircle,
  Users,
  ShieldCheckIcon,
  BookOpenIcon,
  ClipboardListIcon,
  MegaphoneIcon,
  ReceiptTextIcon,
  UserRoundIcon,
  ChartNoAxesCombined,
} from "lucide-react";
import { RxDashboard } from "react-icons/rx";
import { LuNotepadText } from "react-icons/lu";
import routes from "@/data/routes.json";
import { LocationSwitcher } from "./location-switcher";

export function AppSidebar(props: React.ComponentProps<typeof Sidebar>) {
  const routeGroup = routes.customer
  const pageIcons: Record<string, React.ReactNode> = {
    overview: <RxDashboard />,
    "order-guide": <Star />,
    catalog: <BookOpenIcon />,
    "my-orders": <LuNotepadText />,
    invoices: <ReceiptTextIcon />,
    messages: <MessageCircle />,
    metrics: <ChartNoAxesCombined />,
    employees: <Users />,
    orders: <ClipboardListIcon />,
    "roles-permissions": <ShieldCheckIcon />,
    profile: <UserRoundIcon />,
    promotions: <MegaphoneIcon />,
  }
  const navMain = routeGroup.routes.map((page) => ({
    title: page.title,
    url: page.path,
    icon: pageIcons[page.id] ?? <CircleIcon />,
  }))

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navMain} label={routeGroup.label} />
      </SidebarContent>
      <SidebarFooter>
        <LocationSwitcher />
        <Separator className="my-1" />
        <LocaleSwitcher />
        <ModeToggle />
        <Separator className="my-1" />
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
