"use client"

import { useEffect, useState } from "react"
import { ChevronDown } from "lucide-react"
import { useTranslations } from "next-intl"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const EMPTY_FORM = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  roleId: "",
  status: "active",
}

function SelectMenu({ label, options, value, onChange }) {
  const selectedOption = options.find((option) => option.value === value)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="outline"
          className="h-11 w-full justify-between rounded-md px-3 font-normal"
        >
          <span className="truncate">{selectedOption?.label ?? label}</span>
          <ChevronDown className="size-4 text-muted-foreground" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="min-w-56">
        {options.map((option) => (
          <DropdownMenuItem
            key={option.value}
            onSelect={() => onChange(option.value)}
          >
            {option.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export function UserFormDialog({
  mode = "edit",
  onOpenChange,
  onSave,
  open,
  roles,
  user,
}) {
  const t = useTranslations("users")
  const [form, setForm] = useState(EMPTY_FORM)

  useEffect(() => {
    if (!open) {
      return
    }

    setForm(
      user
        ? {
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            phone: user.phone,
            roleId: String(user.roleId),
            status: user.status,
          }
        : EMPTY_FORM,
    )
  }, [open, user])

  function handleChange(key, value) {
    setForm((current) => ({
      ...current,
      [key]: value,
    }))
  }

  function handleSubmit(event) {
    event.preventDefault()

    onSave({
      firstName: form.firstName.trim(),
      lastName: form.lastName.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      roleId: Number(form.roleId),
      status: form.status,
    })
  }

  const roleOptions = roles.map((role) => ({
    label: role.name,
    value: String(role.id),
  }))
  const statusOptions = [
    { label: t("active"), value: "active" },
    { label: t("inactive"), value: "inactive" },
  ]
  const title = mode === "add" ? "Add User" : t("editUserTitle")
  const description =
    mode === "add"
      ? "Enter user details, role, and account status."
      : t("editUserDescription")

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>{description}</DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-6 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="user-first-name">{t("firstName")}</Label>
              <Input
                id="user-first-name"
                value={form.firstName}
                onChange={(event) =>
                  handleChange("firstName", event.target.value)
                }
                placeholder={t("firstNamePlaceholder")}
                required
                className="h-11"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="user-last-name">{t("lastName")}</Label>
              <Input
                id="user-last-name"
                value={form.lastName}
                onChange={(event) =>
                  handleChange("lastName", event.target.value)
                }
                placeholder={t("lastNamePlaceholder")}
                required
                className="h-11"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="user-email">{t("email")}</Label>
              <Input
                id="user-email"
                type="email"
                value={form.email}
                onChange={(event) => handleChange("email", event.target.value)}
                placeholder={t("emailPlaceholder")}
                required
                className="h-11"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="user-phone">{t("phone")}</Label>
              <Input
                id="user-phone"
                value={form.phone}
                onChange={(event) => handleChange("phone", event.target.value)}
                placeholder={t("phonePlaceholder")}
                required
                className="h-11"
              />
            </div>
            <div className="space-y-2">
              <Label>{t("role")}</Label>
              <SelectMenu
                label={t("selectRole")}
                options={roleOptions}
                value={form.roleId}
                onChange={(value) => handleChange("roleId", value)}
              />
            </div>
            <div className="space-y-2">
              <Label>{t("status")}</Label>
              <SelectMenu
                label={t("selectStatus")}
                options={statusOptions}
                value={form.status}
                onChange={(value) => handleChange("status", value)}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              {t("cancel")}
            </Button>
            <Button type="submit">{t("saveChanges")}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
