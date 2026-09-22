"use client";

import { useState } from "react";
import { employeeRoles, useEmployeeAccess } from "./employee-access";
import locations from "@/data/locations.json";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";

export const managerIds = (employee) =>
  employee.managerIds ??
  (employee.managerId == null ? [] : [employee.managerId]);

const roleLabel = (role) => role === "Department Manager" ? "Dept. Manager" : role;

function ManagerRoleBadge({ role, activeRole }) {
  const colors = role === activeRole
    ? "bg-green-100 text-green-700! dark:bg-green-500/15 dark:text-green-300!"
    : "bg-orange-100 text-orange-700! dark:bg-orange-500/15 dark:text-orange-300!";
  return <Badge variant="secondary" className={colors}>{roleLabel(role)}</Badge>;
}

export default function EmployeeForm({ employee, employees, onClose, onSave }) {
  const { allowedRoles: roles, role: reportingRole } = useEmployeeAccess();
  const canSelectLocation = reportingRole === "Owner" || reportingRole === "Teritory Manager";
  const [draft, setDraft] = useState({
    name: "",
    email: "",
    phone: "",
    role: "",
    image: "",
    locationId: "",
    ...employee,
    status: employee?.status ?? "Active",
    managerIds: employee ? managerIds(employee) : [],
  });
  const [error, setError] = useState("");
  const [reading, setReading] = useState(false);
  const statuses = ["Active", "Inactive"];
  const blocked = new Set(employee ? [employee.id] : []);
  let changed = true;
  while (changed) {
    changed = false;
    for (const item of employees) {
      if (
        !blocked.has(item.id) &&
        managerIds(item).some((id) => blocked.has(id))
      ) {
        blocked.add(item.id);
        changed = true;
      }
    }
  }
  const roleIndex = employeeRoles.indexOf(draft.role);
  const candidates = employees.filter((item) => {
    const managerIndex = employeeRoles.indexOf(item.role);
    return !blocked.has(item.id) && managerIndex >= 0 && managerIndex < roleIndex;
  });
  function field(key, value) {
    setDraft((current) => ({
      ...current,
      [key]: value,
      ...(key === "role" && value !== current.role ? { managerIds: [] } : {}),
    }));
  }
  function upload(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/") || file.size > 5 * 1024 * 1024) {
      setError("Choose an image smaller than 5 MB.");
      return;
    }
    setError("");
    setReading(true);
    const reader = new FileReader();
    reader.onload = () => {
      field("image", reader.result);
      setReading(false);
    };
    reader.onerror = () => {
      setError("Unable to read this image.");
      setReading(false);
    };
    reader.readAsDataURL(file);
  }
  function submit(event) {
    event.preventDefault();
    if (!roles.includes(draft.role) || (employee && !roles.includes(employee.role))) {
      setError("Your login cannot add or edit this role.");
      return;
    }
    if (!draft.name.trim() || !draft.email.trim() || !draft.phone.trim()) {
      setError("Enter a name, email, and mobile number.");
      return;
    }
    if (draft.managerIds.some((id) => !candidates.some((item) => item.id === id))) {
      setError("Select reporting managers from the appropriate role level.");
      return;
    }
    if (canSelectLocation && draft.locationId && !locations.some((location) => location.id === draft.locationId)) {
      setError("Select a valid location.");
      return;
    }
    if (employee && employees.some((item) =>
      managerIds(item).includes(employee.id) && employeeRoles.indexOf(item.role) <= roleIndex,
    )) {
      setError("This role must remain above the employees who report to it. Update their reporting managers first.");
      return;
    }
    onSave({
      ...draft,
      id: employee?.id ?? crypto.randomUUID(),
      name: draft.name.trim(),
      email: draft.email.trim(),
      phone: draft.phone.trim(),
      status: draft.status ?? "Active",
      managerId: null,
      locationId: canSelectLocation ? draft.locationId : employee?.locationId ?? "",
    });
  }
  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-h-[90svh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {employee ? "Edit employee" : "Add employee"}
          </DialogTitle>
          <DialogDescription>
            Employee details and reporting relationships.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={submit} className="space-y-4">
          <div className="flex items-center gap-3">
            <Avatar className="size-16">
              <AvatarImage src={draft.image} alt="Employee preview" />
              <AvatarFallback>
                {draft.name.slice(0, 2).toUpperCase() || "EM"}
              </AvatarFallback>
            </Avatar>
            <label className="flex min-w-0 flex-1 flex-col gap-1 text-sm font-medium">
              Image
              <Input type="file" accept="image/*" onChange={upload} />
              <span className="text-xs font-normal text-muted-foreground">
                Up to 5 MB
              </span>
            </label>
          </div>
          <label className="flex flex-col gap-1 text-sm font-medium">
            Name
            <Input
              required
              value={draft.name}
              onChange={(e) => field("name", e.target.value)}
            />
          </label>
          <label className="flex flex-col gap-1 text-sm font-medium">
            Email
            <Input
              required
              type="email"
              value={draft.email}
              onChange={(e) => field("email", e.target.value)}
            />
          </label>
          <label className="flex flex-col gap-1 text-sm font-medium">
            Mobile number
            <Input
              required
              type="tel"
              autoComplete="tel"
              value={draft.phone}
              onChange={(e) => field("phone", e.target.value)}
            />
          </label>
          <div className="grid gap-4 sm:grid-cols-2">
          <label className="flex flex-col gap-1 text-sm font-medium">
            Role
            <select
              required
              className="h-9 w-full rounded-md border bg-background px-2 text-sm"
              value={draft.role}
              onChange={(e) => field("role", e.target.value)}
            >
              <option value="">Select role</option>
              {roles.map((role) => (
                <option key={role}>{role}</option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-1 text-sm font-medium">
            Status
            <select
              required
              className="h-9 w-full rounded-md border bg-background px-2 text-sm"
              value={draft.status}
              onChange={(e) => field("status", e.target.value)}
            >
              {statuses.map((status) => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </label>
          </div>
          {canSelectLocation && draft.role && (
            <label className="flex flex-col gap-1 text-sm font-medium">
              Location
              <select
                className="h-9 w-full rounded-md border bg-background px-2 text-sm"
                value={draft.locationId}
                onChange={(event) => field("locationId", event.target.value)}
              >
                <option value="">Select location</option>
                {locations.map((location) => (
                  <option key={location.id} value={location.id}>{location.name} - {location.city}</option>
                ))}
              </select>
            </label>
          )}
          {roleIndex > 0 && (
          <div className="space-y-1">
            <p className="text-sm font-medium">Reports to</p>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full justify-start"
                  aria-label="Select reporting managers"
                >
                  {draft.managerIds.length
                    ? `${draft.managerIds.length} selected`
                    : "Select reporting managers"}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="max-h-60 w-80 max-w-[calc(100vw-2rem)] overflow-y-auto">
                {candidates.map((item) => (
                  <DropdownMenuCheckboxItem
                    key={item.id}
                    checked={draft.managerIds.includes(item.id)}
                    onSelect={(e) => e.preventDefault()}
                    onCheckedChange={(checked) =>
                      field(
                        "managerIds",
                        checked
                          ? [...draft.managerIds, item.id]
                          : draft.managerIds.filter((id) => id !== item.id),
                      )
                    }
                  >
                    <span className="min-w-0 whitespace-normal">{item.name}</span>
                    <ManagerRoleBadge role={item.role} activeRole={reportingRole} />
                  </DropdownMenuCheckboxItem>
                ))}
                {!candidates.length && (
                  <p className="p-2 text-xs text-muted-foreground">
                    No eligible managers.
                  </p>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
            <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
              {draft.managerIds.length ? draft.managerIds.map((id) => {
                const manager = employees.find((item) => item.id === id);
                return manager ? (
                  <span key={id} className="inline-flex flex-wrap items-center gap-1.5">
                    {manager.name}
                    <ManagerRoleBadge role={manager.role} activeRole={reportingRole} />
                  </span>
                ) : null;
              }) : "Leave empty for a top-level employee."}
            </div>
          </div>
          )}
          {error && (
            <p role="alert" className="text-sm text-destructive">
              {error}
            </p>
          )}
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button disabled={reading} type="submit">
              {employee ? "Save changes" : "Add employee"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
