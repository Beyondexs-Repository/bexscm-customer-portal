// "use client"

// import { useEffect, useMemo, useState } from "react"
// import { useTranslations } from "next-intl"
// import {
//   CalendarClock,
//   ChevronRight,
//   CircleDollarSign,
//   Filter,
//   Loader2,
//   PackageCheck,
//   RefreshCw,
//   Search,
//   Truck,
//   UserCheck,
// } from "lucide-react"

// import { Badge } from "@/components/ui/badge"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import {
//   DropdownMenu,
//   DropdownMenuCheckboxItem,
//   DropdownMenuContent,
//   DropdownMenuLabel,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu"
// import PaginationCustom from "@/components/ui/pagination-custom"
// import { cn } from "@/lib/utils"

// import { formatCurrency, statusFilters, statusStyles, typeFilters } from "./MyOrders"

// function StatCard({ icon: Icon, value, label, tone }) {
//   return (
//     <div className="min-w-0 rounded-lg border bg-card p-2.5 shadow-sm sm:p-3">
//       <div className="flex min-w-0 items-center gap-2">
//         <div className={cn("flex size-8 shrink-0 items-center justify-center rounded-full", tone)}>
//           <Icon className="size-4" />
//         </div>

//         <div className="min-w-0">
//           <p className="break-words text-base font-bold leading-none tracking-normal sm:text-lg">
//             {value}
//           </p>
//           <p className="mt-1 text-[10px] font-semibold leading-tight text-muted-foreground sm:text-[11px]">
//             {label}
//           </p>
//         </div>
//       </div>
//     </div>
//   )
// }

// function OrderRow({ order, selected, onSelect, canViewOrderDetails }) {
//   const t = useTranslations("myOrders")

//   return (
//     <button
//       type="button"
//       disabled={!canViewOrderDetails}
//       onClick={() => onSelect(order.id)}
//       className={cn(
//         "grid w-full grid-cols-[minmax(0,1fr)_auto] gap-3 rounded-lg border bg-card p-3 text-left shadow-sm transition-colors enabled:hover:bg-muted/50 disabled:cursor-default sm:p-4 md:grid-cols-[minmax(0,2fr)_minmax(7rem,1.2fr)_minmax(5rem,1fr)_minmax(5.5rem,1fr)_auto] md:items-center md:gap-4 lg:gap-6",
//         selected && "border-primary",
//       )}
//     >
//       <div className="min-w-0">
//         <div className="flex min-w-0 items-center gap-2">
//           <p className="min-w-0 truncate text-xs font-bold">
//             {t("orderNumber", { number: order.orderNumber })}
//           </p>

//           <Badge className={cn("h-auto shrink-0 px-2 py-0.5 text-[10px] leading-none ring-1", statusStyles[order.statusTone || "blue"])}>
//             {order.status}
//           </Badge>
//         </div>

//         <p className="mt-1 line-clamp-2 text-[11px] leading-snug">
//           <span className="text-muted-foreground">{t("placedOnLabel")} </span>
//           <span className="font-semibold text-foreground">{order.placedOn}</span>
//           {order.placedAt && (
//             <span className="text-muted-foreground"> {t("at")} {order.placedAt}</span>
//           )}
//         </p>

//         <div className="mt-3 grid grid-cols-2 gap-3 md:hidden">
//           <div>
//             <p className="text-[11px] text-muted-foreground">{t("delivery")}</p>
//             <p className="text-xs font-bold leading-snug">{order.deliveryDate}</p>
//           </div>

//           <div>
//             <p className="text-[11px] text-muted-foreground">{t("total")}</p>
//             <p className="text-xs font-bold leading-snug">{formatCurrency(order.total)}</p>
//           </div>
//         </div>
//       </div>

//       <div className="hidden min-w-0 md:block">
//         <p className="text-[11px] text-muted-foreground">{t("deliveryDate")}</p>
//         <p className="text-xs font-bold leading-snug">{order.deliveryDate}</p>
//       </div>

//       <div className="hidden min-w-0 md:block">
//         <p className="text-[11px] text-muted-foreground">{t("type")}</p>
//         <p className="break-words text-xs font-bold leading-snug">{order.type}</p>
//       </div>

//       <div className="hidden pr-2 text-right md:block">
//         <p className="text-[11px] text-muted-foreground">{t("total")}</p>
//         <p className="whitespace-nowrap text-xs font-bold">{formatCurrency(order.total)}</p>
//       </div>

//       <ChevronRight className="mt-1 size-4 text-muted-foreground md:mt-0" />
//     </button>
//   )
// }

// export default function OrderList({
//   orders = [],
//   filteredOrders = [],
//   selectedOrder,
//   statusFilter,
//   typeFilter,
//   customerId = "400001",
//   isLoading = false,
//   error = null,
//   onCustomerIdChange,
//   onRefresh,
//   onStatusFilterChange,
//   onTypeFilterChange,
//   onSelectOrder,
//   canViewOrderDetails,
// }) {
//   const t = useTranslations("myOrders")
//   const [inputCustomer, setInputCustomer] = useState(customerId)
//   const [prevCustomerId, setPrevCustomerId] = useState(customerId)

//   // Pagination state
//   const [currentPage, setCurrentPage] = useState(1);
//   const [pageSize, setPageSize] = useState(5);

//   if (prevCustomerId !== customerId) {
//     setPrevCustomerId(customerId)
//     setInputCustomer(customerId)
//   }

//   // Reset to page 1 whenever filters or customer changes
//   useEffect(() => {
//     setCurrentPage(1)
//   }, [statusFilter, typeFilter, customerId, filteredOrders.length])

