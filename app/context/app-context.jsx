"use client"

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react"

import catalog from "@/data/data.json"
import { findCatalogProduct } from "@/lib/catalog-products"
import { getCategoryPlaceholderImage } from "@/lib/category-placeholder-images"
import { postCartApi, updateCartQuantityApi, checkoutOrderApi, importDocumentCartApi, getCustomerCartApi } from "@/lib/api/cartApi"
import { fetchItemsApi, resolveItemImageUrl } from "@/lib/api/itemsApi"

const AppContext = createContext(null)
const CART_STORAGE_KEY = "aloha.cart.v1"
const QUICK_ORDERS_STORAGE_KEY = "aloha.quickOrders.v1"
const DASHBOARD_QUICK_ORDERS_STORAGE_KEY = "aloha.dashboardQuickOrders.v1"

function createDefaultGroup() {
  return {
    id: crypto.randomUUID(),
    name: "Default Group",
    products: [],
  }
}

function detectCategoryFromName(name = "") {
  const n = String(name).toLowerCase()
  if (n.includes("salmon") || n.includes("shrimp") || n.includes("crawfish") || n.includes("tuna") || n.includes("crab") || n.includes("fish") || n.includes("seafood")) {
    return "Seafood"
  }
  if (n.includes("steak") || n.includes("beef") || n.includes("ribeye") || n.includes("t-bone") || n.includes("ground beef")) {
    return "Beef"
  }
  if (n.includes("hen") || n.includes("chicken") || n.includes("poultry") || n.includes("wing") || n.includes("breast")) {
    return "Chicken"
  }
  if (n.includes("pork") || n.includes("bacon") || n.includes("ham") || n.includes("chop") || n.includes("rib")) {
    return "Pork"
  }
  if (n.includes("sausage") || n.includes("deli") || n.includes("meat")) {
    return "Processed Meat"
  }
  if (n.includes("alligator") || n.includes("lamb") || n.includes("veal") || n.includes("specialty")) {
    return "Specialty Meats"
  }
  return "Seafood"
}

function getCartItemImage(product) {
  if (!product) return getCategoryPlaceholderImage("Seafood")
  const itemKey = String(product.id || product.sku || product.itemNumber || "").trim()
  const catalogItem = findCatalogProduct(itemKey)
  const mergedProduct = catalogItem ? { ...catalogItem, ...product } : product

  const rawImage = mergedProduct.image
  const resolvedImg = resolveItemImageUrl(rawImage)

  if (resolvedImg) {
    return resolvedImg
  }

  const category = mergedProduct.category || catalogItem?.category || detectCategoryFromName(mergedProduct.name || product.name)
  return getCategoryPlaceholderImage(category)
}

function mapCustomerCartItems(cartItems, liveItems) {
  const liveItemsById = new Map(
    liveItems.map((item) => [
      String(item.ITEMNMBR ?? item.itemnmbr ?? "").trim(),
      item,
    ])
  )

  return cartItems.map((item) => {
    const itemNum = String(
      item.itemNumber ?? item.ItemNumber ?? item.cartId ?? ""
    ).trim()
    const liveItem = liveItemsById.get(itemNum)
    const catalogItem = findCatalogProduct(itemNum)
    const name =
      item.itemName ??
      item.ItemName ??
      item.requestedItemName ??
      liveItem?.ItemName ??
      liveItem?.itemName ??
      liveItem?.ITEMDESC ??
      catalogItem?.name ??
      `Item ${itemNum}`
    const price = Number(
      item.price ??
      item.Price ??
      item.unitPrice ??
      item.UnitPrice ??
      liveItem?.QTYBSUOM ??
      liveItem?.qtybsuom ??
      liveItem?.avgWeight ??
      catalogItem?.price ??
      0
    )
    const unit =
      liveItem?.UOMSCHDL ??
      liveItem?.uomschdl ??
      catalogItem?.unit ??
      "LB"
    const image = getCartItemImage({
      ...(catalogItem || {}),
      id: itemNum,
      name,
      image:
        item.image ??
        item.Image ??
        item.IMAGE ??
        liveItem?.image ??
        liveItem?.Image ??
        liveItem?.IMAGE ??
        catalogItem?.image,
    })

    return {
      id: itemNum,
      name,
      price,
      unit: String(unit).trim(),
      sku: itemNum,
      quantity: Number(item.quantity ?? item.Quantity ?? 1),
      image,
      cartId: item.cartId,
      source: item.source ?? item.Source ?? "Backend API",
    }
  })
}

