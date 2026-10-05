import { apiFetch, buildApiUrl } from "./apiClient"
import { resolveItemImageUrl } from "./itemsApi"
import { getCategoryPlaceholderImage } from "@/lib/category-placeholder-images"
import { findCatalogProduct } from "@/lib/catalog-products"

export const DEFAULT_CUSTNMBR = "400001"
export const DEFAULT_CUSTOMER_ORDERS_URL = buildApiUrl("/customers/400001/orders")

function formatDate(dateValue) {
  if (!dateValue) return "Jun 5, 2026"
  try {
    const d = new Date(dateValue)
    if (isNaN(d.getTime())) return String(dateValue)
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  } catch {
    return String(dateValue)
  }
}

function getStatusTone(statusStr = "") {
  const s = String(statusStr).toLowerCase()
  if (s.includes("delivered") || s.includes("completed")) return "orange"
  if (s.includes("sent") || s.includes("pending") || s.includes("open") || s.includes("created")) return "green"
  if (s.includes("processing") || s.includes("shipped")) return "violet"
  if (s.includes("cancelled") || s.includes("void")) return "slate"
  return "blue"
}

function detectCategory(name = "") {
  const n = String(name).toLowerCase()
  if (n.includes("salmon") || n.includes("shrimp") || n.includes("tuna") || n.includes("crab") || n.includes("seafood")) return "Seafood"
  if (n.includes("steak") || n.includes("beef") || n.includes("ribeye")) return "Beef"
  if (n.includes("chicken") || n.includes("poultry") || n.includes("wing") || n.includes("turkey")) return "Chicken"
  if (n.includes("pork") || n.includes("bacon") || n.includes("ham") || n.includes("sausage")) return "Pork"
  return "Seafood"
}

/**
 * Normalizes raw API order objects to match application Order data schema
 */
export function normalizeOrder(item, index = 0) {
  const orderNumber = String(
    item.orderNumber ?? item.OrderNumber ?? item.SOPNUMBE ?? item.sopnumbe ?? item.id ?? `ORD-${index + 1}`
  ).trim()

  const rawStatus = String(item.status ?? item.Status ?? item.SOPSTATUS ?? item.sopstatus ?? "Order Sent").trim()

  const placedOn = formatDate(
    item.placedOn ?? item.PlacedOn ?? item.DOCDATE ?? item.docdate ?? item.orderDate
  )

  const deliveryDate = formatDate(
    item.deliveryDate ?? item.DeliveryDate ?? item.REQDATE ?? item.reqdate ?? item.shipDate
  )

  const rawTotal = Number(
    item.total ?? item.Total ?? item.DOCAMNT ?? item.docamnt ?? item.orderAmount ?? item.amount ?? 0
  )

  const rawUnits = Number(
    item.units ?? item.Units ?? item.quantity ?? item.Quantity ?? item.qty ?? 1
  )

  const rawItems = Array.isArray(item.items)
    ? item.items
    : Array.isArray(item.lineItems)
    ? item.lineItems
    : []

  const items = rawItems.map((lineItem, idx) => {
    const sku = String(
      lineItem.sku ?? lineItem.SKU ?? lineItem.itemNumber ?? lineItem.ItemNumber ?? lineItem.ITEMNMBR ?? lineItem.ITEMNO ?? lineItem.itemNo ?? ""
    ).trim()

    const rawImage = lineItem.image ?? lineItem.Image ?? lineItem.imageName ?? lineItem.ImageName ?? lineItem.img ?? sku
    const catalogItem = sku ? findCatalogProduct(sku) : null
    let resolvedImg = resolveItemImageUrl(rawImage) || catalogItem?.image

    if (!resolvedImg && sku) {
      resolvedImg = resolveItemImageUrl(`${sku}.png`)
    }

    if (!resolvedImg) {
      const cat = lineItem.category || catalogItem?.category || detectCategory(lineItem.name || lineItem.itemName)
      resolvedImg = getCategoryPlaceholderImage(cat)
    }

    return {
      id: String(lineItem.id ?? sku ?? `item-${idx}`),
      name: String(lineItem.name ?? lineItem.itemName ?? lineItem.ItemName ?? lineItem.ITEMDESC ?? catalogItem?.name ?? "Product Item").trim(),
      brand: String(lineItem.brand ?? lineItem.Brand ?? lineItem.vendorName ?? catalogItem?.brand ?? "Crate Fresh").trim(),
      packSize: String(lineItem.packSize ?? lineItem.PackSize ?? lineItem.uom ?? lineItem.UOM ?? catalogItem?.packSize ?? "Case").trim(),
      sku,
      quantity: Number(lineItem.quantity ?? lineItem.Quantity ?? lineItem.qty ?? lineItem.QTY ?? 1),
      price: Number(lineItem.price ?? lineItem.Price ?? lineItem.unitPrice ?? lineItem.UNITPRCE ?? catalogItem?.price ?? 0),
      image: resolvedImg,
    }
  })

  const customerName = String(
    item.customerName ?? item.CustomerName ?? item.CUSTNAME ?? item.custname ?? "Central Foodservice, Inc."
  ).trim()

  const customerID = String(
    item.customerID ?? item.CustomerID ?? item.custnmbr ?? item.CustNmbr ?? item.custNmbr ?? item.CUSTNMBR ?? item.customerId ?? item.CustomerId ?? "400001"
  ).trim()

  const shipToName = String(
    item.shipToName ?? item.ShipToName ?? item.shipTo ?? item.ShipTo ?? customerName
  ).trim()

  const rawAddress = item.address1 ?? item.Address1
  const addressParts = [
    rawAddress,
    item.city ?? item.City,
    item.state ?? item.State,
    item.zip ?? item.Zip,
  ].filter(Boolean)

  const address1 = addressParts.length > 0
    ? addressParts.join(", ")
    : String(rawAddress ?? item.address ?? "308 Government Road, Mattawa, WA, 99349").trim()

  const salesPerson = String(
    item.salesPerson ?? item.SalesPerson ?? item.salesRep ?? item.SalesRep ?? "Laura Parker"
  ).trim()

  const phone1 = String(
    item.phone1 ?? item.Phone1 ?? item.phone ?? item.Phone ?? "(509) 932-4219"
  ).trim()

  return {
    id: String(item.id ?? orderNumber ?? `ord-${index}`),
    orderNumber,
    status: rawStatus,
    statusTone: item.statusTone || getStatusTone(rawStatus),
    placedOn,
    placedAt: item.placedAt || item.PlacedAt || "12:00 PM",
    deliveryDate,
    type: item.type || item.Source || item.source || "App/Web",
    pricing: item.pricing || item.Pricing || "Confirmed by distributor",
    total: Math.max(0, rawTotal),
    units: Math.max(1, rawUnits),
    customerName,
    customerID,
    shipToName,
    address1,
    salesPerson,
    phone1,
    items,
  }
}

/**
 * Fetch orders for customer from GET /customers/{custnmbr}/orders
 * Uses common base API URL configured in apiClient.js
 * 
 * @param {string} [custnmbr="400001"] Customer Number
 * @returns {Promise<Array>} Normalized list of order objects
 */
export async function fetchCustomerOrdersApi(custnmbr = DEFAULT_CUSTNMBR) {
  const resolvedCust = String(custnmbr || DEFAULT_CUSTNMBR).trim()
  const endpoint = `/customers/${encodeURIComponent(resolvedCust)}/orders`

  const data = await apiFetch(endpoint, { method: "GET" })
  const list = Array.isArray(data) ? data : data.orders || data.data || []
  return list.map((item, idx) => normalizeOrder(item, idx))
}