//   const totalItems = filteredOrders.length
//   const totalPages = Math.max(1, Math.ceil(totalItems / pageSize))
//   const validCurrentPage = Math.min(Math.max(1, currentPage), totalPages)

//   const paginatedOrders = useMemo(() => {
//     const start = (validCurrentPage - 1) * pageSize
//     return filteredOrders.slice(start, start + pageSize)
//   }, [filteredOrders, validCurrentPage, pageSize])

//   const deliveredCount = orders.filter((order) => {
//     const s = String(order.status).toLowerCase()
//     return s.includes("delivered") || s.includes("completed")
//   }).length

//   const upcomingCount = orders.filter((order) => {
//     const s = String(order.status).toLowerCase()
//     return s.includes("sent") || s.includes("created") || s.includes("pending") || s.includes("open")
//   }).length

//   const totalThisMonth = orders.reduce((sum, order) => sum + (Number(order.total) || 0), 0)

//   const statusFilterLabels = {
//     all: t("allOrders"),
//     upcoming: t("upcoming"),
//     past: t("past"),
//   }

//   const handleCustomerSubmit = (e) => {
//     e.preventDefault()
//     const val = inputCustomer.trim() || "400001"
//     if (onCustomerIdChange) {
//       onCustomerIdChange(val)
//     }
//   }

//   return (
//     <div className="flex min-h-0 flex-col gap-4 pb-2 xl:h-[calc(100svh-6.5rem)] xl:pb-0">
//       {/* Dashboard Count Stat Cards - Based on order list */}
//       <section className="grid shrink-0 grid-cols-2 gap-3 min-[1420px]:grid-cols-4">
//         <StatCard icon={Truck} value={orders.length} label={t("totalOrders")} tone="bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-300" />
//         <StatCard icon={PackageCheck} value={deliveredCount} label={t("ordersDelivered")} tone="bg-violet-50 text-violet-600 dark:bg-violet-950/50 dark:text-violet-300" />
//         <StatCard icon={CalendarClock} value={upcomingCount} label={t("upcomingOrders")} tone="bg-orange-50 text-orange-600 dark:bg-orange-950/50 dark:text-orange-300" />
//         <StatCard icon={CircleDollarSign} value={formatCurrency(totalThisMonth)} label={t("totalSpend")} tone="bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-300" />
//       </section>

//       {/* Main Order List Section */}
//       <section className="flex min-h-0 flex-1 flex-col rounded-lg border bg-background p-3 shadow-sm sm:p-4">
//         {/* Customer Input & Controls Header */}
//         <div className="flex flex-col gap-3 border-b pb-4">
//           <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
//             <div className="min-w-0">
//               <div className="flex items-center gap-2">
//                 <h2 className="text-lg font-bold leading-tight sm:text-xl">{t("recentOrders")}</h2>
//                 <Badge variant="outline" className="gap-1 text-xs font-normal">
//                   <UserCheck className="size-3 text-primary" />
//                   ID: <span className="font-semibold">{customerId}</span>
//                 </Badge>
//               </div>
//               <p className="mt-1 text-xs text-muted-foreground">{t("filterHint")}</p>
//             </div>

//             {/* Status Filter Tabs (Moved to Top Right) */}
//             <div className="grid grid-cols-3 rounded-lg bg-muted p-1">
//               {statusFilters.map((filter) => (
//                 <Button
//                   key={filter}
//                   variant={statusFilter === filter ? "default" : "ghost"}
//                   size="sm"
//                   className="h-8 min-w-0 px-2 text-[11px] sm:px-3 sm:text-xs"
//                   onClick={() => onStatusFilterChange(filter)}
//                 >
//                   <span className="truncate">{statusFilterLabels[filter]}</span>
//                 </Button>
//               ))}
//             </div>
//           </div>

//           {/* Filters & Actions Bar */}
//           <div className="flex flex-col gap-3 pt-1 sm:flex-row sm:items-center sm:justify-between">
//             {/* Customer ID Input Form (Moved to Bottom Left) */}
//             <form onSubmit={handleCustomerSubmit} className="flex items-center gap-2">
//               <div className="relative flex-1 sm:w-44">
//                 <Input
//                   type="text"
//                   placeholder="Customer ID"
                
//                   value={inputCustomer}
//                   onChange={(e) => setInputCustomer(e.target.value)}
//                   className="h-9 pr-8 text-xs font-mono"
//                 />
//                 <button type="submit" aria-label="Search Customer Orders" className="absolute right-2 top-2.5 text-muted-foreground hover:text-foreground">
//                   <Search className="size-4" />
//                 </button>
//               </div>
//               <Button type="submit" size="sm" variant="default" className="h-9 px-3 text-xs">
//                 {t("search") || "Search"}
//               </Button>
//               {onRefresh && (
//                 <Button type="button" size="sm" variant="outline" onClick={onRefresh} disabled={isLoading} className="h-9 px-2" title="Refresh orders">
//                   <RefreshCw className={cn("size-3.5", isLoading && "animate-spin")} />
//                 </Button>
//               )}
//             </form>

//             <div className="flex items-center gap-2">
//               <DropdownMenu>
//                 <DropdownMenuTrigger asChild>
//                   <Button variant="outline" size="sm" className="h-8 min-w-0 justify-between gap-2 px-3 text-xs">
//                     <span className="flex min-w-0 items-center gap-2">
//                       <Filter className="size-3.5 shrink-0" />
//                       <span className="truncate">{typeFilter === "All Types" ? t("orderType") : typeFilter}</span>
//                     </span>
//                   </Button>
//                 </DropdownMenuTrigger>

