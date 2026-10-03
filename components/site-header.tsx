// "use client"

// import * as React from "react"
// import Link from "next/link"
// import { usePathname, useRouter } from "next/navigation"
// import { useTranslations } from "next-intl"
// import {
//   BadgeCheckIcon,
//   CalendarDaysIcon,
//   ChevronDownIcon,
//   Clock3Icon,
//   LogOutIcon,
//   MoreVerticalIcon,
//   SearchIcon,
//   ShoppingCartIcon,
//   Trash2Icon,
//   UploadCloudIcon,
// } from "lucide-react"
// import { toast } from "sonner"

// import { cn } from "@/lib/utils"
// import { clearSession } from "@/lib/auth"
// import { useCart } from "@/app/context/app-context"
// import { CartSidebar } from "@/components/cart-sidebar"
// import { GlobalUploadModal } from "@/components/upload/GlobalUploadModal"
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuGroup,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu"
// import { Separator } from "@/components/ui/separator"
// import { SidebarTrigger } from "@/components/ui/sidebar"

// const CUTOFF_TIME = "8:00 AM"
// const CUTOFF_DATE = "6/6"
// const DEFAULT_PROFILE = {
//   firstName: "Crate",
//   lastName: "Inc",
//   email: "hello@crateinc.com",
//   avatar: "",
// }

// const HEADER_ROUTES = [
//   ["/", "Overview", "View account activity, recent orders, and shortcuts"],
//   ["/catalog/details", "Product Details", "Review product information, pricing, and availability"],
//   ["/catalog", "Catalog", "Browse products, pricing, and availability", true],
//   ["/order-guide", "Order Guide", "Build and manage frequently ordered product lists"],
//   ["/my-orders", "My Orders", "Review current and previous orders"],
//   ["/invoices/details", "Invoice Details", "Review invoice charges, payments, and balances"],
//   ["/invoices", "Invoices", "Review invoice totals, payments, balances, and status", true],
//   ["/messages", "Messages", "Contact support and review conversations"],
//   ["/employees", "Employees", "View and manage store employees"],
//   ["/profile", "Profile", "Manage your account and contact information"],
// ] as const

// function getHeader(pathname: string) {
//   const normalizedPath =
//     pathname.length > 1 ? pathname.replace(/\/+$/, "") : pathname
//   const route = HEADER_ROUTES.find(([path, , , matchesChildren]) =>
//     matchesChildren
//       ? normalizedPath === path || normalizedPath.startsWith(`${path}/`)
//       : normalizedPath === path
//   )

//   return {
//     title: route?.[1] ?? "Crate Inc.",
//     description: route?.[2] ?? "",
//   }
// }

// type HeaderProfile = typeof DEFAULT_PROFILE

// function getFullName(profile: HeaderProfile) {
//   return [profile.firstName, profile.lastName].filter(Boolean).join(" ")
// }

// function getInitials(profile: HeaderProfile) {
//   return `${profile.firstName[0] ?? ""}${profile.lastName[0] ?? ""}`.toUpperCase()
// }

// const formatDeliveryDate = (date: Date) =>
//   date.toLocaleDateString("en-US", {
//     month: "short",
//     day: "numeric",
//     year: "numeric",
//   })

// const startOfDay = (date: Date) =>
//   new Date(date.getFullYear(), date.getMonth(), date.getDate())

// const isSameDay = (first: Date, second: Date) =>
//   first.getFullYear() === second.getFullYear() &&
//   first.getMonth() === second.getMonth() &&
//   first.getDate() === second.getDate()

// function HeaderInfoItem({
//   icon: Icon,
//   caption,
//   label,
//   className,
//   contentClassName,
//   children,
// }: {
//   icon: React.ComponentType<{ className?: string }>
//   caption: string
//   label: string
//   className?: string
//   contentClassName?: string
//   children?: React.ReactNode
// }) {
//   return (
//     <div className={cn("relative", className)}>
//       <div className={cn("flex h-10 items-center gap-2 px-1 text-left", contentClassName)}>
//         <Icon className="size-4 shrink-0 text-primary" />
//         <div className="grid gap-0.5 leading-none">
//           <span className="text-[10px] font-medium text-muted-foreground">
//             {caption}
//           </span>
//           <span className="text-xs font-semibold text-foreground">{label}</span>
//         </div>
//       </div>
//       {children}
//     </div>
//   )
// }

// interface UseCartReturn {
//   items: Array<{ id: string; name: string; qtybsuom: number; quantity: number; itemNumber: string; unit: string; image?: string }>
//   itemCount: number
//   total: number | string
//   incrementItem: (id: string) => void
//   decrementItem: (id: string) => void
//   removeItem: (id: string) => void
//   clearCart: () => void
//   // checkoutOrderApi: (custnmbr: string) => Promise<{ success?: boolean; message?: string; error?: string; orderNumber?: string; OrderNumber?: string; orderAmount?: number; OrderAmount?: number; total?: number }>
//   fetchCustomerCart: (custnmbr?: string) => Promise<unknown>
// }

