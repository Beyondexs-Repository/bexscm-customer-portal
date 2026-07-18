import { DashboardShell } from "@/components/dashboard-shell"
import { AuthGuard } from "@/components/auth-guard"

export default function DashboardLayout({ children }) {
  return (
    <AuthGuard>
      <DashboardShell>{children}</DashboardShell>
    </AuthGuard>
  )
}
