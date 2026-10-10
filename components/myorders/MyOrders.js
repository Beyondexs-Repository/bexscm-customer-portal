// "use client"

// import { useCallback, useEffect, useMemo, useState } from "react"
// import { useTranslations } from "next-intl"

// import { fetchCustomerOrdersApi, DEFAULT_CUSTNMBR } from "@/lib/api/ordersApi"
// import { cn } from "@/lib/utils"

// import OrderList from "./OrderList"
// import OrderDetails from "./OrderDetails"

// export const statusFilters = ["all", "upcoming", "past"]
// export const typeFilters = ["App/Web", "Others"]

// export const statusStyles = {
//   green:
//     "bg-emerald-50 text-emerald-700 ring-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-200 dark:ring-emerald-800",
//   orange:
//     "bg-amber-50 text-amber-700 ring-amber-200 dark:bg-amber-950/40 dark:text-amber-200 dark:ring-amber-800",
//   violet:
//     "bg-violet-50 text-violet-700 ring-violet-200 dark:bg-violet-950/40 dark:text-violet-200 dark:ring-violet-800",
//   blue:
//     "bg-sky-50 text-sky-700 ring-sky-200 dark:bg-sky-950/40 dark:text-sky-200 dark:ring-sky-800",
//   slate:
//     "bg-slate-100 text-slate-600 ring-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:ring-slate-700",
// }

// export function formatCurrency(value) {
//   return new Intl.NumberFormat("en-US", {
//     style: "currency",
//     currency: "USD",
//   }).format(value)
// }

// export function getOrderBucket(order) {
//   const status = String(order.status || "").toLowerCase()
//   if (
//     status.includes("sent") ||
//     status.includes("created") ||
//     status.includes("pending") ||
//     status.includes("open") ||
//     status.includes("processing")
//   ) {
//     return "upcoming"
//   }
//   return "past"
// }

// export default function MyOrders() {
//   const t = useTranslations("myOrders")
//   const canViewOrderDetails = true
//   const [selectedOrderId, setSelectedOrderId] = useState(null)
//   const [statusFilter, setStatusFilter] = useState("all")
//   const [typeFilter, setTypeFilter] = useState("All Types")
//   const [customerId, setCustomerId] = useState(DEFAULT_CUSTNMBR)
//   // const [orders, setOrders] = useState([])
//   const [isLoading, setIsLoading] = useState(true)
//   const [error, setError] = useState(null)
//   const [refreshKey, setRefreshKey] = useState(0)
//   const [orderList, setOrderList] = useState([]);

//   const handleRefresh = useCallback(() => {
//     setRefreshKey((prev) => prev + 1)
//   }, [])

//   // useEffect(() => {
//   //   let ignore = false

//   //   fetchCustomerOrdersApi(customerId)
//   //     .then((data) => {
//   //       if (!ignore) {
//   //         setOrders(data)
//   //         setError(null)
//   //         setIsLoading(false)
//   //       }
//   //     })
//   //     .catch((err) => {
//   //       if (!ignore) {
//   //         console.error("Failed to load customer orders:", err)
//   //         setError(err.message || "Failed to fetch orders")
//   //         setOrders([])
//   //         setIsLoading(false)
//   //       }
//   //     })

//   //   return () => {
//   //     ignore = true
//   //   }
//   // }, [customerId, refreshKey])

//   const handleCustomerIdChange = useCallback((newId) => {
//     setIsLoading(true)
//     setCustomerId(newId)
//   }, [])

//   const filteredOrders = useMemo(
//     () =>
//       orderList.filter((order) => {
//         const matchesStatus =
//           statusFilter === "all" || getOrderBucket(order) === statusFilter

//         const matchesType =
//           typeFilter === "All Types" ||
//           (typeFilter === "App/Web" && order.type === "App/Web") ||
//           (typeFilter === "Others" && order.type !== "App/Web")

//         return matchesStatus && matchesType
//       }),
//     [orderList, statusFilter, typeFilter],
//   )

//   const selectedOrder =
//     filteredOrders.find((order) => order.id === selectedOrderId) || null

//   const fetchCustomerOrders = async (customerId) => {
//     setIsLoading(true);

//     try {
//       const url = `${process.env.NEXT_PUBLIC_NRL_API_URL}/customers/400001/orders`;

//       console.log("Customer ID:", customerId);
//       console.log("Customer Orders API URL:", url);

