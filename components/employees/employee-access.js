"use client"

import { useSyncExternalStore } from "react"

export const employeeRoles = ["Owner", "Teritory Manager", "Store Manager", "Department Manager", "Employee"]

// Login API `roles` code -> role name
export const roleCodeMap = {
  O: "Owner",
  T: "Teritory Manager",
  S: "Store Manager",
  D: "Department Manager",
  E: "Employee",
}
function subscribe(callback) {
  window.addEventListener("storage", callback)
  return () => window.removeEventListener("storage", callback)
}
const readRoleCode = () => localStorage.getItem("roles") ?? ""
const readMobile = () => (localStorage.getItem("mobileNumber") ?? "").replace(/\D/g, "")

export function getEmployeeAccess(roleCode) {
  const role = roleCodeMap[String(roleCode ?? "").toUpperCase()] ?? ""
  const index = employeeRoles.indexOf(role)
  // A role can add/edit/delete only the roles below it
  return { role, allowedRoles: index >= 0 ? employeeRoles.slice(index + 1) : [] }
}

export function useEmployeeAccess() {
  const roleCode = useSyncExternalStore(subscribe, readRoleCode, () => "")
  const loginNumber = useSyncExternalStore(subscribe, readMobile, () => "")
  return { loginNumber, roleCode, ...getEmployeeAccess(roleCode) }
}