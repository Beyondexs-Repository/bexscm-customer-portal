"use client"

import {
  MoreHorizontal,
  PencilLine,
  Trash2,
  UserCheck,
  UserX,
} from "lucide-react"
import { useTranslations } from "next-intl"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function EmployeeActionsMenu({
  canDelete = true,
  canEdit = true,
  isInactive,
  onDelete,
  onEdit,
  onStatusChange,
}) {
  const t = useTranslations("employees")

  if (!canEdit && !canDelete) return null

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="icon-sm"
          aria-label={t("openActions")}
        >
          <MoreHorizontal className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-36">
        {canEdit ? (
          <>
            <DropdownMenuItem onSelect={onEdit}>
              <PencilLine className="size-4" />
              {t("edit")}
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={onStatusChange}>
              {isInactive ? (
                <UserCheck className="size-4" />
              ) : (
                <UserX className="size-4" />
              )}
              {isInactive ? t("enable") : t("disable")}
            </DropdownMenuItem>
          </>
        ) : null}
        {canDelete ? (
          <DropdownMenuItem onSelect={onDelete} variant="destructive">
            <Trash2 className="size-4" />
            {t("delete")}
          </DropdownMenuItem>
        ) : null}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