//       const response = await fetch(url, {
//         method: "GET",
//         headers: {
//           Accept: "application/json",
//           Authorization: `${process.env.NEXT_PUBLIC_AUTH_TOKEN}`,
//         },
//       });

//       console.log("Customer Orders HTTP Status:", response.status);
//       console.log("Customer Orders HTTP OK:", response.ok);

//       const responseText = await response.text();

//       console.log("Customer Orders Raw Response:", responseText);

//       let result = null;

//       try {
//         result = responseText ? JSON.parse(responseText) : null;
//       } catch (error) {
//         console.warn("Response is not JSON:", responseText);
//       }

//       console.log("Customer Orders Parsed Response:", result);

//       if (!response.ok) {
//         throw new Error(
//           result?.Msg ||
//           result?.message ||
//           result?.error ||
//           `Unable to fetch customer orders. HTTP ${response.status}`
//         );
//       }

//       setOrderList(result);

//       return result;
//     } catch (error) {
//       console.error("Customer Orders Error:", error);
//       setOrderList([]);
//       return null;
//     } finally {
//       setIsLoading(false);
//     }
//   };


//   useEffect(() => {
//     fetchCustomerOrders(customerId);
//     console.log("Orderview", orderList);
//   }, [customerId, refreshKey])

//   useEffect(() => {
//     console.log("Orderview Updated:", orderList);
//   }, [orderList]);

//   return (
//     <main className="grid min-h-full gap-4 bg-background p-3 sm:p-4 xl:grid-cols-[minmax(0,1fr)_minmax(360px,430px)] xl:pb-6">
//       <div className={cn("min-h-0", selectedOrder ? "hidden xl:block" : "block")}>
//         <OrderList
//           orders={orderList}
//           filteredOrders={filteredOrders}
//           selectedOrder={selectedOrder}
//           statusFilter={statusFilter}
//           typeFilter={typeFilter}
//           customerId={customerId}
//           isLoading={isLoading}
//           error={error}
//           onCustomerIdChange={handleCustomerIdChange}
//           onRefresh={handleRefresh}
//           onStatusFilterChange={setStatusFilter}
//           onTypeFilterChange={setTypeFilter}
//           onSelectOrder={canViewOrderDetails ? setSelectedOrderId : () => { }}
//           canViewOrderDetails={canViewOrderDetails}
//         />
//       </div>

//       <div
//         className={cn(
//           "h-full min-h-0 xl:sticky xl:top-4 xl:h-[calc(100svh-6.5rem)] xl:self-start",
//           selectedOrder ? "block" : "hidden xl:block",
//         )}
//       >
//         {selectedOrder ? (
//           <OrderDetails
//             order={selectedOrder}
//             onBack={() => setSelectedOrderId(null)}
//             onClose={() => setSelectedOrderId(null)}
//             onReorderSuccess={handleRefresh} 
//           />
//         ) : (
//           <section className="hidden h-full min-h-[18rem] place-items-center rounded-lg border bg-card xl:grid">
//             <p className="px-4 text-center text-sm text-muted-foreground">
//               {t("selectOrder")}
//             </p>
//           </section>
//         )}
//       </div>
//     </main>
//   )
// }

//Changed BY Radhika 23/09/2026-- 4-30 PM
"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { useTranslations } from "next-intl"

import { cn } from "@/lib/utils"

import OrderList from "./OrderList"
import OrderDetails from "./OrderDetails"

export const statusFilters = ["all", "upcoming", "past"]
export const typeFilters = ["App/Web", "Others"]

export const statusStyles = {
  green:
    "bg-emerald-50 text-emerald-700 ring-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-200 dark:ring-emerald-800",
  orange:
    "bg-amber-50 text-amber-700 ring-amber-200 dark:bg-amber-950/40 dark:text-amber-200 dark:ring-amber-800",
  violet:
    "bg-violet-50 text-violet-700 ring-violet-200 dark:bg-violet-950/40 dark:text-violet-200 dark:ring-violet-800",
  blue:
    "bg-sky-50 text-sky-700 ring-sky-200 dark:bg-sky-950/40 dark:text-sky-200 dark:ring-sky-800",
  slate:
    "bg-slate-100 text-slate-600 ring-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:ring-slate-700",
}

export function formatCurrency(value) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value)
}

