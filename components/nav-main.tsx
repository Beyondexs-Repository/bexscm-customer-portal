"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"

export function NavMain({
  items,
  label,
}: {
  items: {
    title: string
    url: string
    icon?: React.ReactNode
    isActive?: boolean
    items?: {
      title: string
      url: string
    }[]
  }[]
  label: string
}) {
  const pathname = usePathname()
  const { isMobile, setOpenMobile } = useSidebar()

  function handleNavClick(
    event: React.MouseEvent<HTMLAnchorElement>,
    isActive: boolean
  ) {
    if (isActive) {
      event.preventDefault()
    }

    if (isMobile) {
      setOpenMobile(false)
    }
  }

  return (
    <SidebarGroup>
      <SidebarGroupLabel>{label}</SidebarGroupLabel>
      <SidebarMenu className="gap-1">
        {items.map((item) => {
          const isActive =
            item.url === "/" || item.url === "/backoffice"
              ? pathname === item.url
              : pathname.startsWith(item.url)

          return (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                asChild
                isActive={isActive}
                tooltip={item.title}
                className="h-11 !py-2 text-sm"
              >
                <Link
                  href={item.url}
                  onClick={(event) => handleNavClick(event, isActive)}
                >
                  {item.icon}
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )
        })}
      </SidebarMenu>
    </SidebarGroup>
  )
}
