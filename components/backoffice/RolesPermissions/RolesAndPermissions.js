import { Badge } from "@/components/ui/badge"
import { ShieldCheck, UserRoundCog, Users } from "lucide-react"

const roles = [
  { name: "Administrator", type: "Internal", icon: ShieldCheck },
  { name: "Sales Manager", type: "Internal", icon: UserRoundCog },
  { name: "Store Manager", type: "Customer", icon: Users },
  { name: "Store Employee", type: "Customer", icon: Users },
]

export default function RolesAndPermissions() {
  return (
    <section className="grid min-h-full gap-4 lg:grid-cols-[minmax(280px,420px)_1fr]">
      <div className="overflow-hidden rounded-lg border bg-card shadow-sm">
        <div className="border-b p-4">
          <h2 className="text-lg font-semibold">Roles</h2>
          <p className="mt-1 text-xs text-muted-foreground">Available frontend role examples.</p>
        </div>
        <div className="divide-y">
          {roles.map((role) => {
            const Icon = role.icon
            return (
              <div key={role.name} className="flex items-center gap-3 px-4 py-3">
                <span className="grid size-9 place-items-center rounded-lg bg-primary/10 text-primary"><Icon className="size-4" /></span>
                <div><p className="text-sm font-semibold">{role.name}</p><p className="text-xs text-muted-foreground">{role.type}</p></div>
              </div>
            )
          })}
        </div>
      </div>
      <div className="rounded-lg border bg-card p-4 shadow-sm">
        <div className="flex items-center justify-between border-b pb-4">
          <div><h2 className="text-lg font-semibold">Role Types</h2><p className="mt-1 text-xs text-muted-foreground">Visual role categories.</p></div>
          <ShieldCheck className="size-5 text-primary" />
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <div className="rounded-lg border p-4"><Badge variant="secondary">Internal</Badge><p className="mt-3 font-semibold">System roles</p><p className="mt-1 text-sm text-muted-foreground">Backoffice team members and administrators.</p></div>
          <div className="rounded-lg border p-4"><Badge variant="outline">Customer</Badge><p className="mt-3 font-semibold">Customer roles</p><p className="mt-1 text-sm text-muted-foreground">Store managers and store employees.</p></div>
        </div>
      </div>
    </section>
  )
}
