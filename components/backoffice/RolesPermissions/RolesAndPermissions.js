"use client"

import { useMemo, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { KeyRound, MoreVertical, Plus, Route, Search, ShieldCheck, Pencil } from "lucide-react"

const roles = [
  { name: "Super Admin", portal: "Internal", routes: 12, permissions: "All permissions" },
  { name: "Application Admin", portal: "Internal", routes: 12, permissions: "16 permissions" },
  { name: "Sales Representative", portal: "Internal", routes: 8, permissions: "9 permissions" },
  { name: "Sales Associate", portal: "Internal", routes: 8, permissions: "7 permissions" },
  { name: "GM/Owner", portal: "Internal", routes: 12, permissions: "10 permissions" },
  { name: "AR", portal: "Internal", routes: 4, permissions: "4 permissions" },
  { name: "AR Manager", portal: "Internal", routes: 5, permissions: "6 permissions" },
  { name: "Store Manager", portal: "Customer", routes: 11, permissions: "15 permissions" },
  { name: "Store Employee", portal: "Customer", routes: 7, permissions: "9 permissions" },
]

const adminRoutes = [
  "/backoffice", "/backoffice/overview", "/backoffice/orders",
  "/backoffice/catalog", "/backoffice/catalog/details", "/backoffice/order-guide",
  "/backoffice/employees", "/backoffice/users", "/backoffice/roles-permissions",
  "/backoffice/promotions", "/backoffice/promotions/create", "/backoffice/profile",
]

const customerRoutes = [
  "/", "/catalog", "/catalog/details", "/order-guide", "/my-orders",
  "/invoices", "/invoices/details", "/messages", "/employees", "/users", "/profile",
]

const pageNames = {
  "/": "Overview",
  "/backoffice": "Backoffice Home",
  "/backoffice/overview": "Overview",
  "/backoffice/orders": "Orders",
  "/backoffice/catalog": "Catalog",
  "/backoffice/catalog/details": "Product Details",
  "/backoffice/order-guide": "Order Guide",
  "/backoffice/employees": "Employees",
  "/backoffice/users": "Users",
  "/backoffice/roles-permissions": "Roles & Permissions",
  "/backoffice/promotions": "Promotions",
  "/backoffice/promotions/create": "Create Promotion",
  "/backoffice/profile": "Profile",
  "/catalog": "Catalog",
  "/catalog/details": "Product Details",
  "/order-guide": "Order Guide",
  "/my-orders": "My Orders",
  "/invoices": "Invoices",
  "/invoices/details": "Invoice Details",
  "/messages": "Messages",
  "/employees": "Employees",
  "/users": "Users",
  "/profile": "Profile",
}

export default function RolesAndPermissions() {
  const [search, setSearch] = useState("")
  const [selectedRole, setSelectedRole] = useState(null)
  const [routeSearch, setRouteSearch] = useState("")
  const [selectedRoutes, setSelectedRoutes] = useState([])

  const filteredRoles = useMemo(() => {
    const query = search.trim().toLowerCase()
    return query
      ? roles.filter((role) => `${role.name} ${role.portal}`.toLowerCase().includes(query))
      : roles
  }, [search])

  const availableRoutes = selectedRole?.portal === "Customer" ? customerRoutes : adminRoutes
  const visibleRoutes = availableRoutes.filter((route) =>
    pageNames[route].toLowerCase().includes(routeSearch.trim().toLowerCase()),
  )

  function openRouteSheet(role) {
    const routes = role.portal === "Customer" ? customerRoutes : adminRoutes
    setSelectedRole(role)
    setRouteSearch("")
    setSelectedRoutes(routes.slice(0, role.routes))
  }

  function toggleRoute(route) {
    setSelectedRoutes((current) =>
      current.includes(route) ? current.filter((item) => item !== route) : [...current, route],
    )
  }

  return (
    <section className="overflow-hidden rounded-xl border bg-card shadow-sm">
      <div className="flex flex-col gap-3 border-b p-4 sm:flex-row sm:items-center sm:justify-between">
        <label className="relative block w-full sm:max-w-sm">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search roles..."
            className="h-9 w-full rounded-lg border bg-background pl-9 pr-3 text-sm outline-none focus:border-ring focus:ring-3 focus:ring-ring/20"
          />
        </label>
        <Button className="w-full sm:w-auto"><Plus />Add Role</Button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[680px] text-left text-sm">
          <thead className="border-b bg-muted/40 text-xs font-medium text-muted-foreground">
            <tr>
              <th className="px-4 py-3 sm:px-6">Role Name</th>
              <th className="px-4 py-3">Pages</th>
              <th className="px-4 py-3">Permissions</th>
              <th className="px-4 py-3 text-right sm:px-6">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {filteredRoles.map((role) => (
              <tr key={role.name} className="transition-colors hover:bg-muted/30">
                <td className="px-4 py-3 sm:px-6">
                  <div className="flex items-center gap-3">
                    <span className="grid size-8 shrink-0 place-items-center rounded-full bg-primary/10 text-primary">
                      <ShieldCheck className="size-4" />
                    </span>
                    <div className="flex min-w-0 items-center gap-2">
                      <span className="font-medium text-foreground">{role.name}</span>
                      <Badge
                        variant={role.portal === "Internal" ? "secondary" : "outline"}
                        className={
                          role.portal === "Customer"
                            ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
                            : "bg-[orange]/20 "
                        }
                      >
                        {role.portal}
                      </Badge>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-muted-foreground">{role.routes} pages</td>
                <td className="px-4 py-3 text-muted-foreground">{role.permissions}</td>
                <td className="px-4 py-3 sm:px-6">
                  <div className="flex justify-end">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon-sm" aria-label={`Actions for ${role.name}`}><MoreVertical /></Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        
                        <DropdownMenuItem onSelect={() => openRouteSheet(role)}><Route />Assign Pages</DropdownMenuItem>
                        <DropdownMenuItem><KeyRound />Assign Permissions</DropdownMenuItem>
                        <DropdownMenuItem><Pencil />Edit Role</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredRoles.length === 0 && <p className="p-8 text-center text-sm text-muted-foreground">No roles found.</p>}
      </div>

      <Sheet open={Boolean(selectedRole)} onOpenChange={(open) => !open && setSelectedRole(null)}>
        <SheetContent className="w-full sm:max-w-md">
          <SheetHeader className="border-b">
            <SheetTitle>Assign Pages to {selectedRole?.name}</SheetTitle>
            <SheetDescription>
              Select the pages this role can access in the {selectedRole?.portal === "Customer" ? "Customer" : "Admin"} Portal.
            </SheetDescription>
          </SheetHeader>
          <div className="flex min-h-0 flex-1 flex-col gap-3 px-4">
            <label className="relative block">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <input
                value={routeSearch}
                onChange={(event) => setRouteSearch(event.target.value)}
                placeholder="Search pages..."
                className="h-9 w-full rounded-lg border bg-background pl-9 pr-3 text-sm outline-none focus:border-ring focus:ring-3 focus:ring-ring/20"
              />
            </label>
            <div className="min-h-0 flex-1 space-y-1 overflow-y-auto pb-4">
              {visibleRoutes.map((route) => (
                <label key={route} className="flex cursor-pointer items-center gap-3 rounded-lg px-2 py-2 hover:bg-muted">
                  <input type="checkbox" checked={selectedRoutes.includes(route)} onChange={() => toggleRoute(route)} className="size-4 accent-primary" />
                  <span className="text-sm">{pageNames[route]}</span>
                </label>
              ))}
            </div>
          </div>
          <SheetFooter className="border-t sm:flex-row sm:items-center sm:justify-between">
            <span className="text-xs text-muted-foreground">{selectedRoutes.length} of {availableRoutes.length} pages selected</span>
            <div className="flex gap-2">
              <SheetClose asChild><Button variant="outline" className="flex-1 sm:flex-none">Cancel</Button></SheetClose>
              <SheetClose asChild><Button className="flex-1 sm:flex-none">Save Pages</Button></SheetClose>
            </div>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </section>
  )
}
