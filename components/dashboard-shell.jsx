"use client"

import { usePathname } from "next/navigation"

import { AppShell } from "@/components/app-shell"

const routeMeta = {
  "/": {
    title: "Overview",
    description: "Track orders and business operations",
  },
  "/quick-order": {
    title: "Quick Order",
    description: "Build and review guided orders",
  },
  "/catalog": {
    title: "Catalog",
    description: "Browse product catalog",
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