// function SiteHeader({
//   className,
//   initialProfile = null,
//   children,
//   ...props
// }: React.PropsWithChildren<React.ComponentProps<"header"> & {
//   initialProfile?: Partial<HeaderProfile> | null
// }>) {
//   const router = useRouter()
//   const pathname = usePathname()
//   const t = useTranslations("header")
//   const { title, description } = getHeader(pathname)
//   const isMessagesPage = pathname === "/messages"
//   const canSearchMessages = true
//   const canClearChat = true
//   const profileUrl = "/profile"
//   const profile: HeaderProfile = {
//     ...DEFAULT_PROFILE,
//     ...initialProfile,
//   }
//   const profileName = getFullName(profile)
//   const profileInitials = getInitials(profile)
//   const {
//     items = [],
//     itemCount = 0,
//     total: cartTotal = 0,
//     incrementItem,
//     decrementItem,
//     removeItem,
//     clearCart,
//     // checkoutOrderApi,
//     fetchCustomerCart,
//   } = (useCart() as unknown) as UseCartReturn

//   const formattedCartTotal =
//     typeof cartTotal === "number"
//       ? `$${cartTotal.toFixed(2)}`
//       : String(cartTotal || "").startsWith("$")
//       ? String(cartTotal)
//       : `$${cartTotal || "0.00"}`

//   const calendarRef = React.useRef<HTMLDivElement>(null)
//   const calendarTriggerRef = React.useRef<HTMLButtonElement>(null)
//   const [uploadOpen, setUploadOpen] = React.useState(false)
//   const [cartOpen, setCartOpen] = React.useState(false)
//   const [isCheckingOut, setIsCheckingOut] = React.useState(false)
//   const [checkoutDeliveryDate, setCheckoutDeliveryDate] = React.useState("2026-09-21")
// const [poNumber, setPoNumber] = React.useState("")
// const [promoCode, setPromoCode] = React.useState("")
// const [notes, setNotes] = React.useState("")

//   React.useEffect(() => {
//     if (cartOpen && typeof fetchCustomerCart === "function") {
//       fetchCustomerCart();
//     }
//   }, [cartOpen, fetchCustomerCart])
//   const today = React.useMemo(() => startOfDay(new Date()), [])
//   const [calendarOpen, setCalendarOpen] = React.useState(false)
//   const [deliveryDate, setDeliveryDate] = React.useState(
//     () => new Date(2026, 5, 12)
//   )
//   const [calendarMonth, setCalendarMonth] = React.useState(
//     () => new Date(2026, 5, 1)
//   )


// // async function checkoutOrderApi({ custNmbr, deliveryDate, cutOffTime, notes, discountCode, poNumber }) {
//   async function checkoutOrderApi({
//   custNmbr,
//   deliveryDate,
//   cutOffTime,
//   notes,
//   discountCode,
//   poNumber,
// }: {
//   custNmbr: string
//   deliveryDate: string
//   cutOffTime: string
//   notes: string
//   discountCode: string
//   poNumber: string
// }) {
// const url = `${process.env.NEXT_PUBLIC_NRL_API_URL}/checkout`

//   const response = await fetch(url, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//       Accept: "application/json",
//         Authorization: `${process.env.NEXT_PUBLIC_AUTH_TOKEN}`,
//     },
//     body: JSON.stringify({
//       custNmbr,
//       deliveryDate,
//       cutOffTime,
//       notes,
//       discountCode,
//       poNumber,
//     }),
//   })

//   const text = await response.text()
//   let result = null
//   try {
//     result = text ? JSON.parse(text) : null
//   } catch {
//     console.warn("Checkout response is not JSON:", text)
//   }

//   if (!response.ok) {
//     throw new Error(result?.message || result?.error || `Checkout failed. HTTP ${response.status}`)
//   }

//   return result
// }
// async function handleCheckout() {
//   if (items.length === 0 || isCheckingOut) return
//   setIsCheckingOut(true)

//   try {
//     const res = await checkoutOrderApi({
//       custNmbr: "400001",
//       deliveryDate: checkoutDeliveryDate,
//       cutOffTime: "14:00:00",
//       notes,
//       discountCode: promoCode,
//       poNumber,
//     })

//     if (!res || res.success === false) {
//       throw new Error(res?.message || res?.error || "Order creation failed on backend server.")
//     }

//     const orderNum = res?.orderNumber ?? res?.OrderNumber ?? "CREATED"
//     const amount = Number(res?.orderAmount ?? res?.OrderAmount ?? res?.total) || 0

//     toast.success(
//       amount > 0
//         ? `Order #${orderNum} placed successfully! Total: $${amount.toFixed(2)}`
//         : `Order #${orderNum} placed successfully!`
//     )
//     clearCart()
//     setCartOpen(false)
//     setPoNumber("")
//     setPromoCode("")
//     setNotes("")
//   } catch (error) {
//     console.error("Checkout request failed:", error)
//     // const errorMsg = error?.message || "Checkout request failed. Please check API endpoint."
//     const errorMsg = error instanceof Error ? error.message : "Checkout request failed. Please check API endpoint."
//     toast.error(`Checkout Failed: ${errorMsg}`)
//   } finally {
//     setIsCheckingOut(false)
//   }
// }

