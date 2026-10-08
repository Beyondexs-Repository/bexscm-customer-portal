"use client"

import { usePathname } from "next/navigation"
import { AuthGuard } from "@/components/auth-guard"
import { AppSidebar } from "@/components/app-sidebar"
import { FooterNav } from "@/components/FooterNav"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import routes from "@/data/routes.json"

const portalPaths = [...routes.customer.routes.map(route => route.path), "/profile"]

export function PortalLayout({ children }) {
  const pathname = usePathname()

  // Standalone public pages
  const isStandalonePage = pathname === "/sms-consent"

  if (isStandalonePage) {
    return children
  }

  const isPortalPage = portalPaths.some(
    path =>
      pathname === path ||
      (path !== "/" && pathname.startsWith(`${path}/`))
  )

  if (!isPortalPage) return children

  return (
    <AuthGuard>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset className="h-svh min-w-0 overflow-hidden">
          <SiteHeader />

          <div
            data-dashboard-scroll
            className="no-scrollbar min-h-0 min-w-0 flex-1 overflow-y-auto pb-[calc(env(safe-area-inset-bottom)+5.75rem)] md:pb-0"
          >
            {children}
          </div>

          <FooterNav />
        </SidebarInset>
      </SidebarProvider>
    </AuthGuard>
  )
}