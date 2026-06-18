"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import {
  ChevronDown,
  KeyRound,
  Plus,
  Search,
  UserCheck,
  Users as UsersIcon,
  UserX,
} from "lucide-react"
import { useTranslations } from "next-intl"
import { UserActionsMenu } from "@/components/users/UserActionsMenu"
import { UserFormDialog } from "@/components/users/UserFormDialog"
import { EmployeesPagination } from "@/components/employees/EmployeesPagination"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const DEFAULT_PAGE_SIZE = 10

function getFullName(user) {
  return `${user.firstName} ${user.lastName}`.trim()
}

function getInitials(user) {
  return `${user.firstName?.[0] ?? ""}${user.lastName?.[0] ?? ""}`.toUpperCase()
}

function UsersLoadingState() {
  return (
    <div className="flex min-h-[calc(100svh-13rem)] items-center justify-center p-4 md:min-h-[calc(100vh-8rem)] md:p-6">
      <div className="flex flex-col items-center gap-4">
        <div className="size-12 rounded-full border-4 border-primary/20 border-t-primary animate-spin transition-transform" />
        <p className="text-sm font-medium text-muted-foreground">Loading users...</p>
      </div>
    </div>
  )
}

function StatCard({ icon: Icon, iconClassName, label, value }) {
  return (
    <div className="rounded-lg border bg-card/80 p-3 shadow-sm sm:p-4">
      <div className="flex items-start gap-2 sm:gap-3">
        <div className={`grid size-8 shrink-0 place-items-center rounded-full sm:size-9 ${iconClassName}`}>
          <Icon className="size-4" />
        </div>
        <div className="min-w-0">
          <p className="text-[11px] font-medium leading-tight text-muted-foreground sm:text-xs">
            {label}
          </p>
          <p className="mt-2 text-xl font-bold leading-none sm:text-2xl">
            {value}
          </p>
        </div>
      </div>
    </div>
  )
}

