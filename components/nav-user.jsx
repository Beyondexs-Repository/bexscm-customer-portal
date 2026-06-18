"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  ChevronsUpDownIcon,
  BadgeCheckIcon,
  LogOutIcon,
} from "lucide-react";
import Link from "next/link";

export function getFallbackProfile() {
  return {
    firstName: "Store",
    lastName: "Manager",
    email: "",
    avatar: "",
    roleName: "Store Manager",
    roleKey: "store-manager",
  };
}

export function getFullName(profile) {
  return [profile.firstName, profile.lastName].filter(Boolean).join(" ");
}

export function getInitials(profile) {
  return `${profile.firstName?.[0] ?? ""}${profile.lastName?.[0] ?? ""}`.toUpperCase();
}

export function NavUser({ user }) {
  const { isMobile } = useSidebar();
  const router = useRouter();
  const t = useTranslations("userMenu");

  const [profile, setProfile] = useState(getFallbackProfile);

  const profileUser = {
    name: getFullName(profile) || user?.name || "User",
    phone: profile.phone || user?.phone || "",
    avatar: profile.avatar || user?.avatar || "",
    roleName: profile.roleName || user?.roleName || "User",
    roleKey: profile.roleKey || user?.roleKey || "",
  };

  useEffect(() => {
    let active = true;

    function applyProfile(nextProfile) {
      setProfile({
        firstName: nextProfile.firstName ?? "",
        lastName: nextProfile.lastName ?? "",
        phone: nextProfile.phone ?? "",
        avatar: nextProfile.avatar ?? "",
        roleName: nextProfile.roleName ?? "",
        roleKey: nextProfile.roleKey ?? "",
      });
    }

    async function loadProfile() {
      try {
        const response = await fetch("/api/profile", {
          cache: "no-store",
          credentials: "same-origin",
        });

        if (!response.ok) return;

        const data = await response.json();

        if (active && data.profile) {
          applyProfile(data.profile);
        }
      } catch {
        if (active) {
          setProfile(getFallbackProfile());
        }
      }
    }

    function handleProfileUpdated(event) {
      if (active && event.detail) {
        applyProfile(event.detail);
      }
    }

    window.addEventListener("aloha-profile-updated", handleProfileUpdated);
    loadProfile();

    return () => {
      active = false;
      window.removeEventListener("aloha-profile-updated", handleProfileUpdated);
    };
  }, []);

  function clearCookie(value) {
    window.document.cookie = value;
  }

  function handleLogout() {
    clearCookie("aloha-login-verified=; path=/; max-age=0; SameSite=Lax");
    clearCookie("aloha-login-route=; path=/; max-age=0; SameSite=Lax");
    clearCookie("aloha-login-user-id=; path=/; max-age=0; SameSite=Lax");
    clearCookie("aloha-login-role=; path=/; max-age=0; SameSite=Lax");
    clearCookie("aloha-login-phone=; path=/; max-age=0; SameSite=Lax");

    router.replace("/login");
  }

  const initials = getInitials(profile) || "U";

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage src={profileUser.avatar} alt={profileUser.name} />
                <AvatarFallback className="rounded-lg">
                  {initials}
                </AvatarFallback>
              </Avatar>

              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">
                  {profileUser.name}
                </span>
                <span className="truncate text-xs text-muted-foreground">
                  {profileUser.roleName}
                </span>
              </div>

              <ChevronsUpDownIcon className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            className="w-fit"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={profileUser.avatar} alt={profileUser.name} />
                  <AvatarFallback className="rounded-lg">
                    {initials}
                  </AvatarFallback>
                </Avatar>

                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">
                    {profileUser.name}
                  </span>
                  <span className="truncate text-xs">
                    {profileUser.phone}
                  </span>
                </div>
              </div>
            </DropdownMenuLabel>

            <DropdownMenuSeparator />

            <DropdownMenuGroup>
              <DropdownMenuItem asChild>
                <Link href="/profile" className="flex items-center gap-2">
                  <BadgeCheckIcon />
                  {t("myProfile")}
                </Link>
              </DropdownMenuItem>
            </DropdownMenuGroup>

            <DropdownMenuSeparator />

            <DropdownMenuItem onClick={handleLogout}>
              <LogOutIcon />
              {t("logOut")}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