//                 <DropdownMenuContent align="end" className="w-48">
//                   <DropdownMenuLabel>{t("type")}</DropdownMenuLabel>
//                   <DropdownMenuCheckboxItem checked={typeFilter === "All Types"} onCheckedChange={() => onTypeFilterChange("All Types")}>
//                     {t("allTypes")}
//                   </DropdownMenuCheckboxItem>
//                   {typeFilters.map((type) => (
//                     <DropdownMenuCheckboxItem key={type} checked={typeFilter === type} onCheckedChange={() => onTypeFilterChange(type)}>
//                       {type}
//                     </DropdownMenuCheckboxItem>
//                   ))}
//                 </DropdownMenuContent>
//               </DropdownMenu>
//             </div>
//           </div>
//         </div>

//         {/* Results Count / Range Info - Placed above orders list */}
//         {!isLoading && !error && filteredOrders.length > 0 && (
//           <div className="pt-3 pb-1 text-xs text-muted-foreground font-medium">
//             {t("showing", {
//               start: (validCurrentPage - 1) * pageSize + 1,
//               end: Math.min(validCurrentPage * pageSize, totalItems),
//               total: totalItems,
//             })}
//           </div>
//         )}

//         {/* Orders List View / Loading / Error State */}
//         <div className="custom-scrollbar min-h-0 flex-1 space-y-3 overflow-y-auto pt-2 pr-1">
//           {isLoading ? (
//             <div className="flex min-h-40 flex-col items-center justify-center gap-2 rounded-lg border bg-card p-6 text-muted-foreground xl:h-full xl:min-h-0">
//               <Loader2 className="size-6 animate-spin text-primary" />
//               <p className="text-xs font-medium">Loading orders for Customer #{customerId}...</p>
//             </div>
//           ) : error ? (
//             <div className="flex min-h-40 flex-col items-center justify-center gap-3 rounded-lg border border-destructive/20 bg-destructive/5 p-6 text-center text-destructive">
//               <p className="text-xs font-semibold">{error}</p>
//               <Button variant="outline" size="sm" onClick={onRefresh} className="h-8 text-xs">
//                 <RefreshCw className="mr-1.5 size-3" /> Retry
//               </Button>
//             </div>
//           ) : paginatedOrders.length > 0 ? (
//             paginatedOrders.map((order) => (
//               <OrderRow
//                 key={order.id}
//                 order={order}
//                 selected={selectedOrder?.id === order.id}
//                 onSelect={onSelectOrder}
//                 canViewOrderDetails={canViewOrderDetails}
//               />
//             ))
//           ) : (
//             <div className="grid min-h-40 place-items-center rounded-lg border bg-card p-6 text-center">
//               <p className="text-sm text-muted-foreground">{t("noOrdersFound")}</p>
//             </div>
//           )}
//         </div>

//         {/* Pagination Footer */}
//         {!isLoading && !error && filteredOrders.length > 0 && (
//           <PaginationCustom
//             currentPage={validCurrentPage}
//             totalPages={totalPages}
//             pageSize={pageSize}
//             totalItems={totalItems}
//             onPageChange={(page) => setCurrentPage(page)}
//             onPageSizeChange={(size) => {
//               setPageSize(size)
//               setCurrentPage(1)
//             }}
//             pageSizeOptions={[5, 10, 20, 50, 100]}
//             labels={{
//               show: t("show") || "Show",
//               perPage: t("perPage") || "per page",
//             }}
//           />
//         )}
//       </section>
//     </div>
//   )
// }



//CHANGED BY RADHIKA 2-09-2026 -- 12:27 PM ===================FOR SEACRCH FILTER WORKING=========================>
// "use client"

// import { useEffect, useMemo, useState } from "react"
// import { useTranslations } from "next-intl"
// import {
//   CalendarClock,
//   ChevronRight,
//   CircleDollarSign,
//   Filter,
//   Loader2,
//   PackageCheck,
//   RefreshCw,
//   Search,
//   Truck,
//   UserCheck,
// } from "lucide-react"

// import { Badge } from "@/components/ui/badge"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import {
//   DropdownMenu,
//   DropdownMenuCheckboxItem,
//   DropdownMenuContent,
//   DropdownMenuLabel,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu"
// import PaginationCustom from "@/components/ui/pagination-custom"
// import { cn } from "@/lib/utils"

// import { formatCurrency, statusFilters, statusStyles, typeFilters } from "./MyOrders"

// function StatCard({ icon: Icon, value, label, tone }) {
//   return (
//     <div className="min-w-0 rounded-lg border bg-card p-2.5 shadow-sm sm:p-3">
//       <div className="flex min-w-0 items-center gap-2">
//         <div className={cn("flex size-8 shrink-0 items-center justify-center rounded-full", tone)}>
//           <Icon className="size-4" />
//         </div>

//         <div className="min-w-0">
//           <p className="break-words text-base font-bold leading-none tracking-normal sm:text-lg">
//             {value}
//           </p>
//           <p className="mt-1 text-[10px] font-semibold leading-tight text-muted-foreground sm:text-[11px]">
//             {label}
//           </p>
//         </div>
//       </div>
//     </div>
//   )
// }

// function OrderRow({ order, selected, onSelect, canViewOrderDetails }) {
//   const t = useTranslations("myOrders")

