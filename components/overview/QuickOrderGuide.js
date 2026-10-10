// "use client"

// import { useState } from "react"
// import Link from "next/link"
// import {
//   BookOpen,
//   ChevronRight,
//   FolderOpen,
//   ShoppingCart,
// } from "lucide-react"
// import { Badge } from "@/components/ui/badge"
// import { Button } from "@/components/ui/button"
// import { useCart, useQuickOrders } from "@/app/context/app-context"

// function getGuideProducts(guide) {
//   return guide.groups.flatMap((group) => group.products)
// }

// export default function QuickOrderGuide() {
//   const { quickOrders, dashboardQuickOrderIds } = useQuickOrders()
//   const { items: cartItems, addItem } = useCart()
//   const [selectedGuideIds, setSelectedGuideIds] = useState([])
//   const cartProductIds = new Set(cartItems.map((item) => item.id))

//   const visibleGuides = dashboardQuickOrderIds
//     .map((id) => quickOrders.find((guide) => guide.id === id))
//     .filter(Boolean)
//     .slice(0, 4)

//   const visibleGuideIds = visibleGuides.map((guide) => guide.id)

//   const selectedIds = selectedGuideIds.filter((id) =>
//     visibleGuideIds.includes(id),
//   )

//   const allSelected =
//     visibleGuides.length > 0 && selectedIds.length === visibleGuides.length

//   const productsById = new Map()

//   quickOrders
//     .filter((guide) => selectedIds.includes(guide.id))
//     .flatMap(getGuideProducts)
//     .forEach((product) => {
//       productsById.set(product.id, product)
//     })

//   const selectedProducts = Array.from(productsById.values())
//   const missingSelectedProducts = selectedProducts.filter(
//     (product) => !cartProductIds.has(product.id),
//   )
//   const selectedProductsAdded =
//     selectedProducts.length > 0 && missingSelectedProducts.length === 0

//   function toggleGuide(guideId) {
//     setSelectedGuideIds((current) =>
//       current.includes(guideId)
//         ? current.filter((id) => id !== guideId)
//         : [...current, guideId],
//     )
//   }

//   function toggleAllGuides() {
//     setSelectedGuideIds(allSelected ? [] : visibleGuideIds)
//   }

//   return (
//     <section className="flex h-full min-h-0 flex-col overflow-hidden rounded-xl border bg-card shadow-sm">
//       <div className="flex items-center justify-between gap-2 border-b px-4 py-4">
//         <div className="flex min-w-0 items-center gap-3">
//           <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-300">
//             <BookOpen className="size-5" />
//           </div>

//           <div className="min-w-0">
//             <h2 className="text-base font-bold sm:text-lg">
//               Quick Order Guides
//             </h2>
//             <p className="truncate text-xs text-muted-foreground">
//               Select guides to add their products
//             </p>
//           </div>
//         </div>

//         <Button asChild variant="outline" size="icon-sm">
//           <Link href="/order-guide" aria-label="Open order guides">
//             <ChevronRight className="size-4" />
//           </Link>
//         </Button>
//       </div>

//       <div className="flex h-full flex-1 flex-col p-3">
//         {visibleGuides.length > 0 ? (
//           <div className="flex-1">
//             <div className="grid gap-2">
//               {visibleGuides.map((guide) => {
//                 const products = getGuideProducts(guide)
//                 const isSelected = selectedIds.includes(guide.id)
//                 const addedCount = products.filter((product) =>
//                   cartProductIds.has(product.id),
//                 ).length
//                 const hasAddedProducts = addedCount > 0
//                 const allGuideProductsAdded =
//                   products.length > 0 && addedCount === products.length

