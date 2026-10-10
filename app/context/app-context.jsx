"use client"

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { usePathname } from "next/navigation"
import { getCatalogProducts, findCatalogProduct } from "@/lib/catalog-products"
import { getCategoryPlaceholderImage } from "@/lib/category-placeholder-images"
import { postCartApi, updateCartQuantityApi, checkoutOrderApi, importDocumentCartApi } from "@/lib/api/cartApi"
import { resolveItemImageUrl } from "@/lib/api/itemsApi"
import { GetCart, GetCartGroups } from "../../redux/slices/getSlice"
import { PostCartGroup } from "../../redux/slices/postSlice"
import { toast } from "sonner"

const AppContext = createContext(null)
const CART_STORAGE_KEY = "aloha.cart.v1"
const QUICK_ORDERS_STORAGE_KEY = "aloha.quickOrders.v1"
const DASHBOARD_QUICK_ORDERS_STORAGE_KEY = "aloha.dashboardQuickOrders.v1"

// Reads custnmbr from localStorage (safe during SSR)
function getCustnmbr() {
  if (typeof window === "undefined") return undefined
  return window.localStorage.getItem("custnmbr") || undefined
}

// Reads the logged-in user's id (used as createdBY).
// Login page saves it under "loggedInUser"; "userId" is kept as a fallback.
function getLoginId() {
  if (typeof window === "undefined") return undefined
  const raw =
    window.localStorage.getItem("loggedInUser") ||
    window.localStorage.getItem("userId")
  const id = Number(raw)
  return raw && Number.isFinite(id) ? id : undefined
}

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

  const resolvedImg = resolveItemImageUrl(mergedProduct.image)
  if (resolvedImg) return resolvedImg

  const category =
    mergedProduct.category ||
    catalogItem?.category ||
    detectCategoryFromName(mergedProduct.name || product.name)
  return getCategoryPlaceholderImage(category)
}

function getInitialCartItems() {
  if (typeof window === "undefined") return []

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
  if (typeof window === "undefined") return []

  try {
    return normalizeQuickOrders(
      JSON.parse(window.localStorage.getItem(QUICK_ORDERS_STORAGE_KEY))
    )
  } catch {
    return []
  }
}

