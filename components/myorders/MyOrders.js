"use client"

import { useMemo, useState } from "react"
import {
	CalendarClock,
	ChevronDown,
	ChevronLeft,
	ChevronRight,
	CircleDollarSign,
	Download,
	Filter,
	PackageCheck,
	Truck,
	X,
} from "lucide-react"

import { myOrders } from "@/data/my-orders"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

const statusFilters = ["All Orders", "Upcoming", "Past"]
const typeFilters = ["App/Web", "Other"]

const statusStyles = {
	green:
		"bg-emerald-50 text-emerald-700 ring-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-200 dark:ring-emerald-800",
	orange:
		"bg-amber-50 text-amber-700 ring-amber-200 dark:bg-amber-950/40 dark:text-amber-200 dark:ring-amber-800",
	violet:
		"bg-violet-50 text-violet-700 ring-violet-200 dark:bg-violet-950/40 dark:text-violet-200 dark:ring-violet-800",
	blue: "bg-sky-50 text-sky-700 ring-sky-200 dark:bg-sky-950/40 dark:text-sky-200 dark:ring-sky-800",
	slate:
		"bg-slate-100 text-slate-600 ring-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:ring-slate-700",
}

function formatCurrency(value) {
	return new Intl.NumberFormat("en-US", {
		style: "currency",
		currency: "USD",
	}).format(value)
}

function getOrderBucket(order) {
	if (order.status === "Order Sent") return "Upcoming"
	return "Past"
}

function StatCard({ icon: Icon, value, label, note, tone }) {
	return (
		<div className="rounded-lg border bg-card p-4 shadow-sm">
			<div className="flex items-center gap-3">
				<div
					className={cn(
						"flex size-10 items-center justify-center rounded-full",
						tone
					)}
				>
					<Icon className="size-5" />
				</div>
				<div className="min-w-0">
					<p className="text-xl font-bold leading-none">{value}</p>
					<p className="mt-1 truncate text-xs font-semibold">{label}</p>
					<p className="truncate text-[11px] text-muted-foreground">{note}</p>
				</div>
			</div>
		</div>
	)
}

function OrderRow({ order, selected, onSelect }) {
	return (
		<button
	type="button"
	onClick={() => onSelect(order.id)}
	className={cn(
		"grid w-full grid-cols-[2fr_1.2fr_1fr_1fr_auto] items-center gap-6 rounded-lg border bg-card p-4 text-left shadow-sm transition-colors hover:bg-muted/50",
		selected && "border-primary"
	)}
>
	{/* Order Info */}
	<div className="min-w-0">
		<div className="flex items-center gap-2">
			<p className="truncate text-xs font-bold">
				Order #{order.orderNumber}
			</p>

			<Badge
				className={cn(
					"h-5 px-2 text-[10px] ring-1",
					statusStyles[order.statusTone]
				)}
			>
				{order.status}
			</Badge>
		</div>

		<p className="mt-1 truncate text-[11px] text-muted-foreground">
			Placed on {order.placedOn} at {order.placedAt}
		</p>
	</div>

	{/* Delivery Date */}
	<div className="min-w-0">
		<p className="text-[11px] text-muted-foreground">
			Delivery Date
		</p>

		<p className="truncate text-xs font-bold">
			{order.deliveryDate}
		</p>
	</div>

	{/* Type */}
	<div className="min-w-0">
		<p className="text-[11px] text-muted-foreground">
			Type
		</p>

		<p className="truncate text-xs font-bold">
			{order.type}
		</p>
	</div>

	{/* Total */}
	<div className="pr-2 text-right">
		<p className="text-[11px] text-muted-foreground">
			Total
		</p>

		<p className="whitespace-nowrap text-xs font-bold">
			{formatCurrency(order.total)}
		</p>
	</div>

	{/* Arrow */}
	<ChevronRight className="size-4 text-muted-foreground" />
</button>
	)
}

