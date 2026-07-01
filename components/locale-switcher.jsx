"use client"

import { LanguagesIcon } from "lucide-react"

import { SidebarMenu, SidebarMenuItem } from "@/components/ui/sidebar"

export function LocaleSwitcher() {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <div className="flex h-8 w-full items-center gap-2 overflow-hidden rounded-md p-2 text-sm group-data-[collapsible=icon]:size-8! group-data-[collapsible=icon]:p-2!">
          <LanguagesIcon className="size-4 shrink-0" />
          <span className="truncate group-data-[collapsible=icon]:hidden">Language</span>
          <span className="ml-auto truncate text-muted-foreground group-data-[collapsible=icon]:hidden">English</span>
        </div>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
