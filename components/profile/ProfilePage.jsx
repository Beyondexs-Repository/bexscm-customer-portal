"use client"

import { useEffect, useMemo, useState } from "react"
import { useTranslations } from "next-intl"
import { Mail, Phone } from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"

const PROFILE_STORAGE_KEY = "aloha.profile.v1"

const DEFAULT_PROFILE = {
  name: "Crate Inc.",
  email: "hello@crateinc.com",
  phone: "+1 (555) 123-4567",
  avatar: "",
}

function getInitialProfile() {
  if (typeof window === "undefined") return DEFAULT_PROFILE

  try {
    const stored = JSON.parse(window.localStorage.getItem(PROFILE_STORAGE_KEY))
    return {
      ...DEFAULT_PROFILE,
      ...(stored && typeof stored === "object" ? stored : {}),
    }
  } catch {
    return DEFAULT_PROFILE
  }
}

function getInitials(name) {
  return name
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase()
}

export default function ProfilePage() {
  const t = useTranslations("profilePage")
  const [profile, setProfile] = useState(DEFAULT_PROFILE)

  useEffect(() => {
    const initial = getInitialProfile()
    setProfile(initial)
  }, [])

  useEffect(() => {
    window.localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profile))
  }, [profile])

  const initials = useMemo(() => getInitials(profile.name), [profile.name])

  return (
    <main className="min-h-full bg-muted/30 p-2 sm:p-4 lg:p-6">
      <div className="mx-auto flex w-full max-w-4xl flex-col">
        <Card className="mx-auto w-full max-w-3xl overflow-hidden border bg-card shadow-sm">
          <CardContent className="relative p-4 sm:p-6">
            <div className="absolute right-4 top-4 z-10 sm:right-6 sm:top-6">
              <div className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                {t("active")}
              </div>
            </div>

            <div className="flex flex-col items-center gap-4 pt-4 text-center md:flex-row md:items-center md:text-left">
              <div className="relative w-fit shrink-0">
                <Avatar className="size-20 ring-1 ring-border sm:size-24">
                  <AvatarImage src={profile.avatar} alt={profile.name} />
                  <AvatarFallback className="text-lg font-semibold">
                    {initials}
                  </AvatarFallback>
                </Avatar>
              </div>

              <div className="min-w-0 flex-1">
                <div className="space-y-1">
                  <div className="truncate text-xl font-semibold sm:text-2xl">
                    {profile.name}
                  </div>
                  <div className="flex flex-col gap-1 text-sm text-muted-foreground  ">
                    <span className="flex items-center gap-2">
                      <Mail className="size-4 shrink-0" />
                      <span className="truncate">{profile.email}</span>
                    </span>
                    <span className="flex items-center gap-2">
                      <Phone className="size-4 shrink-0" />
                      <span>{profile.phone}</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
