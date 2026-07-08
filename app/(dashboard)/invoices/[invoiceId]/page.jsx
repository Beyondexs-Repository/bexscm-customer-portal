import InvoiceDetails from "@/components/invoices/InvoiceDetails"

export default async function InvoiceDetailsPage({ params, searchParams }) {
  const { invoiceId } = await params
  const query = await searchParams
  const page = Number.parseInt(query.page, 10) || 1
  const requestedPageSize = Number.parseInt(query.rows, 10)
  const pageSize = [5, 10, 20, 50, 100].includes(requestedPageSize)
    ? requestedPageSize
    : 5

  return <InvoiceDetails invoiceId={invoiceId} page={page} pageSize={pageSize} />
}
