"use client"

import { usePathname, useRouter } from "next/navigation"
import { useEffect, useState } from "react"

import { hasSession } from "@/lib/auth"

export function AuthGuard({ children }) {
  const pathname = usePathname()
  const router = useRouter()
  const [checked] = useState(() => hasSession())

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