//   const calendarDays = React.useMemo(() => {
//     const year = calendarMonth.getFullYear()
//     const month = calendarMonth.getMonth()
//     const firstDay = new Date(year, month, 1)
//     const dayOffset = firstDay.getDay()
//     const daysInMonth = new Date(year, month + 1, 0).getDate()

//     return Array.from({ length: dayOffset + daysInMonth }, (_, index) => {
//       if (index < dayOffset) {
//         return null
//       }

//       return new Date(year, month, index - dayOffset + 1)
//     })
//   }, [calendarMonth])

//   const calendarTitle = calendarMonth.toLocaleDateString("en-US", {
//     month: "long",
//     year: "numeric",
//   })

//   React.useEffect(() => {
//     if (!calendarOpen) {
//       return
//     }

//     const handlePointerDown = (event: PointerEvent) => {
//       const target = event.target as Node

//       if (
//         calendarRef.current?.contains(target) ||
//         calendarTriggerRef.current?.contains(target)
//       ) {
//         return
//       }

//       setCalendarOpen(false)
//     }

//     document.addEventListener("pointerdown", handlePointerDown)

//     return () => {
//       document.removeEventListener("pointerdown", handlePointerDown)
//     }
//   }, [calendarOpen])

//   function handleLogout() {
//     clearSession()
//     router.replace("/login")
//   }

//   function dispatchMessagesAction(action: "search" | "clear") {
//     window.dispatchEvent(new CustomEvent(`aloha-messages-${action}`))
//   }

//   return (
//     <header
//       data-slot="site-header"
//       className={cn(
//         "sticky top-0 z-30 flex min-h-16 shrink-0 items-center justify-between gap-3 border-b bg-background px-3 py-2 transition-[width] ease-linear sm:px-4 lg:px-6",
//         className
//       )}
//       {...props}
//     >
//       <div className="flex min-w-0 flex-1 items-center gap-2">
//         <SidebarTrigger className="-ml-1 shrink-0" />
//         <Separator
//           orientation="vertical"
//           className="mr-2 data-vertical:h-4 data-vertical:self-auto"
//         />
//         {(title || description) && (
//           <div className="min-w-0">
//             {title && (
//               <h1 className="truncate text-sm font-semibold leading-tight sm:text-base sm:leading-5">
//                 {title}
//               </h1>
//             )}
//             {description && (
//   <p className="mt-0.5 hidden max-w-full break-words text-[11px] leading-tight text-muted-foreground sm:block sm:text-xs sm:leading-5">
//     {description}
//   </p>
// )}
//           </div>
//         )}
//       </div>
//       <div className="flex shrink-0 items-center gap-2 pr-1 sm:gap-4 sm:pr-3">
//         {isMessagesPage ? (
//           <DropdownMenu>
//             <DropdownMenuTrigger asChild>
//               <button
//                 type="button"
//                 className="grid size-9 place-items-center rounded-md outline-none transition-colors hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring"
//                 aria-label="Open message options"
//               >
//                 <MoreVerticalIcon className="size-5" />
//               </button>
//             </DropdownMenuTrigger>
//             <DropdownMenuContent align="end" className="w-44">
//               {canSearchMessages && (
//                 <DropdownMenuItem
//                   className="px-3 py-2.5"
//                   onClick={() => dispatchMessagesAction("search")}
//                 >
//                   <SearchIcon />
//                   Search
//                 </DropdownMenuItem>
//               )}
//               {canClearChat && (
//                 <DropdownMenuItem
//                   variant="destructive"
//                   className="cursor-pointer px-3 py-2.5 focus:[&_svg]:text-destructive"
//                   onClick={() => dispatchMessagesAction("clear")}
//                 >
//                   <Trash2Icon />
//                   Clear Chat
//                 </DropdownMenuItem>
//               )}
//             </DropdownMenuContent>
//           </DropdownMenu>
//         ) : (
//           <>
//             <button
//               ref={calendarTriggerRef}
//               type="button"
//               className="hidden rounded-md text-left outline-none transition-colors hover:text-primary focus-visible:ring-2 focus-visible:ring-ring sm:block"
//               onClick={() => setCalendarOpen((open) => !open)}
//               aria-expanded={calendarOpen}
//             >
//               <HeaderInfoItem
//                 icon={CalendarDaysIcon}
//                 caption={t("deliveryDate")}
//                 label={formatDeliveryDate(deliveryDate)}
//                 contentClassName="pr-5"
//               >
//                 <ChevronDownIcon className="absolute right-0 top-1/2 size-3 -translate-y-1/2 text-muted-foreground" />
//               </HeaderInfoItem>
//             </button>
//             {calendarOpen && (
//               <div
//                 ref={calendarRef}
//                 className="absolute top-14 right-28 z-40 w-64 rounded-lg border bg-popover p-3 text-popover-foreground shadow-lg"
//               >
//                 <div className="mb-3 flex items-center justify-between">
//                   <button
//                     type="button"
//                     className="rounded-md px-2 py-1 text-sm text-muted-foreground hover:bg-muted"
//                     onClick={() =>
//                       setCalendarMonth(
//                         new Date(
//                           calendarMonth.getFullYear(),
//                           calendarMonth.getMonth() - 1,
//                           1
//                         )
//                       )
//                     }
//                   >
//                     {t("prev")}
//                   </button>
//                   <p className="text-sm font-semibold">{calendarTitle}</p>
//                   <button
//                     type="button"
//                     className="rounded-md px-2 py-1 text-sm text-muted-foreground hover:bg-muted"
//                     onClick={() =>
//                       setCalendarMonth(
//                         new Date(
//                           calendarMonth.getFullYear(),
//                           calendarMonth.getMonth() + 1,
//                           1
//                         )
//                       )
//                     }
//                   >
//                     {t("next")}
//                   </button>
//                 </div>
//                 <div className="grid grid-cols-7 gap-1 text-center text-[11px] font-medium text-muted-foreground">
//                   {["S", "M", "T", "W", "T", "F", "S"].map((day, index) => (
//                     <span key={`${day}-${index}`}>{day}</span>
//                   ))}
//                 </div>
//                 <div className="mt-1 grid grid-cols-7 gap-1">
//                   {calendarDays.map((date, index) => {
//                     const disabled = date ? startOfDay(date) < today : true
//                     const selected = date ? isSameDay(date, deliveryDate) : false

