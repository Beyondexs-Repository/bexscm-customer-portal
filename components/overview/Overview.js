// 'use client'

// import Link from "next/link"
// import {
//   BookOpen,
//   ClipboardList,
//   MessageSquareText,
//   ShoppingBag,
// } from "lucide-react"
// import { useTranslations } from "next-intl"
// import QuickOrderGuide from "./QuickOrderGuide"
// import WelcomeCard from "./WelcomeCard"
// import RecentInvoicesTable from "../overview/Recentinvoicestable"
// import RecommendedItems from "./RecommendedItems"
// import { cn } from "@/lib/utils"
// import { useEffect, useState } from "react"
// import { useDispatch, useSelector } from "react-redux"
// import { GetOverviewlist } from "../../redux/slices/getSlice" 

// const quickActions = [
//   {
//     key: "orderGuide",
//     href: "/order-guide",
//     icon: BookOpen,
//     iconClassName:
//       "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-300",
//   },
//   {
//     key: "catalog",
//     href: "/catalog",
//     icon: ShoppingBag,
//     iconClassName:
//       "bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-300",
//   },
//   {
//     key: "recentOrders",
//     href: "/my-orders",
//     icon: ClipboardList,
//     iconClassName:
//       "bg-violet-50 text-violet-600 dark:bg-violet-950/50 dark:text-violet-300",
//   },
//   {
//     key: "messages",
//     href: "/messages",
//     icon: MessageSquareText,
//     iconClassName:
//       "bg-cyan-50 text-cyan-600 dark:bg-cyan-950/50 dark:text-cyan-300",
//   },
// ]

// function QuickActions() {
//   const t = useTranslations("quickActions")

//   return (
//     <section aria-label={t("ariaLabel")} className="@container min-w-0">
//       <div className="grid grid-cols-1 gap-2 @min-[22rem]:grid-cols-2 @min-[64rem]:grid-cols-4">
//         {quickActions.map((action) => {
//           const Icon = action.icon

//           return (
//             <Link
//               key={action.key}
//               href={action.href}
//               className="group flex min-w-0 items-center gap-2 rounded-xl border bg-card p-2.5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md sm:gap-3 sm:p-3"
//             >
//               <div
//                 className={cn(
//                   "flex size-9 shrink-0 items-center justify-center rounded-full sm:size-10",
//                   action.iconClassName,
//                 )}
//               >
//                 <Icon className="size-4 sm:size-5" />
//               </div>
//               <div className="min-w-0">
//                 <p className="break-words text-xs font-semibold sm:text-sm">
//                   {t(`${action.key}.title`)}
//                 </p>
//                 <p className="mt-0.5 line-clamp-2 text-[11px] leading-snug text-muted-foreground">
//                   {t(`${action.key}.description`)}
//                 </p>
//               </div>
//             </Link>
//           )
//         })}
//       </div>
//     </section>
//   )
// }

// export default function Overview() {
//  const dispatch = useDispatch()
//   const overviewStatus = useSelector((state) => state.getSlice.overviewStatus)
//   const [role, setRole] = useState(null)

// useEffect(() => {
//   setRole(localStorage.getItem("roles"))
// }, [])


//   useEffect(() => {
//     if (overviewStatus === "idle") dispatch(GetOverviewlist())
//   }, [overviewStatus, dispatch])

//   return (
//     <main className="grid gap-3 sm:gap-4">
//       <WelcomeCard />
//       <QuickActions />
//       <RecommendedItems />
//       <div className="grid items-stretch gap-3 sm:gap-4 lg:grid-cols-3">
//         <div className="order-1 h-full min-h-0 min-w-0 lg:order-2 lg:col-span-1">
//           <QuickOrderGuide />
//         </div>
//         <div className="order-2 h-full min-h-0 min-w-0 lg:order-1 lg:col-span-2">
//           <RecentInvoicesTable />
//         </div>
//       </div>
//     </main>
//   )
// }
//// changed 19-nov-2026-04 16 PM

// "use client"