//   return (
//     <button
//       type="button"
//       disabled={!canViewOrderDetails}
//       onClick={() => onSelect(order.id)}
//       className={cn(
//         "grid w-full grid-cols-[minmax(0,1fr)_auto] gap-3 rounded-lg border bg-card p-3 text-left shadow-sm transition-colors enabled:hover:bg-muted/50 disabled:cursor-default sm:p-4 md:grid-cols-[minmax(0,2fr)_minmax(7rem,1.2fr)_minmax(5rem,1fr)_minmax(5.5rem,1fr)_auto] md:items-center md:gap-4 lg:gap-6",
//         selected && "border-primary",
//       )}
//     >
//       <div className="min-w-0">
//         <div className="flex min-w-0 items-center gap-2">
//           <p className="min-w-0 truncate text-xs font-bold">
//             {t("orderNumber", { number: order.orderNumber })}
//           </p>

//           <Badge className={cn("h-auto shrink-0 px-2 py-0.5 text-[10px] leading-none ring-1", statusStyles[order.statusTone || "blue"])}>
//             {order.status}
//           </Badge>
//         </div>

//         <p className="mt-1 line-clamp-2 text-[11px] leading-snug">
//           <span className="text-muted-foreground">{t("placedOnLabel")} </span>
//           <span className="font-semibold text-foreground">{order.placedOn}</span>
//           {order.placedAt && (
//             <span className="text-muted-foreground"> {t("at")} {order.placedAt}</span>
//           )}
//         </p>

//         <div className="mt-3 grid grid-cols-2 gap-3 md:hidden">
//           <div>
//             <p className="text-[11px] text-muted-foreground">{t("delivery")}</p>
//             <p className="text-xs font-bold leading-snug">{order.deliveryDate}</p>
//           </div>

//           <div>
//             <p className="text-[11px] text-muted-foreground">{t("total")}</p>
//             <p className="text-xs font-bold leading-snug">{formatCurrency(order.total)}</p>
//           </div>
//         </div>
//       </div>

//       <div className="hidden min-w-0 md:block">
//         <p className="text-[11px] text-muted-foreground">{t("deliveryDate")}</p>
//         <p className="text-xs font-bold leading-snug">{order.deliveryDate}</p>
//       </div>

//       <div className="hidden min-w-0 md:block">
//         <p className="text-[11px] text-muted-foreground">{t("type")}</p>
//         <p className="break-words text-xs font-bold leading-snug">{order.type}</p>
//       </div>

//       <div className="hidden pr-2 text-right md:block">
//         <p className="text-[11px] text-muted-foreground">{t("total")}</p>
//         <p className="whitespace-nowrap text-xs font-bold">{formatCurrency(order.total)}</p>
//       </div>

//       <ChevronRight className="mt-1 size-4 text-muted-foreground md:mt-0" />
//     </button>
//   )
// }

// export default function OrderList({
//   orders = [],
//   filteredOrders = [],
//   selectedOrder,
//   statusFilter,
//   typeFilter,
//   customerId = "400001",
//   isLoading = false,
//   error = null,
//   onCustomerIdChange,
//   onRefresh,
//   onStatusFilterChange,
//   onTypeFilterChange,
//   onSelectOrder,
//   canViewOrderDetails,
// }) {
//   const t = useTranslations("myOrders")
//   const [inputCustomer, setInputCustomer] = useState(customerId)
//   const [prevCustomerId, setPrevCustomerId] = useState(customerId)

//   // Live text filter (order number / status / type) — mirrors the
//   // instant "type to filter" behavior, applied on top of whatever is
//   // already loaded, without needing to hit Search or refetch.
//   const [searchText, setSearchText] = useState("")

//   // Pagination state
//   const [currentPage, setCurrentPage] = useState(1);
//   const [pageSize, setPageSize] = useState(5);

//   if (prevCustomerId !== customerId) {
//     setPrevCustomerId(customerId)
//     setInputCustomer(customerId)
//   }

//   // Reset to page 1 whenever filters, search text, or customer changes
//   useEffect(() => {
//     setCurrentPage(1)
//   }, [statusFilter, typeFilter, customerId, searchText, filteredOrders.length])

//   // Instant client-side search across order number, status, and type.
//   const searchedOrders = useMemo(() => {
//     const query = searchText.trim().toLowerCase()
//     if (!query) return filteredOrders

//     return filteredOrders.filter((order) => {
//       const orderNumber = String(order.orderNumber ?? "").toLowerCase()
//       const status = String(order.status ?? "").toLowerCase()
//       const type = String(order.type ?? "").toLowerCase()
//       const deliveryDate = String(order.deliveryDate ?? "").toLowerCase()

//       return (
//         orderNumber.includes(query) ||
//         status.includes(query) ||
//         type.includes(query) ||
//         deliveryDate.includes(query)
//       )
//     })
//   }, [filteredOrders, searchText])

//   const totalItems = searchedOrders.length
//   const totalPages = Math.max(1, Math.ceil(totalItems / pageSize))
//   const validCurrentPage = Math.min(Math.max(1, currentPage), totalPages)

//   const paginatedOrders = useMemo(() => {
//     const start = (validCurrentPage - 1) * pageSize
//     return searchedOrders.slice(start, start + pageSize)
//   }, [searchedOrders, validCurrentPage, pageSize])

//   const deliveredCount = orders.filter((order) => {
//     const s = String(order.status).toLowerCase()
//     return s.includes("delivered") || s.includes("completed")
//   }).length

//   const upcomingCount = orders.filter((order) => {
//     const s = String(order.status).toLowerCase()
//     return s.includes("sent") || s.includes("created") || s.includes("pending") || s.includes("open")
//   }).length

//   const totalThisMonth = orders.reduce((sum, order) => sum + (Number(order.total) || 0), 0)

//   const statusFilterLabels = {
//     all: t("allOrders"),
//     upcoming: t("upcoming"),
//     past: t("past"),
//   }

