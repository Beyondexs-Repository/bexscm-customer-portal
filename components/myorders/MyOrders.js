"use client"
import { useCallback, useEffect, useMemo, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useTranslations } from "next-intl"
import { DEFAULT_CUSTNMBR } from "@/lib/api/ordersApi"
// import {
//   fetchCustomerOrders,
//   selectOrders,
//   selectOrdersStatus,
//   selectOrdersError,
// } from "@/lib/redux/slices/ordersSlice"
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
  const dispatch = useDispatch()
  const canViewOrderDetails = true
  const [selectedOrderId, setSelectedOrderId] = useState(null)
  const [statusFilter, setStatusFilter] = useState("all")
  const [typeFilter, setTypeFilter] = useState("All Types")
  const [customerId, setCustomerId] = useState(DEFAULT_CUSTNMBR)
  const [refreshKey, setRefreshKey] = useState(0)
  const [orderList, setOrderList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Redux-backed orders state (dispatched via fetchCustomerOrders thunk)
  // const orders = useSelector(selectOrders)
  //const ordersStatus = useSelector(selectOrdersStatus)
  // const error = useSelector(selectOrdersError)
  // const isLoading = ordersStatus === "loading" || ordersStatus === "idle"

  // console.log(orderList, ordersStatus, error, isLoading, "--find getslice datas & loading");

  const handleRefresh = useCallback(() => {
    setRefreshKey((prev) => prev + 1)
  }, [])


  const fetchCustomerOrders = async (customerId) => {
  setIsLoading(true);

  try {
    const url = `${process.env.NEXT_PUBLIC_NRL_API_URL}/customers/400001/orders`;

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

  const handleCustomerIdChange = useCallback((newId) => {
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

  return (
    <main className="grid min-h-full gap-4 bg-background p-3 sm:p-4 xl:h-full xl:min-h-0 xl:grid-cols-[minmax(0,1fr)_minmax(360px,430px)] xl:pb-6">
      <div className={cn("min-h-0", selectedOrder ? "hidden xl:block" : "block")}>
        <OrderList
          orders={orderList}
          filteredOrders={filteredOrders}
          selectedOrder={selectedOrder}
          statusFilter={statusFilter}
          typeFilter={typeFilter}
          customerId={customerId}
           isLoading={isLoading}
          //  error={error}
          onCustomerIdChange={handleCustomerIdChange}
          onRefresh={handleRefresh}
          onStatusFilterChange={setStatusFilter}
          onTypeFilterChange={setTypeFilter}
          onSelectOrder={canViewOrderDetails ? setSelectedOrderId : () => { }}
          canViewOrderDetails={canViewOrderDetails}
        />
      </div>

      <div className={cn("h-full min-h-0", selectedOrder ? "block" : "hidden xl:block")}>
        {selectedOrder ? (
          <OrderDetails
            order={selectedOrder}
            onBack={() => setSelectedOrderId(null)}
            onClose={() => setSelectedOrderId(null)}
          />
        ) : (
          <section className="hidden h-full min-h-[18rem] place-items-center rounded-lg border bg-card xl:grid">
            <p className="px-4 text-center text-sm text-muted-foreground">
              {t("selectOrder")}
            </p>
          </section>
        )}
      </div>
    </main>
  )
}