// import Link from "next/link"
// import { useEffect } from "react"
// import { useDispatch, useSelector } from "react-redux"
// import {
//   BookOpen,
//   ClipboardList,
//   MessageSquareText,
//   ShoppingBag,
// } from "lucide-react"
// import { useTranslations } from "next-intl"
// import QuickOrderGuide from "./QuickOrderGuide"
// import WelcomeCard from "./WelcomeCard"
// import RecentInvoicesTable from "../overview/Recentinvoicestable"
// import RecommendedItems from "./RecommendedItems"
// import { cn } from "@/lib/utils"
// import { GetOverviewlist } from "../../redux/slices/getSlice"

// const quickActions = [
//   {
//     key: "orderGuide",
//     href: "/order-guide",
//     icon: BookOpen,
//     iconClassName:
//       "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-300",
//   },
//   {
//     key: "catalog",
//     href: "/catalog",
//     icon: ShoppingBag,
//     iconClassName:
//       "bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-300",
//   },
//   {
//     key: "recentOrders",
//     href: "/my-orders",
//     icon: ClipboardList,
//     iconClassName:
//       "bg-violet-50 text-violet-600 dark:bg-violet-950/50 dark:text-violet-300",
//   },
//   {
//     key: "messages",
//     href: "/messages",
//     icon: MessageSquareText,
//     iconClassName:
//       "bg-cyan-50 text-cyan-600 dark:bg-cyan-950/50 dark:text-cyan-300",
//   },
// ]

// function QuickActions() {
//   const t = useTranslations("quickActions")

//   return (
//     <section aria-label={t("ariaLabel")} className="@container min-w-0">
//       <div className="grid grid-cols-1 gap-2 @min-[22rem]:grid-cols-2 @min-[64rem]:grid-cols-4">
//         {quickActions.map((action) => {
//           const Icon = action.icon

//           return (
//             <Link
//               key={action.key}
//               href={action.href}
//               className="group flex min-w-0 items-center gap-2 rounded-xl border bg-card p-2.5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md sm:gap-3 sm:p-3"
//             >
//               <div
//                 className={cn(
//                   "flex size-9 shrink-0 items-center justify-center rounded-full sm:size-10",
//                   action.iconClassName,
//                 )}
//               >
//                 <Icon className="size-4 sm:size-5" />
//               </div>
//               <div className="min-w-0">
//                 <p className="break-words text-xs font-semibold sm:text-sm">
//                   {t(`${action.key}.title`)}
//                 </p>
//                 <p className="mt-0.5 line-clamp-2 text-[11px] leading-snug text-muted-foreground">
//                   {t(`${action.key}.description`)}
//                 </p>
//               </div>
//             </Link>
//           )
//         })}
//       </div>
//     </section>
//   )
// }

// export default function Overview() {
//   const dispatch = useDispatch()
//   const overviewStatus = useSelector((state) => state.getSlice.overviewStatus)
// console.log("overviewStatus:", overviewStatus)
//   // One call feeds WelcomeCard (promotions) and RecommendedItems
//   useEffect(() => {
//     if (overviewStatus === "idle"){
// dispatch(GetOverviewlist())
//     } 
//   }, [overviewStatus, dispatch])

//   return (
//     <main className="grid gap-3 sm:gap-4">
//       <WelcomeCard />
//       <QuickActions />
//       <RecommendedItems />
//       <div className="grid items-stretch gap-3 sm:gap-4 lg:grid-cols-3">
//         <div className="order-1 h-full min-h-0 min-w-0 lg:order-2 lg:col-span-1">
//           <QuickOrderGuide />
//         </div>
//         <div className="order-2 h-full min-h-0 min-w-0 lg:order-1 lg:col-span-2">
//           <RecentInvoicesTable />
//         </div>
//       </div>
//     </main>
//   )
// }

"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { useDispatch } from "react-redux"
import {
  BookOpen,
  ClipboardList,
  MessageSquareText,
  ShoppingBag,
  ReceiptTextIcon,
} from "lucide-react"
import { useTranslations } from "next-intl"
import QuickOrderGuide from "./QuickOrderGuide"
import WelcomeCard from "./WelcomeCard"
import RecentInvoicesTable from "../overview/Recentinvoicestable"
import RecommendedItems from "./RecommendedItems"
import OverviewSkeleton from "./OverviewSkeleton"
import { cn } from "@/lib/utils"
import { can } from "@/lib/permissions"
import { GetOverviewlist } from "../../redux/slices/getSlice"