async function loadCustomerCart(custnmbr) {
  const [cartItems, liveItems] = await Promise.all([
    getCustomerCartApi(custnmbr),
    fetchItemsApi(),
  ])

  return Array.isArray(cartItems)
    ? mapCustomerCartItems(cartItems, Array.isArray(liveItems) ? liveItems : [])
    : []
}

function getInitialCartItems() {
  if (typeof window === "undefined") {
    return []
  }

  try {
    const items = JSON.parse(window.localStorage.getItem(CART_STORAGE_KEY))
    return Array.isArray(items)
      ? items.map((item) => {
        const catalogItem = findCatalogProduct(item.id)

        return {
          ...item,
          price: Number(item.price ?? catalogItem?.price ?? 0),
          category: item.category || catalogItem?.category,
          subcategory: item.subcategory || catalogItem?.subcategory,
          image: getCartItemImage(catalogItem ? { ...catalogItem, ...item } : item),
        }
      })
      : []
  } catch {
    return []
  }
}

function normalizeQuickOrders(orders) {
  return Array.isArray(orders)
    ? orders.map((order) => ({
      ...order,
      groups:
        Array.isArray(order.groups) && order.groups.length > 0
          ? order.groups.map((group, index) => ({
            ...group,
            name: group.name || (index === 0 ? "Default Group" : "Group"),
            products: Array.isArray(group.products) ? group.products : [],
          }))
          : [createDefaultGroup()],
    }))
    : []
}

function getInitialQuickOrders() {
  if (typeof window === "undefined") {
    return []
  }

  try {
    return normalizeQuickOrders(
      JSON.parse(window.localStorage.getItem(QUICK_ORDERS_STORAGE_KEY))
    )
  } catch {
    return []
  }
}

function getInitialDashboardQuickOrderIds() {
  if (typeof window === "undefined") {
    return []
  }

  try {
    const ids = JSON.parse(
      window.localStorage.getItem(DASHBOARD_QUICK_ORDERS_STORAGE_KEY)
    )

    return Array.isArray(ids) ? ids.slice(0, 4) : []
  } catch {
    return []
  }
}

function touchQuickOrder(order) {
  return {
    ...order,
    updatedAt: new Date().toISOString(),
  }
}

