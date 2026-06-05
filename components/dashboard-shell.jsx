"use client"

import { usePathname } from "next/navigation"

import { AppShell } from "@/components/app-shell"

const routeMeta = {
  "/": {
    title: "Overview",
    description: "Track orders and business operations",
  },
  "/order-guide": {
    title: "Order Guide",
    description: "Build and review guided orders",
  },
  "/categories": {
    title: "Categories",
    description: "Browse product categories",
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
  const meta = routeMeta[pathname] ?? routeMeta["/"]

  return (
    <AppShell title={meta.title} description={meta.description}>
      {children}
    </AppShell>
  )
}
