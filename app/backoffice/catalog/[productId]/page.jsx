import { ProductDetails } from "@/components/Catalog/ProductDetails"
import { getCatalogProducts } from "@/lib/catalog-products"

export function generateStaticParams() {
  return getCatalogProducts().map((product) => ({
    productId: product.id,
  }))
}

export default async function BackofficeProductDetailsPage({ params }) {
  const { productId } = await params

  return <ProductDetails productId={productId} />
}
