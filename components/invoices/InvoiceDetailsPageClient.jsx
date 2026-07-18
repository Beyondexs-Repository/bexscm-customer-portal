"use client"

import { useSearchParams } from "next/navigation"

import InvoiceDetails from "@/components/invoices/InvoiceDetails"

export default function InvoiceDetailsPageClient() {
  const searchParams = useSearchParams()
  const invoiceId = searchParams.get("id") ?? ""

  return <InvoiceDetails invoiceId={invoiceId} />
}
