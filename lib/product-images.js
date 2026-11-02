import { resolveItemImageUrl } from "@/lib/api/itemsApi"
import { getCategoryPlaceholderImage } from "@/lib/category-placeholder-images"

function firstValue(...values) {
  return values.map(value => String(value ?? "").trim())
    .find(value => value && !/^(null|undefined)$/i.test(value)) || ""
}

function itemNumber(item) {
  return firstValue(item.itemNumber, item.ItemNumber, item.sku, item.SKU,
    item.ITEMNMBR, item.itemnmbr, item.itemCode, item.id)
}

function category(item) {
  return firstValue(item.MainGroup, item.mainGroup, item.category, item.Category)
}

function actualImage(...values) {
  return values.map(resolveItemImageUrl).find(image => image && !(
    image.startsWith("data:image/svg+xml;charset=UTF-8,") &&
    image.includes(encodeURIComponent('viewBox="0 0 720 520"'))
  ))
}

// Catalog category is authoritative, including when a cart stores an older placeholder.
export function getProductImage(item = {}, catalogItems = [], source = "") {
  const number = itemNumber(item)
  const catalogItem = (number && catalogItems.find(entry => itemNumber(entry) === number)) || {}
  const fallback = getCategoryPlaceholderImage(category(catalogItem) || category(item))
  const image = actualImage(source, item.image, item.Image, item.IMAGE,
    catalogItem.image, catalogItem.Image, catalogItem.IMAGE) || fallback
  return { image, fallback }
}
