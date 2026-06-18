"use client"

import { useEffect, useState } from "react"
import { ImagePlus, Upload } from "lucide-react"
import { useTranslations } from "next-intl"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const EMPTY_FORM = {
  firstName: "",
  lastName: "",
  email: "",
  contact: "",
  avatarImage: "",
}

function getInitials(firstName, lastName) {
  return `${firstName?.[0] ?? ""}${lastName?.[0] ?? ""}`.toUpperCase() || "EA"
}

export function EmployeeFormDialog({
  employee,
  mode,
  onOpenChange,
  onSave,
  open,
}) {
  const t = useTranslations("employees")
  const [form, setForm] = useState(EMPTY_FORM)

  useEffect(() => {
    if (!open) {
      return
    }

    setForm(
      employee
        ? {
            firstName: employee.firstName,
            lastName: employee.lastName,
            email: employee.email,
            contact: employee.contact,
            avatarImage: employee.avatarImage ?? "",
          }
        : EMPTY_FORM,
    )
  }, [employee, open])

  function handleChange(key, value) {
    setForm((current) => ({
      ...current,
      [key]: value,
    }))
  }

  function handleImageChange(event) {
    const file = event.target.files?.[0]

    if (!file) {
      return
    }

    const reader = new FileReader()
    reader.onload = () => {
      handleChange("avatarImage", String(reader.result ?? ""))
    }
    reader.readAsDataURL(file)
  }

  function handleSubmit(event) {
    event.preventDefault()

    onSave({
      firstName: form.firstName.trim(),
      lastName: form.lastName.trim(),
      email: form.email.trim(),
      contact: form.contact.trim(),
      avatarImage: form.avatarImage,
    })
  }

  const title =
    mode === "edit" ? t("editEmployeeTitle") : t("addEmployeeTitle")
  const description =
    mode === "edit"
      ? t("editEmployeeDescription")
      : t("addEmployeeDescription")

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>{description}</DialogDescription>
          </DialogHeader>

          <div className="grid gap-6 py-6  lg:grid-cols-[11rem_minmax(0,1fr)]">
            <div className="flex flex-col items-center gap-4 rounded-xl border p-4 text-center">
              <Avatar className="size-24 ring-1 ring-border sm:size-28">
                <AvatarImage
                  src={form.avatarImage}
                  alt={`${form.firstName} ${form.lastName}`.trim() || t("employeeAvatar")}
                />
                <AvatarFallback className="text-lg font-semibold">
                  {getInitials(form.firstName, form.lastName)}
                </AvatarFallback>
              </Avatar>

              <div className="space-y-2">
                <Label
                  htmlFor="employee-avatar"
                  className="flex cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-lg border bg-background px-4 py-2 text-sm font-semibold hover:bg-muted"
                >
                  <Upload className="size-4" />
                  {t("uploadImage")}
                </Label>
                <Input
                  id="employee-avatar"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                />
                <p className="text-xs text-muted-foreground">
                  {t("uploadImageHint")}
                </p>
              </div>
            </div>

            <div className="grid gap-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="employee-first-name">{t("firstName")}</Label>
                  <Input
                    id="employee-first-name"
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
                  <Label htmlFor="employee-last-name">{t("lastName")}</Label>
                  <Input
                    id="employee-last-name"
                    value={form.lastName}
                    onChange={(event) =>
                      handleChange("lastName", event.target.value)
                    }
                    placeholder={t("lastNamePlaceholder")}
                    required
                    className="h-11"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="employee-email">{t("email")}</Label>
                <Input
                  id="employee-email"
                  type="email"
                  value={form.email}
                  onChange={(event) => handleChange("email", event.target.value)}
                  placeholder={t("emailPlaceholder")}
                  required
                  className="h-11"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="employee-contact">{t("contact")}</Label>
                <Input
                  id="employee-contact"
                  value={form.contact}
                  onChange={(event) =>
                    handleChange("contact", event.target.value)
                  }
                  placeholder={t("contactPlaceholder")}
                  required
                  className="h-11"
                />
              </div>

              {!form.avatarImage && (
                <div className="flex items-center gap-2 rounded-lg border border-dashed px-3 py-2 text-sm text-muted-foreground">
                  <ImagePlus className="size-4" />
                  {t("uploadImageEmpty")}
                </div>
              )}
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
            <Button type="submit">
              {mode === "edit" ? t("saveChanges") : t("saveEmployee")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
