"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { Plus, Search } from "lucide-react"
import { useTranslations } from "next-intl"

import { EmployeeActionsMenu } from "@/components/employees/EmployeeActionsMenu"
import { EmployeeFormDialog } from "@/components/employees/EmployeeFormDialog"
import { EmployeesPagination } from "@/components/employees/EmployeesPagination"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"


const DEFAULT_PAGE_SIZE = 10
const EMPLOYEE_MANAGER_ROLES = new Set([
  "store-manager",
  "global-admin",
  "application-admin",
])

function getLoginRole() {
  if (typeof window === "undefined") return ""

  return (
    window.document.cookie
      .split("; ")
      .find((cookie) => cookie.startsWith("aloha-login-role="))
      ?.split("=")[1] ?? ""
  )
}

function getFullName(employee) {
  return `${employee.firstName} ${employee.lastName}`.trim()
}

function getInitials(employee) {
  return `${employee.firstName?.[0] ?? ""}${employee.lastName?.[0] ?? ""}`.toUpperCase()
}

function EmployeesLoadingState() {
  return (
    <div className="flex min-h-[calc(100svh-13rem)] items-center justify-center p-4 md:min-h-[calc(100vh-8rem)] md:p-6">
      <div className="flex flex-col items-center gap-4">
        <div className="size-12 rounded-full border-4 border-primary/20 border-t-primary animate-spin transition-transform" />
        <p className="text-sm font-medium text-muted-foreground">Loading employees...</p>
      </div>
    </div>
  )
}

export default function Employees() {
  const t = useTranslations("employees")
  const [employees, setEmployees] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingEmployee, setEditingEmployee] = useState(null)
  const [loginRole] = useState(getLoginRole)
  const listTopRef = useRef(null)
  const canManageEmployees = EMPLOYEE_MANAGER_ROLES.has(loginRole)

  useEffect(() => {
    let active = true

    async function syncEmployees() {
      try {
        const nextEmployees = await loadEmployees()

        if (active) {
          setEmployees(nextEmployees)
        }
      } catch (error) {
        console.error(error)
      } finally {
        if (active) {
          setIsLoading(false)
        }
      }
    }

    syncEmployees()

    return () => {
      active = false
    }
  }, [])

  const filteredEmployees = useMemo(() => {
    const query = search.toLowerCase().trim()

    return employees.filter((employee) => {
      const fullName = getFullName(employee).toLowerCase()

      return (
        fullName.includes(query) ||
        employee.email.toLowerCase().includes(query) ||
        employee.contact.toLowerCase().includes(query)
      )
    })
  }, [employees, search])

  const totalPages = Math.max(1, Math.ceil(filteredEmployees.length / pageSize))
  const safeCurrentPage = Math.min(currentPage, totalPages)
  const hasEmployees = employees.length > 0

  const paginatedEmployees = filteredEmployees.slice(
    (safeCurrentPage - 1) * pageSize,
    safeCurrentPage * pageSize,
  )

  function scrollListToTop() {
    window.requestAnimationFrame(() => {
      listTopRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      })
    })
  }

  function handlePageChange(page) {
    setCurrentPage(page)
    scrollListToTop()
  }

  function handlePageSizeChange(nextPageSize) {
    setPageSize(nextPageSize)
    setCurrentPage(1)
    scrollListToTop()
  }

  function handleAddEmployee() {
    if (!canManageEmployees) return

    setEditingEmployee(null)
    setDialogOpen(true)
  }

  function handleEditEmployee(employee) {
    if (!canManageEmployees) return

    setEditingEmployee(employee)
    setDialogOpen(true)
  }

  async function handleDeleteEmployee(employeeId) {
    if (!canManageEmployees) return

    await deleteEmployee(employeeId)
    setEmployees((current) =>
      current.filter((employee) => employee.id !== employeeId),
    )
  }

  async function handleSaveEmployee(employeeData) {
    if (!canManageEmployees) return

    if (editingEmployee) {
      const savedEmployee = await updateEmployee(editingEmployee.id, employeeData)

      setEmployees((current) =>
        current.map((employee) =>
          employee.id === editingEmployee.id ? savedEmployee : employee,
        ),
      )
    } else {
      const savedEmployee = await createEmployee(employeeData)

      setEmployees((current) => [
        savedEmployee,
        ...current,
      ])
    }

    setDialogOpen(false)
    setEditingEmployee(null)
  }

  async function loadEmployees() {
  const response = await fetch("/api/employees", {
    cache: "no-store",
    credentials: "same-origin",
  });

  if (!response.ok) {
    throw new Error("Failed to load employees");
  }

  const data = await response.json();
  return data.employees ?? [];
}

async function createEmployee(employeeData) {
  const response = await fetch("/api/employees", {
    method: "POST",
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(employeeData),
  });

  if (!response.ok) {
    throw new Error("Failed to create employee");
  }

  const data = await response.json();
  return data.employee;
}

async function updateEmployee(employeeId, employeeData) {
  const response = await fetch(`/api/employees/${employeeId}`, {
    method: "PUT",
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(employeeData),
  });

  if (!response.ok) {
    throw new Error("Failed to update employee");
  }

  const data = await response.json();
  return data.employee;
}