function OrderDetail({ order, onBack, onClose }) {
	const totalItems = order.items.reduce((sum, item) => sum + item.quantity, 0)

	return (
		<section className="flex h-full min-h-0 flex-col rounded-lg border bg-card shadow-sm">
			<div className="flex items-start justify-between gap-3 border-b p-4">
				<div className="min-w-0">
					<div className="flex min-w-0 items-center gap-2">
						<Button
							variant="outline"
							size="icon-sm"
							className="mt-1 shrink-0 lg:hidden"
							aria-label="Back to quick orders"
							onClick={onBack}
						>
							<ChevronLeft />
						</Button>
						<p className="truncate text-xs font-bold text-muted-foreground">
							Order #{order.orderNumber}
						</p>
						<Badge
							className={cn(
								"h-5 px-2 text-[10px] ring-1",
								statusStyles[order.statusTone]
							)}
						>
							{order.status}
						</Badge>
					</div>
					<h2 className="mt-3 text-xl font-bold">
						Delivery on {order.deliveryDate}
					</h2>
				</div>
				<Button
					variant="ghost"
					size="icon-sm"
					className="hidden lg:inline-flex"
					aria-label="Close details"
					onClick={onClose}
				>
					<X />
				</Button>
			</div>

			<div className="no-scrollbar min-h-0 flex-1 overflow-y-auto p-4">
				<div className="grid grid-cols-3 gap-3">
					<div className="rounded-lg bg-emerald-50 p-3 text-foreground dark:bg-emerald-800/5 dark:ring-1 dark:ring-emerald-900/80">
						<CalendarClock className="mb-2 size-4 text-emerald-600" />
						<p className="text-[11px] text-muted-foreground dark:text-emerald-100/70">Placed On</p>
						<p className="text-xs font-bold">
							{order.placedOn}
							<br />
							{order.placedAt}
						</p>
					</div>
					<div className="rounded-lg bg-emerald-50 p-3 text-foreground dark:bg-emerald-800/5 dark:ring-1 dark:ring-emerald-900/80">
						<PackageCheck className="mb-2 size-4 text-emerald-600" />
						<p className="text-[11px] text-muted-foreground dark:text-emerald-100/70">Order Type</p>
						<p className="text-xs font-bold">{order.type}</p>
					</div>
					<div className="rounded-lg bg-emerald-50 p-3 text-foreground dark:bg-emerald-800/5 dark:ring-1 dark:ring-emerald-900/80">
						<CircleDollarSign className="mb-2 size-4 text-emerald-600" />
						<p className="text-[11px] text-muted-foreground dark:text-emerald-100/70">Order Total</p>
						<p className="text-lg font-bold">{formatCurrency(order.total)}</p>
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
							<div className="shrink-0 text-right">
								<p className="text-xs font-bold">{item.quantity} units</p>
								<p className="mt-1 text-xs">{formatCurrency(item.price)}</p>
							</div>
						</div>
					))}
				</div>

				<div className="mt-4 space-y-2 text-sm">
					<div className="flex justify-between">
						<span className="font-semibold">Total Units</span>
						<span className="font-bold">{totalItems}</span>
					</div>
					<div className="flex justify-between">
						<span className="font-semibold">Order Total</span>
						<span className="font-bold">{formatCurrency(order.total)}</span>
					</div>
				</div>
			</div>
			
			{order.status !== "Order Sent" && (
	<div className="border-t p-4">
		<Button variant="outline" className="h-11 w-full text-primary">
			<Download className="size-4" />
			Download Invoice (PDF)
		</Button>
	</div>
)}
		</section>
	)
}

