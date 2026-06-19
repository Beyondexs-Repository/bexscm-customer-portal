import { cookies } from "next/headers"

import { DashboardShell } from "@/components/dashboard-shell";

export default async function BackofficeLayout({ children }) {
  const cookieStore = await cookies()
  const initialRole = cookieStore.get("aloha-login-role")?.value ?? ""

  return <DashboardShell initialRole={initialRole}>{children}</DashboardShell>;
}