const quickActions = [
  {
    key: "orderGuide",
    href: "/order-guide",
    icon: BookOpen,
    iconClassName:
      "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-300",
  },
  {
    key: "catalog",
    href: "/catalog",
    icon: ShoppingBag,
    iconClassName:
      "bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-300",
  },
  {
    key: "recentOrders",
    href: "/my-orders",
    icon: ClipboardList,
    iconClassName:
      "bg-violet-50 text-violet-600 dark:bg-violet-950/50 dark:text-violet-300",
  },
  {
    key: "messages",
    href: "/invoices",
    icon: ReceiptTextIcon,
    iconClassName:
      "bg-cyan-50 text-cyan-600 dark:bg-cyan-950/50 dark:text-cyan-300",
  },
]

function QuickActions() {
  const t = useTranslations("quickActions")

  return (
    <section aria-label={t("ariaLabel")} className="@container min-w-0">
      <div className="grid grid-cols-2 gap-2 @min-[64rem]:grid-cols-4">
        {quickActions.map((action) => {
          const Icon = action.icon

          return (
            <Link
              key={action.key}
              href={action.href}
              className="group flex min-w-0 items-center gap-2 rounded-xl border bg-card p-2.5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md sm:gap-3 sm:p-3"
            >
              <div
                className={cn(
                  "flex size-9 shrink-0 items-center justify-center rounded-full sm:size-10",
                  action.iconClassName,
                )}
              >
                <Icon className="size-4 sm:size-5" />
              </div>
              <div className="min-w-0">
                <p className="break-words text-xs font-semibold sm:text-sm">
                  {t(`${action.key}.title`)}
                </p>
                <p className="mt-0.5 hidden line-clamp-2 text-[11px] leading-snug text-muted-foreground sm:block">
                  {t(`${action.key}.description`)}
                </p>
              </div>
            </Link>
          )
        })}
      </div>
    </section>
  )
}

export default function Overview() {
  const dispatch = useDispatch()

  // Read the role on the client only, so the skeleton matches what will really render
  const [role, setRole] = useState(null)
  useEffect(() => {
    setRole(localStorage.getItem("roles"))
  }, [])
  const showInvoices = role === null || can(role, "dashboard.recentInvoices")

  // false on every mount -> skeleton shows until fresh data arrives
  const [overviewReady, setOverviewReady] = useState(false)

  // One call feeds WelcomeCard (promotions) and RecommendedItems.
  // Fetched on every visit, not only when the status is "idle".
  useEffect(() => {
    let cancelled = false
    setOverviewReady(false)

    // a dispatched thunk resolves for success AND failure, so .finally always runs
    dispatch(GetOverviewlist()).finally(() => {
      if (!cancelled) setOverviewReady(true)
    })

    return () => {
      cancelled = true // ignore the result if the screen was left
    }
  }, [dispatch])

  // Don't use overviewStatus here: on a revisit it is still "succeeded" from the
  // last visit, so one frame of old data would show before it flips to "loading".
  // A failed call still sets ready, so the real page shows each card's error text.
  const showSkeleton = !overviewReady

  return (
    <>
      {showSkeleton && <OverviewSkeleton showInvoices={showInvoices} />}

      {/* Always mounted (but hidden while loading) so the invoices and order guide
          start their own API calls right away instead of waiting for the overview call */}
      <main
        aria-hidden={showSkeleton}
        className={cn("gap-3 sm:gap-4", showSkeleton ? "hidden" : "grid")}
      >
        <WelcomeCard />
        <QuickActions />
        <RecommendedItems />
        <div className="grid items-stretch gap-3 sm:gap-4 lg:grid-cols-3">
          <div className="order-1 h-full min-h-0 min-w-0 lg:order-2 lg:col-span-1">
            <QuickOrderGuide />
          </div>
          <div className="order-2 h-full min-h-0 min-w-0 lg:order-1 lg:col-span-2">
            <RecentInvoicesTable />
          </div>
        </div>
      </main>
    </>
  )
}