export function AppProvider({ children }) {
  const [cartItems, setCartItems] = useState([])
  const [quickOrders, setQuickOrders] = useState([])
  const [dashboardQuickOrderIds, setDashboardQuickOrderIds] = useState([])
  const [storageHydrated, setStorageHydrated] = useState(false)

  useEffect(() => {
    queueMicrotask(() => {
      setCartItems(getInitialCartItems())
      setQuickOrders(getInitialQuickOrders())
      setDashboardQuickOrderIds(getInitialDashboardQuickOrderIds())
      setStorageHydrated(true)
    })
  }, [])

  useEffect(() => {
    if (!storageHydrated) return

    window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems))
  }, [cartItems, storageHydrated])

  useEffect(() => {
    if (!storageHydrated) return

    window.localStorage.setItem(
      QUICK_ORDERS_STORAGE_KEY,
      JSON.stringify(quickOrders)
    )
  }, [quickOrders, storageHydrated])

  const fetchCustomerCart = useCallback(async (custnmbr = "400001") => {
    try {
      const data = await getCustomerCartApi(custnmbr)

      if (Array.isArray(data)) {
        const mappedItems = data.map((item) => {
          const itemNum = String(
            item.itemNumber ||
            item.ItemNumber ||
            item.cartId
          ).trim()

          const matchedCatalogItem = findCatalogProduct(itemNum)

          const name =
            item.itemName ||
            item.requestedItemName ||
            matchedCatalogItem?.name ||
            `Item ${itemNum}`

          const apiPrice =
            item.price ??
            item.Price ??
            item.unitPrice

          /*
           * Only use API price when it is actually greater than 0.
           * If API returns 0 / empty / missing, use catalog price.
           */
          const parsedApiPrice = Number(apiPrice)

          const catalogPrice = Number(
            matchedCatalogItem?.price ?? 0
          )

          const price =
            Number.isFinite(parsedApiPrice) && parsedApiPrice > 0
              ? parsedApiPrice
              : catalogPrice

          const unit =
            matchedCatalogItem?.unit ||
            item.unit ||
            "LB"

          const image = getCartItemImage(
            matchedCatalogItem || {
              id: itemNum,
              name,
              image: item.image,
            }
          )

          return {
            id: itemNum,
            name,
            price,
            unit,
            sku: itemNum,
            quantity: Number(item.quantity || 1),
            image,
            cartId: item.cartId,
            source: item.source || "Backend API",
          }
        })

        setCartItems((currentItems) => {
          return mappedItems.map((apiItem) => {
            const existingItem = currentItems.find(
              (currentItem) =>
                String(currentItem.id) === String(apiItem.id)
            )

            /*
             * If this product was already added to the cart
             * and the API does not provide a real price,
             * KEEP the price that was already in the cart.
             */
            if (
              existingItem &&
              (!Number.isFinite(apiItem.price) ||
                apiItem.price <= 0)
            ) {
              return {
                ...apiItem,
                price: Number(existingItem.price) || 0,
              }
            }

            return {
              ...apiItem,
              price: Number(apiItem.price) || 0,
            }
          })
        })

        return mappedItems
      }
    } catch (error) {
      console.warn(
        "Failed to fetch customer cart from API:",
        error
      )
    }
  }, [])

  useEffect(() => {
    if (!storageHydrated) return

    fetchCustomerCart()
  }, [storageHydrated, fetchCustomerCart])

  // useEffect(() => {
  //   let ignore = false
  //   getCustomerCartApi("400001")
  //     .then((data) => {
  //       if (!ignore && Array.isArray(data)) {
  //         const mappedItems = data.map((item) => {
  //           const itemNum = String(item.itemNumber || item.ItemNumber || item.cartId).trim()
  //           const matchedCatalogItem = findCatalogProduct(itemNum)
  //           const name = item.itemName || item.requestedItemName || matchedCatalogItem?.name || `Item ${itemNum}`
  //           const price = matchedCatalogItem?.price || 12.50
  //           const unit = matchedCatalogItem?.unit || "LB"
  //           const image = getCartItemImage(matchedCatalogItem || { id: itemNum, name, image: item.image })

  //           return {
  //             id: itemNum,
  //             name,
  //             price,
  //             unit,
  //             sku: itemNum,
  //             quantity: Number(item.quantity || 1),
  //             image,
  //             cartId: item.cartId,
  //             source: item.source || "Backend API",
  //           }
  //         })
  //         setCartItems(mappedItems)
  //       }
  //     })
  //     .catch((error) => {
  //       console.warn("Failed to fetch customer cart from API:", error)
  //     })

  //   return () => {
  //     ignore = true
  //   }
  // }, [])

  function addCartItem(product, quantity = 1) {
    setCartItems((currentItems) => {
      const existingItem = currentItems.find((item) => item.id === product.id)

      if (existingItem) {
        return currentItems.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
      }

      return [
        ...currentItems,
        {
          id: product.id,
          name: product.name,
          price: Number(product.price ?? 0),
          unit: product.unit,
          sku: product.sku,
          category: product.category,
          subcategory: product.subcategory,
          image: getCartItemImage(product),
          quantity,
        },
      ]
    })

    // Post cart payload to https://crateapi.bexlgems.com/api/cart
    postCartApi({
      itemNumber: product.ITEMNMBR || product.ItemNumber || product.itemnmbr || product.sku || product.id,
      itemName: product.ITEMDESC || product.ItemName || product.itemdesc || product.name,
      quantity,
      custnmbr: "400001",
      source: "App/Web",
    }).catch((error) => {
      console.warn("Failed to sync cart item to Cart API endpoint:", error.message)
    })
  }

  function incrementCartItem(productId) {
    let nextQuantity = 1
    setCartItems((currentItems) =>
      currentItems.map((item) => {
        if (item.id === productId) {
          nextQuantity = item.quantity + 1
          return { ...item, quantity: nextQuantity }
        }
        return item
      })
    )

    updateCartQuantityApi({
      itemNumber: productId,
      quantity: nextQuantity,
      custnmbr: "400001",
    }).catch((error) => {
      console.warn("Failed to sync cart item quantity PUT request:", error.message)
    })
  }

  function decrementCartItem(productId) {
    let nextQuantity = 0
    setCartItems((currentItems) =>
      currentItems
        .map((item) => {
          if (item.id === productId) {
            nextQuantity = Math.max(0, item.quantity - 1)
            return { ...item, quantity: nextQuantity }
          }
          return item
        })
        .filter((item) => item.quantity > 0)
    )

    updateCartQuantityApi({
      itemNumber: productId,
      quantity: nextQuantity,
      custnmbr: "400001",
    }).catch((error) => {
      console.warn("Failed to sync cart item quantity PUT request:", error.message)
    })
  }

  function removeCartItem(productId) {
    setCartItems((currentItems) =>
      currentItems.filter((item) => item.id !== productId)
    )

    updateCartQuantityApi({
      itemNumber: productId,
      quantity: 0,
      custnmbr: "400001",
    }).catch((error) => {
      console.warn("Failed to sync cart item delete PUT request:", error.message)
    })
  }

  function clearCart() {
    setCartItems([])
  }

  function createQuickOrder(name) {
    const defaultGroup = createDefaultGroup()
    const newOrder = {
      id: crypto.randomUUID(),
      name,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      groups: [defaultGroup],
    }

    setQuickOrders((orders) => [...orders, newOrder])

    return newOrder
  }

  function addProductToQuickOrder(orderId, product, groupId) {
    setQuickOrders((orders) =>
      orders.map((order) => {
        if (order.id !== orderId) return order

        const defaultGroup = order.groups[0] ?? createDefaultGroup()
        const groups = order.groups.length > 0 ? order.groups : [defaultGroup]
        const targetGroupId = groupId ?? defaultGroup.id

        return touchQuickOrder({
          ...order,
          groups: groups.map((group) => {
            if (group.id !== targetGroupId) return group
            if (group.products.some((item) => item.id === product.id)) {
              return group
            }

            return {
              ...group,
              products: [
                ...group.products,
                {
                  id: product.id,
                  name: product.name,
                  price: product.price,
                  unit: product.unit,
                  sku: product.sku,
                  category: product.category,
                  subcategory: product.subcategory,
                  image: product.image,
                  par: group.par ?? product.par ?? null,
                },
              ],
            }
          }),
        })
      })
    )
  }

  function removeProductFromQuickOrder(orderId, productId, groupId) {
    setQuickOrders((orders) =>
      orders.map((order) =>
        order.id === orderId
          ? touchQuickOrder({
            ...order,
            groups: order.groups.map((group, index) =>
              (groupId ? group.id === groupId : index === 0)
                ? {
                  ...group,
                  products: group.products.filter(
                    (product) => product.id !== productId
                  ),
                }
                : group
            ),
          })
          : order
      )
    )
  }

  const value = useMemo(() => {
    const cartItemCount = cartItems.reduce(
      (sum, item) => sum + item.quantity,
      0
    )
    const cartTotal = cartItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    )

    return {
      catalog,
      categories: catalog,
      cartItems,
      cartItemCount,
      cartTotal,
      quickOrders,
      setQuickOrders,
      dashboardQuickOrderIds,
      setDashboardQuickOrderIds,
      addCartItem,
      incrementCartItem,
      decrementCartItem,
      removeCartItem,
      clearCart,
      fetchCustomerCart,
      createQuickOrder,
      addProductToQuickOrder,
      removeProductFromQuickOrder,
    }
  }, [cartItems, dashboardQuickOrderIds, fetchCustomerCart, quickOrders])

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useQuickOrders() {
  const {
    quickOrders,
    setQuickOrders,
    dashboardQuickOrderIds,
    setDashboardQuickOrderIds,
    createQuickOrder,
    addProductToQuickOrder,
    removeProductFromQuickOrder,
  } = useAppContext()

  return {
    quickOrders,
    setQuickOrders,
    dashboardQuickOrderIds,
    setDashboardQuickOrderIds,
    createQuickOrder,
    addProductToQuickOrder,
    removeProductFromQuickOrder,
  }
}

export function useAppContext() {
  const context = useContext(AppContext)

  if (!context) {
    throw new Error("useAppContext must be used within AppProvider")
  }

  return context
}

export function useCatalog() {
  const { catalog, categories } = useAppContext()

  return { catalog, categories }
}

export function useCart() {
  const {
    cartItems,
    cartItemCount,
    cartTotal,
    addCartItem,
    incrementCartItem,
    decrementCartItem,
    removeCartItem,
    clearCart,
    fetchCustomerCart,
  } = useAppContext()

  return {
    items: cartItems,
    itemCount: cartItemCount,
    total: cartTotal,
    addItem: addCartItem,
    incrementItem: incrementCartItem,
    decrementItem: decrementCartItem,
    removeItem: removeCartItem,
    clearCart,
    fetchCustomerCart,
    refetchCart: fetchCustomerCart,
    postCartApi,
    updateCartQuantityApi,
    checkoutOrderApi,
    importDocumentCartApi,
    getCustomerCartApi,
  }
}