//                     return date ? (
//                       <button
//                         key={date.toISOString()}
//                         type="button"
//                         disabled={disabled}
//                         className={cn(
//                           "flex size-8 items-center justify-center rounded-md text-sm font-medium transition-colors",
//                           selected && "bg-primary text-primary-foreground",
//                           !selected && !disabled && "hover:bg-muted",
//                           disabled && "cursor-not-allowed text-muted-foreground/35"
//                         )}
//                         onClick={() => {
//                           setDeliveryDate(date)
//                           setCalendarOpen(false)
//                         }}
//                       >
//                         {date.getDate()}
//                       </button>
//                     ) : (
//                       <span key={`empty-${index}`} />
//                     )
//                   })}
//                 </div>
//               </div>
//             )}
//             <Separator orientation="vertical" className="hidden h-8 sm:block" />
//             <HeaderInfoItem
//               icon={Clock3Icon}
//               caption={t("cutoffTime")}
//               label={`${CUTOFF_TIME} ${CUTOFF_DATE}`}
//               className="hidden sm:block"
//             />
//             <Separator orientation="vertical" className="hidden h-8 sm:block" />
//           </>
//         )}
//         <DropdownMenu>
//           <DropdownMenuTrigger asChild>
//             <button
//               type="button"
//               className="rounded-full outline-none transition-opacity hover:opacity-80 focus-visible:ring-2 focus-visible:ring-ring sm:hidden"
//               aria-label={t("openProfileMenu")}
//             >
//               <Avatar className="size-8">
//                 <AvatarImage src={profile.avatar} alt={profileName} />
//                 <AvatarFallback className="text-xs font-semibold">
//                   {profileInitials}
//                 </AvatarFallback>
//               </Avatar>
//             </button>
//           </DropdownMenuTrigger>
//           <DropdownMenuContent align="end" className="w-56">
//             <DropdownMenuLabel className="p-0 font-normal">
//               <div className="flex items-center gap-3 px-3 py-2 text-left text-sm">
//                 <Avatar className="size-9">
//                   <AvatarImage src={profile.avatar} alt={profileName} />
//                   <AvatarFallback className="text-xs font-semibold">
//                     {profileInitials}
//                   </AvatarFallback>
//                 </Avatar>
//                 <span className="truncate font-medium">{profileName}</span>
//               </div>
//             </DropdownMenuLabel>
//             <DropdownMenuSeparator />
//             <DropdownMenuGroup>
//               <DropdownMenuItem asChild className="px-3 py-2.5">
//                 <Link href={profileUrl}>
//                   <BadgeCheckIcon />
//                   {t("myProfile")}
//                 </Link>
//               </DropdownMenuItem>
//             </DropdownMenuGroup>
//             <DropdownMenuSeparator />
//             <DropdownMenuItem className="px-3 py-2.5" onClick={handleLogout}>
//               <LogOutIcon />
//               {t("logOut")}
//             </DropdownMenuItem>
//           </DropdownMenuContent>
//         </DropdownMenu>
//         <button
//           type="button"
//           className="relative flex size-9 items-center justify-center rounded-md text-left outline-none transition-colors hover:text-primary focus-visible:ring-2 focus-visible:ring-ring sm:size-auto sm:px-1"
//           onClick={() => setUploadOpen(true)}
//           aria-label="Upload Files"
//         >
//           <UploadCloudIcon className="size-5 text-primary sm:hidden" />
//           <HeaderInfoItem
//             icon={UploadCloudIcon}
//             caption="AI Quick Action"
//             label="Upload"
//             className="hidden sm:block"
//           />
//         </button>
//         <Separator orientation="vertical" className="hidden h-8 sm:block" />

