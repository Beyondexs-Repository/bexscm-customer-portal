"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useRef, useState } from "react"
import {
  ArrowLeft,
  ImageIcon,
  Save,
  UploadCloud,
  X,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"

const emptyForm = {
  name: "",
  title: "",
  description: "",
  startDate: "",
  endDate: "",
  showAction: true,
  actionLabel: "Browse Catalog",
  actionUrl: "/catalog",
}

export default function CreatePromotion() {
  const router = useRouter()
  const [form, setForm] = useState(emptyForm)
  const [bannerImage, setBannerImage] = useState("")
  const [imageName, setImageName] = useState("")
  const [imageError, setImageError] = useState("")
  const [isDragging, setIsDragging] = useState(false)
  const imageInputRef = useRef(null)

  function loadImage(file) {
    if (!file) return

    if (file.size > 5 * 1024 * 1024) {
      setBannerImage("")
      setImageName("")
      setImageError("Image must be 5 MB or smaller.")
      return
    }

    const reader = new FileReader()
    reader.onload = () => setBannerImage(reader.result)
    reader.readAsDataURL(file)
    setImageName(file.name)
    setImageError("")
  }

  function handleSubmit(event) {
    event.preventDefault()

    if (!bannerImage) {
      setImageError("Add a banner image before creating the promotion.")
      return
    }

    const promotion = {
      id: Date.now(),
      name: form.name,
      headline: form.title || "Image-Only Banner",
      description: form.description,
      placement: "Home Hero",
      imageName,
      actionLabel: form.showAction ? form.actionLabel : "",
      actionUrl: form.showAction ? form.actionUrl : "",
      schedule:
        form.startDate && form.endDate
          ? `${form.startDate} – ${form.endDate}`
          : "No End Date",
      active: true,
    }

    router.push(
      `/backoffice/promotions?created=${encodeURIComponent(JSON.stringify(promotion))}`,
    )
  }

  return (
    <main className="p-2 sm:p-4">
      <div className="mx-auto w-full max-w-5xl">
        <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
          <Button asChild variant="ghost" className="-ml-2">
            <Link href="/backoffice/promotions">
              <ArrowLeft />
              Back
            </Link>
          </Button>
          <div className="flex items-center gap-2">
            <Button asChild variant="outline">
              <Link href="/backoffice/promotions">Cancel</Link>
            </Button>
            <Button type="submit" form="promotion-form">
              <Save />
              Save
            </Button>
          </div>
        </div>

        <Card>
        <CardHeader className="border-b">
          <CardTitle>Create Promotion</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            id="promotion-form"
            className="grid gap-4 md:grid-cols-2 [&_[data-slot=input]]:h-9"
            onSubmit={handleSubmit}
          >
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="promotion-name">Campaign Name</Label>
              <Input
                id="promotion-name"
                required
                placeholder="Summer Produce Sale"
                value={form.name}
                onChange={(event) =>
                  setForm({ ...form, name: event.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="promotion-start">Start Date</Label>
              <Input
                id="promotion-start"
                type="date"
                value={form.startDate}
                onChange={(event) =>
                  setForm({ ...form, startDate: event.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="promotion-end">End Date</Label>
              <Input
                id="promotion-end"
                type="date"
                min={form.startDate}
                value={form.endDate}
                onChange={(event) =>
                  setForm({ ...form, endDate: event.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="promotion-title">Title (Optional)</Label>
              <textarea
                id="promotion-title"
                rows={3}
                placeholder="Save 20% on Fresh Produce"
                className="h-20 w-full resize-none rounded-lg border border-input bg-transparent px-2.5 py-2 text-sm outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30"
                value={form.title}
                onChange={(event) =>
                  setForm({ ...form, title: event.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="promotion-description">
                Description (Optional)
              </Label>
              <textarea
                id="promotion-description"
                rows={3}
                placeholder="Quality products. Better prices. Every week."
                className="h-20 w-full resize-none rounded-lg border border-input bg-transparent px-2.5 py-2 text-sm outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30"
                value={form.description}
                onChange={(event) =>
                  setForm({ ...form, description: event.target.value })
                }
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="promotion-image">Banner Image</Label>
              <Input
                ref={imageInputRef}
                id="promotion-image"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="sr-only"
                onChange={(event) => loadImage(event.target.files?.[0])}
              />
              <div
                role="button"
                tabIndex={0}
                aria-label={
                  bannerImage
                    ? "Replace banner image"
                    : "Upload banner image"
                }
                className={`relative flex h-64 w-full cursor-pointer items-center justify-center overflow-hidden rounded-xl border-2 border-dashed bg-muted/30 text-muted-foreground transition-colors hover:border-primary/60 hover:bg-muted/50 sm:h-60 ${
                  isDragging ? "border-primary bg-primary/5" : ""
                }`}
                style={
                  bannerImage
                    ? {
                        backgroundImage: `url(${bannerImage})`,
                        backgroundPosition: "center",
                        backgroundSize: "cover",
                      }
                    : undefined
                }
                onClick={() => imageInputRef.current?.click()}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault()
                    imageInputRef.current?.click()
                  }
                }}
                onDragEnter={(event) => {
                  event.preventDefault()
                  setIsDragging(true)
                }}
                onDragOver={(event) => event.preventDefault()}
                onDragLeave={() => setIsDragging(false)}
                onDrop={(event) => {
                  event.preventDefault()
                  setIsDragging(false)
                  loadImage(event.dataTransfer.files?.[0])
                }}
              >
                {bannerImage ? (
                  <>
                    <div className="absolute inset-0 bg-black/0 transition-colors hover:bg-black/20" />
                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-black/70 px-3 py-1.5 text-xs font-medium text-white">
                      Drop or Click to Replace
                    </div>
                    <Button
                      type="button"
                      variant="secondary"
                      size="icon"
                      aria-label="Remove banner image"
                      className="absolute right-3 top-3 z-10 rounded-full shadow-md"
                      onClick={(event) => {
                        event.stopPropagation()
                        setBannerImage("")
                        setImageName("")
                        setImageError("")
                        if (imageInputRef.current) {
                          imageInputRef.current.value = ""
                        }
                      }}
                    >
                      <X />
                    </Button>
                  </>
                ) : (
                  <div className="p-4 text-center">
                    {isDragging ? (
                      <ImageIcon className="mx-auto size-9 text-primary" />
                    ) : (
                      <UploadCloud className="mx-auto size-9" />
                    )}
                    <p className="mt-2 text-sm font-semibold text-foreground">
                      {isDragging
                        ? "Drop Image Here"
                        : "Drag and Drop Banner Image"}
                    </p>
                    <p className="mt-1 text-xs">
                      or click to choose a file
                    </p>
                  </div>
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                Recommended: at least 1920 px wide. The banner is 240–256 px
                high and crops responsively. JPG, PNG, or WebP, up to 5 MB.
              </p>
              {imageError ? (
                <p className="text-xs font-medium text-destructive">
                  {imageError}
                </p>
              ) : null}
            </div>

            <div className="flex items-center justify-between gap-4 rounded-lg border p-3 md:col-span-2">
              <Label htmlFor="promotion-show-action">Show Action Button</Label>
              <Switch
                id="promotion-show-action"
                checked={form.showAction}
                onCheckedChange={(showAction) =>
                  setForm({ ...form, showAction })
                }
              />
            </div>

            {form.showAction ? (
              <>
                <div className="space-y-2 md:col-span-1">
                  <Label htmlFor="promotion-action-label">
                    Action Button Text
                  </Label>
                  <Input
                    id="promotion-action-label"
                    required
                    value={form.actionLabel}
                    onChange={(event) =>
                      setForm({ ...form, actionLabel: event.target.value })
                    }
                  />
                </div>

                <div className="space-y-2 md:col-span-1">
                  <Label htmlFor="promotion-action-url">Action Link</Label>
                  <Input
                    id="promotion-action-url"
                    required
                    value={form.actionUrl}
                    onChange={(event) =>
                      setForm({ ...form, actionUrl: event.target.value })
                    }
                  />
                </div>
              </>
            ) : null}

          </form>
        </CardContent>
        </Card>
      </div>
    </main>
  )
}
