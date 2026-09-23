"use client"

import { useState } from "react"
import { ChevronDown, Users } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import EmployeeActions from "./EmployeeActions"
import { managerIds } from "./EmployeeForm"
import { cn } from "@/lib/utils"


function EmployeeCard({ employee, selected, onSelect, reportCount, onEdit, onDelete }) {
  const initials = employee.name.split(/\s+/).map((part) => part[0]).slice(0, 2).join("")

  return (
    <div className="relative h-full">
    <button
      type="button"
      aria-pressed={selected}
      onClick={onSelect}
      className={cn(
        "flex h-full w-full items-center gap-3 rounded-lg border bg-card p-4 pr-10 text-left text-card-foreground shadow-sm transition-colors hover:border-primary/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        selected && "border-primary bg-primary/5 ring-1 ring-primary/30",
      )}
    >
      <div className="flex shrink-0 flex-col items-center gap-2">
        <Avatar className="size-16 sm:size-20">
          {employee.image && <AvatarImage src={employee.image} alt={employee.name} />}
          <AvatarFallback className="bg-primary/10 text-xl font-semibold text-primary">{initials}</AvatarFallback>
        </Avatar>
        <span className={cn("text-xs", (employee.status ?? "Active") === "Active" ? "text-green-600 dark:text-green-400" : "text-orange-600 dark:text-orange-400")}>
          {employee.status ?? "Active"}
        </span>
      </div>
      <div className="min-w-0 flex-1 space-y-2">
        <div className="flex items-start justify-between gap-2">
          <p className="min-w-0 flex-1 break-words text-sm font-semibold leading-5">{employee.name}</p>
        </div>
        <Badge variant="secondary">{employee.role}</Badge>
        {employee.email && <p className="break-all text-xs text-muted-foreground">{employee.email}</p>}
        {employee.phone && <p className="text-xs text-muted-foreground">{employee.phone}</p>}
        <p className="text-xs text-muted-foreground">
          {reportCount > 0 ? `${reportCount} direct report${reportCount === 1 ? "" : "s"}` : "No direct reports"}
        </p>
      </div>
    </button>
    <div className="absolute right-1 top-1"><EmployeeActions employee={employee} onEdit={onEdit} onDelete={onDelete} /></div>
    </div>
  )
}

function EmployeeLevel({ level, selectedId, onSelect, reports, onEdit, onDelete }) {
  const [open, setOpen] = useState(true)

  return (
    <section className="space-y-3" aria-label={level.title}>
      <div
        className="flex w-full items-center justify-between gap-3 border-b px-1 py-3 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <span className="flex min-w-0 flex-wrap items-center gap-2">
          <Users aria-hidden="true" className="size-4 text-muted-foreground" />
          <span className="text-sm font-semibold">{level.title}</span>
          <Badge variant="secondary" className="text-xs">{level.members.length}</Badge>
          <span className="basis-full text-xs text-muted-foreground">{level.parent ? `Reporting to ${level.parent.name}` : level.title === "Owners" ? "Organization owners." : "Assign an existing reporting manager to these employees."}</span>
        </span>
        <Button variant="outline" size="sm" aria-expanded={open} onClick={() => setOpen((current) => !current)}>
          {open ? "Collapse" : "Expand"}
          <ChevronDown className={cn("size-4 shrink-0 transition-transform", !open && "-rotate-90")} />
        </Button>
      </div>
      {open && (
        <div className="grid grid-cols-1 gap-3 @min-[640px]:grid-cols-2 @min-[1024px]:grid-cols-3 @min-[1280px]:grid-cols-4">
          {level.members.map((employee) => (
            <div key={employee.id} className="min-w-0 w-full">
              <EmployeeCard employee={employee} selected={selectedId === employee.id} onSelect={() => onSelect(employee.id)} reportCount={(reports.get(employee.id) ?? []).length} onEdit={onEdit} onDelete={onDelete} />
            </div>
          ))}
        </div>
      )}
    </section>
  )
}

// Default to a reporting branch so every level is visible before selecting a manager.
export default function EmpChart({ employees = [], onEdit, onDelete }) {
  const [selectedPath, setSelectedPath] = useState([])
  const employeeIds = new Set(employees.map((employee) => employee.id))
  const reports = new Map()
  const roots = []

  for (const employee of employees) {
    const parents = managerIds(employee).filter((id) => employeeIds.has(id))
    if (!parents.length) roots.push(employee)
    for (const id of parents) {
      const team = reports.get(id) ?? []
      team.push(employee)
      reports.set(id, team)
    }
  }
  const levels = []
  const visited = new Set()
  let members = roots
  let parent = null
  while (members.length > 0) {
    const depth = levels.length
    const roles = new Set(members.map((employee) => employee.role))
    const role = roles.size === 1 ? members[0].role : null
    const title = role === "Owner" ? "Owners"
      : role === "Teritory Manager" ? "Teritory Managers"
      : role === "Store Manager" ? "Store Managers"
      : role === "Department Manager" ? "Department Managers"
      : role === "Employee" ? "Employees" : "Direct reports"
    const selected = members.find((employee) => employee.id === selectedPath[depth])
      ?? members.find((employee) => (reports.get(employee.id) ?? []).some((report) => !visited.has(report.id)))
      ?? members[0]
    levels.push({ title, members, parent, selectedId: selected.id })
    if (!selected || visited.has(selected.id)) break
    visited.add(selected.id)
    parent = selected
    members = (reports.get(selected.id) ?? []).filter((employee) => !visited.has(employee.id))
  }

  function selectEmployee(depth, id) {
    setSelectedPath([...levels.slice(0, depth).map((level) => level.selectedId), id])
  }

  return (
    <div className="@container space-y-6 bg-background text-foreground" aria-label="Employee organization chart">
      {levels.flatMap((level, depth) => {
        const sections = level.parent ? [level] : [
          { ...level, title: "Owners", members: level.members.filter((employee) => employee.role === "Owner") },
          { ...level, title: "No reporting manager", members: level.members.filter((employee) => employee.role !== "Owner") },
        ];
        return sections.filter((section) => section.members.length > 0).map((section) => (
          <EmployeeLevel
            key={`${level.parent?.id ?? "root"}:${section.title}`}
            level={section}
            selectedId={level.selectedId}
            onSelect={(id) => selectEmployee(depth, id)}
            onEdit={onEdit} onDelete={onDelete}
            reports={reports}
          />
        ));
      })}
      {levels.length === 0 && <p className="py-10 text-center text-sm text-muted-foreground">No employees to display. Add an employee with managerId set to null to start the chart.</p>}
    </div>
  )
}
