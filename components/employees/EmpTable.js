import EmployeeActions from "./EmployeeActions"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"


export default function EmpTable({ employees = [], onEdit, onDelete }) {
  return (
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
                          <AvatarImage src={employee.image} alt={employee.name} /><AvatarFallback>{employee.name.split(/\s+/).map((part) => part[0]).slice(0, 2).join("")}</AvatarFallback>
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
                      <EmployeeActions employee={employee} onEdit={onEdit} onDelete={onDelete} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex items-center justify-between border-t px-4 py-3 text-sm text-muted-foreground sm:px-6">
            <span>{employees.length} employees</span>
            <span>Page 1 of 1</span>
          </div>
        </CardContent>
      </Card>
  )
}
