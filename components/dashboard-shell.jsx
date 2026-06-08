"use client"

import { usePathname } from "next/navigation"

import { AppShell } from "@/components/app-shell"

const routeMeta = {
  "/": {
    title: "Overview",
    description: "Track orders and business operations",
  },
  "/order-quide": {
    title: "Order Quide",
    description: "Build and review guided orders",
  },
  "/catalog": {
    title: "Catalog",
    description: "Browse product catalog",
  },
  "/my-orders": {
    title: "My Orders",
    description: "View and manage your orders",
  },
  "/profile": {
    title: "Profile",
    description: "View account details and preferences",
  },
  "/messages": {
    title: "Messages",
    description: "View customer and team messages",
  },
  "/employees": {
    title: "Employees",
    description: "Manage employee records",
  },
}

export function DashboardShell({ children }) {
  const pathname = usePathname()
  const meta =
    routeMeta[pathname] ??
    (pathname.startsWith("/catalog/") ? routeMeta["/catalog"] : routeMeta["/"])

  return (
    <AppShell title={meta.title} description={meta.description}>
      {children}
    </AppShell>
  )
}