//                 return (
//                   <article
//   key={guide.id}
//   role="button"
//   tabIndex={0}
//   onClick={() => toggleGuide(guide.id)}
//   onKeyDown={(event) => {
//     if (event.key === "Enter" || event.key === " ") {
//       event.preventDefault()
//       toggleGuide(guide.id)
//     }
//   }}
//   className="group flex cursor-pointer items-center gap-2 rounded-lg border bg-background p-3 transition-colors hover:border-primary/30 hover:bg-muted/40"
// >
//                     <input
//     type="checkbox"
//     checked={isSelected}
//     onChange={() => toggleGuide(guide.id)}
//     onClick={(event) => event.stopPropagation()}
//     className="size-4 shrink-0 cursor-pointer rounded border-border accent-primary"
//     aria-label={`Select ${guide.name}`}
//   />

//                     <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
//                       <FolderOpen className="size-4" />
//                     </div>

//                     <div className="min-w-0 flex-1">
//                       <p className="truncate text-sm font-semibold">
//                         {guide.name}
//                       </p>
//                       <p className="mt-0.5 text-[11px] text-muted-foreground">
//                         {guide.groups.length}{" "}
//                         {guide.groups.length === 1 ? "group" : "groups"} ·{" "}
//                         {products.length}{" "}
//                         {products.length === 1 ? "product" : "products"}
//                       </p>
//                     </div>
//                     {hasAddedProducts ? (
//                       <Badge
//                         variant={allGuideProductsAdded ? "default" : "secondary"}
//                         className="ml-auto shrink-0"
//                       >
//                         {allGuideProductsAdded
//                           ? "Added"
//                           : `Added ${addedCount}/${products.length}`}
//                       </Badge>
//                     ) : null}
//                   </article>
//                 )
//               })}
//             </div>
//           </div>
//         ) : (
//           <div className="flex flex-1 flex-col items-center justify-center rounded-lg border border-dashed p-5 text-center">
//             <div className="flex size-11 items-center justify-center rounded-full bg-primary/10 text-primary">
//               <BookOpen className="size-5" />
//             </div>
//             <p className="mt-3 text-sm font-semibold">No Order Guides Yet</p>
//             <p className="mt-1 max-w-48 text-xs leading-relaxed text-muted-foreground">
//               Create a reusable guide for products you order regularly.
//             </p>
//           </div>
//         )}

//         <div className="mt-auto grid grid-cols-2 gap-2 border-t pt-3">
//           <Button
//             type="button"
//             variant="outline"
//             size="sm"
//             className="h-10 w-full"
//             disabled={visibleGuides.length === 0}
//             onClick={toggleAllGuides}
//           >
//             {allSelected ? "Clear all" : "Select all"}
//           </Button>

//           <Button
//             type="button"
//             className="h-10 w-full"
//             size="sm"
//             disabled={selectedIds.length === 0 || selectedProductsAdded}
//             onClick={() =>
//               missingSelectedProducts.forEach((product) => addItem(product, 1))
//             }
//           >
//             <ShoppingCart className="size-4" />
//             {selectedProductsAdded ? "Added" : "Add to cart"}
//             {!selectedProductsAdded && missingSelectedProducts.length > 0
//               ? ` (${missingSelectedProducts.length})`
//               : ""}
//           </Button>
//         </div>
//       </div>
//     </section>
//   )
// }

//changed by Radhika 30-09-2026 
"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { useDispatch } from "react-redux"
import {
  BookOpen,
  ChevronRight,
  FolderOpen,
  Loader2,
  ShoppingCart,
} from "lucide-react"
import { toast } from "sonner"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useCart } from "@/app/context/app-context"
import { GetOrderGuideList } from "../../redux/slices/getSlice"
import { QuickOrdeguidetocartPOST } from "../../redux/slices/postSlice"

// Remembers which guides were added to the cart (survives navigation/refresh)
const ADDED_KEY = "quickOrder.addedGuideIds"