function getInitialDashboardQuickOrderIds() {
  if (typeof window === "undefined") return []

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
  const dispatch = useDispatch()
  const pathname = usePathname()
  const lastCustRef = useRef(null) // last customer number we fetched data for
  const liveItems = useSelector((state) => state.getSlice.itemsData)
  const catalog = useMemo(() => getCatalogProducts(liveItems), [liveItems])

  const [cartItems, setCartItems] = useState([])
  const [quickOrders, setQuickOrders] = useState([])
  const [cartLoading, setCartLoading] = useState(false)
  const [dashboardQuickOrderIds, setDashboardQuickOrderIds] = useState([])
  const [storageHydrated, setStorageHydrated] = useState(false)
const [newCartGroupID, setNewCartGroupID] = useState(null)
  const cartGroupsRaw = useSelector((state) => state.getSlice.GetCartGroupsData)
  const cartGroupsLoading = useSelector((state) => state.getSlice.GetCartGroupsLoading)

  // works whether the API returns [...] or { Data: [...] }
  const cartGroups = useMemo(() => {
    const list = Array.isArray(cartGroupsRaw)
      ? cartGroupsRaw
      : cartGroupsRaw?.Data ?? cartGroupsRaw?.data ?? []
    return Array.isArray(list) ? list : []
  }, [cartGroupsRaw])

  const [selectedCartGroupID, setSelectedCartGroupID] = useState(null)
  const [creatingCartGroup, setCreatingCartGroup] = useState(false)

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

  const fetchCustomerCart = useCallback(
    async (custnmbr = getCustnmbr()) => {
      setCartLoading(true)
      try {
        // GetCart thunk -> unwrap() returns the list, or throws the rejected payload
        const data = await dispatch(GetCart(custnmbr)).unwrap()

        if (Array.isArray(data)) {
          const mappedItems = data.map((item) => {
            const itemNum = String(
              item.itemNumber || item.ItemNumber || item.cartId
            ).trim()

            const matchedCatalogItem = findCatalogProduct(itemNum, liveItems)

            const name =
              item.itemName ||
              item.requestedItemName ||
              matchedCatalogItem?.name ||
              `Item ${itemNum}`

            // qtybsuom from the API is the unit price
            const price = Number(item.qtybsuom) || 0

            const unit = matchedCatalogItem?.unit || item.unit || "LB"

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
              qtybsuom: price, // CartSidebar reads item.qtybsuom
              unit,
              sku: itemNum,
              itemNumber: itemNum, // CartSidebar also reads item.itemNumber
              quantity: Number(item.quantity || 1),
              image,
              cartId: item.cartId,
              cartGroupID: item.cartGroupID ?? item.CartGroupID ?? null, // 👈 add
              source: item.source || "Backend API",
            }
          })

          setCartItems((currentItems) =>
            mappedItems.map((apiItem) => {
              const existingItem = currentItems.find(
                (currentItem) => String(currentItem.id) === String(apiItem.id)
              )

              // Keep the price already in the cart if the API gives no real price
              if (
                existingItem &&
                (!Number.isFinite(apiItem.price) || apiItem.price <= 0)
              ) {
                return {
                  ...apiItem,
                  price: Number(existingItem.price) || 0,
                  qtybsuom: Number(existingItem.price) || 0,
                }
              }

              return {
                ...apiItem,
                price: Number(apiItem.price) || 0,
              }
            })
          )

          return mappedItems
        }
      } catch (error) {
        console.warn("Failed to fetch customer cart from API:", error)
      } finally {
        setCartLoading(false)
      }
    },
    [dispatch, liveItems]
  )

  const fetchCartGroups = useCallback(async () => {
    try {
      return await dispatch(GetCartGroups()).unwrap()
    } catch (error) {
      console.warn("Failed to fetch cart groups:", error)
    }
  }, [dispatch])

  async function createCartGroup({ name, visibility, fulfillmentDate }) {
    const custnmbr = getCustnmbr()
    const createdBY = getLoginId()

    if (!custnmbr || !createdBY) {
      toast.error("Missing customer or login id. Please log in again.")
      return false // keeps the modal open
    }

    setCreatingCartGroup(true)
     try {
      // keep the response of PostCartGroup
      const result = await dispatch(
        PostCartGroup({
          custnmbr,
          name,
          fulfillmentDate, // "2026-10-11"
          visibility, // "Public" | "Private"
          createdBY,
        })
      ).unwrap()

      console.log("PostCartGroup response:", result)

      // Read cartGroupID from the response (handles a few common shapes)
      const data = result?.data ?? result?.Data ?? result
      const record = Array.isArray(data) ? data[0] : data
      const createdCartGroupID  = record?.cartGroupID 

      console.log("New cartGroupID:", createdCartGroupID )

if (createdCartGroupID != null) {
  setNewCartGroupID(createdCartGroupID)
  setSelectedCartGroupID(createdCartGroupID)
}
      // Refresh tabs, then select the new cart
      const payload = await fetchCartGroups()
      console.log(payload, "--find a payload reponse for ostcartgroups")
     
      const list = Array.isArray(payload) ? payload : payload?.Data ?? payload?.data ?? []
      const created = list
        .filter((g) => g.name === name)
        .sort((a, b) => Number(b.cartGroupID) - Number(a.cartGroupID))[0]
      if (created) setSelectedCartGroupID(created.cartGroupID)

      toast.success(`Cart "${name}" created`)
      return true
    } catch (error) {
      const msg =
        typeof error === "string" ? error : error?.Msg || error?.message || "Failed to create cart."
      toast.error(msg)
      return false
    } finally {
      setCreatingCartGroup(false)
    }
  }

  // load groups once the customer is known (same pattern as the cart fetch)
  useEffect(() => {
    if (!storageHydrated || !getCustnmbr()) return
    queueMicrotask(() => fetchCartGroups())
  }, [storageHydrated, fetchCartGroups])

  // keep a valid selection: default cart first, otherwise the first one
  useEffect(() => {
    if (cartGroups.length === 0) return
    setSelectedCartGroupID((prev) =>
      cartGroups.some((g) => String(g.cartGroupID) === String(prev))
        ? prev
        : (cartGroups.find((g) => g.isDefault) ?? cartGroups[0]).cartGroupID
    )
  }, [cartGroups])

  // initial load (page refresh while already logged in)
  useEffect(() => {
    if (!storageHydrated || !getCustnmbr()) return

    lastCustRef.current = getCustnmbr() // so the login effect below skips a duplicate fetch
    queueMicrotask(() => fetchCustomerCart())
  }, [storageHydrated, fetchCustomerCart])

  // Login saves custnmbr to localStorage but never notifies us.
  // A route change (e.g. /login -> /) is our signal to re-check it.
  useEffect(() => {
    if (!storageHydrated) return

    const cust = getCustnmbr()

    if (!cust) {
      lastCustRef.current = null // logged out, so the next login fetches again
      return
    }
    if (lastCustRef.current === cust) return

    lastCustRef.current = cust
    fetchCustomerCart(cust)
    fetchCartGroups()
  }, [pathname, storageHydrated, fetchCustomerCart, fetchCartGroups])

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
           cartGroupID: selectedCartGroupID,
          quantity,
        },
      ]
    })

    postCartApi({
      itemNumber:
        product.ITEMNMBR ||
        product.ItemNumber ||
        product.itemnmbr ||
        product.sku ||
        product.id,
      itemName:
        product.ITEMDESC ||
        product.ItemName ||
        product.itemdesc ||
        product.name,
      quantity,
      custnmbr: getCustnmbr(),
       cartGroupID: selectedCartGroupID,
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
      custnmbr: getCustnmbr(),
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
      custnmbr: getCustnmbr(),
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
      custnmbr: getCustnmbr(),
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
      const defaultGroupID = (cartGroups.find((g) => g.isDefault) ?? cartGroups[0])?.cartGroupID

  // show only the items of the selected cart (items with no group id count as the default cart)
  const visibleCartItems = cartItems.filter((item) => {
    if (selectedCartGroupID == null) return true
    const itemGroupID = item.cartGroupID ?? defaultGroupID
    return String(itemGroupID) === String(selectedCartGroupID)
  })
    const cartItemCount = visibleCartItems.reduce((sum, item) => sum + item.quantity, 0)
    const cartTotal = visibleCartItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    )

    return {
      catalog,
      categories: catalog,
      cartItems: visibleCartItems,
      cartItemCount,
      cartTotal,
      quickOrders,
      cartLoading,
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
      cartGroups,
      cartGroupsLoading,
      fetchCartGroups,
      selectedCartGroupID,
      setSelectedCartGroupID,
      creatingCartGroup,
      createCartGroup,
       newCartGroupID,
  setNewCartGroupID,
    }
  }, [catalog, cartItems, cartLoading, dashboardQuickOrderIds, fetchCustomerCart, quickOrders,
    cartGroups, cartGroupsLoading, selectedCartGroupID, creatingCartGroup, newCartGroupID,
  ])

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
    cartLoading,
    addCartItem,
    incrementCartItem,
    decrementCartItem,
    removeCartItem,
    clearCart,
    fetchCustomerCart,
    cartGroups,
    cartGroupsLoading,
    fetchCartGroups,
    selectedCartGroupID,
    setSelectedCartGroupID,
    creatingCartGroup,
    createCartGroup,
       newCartGroupID,
    setNewCartGroupID,
  } = useAppContext()

  return {
    items: cartItems,
    itemCount: cartItemCount,
    total: cartTotal,
    isLoading: cartLoading,
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
    cartGroups,
    cartGroupsLoading,
    fetchCartGroups,
    selectedCartGroupID,
    setSelectedCartGroupID,
    creatingCartGroup,
    createCartGroup,
     newCartGroupID,
    setNewCartGroupID,
  }
}