//         {!isMessagesPage && (
//           <button
//             type="button"
//             className="relative flex size-9 items-center justify-center rounded-md text-left outline-none transition-colors hover:text-primary focus-visible:ring-2 focus-visible:ring-ring sm:size-auto sm:px-1"
//             onClick={() => setCartOpen(true)}
//             aria-label={t("openCart")}
//           >
//             <ShoppingCartIcon className="size-5 text-primary sm:hidden" />
//             <HeaderInfoItem
//               icon={ShoppingCartIcon}
//               caption={t("cart")}
//               label={formattedCartTotal}
//               className="hidden sm:block"
//             />
//             <span className="absolute -right-1 -top-1 grid size-4 place-items-center rounded-full bg-primary text-[10px] font-semibold leading-none text-primary-foreground sm:right-1">
//               {itemCount}
//             </span>
//           </button>
//         )}
//         {children}
//       </div>
//       <CartSidebar
//         open={cartOpen}
//         onOpenChange={setCartOpen}
//         itemCount={itemCount}
//         total={formattedCartTotal}
//         items={items}
//         isCheckingOut={isCheckingOut}
//         onIncrement={incrementItem}
//         onDecrement={decrementItem}
//         onRemove={removeItem}
//         onCheckout={handleCheckout}
//   deliveryDate={checkoutDeliveryDate}
//   onDeliveryDateChange={setCheckoutDeliveryDate}
//   poNumber={poNumber}
//   onPoNumberChange={setPoNumber}
//   promoCode={promoCode}
//   onPromoCodeChange={setPromoCode}
//   notes={notes}
//   onNotesChange={setNotes}
//       />
//       <GlobalUploadModal
//         open={uploadOpen}
//         onOpenChange={setUploadOpen}
//       />
//     </header>
//   )
// }

// export { SiteHeader }

//Changed BY Radhika 23/09/2026-- 4-30 PM


"use client"

import * as React from "react"
import { requireCustomerNumber } from "@/lib/customer"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useTranslations } from "next-intl"
import {
  BadgeCheckIcon,
  CalendarDaysIcon,
  ChevronDownIcon,
  Clock3Icon,
  LogOutIcon,
  MoreVerticalIcon,
  SearchIcon,
  ShoppingCartIcon,
  Trash2Icon,
  UploadCloudIcon,
} from "lucide-react"
import { toast } from "sonner"

import { cn } from "@/lib/utils"
import { clearSession } from "@/lib/auth"
import { useCart } from "@/app/context/app-context"
import { CartSidebar } from "@/components/cart-sidebar"
import { GlobalUploadModal } from "@/components/upload/GlobalUploadModal"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"

const CUTOFF_TIME = "8:00 AM"
const CUTOFF_DATE = "6/6"
const DEFAULT_PROFILE = {
  firstName: "Crate",
  lastName: "Inc",
  email: "hello@crateinc.com",
  avatar: "",
}

const HEADER_ROUTES = [
  ["/", "Overview", "View account activity, recent orders, and shortcuts"],
  ["/catalog/details", "Product Details", "Review product information, pricing, and availability"],
  ["/catalog", "Catalog", "Browse products, pricing, and availability", true],
  ["/order-guide", "Order Guide", "Build and manage frequently ordered product lists"],
  ["/my-orders", "My Orders", "Review current and previous orders"],
  ["/invoices/details", "Invoice Details", "Review invoice charges, payments, and balances"],
  ["/invoices", "Invoices", "Review invoice totals, payments, balances, and status", true],
  ["/metrics", "Metrics", "Review purchasing trends, order activity, and invoice balances"],
  ["/messages", "Messages", "Contact support and review conversations"],
  ["/employees", "Employees", "View and manage store employees"],
  ["/profile", "Profile", "Manage your account and contact information"],
] as const

function getHeader(pathname: string) {
  const normalizedPath =
    pathname.length > 1 ? pathname.replace(/\/+$/, "") : pathname
  const route = HEADER_ROUTES.find(([path, , , matchesChildren]) =>
    matchesChildren
      ? normalizedPath === path || normalizedPath.startsWith(`${path}/`)
      : normalizedPath === path
  )

  return {
    title: route?.[1] ?? "Bex SCM",
    description: route?.[2] ?? "",
  }
}

type HeaderProfile = typeof DEFAULT_PROFILE

function getFullName(profile: HeaderProfile) {
  return [profile.firstName, profile.lastName].filter(Boolean).join(" ")
}

function getInitials(profile: HeaderProfile) {
  return `${profile.firstName[0] ?? ""}${profile.lastName[0] ?? ""}`.toUpperCase()
}

const formatDeliveryDate = (date: Date) =>
  date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })

const startOfDay = (date: Date) =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate())

const isSameDay = (first: Date, second: Date) =>
  first.getFullYear() === second.getFullYear() &&
  first.getMonth() === second.getMonth() &&
  first.getDate() === second.getDate()

function HeaderInfoItem({
  icon: Icon,
  caption,
  label,
  className,
  contentClassName,
  children,
}: {
  icon: React.ComponentType<{ className?: string }>
  caption: string
  label: string
  className?: string
  contentClassName?: string
  children?: React.ReactNode
}) {
  return (
    <div className={cn("relative", className)}>
      <div className={cn("flex h-10 items-center gap-2 px-1 text-left", contentClassName)}>
        <Icon className="size-4 shrink-0 text-primary" />
        <div className="grid gap-0.5 leading-none">
          <span className="text-[10px] font-medium text-muted-foreground">
            {caption}
          </span>
          <span className="text-xs font-semibold text-foreground">{label}</span>
        </div>
      </div>
      {children}
    </div>
  )
}