//   // Submit still lets you switch which customer's orders are loaded
//   // (server-side), while typing itself filters instantly (client-side).
//   const handleCustomerSubmit = (e) => {
//     e.preventDefault()
//     const val = inputCustomer.trim() || "400001"
//     if (onCustomerIdChange) {
//       onCustomerIdChange(val)
//     }
//   }

//   const handleSearchChange = (e) => {
//     const val = e.target.value
//     setInputCustomer(val)
//     setSearchText(val)
//   }

//   return (
//     <div className="flex min-h-0 flex-col gap-4 pb-2 xl:h-[calc(100svh-6.5rem)] xl:pb-0">
//       {/* Dashboard Count Stat Cards - Based on order list */}
//       <section className="grid shrink-0 grid-cols-2 gap-3 min-[1420px]:grid-cols-4">
//         <StatCard icon={Truck} value={orders.length} label={t("totalOrders")} tone="bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-300" />
//         <StatCard icon={PackageCheck} value={deliveredCount} label={t("ordersDelivered")} tone="bg-violet-50 text-violet-600 dark:bg-violet-950/50 dark:text-violet-300" />
//         <StatCard icon={CalendarClock} value={upcomingCount} label={t("upcomingOrders")} tone="bg-orange-50 text-orange-600 dark:bg-orange-950/50 dark:text-orange-300" />
//         <StatCard icon={CircleDollarSign} value={formatCurrency(totalThisMonth)} label={t("totalSpend")} tone="bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-300" />
//       </section>

//       {/* Main Order List Section */}
//       <section className="flex min-h-0 flex-1 flex-col rounded-lg border bg-background p-3 shadow-sm sm:p-4">
//         {/* Customer Input & Controls Header */}
//         <div className="flex flex-col gap-3 border-b pb-4">
//           <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
//             <div className="min-w-0">
//               <div className="flex items-center gap-2">
//                 <h2 className="text-lg font-bold leading-tight sm:text-xl">{t("recentOrders")}</h2>
//                 <Badge variant="outline" className="gap-1 text-xs font-normal">
//                   <UserCheck className="size-3 text-primary" />
//                   ID: <span className="font-semibold">{"400001"}</span>
//                 </Badge>
//               </div>
//               <p className="mt-1 text-xs text-muted-foreground">{t("filterHint")}</p>
//             </div>

//             {/* Status Filter Tabs (Moved to Top Right) */}
//             <div className="grid grid-cols-3 rounded-lg bg-muted p-1">
//               {statusFilters.map((filter) => (
//                 <Button
//                   key={filter}
//                   variant={statusFilter === filter ? "default" : "ghost"}
//                   size="sm"
//                   className="h-8 min-w-0 px-2 text-[11px] sm:px-3 sm:text-xs"
//                   onClick={() => onStatusFilterChange(filter)}
//                 >
//                   <span className="truncate">{statusFilterLabels[filter]}</span>
//                 </Button>
//               ))}
//             </div>
//           </div>

//           {/* Filters & Actions Bar */}
//           <div className="flex flex-col gap-3 pt-1 sm:flex-row sm:items-center sm:justify-between">
//             {/* Search / Customer ID Input Form */}
//             <form onSubmit={handleCustomerSubmit} className="flex items-center gap-2">
//               <div className="relative flex-1 sm:w-44">
//                 <Input
//                   type="text"
//                   placeholder="Order #"
//                   value={inputCustomer}
//                   onChange={handleSearchChange}
//                   className="h-9 pr-8 text-xs font-mono"
//                 />
//                 <button type="submit" aria-label="Search Customer Orders" className="absolute right-2 top-2.5 text-muted-foreground hover:text-foreground">
//                   <Search className="size-4" />
//                 </button>
//               </div>
//               <Button type="submit" size="sm" variant="default" className="h-9 px-3 text-xs">
//                 {t("search") || "Search"}
//               </Button>
//               {onRefresh && (
//                 <Button
//                   type="button"
//                   size="sm"
//                   variant="outline"
//                   onClick={onRefresh}
//                   disabled={isLoading}
//                   className="h-9 px-2"
//                   title="Refresh orders"
//                 >
//                   <RefreshCw className={cn("size-3.5", isLoading && "animate-spin")} />
//                 </Button>
//               )}
//             </form>

//             <div className="flex items-center gap-2">
//               <DropdownMenu>
//                 <DropdownMenuTrigger asChild>
//                   <Button variant="outline" size="sm" className="h-8 min-w-0 justify-between gap-2 px-3 text-xs">
//                     <span className="flex min-w-0 items-center gap-2">
//                       <Filter className="size-3.5 shrink-0" />
//                       <span className="truncate">{typeFilter === "All Types" ? t("orderType") : typeFilter}</span>
//                     </span>
//                   </Button>
//                 </DropdownMenuTrigger>

//                 <DropdownMenuContent align="end" className="w-48">
//                   <DropdownMenuLabel>{t("type")}</DropdownMenuLabel>
//                   <DropdownMenuCheckboxItem checked={typeFilter === "All Types"} onCheckedChange={() => onTypeFilterChange("All Types")}>
//                     {t("allTypes")}
//                   </DropdownMenuCheckboxItem>
//                   {typeFilters.map((type) => (
//                     <DropdownMenuCheckboxItem key={type} checked={typeFilter === type} onCheckedChange={() => onTypeFilterChange(type)}>
//                       {type}
//                     </DropdownMenuCheckboxItem>
//                   ))}
//                 </DropdownMenuContent>
//               </DropdownMenu>
//             </div>
//           </div>
//         </div>

