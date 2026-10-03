import { Suspense } from "react"

import { ProductDetailsPageClient } from "@/components/Catalog/ProductDetailsPageClient"

export default function ProductDetailsPage() {
  return (
    <Suspense>
      <ProductDetailsPageClient />
    </Suspense>
  )
}
