"use client"

import { Package2 } from "lucide-react"

import { cn } from "@/lib/utils"
import ProductImage from "@/components/product-image"

export default function ItemImage({ item, className }) {
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
      <ProductImage
        item={item}
        className="absolute inset-0 size-full object-cover"
      />
    </div>
  )
}
