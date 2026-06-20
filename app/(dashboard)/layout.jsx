import { cookies } from "next/headers"

import { DashboardShell } from "@/components/dashboard-shell"
import { getCurrentProfile } from "@/lib/server-profile"

export default async function DashboardLayout({ children }) {
  const cookieStore = await cookies()
  const initialProfile = await getCurrentProfile(cookieStore)
  const initialRole =
    initialProfile?.roleKey ??
    cookieStore.get("aloha-login-role")?.value ??
    ""

  return (
    <DashboardShell initialRole={initialRole} initialProfile={initialProfile}>
      {children}
    </DashboardShell>
  )
}
