"use client"

import { useState } from "react"
import { useEmployeeAccess } from "./employee-access"
import { Network, Plus, Search, Table2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import EmpChart from "./EmpChart"
import employeeData from "./employees.json"
import EmployeeForm, { managerIds } from "./EmployeeForm"
import { AlertDialog } from "radix-ui"
import EmpTable from "./EmpTable"

export default function Employees() {
  const { allowedRoles } = useEmployeeAccess()
  const [view, setView] = useState("table")
  const [employees, setEmployees] = useState(() => employeeData.map((employee) => ({ ...employee, status: "Active" })))
  const [form, setForm] = useState(null)
  const [deleting, setDeleting] = useState(null)

  function saveEmployee(employee) {
    setEmployees((current) => current.some((item) => item.id === employee.id)
      ? current.map((item) => item.id === employee.id ? employee : item)
      : [...current, employee])
    setForm(null)
  }

  function deleteEmployee() {
    if (!deleting || !allowedRoles.includes(deleting.role)) return
    setEmployees((current) => current.filter((item) => item.id !== deleting.id).map((item) => ({ ...item, managerIds: managerIds(item).filter((id) => id !== deleting.id), managerId: null })))
    setDeleting(null)
  }

  return (
    <main className="space-y-5 p-4">
      <section className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-md">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input className="pl-9" placeholder="Search employees..." />
        </div>
        <div className="flex shrink-0 flex-wrap items-center gap-3">
          {/* <span className="text-sm text-muted-foreground">View</span> */}
          <div role="group" aria-label="Employee view" className="flex items-center rounded-lg border bg-muted/40 p-1">
            <Button
              variant={view === "chart" ? "secondary" : "ghost"}
              size="icon-sm"
              aria-label="Chart view"
              title="Chart view"
              aria-pressed={view === "chart"}
              onClick={() => setView("chart")}
              className={view === "chart" ? "shadow-sm" : "text-muted-foreground"}
            >
              <Network className="size-4" />
            </Button>
            <span aria-hidden="true" className="mx-1 h-4 w-px bg-border" />
            <Button
              variant={view === "table" ? "secondary" : "ghost"}
              size="icon-sm"
              aria-label="Table view"
              title="Table view"
              aria-pressed={view === "table"}
              onClick={() => setView("table")}
              className={view === "table" ? "shadow-sm" : "text-muted-foreground"}
            >
              <Table2 className="size-4" />
            </Button>
          </div>
          {allowedRoles.length > 0 && <Button onClick={() => setForm({ employee: null })}>
            <Plus className="size-4" />
            Add Employee
          </Button>}
        </div>
      </section>
      {view === "chart" ? <EmpChart employees={employees} onEdit={(employee) => setForm({ employee })} onDelete={setDeleting} /> : <EmpTable employees={employees} onEdit={(employee) => setForm({ employee })} onDelete={setDeleting} />}
      {form && allowedRoles.length > 0 && (!form.employee || allowedRoles.includes(form.employee.role)) && <EmployeeForm employee={form.employee} employees={employees} onClose={() => setForm(null)} onSave={saveEmployee} />}
      <AlertDialog.Root open={!!deleting && allowedRoles.includes(deleting.role)} onOpenChange={(open) => !open && setDeleting(null)}>
        <AlertDialog.Portal>
          <AlertDialog.Overlay className="fixed inset-0 z-50 bg-black/50" />
          <AlertDialog.Content className="fixed left-1/2 top-1/2 z-50 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 space-y-4 rounded-lg border bg-background p-6 shadow-lg">
            <AlertDialog.Title className="text-lg font-semibold">Delete employee?</AlertDialog.Title>
            <AlertDialog.Description className="text-sm text-muted-foreground">Delete {deleting?.name}? Their reporting links will be removed. Employees who report to them will be kept.</AlertDialog.Description>
            <div className="flex justify-end gap-2">
              <AlertDialog.Cancel asChild><Button variant="outline">Cancel</Button></AlertDialog.Cancel>
              <AlertDialog.Action asChild><Button variant="destructive" onClick={deleteEmployee}>Confirm</Button></AlertDialog.Action>
            </div>
          </AlertDialog.Content>
        </AlertDialog.Portal>
      </AlertDialog.Root>
    </main>
  )
}
