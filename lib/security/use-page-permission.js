"use client"

import { usePathname } from "next/navigation"
import { useState } from "react"

import {
  canAccessPageAction,
  getBrowserRole,
} from "@/lib/security/role-access"

export function usePagePermission(action, pathnameOverride) {
  const pathname = usePathname()
  const [role] = useState(getBrowserRole)

  return canAccessPageAction(role, pathnameOverride ?? pathname, action)
}
