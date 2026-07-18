import { Suspense } from "react"

import InvoiceDetailsPageClient from "@/components/invoices/InvoiceDetailsPageClient"

export default function InvoiceDetailsPage() {
  return (
    <Suspense>
      <InvoiceDetailsPageClient />
    </Suspense>
  )
}
