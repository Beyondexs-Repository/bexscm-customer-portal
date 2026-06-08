"use client";

import { useMemo, useState } from "react";
import { Plus, Star } from "lucide-react";

import { useQuickOrders } from "@/app/context/app-context";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { QuickOrderList } from "./QuickOrderList";
import { QuickOrderProductsList } from "./QuickOrderProductsList";

export function QuickOrder() {
  const { quickOrders, setQuickOrders, createQuickOrder } = useQuickOrders();
  const [open, setOpen] = useState(false);
  const [quickOrderName, setQuickOrderName] = useState("");
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [selectedGroupId, setSelectedGroupId] = useState(null);

  const selectedOrder = useMemo(
    () =>
      selectedOrderId
        ? (quickOrders.find((order) => order.id === selectedOrderId) ?? null)
        : null,
    [quickOrders, selectedOrderId],
  );
  const selectedGroup =
    selectedOrder?.groups.find((group) => group.id === selectedGroupId) ??
    selectedOrder?.groups[0] ??
    null;

  function handleSave() {
    if (!quickOrderName.trim()) return;

    const newOrder = createQuickOrder(quickOrderName.trim());

    setSelectedOrderId(newOrder.id);
    setSelectedGroupId(newOrder.groups[0]?.id ?? null);
    setQuickOrderName("");
    setOpen(false);
  }

  if (quickOrders.length > 0) {
    return (
      <div className="grid h-full min-h-0 gap-3 overflow-hidden bg-background p-3 lg:grid-cols-[340px_1fr] lg:gap-4 lg:p-4">
        <div
          className={cn(
            "h-full min-h-0",
            selectedOrder ? "hidden lg:block" : "block",
          )}
        >
          <QuickOrderList
            quickOrders={quickOrders}
            setQuickOrders={setQuickOrders}
            selectedOrderId={selectedOrder?.id ?? null}
            setSelectedOrderId={setSelectedOrderId}
            selectedGroupId={selectedGroup?.id ?? null}
            setSelectedGroupId={setSelectedGroupId}
            onCreate={() => setOpen(true)}
          />
        </div>

        <div
          className={cn(
            "h-full min-h-0",
            selectedOrder ? "block" : "hidden lg:block",
          )}
        >
          <QuickOrderProductsList
            selectedOrder={selectedOrder}
            selectedGroup={selectedGroup}
            setQuickOrders={setQuickOrders}
            onBack={() => {
              setSelectedOrderId(null);
              setSelectedGroupId(null);
            }}
          />
        </div>

        <CreateQuickOrderDialog
          open={open}
          setOpen={setOpen}
          quickOrderName={quickOrderName}
          setQuickOrderName={setQuickOrderName}
          handleSave={handleSave}
        />
      </div>
    );
  }

  return (
    <>
      <div className="flex min-h-[calc(100svh-13rem)] items-center justify-center p-4 md:min-h-[calc(100vh-8rem)] md:p-6">
        <Card className="w-full max-w-xl shadow-sm md:min-h-[320px]">
          <CardHeader className="flex flex-col items-center justify-center pt-8 text-center md:pt-12">
            <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 md:mb-6 md:h-20 md:w-20">
              <Star className="size-8 text-primary md:size-10" />
            </div>

            <CardTitle className="text-2xl font-bold md:text-3xl">
              Order Guides
            </CardTitle>

            <CardDescription className="mt-3 max-w-md text-sm leading-relaxed md:mt-4 md:text-base">
              Create and save frequently ordered product lists for faster
              ordering and checkout.
            </CardDescription>
          </CardHeader>

          <CardContent className="flex justify-center pb-8 pt-2 md:pb-12 md:pt-4">
            <Button
              size="lg"
              onClick={() => setOpen(true)}
              className="min-w-[220px]"
            >
              <Plus className="size-4" />
              Create Order Guide
            </Button>
          </CardContent>
        </Card>
      </div>

      <CreateQuickOrderDialog
        open={open}
        setOpen={setOpen}
        quickOrderName={quickOrderName}
        setQuickOrderName={setQuickOrderName}
        handleSave={handleSave}
      />
    </>
  );
}

function CreateQuickOrderDialog({
  open,
  setOpen,
  quickOrderName,
  setQuickOrderName,
  handleSave,
}) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create Order Guide</DialogTitle>
          <DialogDescription>
            Enter a name for your order guide list.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2 py-2">
          <Label htmlFor="quickOrderName">Order Guide Name</Label>
          <Input
            id="quickOrderName"
            placeholder="Eg: Weekly Seafood Order"
            value={quickOrderName}
            onChange={(e) => setQuickOrderName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSave();
            }}
          />
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => {
              setQuickOrderName("");
              setOpen(false);
            }}
          >
            Cancel
          </Button>
          <Button onClick={handleSave}>Save Order Guide</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
