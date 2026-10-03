"use client"

import { usePathname } from "next/navigation"
import { AuthGuard } from "@/components/auth-guard"
import { DashboardShell } from "@/components/dashboard-shell"
import routes from "@/data/routes.json"

const portalPaths = [...routes.customer.routes.map(route => route.path), "/profile"]

export function PortalLayout({ children }) {
  const pathname = usePathname()
  const isPortalPage = portalPaths.some(path =>
    pathname === path || (path !== "/" && pathname.startsWith(`${path}/`))
  )

  if (!isPortalPage) return children

  return (
    <AuthGuard>
      <DashboardShell>{children}</DashboardShell>
    </AuthGuard>
  )
}
