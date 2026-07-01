import { MoreHorizontal, Plus, Search } from "lucide-react"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

const employees = [
  { id: 1, initials: "AM", name: "Ava Morgan", email: "ava@crateinc.com", phone: "+1 555 0101", role: "Sales Manager", status: "Active" },
  { id: 2, initials: "JL", name: "James Lee", email: "james@crateinc.com", phone: "+1 555 0102", role: "Warehouse Lead", status: "Active" },
  { id: 3, initials: "SK", name: "Sofia Khan", email: "sofia@crateinc.com", phone: "+1 555 0103", role: "Account Manager", status: "Inactive" },
  { id: 4, initials: "NR", name: "Noah Reed", email: "noah@crateinc.com", phone: "+1 555 0104", role: "Delivery Coordinator", status: "Active" },
]

export default function Employees() {
  return (
    <main className="space-y-5 p-4">
      <section className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-md">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input className="pl-9" placeholder="Search employees..." />
        </div>
        <Button>
          <Plus className="size-4" />
          Add Employee
        </Button>
      </section>

      <Card className="overflow-hidden py-0">
        <CardHeader className="border-b px-4 py-4 sm:px-6">
          <CardTitle className="text-base">Employees</CardTitle>
          <p className="text-sm text-muted-foreground">
            Team members and their current access status.
          </p>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead className="bg-muted/50 text-xs uppercase text-muted-foreground">
                <tr>
                  <th className="px-6 py-3 font-medium">Employee</th>
                  <th className="px-4 py-3 font-medium">Contact</th>
                  <th className="px-4 py-3 font-medium">Role</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 text-right font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {employees.map((employee) => (
                  <tr key={employee.id} className="hover:bg-muted/30">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="size-9">
                          <AvatarFallback>{employee.initials}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-semibold">{employee.name}</p>
                          <p className="text-xs text-muted-foreground">{employee.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-muted-foreground">{employee.phone}</td>
                    <td className="px-4 py-4">{employee.role}</td>
                    <td className="px-4 py-4">
                      <Badge
                        variant="secondary"
                        className={employee.status === "Active" ? "bg-emerald-500/10 text-emerald-600" : ""}
                      >
                        {employee.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-4 text-right">
                      <Button variant="ghost" size="icon-sm" aria-label="Employee actions">
                        <MoreHorizontal className="size-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex items-center justify-between border-t px-4 py-3 text-sm text-muted-foreground sm:px-6">
            <span>Showing 1–4 of 4 employees</span>
            <span>Page 1 of 1</span>
          </div>
        </CardContent>
      </Card>
    </main>
  )
}
