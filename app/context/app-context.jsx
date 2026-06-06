"use client"

import { createContext, useContext, useMemo, useState } from "react"

import catalog from "@/data/data.json"

const AppContext = createContext(null)

export function AppProvider({ children }) {
  const [cartItems, setCartItems] = useState([])

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
      addCartItem,
      incrementCartItem,
      decrementCartItem,
      removeCartItem,
    }
  }, [cartItems])

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
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
  } = useAppContext()

  return {
    items: cartItems,
    itemCount: cartItemCount,
    total: cartTotal,
    addItem: addCartItem,
    incrementItem: incrementCartItem,
    decrementItem: decrementCartItem,
    removeItem: removeCartItem,
  }
}
