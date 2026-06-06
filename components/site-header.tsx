"use client"

import * as React from "react"
import {
  CalendarDaysIcon,
  ChevronDownIcon,
  Clock3Icon,
  SearchIcon,
  ShoppingCartIcon,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { CartSidebar } from "@/components/cart-sidebar"
import { useCart } from "@/app/context/app-context"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { usePathname } from "next/navigation"

const CUTOFF_TIME = "8:00 AM"
const CUTOFF_DATE = "6/6"

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

function SiteHeader({
  className,
  title,
  description,
  children,
  ...props
}: React.ComponentProps<"header"> & {
  title?: React.ReactNode
  description?: React.ReactNode
}) {
  const {
    items,
    itemCount,
    total,
    incrementItem,
    decrementItem,
    removeItem,
  } = useCart() as {
    items: {
      id: string
      name: string
      price: number
      quantity: number
      sku: string
      unit: string
    }[]
    itemCount: number
    total: number
    incrementItem: (id: string) => void
    decrementItem: (id: string) => void
    removeItem: (id: string) => void
  }
  const cartTotal = `$${total.toFixed(2)}`
  const today = startOfDay(new Date())
  const calendarRef = React.useRef<HTMLDivElement>(null)
  const calendarTriggerRef = React.useRef<HTMLButtonElement>(null)
  const [cartOpen, setCartOpen] = React.useState(false)
  const [calendarOpen, setCalendarOpen] = React.useState(false)
  const [deliveryDate, setDeliveryDate] = React.useState(
    () => new Date(2026, 5, 12)
  )
  const [calendarMonth, setCalendarMonth] = React.useState(
    () => new Date(2026, 5, 1)
  )

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

  const pathname = usePathname()

  const isCatalogPage = pathname === "/catalog"

  return (
    <header
      data-slot="site-header"
      className={cn(
        "sticky top-0 z-30 flex h-16 shrink-0 items-center justify-between gap-3 border-b bg-background px-3 transition-[width] ease-linear sm:px-4 lg:px-6",
        className
      )}
      {...props}
    >
      <div className="flex min-w-0 flex-1 items-center gap-2">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mr-2 data-vertical:h-4 data-vertical:self-auto"
        />
        {(title || description) && (
          <div className="min-w-0 shrink-0">
            {title && (
              <h1 className="truncate text-base font-semibold leading-5">
                {title}
              </h1>
            )}
            {description && (
              <p className="truncate text-xs leading-5 text-muted-foreground">
                {description}
              </p>
            )}
          </div>
        )}
      </div>
      {isCatalogPage && (
      <div className="absolute left-1/2 top-1/2 hidden w-[min(36vw,28rem)] -translate-x-1/2 -translate-y-1/2 md:block">
        <SearchIcon className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search Products ..."
          className="h-9 rounded-md pl-9"
        />
      </div>
      )}
      <div className="flex shrink-0 items-center gap-4 pr-3">
        <button
          ref={calendarTriggerRef}
          type="button"
          className="hidden rounded-md text-left outline-none transition-colors hover:text-primary focus-visible:ring-2 focus-visible:ring-ring sm:block"
          onClick={() => setCalendarOpen((open) => !open)}
          aria-expanded={calendarOpen}
        >
          <HeaderInfoItem
            icon={CalendarDaysIcon}
            caption="Delivery Date"
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
                Prev
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
                Next
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
          caption="Cutoff Time"
          label={`${CUTOFF_TIME} ${CUTOFF_DATE}`}
          className="hidden sm:block"
        />
        <Separator orientation="vertical" className="hidden h-8 sm:block" />
        <button
          type="button"
          className="relative rounded-md px-1 text-left outline-none transition-colors hover:text-primary focus-visible:ring-2 focus-visible:ring-ring"
          onClick={() => setCartOpen(true)}
          aria-label="Open cart"
        >
          <HeaderInfoItem
            icon={ShoppingCartIcon}
            caption="Cart"
            label={cartTotal}
          />
          <span className="absolute right-1 -top-1 flex size-4 items-center justify-center rounded-full bg-primary text-[10px] font-semibold leading-none text-primary-foreground">
            {itemCount}
          </span>
        </button>
        {children}
      </div>
      <CartSidebar
        open={cartOpen}
        onOpenChange={setCartOpen}
        itemCount={itemCount}
        total={cartTotal}
        items={items}
        onIncrement={incrementItem}
        onDecrement={decrementItem}
        onRemove={removeItem}
      />
    </header>
  )
}

export { SiteHeader }