export default function QuickOrderGuide() {
  const dispatch = useDispatch()

  // setCartOpen exists only if you moved the cart-open state into app-context.
  // It is called with optional chaining below, so this file works either way.
  const { fetchCustomerCart, items: cartItems, setCartOpen } = useCart()

  const [guides, setGuides] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedGuideIds, setSelectedGuideIds] = useState([])
  const [addedGuideIds, setAddedGuideIds] = useState([])
  const [isAddingToCart, setIsAddingToCart] = useState(false)
  const prevCartCount = useRef(0)

  // Fetch order guides and keep only the quick-order ones
  useEffect(() => {
    let ignore = false

    async function loadQuickOrders() {
      try {
        setIsLoading(true)
        const list = await dispatch(GetOrderGuideList()).unwrap()

        if (ignore) return

        const quickGuides = list
          .filter((guide) => guide.quickOrder === "Y")
          .slice(0, 4)
          .map((guide) => ({
            id: String(guide.orderGuideID),
            name: guide.name,
            groupCount: Number(guide.groupCount ?? 0),
            itemsCount: Number(guide.itemsCount ?? 0),
          }))

        setGuides(quickGuides)
      } catch (error) {
        if (ignore) return
        console.error("Failed to load quick order guides:", error)
        toast.error(
          typeof error === "string"
            ? error
            : error?.Msg || error?.message || "Failed to load quick order guides.",
        )
        setGuides([])
      } finally {
        if (!ignore) setIsLoading(false)
      }
    }

    loadQuickOrders()
    return () => {
      ignore = true
    }
  }, [dispatch])

  // Load previously added guides after mount (localStorage isn't available during SSR)
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(ADDED_KEY))
      if (Array.isArray(saved)) setAddedGuideIds(saved)
    } catch {
      // ignore corrupted storage
    }
  }, [])

  // Cart went from having items to empty (checkout / cleared) -> reset "Added" badges
  useEffect(() => {
    if (prevCartCount.current > 0 && cartItems.length === 0) {
      setAddedGuideIds([])
      localStorage.removeItem(ADDED_KEY)
    }
    prevCartCount.current = cartItems.length
  }, [cartItems])

  const visibleGuideIds = guides.map((guide) => guide.id)
  const selectedIds = selectedGuideIds.filter((id) => visibleGuideIds.includes(id))
  const allSelected = guides.length > 0 && selectedIds.length === guides.length

  // Only guides not yet added get sent to the API
  const pendingIds = selectedIds.filter((id) => !addedGuideIds.includes(id))
  const selectedAllAdded = selectedIds.length > 0 && pendingIds.length === 0

  function toggleGuide(guideId) {
    setSelectedGuideIds((current) =>
      current.includes(guideId)
        ? current.filter((id) => id !== guideId)
        : [...current, guideId],
    )
  }

  function toggleAllGuides() {
    setSelectedGuideIds(allSelected ? [] : visibleGuideIds)
  }

  async function handleAddToCart() {
    if (pendingIds.length === 0 || isAddingToCart) return

    const custNmbr = localStorage.getItem("custnmbr")
    if (!custNmbr) {
      toast.error("Unable to identify the customer.")
      return
    }

    try {
      setIsAddingToCart(true)

      const result = await dispatch(
        QuickOrdeguidetocartPOST({
          data: {
            custNmbr,
            orderGuideIDs: pendingIds.map(Number), 
            cartGroupId: "",
          },
        }),
      ).unwrap()

      // Re-fetch the cart so the header badge and cart sidebar update immediately
      await fetchCustomerCart(custNmbr)

      // Mark these guides as added and remember them
      const next = Array.from(new Set([...addedGuideIds, ...pendingIds]))
      setAddedGuideIds(next)
      localStorage.setItem(ADDED_KEY, JSON.stringify(next))

      const added = result?.totalAdded ?? result?.added?.length ?? 0
      const skipped = result?.skipped?.length ?? 0

      if (skipped > 0) toast.warning(`${added} added, ${skipped} skipped`)
      else toast.success(added > 0 ? `${added} item(s) added to cart` : "Added to cart")

      setSelectedGuideIds([])
      setCartOpen?.(true) // open the cart sidebar (no-op if not wired up in app-context)
    } catch (error) {
      console.error("Quick order add to cart failed:", error)
      toast.error(
        typeof error === "string"
          ? error
          : error?.Msg || error?.message || "Failed to add to cart",
      )
    } finally {
      setIsAddingToCart(false)
    }
  }

  return (
    <section className="flex h-full min-h-0 flex-col overflow-hidden rounded-xl border bg-card shadow-sm">
      <div className="flex shrink-0 items-center justify-between gap-2 border-b px-4 py-4">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-300">
            <BookOpen className="size-5" />
          </div>

          <div className="min-w-0">
            <h2 className="text-base font-bold sm:text-lg">Quick Order Guides</h2>
            <p className="truncate text-xs text-muted-foreground">
              Select guides to add their products
            </p>
          </div>
        </div>

        <Button asChild variant="outline" size="icon-sm">
          <Link href="/order-guide" aria-label="Open order guides">
            <ChevronRight className="size-4" />
          </Link>
        </Button>
      </div>

      <div className="flex min-h-0 flex-1 flex-col gap-3 p-3">
        {isLoading ? (
          <div
            role="status"
            aria-live="polite"
            className="flex flex-1 flex-col items-center justify-center gap-2 text-muted-foreground"
          >
            <Loader2 className="size-5 animate-spin text-primary" />
            <p className="text-xs font-medium">Loading quick orders...</p>
          </div>
        ) : guides.length > 0 ? (
          <div className="min-h-0 flex-1 overflow-y-auto pr-2">
            <div className="grid gap-2">
              {guides.map((guide) => {
                const isSelected = selectedIds.includes(guide.id)
                const isAdded = addedGuideIds.includes(guide.id)

                return (
                  <article
                    key={guide.id}
                    role="button"
                    tabIndex={0}
                    onClick={() => toggleGuide(guide.id)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault()
                        toggleGuide(guide.id)
                      }
                    }}
                    className="group flex cursor-pointer items-center gap-2 rounded-lg border bg-background p-3 transition-colors hover:border-primary/30 hover:bg-muted/40"
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleGuide(guide.id)}
                      onClick={(event) => event.stopPropagation()}
                      className="size-4 shrink-0 cursor-pointer rounded border-border accent-primary"
                      aria-label={`Select ${guide.name}`}
                    />

                    <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <FolderOpen className="size-4" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold">{guide.name}</p>
                      <p className="mt-0.5 text-[11px] text-muted-foreground">
                        {guide.groupCount}{" "}
                        {guide.groupCount === 1 ? "group" : "groups"} ·{" "}
                        {guide.itemsCount}{" "}
                        {guide.itemsCount === 1 ? "product" : "products"}
                      </p>
                    </div>

                    {isAdded ? (
                      <Badge className="ml-auto shrink-0">Added</Badge>
                    ) : null}
                  </article>
                )
              })}
            </div>
          </div>
        ) : (
          <div className="flex flex-1 flex-col items-center justify-center rounded-lg border border-dashed p-5 text-center">
            <div className="flex size-11 items-center justify-center rounded-full bg-primary/10 text-primary">
              <BookOpen className="size-5" />
            </div>
            <p className="mt-3 text-sm font-semibold">No Order Guides Yet</p>
            <p className="mt-1 max-w-48 text-xs leading-relaxed text-muted-foreground">
              Create a reusable guide for products you order regularly.
            </p>
          </div>
        )}

        <div className="mt-auto grid shrink-0 grid-cols-2 gap-2 border-t pt-3">
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-10 w-full"
            disabled={guides.length === 0}
            onClick={toggleAllGuides}
          >
            {allSelected ? "Clear all" : "Select all"}
          </Button>

          <Button
            type="button"
            className="h-10 w-full"
            size="sm"
            disabled={selectedIds.length === 0 || selectedAllAdded || isAddingToCart}
            onClick={handleAddToCart}
          >
            {isAddingToCart ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <ShoppingCart className="size-4" />
            )}
            {isAddingToCart ? "Adding..." : selectedAllAdded ? "Added" : "Add to cart"}
          </Button>
        </div>
      </div>
    </section>
  )
}
