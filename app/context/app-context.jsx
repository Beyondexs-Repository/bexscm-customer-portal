"use client"

import { createContext, useContext, useEffect, useMemo, useState } from "react"

import catalog from "@/data/data.json"
import { findCatalogProduct, getProductGalleryImages } from "@/lib/catalog-products"

const AppContext = createContext(null)
const CART_STORAGE_KEY = "aloha.cart.v1"
const QUICK_ORDERS_STORAGE_KEY = "aloha.quickOrders.v1"

function createDefaultGroup() {
  return {
    id: crypto.randomUUID(),
    name: "Default Group",
    products: [],
  }
}

function getCartItemImage(product) {
  const catalogItem = findCatalogProduct(product.id)
  const storedImage = product.image || ""

  if (storedImage && !storedImage.startsWith("/images/products/")) {
    return storedImage
  }

  return (
    getProductGalleryImages({ ...catalogItem, ...product })[0] ||
    catalogItem?.image ||
    storedImage
  )
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

function touchQuickOrder(order) {
  return {
    ...order,
    updatedAt: new Date().toISOString(),
  }
}

export function AppProvider({ children }) {
  const [cartItems, setCartItems] = useState([])
  const [quickOrders, setQuickOrders] = useState([])
  const [storageHydrated, setStorageHydrated] = useState(false)

  useEffect(() => {
    queueMicrotask(() => {
      setCartItems(getInitialCartItems())
      setQuickOrders(getInitialQuickOrders())
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
          price: product.price,
          unit: product.unit,
          sku: product.sku,
          image: getCartItemImage(product),
          quantity,
        },
      ]
    })
  }

  function incrementCartItem(productId) {
    setCartItems((currentItems) =>
      currentItems.map((item) =>
        item.id === productId ? { ...item, quantity: item.quantity + 1 } : item
      )
    )
  }

  function decrementCartItem(productId) {
    setCartItems((currentItems) =>
      currentItems
        .map((item) =>
          item.id === productId
            ? { ...item, quantity: Math.max(0, item.quantity - 1) }
            : item
        )
        .filter((item) => item.quantity > 0)
    )
  }

  function removeCartItem(productId) {
    setCartItems((currentItems) =>
      currentItems.filter((item) => item.id !== productId)
    )
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
      addCartItem,
      incrementCartItem,
      decrementCartItem,
      removeCartItem,
      clearCart,
      createQuickOrder,
      addProductToQuickOrder,
      removeProductFromQuickOrder,
    }
  }, [cartItems, quickOrders])

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useQuickOrders() {
  const {
    quickOrders,
    setQuickOrders,
    createQuickOrder,
    addProductToQuickOrder,
    removeProductFromQuickOrder,
  } = useAppContext()

  return {
    quickOrders,
    setQuickOrders,
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
  }
}
