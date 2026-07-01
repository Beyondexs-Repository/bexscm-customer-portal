import { KeyRound, MoreHorizontal, Plus, Search, UserCheck, Users as UsersIcon, UserX } from "lucide-react"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

const users = [
  { id: 1, initials: "OC", name: "Olivia Chen", email: "olivia@example.com", phone: "+1 555 0111", role: "Customer", type: "Customer", status: "Active" },
  { id: 2, initials: "WB", name: "William Brown", email: "william@crateinc.com", phone: "+1 555 0112", role: "Administrator", type: "Internal", status: "Active" },
  { id: 3, initials: "EM", name: "Emma Miller", email: "emma@example.com", phone: "+1 555 0113", role: "Customer", type: "Customer", status: "Inactive" },
]

const stats = [
  { label: "Total Users", value: "3", icon: UsersIcon, color: "bg-blue-500/10 text-blue-600" },
  { label: "Active Users", value: "2", icon: UserCheck, color: "bg-emerald-500/10 text-emerald-600" },
  { label: "Inactive Users", value: "1", icon: UserX, color: "bg-amber-500/10 text-amber-600" },
  { label: "Roles", value: "2", icon: KeyRound, color: "bg-violet-500/10 text-violet-600" },
]

export default function Users() {
  return (
    <main className="space-y-3 p-2 sm:space-y-4 sm:p-4">
      <section className="rounded-xl border bg-gradient-to-br from-card to-muted/30 p-3 shadow-sm sm:p-5">
        <div className="grid grid-cols-2 gap-2 lg:grid-cols-4">
          {stats.map((stat) => {
            const Icon = stat.icon
            return (
              <div key={stat.label} className="rounded-lg border bg-card/80 p-3 shadow-sm sm:p-4">
                <div className="flex items-start gap-3">
                  <div className={`grid size-9 place-items-center rounded-full ${stat.color}`}>
                    <Icon className="size-4" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">{stat.label}</p>
                    <p className="mt-2 text-2xl font-bold">{stat.value}</p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      <section className="overflow-hidden rounded-xl border bg-card shadow-sm">
        <div className="flex flex-col gap-3 border-b p-3 sm:flex-row sm:items-center sm:justify-between sm:p-4">
          <div className="relative w-full sm:max-w-sm">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input className="pl-9" placeholder="Search users..." />
          </div>
          <div className="flex gap-2">
            <Button variant="outline">All Roles</Button>
            <Button variant="outline">All Status</Button>
            <Button>
              <Plus className="size-4" />
              Add User
            </Button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[850px] text-left text-sm">
            <thead className="bg-muted/50 text-xs uppercase text-muted-foreground">
              <tr>
                <th className="px-5 py-3 font-medium">User</th>
                <th className="px-4 py-3 font-medium">Phone</th>
                <th className="px-4 py-3 font-medium">Role</th>
                <th className="px-4 py-3 font-medium">Type</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-muted/30">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <Avatar className="size-9"><AvatarFallback>{user.initials}</AvatarFallback></Avatar>
                      <div><p className="font-semibold">{user.name}</p><p className="text-xs text-muted-foreground">{user.email}</p></div>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-muted-foreground">{user.phone}</td>
                  <td className="px-4 py-4">{user.role}</td>
                  <td className="px-4 py-4"><Badge variant="outline">{user.type}</Badge></td>
                  <td className="px-4 py-4">
                    <Badge variant="secondary" className={user.status === "Active" ? "bg-emerald-500/10 text-emerald-600" : ""}>{user.status}</Badge>
                  </td>
                  <td className="px-4 py-4 text-right"><Button variant="ghost" size="icon-sm"><MoreHorizontal className="size-4" /></Button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex justify-between border-t px-5 py-3 text-sm text-muted-foreground">
          <span>Showing 1–3 of 3 users</span><span>Page 1 of 1</span>
        </div>
      </section>
    </main>
  )
}
