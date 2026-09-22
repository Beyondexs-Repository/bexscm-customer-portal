"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import { Plus, Star } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { useQuickOrders } from "@/app/context/app-context"
import { OrderGuideList } from "./OrderGuideList"
import { OrderGuideProductsList } from "./OrderGuideProductsList"

export function OrderGuide() {
  const t = useTranslations("orderGuide")
  const canCreate = true
  const canEdit = true
  const canDelete = true
  const canAddProducts = true
  const canPlaceOrder = true
  const { quickOrders, setQuickOrders, createQuickOrder } = useQuickOrders()
  const [open, setOpen] = useState(false)
  const [quickOrderName, setQuickOrderName] = useState("")
  const [selectedOrderId, setSelectedOrderId] = useState(null)
  const [selectedGroupId, setSelectedGroupId] = useState(null)

  const selectedOrder = selectedOrderId
    ? quickOrders.find((order) => order.id === selectedOrderId) ?? null
    : null
  const allProducts = selectedOrder
    ? Array.from(
        new Map(
          selectedOrder.groups
            .flatMap((group) => group.products)
            .map((product) => [product.id, product]),
        ).values(),
      )
    : []
  const storedSelectedGroup =
    selectedOrder?.groups.find((group) => group.id === selectedGroupId) ??
    selectedOrder?.groups[0] ??
    null
  const selectedGroup =
    selectedOrder && selectedGroupId === "all"
      ? {
          id: "all",
          name: "All",
          products: allProducts,
          isAll: true,
        }
      : storedSelectedGroup

  function handleSave() {
    if (!canCreate) return
    if (!quickOrderName.trim()) return

    const newOrder = createQuickOrder(quickOrderName.trim())

    setSelectedOrderId(newOrder.id)
    setSelectedGroupId("all")
    setQuickOrderName("")
    setOpen(false)
  }

  if (quickOrders.length > 0) {
    return (
      <div className="grid h-full min-h-0 w-full min-w-0 grid-cols-1 gap-2 overflow-hidden bg-background p-1 sm:p-2 lg:grid-cols-[320px_minmax(0,1fr)] lg:gap-3 lg:p-3">
        <div className={cn("h-full min-h-0 min-w-0", selectedOrder ? "hidden lg:block" : "block")}>
          <OrderGuideList
            quickOrders={quickOrders}
            setQuickOrders={setQuickOrders}
            selectedOrderId={selectedOrder?.id ?? null}
            setSelectedOrderId={setSelectedOrderId}
            selectedGroupId={selectedGroup?.id ?? null}
            setSelectedGroupId={setSelectedGroupId}
            onCreate={() => setOpen(true)}
            canCreate={canCreate}
            canEdit={canEdit}
            canDelete={canDelete}
          />
        </div>

        <div className={cn("h-full min-h-0 min-w-0", selectedOrder ? "block" : "hidden lg:block")}>
          <OrderGuideProductsList
            selectedOrder={selectedOrder}
            selectedGroup={selectedGroup}
            setQuickOrders={setQuickOrders}
            onBack={() => {
              setSelectedOrderId(null)
              setSelectedGroupId(null)
            }}
            canEdit={canEdit}
            canAddProducts={canAddProducts}
            canPlaceOrder={canPlaceOrder}
          />
        </div>

        {canCreate ? <CreateQuickOrderDialog
          open={open}
          setOpen={setOpen}
          quickOrderName={quickOrderName}
          setQuickOrderName={setQuickOrderName}
          handleSave={handleSave}
        /> : null}
      </div>
    )
  }

  return (
    <>
      <div className="flex min-h-[calc(100svh-13rem)] items-center justify-center p-4 md:min-h-[calc(100vh-8rem)] md:p-6">
        <Card className="w-full max-w-xl shadow-sm md:min-h-[320px]">
          <CardHeader className="flex flex-col items-center justify-center pt-8 text-center md:pt-12">
            <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 md:mb-6 md:h-20 md:w-20">
              <Star className="size-8 text-primary md:size-10" />
            </div>

            <CardTitle className="text-2xl font-bold md:text-3xl">{t("title")}</CardTitle>
            <CardDescription className="mt-3 max-w-md text-sm leading-relaxed md:mt-4 md:text-base">
              {t("description")}
            </CardDescription>
          </CardHeader>

          {canCreate ? <CardContent className="flex justify-center pb-8 pt-2 md:pb-12 md:pt-4">
            <Button size="lg" onClick={() => setOpen(true)} className="w-auto">
              <Plus className="size-4" />
              {t("create")}
            </Button>
          </CardContent> : null}
        </Card>
      </div>

      {canCreate ? <CreateQuickOrderDialog
        open={open}
        setOpen={setOpen}
        quickOrderName={quickOrderName}
        setQuickOrderName={setQuickOrderName}
        handleSave={handleSave}
      /> : null}
    </>
  )
}

function CreateQuickOrderDialog({
  open,
  setOpen,
  quickOrderName,
  setQuickOrderName,
  handleSave,
}) {
  const t = useTranslations("orderGuide")

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t("createDialogTitle")}</DialogTitle>
          <DialogDescription>{t("createDialogDescription")}</DialogDescription>
        </DialogHeader>

        <div className="space-y-2 py-2">
          <Label htmlFor="quickOrderName">{t("nameLabel")}</Label>
          <Input
            id="quickOrderName"
            placeholder={t("namePlaceholder")}
            value={quickOrderName}
            onChange={(e) => setQuickOrderName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSave()
            }}
          />
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => {
              setQuickOrderName("")
              setOpen(false)
            }}
          >
            {t("cancel")}
          </Button>
          <Button onClick={handleSave}>{t("save")}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
