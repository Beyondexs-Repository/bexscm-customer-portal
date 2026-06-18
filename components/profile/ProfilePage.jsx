"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { Camera, Pencil, Save } from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const EMPTY_PROFILE = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  avatar: "",
}

function getFullName(profile) {
  return [profile.firstName, profile.lastName].filter(Boolean).join(" ")
}

function getInitials(profile) {
  const initials = `${profile.firstName?.[0] ?? ""}${profile.lastName?.[0] ?? ""}`

  return initials.toUpperCase() || "U"
}

export default function ProfilePage() {
  const fileInputRef = useRef(null)
  const [profile, setProfile] = useState(EMPTY_PROFILE)
  const [draftProfile, setDraftProfile] = useState(EMPTY_PROFILE)
  const [isEditing, setIsEditing] = useState(false)
  const [fileError, setFileError] = useState("")
  const [profileError, setProfileError] = useState("")

  const previewProfile = isEditing ? draftProfile : profile
  const initials = useMemo(() => getInitials(previewProfile), [previewProfile])
  const fullName = useMemo(() => getFullName(previewProfile), [previewProfile])

  useEffect(() => {
    let active = true

    async function loadProfile() {
      try {
        const response = await fetch("/api/profile", {
          cache: "no-store",
          credentials: "same-origin",
        })

        if (!response.ok) {
          throw new Error("Failed to load profile")
        }

        const data = await response.json()
        const nextProfile = data.profile ?? EMPTY_PROFILE

        if (active) {
          setProfile(nextProfile)
          setDraftProfile(nextProfile)
          setProfileError("")
        }
      } catch {
        if (active) {
          setProfileError("Unable to load the logged-in profile.")
        }
      }
    }

    loadProfile()

    return () => {
      active = false
    }
  }, [])

  function updateDraft(field, value) {
    setDraftProfile((currentProfile) => ({
      ...currentProfile,
      [field]: value,
    }))
  }

  function handleAvatarButtonClick() {
    setIsEditing(true)
    fileInputRef.current?.click()
  }

  function handleAvatarChange(event) {
    const file = event.target.files?.[0]
    setFileError("")

    if (!file) return

    const acceptedTypes = ["image/jpeg", "image/png", "image/svg+xml"]

    if (!acceptedTypes.includes(file.type)) {
      setFileError("Use JPG, PNG, or SVG.")
      event.target.value = ""
      return
    }

    if (file.size > 2 * 1024 * 1024) {
      setFileError("Max size is 2MB.")
      event.target.value = ""
      return
    }

    const reader = new FileReader()
    reader.onload = () => {
      updateDraft("avatar", reader.result)
    }
    reader.readAsDataURL(file)
  }

  function handleCancel() {
    setDraftProfile(profile)
    setIsEditing(false)
    setFileError("")
    setProfileError("")
  }

  async function handleSave() {
  try {
    const payload = {
      firstName: draftProfile.firstName,
      lastName: draftProfile.lastName,
      email: draftProfile.email,
      avatar: draftProfile.avatar,
    };

    const response = await fetch("/api/profile", {
      method: "PUT",
      credentials: "same-origin",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(data.message ?? "Failed to save profile");
    }

    const nextProfile = data.profile ?? EMPTY_PROFILE;

    setProfile(nextProfile);
    setDraftProfile(nextProfile);
    setIsEditing(false);
    setFileError("");
    setProfileError("");
    window.dispatchEvent(
      new CustomEvent("aloha-profile-updated", {
        detail: nextProfile,
      }),
    );
  } catch (error) {
    setProfileError(error.message ?? "Unable to save profile changes.");
  }
}

  return (
    <main className="min-h-full bg-muted/30 p-2 sm:p-4 lg:p-6">
      <div className="mx-auto flex w-full max-w-3xl flex-col">
        <Card className="w-full overflow-hidden border bg-card shadow-sm py-0">
          <CardHeader className="flex flex-row items-center justify-between gap-3 border-b px-4 py-4 sm:px-6">
            <CardTitle className="text-base font-semibold">
              Profile Information
            </CardTitle>

            <div className="flex items-center gap-3">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                <span className="size-1.5 rounded-full bg-emerald-500" />
                Active
              </span>
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => setIsEditing(true)}
              >
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
                    <AvatarImage src={previewProfile.avatar} alt={fullName} />
                    <AvatarFallback className="text-2xl font-semibold">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <Button
                    type="button"
                    size="icon-sm"
                    className="absolute bottom-1 right-0 rounded-full shadow-sm"
                    onClick={handleAvatarButtonClick}
                    aria-label="Upload profile avatar"
                  >
                    <Camera className="size-4" />
                  </Button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/svg+xml"
                    className="sr-only"
                    onChange={handleAvatarChange}
                  />
                </div>
                <p className="max-w-36 text-xs leading-relaxed text-muted-foreground">
                  JPG, PNG or SVG. Max size 2MB.
                </p>
                {fileError ? (
                  <p className="text-xs font-medium text-destructive">
                    {fileError}
                  </p>
                ) : null}
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label
                    htmlFor="first-name"
                    className="text-xs font-medium text-muted-foreground"
                  >
                    First Name
                  </Label>
                  <Input
                    id="first-name"
                    value={draftProfile.firstName}
                    onChange={(event) =>
                      updateDraft("firstName", event.target.value)
                    }
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="last-name"
                    className="text-xs font-medium text-muted-foreground"
                  >
                    Last Name
                  </Label>
                  <Input
                    id="last-name"
                    value={draftProfile.lastName}
                    onChange={(event) =>
                      updateDraft("lastName", event.target.value)
                    }
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="email"
                    className="text-xs font-medium text-muted-foreground"
                  >
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={draftProfile.email}
                    onChange={(event) => updateDraft("email", event.target.value)}
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="phone"
                    className="text-xs font-medium text-muted-foreground"
                  >
                    Phone Number
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={draftProfile.phone}
                    disabled
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-col-reverse justify-end gap-3 border-t p-4 sm:flex-row sm:px-6">
              {profileError ? (
                <p className="mr-auto text-sm font-medium text-destructive">
                  {profileError}
                </p>
              ) : null}
              <Button
                type="button"
                variant="secondary"
                className="sm:min-w-24"
                onClick={handleCancel}
                disabled={!isEditing}
              >
                Cancel
              </Button>
              <Button
                type="button"
                className="sm:min-w-32"
                onClick={handleSave}
                disabled={!isEditing}
              >
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