//         {/* Results Count / Range Info - Placed above orders list */}
//         {!isLoading && !error && searchedOrders.length > 0 && (
//           <div className="pt-3 pb-1 text-xs text-muted-foreground font-medium">
//             {t("showing", {
//               start: (validCurrentPage - 1) * pageSize + 1,
//               end: Math.min(validCurrentPage * pageSize, totalItems),
//               total: totalItems,
//             })}
//           </div>
//         )}

//         {/* Orders List View / Loading / Error State */}
//         <div className="custom-scrollbar min-h-0 flex-1 space-y-3 overflow-y-auto pt-2 pr-1">
//           {isLoading ? (
//             <div className="flex min-h-40 flex-col items-center justify-center gap-2 rounded-lg border bg-card p-6 text-muted-foreground xl:h-full xl:min-h-0">
//               <Loader2 className="size-6 animate-spin text-primary" />
//               <p className="text-xs font-medium">Loading orders for Customer #{customerId}...</p>
//             </div>
//           ) : error ? (
//             <div className="flex min-h-40 flex-col items-center justify-center gap-3 rounded-lg border border-destructive/20 bg-destructive/5 p-6 text-center text-destructive">
//               <p className="text-xs font-semibold">{error}</p>
//               <Button variant="outline" size="sm" onClick={onRefresh} className="h-8 text-xs">
//                 <RefreshCw className="mr-1.5 size-3" /> Retry
//               </Button>
//             </div>
//           ) : paginatedOrders.length > 0 ? (
//             paginatedOrders.map((order) => (
//               <OrderRow
//                 key={order.id}
//                 order={order}
//                 selected={selectedOrder?.id === order.id}
//                 onSelect={onSelectOrder}
//                 canViewOrderDetails={canViewOrderDetails}
//               />
//             ))
//           ) : (
//             <div className="grid min-h-40 place-items-center rounded-lg border bg-card p-6 text-center">
//               <p className="text-sm text-muted-foreground">{t("noOrdersFound")}</p>
//             </div>
//           )}
//         </div>

//         {/* Pagination Footer */}
//         {!isLoading && !error && searchedOrders.length > 0 && (
//           <PaginationCustom
//             currentPage={validCurrentPage}
//             totalPages={totalPages}
//             pageSize={pageSize}
//             totalItems={totalItems}
//             onPageChange={(page) => setCurrentPage(page)}
//             onPageSizeChange={(size) => {
//               setPageSize(size)
//               setCurrentPage(1)
//             }}
//             pageSizeOptions={[5, 10, 20, 50, 100]}
//             labels={{
//               show: t("show") || "Show",
//               perPage: t("perPage") || "per page",
//             }}
//           />
//         )}
//       </section>
//     </div>
//   )
// }
"use client"