interface UseCartReturn {
  items: Array<{ id: string; name: string; qtybsuom: number; quantity: number; itemNumber: string; unit: string; image?: string }>
  itemCount: number
  total: number | string
  isLoading: boolean
  incrementItem: (id: string) => void
  decrementItem: (id: string) => void
  removeItem: (id: string) => void
  clearCart: () => void
  // checkoutOrderApi: (custnmbr: string) => Promise<{ success?: boolean; message?: string; error?: string; orderNumber?: string; OrderNumber?: string; orderAmount?: number; OrderAmount?: number; total?: number }>
  fetchCustomerCart: (custnmbr?: string) => Promise<unknown>
}

function SiteHeader({
  className,
  initialProfile = null,
  children,
  ...props
}: React.PropsWithChildren<React.ComponentProps<"header"> & {
  initialProfile?: Partial<HeaderProfile> | null
}>) {
  const router = useRouter()
  const pathname = usePathname()
  const t = useTranslations("header")
  const { title, description } = getHeader(pathname)
  const isMessagesPage = pathname === "/messages"
  const canSearchMessages = true
  const canClearChat = true
  const profileUrl = "/profile"
  const profile: HeaderProfile = {
    ...DEFAULT_PROFILE,
    ...initialProfile,
  }
  const profileName = getFullName(profile)
  const profileInitials = getInitials(profile)
  const {
    items = [],
    itemCount = 0,
    total: cartTotal = 0,
    isLoading: cartLoading = false,
    incrementItem,
    decrementItem,
    removeItem,
    clearCart,
    // checkoutOrderApi,
    fetchCustomerCart,
  } = (useCart() as unknown) as UseCartReturn

  const formattedCartTotal =
    typeof cartTotal === "number"
      ? `$${cartTotal.toFixed(2)}`
      : String(cartTotal || "").startsWith("$")
      ? String(cartTotal)
      : `$${cartTotal || "0.00"}`

  const calendarRef = React.useRef<HTMLDivElement>(null)
  const calendarTriggerRef = React.useRef<HTMLButtonElement>(null)
  const [uploadOpen, setUploadOpen] = React.useState(false)
  const [cartOpen, setCartOpen] = React.useState(false)
  const [isCheckingOut, setIsCheckingOut] = React.useState(false)
  const [checkoutDeliveryDate, setCheckoutDeliveryDate] = React.useState("2026-09-21")
const [poNumber, setPoNumber] = React.useState("")
const [promoCode, setPromoCode] = React.useState("")
const [notes, setNotes] = React.useState("")

  React.useEffect(() => {
    if (cartOpen && typeof fetchCustomerCart === "function") {
      fetchCustomerCart()
    }
  }, [cartOpen, fetchCustomerCart])
  const today = React.useMemo(() => startOfDay(new Date()), [])
  const [calendarOpen, setCalendarOpen] = React.useState(false)
  const [deliveryDate, setDeliveryDate] = React.useState(
    () => new Date(2026, 5, 12)
  )
  const [calendarMonth, setCalendarMonth] = React.useState(
    () => new Date(2026, 5, 1)
  )


// async function checkoutOrderApi({ custNmbr, deliveryDate, cutOffTime, notes, discountCode, poNumber }) {
  async function checkoutOrderApi({
  custNmbr,
  deliveryDate,
  cutOffTime,
  notes,
  discountCode,
  poNumber,
}: {
  custNmbr: string
  deliveryDate: string
  cutOffTime: string
  notes: string
  discountCode: string
  poNumber: string
}) {
const url = `${process.env.NEXT_PUBLIC_NRL_API_URL}/checkout`

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
        Authorization: `${process.env.NEXT_PUBLIC_AUTH_TOKEN}`,
    },
    body: JSON.stringify({
      custNmbr,
      deliveryDate,
      cutOffTime,
      notes,
      discountCode,
      poNumber,
    }),
  })

  const text = await response.text()
  let result = null
  try {
    result = text ? JSON.parse(text) : null
  } catch {
    console.warn("Checkout response is not JSON:", text)
  }

  if (!response.ok) {
    throw new Error(result?.message || result?.error || `Checkout failed. HTTP ${response.status}`)
  }

  return result
}
async function handleCheckout() {
  if (items.length === 0 || isCheckingOut) return
  setIsCheckingOut(true)

  try {
    const res = await checkoutOrderApi({
      custNmbr: requireCustomerNumber(),
      deliveryDate: checkoutDeliveryDate,
      cutOffTime: "14:00:00",
      notes,
      discountCode: promoCode,
      poNumber,
    })

    if (!res || res.success === false) {
      throw new Error(res?.message || res?.error || "Order creation failed on backend server.")
    }

    const orderNum = res?.orderNumber ?? res?.OrderNumber ?? "CREATED"
    const amount = Number(res?.orderAmount ?? res?.OrderAmount ?? res?.total) || 0

    toast.success(
      amount > 0
        ? `Order #${orderNum} placed successfully! Total: $${amount.toFixed(2)}`
        : `Order #${orderNum} placed successfully!`
    )
    clearCart()
    setCartOpen(false)
    setPoNumber("")
    setPromoCode("")
    setNotes("")

    // Tell My Orders (and anything else listening) to refetch, the same
    // way its own Refresh button does — no full page reload needed.
    window.dispatchEvent(new CustomEvent("aloha-orders-refresh"))
  } catch (error) {
    console.error("Checkout request failed:", error)
    // const errorMsg = error?.message || "Checkout request failed. Please check API endpoint."
    const errorMsg = error instanceof Error ? error.message : "Checkout request failed. Please check API endpoint."
    toast.error(`Checkout Failed: ${errorMsg}`)
  } finally {
    setIsCheckingOut(false)
  }
}

  const calendarDays = React.useMemo(() => {
    const year = calendarMonth.getFullYear()
    const month = calendarMonth.getMonth()
    const firstDay = new Date(year, month, 1)
    const dayOffset = firstDay.getDay()
    const daysInMonth = new Date(year, month + 1, 0).getDate()

    return Array.from({ length: dayOffset + daysInMonth }, (_, index) => {
      if (index < dayOffset) {
        return null
      }

      return new Date(year, month, index - dayOffset + 1)
    })
  }, [calendarMonth])

  const calendarTitle = calendarMonth.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  })

  React.useEffect(() => {
    if (!calendarOpen) {
      return
    }

    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target as Node

      if (
        calendarRef.current?.contains(target) ||
        calendarTriggerRef.current?.contains(target)
      ) {
        return
      }

      setCalendarOpen(false)
    }

    document.addEventListener("pointerdown", handlePointerDown)

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown)
    }
  }, [calendarOpen])

  function handleLogout() {
    clearSession()
    router.replace("/login")
  }

  function dispatchMessagesAction(action: "search" | "clear") {
    window.dispatchEvent(new CustomEvent(`aloha-messages-${action}`))
  }

  return (
    <header
      data-slot="site-header"
      className={cn(
        "sticky top-0 z-30 flex min-h-16 shrink-0 items-center justify-between gap-3 border-b bg-background px-3 py-2 transition-[width] ease-linear sm:px-4 lg:px-6",
        className
      )}
      {...props}
    >
      <div className="flex min-w-0 flex-1 items-center gap-2">
        <SidebarTrigger className="-ml-1 shrink-0" />
        <Separator
          orientation="vertical"
          className="mr-2 data-vertical:h-4 data-vertical:self-auto"
        />
        {(title || description) && (
          <div className="min-w-0">
            {title && (
              <h1 className="truncate text-sm font-semibold leading-tight sm:text-base sm:leading-5">
                {title}
              </h1>
            )}
            {description && (
  <p className="mt-0.5 hidden max-w-full break-words text-[11px] leading-tight text-muted-foreground sm:block sm:text-xs sm:leading-5">
    {description}
  </p>
)}
          </div>
        )}
      </div>
      <div className="flex shrink-0 items-center gap-2 pr-1 sm:gap-4 sm:pr-3">
        {isMessagesPage ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                className="grid size-9 place-items-center rounded-md outline-none transition-colors hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring"
                aria-label="Open message options"
              >
                <MoreVerticalIcon className="size-5" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-44">
              {canSearchMessages && (
                <DropdownMenuItem
                  className="px-3 py-2.5"
                  onClick={() => dispatchMessagesAction("search")}
                >
                  <SearchIcon />
                  Search
                </DropdownMenuItem>
              )}
              {canClearChat && (
                <DropdownMenuItem
                  variant="destructive"
                  className="cursor-pointer px-3 py-2.5 focus:[&_svg]:text-destructive"
                  onClick={() => dispatchMessagesAction("clear")}
                >
                  <Trash2Icon />
                  Clear Chat
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <>
            <button
              ref={calendarTriggerRef}
              type="button"
              className="hidden rounded-md text-left outline-none transition-colors hover:text-primary focus-visible:ring-2 focus-visible:ring-ring sm:block"
              onClick={() => setCalendarOpen((open) => !open)}
              aria-expanded={calendarOpen}
            >
              <HeaderInfoItem
                icon={CalendarDaysIcon}
                caption={t("deliveryDate")}
                label={formatDeliveryDate(deliveryDate)}
                contentClassName="pr-5"
              >
                <ChevronDownIcon className="absolute right-0 top-1/2 size-3 -translate-y-1/2 text-muted-foreground" />
              </HeaderInfoItem>
            </button>
            {calendarOpen && (
              <div
                ref={calendarRef}
                className="absolute top-14 right-28 z-40 w-64 rounded-lg border bg-popover p-3 text-popover-foreground shadow-lg"
              >
                <div className="mb-3 flex items-center justify-between">
                  <button
                    type="button"
                    className="rounded-md px-2 py-1 text-sm text-muted-foreground hover:bg-muted"
                    onClick={() =>
                      setCalendarMonth(
                        new Date(
                          calendarMonth.getFullYear(),
                          calendarMonth.getMonth() - 1,
                          1
                        )
                      )
                    }
                  >
                    {t("prev")}
                  </button>
                  <p className="text-sm font-semibold">{calendarTitle}</p>
                  <button
                    type="button"
                    className="rounded-md px-2 py-1 text-sm text-muted-foreground hover:bg-muted"
                    onClick={() =>
                      setCalendarMonth(
                        new Date(
                          calendarMonth.getFullYear(),
                          calendarMonth.getMonth() + 1,
                          1
                        )
                      )
                    }
                  >
                    {t("next")}
                  </button>
                </div>
                <div className="grid grid-cols-7 gap-1 text-center text-[11px] font-medium text-muted-foreground">
                  {["S", "M", "T", "W", "T", "F", "S"].map((day, index) => (
                    <span key={`${day}-${index}`}>{day}</span>
                  ))}
                </div>
                <div className="mt-1 grid grid-cols-7 gap-1">
                  {calendarDays.map((date, index) => {
                    const disabled = date ? startOfDay(date) < today : true
                    const selected = date ? isSameDay(date, deliveryDate) : false

                    return date ? (
                      <button
                        key={date.toISOString()}
                        type="button"
                        disabled={disabled}
                        className={cn(
                          "flex size-8 items-center justify-center rounded-md text-sm font-medium transition-colors",
                          selected && "bg-primary text-primary-foreground",
                          !selected && !disabled && "hover:bg-muted",
                          disabled && "cursor-not-allowed text-muted-foreground/35"
                        )}
                        onClick={() => {
                          setDeliveryDate(date)
                          setCalendarOpen(false)
                        }}
                      >
                        {date.getDate()}
                      </button>
                    ) : (
                      <span key={`empty-${index}`} />
                    )
                  })}
                </div>
              </div>
            )}
            <Separator orientation="vertical" className="hidden h-8 sm:block" />
            <HeaderInfoItem
              icon={Clock3Icon}
              caption={t("cutoffTime")}
              label={`${CUTOFF_TIME} ${CUTOFF_DATE}`}
              className="hidden sm:block"
            />
            <Separator orientation="vertical" className="hidden h-8 sm:block" />
          </>
        )}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className="rounded-full outline-none transition-opacity hover:opacity-80 focus-visible:ring-2 focus-visible:ring-ring sm:hidden"
              aria-label={t("openProfileMenu")}
            >
              <Avatar className="size-8">
                <AvatarImage src={profile.avatar} alt={profileName} />
                <AvatarFallback className="text-xs font-semibold">
                  {profileInitials}
                </AvatarFallback>
              </Avatar>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-3 px-3 py-2 text-left text-sm">
                <Avatar className="size-9">
                  <AvatarImage src={profile.avatar} alt={profileName} />
                  <AvatarFallback className="text-xs font-semibold">
                    {profileInitials}
                  </AvatarFallback>
                </Avatar>
                <span className="truncate font-medium">{profileName}</span>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem asChild className="px-3 py-2.5">
                <Link href={profileUrl}>
                  <BadgeCheckIcon />
                  {t("myProfile")}
                </Link>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="px-3 py-2.5" onClick={handleLogout}>
              <LogOutIcon />
              {t("logOut")}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <button
          type="button"
          className="relative flex size-9 items-center justify-center rounded-md text-left outline-none transition-colors hover:text-primary focus-visible:ring-2 focus-visible:ring-ring sm:size-auto sm:px-1"
          onClick={() => setUploadOpen(true)}
          aria-label="Upload Files"
        >
          <UploadCloudIcon className="size-5 text-primary sm:hidden" />
          <HeaderInfoItem
            icon={UploadCloudIcon}
            caption="AI Quick Action"
            label="Upload"
            className="hidden sm:block"
          />
        </button>
        <Separator orientation="vertical" className="hidden h-8 sm:block" />

        {!isMessagesPage && (
          <button
            type="button"
            className="relative flex size-9 items-center justify-center rounded-md text-left outline-none transition-colors hover:text-primary focus-visible:ring-2 focus-visible:ring-ring sm:size-auto sm:px-1"
            onClick={() => setCartOpen(true)}
            aria-label={t("openCart")}
          >
            <ShoppingCartIcon className="size-5 text-primary sm:hidden" />
            <HeaderInfoItem
              icon={ShoppingCartIcon}
              caption={t("cart")}
              label={formattedCartTotal}
              className="hidden sm:block"
            />
            <span className="absolute -right-1 -top-1 grid size-4 place-items-center rounded-full bg-primary text-[10px] font-semibold leading-none text-primary-foreground sm:right-1">
              {itemCount}
            </span>
          </button>
        )}
        {children}
      </div>
      <CartSidebar
        open={cartOpen}
        onOpenChange={setCartOpen}
        itemCount={itemCount}
        total={formattedCartTotal}
        items={items}
        isLoading={cartLoading}
        isCheckingOut={isCheckingOut}
        onIncrement={incrementItem}
        onDecrement={decrementItem}
        onRemove={removeItem}
        onCheckout={handleCheckout}
  deliveryDate={checkoutDeliveryDate}
  onDeliveryDateChange={setCheckoutDeliveryDate}
  poNumber={poNumber}
  onPoNumberChange={setPoNumber}
  promoCode={promoCode}
  onPromoCodeChange={setPromoCode}
  notes={notes}
  onNotesChange={setNotes}
      />
      <GlobalUploadModal
        open={uploadOpen}
        onOpenChange={setUploadOpen}
      />
    </header>
  )
}

export { SiteHeader }
