import { Suspense } from "react"

import { ProductDetailsPageClient } from "@/components/Catalog/ProductDetailsPageClient"

export default function BackofficeProductDetailsPage() {
  return (
    <Suspense>
      <ProductDetailsPageClient />
    </Suspense>
  )
}
