"use client"

import { usePathname, useSearchParams } from "next/navigation"

import { ProductDetails } from "@/components/Catalog/ProductDetails"

export function ProductDetailsPageClient() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const productId = searchParams.get("id") ?? ""
  const catalogPath = pathname.startsWith("/backoffice")
    ? "/backoffice/catalog"
    : "/catalog"

  return <ProductDetails productId={productId} backHref={catalogPath} />
}