function FilterSelect({ className = "", label, options, value, onChange }) {
  const selectedOption = options.find((option) => option.value === value)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className={`h-10 min-w-0 w-full justify-between rounded-md px-2 text-xs font-semibold sm:h-11 sm:px-3 sm:text-sm lg:w-44 ${className}`}
        >
          <span className="truncate">{selectedOption?.label ?? label}</span>
          <ChevronDown className="size-4 text-muted-foreground" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-44">
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

function StatusBadge({ status }) {
  const t = useTranslations("users")
  const isActive = status === "active"
  const isRemoved = status === "removed"

  return (
    <Badge
      variant={isRemoved ? "destructive" : isActive ? "secondary" : "outline"}
      className={
        isRemoved
          ? ""
          : isActive
          ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
          : "text-muted-foreground"
      }
    >
      <span
        className={
          isRemoved
            ? "size-1.5 rounded-full bg-destructive-foreground"
            : isActive
            ? "size-1.5 rounded-full bg-emerald-500"
            : "size-1.5 rounded-full bg-muted-foreground"
        }
      />
      {isRemoved ? t("removed") : isActive ? t("active") : t("inactive")}
    </Badge>
  )
}

function UserTypeBadge({ userType }) {
  const isCustomer = userType === "customer"

  return (
    <Badge
      variant="outline"
      className={
        isCustomer
          ? "border-blue-500/20 bg-blue-500/10 text-blue-600 dark:text-blue-400"
          : "border-slate-500/20 bg-slate-500/10 text-slate-600 dark:text-slate-300"
      }
    >
      {isCustomer ? "Customer" : "Internal"}
    </Badge>
  )
}

export default function Users() {
  const t = useTranslations("users")
  const [users, setUsers] = useState([])
  const [roles, setRoles] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [roleFilter, setRoleFilter] = useState("all")
  const [userTypeFilter, setUserTypeFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingUser, setEditingUser] = useState(null)
  const [saveError, setSaveError] = useState("")
  const [disableUserTarget, setDisableUserTarget] = useState(null)
  const [deleteUserTarget, setDeleteUserTarget] = useState(null)
  const [isDisabling, setIsDisabling] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [statusActionError, setStatusActionError] = useState("")
  const [deleteError, setDeleteError] = useState("")
  const [dialogMode, setDialogMode] = useState("edit")
  const [error, setError] = useState("")
  const listTopRef = useRef(null)

  useEffect(() => {
    let active = true

    async function syncUsers() {
      try {
        const [usersData, rolesData] = await Promise.all([
          loadUsers(),
          loadRoles(),
        ])

        if (active) {
          setUsers(usersData.users)
          setRoles(rolesData.roles)
          setError("")
        }
      } catch (loadError) {
        if (active) {
          setError(loadError.message)
        }
      } finally {
        if (active) {
          setIsLoading(false)
        }
      }
    }

    syncUsers()

    return () => {
      active = false
    }
  }, [])

  const roleOptions = useMemo(
    () => [
      { label: t("allRoles"), value: "all" },
      ...roles.map((role) => ({
        label: role.name,
        value: role.key,
      })),
    ],
    [roles, t],
  )
  const statusOptions = [
    { label: t("allStatus"), value: "all" },
    { label: t("active"), value: "active" },
    { label: t("inactive"), value: "inactive" },
  ]
  const userTypeOptions = [
    { label: "All Types", value: "all" },
    { label: "Internal", value: "internal" },
    { label: "Customer", value: "customer" },
  ]

  const filteredUsers = useMemo(() => {
    const query = search.toLowerCase().trim()

    return users.filter((user) => {
      const fullName = getFullName(user).toLowerCase()
      const matchesSearch =
        !query ||
        fullName.includes(query) ||
        user.email.toLowerCase().includes(query) ||
        user.phone.toLowerCase().includes(query) ||
        user.roleName.toLowerCase().includes(query) ||
        user.userType.toLowerCase().includes(query)
      const matchesRole = roleFilter === "all" || user.roleKey === roleFilter
      const matchesUserType =
        userTypeFilter === "all" || user.userType === userTypeFilter
      const matchesStatus =
        statusFilter === "all" || user.status === statusFilter

      return matchesSearch && matchesRole && matchesUserType && matchesStatus
    })
  }, [roleFilter, search, statusFilter, userTypeFilter, users])

  const totalUsers = users.length
  const activeUsers = users.filter((user) => user.status === "active").length
  const inactiveUsers = users.filter((user) => user.status === "inactive").length
  const totalRoles = roles.length

  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / pageSize))
  const safeCurrentPage = Math.min(currentPage, totalPages)
  const paginatedUsers = filteredUsers.slice(
    (safeCurrentPage - 1) * pageSize,
    safeCurrentPage * pageSize,
  )

  function scrollListToTop() {
    window.requestAnimationFrame(() => {
      listTopRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      })
    })
  }

  function resetToFirstPage() {
    setCurrentPage(1)
    scrollListToTop()
  }

  function handlePageChange(page) {
    setCurrentPage(page)
    scrollListToTop()
  }

  function handlePageSizeChange(nextPageSize) {
    setPageSize(nextPageSize)
    setCurrentPage(1)
    scrollListToTop()
  }

  function handleEditUser(user) {
    setSaveError("")
    setDialogMode("edit")
    setEditingUser(user)
    setDialogOpen(true)
  }

  function handleAddUser() {
    setSaveError("")
    setDialogMode("add")
    setEditingUser(null)
    setDialogOpen(true)
  }

  function handleStatusChange(user) {
    setStatusActionError("")
    setDisableUserTarget(user)
  }

  function handleDeleteUser(user) {
    setDeleteError("")
    setDeleteUserTarget(user)
  }

  async function confirmDisableUser() {
    if (!disableUserTarget) return

    setIsDisabling(true)
    const action =
      disableUserTarget.status === "inactive" ? "enable" : "disable"

    try {
      const savedUser = await updateUserStatus(disableUserTarget.id, action)

      setUsers((current) =>
        current.map((user) =>
          user.id === disableUserTarget.id ? savedUser : user,
        ),
      )
      setDisableUserTarget(null)
      setStatusActionError("")
    } catch (disableError) {
      setStatusActionError(disableError.message)
    } finally {
      setIsDisabling(false)
    }
  }

  async function confirmDeleteUser() {
    if (!deleteUserTarget) return

    setIsDeleting(true)

    try {
      await deleteUser(deleteUserTarget.id)
      setUsers((current) =>
        current.filter((user) => user.id !== deleteUserTarget.id),
      )
      setDeleteUserTarget(null)
      setDeleteError("")
    } catch (deleteError) {
      setDeleteError(deleteError.message)
    } finally {
      setIsDeleting(false)
    }
  }

  async function handleSaveUser(userData) {
    try {
      if (dialogMode === "add") {
        const savedUser = await createUser(userData)

        setUsers((current) => [savedUser, ...current])
      } else if (editingUser) {
        const savedUser = await updateUser(editingUser.id, userData)

        setUsers((current) =>
          current.map((user) =>
            user.id === editingUser.id ? savedUser : user,
          ),
        )
      }

      setDialogOpen(false)
      setEditingUser(null)
      setSaveError("")
      setError("")
    } catch (saveError) {
      setSaveError(saveError.message)
    }
  }

  if (isLoading) {
    return <UsersLoadingState />
  }

  return (
    <div className="space-y-3 p-2 sm:space-y-4 sm:p-4">
      <section className="rounded-xl border bg-gradient-to-br from-card to-muted/30 p-3 shadow-sm sm:p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <h2 className="text-xl font-bold tracking-tight"></h2>

          <div className="grid gap-2 sm:flex sm:items-center">
            <Button className="h-10 justify-center" onClick={handleAddUser}>
              <Plus className="size-4" />
              Add User
            </Button>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2 sm:gap-3 lg:grid-cols-4">
          <StatCard
            icon={UsersIcon}
            iconClassName="bg-blue-500/10 text-blue-600 dark:text-blue-400"
            label="Total Users"
            value={totalUsers}
          />
          <StatCard
            icon={UserCheck}
            iconClassName="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
            label="Active Users"
            value={activeUsers}
          />
          <StatCard
            icon={UserX}
            iconClassName="bg-red-500/10 text-red-600 dark:text-red-400"
            label="Inactive Users"
            value={inactiveUsers}
          />
          <StatCard
            icon={KeyRound}
            iconClassName="bg-indigo-500/10 text-indigo-600 dark:text-indigo-400"
            label="Roles"
            value={totalRoles}
          />
        </div>
      </section>

      <section className="rounded-xl border bg-card shadow-sm">
        <div
          ref={listTopRef}
          className="grid grid-cols-2 gap-2 border-b p-2 sm:gap-3 sm:p-4 lg:grid-cols-[minmax(18rem,28rem)_1fr] lg:items-center"
        >
          <div className="relative col-span-2 w-full lg:col-span-1">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder={t("searchPlaceholder")}
              value={search}
              onChange={(event) => {
                setSearch(event.target.value)
                resetToFirstPage()
              }}
              className="h-10 pl-10 pr-3 text-sm sm:h-11 sm:pr-4"
            />
          </div>

          <div className="col-span-2 grid grid-cols-2 gap-2 sm:gap-3 lg:col-span-1 lg:flex lg:justify-end">
            <FilterSelect
              label={t("allRoles")}
              options={roleOptions}
              value={roleFilter}
              onChange={(value) => {
                setRoleFilter(value)
                resetToFirstPage()
              }}
            />
            <FilterSelect
              label="All Types"
              options={userTypeOptions}
              value={userTypeFilter}
              onChange={(value) => {
                setUserTypeFilter(value)
                resetToFirstPage()
              }}
            />
            <FilterSelect
              label={t("allStatus")}
              options={statusOptions}
              value={statusFilter}
              onChange={(value) => {
                setStatusFilter(value)
                resetToFirstPage()
              }}
            />
          </div>
        </div>

        {error ? (
          <div className="mx-2 mt-2 rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm font-medium text-destructive sm:mx-4 sm:mt-4">
            {error}
          </div>
        ) : null}

        <div className="hidden overflow-x-auto md:block">
          <table className="w-full min-w-[760px]">
            <thead>
              <tr className="border-b bg-muted/40">
                <th className="px-4 py-3 text-left text-sm font-semibold lg:px-5 lg:py-4">
                  {t("user")}
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold lg:px-5 lg:py-4">
                  {t("role")}
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold lg:px-5 lg:py-4">
                  User Type
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold lg:px-5 lg:py-4">
                  {t("status")}
                </th>
                <th className="px-4 py-3 text-right text-sm font-semibold lg:px-5 lg:py-4">
                  {t("actions")}
                </th>
              </tr>
            </thead>

            <tbody>
              {paginatedUsers.map((user) => (
                <tr key={user.id} className="border-b last:border-0">
                  <td className="px-4 py-2 lg:px-5">
                    <div className="flex items-center gap-3">
                      <Avatar className="size-10">
                        <AvatarImage src={user.avatar} alt={getFullName(user)} />
                        <AvatarFallback className="bg-primary/10 font-semibold text-primary">
                          {getInitials(user)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <div className="truncate text-sm font-medium">
                          {getFullName(user)}
                        </div>
                        <div className="truncate text-xs text-muted-foreground">
                          {user.phone}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm lg:px-5">{user.roleName}</td>
                  <td className="px-4 py-3 lg:px-5">
                    <UserTypeBadge userType={user.userType} />
                  </td>
                  <td className="px-4 py-3 lg:px-5">
                    <StatusBadge status={user.status} />
                  </td>
                  <td className="px-4 py-3 lg:px-5">
                    <div className="flex justify-end">
                      <UserActionsMenu
                        isInactive={user.status === "inactive"}
                        isRemoved={user.status === "removed"}
                        onDelete={() => handleDeleteUser(user)}
                        onEdit={() => handleEditUser(user)}
                        onStatusChange={() => handleStatusChange(user)}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="space-y-2 p-2 md:hidden">
          {paginatedUsers.map((user) => (
            <div key={user.id} className="rounded-lg border bg-background p-3">
              <div className="flex items-start gap-3">
                <Avatar className="size-10 shrink-0">
                  <AvatarImage src={user.avatar} alt={getFullName(user)} />
                  <AvatarFallback className="bg-primary/10 text-sm font-semibold text-primary">
                    {getInitials(user)}
                  </AvatarFallback>
                </Avatar>

                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <h3 className="truncate text-sm font-semibold">
                        {getFullName(user)}
                      </h3>
                      <p className="mt-1 truncate text-xs text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                    <UserActionsMenu
                      isInactive={user.status === "inactive"}
                      isRemoved={user.status === "removed"}
                      onDelete={() => handleDeleteUser(user)}
                      onEdit={() => handleEditUser(user)}
                      onStatusChange={() => handleStatusChange(user)}
                    />
                  </div>
                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <Badge variant="outline">{user.roleName}</Badge>
                    <UserTypeBadge userType={user.userType} />
                    <StatusBadge status={user.status} />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredUsers.length === 0 && (
          <div className="p-4 text-center sm:p-8">
            <p className="font-semibold">{t("noUsersFound")}</p>
            <p className="mt-1 text-sm text-muted-foreground">
              {t("noUsersHint")}
            </p>
          </div>
        )}

        {filteredUsers.length > 0 && (
          <div className="border-t">
            <EmployeesPagination
              currentPage={safeCurrentPage}
              pageSize={pageSize}
              selectedRows={0}
              totalPages={totalPages}
              totalRows={filteredUsers.length}
              onPageChange={handlePageChange}
              onPageSizeChange={handlePageSizeChange}
            />
          </div>
        )}
      </section>

      <UserFormDialog
        user={editingUser}
        mode={dialogMode}
        roles={roles}
        open={dialogOpen}
        error={saveError}
        onOpenChange={(nextOpen) => {
          setDialogOpen(nextOpen)
          if (!nextOpen) {
            setEditingUser(null)
            setSaveError("")
          }
        }}
        onSave={handleSaveUser}
      />

      <Dialog
        open={Boolean(disableUserTarget)}
        onOpenChange={(open) => {
          if (!open && !isDisabling) {
            setDisableUserTarget(null)
            setStatusActionError("")
          }
        }}
      >
        <DialogContent showCloseButton={!isDisabling}>
          <DialogHeader>
            <DialogTitle>
              {disableUserTarget?.status === "inactive"
                ? "Enable user?"
                : "Disable user?"}
            </DialogTitle>
            <DialogDescription>
              {disableUserTarget?.status === "inactive"
                ? `${getFullName(disableUserTarget)} will regain access to the application.`
                : disableUserTarget
                ? `${getFullName(disableUserTarget)} will no longer be able to access the application. You can reactivate this user later by editing their status.`
                : "This user will no longer be able to access the application."}
            </DialogDescription>
          </DialogHeader>
          {statusActionError ? (
            <div
              role="alert"
              className="rounded-md border border-destructive/30 bg-destructive/10 p-3 text-sm font-medium text-destructive"
            >
              {statusActionError}
            </div>
          ) : null}
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              disabled={isDisabling}
              onClick={() => setDisableUserTarget(null)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant={
                disableUserTarget?.status === "inactive"
                  ? "default"
                  : "destructive"
              }
              disabled={isDisabling}
              onClick={confirmDisableUser}
            >
              {isDisabling
                ? disableUserTarget?.status === "inactive"
                  ? "Enabling..."
                  : "Disabling..."
                : disableUserTarget?.status === "inactive"
                  ? "Enable"
                  : "Disable"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={Boolean(deleteUserTarget)}
        onOpenChange={(open) => {
          if (!open && !isDeleting) {
            setDeleteUserTarget(null)
            setDeleteError("")
          }
        }}
      >
        <DialogContent showCloseButton={!isDeleting}>
          <DialogHeader>
            <DialogTitle>Remove user?</DialogTitle>
            <DialogDescription>
              {deleteUserTarget
                ? `${getFullName(deleteUserTarget)} will be removed from this table and will lose access. Their chat history will be preserved.`
                : "This user will be removed from this table and their chat history will be preserved."}
            </DialogDescription>
          </DialogHeader>
          {deleteError ? (
            <div
              role="alert"
              className="rounded-md border border-destructive/30 bg-destructive/10 p-3 text-sm font-medium text-destructive"
            >
              {deleteError}
            </div>
          ) : null}
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              disabled={isDeleting}
              onClick={() => setDeleteUserTarget(null)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              disabled={isDeleting}
              onClick={confirmDeleteUser}
            >
              {isDeleting ? "Removing..." : "Remove user"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

async function readJsonResponse(response, fallbackMessage) {
  const data = await response.json().catch(() => ({}))

  if (!response.ok) {
    throw new Error(data.message ?? fallbackMessage)
  }

  return data
}

async function loadUsers() {
  const response = await fetch("/api/users", {
    cache: "no-store",
    credentials: "same-origin",
  })
  const data = await readJsonResponse(response, "Failed to load users")

  return {
    users: data.users ?? [],
  }
}

async function loadRoles() {
  const response = await fetch("/api/roles", {
    cache: "no-store",
    credentials: "same-origin",
  })
  const data = await readJsonResponse(response, "Failed to load roles")

  return {
    roles: data.roles ?? [],
  }
}

async function updateUser(userId, userData) {
  const response = await fetch(`/api/users/${userId}`, {
    method: "PUT",
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  })
  const data = await readJsonResponse(response, "Failed to update user")

  return data.user
}

async function createUser(userData) {
  const response = await fetch("/api/users", {
    method: "POST",
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  })
  const data = await readJsonResponse(response, "Failed to create user")

  return data.user
}

async function deleteUser(userId) {
  const response = await fetch(`/api/users/${userId}`, {
    method: "DELETE",
    credentials: "same-origin",
  })
  const data = await readJsonResponse(response, "Failed to delete user")

  return data.user
}

async function updateUserStatus(userId, action) {
  const response = await fetch(`/api/users/${userId}`, {
    method: "PATCH",
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ action }),
  })
  const data = await readJsonResponse(
    response,
    `Failed to ${action} user`,
  )

  return data.user
}
