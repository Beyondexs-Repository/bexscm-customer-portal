"use client"

import {
	CalendarClock,
	ChevronDown,
	ChevronRight,
	CircleDollarSign,
	Filter,
	PackageCheck,
	Truck,
} from "lucide-react"

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

import {
	formatCurrency,
	statusFilters,
	statusStyles,
	typeFilters,
} from "./MyOrders"

function StatCard({ icon: Icon, value, label, tone }) {
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
				"grid w-full grid-cols-[1fr_auto] gap-3 rounded-lg border bg-card p-4 text-left shadow-sm transition-colors hover:bg-muted/50 md:grid-cols-[2fr_1.2fr_1fr_1fr_auto] md:items-center md:gap-6",
				selected && "border-primary"
			)}
		>
			<div className="min-w-0">
				<div className="flex min-w-0 items-center gap-2">
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

				<div className="mt-3 grid grid-cols-2 gap-3 md:hidden">
					<div>
						<p className="text-[11px] text-muted-foreground">Delivery</p>
						<p className="truncate text-xs font-bold">{order.deliveryDate}</p>
					</div>

					<div>
						<p className="text-[11px] text-muted-foreground">Total</p>
						<p className="truncate text-xs font-bold">
							{formatCurrency(order.total)}
						</p>
					</div>
				</div>
			</div>

			<div className="hidden min-w-0 md:block">
				<p className="text-[11px] text-muted-foreground">Delivery Date</p>
				<p className="truncate text-xs font-bold">{order.deliveryDate}</p>
			</div>

			<div className="hidden min-w-0 md:block">
				<p className="text-[11px] text-muted-foreground">Type</p>
				<p className="truncate text-xs font-bold">{order.type}</p>
			</div>

			<div className="hidden pr-2 text-right md:block">
				<p className="text-[11px] text-muted-foreground">Total</p>
				<p className="whitespace-nowrap text-xs font-bold">
					{formatCurrency(order.total)}
				</p>
			</div>

			<ChevronRight className="mt-1 size-4 text-muted-foreground md:mt-0" />
		</button>
	)
}

export default function OrderList({
	orders,
	filteredOrders,
	selectedOrder,
	statusFilter,
	typeFilter,
	onStatusFilterChange,
	onTypeFilterChange,
	onSelectOrder,
}) {
	const deliveredCount = orders.filter(
		(order) => order.status === "Delivered"
	).length

	const upcomingCount = orders.filter(
		(order) => order.status === "Order Sent"
	).length

	const totalThisMonth = orders.reduce((sum, order) => sum + order.total, 0)

	return (
		<div className="min-h-0 space-y-4">
			<section className="grid grid-cols-2 gap-3 md:grid-cols-4">
				<StatCard
					icon={Truck}
					value={orders.length}
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
					value={upcomingCount}
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
				<div className="flex flex-col gap-3 py-4 lg:flex-row lg:items-center lg:justify-between">
	<h2 className="text-lg font-bold text-nowrap">Recent Orders</h2>

	<div className="space-y-2 sm:flex sm:flex-wrap sm:items-center sm:gap-2 sm:space-y-0">
		<div className="grid grid-cols-3 gap-2 sm:flex sm:items-center sm:gap-2">
			{statusFilters.map((filter) => (
				<Button
					key={filter}
					variant={statusFilter === filter ? "default" : "outline"}
					size="sm"
					className="w-full sm:w-auto"
					onClick={() => onStatusFilterChange(filter)}
				>
					{filter}
				</Button>
			))}
		</div>

		<div className="grid grid-cols-2 gap-2 sm:flex sm:items-center sm:gap-2">
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button variant="outline" size="sm" className="w-full sm:w-auto">
						<Filter className="size-4" />
						Order Type
					</Button>
				</DropdownMenuTrigger>

				<DropdownMenuContent align="end" className="w-48">
					<DropdownMenuLabel>Type</DropdownMenuLabel>

					<DropdownMenuCheckboxItem
						checked={typeFilter === "All Types"}
						onCheckedChange={() => onTypeFilterChange("All Types")}
					>
						All Types
					</DropdownMenuCheckboxItem>

					{typeFilters.map((type) => (
						<DropdownMenuCheckboxItem
							key={type}
							checked={typeFilter === type}
							onCheckedChange={() => onTypeFilterChange(type)}
						>
							{type}
						</DropdownMenuCheckboxItem>
					))}
				</DropdownMenuContent>
			</DropdownMenu>

			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button variant="outline" size="sm" className="w-full sm:w-auto">
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
</div>

				<div className="no-scrollbar min-h-0 flex-1 space-y-3 overflow-y-auto pt-3">
					{filteredOrders.length > 0 ? (
						filteredOrders.map((order) => (
							<OrderRow
								key={order.id}
								order={order}
								selected={selectedOrder?.id === order.id}
								onSelect={onSelectOrder}
							/>
						))
					) : (
						<div className="grid min-h-40 place-items-center rounded-lg border bg-card">
							<p className="text-sm text-muted-foreground">
								No orders found.
							</p>
						</div>
					)}
				</div>

				<div className="mt-3 flex items-center justify-between border-t pt-3 text-xs text-muted-foreground">
					<span>
						Showing {filteredOrders.length > 0 ? 1 : 0} to{" "}
						{filteredOrders.length} of {orders.length} orders
					</span>
				</div>
			</section>
		</div>
	)
}