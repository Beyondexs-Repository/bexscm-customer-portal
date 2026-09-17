import catalog from "@/data/data.json"
import { resolveItemImageUrl } from "@/lib/api/itemsApi"

export const productImages = [
  "https://images.unsplash.com/photo-1608198093002-ad4e005484ec?auto=format&fit=crop&w=720&q=80",
  "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=720&q=80",
  "https://images.unsplash.com/photo-1586444248902-2f64eddc13df?auto=format&fit=crop&w=720&q=80",
  "https://images.unsplash.com/photo-1505253716362-afaea1d3d1af?auto=format&fit=crop&w=720&q=80",
  "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=720&q=80",
  "https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?auto=format&fit=crop&w=720&q=80",
  "https://images.unsplash.com/photo-1604503468506-a8da13d82791?auto=format&fit=crop&w=720&q=80",
  "https://images.unsplash.com/photo-1515543237350-b3eea1ec8082?auto=format&fit=crop&w=720&q=80",
  "https://images.unsplash.com/photo-1551028150-64b9f398f678?auto=format&fit=crop&w=720&q=80",
  "https://images.unsplash.com/photo-1519996529931-28324d5a630e?auto=format&fit=crop&w=720&q=80",
  "https://images.unsplash.com/photo-1518843875459-f738682238a6?auto=format&fit=crop&w=720&q=80",
  "https://images.unsplash.com/photo-1563636619-e9143da7973b?auto=format&fit=crop&w=720&q=80",
]

export function getCatalogProducts() {
  return catalog.flatMap((category, categoryIndex) =>
    category.subcategories.flatMap((subcategory, subcategoryIndex) =>
      subcategory.products.map((product, productIndex) => ({
        ...product,
        category: product.category || category.name,
        categorySlug: category.slug,
        subcategory: product.subcategory || subcategory.name,
        subcategorySlug: subcategory.slug,
        fallbackImageIndex: categoryIndex + subcategoryIndex + productIndex,
      })),
    ),
  )
}

export function findCatalogProduct(productId) {
  return getCatalogProducts().find(
    (product) => product.id === productId || product.slug === productId,
  )
}

export function getProductGalleryImages(product) {
  if (!product) return []

  const fallbackIndex = product.fallbackImageIndex ?? 0
  const fallbacks = [
    productImages[fallbackIndex % productImages.length],
    productImages[(fallbackIndex + 1) % productImages.length],
    productImages[(fallbackIndex + 2) % productImages.length],
  ]

  const rawMainImage = product.image ? resolveItemImageUrl(product.image) || product.image : null
  const productImagePaths = [rawMainImage, ...(product.images ?? [])].filter(
    (image) => Boolean(image) && /^https?:\/\//.test(image),
  )

  return [...new Set([...productImagePaths, ...fallbacks])]
    .filter(Boolean)
    .slice(0, 5)
}
