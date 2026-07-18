import invoiceLines from "@/data/livedata/Invoices.json"
import invoiceStatuses from "@/data/livedata/InvoicesStatus.json"

const clean = (value) => String(value ?? "").trim()

function formatDate(value) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value))
}

function roundUnits(value) {
  return Number(Number(value).toFixed(2))
}

export function getInvoices() {
  const statusesByInvoice = new Map(
    invoiceStatuses.map((invoice) => [clean(invoice.InvoiceNumber), invoice]),
  )
  const invoicesByNumber = new Map()

  for (const line of invoiceLines) {
    const invoiceNumber = clean(line.InvoiceNumber)
    const status = statusesByInvoice.get(invoiceNumber)

    if (!invoiceNumber || !status) continue

    const invoice = invoicesByNumber.get(invoiceNumber)

    if (invoice) {
      invoice.itemCount += 1
      invoice.units += Number(line.ShippedQuantity) || 0
      continue
    }

    const total = Number(line.OrderAmount) || 0
    const balance = Number(status.Balance) || 0
    const paidAmount = Number(status.PaidAmount)

    invoicesByNumber.set(invoiceNumber, {
      id: invoiceNumber,
      invoiceNumber,
      customerId: clean(line.CustomerID),
      invoiceDate: line.InvoiceDate,
      invoiceDateLabel: formatDate(line.InvoiceDate),
      dueDateLabel: formatDate(line.DueDate),
      itemCount: 1,
      units: Number(line.ShippedQuantity) || 0,
      total,
      paidAmount: Number.isFinite(paidAmount)
        ? paidAmount
        : Math.max(total - balance, 0),
      balance,
      status: clean(status.Status) || "Open",
      statusTone: clean(status.Status) === "PartiallyPaid" ? "orange" : "blue",
    })
  }

  return [...invoicesByNumber.values()].sort(
    (a, b) => new Date(b.invoiceDate) - new Date(a.invoiceDate),
  ).map((invoice) => ({
    ...invoice,
    units: roundUnits(invoice.units),
  }))
}

export function getRecentInvoices(limit = 5) {
  return getInvoices().slice(0, limit)
}
