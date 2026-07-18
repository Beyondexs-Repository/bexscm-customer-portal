import { Suspense } from "react"

import PromotionsPageClient from "@/components/promotions/PromotionsPageClient"

export default function Page() {
  return (
    <Suspense>
      <PromotionsPageClient />
    </Suspense>
  )
}
