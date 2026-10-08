"use client"

import { usePathname, useRouter } from "next/navigation"
import { useEffect, useSyncExternalStore } from "react"

import { hasSession, subscribeToSession } from "@/lib/auth"

export function AuthGuard({ children }) {
  const pathname = usePathname()
  const router = useRouter()
  const checked = useSyncExternalStore(subscribeToSession, hasSession, () => false)

  useEffect(() => {
    if (!hasSession()) {
      router.replace("/login")
    }
  }, [pathname, router])

  if (!checked) {
    return null
  }

  return children
}
