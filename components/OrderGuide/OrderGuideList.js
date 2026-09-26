"use client";
import { useDispatch } from "react-redux";
import { PutOrderGuideSequence } from "../../redux/slices/postSlice"; // adjust path
import { useEffect, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import {
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  ChevronRight,
  Download,
  GripVertical,
  MoreVertical,
  Package2,
  Pencil,
  Plus,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

// import { fetchOrderGuideListApi } from "@/lib/api/orderguidelistapi";

// import { getConfig } from "@/lib/config";
//Primary group 
// import { fetchOrderGuideListApi } from "@/lib/api/orderguidelistapi";
// import { getOrderGroupItemsApi } from "@/lib/api/ordergroupitemget";
// import { modifyOrderGuideApi } from "@/lib/api/orderguideput";
// import { deleteOrderGuideApi } from "@/lib/api/orderguidedelete";


//Secondary group Add Group
// import { getOrderGuideGroupApi } from "@/lib/api/orderguidegroupget";

// import { createOrderGuideGroupApi } from "@/lib/api/orderguidegrouppost";
// import { deleteOrderGuideGroupApi } from "@/lib/api/orderguidegroupdelete";
// import { updateOrderGuideGroupApi } from "@/lib/api/orderguidegroupput";

function countOrderProducts(order) {
  return order.groups.reduce(
    (total, group) => total + group.products.length,
    0,
  );
}

function countUniqueOrderProducts(order) {
  return new Set(
    order.groups.flatMap((group) =>
      group.products.map((product) => product.id),
    ),
  ).size;
}

function touchOrder(order) {
  return {
    ...order,
    updatedAt: new Date().toISOString(),
  };
}

function formatUpdatedAt(value) {
  if (!value) return "Updated just now";

  const diff = Date.now() - new Date(value).getTime();
  const minutes = Math.max(0, Math.floor(diff / 60000));

  if (minutes < 1) return "Updated just now";
  if (minutes < 60) return `Updated ${minutes} min ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `Updated ${hours} hr ago`;

  const days = Math.floor(hours / 24);
  return `Updated ${days} day${days === 1 ? "" : "s"} ago`;
}

// function mapOrderGroupItemToProduct(item) {
//   const id =
//     item.itemNumber ?? item.itemnumber ?? item.ITEMNMBR ?? item.itemnmbr ?? "";

//   return {
//     id,
//     sku: id,
//     name:
//       item.itemName ?? item.itemname ?? item.ItemName ?? item.itemdesc ?? "",
//     brand: item.brand ?? item.ppc_Brand ?? "",
//     unit: item.unit ?? item.uomschdl ?? item.UOMSCHDL ?? "unit",
//     price: Number(item.price ?? item.qtybsuom ?? item.QTYBSUOM ?? 0) || 0,
//     category: item.category ?? item.mainGroup ?? item.MainGroup ?? "",
//     subcategory: item.subcategory ?? item.subGroup ?? item["Sub-Group"] ?? "",
//     image: item.image ?? item.Image ?? "",
//     par: item.par === undefined || item.par === null ? null : String(item.par),
//   };
// }

function mapOrderGroupItemToProduct(item) {
  const id = String(item.orderGroupItemID);

  const itemNumber =
    item.itemNumber ?? item.itemnumber ?? item.ITEMNMBR ?? item.itemnmbr ?? "";

  return {
    id,

    // Keep the API ID separately
    orderGroupItemID: item.orderGroupItemID,

    orderGuideGroupID: item.orderGuideGroupID,

    // Item number is only the SKU/business number
    sku: itemNumber,

    itemNumber,

    name:
      item.itemName ?? item.itemname ?? item.ItemName ?? item.itemdesc ?? "",

    itemName:
      item.itemName ?? item.itemname ?? item.ItemName ?? item.itemdesc ?? "",

    brand: item.brand ?? item.ppc_Brand ?? "",

    unit: item.unit ?? item.uomschdl ?? item.UOMSCHDL ?? "unit",

    price: Number(item.price ?? item.qtybsuom ?? item.QTYBSUOM ?? 0) || 0,

    category: item.category ?? item.mainGroup ?? item.MainGroup ?? "",

    subcategory: item.subcategory ?? item.subGroup ?? item["Sub-Group"] ?? "",

    image: item.image ?? item.Image ?? "",

    quantity: Number(item.quantity ?? 0),

    // par: item.par === undefined || item.par === null ? null : String(item.par),
      par:
      (item.parValue ?? item.par) == null
        ? null
        : String(item.parValue ?? item.par),
  };
}

function OrderGuideCard({
  order,
  orderIndex,
  isSelectedOrder,
  isExpandedOrder,
  selectedGroupId,
  onToggleExpand,
  onSelectGroup,
  onOpenRenameOrder,
  onOpenRenameGroup,
  onOpenEditGroupPar,
  onOpenDeleteOrder,
  onOpenDeleteGroup,
  onAddGroup,

  canEdit,
  canDelete,
}) {
  const t = useTranslations("orderGuide");
  const {
    setNodeRef,
    setActivatorNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: order.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <section
      ref={setNodeRef}
      style={style}
      className={cn(
        "rounded-lg border bg-background/50 p-3 transition-colors",
        isExpandedOrder && "border-primary/80",
        isDragging && "opacity-70 shadow-lg",
      )}
    >
      <div className="flex items-start gap-2">
        <button
          type="button"
          ref={setActivatorNodeRef}
          aria-label={`Drag ${order.name}`}
          className="mt-1 grid size-7 shrink-0 cursor-grab place-items-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground active:cursor-grabbing"
          {...(canEdit ? attributes : {})}
          {...(canEdit ? listeners : {})}
        >
          <GripVertical className="size-4" />
        </button>

        <button
          type="button"
          className="flex min-w-0 flex-1 items-start justify-between gap-3 rounded-md text-left"
          onClick={onToggleExpand}
        >
          <div className="min-w-0 space-y-1">
            <div className="flex min-w-0 items-center gap-2">
              <h3 className="truncate text-sm font-semibold">{order.name}</h3>
              {orderIndex === 0 ? (
                <Badge className="h-4 px-1.5 text-[10px]">{t("default")}</Badge>
              ) : null}
            </div>
            <p className="truncate text-xs text-muted-foreground">
              {countOrderProducts(order)} items -{" "}
              {formatUpdatedAt(order.updatedAt)}
            </p>
          </div>

          <ChevronRight
            className={cn(
              "mt-2 size-4 shrink-0 text-muted-foreground transition-transform",
              isExpandedOrder && "rotate-90",
            )}
          />
        </button>
      </div>

      {isExpandedOrder ? (
        <div className="mt-4 space-y-2">
          <div
            className={cn(
              "flex items-center justify-between gap-2 rounded-md border border-transparent px-3 py-2.5 text-sm",
              isSelectedOrder && selectedGroupId === "all"
                ? "bg-primary/25 text-foreground"
                : "bg-muted/35",
            )}
          >
            <button
              type="button"
              className="min-w-0 flex-1 truncate text-left font-medium"
              onClick={() => onSelectGroup(order.id, "all")}
            >
              All
            </button>
            <span className="rounded-full bg-background/75 px-2 py-0.5 text-xs font-semibold">
              {countUniqueOrderProducts(order)}
            </span>
            {canEdit ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon-xs"
                    aria-label="All options"
                  >
                    <MoreVertical />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-36">
                  <DropdownMenuItem
                    onSelect={() =>
                      onOpenEditGroupPar(order, {
                        id: "all",
                        name: "All",
                        isAll: true,
                        products: order.groups.flatMap(
                          (group) => group.products,
                        ),
                      })
                    }
                  >
                    <Package2 className="size-4" />
                    {t("editPar")}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : null}
          </div>
          {order.groups.map((group) => {
            const isSelectedGroup =
              isSelectedOrder && group.id === selectedGroupId;

            return (
              <div
                key={group.id}
                className={cn(
                  "flex items-center justify-between gap-2 rounded-md border border-transparent px-3 py-2.5 text-sm",
                  isSelectedGroup
                    ? "bg-primary/25 text-foreground"
                    : "bg-muted/35",
                )}
              >
                <button
                  type="button"
                  className="min-w-0 flex-1 truncate text-left font-medium"
                  onClick={() => onSelectGroup(order.id, group.id)}
                >
                  {group.name}
                </button>

                <span className="rounded-full bg-background/75 px-2 py-0.5 text-xs font-semibold">
                  {group.products.length}
                </span>

                {canEdit || canDelete ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon-xs"
                        aria-label={`${group.name} options`}
                      >
                        <MoreVertical />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-36">
                      {canEdit ? (
                        <DropdownMenuItem
                          onSelect={() => onOpenRenameGroup(order, group)}
                        >
                          <Pencil className="size-4" />
                          {t("rename")}
                        </DropdownMenuItem>
                      ) : null}
                      {canEdit ? (
                        <DropdownMenuItem
                          onSelect={() => onOpenEditGroupPar(order, group)}
                        >
                          <Package2 className="size-4" />
                          {t("editPar")}
                        </DropdownMenuItem>
                      ) : null}
                      {canDelete ? (
                        <DropdownMenuItem
                          variant="destructive"
                          disabled={order.groups.length <= 1}
                          onSelect={() => onOpenDeleteGroup(order, group)}
                        >
                          <Trash2 className="size-4" />
                          {t("delete")}
                        </DropdownMenuItem>
                      ) : null}
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : null}
              </div>
            );
          })}

          {canEdit ? (
            <Button
              variant="outline"
              className="h-10 w-full border-dashed bg-transparent"
              onClick={() => onAddGroup(order)}
            >
              <Plus className="size-4" />
              {t("addGroup")}
            </Button>
          ) : null}

          {canEdit || canDelete ? (
            <div className="grid grid-cols-2 gap-2 pt-1">
              {canEdit ? (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onOpenRenameOrder(order)}
                >
                  <Pencil className="size-4" />
                  {t("rename")}
                </Button>
              ) : null}
              {canDelete ? (
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => onOpenDeleteOrder(order)}
                >
                  <Trash2 className="size-4" />
                  {t("delete")}
                </Button>
              ) : null}
            </div>
          ) : null}
          <Button size="sm" className="mt-0 h-8 w-full">
            <Download className="size-4" />
            {t("downloadPARSheet")}
          </Button>
        </div>
      ) : null}
    </section>
  );
}

export function OrderGuideList({
  quickOrders,
  setQuickOrders,
  refreshKey,
  selectedOrderId,
  setSelectedOrderId,
  selectedGroupId,
  setSelectedGroupId,
  onCreate,
  canCreate,
  canEdit,
  canDelete,
}) {

  const dispatch = useDispatch();
  const t = useTranslations("orderGuide");
  const [dialog, setDialog] = useState(null);
  const [draftName, setDraftName] = useState("");
  const [parDraft, setParDraft] = useState("");
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  const [activeOrderId, setActiveOrderId] = useState(null);
  const [isSavingName, setIsSavingName] = useState(false);
  const [nameDialogError, setNameDialogError] = useState(null);

  const [userId, setUserId] = useState(null);
  //primary group
  const [cusList, setCusList] = useState([]);
  const [getcusloading, setGetCusloading] = useState(false);
//primary Group 1
  const [orderList, setOrderList] = useState([]);
  const [getOrderloading, setGetorderloading] = useState(false);

  //secondary Group
  const [secondaryorderList, setsecondaryOrderList] = useState([]);
  const [secondaryOrderloading, setsecondaryorderloading] = useState(false);



//PAR - bulk update (used by "All" and group Edit PAR)
const updateBulkParPUT = async ({ items, modifyBY }) => {
  const url = `${process.env.NEXT_PUBLIC_NRL_API_URL}/ordergroupitems/par/bulk`;
  const requestBody = { items, modifyBY };

  console.log("Bulk PAR URL:", url);
  console.log("Bulk PAR Request Body:", requestBody);

  const response = await fetch(url, {
    method: "PUT",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `${process.env.NEXT_PUBLIC_AUTH_TOKEN}`,
    },
    body: JSON.stringify(requestBody),
  });

  const responseText = await response.text();
  console.log("Bulk PAR Raw Response:", responseText);

  let result = null;
  try {
    result = responseText ? JSON.parse(responseText) : null;
  } catch (error) {
    console.warn("Response is not JSON:", responseText);
  }

  if (!response.ok || result?.success === false) {
    throw new Error(
      result?.Msg ||
        result?.message ||
        result?.error ||
        `Unable to update PAR. HTTP ${response.status}`,
    );
  }

  return result; // { success: true, updatedCount: 2 }
};

  //Secondary Group get=========step 1================
  const getOrderGroupItemsApiv1_GET = async (orderGuideGroupID) => {
  setGetorderloading(true);
console.log("calling Order Guide --> Primary group -- secondary Group -- group items onclick -- GET");
  try {
    const url = `${process.env.NEXT_PUBLIC_NRL_API_URL}/ordergroupitems/group/${orderGuideGroupID}`;

    console.log("Customer ID:", orderGuideGroupID);
    console.log("Customer Orders API URL:", url);

    const response = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: `${process.env.NEXT_PUBLIC_AUTH_TOKEN}`,
      },
    });

    console.log("Customer Orders HTTP Status:", response.status);
    console.log("Customer Orders HTTP OK:", response.ok);

    const responseText = await response.text();

    console.log("Customer Orders Raw Response:", responseText);

    let result = null;

    try {
      result = responseText ? JSON.parse(responseText) : null;
    } catch (error) {
      console.warn("Response is not JSON:", responseText);
    }

    console.log("Customer Orders Parsed Response:", result);

    if (!response.ok) {
      throw new Error(
        result?.Msg ||
          result?.message ||
          result?.error ||
          `Unable to fetch customer orders. HTTP ${response.status}`
      );
    }

    setOrderList(result);

    return result;
  } catch (error) {
    console.error("Customer Orders Error:", error);
    setOrderList([]);
    return null;
  } finally {
    setGetorderloading(false);
  }
};

// STEP 2 IN OrderGuide file=====================
//INITIAL GROUP LIST INSIDE CREATE GROUP=======STEP 4========

//Primary Group_Delete
const deleteOrderGuideApiv1_DEL = async (orderGuideID) => {
  try {
    const url = `${process.env.NEXT_PUBLIC_NRL_API_URL}/orderguides/${orderGuideID}`;

    console.log("Delete Order Guide ID:", orderGuideID);
    console.log("Delete Order Guide URL:", url);

    const response = await fetch(url, {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        Authorization: `${process.env.NEXT_PUBLIC_AUTH_TOKEN}`,
      },
    });

    console.log("Delete Order Guide HTTP Status:", response.status);
    console.log("Delete Order Guide HTTP OK:", response.ok);

    const responseText = await response.text();

    console.log("Delete Order Guide Raw Response:", responseText);

    let result = null;

    try {
      result = responseText ? JSON.parse(responseText) : null;
    } catch (error) {
      console.warn("Response is not JSON:", responseText);
    }

    console.log("Delete Order Guide Parsed Response:", result);

    if (!response.ok) {
      throw new Error(
        result?.Msg ||
          result?.message ||
          result?.error ||
          `Unable to delete order guide. HTTP ${response.status}`,
      );
    }

    if (!result?.success) {
      throw new Error(
        result?.Msg ||
          result?.message ||
          result?.error ||
          "Failed to delete order guide.",
      );
    }

    return result;
  } catch (error) {
    console.error("Delete Order Guide Error:", error);
    throw error;
  }
};


//Primary group_Renaming the Group

const modifyOrderGuideApiv1_Modify = async ({
  orderGuideID,
  name,
  modifyBY,
}) => {
  try {
    const url = `${process.env.NEXT_PUBLIC_NRL_API_URL}/orderguides/${orderGuideID}`;

    const requestBody = {
      name,
      modifyBY,
    };

    console.log("Update Order Guide ID:", orderGuideID);
    console.log("Update Order Guide URL:", url);
    console.log("Update Order Guide Request Body:", requestBody);

    const response = await fetch(url, {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `${process.env.NEXT_PUBLIC_AUTH_TOKEN}`,
      },
      body: JSON.stringify(requestBody),
    });

    console.log("Update Order Guide HTTP Status:", response.status);
    console.log("Update Order Guide HTTP OK:", response.ok);

    const responseText = await response.text();

    console.log("Update Order Guide Raw Response:", responseText);

    let result = null;

    try {
      result = responseText ? JSON.parse(responseText) : null;
    } catch (error) {
      console.warn("Response is not JSON:", responseText);
    }

    console.log("Update Order Guide Parsed Response:", result);

    if (!response.ok) {
      throw new Error(
        result?.Msg ||
          result?.message ||
          result?.error ||
          `Unable to update order guide. HTTP ${response.status}`,
      );
    }

    if (!result?.success) {
      throw new Error(
        result?.Msg ||
          result?.message ||
          result?.error ||
          "Failed to update order guide.",
      );
    }

    return result;
  } catch (error) {
    console.error("Update Order Guide Error:", error);
    throw error;
  }
};


  useEffect(() => {
    const storedUser = localStorage.getItem("loggedInUser");
   const custnmbr = localStorage.getItem("custnmbr");
console.log(custnmbr,storedUser,  "--find custnmbr in OrderDuideList")
    if (!storedUser) {
      console.error("Logged-in user not found");
      return;
    }

    try {
      const user = JSON.parse(storedUser);

      // setUserId(user.userId);
 setUserId(storedUser);
      console.log("Logged-in User ID:", storedUser);
    } catch (error) {
      console.error("Failed to parse logged-in user:", error);
    }
  }, []);


  //secondar_Group_get
const getOrderGuideGroupApiv1_GET = async (orderGuideID) => {
  setsecondaryorderloading(true);

  try {
    const url = `${process.env.NEXT_PUBLIC_NRL_API_URL}/orderguidegroups/orderguide/${orderGuideID}`;

    console.log("Order Guide ID:", orderGuideID);
    console.log("Order Guide Groups API URL:", url);

    const response = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: `${process.env.NEXT_PUBLIC_AUTH_TOKEN}`,
      },
    });

    console.log("Order Guide Groups HTTP Status:", response.status);
    console.log("Order Guide Groups HTTP OK:", response.ok);

    const responseText = await response.text();

    console.log("Order Guide Groups Raw Response:", responseText);

    let result = null;

    try {
      result = responseText ? JSON.parse(responseText) : null;
    } catch (error) {
      console.warn("Response is not JSON:", responseText);
    }

    console.log("Order Guide Groups Parsed Response:", result);

    if (!response.ok) {
      throw new Error(
        result?.Msg ||
          result?.message ||
          result?.error ||
          `Unable to fetch order guide groups. HTTP ${response.status}`,
      );
    }

    if (!result?.success) {
      throw new Error(
        result?.Msg ||
          result?.message ||
          result?.error ||
          "Failed to fetch order guide groups.",
      );
    }

    setsecondaryOrderList(result);

    return result;
  } catch (error) {
    console.error("Order Guide Groups Error:", error);
    setsecondaryOrderList([]);
    throw error;
  } finally {
    setsecondaryorderloading(false);
  }
};

  // async function getGroupsForOrderGuide(order) {
  //   try {
  //     console.log("Getting groups for Order Guide:", order.id);

  //     const response = await getOrderGuideGroupApi(order.id);

  //     console.log("Get Order Guide Groups Response:", response);

  //     if (response?.success && Array.isArray(response?.data)) {
  //       return response.data.map((group) => ({
  //         id: String(group.orderGuideGroupID),
  //         name: group.name,
  //         products: [],
  //       }));
  //     }

  //     return order.groups || [];
  //   } catch (error) {
  //     console.error("Failed to get Order Guide groups:", error);

  //     return order.groups || [];
  //   }
  // }

  async function getGroupsForOrderGuide(order) {
    try {
      console.log("Getting groups for Order Guide:", order.id);

      const response = await getOrderGuideGroupApiv1_GET(order.id);

      console.log("Get Order Guide Groups Response:", response);

      if (response?.success && Array.isArray(response?.data)) {
        const groupsWithProducts = await Promise.all(
          response.data.map(async (group) => {
            try {
              const groupId = String(group.orderGuideGroupID);

              console.log("Getting items for group:", groupId);

              const itemsResponse = await getOrderGroupItemsApiv1_GET(groupId);

              console.log(
                `Items Response for group ${groupId}:`,
                itemsResponse,
              );

              const products =
                itemsResponse?.success && Array.isArray(itemsResponse?.data)
                  ? itemsResponse.data.map(mapOrderGroupItemToProduct)
                  : [];

              return {
                id: groupId,
                name: group.name,
                products,
              };
            } catch (error) {
              console.error(
                `Failed to load items for group ${group.orderGuideGroupID}:`,
                error,
              );

              return {
                id: String(group.orderGuideGroupID),
                name: group.name,
                products: [],
              };
            }
          }),
        );

        return groupsWithProducts;
      }

      return order.groups || [];
    } catch (error) {
      console.error("Failed to get Order Guide groups:", error);

      return order.groups || [];
    }
  }


 async function loadItemsForGroup(orderId, groupId) {
    try {
      console.log("Getting items for Order Guide Group:", groupId);

      const response = await getOrderGroupItemsApiv1_GET(groupId);

      console.log("Get Order Group Items Response:", response);

      if (response?.success && Array.isArray(response?.data)) {
        const products = response.data.map(mapOrderGroupItemToProduct);

        setQuickOrders((orders) =>
          orders.map((order) =>
            order.id === orderId
              ? {
                  ...order,
                  groups: order.groups.map((group) =>
                    group.id === groupId ? { ...group, products } : group,
                  ),
                }
              : order,
          ),
        );
      }
    } catch (error) {
      console.error("Failed to get Order Group Items:", error);
    }
  }

  async function handleDelete(orderGuideID) {
    try {
      const response = await deleteOrderGuideApiv1_DEL(orderGuideID);

      console.log("Delete API Response:", response);

      if (response?.success) {
        // Remove deleted order guide from UI
        setQuickOrders((prevOrders) =>
          prevOrders.filter(
            (order) =>
              String(order.id) !== String(orderGuideID) &&
              String(order.orderGuideID) !== String(orderGuideID),
          ),
        );

        // Clear selected guide if necessary
        if (selectedOrderId === orderGuideID) {
          setSelectedOrderId(null);
          setSelectedGroupId(null);
        }
      }
    } catch (error) {
      console.error("Delete Order Guide Error:", error);
    }
  }

  const fetchOrderGuideListApiv1_GET = async (customerID) => {
  try {
    const url = `${process.env.NEXT_PUBLIC_NRL_API_URL}/orderguides/customer/${customerID}`;

    console.log("=================================");
    console.log("GET ORDER GUIDES");
    console.log("Customer ID:", customerID);
    console.log("URL:", url);
    console.log("=================================");

    const response = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: `${process.env.NEXT_PUBLIC_AUTH_TOKEN}`,
      },
    });

    console.log("HTTP Status:", response.status);
    console.log("HTTP OK:", response.ok);

    const responseText = await response.text();

    console.log("Raw Response:", responseText);

    let result = null;

    try {
      result = responseText ? JSON.parse(responseText) : null;
    } catch (error) {
      console.error("Response is not valid JSON:", error);
      throw new Error("Invalid JSON response from order guides API");
    }

    console.log("Parsed Response:", result);

    if (!response.ok) {
      throw new Error(
        result?.Msg ||
          result?.message ||
          result?.error ||
          `Unable to fetch order guides. HTTP ${response.status}`,
      );
    }

    // IMPORTANT:
    // Your component expects an ARRAY.
    const orderGuides = Array.isArray(result)
      ? result
      : Array.isArray(result?.data)
        ? result.data
        : [];

    console.log("Final Order Guides Array:", orderGuides);

    return orderGuides;
  } catch (error) {
    console.error("Fetch Order Guides Error:", error);
    return [];
  }
};

async function loadOrderGuides() {
  try {
   const custnmbr = localStorage.getItem("custnmbr");
    const apiOrderGuides = await fetchOrderGuideListApiv1_GET(custnmbr);

    const formattedOrderGuides = await Promise.all(
      apiOrderGuides.map(async (item) => {
        const order = {
          id: String(item.orderGuideID),
          name: item.name,
          custnmbr: item.custnmbr,
          sequence: item.sequence,
          createdBY: item.createdBY,
          createdDTS: item.createdDTS,
          updatedAt: item.updatedDTS || item.createdDTS,
          groups: [],
        };

        const groups = await getGroupsForOrderGuide(order);
        return { ...order, groups };
      }),
    );

    setQuickOrders(formattedOrderGuides);
  } catch (error) {
    console.error("Failed to load Order Guides:", error);
  }
}

useEffect(() => {
  loadOrderGuides();
}, [setQuickOrders, refreshKey]);

  // useEffect(() => {
  //   async function loadOrderGuides() {
  //     try {
  //       const config = getConfig();

  //       const custnmbr = String(config.DEFAULT_CUSTNMBR || "400001").trim();

  //       console.log("Customer Number:", custnmbr);

  //       const apiOrderGuides = await fetchOrderGuideListApi(custnmbr);

  //       console.log("Order Guides from API:", apiOrderGuides);

  //       const formattedOrderGuides = await Promise.all(
  //         apiOrderGuides.map(async (item) => {
  //           const order = {
  //             id: String(item.orderGuideID),
  //             name: item.name,
  //             custnmbr: item.custnmbr,
  //             sequence: item.sequence,
  //             createdBY: item.createdBY,
  //             createdDTS: item.createdDTS,
  //             updatedAt: item.updatedDTS || item.createdDTS,
  //             groups: [],
  //           };

  //           // Load groups + products/counts immediately
  //           const groups = await getGroupsForOrderGuide(order);

  //           return {
  //             ...order,
  //             groups,
  //           };
  //         }),
  //       );

  //       console.log(
  //         "Formatted Order Guides with Products:",
  //         formattedOrderGuides,
  //       );

  //       setQuickOrders(formattedOrderGuides);
  //     } catch (error) {
  //       console.error("Failed to load Order Guides:", error);
  //     }
  //   }

  //   loadOrderGuides();
  // }, [setQuickOrders]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const activeOrder = useMemo(
    () => quickOrders.find((order) => order.id === activeOrderId) ?? null,
    [activeOrderId, quickOrders],
  );

  function closeDialog() {
    setDialog(null);
    setDraftName("");
    setNameDialogError(null);
    setParDraft("");
  }

  function openAddGroup(order) {
    setDialog({ type: "add-group", order });
    setDraftName("");
    setNameDialogError(null);
  }

  function openRenameOrder(order) {
    setDialog({ type: "rename-order", order });
    setDraftName(order.name);
    setNameDialogError(null);
  }

  function openRenameGroup(order, group) {
    setDialog({ type: "rename-group", order, group });
    setDraftName(group.name);
    setNameDialogError(null);
  }

  function openEditGroupPar(order, group) {
    setDialog({ type: "edit-group-par", order, group });
    setParDraft(
      group.par == null
        ? String(group.products[0]?.par ?? "")
        : String(group.par),
    );
  }


  
//Secondary Group ADD GROUP POST
const createOrderGuideGroupApiv1_POST = async ({
 orderGuideID,
  name,
  createdBY,
}) => {
  try {
    const url = `${process.env.NEXT_PUBLIC_NRL_API_URL}/orderguidegroups`;

    console.log("Create Order Guide Group URL:", url);

    const requestBody = {
      orderGuideID,
      name,
      createdBY,
    };

    console.log("Create Order Guide Group Request Body:", requestBody);

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


//Secondary Group ADD GROUP DELETE
const deleteOrderGuideGroupApiv1_DEL = async (orderGuideGroupID) => {
  try {
    const url = `${process.env.NEXT_PUBLIC_NRL_API_URL}/orderguidegroups/${orderGuideGroupID}`;

    console.log("Delete Order Guide ID:", orderGuideGroupID);
    console.log("Delete Order Guide URL:", url);

    const response = await fetch(url, {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        Authorization: `${process.env.NEXT_PUBLIC_AUTH_TOKEN}`,
      },
    });

    console.log("Delete Order Guide HTTP Status:", response.status);
    console.log("Delete Order Guide HTTP OK:", response.ok);

    const responseText = await response.text();

    console.log("Delete Order Guide Raw Response:", responseText);

    let result = null;

    try {
      result = responseText ? JSON.parse(responseText) : null;
    } catch (error) {
      console.warn("Response is not JSON:", responseText);
    }

    console.log("Delete Order Guide Parsed Response:", result);

    if (!response.ok) {
      throw new Error(
        result?.Msg ||
          result?.message ||
          result?.error ||
          `Unable to delete order guide. HTTP ${response.status}`,
      );
    }

    if (!result?.success) {
      throw new Error(
        result?.Msg ||
          result?.message ||
          result?.error ||
          "Failed to delete order guide.",
      );
    }

    return result;
  } catch (error) {
    console.error("Delete Order Guide Error:", error);
    throw error;
  }
};


//Secondary Group_Rename
const updateOrderGuideGroupApiv1_Modify = async ({
  orderGuideGroupID,
  name,
  modifyBY,
}) => {
  try {
    const url = `${process.env.NEXT_PUBLIC_NRL_API_URL}/orderguidegroups/${orderGuideGroupID}`;

    const requestBody = {
      name,
      modifyBY,
    };

    console.log("Update Order Guide ID:", orderGuideGroupID);
    console.log("Update Order Guide URL:", url);
    console.log("Update Order Guide Request Body:", requestBody);

    const response = await fetch(url, {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `${process.env.NEXT_PUBLIC_AUTH_TOKEN}`,
      },
      body: JSON.stringify(requestBody),
    });

    console.log("Update Order Guide HTTP Status:", response.status);
    console.log("Update Order Guide HTTP OK:", response.ok);

    const responseText = await response.text();

    console.log("Update Order Guide Raw Response:", responseText);

    let result = null;

    try {
      result = responseText ? JSON.parse(responseText) : null;
    } catch (error) {
      console.warn("Response is not JSON:", responseText);
    }

    console.log("Update Order Guide Parsed Response:", result);

    if (!response.ok) {
      throw new Error(
        result?.Msg ||
          result?.message ||
          result?.error ||
          `Unable to update order guide. HTTP ${response.status}`,
      );
    }

    if (!result?.success) {
      throw new Error(
        result?.Msg ||
          result?.message ||
          result?.error ||
          "Failed to update order guide.",
      );
    }

    return result;
  } catch (error) {
    console.error("Update Order Guide Error:", error);
    throw error;
  }
};

async function saveGroupPar() {
  if (dialog?.type !== "edit-group-par") return;

  const value = parDraft.trim() === "" ? null : Number(parDraft);
  if (value !== null && (!Number.isFinite(value) || value < 0)) return;

  if (!userId) {
    setNameDialogError("Unable to identify the logged-in user.");
    return;
  }

  // Use the latest data, not the snapshot saved when the dialog opened
  const currentOrder =
    quickOrders.find((o) => o.id === dialog.order.id) ?? dialog.order;

  // "All" -> every group's items, otherwise only this group's items
  const targetGroups = dialog.group.isAll
    ? currentOrder.groups
    : currentOrder.groups.filter((g) => g.id === dialog.group.id);

  const items = targetGroups
    .flatMap((g) => g.products)
    .map((p) => ({
      orderGroupItemID: Number(p.orderGroupItemID),
      parValue: value,
    }));

  if (items.length === 0) {
    setNameDialogError("There are no products to update.");
    return;
  }

  setIsSavingName(true);
  setNameDialogError(null);

  try {
    const result = await updateBulkParPUT({
      items,
      modifyBY: Number.isNaN(Number(userId)) ? userId : Number(userId),
    });

    console.log("Bulk PAR updated:", result);

    // API succeeded -> update the UI
    setQuickOrders((orders) =>
      orders.map((order) =>
        order.id === dialog.order.id
          ? touchOrder({
              ...order,
              groups: order.groups.map((group) =>
                dialog.group.isAll || group.id === dialog.group.id
                  ? {
                      ...group,
                      par: value,
                      products: group.products.map((product) => ({
                        ...product,
                        par: value,
                      })),
                    }
                  : group,
              ),
            })
          : order,
      ),
    );
     toast.success("PAR value updated successfully");
    closeDialog();
  } catch (error) {
    console.error("Bulk PAR error:", error);
    setNameDialogError(error?.message || "Failed to update PAR.");
     toast.error(error?.message || "Failed to update PAR."); 
  } finally {
    setIsSavingName(false);
  }
}
  // function saveGroupPar() {
  //   if (dialog?.type !== "edit-group-par") return;

  //   const value = parDraft.trim() === "" ? null : Number(parDraft);
  //   if (value !== null && (!Number.isFinite(value) || value < 0)) return;

  //   setQuickOrders((orders) =>
  //     orders.map((order) =>
  //       order.id === dialog.order.id
  //         ? touchOrder({
  //             ...order,
  //             groups: order.groups.map((group) =>
  //               dialog.group.isAll || group.id === dialog.group.id
  //                 ? {
  //                     ...group,
  //                     par: value,
  //                     products: group.products.map((product) => ({
  //                       ...product,
  //                       par: value,
  //                     })),
  //                   }
  //                 : group,
  //             ),
  //           })
  //         : order,
  //     ),
  //   );
  //   closeDialog();
  // }

 async function saveNameDialog() {
    const name = draftName.trim();
    if (!name || !dialog) return;

    if (dialog.type === "add-group") {
      if (!userId) {
        setNameDialogError("Unable to identify the logged-in user.");
        return;
      }

      setIsSavingName(true);
      setNameDialogError(null);

      try {
        const response = await createOrderGuideGroupApiv1_POST({
          orderGuideID: dialog.order.id,
          name,
          createdBY: userId,
        });

        console.log("Create Order Guide Group Response:", response);

        const group = {
          id: String(
            response?.orderGuideGroupID ?? response?.id ?? crypto.randomUUID(),
          ),
          name,
          products: [],
        };

        setQuickOrders((orders) =>
          orders.map((order) =>
            order.id === dialog.order.id
              ? touchOrder({ ...order, groups: [...order.groups, group] })
              : order,
          ),
        );
        await loadOrderGuides();
        setExpandedOrderId(dialog.order.id);
        setSelectedGroupId(group.id);
        closeDialog();
      } catch (error) {
        console.error("Create Order Guide Group Error:", error);
        setNameDialogError(
          error?.message || "Failed to add group. Please try again.",
        );
      } finally {
        setIsSavingName(false);
      }

      return;
    }

    if (dialog.type === "rename-order") {
      if (!userId) {
        setNameDialogError("Unable to identify the logged-in user.");
        return;
      }

      setIsSavingName(true);
      setNameDialogError(null);

      try {
        const response = await modifyOrderGuideApiv1_Modify({
          orderGuideID: dialog.order.id,
          name,
          modifyBY: userId,
        });

        console.log("Modify Order Guide Response:", response);

        setQuickOrders((orders) =>
          orders.map((order) =>
            order.id === dialog.order.id
              ? touchOrder({ ...order, name })
              : order,
          ),
        );

        closeDialog();
      } catch (error) {
        console.error("Modify Order Guide Error:", error);
        setNameDialogError(
          error?.message || "Failed to rename order guide. Please try again.",
        );
      } finally {
        setIsSavingName(false);
      }

      return;
    }

    if (dialog.type === "rename-group") {
      if (!userId) {
        setNameDialogError("Unable to identify the logged-in user.");
        return;
      }

      setIsSavingName(true);
      setNameDialogError(null);

      try {
        const response = await updateOrderGuideGroupApiv1_Modify({
          orderGuideGroupID: dialog.group.id,
          name,
          modifyBY: userId,
        });

        console.log("Update Order Guide Group Response:", response);

        setQuickOrders((orders) =>
          orders.map((order) =>
            order.id === dialog.order.id
              ? touchOrder({
                  ...order,
                  groups: order.groups.map((group) =>
                    group.id === dialog.group.id ? { ...group, name } : group,
                  ),
                })
              : order,
          ),
        );
        closeDialog();
      } catch (error) {
        console.error("Update Order Guide Group Error:", error);
        setNameDialogError(
          error?.message || "Failed to rename group. Please try again.",
        );
      } finally {
        setIsSavingName(false);
      }

      return;
    }
  }

  async function confirmDelete() {
    if (!dialog) return;

    if (dialog.type === "delete-order") {
      await handleDelete(dialog.order.id);

      if (expandedOrderId === dialog.order.id) {
        setExpandedOrderId(null);
      }
      closeDialog();
      return;
    }

    if (dialog.type === "delete-group") {
      try {
        const response = await deleteOrderGuideGroupApiv1_DEL(dialog.group.id);

        console.log("Delete Order Guide Group Response:", response);

        const nextGroup =
          dialog.order.groups.find((group) => group.id !== dialog.group.id)
            ?.id ?? null;

        setQuickOrders((orders) =>
          orders.map((order) =>
            order.id === dialog.order.id
              ? touchOrder({
                  ...order,
                  groups: order.groups.filter(
                    (group) => group.id !== dialog.group.id,
                  ),
                })
              : order,
          ),
        );

        if (selectedGroupId === dialog.group.id) {
          setSelectedGroupId(nextGroup);
        }
        closeDialog();
      } catch (error) {
        console.error("Delete Order Guide Group Error:", error);
      }
    }
  }

  // function handleDragEnd(event) {
  //   if (!canEdit) return;

  //   const { active, over } = event;

  //   setActiveOrderId(null);

  //   if (!over || active.id === over.id) return;

  //   setQuickOrders((orders) => {
  //     const oldIndex = orders.findIndex((order) => order.id === active.id);
  //     const newIndex = orders.findIndex((order) => order.id === over.id);

  //     if (oldIndex === -1 || newIndex === -1) return orders;

  //     return arrayMove(orders, oldIndex, newIndex).map((order) =>
  //       order.id === active.id ? touchOrder(order) : order,
  //     );
  //   });
  // }
  function handleDragEnd(event) {
  if (!canEdit) return;

  const { active, over } = event;
  setActiveOrderId(null);

  if (!over || active.id === over.id) return;

  setQuickOrders((orders) => {
    const oldIndex = orders.findIndex((order) => order.id === active.id);
    const newIndex = orders.findIndex((order) => order.id === over.id);

    if (oldIndex === -1 || newIndex === -1) return orders;

    const reordered = arrayMove(orders, oldIndex, newIndex).map((order) =>
      order.id === active.id ? touchOrder(order) : order,
    );

    // Fire the API call with the new order, outside the state updater's purity concerns
    const custnmbr = localStorage.getItem("custnmbr");
    const orderGuideIds = reordered.map((order) => Number(order.id));

    dispatch(PutOrderGuideSequence({ custnmbr, orderGuideIds }))
      .unwrap()
      .then(() => {
        toast.success("Order items updated");
      })
      .catch((err) => {
        toast.error(err?.message || err || "Failed to save new order");
      });

    return reordered;
  });
}

  function handleDragCancel() {
    setActiveOrderId(null);
  }

  const isNameDialog =
    dialog?.type === "add-group" ||
    dialog?.type === "rename-order" ||
    dialog?.type === "rename-group";
  const isDeleteDialog =
    dialog?.type === "delete-order" || dialog?.type === "delete-group";

  return (
    <>
      <aside className="flex h-full min-h-0 flex-col overflow-hidden rounded-lg border bg-card/55 p-2 shadow-sm lg:p-2.5">
        <div className="mb-3 flex items-center justify-between gap-2">
          <h2 className="text-base font-semibold lg:text-lg">Order Guides</h2>

          {canCreate ? (
            <Button size="sm" className="h-8" onClick={onCreate}>
              <Plus className="size-4" />
              Create
            </Button>
          ) : null}
        </div>

        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={({ active }) => setActiveOrderId(active.id)}
          onDragEnd={handleDragEnd}
          onDragCancel={handleDragCancel}
        >
          <SortableContext
            items={quickOrders.map((order) => order.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="no-scrollbar flex-1 space-y-2 overflow-y-auto pr-1">
              {quickOrders.map((order, orderIndex) => {
                const isSelectedOrder = order.id === selectedOrderId;
                const isExpandedOrder =
                  order.id === expandedOrderId || isSelectedOrder;

                return (
                  <OrderGuideCard
                    key={order.id}
                    order={order}
                    orderIndex={orderIndex}
                    isSelectedOrder={isSelectedOrder}
                    isExpandedOrder={isExpandedOrder}
                    selectedGroupId={selectedGroupId}
                    canEdit={canEdit}
                    canDelete={canDelete}
                    onToggleExpand={async () => {
                      if (isExpandedOrder) {
                        setExpandedOrderId(null);
                        setSelectedOrderId(null);
                        setSelectedGroupId(null);
                        return;
                      }

                      setExpandedOrderId(order.id);
                      setSelectedOrderId(order.id);
                      setSelectedGroupId("all");

                      const groups = await getGroupsForOrderGuide(order);

                      setQuickOrders((orders) =>
                        orders.map((o) =>
                          o.id === order.id ? { ...o, groups } : o,
                        ),
                      );
                    }}
                    onSelectGroup={(orderId, groupId) => {
                      setExpandedOrderId(orderId);
                      setSelectedOrderId(orderId);
                      setSelectedGroupId(groupId);
                      loadItemsForGroup(orderId, groupId);
                    }}
                    onOpenRenameOrder={openRenameOrder}
                    onOpenRenameGroup={openRenameGroup}
                    onOpenEditGroupPar={openEditGroupPar}
                    onOpenDeleteOrder={(orderToDelete) =>
                      setDialog({ type: "delete-order", order: orderToDelete })
                    }
                    onOpenDeleteGroup={(orderToDelete, groupToDelete) =>
                      setDialog({
                        type: "delete-group",
                        order: orderToDelete,
                        group: groupToDelete,
                      })
                    }
                    onAddGroup={openAddGroup}
                  />
                );
              })}
            </div>
          </SortableContext>

          <DragOverlay>
            {activeOrder ? (
              <section className="rounded-lg border border-primary/80 bg-background/95 p-3 shadow-2xl">
                <div className="flex items-start gap-2">
                  <div className="mt-1 grid size-7 shrink-0 place-items-center rounded-md text-primary">
                    <GripVertical className="size-4" />
                  </div>

                  <div className="flex min-w-0 flex-1 items-start justify-between gap-3 rounded-md text-left">
                    <div className="min-w-0 space-y-1">
                      <div className="flex min-w-0 items-center gap-2">
                        <h3 className="truncate text-sm font-semibold">
                          {activeOrder.name}
                        </h3>
                      </div>
                      <p className="truncate text-xs text-muted-foreground">
                        {countOrderProducts(activeOrder)} items -{" "}
                        {formatUpdatedAt(activeOrder.updatedAt)}
                      </p>
                    </div>
                  </div>
                </div>
              </section>
            ) : null}
          </DragOverlay>
        </DndContext>
      </aside>

      <Dialog
        open={isNameDialog}
        onOpenChange={(open) => !open && !isSavingName && closeDialog()}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {dialog?.type === "add-group"
                ? "Add Group"
                : dialog?.type === "rename-order"
                  ? "Rename Order Guide"
                  : "Rename Group"}
            </DialogTitle>
            <DialogDescription>
              Enter the name you want to use.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-2 py-2">
            <Label htmlFor="quickOrderDialogName">Name</Label>
            <Input
              id="quickOrderDialogName"
              value={draftName}
              onChange={(event) => setDraftName(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") saveNameDialog();
              }}
              //disabled={isSavingName}
            />
            {nameDialogError ? (
              <p className="text-xs text-destructive">{nameDialogError}</p>
            ) : null}
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={closeDialog}
              //disabled={isSavingName}
            >
              {t("cancel")}
            </Button>
            {/*<Button onClick={saveNameDialog} disabled={isSavingName}>
              {isSavingName ? "Saving..." : t("save")}
            </Button> */}
            <Button onClick={saveNameDialog}>{t("save")}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={dialog?.type === "edit-group-par"}
        onOpenChange={(open) => !open && closeDialog()}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{t("editPar")}</DialogTitle>
            <DialogDescription>
              This PAR value will be applied to every product in{" "}
              {dialog?.group?.isAll ? "all groups" : dialog?.group?.name}.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-2 py-2">
            <Label htmlFor="groupParValue">{t("parValue")}</Label>
            <Input
              id="groupParValue"
              type="number"
              min="0"
              value={parDraft}
              onChange={(event) => setParDraft(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") saveGroupPar();
              }}
            />
            {nameDialogError ? (
              <p className="text-xs text-destructive">{nameDialogError}</p>
            ) : null}
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={closeDialog}
              disabled={isSavingName}
            >
              {t("cancel")}
            </Button>
            <Button onClick={saveGroupPar}>{t("save")}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={dialog?.type === "edit-group-par"}
        onOpenChange={(open) => !open && closeDialog()}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{t("editPar")}</DialogTitle>
            <DialogDescription>
              This PAR value will be applied to every product in{" "}
              {dialog?.group?.isAll ? "all groups" : dialog?.group?.name}.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-2 py-2">
            <Label htmlFor="groupParValue">{t("parValue")}</Label>
            <Input
              id="groupParValue"
              type="number"
              min="0"
              value={parDraft}
              onChange={(event) => setParDraft(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") saveGroupPar();
              }}
            />
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={closeDialog}>
              {t("cancel")}
            </Button>
            <Button onClick={saveGroupPar} disabled={isSavingName}>{t("save")}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={isDeleteDialog}
        onOpenChange={(open) => !open && closeDialog()}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {dialog?.type === "delete-order"
                ? t("deleteOrderGuide")
                : t("deleteGroup")}
            </DialogTitle>
            <DialogDescription>
              This action removes the selected item from your saved order
              guides.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <Button variant="outline" onClick={closeDialog}>
              {t("cancel")}
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              {t("delete")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
