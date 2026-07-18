import { Camera, Pencil, Save } from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const profile = {
  firstName: "Crate",
  lastName: "Inc",
  email: "hello@crateinc.com",
  phone: "+1 (555) 014-2026",
  avatar: "",
}

export default function ProfilePage() {
  return (
    <main className="min-h-full bg-muted/30 p-2 sm:p-4 lg:p-6">
      <div className="mx-auto flex w-full max-w-3xl flex-col">
        <Card className="w-full overflow-hidden border bg-card py-0 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between gap-3 border-b px-4 py-4 sm:px-6">
            <CardTitle className="text-base font-semibold">
              Profile Information
            </CardTitle>
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                <span className="size-1.5 rounded-full bg-emerald-500" />
                Active
              </span>
              <Button type="button" variant="secondary" size="sm">
                <Pencil className="size-4" />
                Edit
              </Button>
            </div>
          </CardHeader>

          <CardContent className="p-0">
            <div className="grid gap-4 p-4 sm:p-6 md:grid-cols-[150px_minmax(0,1fr)]">
              <div className="space-y-3">
                <Label className="text-xs font-medium text-muted-foreground">
                  Profile Avatar
                </Label>
                <div className="relative w-fit">
                  <Avatar className="size-24 ring-1 ring-border sm:size-28">
                    <AvatarImage src={profile.avatar} alt="Crate" />
                    <AvatarFallback className="text-2xl font-semibold">
                      AC
                    </AvatarFallback>
                  </Avatar>
                  <Button
                    type="button"
                    size="icon-sm"
                    className="absolute bottom-1 right-0 rounded-full shadow-sm"
                    aria-label="Profile avatar"
                  >
                    <Camera className="size-4" />
                  </Button>
                </div>
                <p className="max-w-36 text-xs leading-relaxed text-muted-foreground">
                  JPG, PNG or SVG. Max size 2MB.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="first-name">First Name</Label>
                  <Input id="first-name" value={profile.firstName} readOnly />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="last-name">Last Name</Label>
                  <Input id="last-name" value={profile.lastName} readOnly />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input id="email" value={profile.email} readOnly />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" value={profile.phone} readOnly />
                </div>
              </div>
            </div>

            <div className="flex flex-col-reverse justify-end gap-3 border-t p-4 sm:flex-row sm:px-6">
              <Button type="button" variant="secondary" className="sm:min-w-24">
                Cancel
              </Button>
              <Button type="button" className="sm:min-w-32">
                <Save className="size-4" />
                Save Changes
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