export default function MyOrders() {
	const [selectedOrderId, setSelectedOrderId] = useState(myOrders[0]?.id ?? null)
	const [statusFilter, setStatusFilter] = useState("All Orders")
	const [typeFilter, setTypeFilter] = useState("All Types")

	const filteredOrders = useMemo(
		() =>
			myOrders.filter((order) => {
				const matchesStatus =
					statusFilter === "All Orders" || getOrderBucket(order) === statusFilter
				const matchesType =
					typeFilter === "All Types" || order.type === typeFilter

				return matchesStatus && matchesType
			}),
		[statusFilter, typeFilter]
	)
	const selectedOrder =
		filteredOrders.find((order) => order.id === selectedOrderId) ??
		filteredOrders[0] ??
		null
	const deliveredCount = myOrders.filter((order) => order.status === "Delivered").length
	const totalThisMonth = myOrders.reduce((sum, order) => sum + order.total, 0)

	return (
		<main className="grid h-full min-h-0 gap-4  bg-background p-3 lg:grid-cols-[minmax(0,1fr)_430px] lg:p-4">
			<div
				className={cn(
					"min-h-0 space-y-4 ",
					selectedOrder ? "hidden lg:block" : "block"
				)}
			>
				<section className="grid grid-cols-2 gap-3 md:grid-cols-4">
					<StatCard
						icon={Truck}
						value="12"
						label="Total Orders"
						tone="bg-emerald-50 text-emerald-600"
					/>
					<StatCard
						icon={PackageCheck}
						value={deliveredCount}
						label="Orders Delivered"
						tone="bg-violet-50 text-violet-600"
					/>
					<StatCard
						icon={CalendarClock}
						value="3"
						label="Upcoming Orders"
						tone="bg-orange-50 text-orange-600"
					/>
					<StatCard
						icon={CircleDollarSign}
						value={formatCurrency(totalThisMonth)}
						label="Total Spend"
						tone="bg-blue-50 text-blue-600"
					/>
				</section>

				<section className="flex min-h-0 flex-col rounded-lg border bg-background p-3 shadow-sm">
					<div className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between">
						<div>
							<h2 className="text-lg font-bold">Recent Orders</h2>
						</div>
						<div className="flex flex-wrap items-center gap-2">
							{statusFilters.map((filter) => (
								<Button
									key={filter}
									variant={statusFilter === filter ? "default" : "outline"}
									size="sm"
									onClick={() => setStatusFilter(filter)}
								>
									{filter}
								</Button>
							))}

							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									<Button variant="outline" size="sm">
										<Filter className="size-4" />
										Order Type
									</Button>
								</DropdownMenuTrigger>
								<DropdownMenuContent align="end" className="w-48">
									<DropdownMenuLabel>Type</DropdownMenuLabel>
									<DropdownMenuCheckboxItem
										checked={typeFilter === "All Types"}
										onCheckedChange={() => setTypeFilter("All Types")}
									>
										All Types
									</DropdownMenuCheckboxItem>
									{typeFilters.map((type) => (
										<DropdownMenuCheckboxItem
											key={type}
											checked={typeFilter === type}
											onCheckedChange={() => setTypeFilter(type)}
										>
											{type}
										</DropdownMenuCheckboxItem>
									))}
								</DropdownMenuContent>
							</DropdownMenu>

							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									<Button variant="outline" size="sm">
										Newest First
										<ChevronDown className="size-4" />
									</Button>
								</DropdownMenuTrigger>
								<DropdownMenuContent align="end">
									<DropdownMenuItem>Newest First</DropdownMenuItem>
									<DropdownMenuSeparator />
									<DropdownMenuItem>Oldest First</DropdownMenuItem>
								</DropdownMenuContent>
							</DropdownMenu>
						</div>
					</div>

					<div className="no-scrollbar min-h-0 flex-1 space-y-3 overflow-y-auto pt-3">
						{filteredOrders.map((order) => (
							<OrderRow
								key={order.id}
								order={order}
								selected={selectedOrder?.id === order.id}
								onSelect={setSelectedOrderId}
							/>
						))}
					</div>

					<div className="mt-3 flex items-center justify-between border-t pt-3 text-xs text-muted-foreground">
						<span>
							Showing 1 to {filteredOrders.length} of {myOrders.length} orders
						</span>
					</div>
				</section>
			</div>

			<div
				className={cn(
					"h-full min-h-0",
					selectedOrder ? "block" : "hidden lg:block"
				)}
			>
				{selectedOrder ? (
					<OrderDetail
						order={selectedOrder}
						onBack={() => setSelectedOrderId(null)}
						onClose={() => setSelectedOrderId(null)}
					/>
				) : (
					<section className="grid h-full place-items-center rounded-lg border bg-card">
						<p className="text-sm text-muted-foreground">
							Select an order to view details.
						</p>
					</section>
				)}
			</div>
		</main>
	)
}
