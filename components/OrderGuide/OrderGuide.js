"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Plus, Star } from "lucide-react";

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
import { useQuickOrders } from "@/app/context/app-context";
import { OrderGuideList } from "./OrderGuideList";
import { OrderGuideProductsList } from "./OrderGuideProductsList";
// import { createOrderGuideApi } from "@/lib/api/orderguideapi";
import { getConfig } from "@/lib/config";
export function OrderGuide() {
  const t = useTranslations("orderGuide");
  const config = getConfig();

  // const custnmbr = localStorage.getItem("custnmbr");

  const canCreate = true;
  const canEdit = true;
  const canDelete = true;
  const canAddProducts = true;
  const canPlaceOrder = true;
  const { quickOrders, setQuickOrders, createQuickOrder } = useQuickOrders();
  const [open, setOpen] = useState(false);
  const [quickOrderName, setQuickOrderName] = useState("");
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [selectedGroupId, setSelectedGroupId] = useState(null);

  const [userId, setUserId] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("loggedInUser");
    console.log(storedUser, "--find localStorage storedUser");
    if (!storedUser) {
      console.error("Logged-in user not found");
      return;
    }

    try {
      const user = JSON.parse(storedUser);

      console.log("Logged-in User:", user);
      // console.log("User ID:", user.userId);

      // setUserId(user.userId);
      setUserId(storedUser);
    } catch (error) {
      console.error("Failed to read logged-in user:", error);
    }
  }, []);

  const selectedOrder = selectedOrderId
    ? (quickOrders.find((order) => order.id === selectedOrderId) ?? null)
    : null;
  const allProducts = selectedOrder
    ? Array.from(
      new Map(
        selectedOrder.groups
          .flatMap((group) => group.products)
          .map((product) => [product.id, product]),
      ).values(),
    )
    : [];
  const storedSelectedGroup =
    selectedOrder?.groups.find((group) => group.id === selectedGroupId) ??
    selectedOrder?.groups[0] ??
    null;
  const selectedGroup =
    selectedOrder && selectedGroupId === "all"
      ? {
        id: "all",
        name: "All",
        products: allProducts,
        isAll: true,
      }
      : storedSelectedGroup;

  //CREATE NEW ORDER =======STEP 2========
  const createOrderGuideApiv1_POST = async ({
    name,
    custnmbr,
    createdBY,
  }) => {
    try {
      const url = `${process.env.NEXT_PUBLIC_NRL_API_URL}/orderguides`;

      console.log("Create Order Guide URL:", url);

      const requestBody = {
        name,
        custnmbr,
        createdBY,
      };

      console.log("Create Order Guide Request Body:", requestBody);

      const response = await fetch(url, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `${process.env.NEXT_PUBLIC_AUTH_TOKEN}`,
        },
        body: JSON.stringify(requestBody),
      });

      console.log("Create Order Guide HTTP Status:", response.status);
      console.log("Create Order Guide HTTP OK:", response.ok);

      const responseText = await response.text();

      console.log("Create Order Guide Raw Response:", responseText);

      let result = null;

      try {
        result = responseText ? JSON.parse(responseText) : null;
      } catch (error) {
        console.warn("Response is not JSON:", responseText);
      }

      console.log("Create Order Guide Parsed Response:", result);

      if (!response.ok) {
        throw new Error(
          result?.Msg ||
          result?.message ||
          result?.error ||
          `Unable to create order guide. HTTP ${response.status}`,
        );
      }

      if (!result?.success) {
        throw new Error(
          result?.Msg ||
          result?.message ||
          "Failed to create order guide.",
        );
      }

      return result;
    } catch (error) {
      console.error("Create Order Guide Error:", error);
      throw error;
    }
  };
  // async function handleSave() {
  //   if (!canCreate) return;

  //   const name = quickOrderName.trim();

  //   if (!name) return;

  //   if (!userId) {
  //     console.error("User ID is not available");
  //     return;
  //   }

  //   try {
  //     const response = await createOrderGuideApi({
  //       name: name,
  //       custnmbr: custnmbr,
  //       createdBY: userId,
  //     });

  //     console.log("Order Guide API Response:", response);

  //     const newOrder = createQuickOrder(name);

  //     setSelectedOrderId(newOrder.id);
  //     setSelectedGroupId(newOrder.groups[0]?.id ?? null);

  //     setQuickOrderName("");
  //     setOpen(false);
  //   } catch (error) {
  //     console.error("Create Order Guide API Error:", error);
  //   }
  // }
  async function handleSave() {
    if (!canCreate) return;

    const name = quickOrderName.trim();
    if (!name) return;

    if (!userId) {
      console.error("User ID is not available");
      return;
    }
    const custnmbr = localStorage.getItem("custnmbr");
    try {
      await createOrderGuideApiv1_POST({
        name,
        custnmbr,
        createdBY: userId,
      });

      // If the list isn't mounted yet (empty state), add a placeholder so it mounts.
      // It gets replaced by the real data from the API right after.
      if (quickOrders.length === 0) {
        createQuickOrder(name);
      }

      // Tell OrderGuideList to reload from the API
      setRefreshKey((k) => k + 1);

      setQuickOrderName("");
      setOpen(false);
    } catch (error) {
      console.error("Create Order Guide API Error:", error);
    }
  }



  return (
    <>
      <div
        className={cn(
          isLoading || quickOrders.length === 0
            ? "hidden"
            : "contents",
        )}
      >
        <div className="grid h-full min-h-0 gap-2 overflow-hidden bg-background p-2 lg:grid-cols-[320px_1fr] lg:gap-3 lg:p-3">
          <div
            className={cn(
              "h-full min-h-0",
              selectedOrder ? "hidden lg:block" : "block",
            )}
          >
            <OrderGuideList
              quickOrders={quickOrders}
              setQuickOrders={setQuickOrders}
              refreshKey={refreshKey}
              selectedOrderId={selectedOrder?.id ?? null}
              setSelectedOrderId={setSelectedOrderId}
              selectedGroupId={selectedGroup?.id ?? null}
              setSelectedGroupId={setSelectedGroupId}
              onCreate={() => setOpen(true)}
              canCreate={canCreate}
              canEdit={canEdit}
              canDelete={canDelete}
              setIsLoading={setIsLoading}
            />
          </div>

          <div
            className={cn(
              "h-full min-h-0",
              selectedOrder ? "block" : "hidden lg:block",
            )}
          >
            <OrderGuideProductsList
              selectedOrder={selectedOrder}
              selectedGroup={selectedGroup}
              setQuickOrders={setQuickOrders}
              userId={userId}
              onRefresh={() => setRefreshKey((k) => k + 1)}
              onBack={() => {
                setSelectedOrderId(null);
                setSelectedGroupId(null);
              }}
              canEdit={canEdit}
              canAddProducts={canAddProducts}
              canPlaceOrder={canPlaceOrder}
            />
          </div>

          {canCreate ? (
            <CreateQuickOrderDialog
              open={open}
              setOpen={setOpen}
              quickOrderName={quickOrderName}
              setQuickOrderName={setQuickOrderName}
              handleSave={handleSave}
            />
          ) : null}
        </div>
      </div>

      {/* Loader */}
      {isLoading && (
        <div className="flex min-h-[calc(100svh-13rem)] items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <div className="size-8 animate-spin rounded-full border-4 border-muted border-t-primary" />
            <p className="text-sm text-muted-foreground">
              Loading order guides...
            </p>
          </div>
        </div>
      )}

      {/* Empty state */}
      {!isLoading && quickOrders.length === 0 && (
        <>
          <div className="flex min-h-[calc(100svh-13rem)] items-center justify-center p-4 md:min-h-[calc(100vh-8rem)] md:p-6">
            <Card className="w-full max-w-xl shadow-sm md:min-h-[320px]">
              <CardHeader className="flex flex-col items-center justify-center pt-8 text-center md:pt-12">
                <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 md:mb-6 md:h-20 md:w-20">
                  <Star className="size-8 text-primary md:size-10" />
                </div>

                <CardTitle className="text-2xl font-bold md:text-3xl">
                  {t("title")}
                </CardTitle>

                <CardDescription className="mt-3 max-w-md text-sm leading-relaxed md:mt-4 md:text-base">
                  {t("description")}
                </CardDescription>
              </CardHeader>

              {canCreate ? (
                <CardContent className="flex justify-center pb-8 pt-2 md:pb-12 md:pt-4">
                  <Button
                    size="lg"
                    onClick={() => setOpen(true)}
                    className="w-auto"
                  >
                    <Plus className="size-4" />
                    {t("create")}
                  </Button>
                </CardContent>
              ) : null}
            </Card>
          </div>

          {canCreate ? (
            <CreateQuickOrderDialog
              open={open}
              setOpen={setOpen}
              quickOrderName={quickOrderName}
              setQuickOrderName={setQuickOrderName}
              handleSave={handleSave}
            />
          ) : null}
        </>
      )}
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
  const t = useTranslations("orderGuide");

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
            {t("cancel")}
          </Button>
          <Button onClick={handleSave}>{t("save")}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
