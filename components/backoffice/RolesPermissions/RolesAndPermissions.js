"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ChevronRight,
  Loader2,
  Plus,
  Search,
  ShieldCheck,
  UserRoundCog,
  Users,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

function formatUserType(userType) {
  return userType === "customer" ? "Customer Portal" : "System";
}

function getRoleIcon(userType) {
  return userType === "customer" ? Users : UserRoundCog;
}

export default function RolesAndPermissions() {
  const [roles, setRoles] = useState([]);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadRoles() {
      try {
        const response = await fetch("/api/roles", {
          cache: "no-store",
          credentials: "same-origin",
        });
        const data = await response.json().catch(() => ({}));

        if (!response.ok) {
          throw new Error(data.message ?? "Failed to load roles.");
        }

        if (active) {
          setRoles(data.roles ?? []);
          setError("");
        }
      } catch (loadError) {
        if (active) {
          setError(loadError.message);
        }
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    }

    loadRoles();

    return () => {
      active = false;
    };
  }, []);

  const filteredRoles = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return roles;

    return roles.filter((role) =>
      `${role.name} ${role.key} ${role.userType}`.toLowerCase().includes(query)
    );
  }, [roles, search]);

  return (
    <section className="grid min-h-full gap-4 lg:grid-cols-[minmax(280px,420px)_1fr]">
      <div className="rounded-lg border bg-card shadow-sm">
        <div className="flex items-center justify-between gap-3 border-b p-4">
          <div>
            <h2 className="text-lg font-semibold">Roles</h2>
            <p className="mt-1 text-xs text-muted-foreground">
              Loaded from the roles table.
            </p>
          </div>
          <Button size="sm">
            <Plus className="size-4" />
            Add Role
          </Button>
        </div>

        <div className="border-b p-3">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search roles..."
              className="h-10 pl-9"
            />
          </div>
        </div>

        {error ? (
          <div className="m-3 rounded-md border border-destructive/30 bg-destructive/10 p-3 text-sm font-medium text-destructive">
            {error}
          </div>
        ) : null}

        <div className="divide-y">
          {isLoading ? (
            <div className="flex min-h-48 items-center justify-center text-sm text-muted-foreground">
              <Loader2 className="mr-2 size-4 animate-spin" />
              Loading roles
            </div>
          ) : filteredRoles.length ? (
            filteredRoles.map((role) => {
              const Icon = getRoleIcon(role.userType);

              return (
                <button
                  key={role.id}
                  type="button"
                  className="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-muted/60"
                >
                  <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
                    <Icon className="size-4" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-semibold">
                      {role.name}
                    </span>
                    <span className="mt-0.5 block truncate text-xs text-muted-foreground">
                      {formatUserType(role.userType)}
                    </span>
                  </span>
                  <ChevronRight className="size-4 shrink-0 text-muted-foreground" />
                </button>
              );
            })
          ) : (
            <div className="p-8 text-center text-sm text-muted-foreground">
              No roles found.
            </div>
          )}
        </div>

        {!isLoading && !error ? (
          <div className="border-t px-4 py-3 text-xs text-muted-foreground">
            Showing {filteredRoles.length} of {roles.length} roles
          </div>
        ) : null}
      </div>

      <div className="rounded-lg border bg-card p-4 shadow-sm">
        <div className="flex items-center justify-between gap-3 border-b pb-4">
          <div>
            <h2 className="text-lg font-semibold">Role Types</h2>
            <p className="mt-1 text-xs text-muted-foreground">
              `user_type` is now read from the roles table.
            </p>
          </div>
          <ShieldCheck className="size-5 text-primary" />
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <div className="rounded-lg border p-4">
            <Badge variant="secondary">internal</Badge>
            <p className="mt-3 text-sm font-semibold">System roles</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Backoffice users such as admins, sales, owners, and AR teams.
            </p>
          </div>
          <div className="rounded-lg border p-4">
            <Badge variant="outline">customer</Badge>
            <p className="mt-3 text-sm font-semibold">Customer portal roles</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Store Manager and Store Employee are fetched as customer roles.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
