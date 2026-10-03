"use client"

import { useSearchParams } from "next/navigation"

import { ProductDetails } from "@/components/Catalog/ProductDetails"

export function ProductDetailsPageClient() {
  const searchParams = useSearchParams()
  const productId = searchParams.get("id") ?? ""

  return <ProductDetails productId={productId} backHref="/catalog" />
}
