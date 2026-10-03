import { resolveItemImageUrl } from "@/lib/api/itemsApi"

export function getCatalogProducts(items = []) {
  return items.map(item => ({
    ...item,
    id: String(item.ITEMNMBR ?? item.itemnmbr ?? item.id ?? "").trim(),
    name: item.ItemName ?? item.itemName ?? item.ITEMDESC ?? item.name ?? "",
    price: Number(item.QTYBSUOM ?? item.qtybsuom ?? item.price ?? 0),
    unit: item.UOMSCHDL ?? item.uomschdl ?? item.unit ?? "",
    image: item.image ?? item.Image ?? item.IMAGE,
  }))
}

export function findCatalogProduct(productId, items = []) {
  return getCatalogProducts(items).find(product => product.id === String(productId).trim() || product.slug === productId)
}

export function getProductGalleryImages(product) {
  if (!product) return []
  return [...new Set([product.image, ...(product.images ?? [])].map(resolveItemImageUrl).filter(Boolean))].slice(0, 5)
}