import { useEffect, useMemo, useState } from "react"
import { useTranslations } from "next-intl"
import {
  CalendarClock,
  ChevronRight,
  CircleDollarSign,
  Filter,
  Loader2,
  PackageCheck,
  RefreshCw,
  Search,
  Truck,
  UserCheck,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import PaginationCustom from "@/components/ui/pagination-custom"
import { cn } from "@/lib/utils"

import { formatCurrency, statusFilters, statusStyles, typeFilters } from "./MyOrders"

function StatCard({ icon: Icon, value, label, tone }) {
  return (
    <div className="min-w-0 rounded-lg border bg-card p-2.5 shadow-sm sm:p-3">
      <div className="flex min-w-0 items-center gap-2">
        <div className={cn("flex size-8 shrink-0 items-center justify-center rounded-full", tone)}>
          <Icon className="size-4" />
        </div>

        <div className="min-w-0">
          <p className="break-words text-base font-bold leading-none tracking-normal sm:text-lg">
            {value}
          </p>
          <p className="mt-1 text-[10px] font-semibold leading-tight text-muted-foreground sm:text-[11px]">
            {label}
          </p>
        </div>
      </div>
    </div>
  )
}

function OrderRow({ order, selected, onSelect, canViewOrderDetails }) {
  const t = useTranslations("myOrders")

  return (
    <button
      type="button"
      disabled={!canViewOrderDetails}
      onClick={() => onSelect(order.id)}
      className={cn(
        "grid w-full grid-cols-[minmax(0,1fr)_auto] gap-3 rounded-lg border bg-card p-3 text-left shadow-sm transition-colors enabled:hover:bg-muted/50 disabled:cursor-default sm:p-4 md:grid-cols-[minmax(0,2fr)_minmax(7rem,1.2fr)_minmax(5rem,1fr)_minmax(5.5rem,1fr)_auto] md:items-center md:gap-4 lg:gap-6",
        selected && "border-primary",
      )}
    >
      <div className="min-w-0">
        <div className="flex min-w-0 items-center gap-2">
          <p className="min-w-0 truncate text-xs font-bold">
            {t("orderNumber", { number: order.orderNumber })}
          </p>

          <Badge className={cn("h-auto shrink-0 px-2 py-0.5 text-[10px] leading-none ring-1", statusStyles[order.statusTone || "blue"])}>
            {order.status}
          </Badge>
        </div>

        <p className="mt-1 line-clamp-2 text-[11px] leading-snug">
          <span className="text-muted-foreground">{t("placedOnLabel")} </span>
          <span className="font-semibold text-foreground">{order.placedOn}</span>
          {order.placedAt && (
            <span className="text-muted-foreground"> {t("at")} {order.placedAt}</span>
          )}
        </p>

        <div className="mt-3 grid grid-cols-2 gap-3 md:hidden">
          <div>
            <p className="text-[11px] text-muted-foreground">{t("delivery")}</p>
            <p className="text-xs font-bold leading-snug">{order.deliveryDate}</p>
          </div>

          <div>
            <p className="text-[11px] text-muted-foreground">{t("total")}</p>
            <p className="text-xs font-bold leading-snug">{formatCurrency(order.total)}</p>
          </div>
        </div>
      </div>

      <div className="hidden min-w-0 md:block">
        <p className="text-[11px] text-muted-foreground">{t("deliveryDate")}</p>
        <p className="text-xs font-bold leading-snug">{order.deliveryDate}</p>
      </div>

      <div className="hidden min-w-0 md:block">
        <p className="text-[11px] text-muted-foreground">{t("type")}</p>
        <p className="break-words text-xs font-bold leading-snug">{order.type}</p>
      </div>

      <div className="hidden pr-2 text-right md:block">
        <p className="text-[11px] text-muted-foreground">{t("total")}</p>
        <p className="whitespace-nowrap text-xs font-bold">{formatCurrency(order.total)}</p>
      </div>

      <ChevronRight className="mt-1 size-4 text-muted-foreground md:mt-0" />
    </button>
  )
}

export default function OrderList({
  orders = [],
  filteredOrders = [],
  selectedOrder,
  statusFilter,
  typeFilter,
  customerId = "400001",
  isLoading = false,
  error = null,
  onCustomerIdChange,
  onRefresh,
  onStatusFilterChange,
  onTypeFilterChange,
  onSelectOrder,
  canViewOrderDetails,
}) {
  const t = useTranslations("myOrders")
  const [inputCustomer, setInputCustomer] = useState(customerId)
  const [prevCustomerId, setPrevCustomerId] = useState(customerId)

  // Live text filter (order number / status / type) — mirrors the
  // instant "type to filter" behavior, applied on top of whatever is
  // already loaded, without needing to hit Search or refetch.
  const [searchText, setSearchText] = useState("")

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  if (prevCustomerId !== customerId) {
    setPrevCustomerId(customerId)
    setInputCustomer(customerId)
  }

  // Reset to page 1 whenever filters, search text, or customer changes
  useEffect(() => {
    setCurrentPage(1)
  }, [statusFilter, typeFilter, customerId, searchText, filteredOrders.length])

  // Instant client-side search across order number, status, and type.
  const searchedOrders = useMemo(() => {
    const query = searchText.trim().toLowerCase()
    if (!query) return filteredOrders

    return filteredOrders.filter((order) => {
      const orderNumber = String(order.orderNumber ?? "").toLowerCase()
      const status = String(order.status ?? "").toLowerCase()
      const type = String(order.type ?? "").toLowerCase()
      const deliveryDate = String(order.deliveryDate ?? "").toLowerCase()
      const placedOn = String(order.placedOn ?? "").toLowerCase()
      const placedAt = String(order.placedAt ?? "").toLowerCase()

      return (
        orderNumber.includes(query) ||
        status.includes(query) ||
        type.includes(query) ||
        deliveryDate.includes(query) ||
        placedOn.includes(query) ||
        placedAt.includes(query)
      )
    })
  }, [filteredOrders, searchText])

  const totalItems = searchedOrders.length
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize))
  const validCurrentPage = Math.min(Math.max(1, currentPage), totalPages)

  const paginatedOrders = useMemo(() => {
    const start = (validCurrentPage - 1) * pageSize
    return searchedOrders.slice(start, start + pageSize)
  }, [searchedOrders, validCurrentPage, pageSize])

  const deliveredCount = orders.filter((order) => {
    const s = String(order.status).toLowerCase()
    return s.includes("delivered") || s.includes("completed")
  }).length

  const upcomingCount = orders.filter((order) => {
    const s = String(order.status).toLowerCase()
    return s.includes("sent") || s.includes("created") || s.includes("pending") || s.includes("open")
  }).length

  const totalThisMonth = orders.reduce((sum, order) => sum + (Number(order.total) || 0), 0)

  const statusFilterLabels = {
    all: t("allOrders"),
    upcoming: t("upcoming"),
    past: t("past"),
  }

  // Submit still lets you switch which customer's orders are loaded
  // (server-side), while typing itself filters instantly (client-side).
  const handleCustomerSubmit = (e) => {
    e.preventDefault()
    const val = inputCustomer.trim() || "400001"
    if (onCustomerIdChange) {
      onCustomerIdChange(val)
    }
  }

  const handleSearchChange = (e) => {
    const val = e.target.value
    setInputCustomer(val)
    setSearchText(val)
  }

  return (
    <div className="flex min-h-0 flex-col gap-4 pb-2 xl:h-[calc(100svh-6.5rem)] xl:pb-0">
      {/* Dashboard Count Stat Cards - Based on order list */}
      <section className="grid shrink-0 grid-cols-2 gap-3 min-[1420px]:grid-cols-4">
        <StatCard icon={Truck} value={orders.length} label={t("totalOrders")} tone="bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-300" />
        <StatCard icon={PackageCheck} value={deliveredCount} label={t("ordersDelivered")} tone="bg-violet-50 text-violet-600 dark:bg-violet-950/50 dark:text-violet-300" />
        <StatCard icon={CalendarClock} value={upcomingCount} label={t("upcomingOrders")} tone="bg-orange-50 text-orange-600 dark:bg-orange-950/50 dark:text-orange-300" />
        <StatCard icon={CircleDollarSign} value={formatCurrency(totalThisMonth)} label={t("totalSpend")} tone="bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-300" />
      </section>

      {/* Main Order List Section */}
      <section className="flex min-h-0 flex-1 flex-col rounded-lg border bg-background p-3 shadow-sm sm:p-4">
        {/* Customer Input & Controls Header */}
        <div className="flex flex-col gap-3 border-b pb-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold leading-tight sm:text-xl">{t("recentOrders")}</h2>
                <Badge variant="outline" className="gap-1 text-xs font-normal">
                  <UserCheck className="size-3 text-primary" />
                  ID: <span className="font-semibold">{customerId}</span>
                </Badge>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">{t("filterHint")}</p>
            </div>

            {/* Status Filter Tabs (Moved to Top Right) */}
            <div className="grid grid-cols-3 rounded-lg bg-muted p-1">
              {statusFilters.map((filter) => (
                <Button
                  key={filter}
                  variant={statusFilter === filter ? "default" : "ghost"}
                  size="sm"
                  className="h-8 min-w-0 px-2 text-[11px] sm:px-3 sm:text-xs"
                  onClick={() => onStatusFilterChange(filter)}
                >
                  <span className="truncate">{statusFilterLabels[filter]}</span>
                </Button>
              ))}
            </div>
          </div>

          {/* Filters & Actions Bar */}
          <div className="flex flex-col gap-3 pt-1 sm:flex-row sm:items-center sm:justify-between">
            {/* Search / Customer ID Input Form */}
            <form onSubmit={handleCustomerSubmit} className="flex items-center gap-2">
              <div className="relative flex-1 sm:w-44">
                <Input
                  type="text"
                  placeholder="Search order # or Customer ID"
                  value={inputCustomer}
                  onChange={handleSearchChange}
                  className="h-9 pr-8 text-xs font-mono"
                />
                <button type="submit" aria-label="Search Customer Orders" className="absolute right-2 top-2.5 text-muted-foreground hover:text-foreground">
                  <Search className="size-4" />
                </button>
              </div>
              <Button type="submit" size="sm" variant="default" className="h-9 px-3 text-xs">
                {t("search") || "Search"}
              </Button>
              {onRefresh && (
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={onRefresh}
                  disabled={isLoading}
                  className="h-9 px-2"
                  title="Refresh orders"
                >
                  <RefreshCw className={cn("size-3.5", isLoading && "animate-spin")} />
                </Button>
              )}
            </form>

            <div className="flex items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="h-8 min-w-0 justify-between gap-2 px-3 text-xs">
                    <span className="flex min-w-0 items-center gap-2">
                      <Filter className="size-3.5 shrink-0" />
                      <span className="truncate">{typeFilter === "All Types" ? t("orderType") : typeFilter}</span>
                    </span>
                  </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuLabel>{t("type")}</DropdownMenuLabel>
                  <DropdownMenuCheckboxItem checked={typeFilter === "All Types"} onCheckedChange={() => onTypeFilterChange("All Types")}>
                    {t("allTypes")}
                  </DropdownMenuCheckboxItem>
                  {typeFilters.map((type) => (
                    <DropdownMenuCheckboxItem key={type} checked={typeFilter === type} onCheckedChange={() => onTypeFilterChange(type)}>
                      {type}
                    </DropdownMenuCheckboxItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>

        {/* Results Count / Range Info - Placed above orders list */}
        {!isLoading && !error && searchedOrders.length > 0 && (
          <div className="pt-3 pb-1 text-xs text-muted-foreground font-medium">
            {t("showing", {
              start: (validCurrentPage - 1) * pageSize + 1,
              end: Math.min(validCurrentPage * pageSize, totalItems),
              total: totalItems,
            })}
          </div>
        )}

        {/* Orders List View / Loading / Error State */}
        <div className="custom-scrollbar min-h-0 flex-1 space-y-3 overflow-y-auto pt-2 pr-1">
          {isLoading ? (
            <div className="flex min-h-40 flex-col items-center justify-center gap-2 rounded-lg border bg-card p-6 text-muted-foreground xl:h-full xl:min-h-0">
              <Loader2 className="size-6 animate-spin text-primary" />
              <p className="text-xs font-medium">Loading orders for Customer #{customerId}...</p>
            </div>
          ) : error ? (
            <div className="flex min-h-40 flex-col items-center justify-center gap-3 rounded-lg border border-destructive/20 bg-destructive/5 p-6 text-center text-destructive">
              <p className="text-xs font-semibold">{error}</p>
              <Button variant="outline" size="sm" onClick={onRefresh} className="h-8 text-xs">
                <RefreshCw className="mr-1.5 size-3" /> Retry
              </Button>
            </div>
          ) : paginatedOrders.length > 0 ? (
            paginatedOrders.map((order) => (
              <OrderRow
                key={order.id}
                order={order}
                selected={selectedOrder?.id === order.id}
                onSelect={onSelectOrder}
                canViewOrderDetails={canViewOrderDetails}
              />
            ))
          ) : (
            <div className="grid min-h-40 place-items-center rounded-lg border bg-card p-6 text-center">
              <p className="text-sm text-muted-foreground">{t("noOrdersFound")}</p>
            </div>
          )}
        </div>

        {/* Pagination Footer */}
        {!isLoading && !error && searchedOrders.length > 0 && (
          <PaginationCustom
            currentPage={validCurrentPage}
            totalPages={totalPages}
            pageSize={pageSize}
            totalItems={totalItems}
            onPageChange={(page) => setCurrentPage(page)}
            onPageSizeChange={(size) => {
              setPageSize(size)
              setCurrentPage(1)
            }}
            pageSizeOptions={[5, 10, 20, 50, 100]}
            labels={{
              show: t("show") || "Show",
              perPage: t("perPage") || "per page",
            }}
          />
        )}
      </section>
    </div>
  )
}