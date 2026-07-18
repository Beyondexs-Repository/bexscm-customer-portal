"use client";

import * as React from "react";

import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import Image from "next/image";

export function TeamSwitcher() {
  const { isMobile } = useSidebar();


  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <div className="flex h-12 items-center gap-2 rounded-md px-2 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0">
        <div className="flex aspect-square size-8 shrink-0 items-center justify-center overflow-hidden rounded-sm">
          <Image src='/logo/logo.png' alt='Crate Inc' width={32} height={32} className="size-8 object-contain"/>
        </div>
        <div className="grid flex-1 text-left text-sm leading-tight group-data-[collapsible=icon]:hidden">
          <span className="truncate font-medium">Crate Inc.</span>
        </div>
        </div>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
