"use client"

import * as React from "react"
import { ShoppingBagIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"

export function CartSidebar({
  open,
  onOpenChange,
  itemCount,
  total,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  itemCount: number
  total: string
}) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-[min(100vw,24rem)] gap-0 p-0 sm:max-w-md">
        <SheetHeader className="border-b px-5 py-4">
          <SheetTitle className="text-lg font-semibold">
            Your Cart{" "}
            <span className="text-sm font-normal text-muted-foreground">
              ({itemCount} items)
            </span>
          </SheetTitle>
        </SheetHeader>

        <div className="flex flex-1 items-center justify-center px-6">
          <div className="flex flex-col items-center text-center">
            <div className="mb-4 flex size-16 items-center justify-center rounded-full bg-muted">
              <ShoppingBagIcon className="size-7 text-primary" />
            </div>
            <p className="text-base font-semibold text-foreground">
              Your cart is empty
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              Add products to see them here.
            </p>
          </div>
        </div>

        <SheetFooter className="border-t px-5 py-4">
          <div className="flex items-center justify-between text-base font-semibold">
            <span>Total</span>
            <span>{total}</span>
          </div>
          <Button className="h-11 w-full" disabled>
            Proceed to Checkout
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