async function deleteEmployee(employeeId) {
  const response = await fetch(`/api/employees/${employeeId}`, {
    method: "DELETE",
    credentials: "same-origin",
  });

  if (!response.ok) {
    throw new Error("Failed to delete employee");
  }

  return true;
}

  if (isLoading) {
    return <EmployeesLoadingState />
  }

  if (!hasEmployees) {
    return (
      <>
        <div className="flex min-h-[calc(100svh-13rem)] items-center justify-center p-4 md:min-h-[calc(100vh-8rem)] md:p-6">
          <Card className="w-full max-w-xl shadow-sm md:min-h-[320px]">
            <CardHeader className="flex flex-col items-center justify-center pt-8 text-center md:pt-12">
              <CardTitle className="text-2xl font-bold md:text-3xl">
                {t("noEmployeesFound")}
              </CardTitle>
              <CardDescription className="mt-3 max-w-md text-sm leading-relaxed md:mt-4 md:text-base">
                {t("noEmployeesHint")}
              </CardDescription>
            </CardHeader>

            {canManageEmployees && (
              <CardContent className="flex justify-center pb-8 pt-2 md:pb-12 md:pt-4">
                <Button
                  size="lg"
                  onClick={handleAddEmployee}
                  className="w-auto"
                >
                  <Plus className="size-4" />
                  {t("addEmployee")}
                </Button>
              </CardContent>
            )}
          </Card>
        </div>

        {canManageEmployees && (
          <EmployeeFormDialog
            employee={editingEmployee}
            mode={editingEmployee ? "edit" : "add"}
            open={dialogOpen}
            onOpenChange={(nextOpen) => {
              setDialogOpen(nextOpen)
              if (!nextOpen) {
                setEditingEmployee(null)
              }
            }}
            onSave={handleSaveEmployee}
          />
        )}
      </>
    )
  }

  return (
    <div className="space-y-5 p-4">
      <div
        ref={listTopRef}
        className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
      >
        <div className="relative w-full sm:max-w-md">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder={t("searchPlaceholder")}
            value={search}
            onChange={(event) => {
              setSearch(event.target.value)
              setCurrentPage(1)
            }}
            className="h-11 pl-10 pr-4"
          />
        </div>

        {canManageEmployees && (
          <Button
            className="h-11 w-full sm:w-auto"
            onClick={handleAddEmployee}
          >
            <Plus className="size-4" />
            {t("addEmployee")}
          </Button>
        )}
      </div>

      <div className="hidden overflow-hidden rounded-xl border bg-card md:block">
        <table className="w-full">
          <thead>
            <tr className="border-b bg-muted/40">
              <th className="px-5 py-4 text-left text-sm font-semibold">
                {t("employee")}
              </th>
              <th className="px-5 py-4 text-left text-sm font-semibold">
                {t("email")}
              </th>
              <th className="px-5 py-4 text-left text-sm font-semibold">
                {t("contact")}
              </th>
              {canManageEmployees && (
                <th className="px-5 py-4 text-right text-sm font-semibold">
                  {t("actions")}
                </th>
              )}
            </tr>
          </thead>

          <tbody>
            {paginatedEmployees.map((employee) => (
              <tr key={employee.id} className="border-b last:border-0">
                <td className="px-5 py-3">
                  <div className="flex items-center gap-3">
                    <Avatar className="size-10">
                      <AvatarImage
                        src={employee.avatarImage}
                        alt={getFullName(employee)}
                      />
                      <AvatarFallback className="bg-primary/10 font-semibold text-primary">
                        {getInitials(employee)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="font-medium text-sm">
                      {getFullName(employee)}
                    </div>
                  </div>
                </td>
                <td className="px-5 py-3 text-sm">{employee.email}</td>
                <td className="px-5 py-3 text-sm">{employee.contact}</td>
                {canManageEmployees && (
                  <td className="px-5 py-3">
                    <div className="flex justify-end">
                      <EmployeeActionsMenu
                        onDelete={() => handleDeleteEmployee(employee.id)}
                        onEdit={() => handleEditEmployee(employee)}
                      />
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="space-y-3 md:hidden">
        {paginatedEmployees.map((employee) => (
          <div key={employee.id} className="rounded-xl border bg-card p-4">
            <div className="flex items-start gap-3">
              <Avatar className="size-12 shrink-0">
                <AvatarImage
                  src={employee.avatarImage}
                  alt={getFullName(employee)}
                />
                <AvatarFallback className="bg-primary/10 font-semibold text-primary">
                  {getInitials(employee)}
                </AvatarFallback>
              </Avatar>

              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="font-semibold">{getFullName(employee)}</h3>
                  {canManageEmployees && (
                    <EmployeeActionsMenu
                      onDelete={() => handleDeleteEmployee(employee.id)}
                      onEdit={() => handleEditEmployee(employee)}
                    />
                  )}
                </div>
                <p className="mt-2 truncate text-sm text-muted-foreground">
                  {employee.email}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {employee.contact}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredEmployees.length === 0 && (
        <div className="rounded-xl border bg-card p-8 text-center">
          <p className="font-semibold">{t("noEmployeesFound")}</p>
          <p className="mt-1 text-sm text-muted-foreground">
            {t("noEmployeesHint")}
          </p>
        </div>
      )}

      {filteredEmployees.length > 0 && (
        <EmployeesPagination
          currentPage={safeCurrentPage}
          pageSize={pageSize}
          selectedRows={0}
          totalPages={totalPages}
          totalRows={filteredEmployees.length}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
        />
      )}

      {canManageEmployees && (
        <EmployeeFormDialog
          employee={editingEmployee}
          mode={editingEmployee ? "edit" : "add"}
          open={dialogOpen}
          onOpenChange={(nextOpen) => {
            setDialogOpen(nextOpen)
            if (!nextOpen) {
              setEditingEmployee(null)
            }
          }}
          onSave={handleSaveEmployee}
        />
      )}
    </div>
  )
}
