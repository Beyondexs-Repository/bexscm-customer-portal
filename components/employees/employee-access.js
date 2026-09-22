"use client"

import { useSyncExternalStore } from "react"
import { getLoginNumber, subscribeToSession } from "@/lib/auth"

export const employeeRoles = ["Owner", "Teritory Manager", "Store Manager", "Department Manager", "Employee"]

// Employee UI rules keyed by the phone number entered at login.
export const employeeAccessConfig = {
  "9876543210": { role: "Owner", allowedRoles: ["Teritory Manager", "Store Manager", "Department Manager", "Employee"] },
  "9876543211": { role: "Teritory Manager", allowedRoles: ["Store Manager", "Department Manager", "Employee"] },
  "9876543212": { role: "Store Manager", allowedRoles: ["Department Manager", "Employee"] },
  "9876543213": { role: "Department Manager", allowedRoles: ["Employee"] },
  "9876543214": { role: "Employee", allowedRoles: [] },
}

const noAccess = { role: "", allowedRoles: [] }

export function getEmployeeAccess(number) {
  return employeeAccessConfig[String(number).replace(/\D/g, "")] ?? noAccess
}

export function useEmployeeAccess() {
  const loginNumber = useSyncExternalStore(subscribeToSession, getLoginNumber, () => "")
  return { loginNumber, ...getEmployeeAccess(loginNumber) }
}