export function getOrderBucket(order) {
  const status = String(order.status || "").toLowerCase()
  if (
    status.includes("sent") ||
    status.includes("created") ||
    status.includes("pending") ||
    status.includes("open") ||
    status.includes("processing")
  ) {
    return "upcoming"
  }
  return "past"
}

export default function MyOrders() {
  const t = useTranslations("myOrders")
  const canViewOrderDetails = true
  const [selectedOrderId, setSelectedOrderId] = useState(null)
  const [statusFilter, setStatusFilter] = useState("all")
  const [typeFilter, setTypeFilter] = useState("All Types");
  const DEFAULT_CUSTNMBR = localStorage.getItem("custnmbr");
  const [customerId, setCustomerId] = useState(DEFAULT_CUSTNMBR);
  // const [orders, setOrders] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [refreshKey, setRefreshKey] = useState(0)
  const [orderList, setOrderList] = useState([]);


  // Draggable settings
  const gridRef = useRef(null)
const dragRef = useRef(null)
const [detailsWidth, setDetailsWidth] = useState(430)
const [maxDetailsWidth, setMaxDetailsWidth] = useState(430)
const [isResizing, setIsResizing] = useState(false)
const panelWidth = Math.min(detailsWidth, maxDetailsWidth)

useEffect(() => {
  const grid = gridRef.current

  const observer = new ResizeObserver(([entry]) => {
    const gap = parseFloat(getComputedStyle(grid).columnGap) || 0

    // Preserve the original width if 40% would make the panel smaller.
    setMaxDetailsWidth(
      Math.max(430, (entry.contentRect.width - gap) * 0.4)
    )
  })

  observer.observe(grid)
  return () => observer.disconnect()
}, [])

function resizeDetails(width) {
  setDetailsWidth(
    Math.min(maxDetailsWidth, Math.max(430, width))
  )
}

  const handleRefresh = useCallback(() => {
    setRefreshKey((prev) => prev + 1)
  }, [])

  // Let other parts of the app (e.g. the header's checkout flow) trigger
  // the same refresh as the Refresh button, without a full page reload.
  useEffect(() => {
    const onExternalRefresh = () => handleRefresh()
    window.addEventListener("aloha-orders-refresh", onExternalRefresh)
    return () => {
      window.removeEventListener("aloha-orders-refresh", onExternalRefresh)
    }
  }, [handleRefresh])

 

  const handleCustomerIdChange = useCallback((newId) => {
    setIsLoading(true)
    setCustomerId(newId)
  }, [])

  const filteredOrders = useMemo(
    () =>
      orderList.filter((order) => {
        const matchesStatus =
          statusFilter === "all" || getOrderBucket(order) === statusFilter

        const matchesType =
          typeFilter === "All Types" ||
          (typeFilter === "App/Web" && order.type === "App/Web") ||
          (typeFilter === "Others" && order.type !== "App/Web")

        return matchesStatus && matchesType
      }),
    [orderList, statusFilter, typeFilter],
  )

  const selectedOrder =
    filteredOrders.find((order) => order.id === selectedOrderId) || null

  const fetchCustomerOrders = async (customerId) => {
    setIsLoading(true);

    try {
      const url = `${process.env.NEXT_PUBLIC_NRL_API_URL}/customers/${DEFAULT_CUSTNMBR}/orders`;

      console.log("Customer ID:", customerId);
      console.log("Customer Orders API URL:", url);

      const response = await fetch(url, {
        method: "GET",
        headers: {
          Accept: "application/json",
          Authorization: `${process.env.NEXT_PUBLIC_AUTH_TOKEN}`,
        },
      });

      console.log("Customer Orders HTTP Status:", response.status);
      console.log("Customer Orders HTTP OK:", response.ok);

      const responseText = await response.text();

      console.log("Customer Orders Raw Response:", responseText);

      let result = null;

      try {
        result = responseText ? JSON.parse(responseText) : null;
      } catch (error) {
        console.warn("Response is not JSON:", responseText);
      }

      console.log("Customer Orders Parsed Response:", result);

      if (!response.ok) {
        throw new Error(
          result?.Msg ||
          result?.message ||
          result?.error ||
          `Unable to fetch customer orders. HTTP ${response.status}`
        );
      }

      setOrderList(result);

      return result;
    } catch (error) {
      console.error("Customer Orders Error:", error);
      setOrderList([]);
      return null;
    } finally {
      setIsLoading(false);
    }
  };


  useEffect(() => {
    fetchCustomerOrders(customerId);
    console.log("Orderview", orderList);
  }, [customerId, refreshKey])

  useEffect(() => {
    console.log("Orderview Updated:", orderList);
  }, [orderList]);

  return (
  <main
    ref={gridRef}
    style={{ "--details-width": `${panelWidth}px` }}
    className={cn(
      "grid min-h-full gap-4 bg-background p-3 sm:p-4 xl:grid-cols-[minmax(0,1fr)_minmax(360px,var(--details-width))] xl:pb-6",
      isResizing && "select-none cursor-col-resize",
    )}
  >
    <div
      className={cn(
        "min-h-0",
        selectedOrder ? "hidden xl:block" : "block",
      )}
    >
      <OrderList
        orders={orderList}
        filteredOrders={filteredOrders}
        selectedOrder={selectedOrder}
        statusFilter={statusFilter}
        typeFilter={typeFilter}
        customerId={customerId}
        isLoading={isLoading}
        error={error}
        onCustomerIdChange={handleCustomerIdChange}
        onRefresh={handleRefresh}
        onStatusFilterChange={setStatusFilter}
        onTypeFilterChange={setTypeFilter}
        onSelectOrder={
          canViewOrderDetails ? setSelectedOrderId : () => {}
        }
        canViewOrderDetails={canViewOrderDetails}
      />
    </div>

    <div
      className={cn(
        "relative h-full min-h-0 min-w-0 xl:sticky xl:top-4 xl:h-[calc(100svh-6.5rem)] xl:self-start",
        selectedOrder ? "block" : "hidden xl:block",
      )}
    >
      {/* Draggable divider — desktop only */}
      <div
        role="separator"
        aria-label="Resize order details"
        aria-orientation="vertical"
        aria-controls="order-details-panel"
        aria-valuemin={430}
        aria-valuemax={Math.round(maxDetailsWidth)}
        aria-valuenow={Math.round(panelWidth)}
        tabIndex={0}
        className="group absolute -left-4 top-0 hidden h-full w-4 touch-none cursor-col-resize items-center justify-center outline-none xl:flex"
        onPointerDown={(event) => {
          if (event.button !== 0) return

          event.preventDefault()
          event.currentTarget.focus()
          event.currentTarget.setPointerCapture(event.pointerId)

          dragRef.current = {
            x: event.clientX,
            width: panelWidth,
          }

          setIsResizing(true)
        }}
        onPointerMove={(event) => {
          if (!dragRef.current) return

          resizeDetails(
            dragRef.current.width +
              dragRef.current.x -
              event.clientX,
          )
        }}
        onPointerUp={(event) => {
          if (
            event.currentTarget.hasPointerCapture(event.pointerId)
          ) {
            event.currentTarget.releasePointerCapture(
              event.pointerId,
            )
          }

          dragRef.current = null
          setIsResizing(false)
        }}
        onLostPointerCapture={() => {
          dragRef.current = null
          setIsResizing(false)
        }}
        onKeyDown={(event) => {
          if (
            !["ArrowLeft", "ArrowRight", "Home", "End"].includes(
              event.key,
            )
          ) {
            return
          }

          event.preventDefault()

          if (event.key === "Home") {
            resizeDetails(430)
          } else if (event.key === "End") {
            resizeDetails(maxDetailsWidth)
          } else {
            resizeDetails(
              panelWidth +
                (event.key === "ArrowLeft" ? 20 : -20),
            )
          }
        }}
        onDoubleClick={() => setDetailsWidth(430)}
      >
        <span
          className={cn(
            "h-12 w-1 rounded-full bg-border transition-colors group-hover:bg-primary group-focus-visible:bg-primary",
            isResizing && "bg-primary",
          )}
        />
      </div>

      <div id="order-details-panel" className="h-full min-w-0">
        {selectedOrder ? (
          <OrderDetails
            order={selectedOrder}
            onBack={() => setSelectedOrderId(null)}
            onClose={() => setSelectedOrderId(null)}
            onReorderSuccess={handleRefresh}
          />
        ) : (
          <section className="hidden h-full min-h-[18rem] place-items-center rounded-lg border bg-card xl:grid">
            <p className="px-4 text-center text-sm text-muted-foreground">
              {t("selectOrder")}
            </p>
          </section>
        )}
      </div>
    </div>
  </main>
)
}