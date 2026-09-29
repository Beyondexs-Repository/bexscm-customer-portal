"use client"

import { useState } from "react"
import { Package2 } from "lucide-react"

import { cn } from "@/lib/utils"
import { resolveItemImageUrl } from "@/lib/api/itemsApi"
import { getCategoryPlaceholderImage } from "@/lib/category-placeholder-images"

export default function ItemImage({ item, className }) {
  const resolvedImg = resolveItemImageUrl(item?.image)          // "" / null -> null
  const categoryFallback = getCategoryPlaceholderImage(item?.category)
  const initialImage = resolvedImg || categoryFallback

  const [imgSrc, setImgSrc] = useState(initialImage)
  const [prevInitial, setPrevInitial] = useState(initialImage)

  if (prevInitial !== initialImage) {
    setPrevInitial(initialImage)
    setImgSrc(initialImage)
  }

  return (
    <div
      className={cn(
        "relative shrink-0 overflow-hidden rounded-md border bg-muted",
        className,
      )}
    >
      <div className="absolute inset-0 grid place-items-center text-primary/70">
        <Package2 className="size-5" />
      </div>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={imgSrc}
        alt={item?.name || "Item"}
        className="absolute inset-0 size-full object-cover"
        onError={() => {
          if (imgSrc !== categoryFallback) setImgSrc(categoryFallback)   // 404 -> placeholder
        }}
      />
    </div>
  )
}