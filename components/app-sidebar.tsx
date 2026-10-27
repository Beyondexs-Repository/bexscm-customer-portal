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


const navKeys: Record<string, string> = {
  overview: "overview",
  "order-guide": "orderGuide",
  catalog: "catalog",
  "my-orders": "myOrders",
  metrics: "metrics",
  invoices: "invoices",
  messages: "messages",
  employees: "employees",
  users: "users",
};

export function AppSidebar(props: React.ComponentProps<typeof Sidebar>) {
   const t = useTranslations("nav");
  const routeGroup = routes.customer
  const pageIcons: Record<string, React.ReactNode> = {
    overview: <RxDashboard className="text-blue-600 dark:text-blue-400" />,
    "order-guide": <Star className="text-yellow-600 dark:text-yellow-400" />,
    catalog: <BookOpenIcon className="text-indigo-600 dark:text-indigo-400" />,
    "my-orders": <LuNotepadText className="text-orange-600 dark:text-orange-400" />,
    invoices: <ReceiptTextIcon className="text-teal-600 dark:text-teal-400" />,
    messages: <MessageCircle className="text-sky-600 dark:text-sky-400" />,
    metrics: <ChartNoAxesCombined className="text-violet-600 dark:text-violet-400" />,
    employees: <Users className="text-emerald-600 dark:text-emerald-400" />,
    orders: <ClipboardListIcon className="text-orange-600 dark:text-orange-400" />,
    "roles-permissions": <ShieldCheckIcon className="text-violet-600 dark:text-violet-400" />,
    profile: <UserRoundIcon className="text-cyan-600 dark:text-cyan-400" />,
    promotions: <MegaphoneIcon className="text-rose-600 dark:text-rose-400" />,
  }
  const navMain = routeGroup.routes.map((page) => ({
    // title: page.title,
     title: navKeys[page.id] ? t(navKeys[page.id]) : page.title,
    url: page.path,
    icon: pageIcons[page.id] ?? <CircleIcon className="text-slate-600 dark:text-slate-400" />,
  }))



  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navMain} />
      </SidebarContent>
      <SidebarFooter>
        <LocationSwitcher />
        <Separator className="my-1" />
        <div className="flex flex-col gap-0.5">
          <LocaleSwitcher />
          <ModeToggle />
        </div>
        <Separator className="my-1" />
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
