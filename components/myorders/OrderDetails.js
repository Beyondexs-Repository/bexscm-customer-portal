"use client"

import {
	CalendarClock,
	ChevronLeft,
	CircleDollarSign,
	Download,
	PackageCheck,
	X,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

import { formatCurrency, statusStyles } from "./MyOrders"

export default function OrderDetails({ order, onBack, onClose }) {
	const totalItems = order.items.reduce((sum, item) => sum + item.quantity, 0)

	return (
		<section className="flex h-full min-h-0 flex-col rounded-lg border bg-card shadow-sm">
			<div className="flex items-start justify-between gap-3 border-b p-3 sm:p-4">
				<div className="min-w-0">
					<div className="flex min-w-0 items-center gap-2">
						<p className="min-w-0 truncate text-xs font-bold text-muted-foreground">
							Order #{order.orderNumber}
						</p>

						<Badge
							className={cn(
								"h-auto shrink-0 px-2 py-0.5 text-[10px] leading-none ring-1",
								statusStyles[order.statusTone]
							)}
						>
							{order.status}
						</Badge>
					</div>

					<h2 className="mt-3 text-lg font-bold leading-tight sm:text-xl">
						Delivery on {order.deliveryDate}
					</h2>
				</div>

				<Button
					variant="outline"
					size="sm"
					className="shrink-0 xl:hidden"
					aria-label="Back to orders"
					onClick={onBack}
				>
					<ChevronLeft className="size-4" />
					Back
				</Button>

				<Button
					variant="ghost"
					size="icon-sm"
					className="hidden xl:inline-flex"
					aria-label="Close details"
					onClick={onClose}
				>
					<X />
				</Button>
			</div>

			<div className="no-scrollbar min-h-0 flex-1 overflow-y-auto p-3 pb-24 sm:p-4 xl:pb-4">
				<div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
					<div className="rounded-lg bg-emerald-50 p-3 text-foreground dark:bg-emerald-800/5 dark:ring-1 dark:ring-emerald-900/80">
						<CalendarClock className="mb-2 size-4 text-emerald-600" />
						<p className="text-[11px] text-muted-foreground dark:text-emerald-100/70">
							Placed On
						</p>
						<p className="break-words text-xs font-bold leading-snug">
							{order.placedOn}
							<br />
							{order.placedAt}
						</p>
					</div>

					<div className="rounded-lg bg-emerald-50 p-3 text-foreground dark:bg-emerald-800/5 dark:ring-1 dark:ring-emerald-900/80">
						<PackageCheck className="mb-2 size-4 text-emerald-600" />
						<p className="text-[11px] text-muted-foreground dark:text-emerald-100/70">
							Order Type
						</p>
						<p className="break-words text-xs font-bold leading-snug">{order.type}</p>
					</div>

					<div className="rounded-lg bg-emerald-50 p-3 text-foreground dark:bg-emerald-800/5 dark:ring-1 dark:ring-emerald-900/80">
						<CircleDollarSign className="mb-2 size-4 text-emerald-600" />
						<p className="text-[11px] text-muted-foreground dark:text-emerald-100/70">
							Order Total
						</p>
						<p className="truncate text-lg font-bold leading-tight">
							{formatCurrency(order.total)}
						</p>
					</div>
				</div>

				<h3 className="mt-5 text-sm font-bold">Order Items</h3>

				<div className="mt-3 divide-y rounded-lg border">
					{order.items.map((item) => (
						<div key={item.id} className="flex gap-3 p-3">
							<div
								role="img"
								aria-label={item.name}
								className="size-14 shrink-0 rounded-md bg-cover bg-center"
								style={{ backgroundImage: `url(${item.image})` }}
							/>

							<div className="min-w-0 flex-1">
								<p className="truncate text-sm font-bold">{item.name}</p>
								<p className="truncate text-xs text-muted-foreground">
									Brand: {item.brand}
								</p>
								<p className="truncate text-xs text-muted-foreground">
									Pack Size: {item.packSize}
								</p>
								<p className="truncate text-xs text-muted-foreground">
									SKU: {item.sku}
								</p>
							</div>

							<div className="max-w-20 shrink-0 text-right sm:max-w-none">
								<p className="text-xs font-bold leading-snug">{item.quantity} units</p>
								<p className="mt-1 text-xs leading-snug">
									{formatCurrency(item.price)}
								</p>
							</div>
						</div>
					))}
				</div>

				<div className="mt-4 space-y-2 text-sm">
					<div className="flex justify-between gap-3">
						<span className="font-semibold">Total Units</span>
						<span className="font-bold">{totalItems}</span>
					</div>

					<div className="flex justify-between gap-3">
						<span className="font-semibold">Order Total</span>
						<span className="font-bold">{formatCurrency(order.total)}</span>
					</div>
				</div>
			</div>

			{order.status !== "Order Sent" && (
				<div className="border-t p-3 sm:p-4">
					<Button variant="outline" className="h-11 w-full text-primary">
						<Download className="size-4" />
						Download Invoice (PDF)
					</Button>
				</div>
			)}
		</section>
	)
}
