import { Suspense } from "react"
import MyOrders from "@/components/myorders/MyOrders"

export default function MyOrdersPage() {
	return (
		<Suspense fallback={<div className="min-h-[60vh] animate-pulse rounded-lg bg-muted/40" />}>
			<MyOrders />
		</Suspense>
	)
}
