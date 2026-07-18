import { Suspense } from "react"

import InvoicesPageClient from "@/components/invoices/InvoicesPageClient"

export default function InvoicesPage() {
  return (
    <Suspense>
      <InvoicesPageClient />
    </Suspense>
  )
}
