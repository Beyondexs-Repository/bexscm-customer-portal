"use client"

import { useState } from "react"
import locations from "@/data/locations.json"
import EmployeeActions from "./EmployeeActions"
import InvoicePagination from "@/components/invoices/InvoicePagination"
import { useEmployeeAccess } from "./employee-access"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"


export default function EmpTable({ employees = [], onEdit, onDelete }) {
  const { loginNumber } = useEmployeeAccess()
  const [selectedRole, setSelectedRole] = useState("")
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const roles = [...new Set(employees.map((employee) => employee.role))]
  const filteredEmployees = selectedRole
    ? employees.filter((employee) => employee.role === selectedRole)
    : employees
  const totalPages = Math.max(1, Math.ceil(filteredEmployees.length / pageSize))
  const currentPage = Math.min(page, totalPages)
  const start = (currentPage - 1) * pageSize
  const visibleEmployees = filteredEmployees.slice(start, start + pageSize)
  return (
      <Card className="overflow-hidden py-0">
        <CardHeader className="flex flex-col gap-3 border-b px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div className="space-y-1">
          <CardTitle className="text-base">Employees</CardTitle>
          <p className="text-sm text-muted-foreground">
            Team members and their current access status.
          </p>
          </div>
          <select
            aria-label="Select Role"
            className="h-9 w-full rounded-md border bg-background px-2 text-sm sm:w-48"
            value={selectedRole}
            onChange={(event) => {
              setSelectedRole(event.target.value)
              setPage(1)
            }}
          >
            <option value="">Select Role</option>
            {roles.map((role) => (
              <option key={role} value={role}>
                {role === "Department Manager" ? "Dept. Manager" : role}
              </option>
            ))}
          </select>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead className="bg-muted/50 text-xs uppercase text-muted-foreground">
                <tr>
                  <th className="px-6 py-3 font-medium">Employee</th>
                  <th className="px-4 py-3 font-medium">Contact</th>
                  <th className="px-4 py-3 font-medium">Role</th>
                  <th className="px-4 py-3 font-medium">Location</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 text-right font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {visibleEmployees.map((employee) => (
                  <tr key={employee.id} className="hover:bg-muted/30">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="size-9">
                          <AvatarImage src={employee.image} alt={employee.name} /><AvatarFallback className="bg-blue-100 font-semibold text-blue-700 dark:bg-blue-900/40 dark:text-blue-300">{employee.name.split(/\s+/).map((part) => part[0]).slice(0, 2).join("")}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-semibold">{employee.name}</p>
                            {loginNumber && String(employee.phone ?? "").replace(/\D/g, "") === loginNumber && (
                              <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-700 dark:text-emerald-400">
                                You
                              </Badge>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground">{employee.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-muted-foreground">{employee.phone}</td>
                    <td className="px-4 py-4">{employee.role}</td>
                    <td className="px-4 py-4 text-muted-foreground">{locations.find((location) => location.id === employee.locationId)?.name ?? "Not assigned"}</td>
                    <td className="px-4 py-4">
                      <Badge
                        variant="secondary"
                        className={employee.status === "Active" ? "bg-emerald-500/10 text-emerald-600" : ""}
                      >
                        {employee.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-4 text-right">
                      <EmployeeActions employee={employee} onEdit={onEdit} onDelete={onDelete} />
                    </td>
                  </tr>
                ))}
                {!filteredEmployees.length && (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-muted-foreground">
                      No employees found for this role.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="@container flex flex-wrap items-center justify-between gap-3 border-t px-4 py-3 text-sm text-muted-foreground sm:px-6">
            <span>
              Showing {filteredEmployees.length === 0 ? 0 : start + 1}-
              {Math.min(start + pageSize, filteredEmployees.length)} of{" "}
              {filteredEmployees.length} employees
            </span>
            <InvoicePagination
              currentPage={currentPage}
              totalPages={totalPages}
              pageSize={pageSize}
              onPageChange={(nextPage, rows) => {
                setPage(nextPage)
                setPageSize(rows)
              }}
            />
          </div>
        </CardContent>
      </Card>
  )
}
