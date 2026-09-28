// "use client";

// import { useState } from "react";
// import { DndContext, DragOverlay, KeyboardSensor, PointerSensor, closestCenter, useSensor, useSensors } from "@dnd-kit/core";
// import { SortableContext, arrayMove, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable } from "@dnd-kit/sortable";
// import { CSS } from "@dnd-kit/utilities";
// import Link from "next/link";
// import { toast } from "sonner";
// import {
//   ArrowUpToLine,
//   ArrowDownToLine,
//   Copy,
//   Folder,
//   GripVertical,
//   ChevronLeft,
//   ChevronDown,
//   LayoutGrid,
//   List,
//   MoveRight,
//   MoreVertical,
//   Package2,
//   Plus,
//   Search,
//   ShoppingBasket,
//   ShoppingCart,
//   Trash2,
// } from "lucide-react";

// import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuRadioGroup,
//   DropdownMenuRadioItem,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import { Input } from "@/components/ui/input";
// import { useCart, useQuickOrders } from "@/app/context/app-context";
// import { getCategoryPlaceholderImage } from "@/lib/category-placeholder-images";
// import { resolveItemImageUrl } from "@/lib/api/itemsApi";
// import { cn } from "@/lib/utils";
// import { useIsMobile } from "@/hooks/use-mobile";

// function formatPrice(price, unit) {
//   return `$${Number(price).toFixed(2)} / ${unit}`;
// }

// function touchOrder(order) {
//   return {
//     ...order,
//     updatedAt: new Date().toISOString(),
//   };
// }

// function ProductImage({ product, listLayout }) {
//   const resolvedImg = resolveItemImageUrl(product.image) || product.image;
//   const categoryFallback = getCategoryPlaceholderImage(product.category);
//   const initialImage = resolvedImg || categoryFallback;

//   const [imgSrc, setImgSrc] = useState(initialImage);
//   const [prevInitial, setPrevInitial] = useState(initialImage);

//   if (prevInitial !== initialImage) {
//     setPrevInitial(initialImage);
//     setImgSrc(initialImage);
//   }

//   return (
//     <div
//       className={cn(
//         "relative overflow-hidden bg-muted",
//         listLayout
//           ? "size-full"
//           : "aspect-[1.15] sm:aspect-[1.2] xl:aspect-[1.28]",
//       )}
//     >
//       <div className="absolute inset-0 grid place-items-center bg-[linear-gradient(135deg,var(--muted),var(--background))] text-primary/70">
//         <Package2 className="size-8 sm:size-10" />
//       </div>
//       {/* eslint-disable-next-line @next/next/no-img-element */}
//       <img
//         src={imgSrc}
//         alt={product.name}
//         className="absolute inset-0 size-full object-cover"
//         onError={() => {
//           if (imgSrc !== categoryFallback) {
//             setImgSrc(categoryFallback);
//           }
//         }}
//       />
//     </div>
//   );
// }

// function EmptyProductsCard({ canAddProducts }) {
//   return (
//     <div className="flex min-h-[320px] items-center justify-center">
//       <div className="flex flex-col items-center justify-center px-4 py-10 text-center">
//         <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-muted">
//           <ShoppingBasket className="size-8 text-muted-foreground" />
//         </div>

//         <h3 className="text-lg font-semibold">No products yet</h3>

//         <p className="mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
//           Add products from the catalog to build this order guide group.
//         </p>

//         {canAddProducts ? (
//           <Button asChild className="mt-5 h-9">
//             <Link href="/catalog">
//               <Plus className="size-4" />
//               Add Products
//             </Link>
//           </Button>
//         ) : null}
//       </div>
//     </div>
//   );
// }

// function SavedProductCard({
//   product,
//   layout,
//   selected,
//   onSelect,
//   cartQuantity,
//   onAddToCart,
//   onIncrement,
//   onDecrement,
//   onChangeGroup,
//   onEditPar,
//   onRequestDelete,
//   canEdit,
//   canPlaceOrder,
// }) {
//   const [draftQuantity, setDraftQuantity] = useState(1);
//   const isInCart = cartQuantity > 0;
//   const quantity = isInCart ? cartQuantity : draftQuantity;
//   const parValue = product.par;
//   const listLayout = layout === "list";
//   const { setNodeRef, setActivatorNodeRef, attributes, listeners, transform, transition, isDragging } = useSortable({
//     id: product.id,
//     disabled: !canEdit || !listLayout,
//   });
//   const categoryLabel = product.category || product.subcategory;
//   const orderControls = canPlaceOrder ? (
//     <div className="grid w-full grid-cols-[1fr_2fr] gap-2">
//       <div className="grid h-8 grid-cols-3 overflow-hidden rounded-md border bg-background">
//         <Button
//           variant="ghost"
//           size="icon-sm"
//           aria-label={`Decrease ${product.name} quantity`}
//           className="h-full w-full min-w-0 rounded-none"
//           onClick={() => {
//             if (isInCart) {
//               onDecrement(product.id);
//               return;
//             }

//             setDraftQuantity((current) => Math.max(1, current - 1));
//           }}
//         >
//           <span className="grid size-full place-items-center">-</span>
//         </Button>

//         <Input
//           value={quantity}
//           readOnly
//           aria-label={`${product.name} quantity`}
//           className="h-full rounded-none border-0 px-0 text-center text-xs font-normal shadow-none focus-visible:ring-0"
//         />

//         <Button
//           variant="ghost"
//           size="icon-sm"
//           aria-label={`Increase ${product.name} quantity`}
//           className="h-full w-full min-w-0 rounded-none"
//           onClick={() => {
//             if (isInCart) {
//               onIncrement(product.id);
//               return;
//             }

//             setDraftQuantity((current) => current + 1);
//           }}
//         >
//           <span className="grid size-full place-items-center">+</span>
//         </Button>
//       </div>

//       <Button
//         variant={isInCart ? "secondary" : "default"}
//         className="h-8 min-w-0 rounded-md px-2 text-[0.65rem] font-bold lg:text-xs"
//         onClick={() => {
//           if (!isInCart) {
//             onAddToCart(product, draftQuantity);
//           }
//         }}
//       >
//         <ShoppingCart />
//         <span className="truncate">
//           {isInCart ? "Added" : "Add to Cart"}
//         </span>
//       </Button>
//     </div>
//   ) : null;

//   return (
//     <article
//       ref={setNodeRef}
//       style={{ transform: CSS.Transform.toString(transform), transition }}
//       className={cn(
//         "relative min-w-0 overflow-hidden rounded-lg border bg-card text-card-foreground",
//         listLayout && "flex items-start gap-2 p-2.5 sm:gap-3",
//         listLayout && canEdit && "pr-11",
//         isDragging && "opacity-40",
//         listLayout && selected && "border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950/40",
//       )}
//     >
//       {(canEdit || canPlaceOrder) && (
//         <div className={cn(
//           "flex shrink-0 flex-col items-center",
//           listLayout ? "w-6 self-stretch justify-between gap-3 py-1" : "absolute left-2 top-2 z-10",
//         )}>
//           <input
//             type="checkbox"
//             checked={selected}
//             onChange={onSelect}
//             aria-label={`Select ${product.name}`}
//             className="size-4 shrink-0 cursor-pointer accent-blue-600"
//           />
//         {listLayout && canEdit && (
//           <button
//             ref={setActivatorNodeRef}
//             type="button"
//             aria-label={`Drag ${product.name}`}
//             className="grid size-6 shrink-0 touch-none cursor-grab place-items-center rounded text-muted-foreground hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring active:cursor-grabbing"
//             {...attributes}
//             {...listeners}
//           >
//             <GripVertical className="size-4" />
//           </button>
//         )}
//         </div>
//       )}
//       {canEdit ? (
//         <DropdownMenu>
//           <DropdownMenuTrigger asChild>
//             <Button
//               variant="outline"
//               size="icon-sm"
//               aria-label={`${product.name} options`}
//               className={cn("absolute right-2 top-2 z-10 text-muted-foreground", listLayout ? "border-0 bg-transparent shadow-none" : "bg-background/95 shadow-sm")}
//             >
//               <MoreVertical />
//             </Button>
//           </DropdownMenuTrigger>
//           <DropdownMenuContent align="end" className="w-44">
//             <DropdownMenuItem onSelect={() => onChangeGroup(product)}>
//               <MoveRight className="size-4" />
//               Change Group
//             </DropdownMenuItem>
//             <DropdownMenuItem onSelect={() => onEditPar(product)}>
//               <Package2 className="size-4" />
//               Edit PAR
//             </DropdownMenuItem>
//             <DropdownMenuItem
//               variant="destructive"
//               onSelect={() => onRequestDelete(product)}
//             >
//               <Trash2 className="size-4" />
//               Delete
//             </DropdownMenuItem>
//           </DropdownMenuContent>
//         </DropdownMenu>
//       ) : null}
//       <div
//         className={cn(
//           "relative",
//           listLayout && "w-12 shrink-0",
//         )}
//       >
//         <Link
//           href={`/catalog/details/?id=${encodeURIComponent(product.id)}`}
//           aria-label={`View details for ${product.name}`}
//           className={cn(
//             "block overflow-hidden rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
//             listLayout ? "h-12" : "h-full",
//           )}
//         >
//           <ProductImage product={product} listLayout={listLayout} />
//         </Link>

//         {parValue != null && parValue !== "" && !listLayout ? (
//           <div className="absolute bottom-2 right-2 rounded-md bg-blue-500/90 px-2 py-1 text-xs font-semibold text-white shadow-sm">
//             PAR {parValue}
//           </div>
//         ) : null}

//         {parValue != null && parValue !== "" && listLayout ? (
//           <div className="mt-1 rounded-md bg-blue-500/90 px-1 py-0.5 text-center text-[0.6rem] font-semibold text-white shadow-sm">
//             PAR {parValue}
//           </div>
//         ) : null}
//       </div>

//       <div
//         className={cn(
//           "relative space-y-1.5 p-2 lg:space-y-2 ",
//           listLayout && "grid min-w-0 flex-1 grid-cols-1 gap-2 self-stretch space-y-0 p-0 sm:grid-cols-[minmax(0,1fr)_18rem] sm:items-center sm:gap-4",
//         )}
//       >
//         <div className={cn("min-w-0 space-y-1", listLayout && "flex-1")}>
//           <div className="min-w-0 sm:flex sm:items-center sm:gap-2">
//             <Link
//               href={`/catalog/details/?id=${encodeURIComponent(product.id)}`}
//               className="block min-w-0 truncate text-[0.72rem] font-bold outline-none hover:text-primary focus-visible:ring-2 focus-visible:ring-ring lg:text-sm"
//             >
//               {product.name}
//             </Link>
//             {listLayout && categoryLabel ? (
//               <Badge
//                 variant="secondary"
//                 className="hidden h-5 shrink-0 px-1.5 text-[0.6rem] font-semibold sm:inline-flex"
//               >
//                 <span className="truncate">{categoryLabel}</span>
//               </Badge>
//             ) : null}
//           </div>
//           {listLayout ? (
//             <>
//               {categoryLabel ? (
//                 <Badge
//                   variant="secondary"
//                   className="h-5 max-w-full px-1.5 text-[0.6rem] font-semibold sm:hidden"
//                 >
//                   <span className="truncate">{categoryLabel}</span>
//                 </Badge>
//               ) : null}
//               <p className="truncate text-[0.7rem] font-medium text-muted-foreground lg:text-xs">
//                 {product.sku ? `Item code: ${product.sku}` : "Item code: —"}
//                 <span className="px-1.5 text-border">|</span>
//                 Pack Size: 1 {product.unit}
//               </p>
//             </>
//           ) : (
//             <>
//               <div className="flex items-start justify-between gap-2 text-[0.64rem] font-semibold text-muted-foreground lg:text-xs">
//                 <p className="min-w-0 truncate leading-tight">
//                   {product.subcategory || product.category || product.sku}
//                 </p>
//               </div>
//               <div className="grid gap-0.5 text-[0.6rem] font-medium text-muted-foreground lg:text-[0.7rem]">
//                 <span className="truncate">Pack Size: 1 {product.unit}</span>
//               </div>
//             </>
//           )}

//           <p
//             className={cn(
//               "text-[0.95rem] font-bold lg:text-base",
//               listLayout && "text-sm lg:text-sm",
//             )}
//           >
//             {formatPrice(product.price, product.unit)}
//           </p>
//         </div>

//         {orderControls}
//       </div>
//     </article>
//   );
// }

// export function OrderGuideProductsList({
//   selectedOrder,
//   selectedGroup,
//   setQuickOrders,
//   onBack,
//   canEdit,
//   canAddProducts,
//   canPlaceOrder,
// }) {
//   const { items, addItem, incrementItem, decrementItem } =
//     useCart();
//   const { dashboardQuickOrderIds, setDashboardQuickOrderIds } =
//     useQuickOrders();
//   const [productToMove, setProductToMove] = useState(null);
//   const [duplicate, setDuplicate] = useState(false);
//   const [activeProductId, setActiveProductId] = useState(null);
//   const sensors = useSensors(
//     useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
//     useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
//   );
//   const [newGroupName, setNewGroupName] = useState(null);
//   const [selection, setSelection] = useState({ group: null, ids: [] });
//   const selectionKey = `${selectedOrder?.id}:${selectedGroup?.id}`;
//   const selectedIds = selection.group === selectionKey ? selection.ids : [];
//   const [productToDelete, setProductToDelete] = useState(null);
//   const [productToEditPar, setProductToEditPar] = useState(null);
//   const [parDraft, setParDraft] = useState("");
//   const [productSearch, setProductSearch] = useState("");
//   const [sortBy, setSortBy] = useState("custom");
//   const isMobile = useIsMobile();
//   const [preferredLayout, setLayout] = useState(null);
//   const layout = preferredLayout ?? (isMobile ? "list" : "card");

//   const allProducts = selectedGroup?.products ?? [];
//   const normalizedSearch = productSearch.trim().toLowerCase();
//   const filteredProducts = normalizedSearch
//     ? allProducts.filter((product) =>
//         [product.name, product.sku, product.category, product.subcategory].some(
//           (value) =>
//             String(value ?? "")
//               .toLowerCase()
//               .includes(normalizedSearch),
//         ),
//       )
//     : allProducts;
//   const [sortField, sortDirection] = sortBy.split("-");
//   const products = [...filteredProducts].sort((a, b) => {
//     if (sortBy === "custom") return 0;
//     const field = sortField === "code" ? "sku" : "name";
//     const comparison = String(a[field] ?? "").localeCompare(
//       String(b[field] ?? ""),
//       undefined,
//       {
//         numeric: true,
//         sensitivity: "base",
//       },
//     );
//     return sortDirection === "desc" ? -comparison : comparison;
//   });

//   const activeProduct = products.find((product) => product.id === activeProductId);
//   const cartQuantities = new Map(items.map((item) => [item.id, item.quantity]));

//   const selectedProducts = products.filter((product) => selectedIds.includes(product.id));
//   const selectedCount = selectedProducts.length;
//   const allSelected = products.length > 0 && selectedCount === products.length;
//   const isOnDashboard =
//     Boolean(selectedOrder) && dashboardQuickOrderIds.includes(selectedOrder.id);

//   function toggleDashboardQuickOrder() {
//     if (!selectedOrder) return;

//     if (isOnDashboard) {
//       setDashboardQuickOrderIds((ids) =>
//         ids.filter((id) => id !== selectedOrder.id),
//       );
//       toast.success("Removed from the Quick Order card.");
//       return;
//     }

//     if (dashboardQuickOrderIds.length >= 4) {
//       toast.error("You can show only 4 quick orders on the overview.");
//       return;
//     }

//     setDashboardQuickOrderIds((ids) => [...ids, selectedOrder.id]);
//     toast.success("Added to the Quick Order card.");
//   }

//   function reorderProducts(position, draggedId, targetId) {
//     const visibleIds = products.map((product) => product.id);
//     let reorderedIds;
//     if (draggedId != null) {
//       const from = visibleIds.indexOf(draggedId);
//       const to = visibleIds.indexOf(targetId);
//       if (from < 0 || to < 0) return;
//       reorderedIds = arrayMove(visibleIds, from, to);
//     } else {
//       const moving = visibleIds.filter((id) => selectedIds.includes(id));
//       const remaining = visibleIds.filter((id) => !selectedIds.includes(id));
//       reorderedIds = position === "top" ? [...moving, ...remaining] : [...remaining, ...moving];
//     }
//     // Keep filtered-out products in their existing positions.
//     let visibleIndex = 0;
//     const orderedIds = allProducts.map((product) =>
//       visibleIds.includes(product.id) ? reorderedIds[visibleIndex++] : product.id,
//     );
//     const ranks = new Map(orderedIds.map((id, index) => [id, index]));
//     setSortBy("custom");
//     setQuickOrders((orders) => orders.map((order) =>
//       order.id !== selectedOrder.id ? order : touchOrder({
//         ...order,
//         ...(selectedGroup.isAll ? { productOrderIds: orderedIds } : {}),
//         groups: order.groups.map((group) =>
//           !selectedGroup.isAll && group.id !== selectedGroup.id ? group : {
//             ...group,
//             products: [...group.products].sort((a, b) => ranks.get(a.id) - ranks.get(b.id)),
//           },
//         ),
//       }),
//     ));
//   }

//   function removeFromGroup(productId) {
//     if (!selectedOrder || !selectedGroup) return;

//     setQuickOrders((orders) =>
//       orders.map((order) =>
//         order.id === selectedOrder.id
//           ? touchOrder({
//               ...order,
//               groups: order.groups.map((group) =>
//                 selectedGroup.isAll || group.id === selectedGroup.id
//                   ? {
//                       ...group,
//                       products: group.products.filter(
//                         (product) => product.id !== productId,
//                       ),
//                     }
//                   : group,
//               ),
//             })
//           : order,
//       ),
//     );
//   }

//   function updateProductInGroup(productId, updates) {
//     if (!selectedOrder || !selectedGroup) return;

//     setQuickOrders((orders) =>
//       orders.map((order) =>
//         order.id === selectedOrder.id
//           ? touchOrder({
//               ...order,
//               groups: order.groups.map((group) =>
//                 selectedGroup.isAll || group.id === selectedGroup.id
//                   ? {
//                       ...group,
//                       products: group.products.map((product) =>
//                         product.id === productId
//                           ? {
//                               ...product,
//                               ...updates,
//                             }
//                           : product,
//                       ),
//                     }
//                   : group,
//               ),
//             })
//           : order,
//       ),
//     );
//   }

//   function moveProductToGroup(targetGroupId) {
//     if (!selectedOrder || !selectedGroup || !productToMove) return;
//     const movingIds = productToMove.map((product) => product.id);
//     setQuickOrders((orders) => orders.map((order) => order.id !== selectedOrder.id ? order : touchOrder({
//       ...order,
//       groups: order.groups.map((group) => {
//         if (group.id === targetGroupId) {
//           return { ...group, products: [...group.products, ...productToMove
//             .filter((product) => !group.products.some((existing) => existing.id === product.id))
//             .map((product) => ({ ...product, par: group.par ?? product.par ?? null }))] };
//         }
//         if (!duplicate && (selectedGroup.isAll || group.id === selectedGroup.id)) {
//           return { ...group, products: group.products.filter((product) => !movingIds.includes(product.id)) };
//         }
//         return group;
//       }),
//     })));
//     setProductToMove(null);
//     setSelection({ group: selectionKey, ids: [] });
//   }

//   function confirmDeleteProduct() {
//     if (!productToDelete) return;

//     removeFromGroup(productToDelete.id);
//     setProductToDelete(null);
//   }

//   function openEditParDialog(product) {
//     setProductToEditPar(product);
//     setParDraft(
//       product.par === null || product.par === undefined
//         ? ""
//         : String(product.par),
//     );
//   }

//   function saveProductPar() {
//     if (!productToEditPar) return;

//     const nextPar = parDraft.trim() === "" ? null : Number(parDraft);
//     if (nextPar !== null && (!Number.isFinite(nextPar) || nextPar < 0)) return;

//     updateProductInGroup(productToEditPar.id, {
//       par: nextPar,
//     });

//     setProductToEditPar(null);
//     setParDraft("");
//   }

//   if (!selectedOrder || !selectedGroup) {
//     return (
//       <section className="grid h-full min-h-[420px] place-items-center rounded-lg border bg-card">
//         <p className="text-sm text-muted-foreground">
//           Select or create a group to begin.
//         </p>
//       </section>
//     );
//   }

//   return (
//     <>
//       <section className="flex h-full min-h-0 w-full min-w-0 flex-col overflow-hidden rounded-lg border bg-card shadow-sm">
//         <div className="flex shrink-0 flex-col gap-2 p-2 sm:flex-row sm:items-start sm:justify-between lg:p-3">
//           <div className="flex min-w-0 gap-2 lg:gap-3">
//             <Button
//               variant="outline"
//               size="icon-sm"
//               className="mt-0.5 shrink-0 lg:hidden"
//               aria-label="Back to order guides"
//               onClick={onBack}
//             >
//               <ChevronLeft />
//             </Button>

//             <div className="min-w-0">
//               <div className="flex min-w-0 items-center gap-2 text-[0.7rem] font-semibold text-muted-foreground lg:text-xs">
//                 <span className="truncate">{selectedOrder.name}</span>
//                 <span>/</span>
//                 <span className="truncate text-foreground">
//                   {selectedGroup.name}
//                 </span>
//               </div>

//               <div className="mt-1 flex min-w-0 items-center gap-2">
//                 <h2 className="truncate text-lg font-bold lg:text-xl">
//                   {selectedGroup.name}
//                 </h2>
//                 <Badge variant="secondary" className="h-5 px-1.5 text-[10px]">
//                   {normalizedSearch
//                     ? `${products.length} of ${allProducts.length} items`
//                     : selectedGroup.isAll
//                       ? `${selectedOrder.groups.reduce((total, group) => total + group.products.length, 0)} items · ${allProducts.length} unique`
//                       : `${allProducts.length} items`}
//                 </Badge>
//               </div>
//             </div>
//           </div>

//           <div className="flex w-full min-w-0 flex-wrap items-center gap-2 [&>a]:flex-1 [&>button]:flex-1 sm:w-auto sm:self-center sm:[&>a]:flex-none sm:[&>button]:flex-none">
//             {canAddProducts ? (
//               <Button asChild variant="outline" size="sm" className="h-8">
//                 <Link href="/catalog">
//                   <Plus className="size-4" />
//                   Add Products
//                 </Link>
//               </Button>
//             ) : null}

//             {canAddProducts ? (
//               <Button
//                 type="button"
//                 variant={isOnDashboard ? "destructive" : "outline"}
//                 size="sm"
//                 className="h-8"
//                 onClick={toggleDashboardQuickOrder}
//               >
//                 {!isOnDashboard ? <Plus className="size-4" /> : null}
//                 {isOnDashboard
//                   ? "Remove from Quick Order"
//                   : "Add to Quick Order"}
//               </Button>
//             ) : null}
//           </div>
//         </div>

//         <div className="flex shrink-0 flex-wrap items-center gap-2 border-b px-2 pb-2 pt-0 lg:px-3 lg:pb-3">
//           <div className="relative min-w-0 basis-full sm:basis-auto sm:flex-1">
//             <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
//             <Input
//               value={productSearch}
//               onChange={(event) => setProductSearch(event.target.value)}
//               placeholder="Search products..."
//               aria-label="Search order guide products"
//               className="h-9 pl-9 text-sm"
//             />
//           </div>

//           <DropdownMenu>
//             <DropdownMenuTrigger asChild>
//               <Button variant="outline" className="h-9">
//                 Sort by <ChevronDown className="size-4" />
//               </Button>
//             </DropdownMenuTrigger>
//             <DropdownMenuContent align="end" className="w-48">
//               <DropdownMenuRadioGroup value={sortBy} onValueChange={setSortBy}>
//                 <DropdownMenuRadioItem value="custom">Custom order</DropdownMenuRadioItem>
//                 <DropdownMenuRadioItem value="name-asc">
//                   Item name A-Z
//                 </DropdownMenuRadioItem>
//                 <DropdownMenuRadioItem value="name-desc">
//                   Item name Z-A
//                 </DropdownMenuRadioItem>
//                 <DropdownMenuRadioItem value="code-asc">
//                   Item code A-Z
//                 </DropdownMenuRadioItem>
//                 <DropdownMenuRadioItem value="code-desc">
//                   Item code Z-A
//                 </DropdownMenuRadioItem>
//               </DropdownMenuRadioGroup>
//             </DropdownMenuContent>
//           </DropdownMenu>
//           <div
//             role="group"
//             aria-label="Product layout"
//             className="flex items-center rounded-lg border bg-muted/40 p-1"
//           >
//             <Button
//               variant={layout === "list" ? "secondary" : "ghost"}
//               size="icon-sm"
//               className={
//                 layout === "list" ? "shadow-sm" : "text-muted-foreground"
//               }
//               aria-label="List layout"
//               title="List layout"
//               aria-pressed={layout === "list"}
//               onClick={() => setLayout("list")}
//             >
//               <List className="size-4" />
//             </Button>
//             <span aria-hidden="true" className="mx-1 h-4 w-px bg-border" />
//             <Button
//               variant={layout === "card" ? "secondary" : "ghost"}
//               size="icon-sm"
//               className={
//                 layout === "card" ? "shadow-sm" : "text-muted-foreground"
//               }
//               aria-label="Card layout"
//               title="Card layout"
//               aria-pressed={layout === "card"}
//               onClick={() => setLayout("card")}
//             >
//               <LayoutGrid className="size-4" />
//             </Button>
//           </div>

//         </div>

//         {products.length > 0 && (canEdit || canPlaceOrder) && (
//           <div className="mx-2 flex flex-wrap items-center justify-between gap-2 rounded-lg bg-blue-50 p-2 lg:mx-3 dark:bg-blue-950/40 mt-2">
//             <label className="flex shrink-0 cursor-pointer items-center gap-2 text-[10px] font-medium sm:text-xs">
//               <input type="checkbox" checked={allSelected}
//                 ref={(node) => { if (node) node.indeterminate = selectedCount > 0 && !allSelected; }}
//                 onChange={() => setSelection({ group: selectionKey, ids: allSelected ? [] : products.map((product) => product.id) })}
//                 aria-label="Select all products" className="size-4 accent-blue-600" />
//               {selectedCount ? `${selectedCount} selected` : "Select all"}
//             </label>
//             <div className="ml-auto flex items-center gap-1.5 lg:flex-wrap lg:gap-2">
//             {canEdit  && (
//               <div className="hidden flex-wrap gap-2 lg:flex">
//                 <Button variant="outline" size="sm" disabled={!selectedCount} onClick={() => reorderProducts("top")}><ArrowUpToLine />Move to Top</Button>
//                 <Button variant="outline" size="sm" disabled={!selectedCount} onClick={() => reorderProducts("bottom")}><ArrowDownToLine />Move to Bottom</Button>
//                 <Button variant="outline" size="sm" disabled={!selectedCount} onClick={() => { setDuplicate(false); setProductToMove(selectedProducts); }}><Folder />Change Group</Button>
//                 <Button variant="outline" size="sm" disabled={!selectedCount} onClick={() => { setDuplicate(true); setNewGroupName(null); setProductToMove(selectedProducts); }}><Copy />Duplicate</Button>
//               </div>
//             )}
//             {canPlaceOrder && (
//               <Button size="sm" className="h-8 gap-1 px-2 text-[10px] sm:gap-2 sm:px-3 sm:text-xs" disabled={!selectedCount} onClick={() => {
//                 selectedProducts.forEach((product) => { if (!cartQuantities.get(product.id)) addItem(product, 1); });
//               }}><ShoppingCart /><span className="lg:hidden">Add to Cart</span><span className="hidden lg:inline">{selectedCount ? `Add ${selectedCount} to Cart` : "Add to Cart"}</span></Button>
//             )}
//             {canEdit && (
//               <DropdownMenu>
//                 <DropdownMenuTrigger asChild>
//                   <Button size="sm" className="h-8 gap-1 px-2 text-[10px] sm:text-xs lg:hidden" disabled={!selectedCount}>
//                     Actions <ChevronDown className="size-3" />
//                   </Button>
//                 </DropdownMenuTrigger>
//                 <DropdownMenuContent align="end" className="w-44 lg:hidden">
//                   <DropdownMenuItem onSelect={() => reorderProducts("top")}>
//                     <ArrowUpToLine />Move to Top
//                   </DropdownMenuItem>
//                   <DropdownMenuItem onSelect={() => reorderProducts("bottom")}>
//                     <ArrowDownToLine />Move to Bottom
//                   </DropdownMenuItem>
//                   <DropdownMenuItem onSelect={() => { setDuplicate(false); setProductToMove(selectedProducts); }}>
//                     <Folder />Change Group
//                   </DropdownMenuItem>
//                   <DropdownMenuItem onSelect={() => { setDuplicate(true); setNewGroupName(null); setProductToMove(selectedProducts); }}>
//                     <Copy />Duplicate
//                   </DropdownMenuItem>
//                 </DropdownMenuContent>
//               </DropdownMenu>
//             )}
//             </div>
//           </div>
//         )}

//         <div className="min-h-0 flex-1 p-2 lg:p-3">
//           {allProducts.length === 0 ? (
//             <EmptyProductsCard canAddProducts={canAddProducts} />
//           ) : products.length === 0 ? (
//             <div className="grid min-h-[240px] place-items-center text-sm text-muted-foreground">
//               No products match your search.
//             </div>
//           ) : (
//             <DndContext
//               sensors={sensors}
//               collisionDetection={closestCenter}
//               onDragStart={({ active }) => setActiveProductId(active.id)}
//               onDragCancel={() => setActiveProductId(null)}
//               onDragEnd={({ active, over }) => {
//                 setActiveProductId(null);
//                 if (canEdit && layout === "list" && over && active.id !== over.id) {
//                   reorderProducts(null, active.id, over.id);
//                 }
//               }}
//             >
//               <SortableContext items={products.map((product) => product.id)} strategy={verticalListSortingStrategy}>
//             <div className="no-scrollbar h-full overflow-y-auto">
//               <div
//                 className={cn(
//                   "grid gap-2 sm:gap-3",
//                   layout === "list"
//                     ? "grid-cols-1"
//                     : "grid-cols-1 min-[460px]:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4",
//                 )}
//               >
//                 {products.map((product) => (
//                   <SavedProductCard
//                     key={product.id}
//                     product={product}
//                     layout={layout}
//                     selected={selectedIds.includes(product.id)}
//                     onSelect={() => setSelection({ group: selectionKey, ids: selectedIds.includes(product.id) ? selectedIds.filter((id) => id !== product.id) : [...selectedIds, product.id] })}
//                     cartQuantity={cartQuantities.get(product.id) ?? 0}
//                     onAddToCart={addItem}
//                     onIncrement={incrementItem}
//                     onDecrement={decrementItem}
//                     onChangeGroup={(product) => { setDuplicate(false); setProductToMove([product]); }}
//                     onEditPar={openEditParDialog}
//                     onRequestDelete={setProductToDelete}
//                     canEdit={canEdit}
//                     canPlaceOrder={canPlaceOrder}
//                   />
//                 ))}
//               </div>
//             </div>
//               </SortableContext>
//               <DragOverlay>
//                 {activeProduct ? (
//                   <div className="flex items-center gap-3 rounded-lg border border-primary/80 bg-background/95 p-3 shadow-2xl">
//                     <GripVertical className="size-4 text-primary" />
//                     <div className="size-12 shrink-0 overflow-hidden rounded">
//                       <ProductImage product={activeProduct} listLayout />
//                     </div>
//                     <div className="min-w-0">
//                       <p className="truncate text-sm font-semibold">{activeProduct.name}</p>
//                       <p className="text-sm text-muted-foreground">{formatPrice(activeProduct.price, activeProduct.unit)}</p>
//                     </div>
//                   </div>
//                 ) : null}
//               </DragOverlay>
//             </DndContext>
//           )}
//         </div>
//       </section>

//       <Dialog
//         open={Boolean(productToMove)}
//         onOpenChange={(open) => !open && setProductToMove(null)}
//       >
//         <DialogContent className="sm:max-w-md">
//           <DialogHeader>
//             <DialogTitle>{duplicate ? "Duplicate to Group" : "Change Group"}</DialogTitle>
//             <DialogDescription>
//               {duplicate ? "Copy" : "Move"} the selected products to another group in {selectedOrder.name}.
//             </DialogDescription>
//           </DialogHeader>

//           <div className="space-y-2 py-2">
//             {selectedOrder.groups.map((group) => (
//               <Button
//                 key={group.id}
//                 variant={
//                   group.id === selectedGroup.id ? "secondary" : "outline"
//                 }
//                 className="h-11 w-full justify-between"
//                 disabled={group.id === selectedGroup.id}
//                 onClick={() => moveProductToGroup(group.id)}
//               >
//                 <span className="truncate">{group.name}</span>
//                 <span className="rounded-full bg-background/70 px-2 py-0.5 text-xs">
//                   {group.products.length}
//                 </span>
//               </Button>
//             ))}
//           </div>
//           {duplicate && (
//             <div className="space-y-3 border-t pt-3">
//               <Button
//                 type="button"
//                 variant="outline"
//                 className="w-full justify-start"
//                 aria-expanded={newGroupName !== null}
//                 aria-controls="duplicate-create-group"
//                 onClick={() => setNewGroupName((name) => name ?? "")}
//               >
//                 <Plus className="size-4" />
//                 Create group
//               </Button>
//               {newGroupName !== null && (
//                 <form
//                   id="duplicate-create-group"
//                   className="space-y-2"
//                   onSubmit={(event) => {
//                     event.preventDefault();
//                     const name = newGroupName.trim();
//                     if (!name || !productToMove?.length) return;

//                     const group = {
//                       id: crypto.randomUUID(),
//                       name,
//                       products: productToMove.map((product) => ({ ...product })),
//                     };
//                     setQuickOrders((orders) =>
//                       orders.map((order) =>
//                         order.id === selectedOrder.id
//                           ? touchOrder({ ...order, groups: [...order.groups, group] })
//                           : order,
//                       ),
//                     );
//                     setProductToMove(null);
//                     setNewGroupName(null);
//                     setSelection({ group: selectionKey, ids: [] });
//                     toast.success(`Created "${name}" with the selected products.`);
//                   }}
//                 >
//                   <label htmlFor="duplicate-group-name" className="block text-sm font-medium">
//                     Group name
//                   </label>
//                   <Input
//                     id="duplicate-group-name"
//                     autoFocus
//                     value={newGroupName}
//                     onChange={(event) => setNewGroupName(event.target.value)}
//                     placeholder="Enter group name"
//                     required
//                   />
//                   <div className="flex justify-end pt-2">
//                     <Button type="submit" disabled={!newGroupName.trim()}>
//                       Create
//                     </Button>
//                   </div>
//                 </form>
//               )}
//             </div>
//           )}
//         </DialogContent>
//       </Dialog>

//       <Dialog
//         open={Boolean(productToDelete)}
//         onOpenChange={(open) => !open && setProductToDelete(null)}
//       >
//         <DialogContent className="sm:max-w-md">
//           <DialogHeader>
//             <DialogTitle>Delete Product</DialogTitle>
//             <DialogDescription>
//               Remove {productToDelete?.name} from {selectedGroup.name}?
//             </DialogDescription>
//           </DialogHeader>

//           <DialogFooter>
//             <Button variant="outline" onClick={() => setProductToDelete(null)}>
//               Cancel
//             </Button>
//             <Button variant="destructive" onClick={confirmDeleteProduct}>
//               Delete
//             </Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>

//       <Dialog
//         open={Boolean(productToEditPar)}
//         onOpenChange={(open) => {
//           if (!open) {
//             setProductToEditPar(null);
//             setParDraft("");
//           }
//         }}
//       >
//         <DialogContent className="sm:max-w-md">
//           <DialogHeader>
//             <DialogTitle>Edit PAR</DialogTitle>
//             <DialogDescription>
//               Update the PAR value for {productToEditPar?.name}.
//             </DialogDescription>
//           </DialogHeader>

//           <div className="space-y-2 py-2">
//             <Input
//               type="number"
//               min="0"
//               value={parDraft}
//               onChange={(event) => setParDraft(event.target.value)}
//               placeholder="Enter PAR"
//               aria-label="PAR value"
//             />
//           </div>

//           <DialogFooter>
//             <Button
//               variant="outline"
//               onClick={() => {
//                 setProductToEditPar(null);
//                 setParDraft("");
//               }}
//             >
//               Cancel
//             </Button>
//             <Button onClick={saveProductPar}>Save</Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>
//     </>
//   );
// }



//changed by Radhika 23/09/2026 --12:02 PM =================================================================================>
"use client";
import { useDispatch } from "react-redux";
import { PutItemSequence } from "../../redux/slices/postSlice"; 
import { useState } from "react";
import { DndContext, DragOverlay, KeyboardSensor, PointerSensor, closestCenter, useSensor, useSensors } from "@dnd-kit/core";
import { SortableContext, arrayMove, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import Link from "next/link";
import { toast } from "sonner";
import {
  ArrowUpToLine,
  ArrowDownToLine,
  Copy,
  Folder,
  GripVertical,
  ChevronLeft,
  ChevronDown,
  LayoutGrid,
  List,
  MoveRight,
  MoreVertical,
  Package2,
  Plus,
  Search,
  ShoppingBasket,
  ShoppingCart,
  Trash2,
} from "lucide-react";

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
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { useCart, useQuickOrders } from "@/app/context/app-context";
import { getCategoryPlaceholderImage } from "@/lib/category-placeholder-images";
import { resolveItemImageUrl } from "@/lib/api/itemsApi";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

function formatPrice(price, unit) {
  return `$${Number(price).toFixed(2)} / ${unit}`;
}

function touchOrder(order) {
  return {
    ...order,
    updatedAt: new Date().toISOString(),
  };
}


//PRIMARY & SECONDARY GROUP DELETE FUNCTION
const deleteOrderGroupItemApiv1_DEL = async (orderGroupItemID) => {
  try {
    const url = `${process.env.NEXT_PUBLIC_NRL_API_URL}/ordergroupitems/${orderGroupItemID}`;

    console.log("Delete Order Guide ID:", orderGroupItemID);
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


//SEONDARY-GROUP_PRODUCT_LIST_CHANGE GROUP

const changeGroupPUT = async ({
  itemIds,
  targetOrderGuideGroupID, // existing group
  newGroupName,            // OR create a new group
  modifyBY,
}) => {
  try {
    const url = `${process.env.NEXT_PUBLIC_NRL_API_URL}/orderguidegroups/move-items`;

    const requestBody = { itemIds, modifyBY };

    if (newGroupName) {
      requestBody.newGroupName = newGroupName;
    } else {
      requestBody.targetOrderGuideGroupID = targetOrderGuideGroupID;
    }

    console.log("Move Items URL:", url);
    console.log("Move Items Request Body:", requestBody);

    const response = await fetch(url, {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `${process.env.NEXT_PUBLIC_AUTH_TOKEN}`,
      },
      body: JSON.stringify(requestBody),
    });

    console.log("Move Items HTTP Status:", response.status);
    console.log("Move Items HTTP OK:", response.ok);

    const responseText = await response.text();

    console.log("Move Items Raw Response:", responseText);

    let result = null;

    try {
      result = responseText ? JSON.parse(responseText) : null;
    } catch (error) {
      console.warn("Response is not JSON:", responseText);
    }

    console.log("Move Items Parsed Response:", result);

    // Fail only on an HTTP error or an explicit success:false.
    // An empty body or a missing "success" field is treated as OK.
    if (!response.ok || result?.success === false) {
      throw new Error(
        result?.Msg ||
          result?.message ||
          result?.error ||
          `Unable to move items. HTTP ${response.status}`,
      );
    } // <-- this closing brace was missing

    return result;
  } catch (error) {
    console.error("Move Items Error:", error);
    throw error;
  }
};

//SECONDARY GROUP_PRODUCT LIST Move to top & Bottom
const moveTotop = async ({
  itemIds,
  position,
  modifyBY,
}) => {
  try {
    const url = `${process.env.NEXT_PUBLIC_NRL_API_URL}/orderguidegroups/move-items`;

    const requestBody = {
      itemIds,
      position,
      modifyBY,
    };

    console.log("Move to top Items URL:", url);
    console.log("Move to top Items Request Body:", requestBody);

    const response = await fetch(url, {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `${process.env.NEXT_PUBLIC_AUTH_TOKEN}`,
      },
      body: JSON.stringify(requestBody),
    });

    console.log("Move to top Items HTTP Status:", response.status);
    console.log("Move Items HTTP OK:", response.ok);

    const responseText = await response.text();

    console.log("Move to top Items Raw Response:", responseText);

    let result = null;

    try {
      result = responseText ? JSON.parse(responseText) : null;
    } catch (error) {
      console.warn("Response is not JSON:", responseText);
    }

    console.log("Move to top Items Parsed Response:", result);

    if (!response.ok) {
      throw new Error(
        result?.Msg ||
          result?.message ||
          result?.error ||
          `Unable to Move to top items. HTTP ${response.status}`,
      );
    }

    if (!result?.success) {
      throw new Error(
        result?.Msg ||
          result?.message ||
          result?.error ||
          "Failed to Move to top items.",
      );
    }

    return result;
  } catch (error) {
    console.error("Move to top Items Error:", error);
    throw error;
  }
};

//Secondary_group_Duplicate items
const itemsDuplicatePost = async ({
  itemIds,
  targetOrderGuideGroupID, // existing group
  newGroupName,            // OR new group
  createdBY,
}) => {
  try {
    const url = `${process.env.NEXT_PUBLIC_NRL_API_URL}/orderguidegroups/duplicate-items`;

    // Build the body for whichever scenario we're in
    const requestBody = { itemIds, createdBY };

    if (newGroupName) {
      requestBody.newGroupName = newGroupName;                     // create group
    } else {
      requestBody.targetOrderGuideGroupID = targetOrderGuideGroupID; // existing group
    }

    console.log("Duplicate Items URL:", url);
    console.log("Duplicate Items Request Body:", requestBody);

    const response = await fetch(url, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `${process.env.NEXT_PUBLIC_AUTH_TOKEN}`,
      },
      body: JSON.stringify(requestBody),
    });

    const responseText = await response.text();
    console.log("Duplicate Items Raw Response:", responseText);

    let result = null;
    try {
      result = responseText ? JSON.parse(responseText) : null;
    } catch (error) {
      console.warn("Response is not JSON:", responseText);
    }

    if (!response.ok) {
      throw new Error(
        result?.Msg ||
          result?.message ||
          result?.error ||
          `Unable to duplicate items. HTTP ${response.status}`,
      );
    }

    if (!result?.success) {
      throw new Error(
        result?.Msg || result?.message || "Failed to duplicate items.",
      );
    }

    return result; // { success: true, duplicatedCount: 1 }
  } catch (error) {
    console.error("Duplicate Items Error:", error);
    throw error;
  }
};


//SINGLE PAR VALUE UPDATE
//SECONDARY GROUP_PRODUCT LIST - UPDATE PAR (single item)
const updateParPUT = async ({ orderGroupItemID, parValue, modifyBY }) => {
  const url = `${process.env.NEXT_PUBLIC_NRL_API_URL}/ordergroupitems/par/${orderGroupItemID}`;
  const requestBody = { parValue, modifyBY };

  console.log("Update PAR URL:", url);
  console.log("Update PAR Request Body:", requestBody);

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
  console.log("Update PAR Raw Response:", responseText);

  let result = null;
  try {
    result = responseText ? JSON.parse(responseText) : null;
  } catch (error) {
    console.warn("Response is not JSON:", responseText);
  }

  if (!response.ok) {
    throw new Error(
      result?.Msg ||
        result?.message ||
        result?.error ||
        `Unable to update PAR. HTTP ${response.status}`,
    );
  }

  return result; // the updated item
};




function ProductImage({ product, listLayout }) {
  const resolvedImg = resolveItemImageUrl(product.image) || product.image;
  const categoryFallback = getCategoryPlaceholderImage(product.category);
  const initialImage = resolvedImg || categoryFallback;

  const [imgSrc, setImgSrc] = useState(initialImage);
  const [prevInitial, setPrevInitial] = useState(initialImage);

  if (prevInitial !== initialImage) {
    setPrevInitial(initialImage);
    setImgSrc(initialImage);
  }

  return (
    <div
      className={cn(
        "relative overflow-hidden bg-muted",
        listLayout
          ? "size-full"
          : "aspect-[1.15] sm:aspect-[1.2] xl:aspect-[1.28]",
      )}
    >
      <div className="absolute inset-0 grid place-items-center bg-[linear-gradient(135deg,var(--muted),var(--background))] text-primary/70">
        <Package2 className="size-8 sm:size-10" />
      </div>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={imgSrc}
        alt={product.name}
        className="absolute inset-0 size-full object-cover"
        onError={() => {
          if (imgSrc !== categoryFallback) {
            setImgSrc(categoryFallback);
          }
        }}
      />
    </div>
  );
}

function EmptyProductsCard({ canAddProducts }) {
  return (
    <div className="flex min-h-[320px] items-center justify-center">
      <div className="flex flex-col items-center justify-center px-4 py-10 text-center">
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-muted">
          <ShoppingBasket className="size-8 text-muted-foreground" />
        </div>

        <h3 className="text-lg font-semibold">No products yet</h3>

        <p className="mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
          Add products from the catalog to build this order guide group.
        </p>

        {canAddProducts ? (
          <Button asChild className="mt-5 h-9">
            <Link href="/catalog">
              <Plus className="size-4" />
              Add Products
            </Link>
          </Button>
        ) : null}
      </div>
    </div>
  );
}

function SavedProductCard({
  product,
  layout,
  selected,
  onSelect,
  cartQuantity,
  onAddToCart,
  onIncrement,
  onDecrement,
  onChangeGroup,
  onEditPar,
  onRequestDelete,
  canEdit,
  canPlaceOrder,
  isAllView,
}) {

  const [draftQuantity, setDraftQuantity] = useState(1);
  const isInCart = cartQuantity > 0;
  const quantity = isInCart ? cartQuantity : draftQuantity;
  const parValue = product.par;
  const listLayout = layout === "list";
  const canDrag = canEdit && listLayout && !isAllView;   // add this
  const { setNodeRef, setActivatorNodeRef, attributes, listeners, transform, transition, isDragging } = useSortable({
    id: product.id,
    // disabled: !canEdit || !listLayout,
     disabled: !canDrag,   // CHANGED from: !canEdit || !listLayout
  });

  const categoryLabel = product.category || product.subcategory;
  const orderControls = canPlaceOrder ? (
    <div className="grid w-full grid-cols-[1fr_2fr] gap-2">
      <div className="grid h-8 grid-cols-3 overflow-hidden rounded-md border bg-background">
        <Button
          variant="ghost"
          size="icon-sm"
          aria-label={`Decrease ${product.name} quantity`}
          className="h-full w-full min-w-0 rounded-none"
          onClick={() => {
            if (isInCart) {
              onDecrement(product.id);
              return;
            }

            setDraftQuantity((current) => Math.max(1, current - 1));
          }}
        >
          <span className="grid size-full place-items-center">-</span>
        </Button>

        <Input
          value={quantity}
          readOnly
          aria-label={`${product.name} quantity`}
          className="h-full rounded-none border-0 px-0 text-center text-xs font-normal shadow-none focus-visible:ring-0"
        />

        <Button
          variant="ghost"
          size="icon-sm"
          aria-label={`Increase ${product.name} quantity`}
          className="h-full w-full min-w-0 rounded-none"
          onClick={() => {
            if (isInCart) {
              onIncrement(product.id);
              return;
            }

            setDraftQuantity((current) => current + 1);
          }}
        >
          <span className="grid size-full place-items-center">+</span>
        </Button>
      </div>

      <Button
        variant={isInCart ? "secondary" : "default"}
        className="h-8 min-w-0 rounded-md px-2 text-[0.65rem] font-bold lg:text-xs"
        onClick={() => {
          if (!isInCart) {
            onAddToCart(product, draftQuantity);
          }
        }}
      >
        <ShoppingCart />
        <span className="truncate">
          {isInCart ? "Added" : "Add to Cart"}
        </span>
      </Button>
    </div>
  ) : null;



  return (
    <article
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={cn(
        "relative min-w-0 overflow-hidden rounded-lg border bg-card text-card-foreground",
        listLayout && "flex items-start gap-2 p-2.5 sm:gap-3",
        listLayout && canEdit && "pr-11",
        isDragging && "opacity-40",
        listLayout && selected && "border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950/40",
      )}
    >
      {(canEdit || canPlaceOrder) && (
        <div className={cn(
          "flex shrink-0 flex-col items-center",
          listLayout ? "w-6 self-stretch justify-between gap-3 py-1" : "absolute left-2 top-2 z-10",
        )}>
          <input
            type="checkbox"
            checked={selected}
            onChange={onSelect}
            aria-label={`Select ${product.name}`}
            className="size-4 shrink-0 cursor-pointer accent-blue-600"
          />
        {/* {listLayout && canEdit && ( */}
         {canDrag && (
          <button
            ref={setActivatorNodeRef}
            type="button"
            aria-label={`Drag ${product.name}`}
            className="grid size-6 shrink-0 touch-none cursor-grab place-items-center rounded text-muted-foreground hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring active:cursor-grabbing"
            {...attributes}
            {...listeners}
          >
            <GripVertical className="size-4" />
          </button>
        )}
        </div>
      )}
      {canEdit ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="icon-sm"
              aria-label={`${product.name} options`}
              className={cn("absolute right-2 top-2 z-10 text-muted-foreground", listLayout ? "border-0 bg-transparent shadow-none" : "bg-background/95 shadow-sm")}
            >
              <MoreVertical />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-44">
            <DropdownMenuItem onSelect={() => onChangeGroup(product)}>
              <MoveRight className="size-4" />
              Change Group
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => onEditPar(product)}>
              <Package2 className="size-4" />
              Edit PAR
            </DropdownMenuItem>
            <DropdownMenuItem
              variant="destructive"
              onSelect={() => onRequestDelete(product)}
            >
              <Trash2 className="size-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : null}
      <div
        className={cn(
          "relative",
          listLayout && "w-12 shrink-0",
        )}
      >
        <Link
          href={`/catalog/details/?id=${encodeURIComponent(product.id)}`}
          aria-label={`View details for ${product.name}`}
          className={cn(
            "block overflow-hidden rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
            listLayout ? "h-12" : "h-full",
          )}
        >
          <ProductImage product={product} listLayout={listLayout} />
        </Link>

        {parValue != null && parValue !== "" && !listLayout ? (
          <div className="absolute bottom-2 right-2 rounded-md bg-blue-500/90 px-2 py-1 text-xs font-semibold text-white shadow-sm">
            PAR {parValue}
          </div>
        ) : null}

        {parValue != null && parValue !== "" && listLayout ? (
          <div className="mt-1 rounded-md bg-blue-500/90 px-1 py-0.5 text-center text-[0.6rem] font-semibold text-white shadow-sm">
            PAR {parValue}
          </div>
        ) : null}
      </div>

      <div
        className={cn(
          "relative space-y-1.5 p-2 lg:space-y-2 ",
          listLayout && "grid min-w-0 flex-1 grid-cols-1 gap-2 self-stretch space-y-0 p-0 sm:grid-cols-[minmax(0,1fr)_18rem] sm:items-center sm:gap-4",
        )}
      >
        <div className={cn("min-w-0 space-y-1", listLayout && "flex-1")}>
          <div className="min-w-0 sm:flex sm:items-center sm:gap-2">
            <Link
              href={`/catalog/details/?id=${encodeURIComponent(product.id)}`}
              className="block min-w-0 truncate text-[0.72rem] font-bold outline-none hover:text-primary focus-visible:ring-2 focus-visible:ring-ring lg:text-sm"
            >
              {product.name}
            </Link>
            {listLayout && categoryLabel ? (
              <Badge
                variant="secondary"
                className="hidden h-5 shrink-0 px-1.5 text-[0.6rem] font-semibold sm:inline-flex"
              >
                <span className="truncate">{categoryLabel}</span>
              </Badge>
            ) : null}
          </div>
          {listLayout ? (
            <>
              {categoryLabel ? (
                <Badge
                  variant="secondary"
                  className="h-5 max-w-full px-1.5 text-[0.6rem] font-semibold sm:hidden"
                >
                  <span className="truncate">{categoryLabel}</span>
                </Badge>
              ) : null}
              <p className="truncate text-[0.7rem] font-medium text-muted-foreground lg:text-xs">
                {product.sku ? `Item code: ${product.sku}` : "Item code: —"}
                <span className="px-1.5 text-border">|</span>
                Pack Size: 1 {product.unit}
              </p>
            </>
          ) : (
            <>
              <div className="flex items-start justify-between gap-2 text-[0.64rem] font-semibold text-muted-foreground lg:text-xs">
                <p className="min-w-0 truncate leading-tight">
                  {product.subcategory || product.category || product.sku}
                </p>
              </div>
              <div className="grid gap-0.5 text-[0.6rem] font-medium text-muted-foreground lg:text-[0.7rem]">
                <span className="truncate">Pack Size: 1 {product.unit}</span>
              </div>
            </>
          )}

          <p
            className={cn(
              "text-[0.95rem] font-bold lg:text-base",
              listLayout && "text-sm lg:text-sm",
            )}
          >
            {formatPrice(product.price, product.unit)}
          </p>
        </div>

        {orderControls}
      </div>
    </article>
  );
}

export function OrderGuideProductsList({
  selectedOrder,
  selectedGroup,
  setQuickOrders,
  userId,                    // add this
  onRefresh,
  onBack,
  canEdit,
  canAddProducts,
  canPlaceOrder,
  
}) {

  const dispatch = useDispatch();
const [isReordering, setIsReordering] = useState(false);

  const { items, addItem, incrementItem, decrementItem } =
    useCart();
  const { dashboardQuickOrderIds, setDashboardQuickOrderIds } =
    useQuickOrders();
  const [productToMove, setProductToMove] = useState(null);
  const [duplicate, setDuplicate] = useState(false);
  const [activeProductId, setActiveProductId] = useState(null);
  const [isMoving, setIsMoving] = useState(false);   // add this
  const [isSavingPar, setIsSavingPar] = useState(false);
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );
  const [newGroupName, setNewGroupName] = useState(null);
  const [selection, setSelection] = useState({ group: null, ids: [] });
  const selectionKey = `${selectedOrder?.id}:${selectedGroup?.id}`;
  const selectedIds = selection.group === selectionKey ? selection.ids : [];
  const [productToDelete, setProductToDelete] = useState(null);
  const [productToEditPar, setProductToEditPar] = useState(null);
  const [parDraft, setParDraft] = useState("");
  const [productSearch, setProductSearch] = useState("");
  const [sortBy, setSortBy] = useState("custom");
  const isMobile = useIsMobile();
  const [preferredLayout, setLayout] = useState(null);
  const layout = preferredLayout ?? (isMobile ? "list" : "card");

  const allProducts = selectedGroup?.products ?? [];
  const isAllView = Boolean(selectedGroup?.isAll);
  const normalizedSearch = productSearch.trim().toLowerCase();
  const filteredProducts = normalizedSearch
    ? allProducts.filter((product) =>
        [product.name, product.sku, product.category, product.subcategory].some(
          (value) =>
            String(value ?? "")
              .toLowerCase()
              .includes(normalizedSearch),
        ),
      )
    : allProducts;
  const [sortField, sortDirection] = sortBy.split("-");
  const products = [...filteredProducts].sort((a, b) => {
    if (sortBy === "custom") return 0;
    const field = sortField === "code" ? "sku" : "name";
    const comparison = String(a[field] ?? "").localeCompare(
      String(b[field] ?? ""),
      undefined,
      {
        numeric: true,
        sensitivity: "base",
      },
    );
    return sortDirection === "desc" ? -comparison : comparison;
  });

  const activeProduct = products.find((product) => product.id === activeProductId);
  const cartQuantities = new Map(items.map((item) => [item.id, item.quantity]));

  const selectedProducts = products.filter((product) => selectedIds.includes(product.id));
  const selectedCount = selectedProducts.length;
  const allSelected = products.length > 0 && selectedCount === products.length;
  const isOnDashboard =
    Boolean(selectedOrder) && dashboardQuickOrderIds.includes(selectedOrder.id);

  function toggleDashboardQuickOrder() {
    if (!selectedOrder) return;

    if (isOnDashboard) {
      setDashboardQuickOrderIds((ids) =>
        ids.filter((id) => id !== selectedOrder.id),
      );
      toast.success("Removed from the Quick Order card.");
      return;
    }

    if (dashboardQuickOrderIds.length >= 4) {
      toast.error("You can show only 4 quick orders on the overview.");
      return;
    }

    setDashboardQuickOrderIds((ids) => [...ids, selectedOrder.id]);
    toast.success("Added to the Quick Order card.");
  }

  function reorderProducts(position, draggedId, targetId) {
    const visibleIds = products.map((product) => product.id);
    let reorderedIds;
    if (draggedId != null) {
      const from = visibleIds.indexOf(draggedId);
      const to = visibleIds.indexOf(targetId);
      if (from < 0 || to < 0) return;
      reorderedIds = arrayMove(visibleIds, from, to);
    } else {
      const moving = visibleIds.filter((id) => selectedIds.includes(id));
      const remaining = visibleIds.filter((id) => !selectedIds.includes(id));
      reorderedIds = position === "top" ? [...moving, ...remaining] : [...remaining, ...moving];
    }
    // Keep filtered-out products in their existing positions.
    let visibleIndex = 0;
    const orderedIds = allProducts.map((product) =>
      visibleIds.includes(product.id) ? reorderedIds[visibleIndex++] : product.id,
    );
    const ranks = new Map(orderedIds.map((id, index) => [id, index]));
    setSortBy("custom");
    setQuickOrders((orders) => orders.map((order) =>
      order.id !== selectedOrder.id ? order : touchOrder({
        ...order,
        ...(selectedGroup.isAll ? { productOrderIds: orderedIds } : {}),
        groups: order.groups.map((group) =>
          !selectedGroup.isAll && group.id !== selectedGroup.id ? group : {
            ...group,
            products: [...group.products].sort((a, b) => ranks.get(a.id) - ranks.get(b.id)),
          },
        ),
      }),
    ));
  }

  function removeFromGroup(productId) {
    if (!selectedOrder || !selectedGroup) return;

    setQuickOrders((orders) =>
      orders.map((order) =>
        order.id === selectedOrder.id
          ? touchOrder({
              ...order,
              groups: order.groups.map((group) =>
                selectedGroup.isAll || group.id === selectedGroup.id
                  ? {
                      ...group,
                      products: group.products.filter(
                        (product) => product.id !== productId,
                      ),
                    }
                  : group,
              ),
            })
          : order,
      ),
    );
  }

  function updateProductInGroup(productId, updates) {
    if (!selectedOrder || !selectedGroup) return;

    setQuickOrders((orders) =>
      orders.map((order) =>
        order.id === selectedOrder.id
          ? touchOrder({
              ...order,
              groups: order.groups.map((group) =>
                selectedGroup.isAll || group.id === selectedGroup.id
                  ? {
                      ...group,
                      products: group.products.map((product) =>
                        product.id === productId
                          ? {
                              ...product,
                              ...updates,
                            }
                          : product,
                      ),
                    }
                  : group,
              ),
            })
          : order,
      ),
    );
  }
//locally happens 
  // function moveProductToGroup(targetGroupId) {
  //   if (!selectedOrder || !selectedGroup || !productToMove) return;
  //   const movingIds = productToMove.map((product) => product.id);
  //   setQuickOrders((orders) => orders.map((order) => order.id !== selectedOrder.id ? order : touchOrder({
  //     ...order,
  //     groups: order.groups.map((group) => {
  //       if (group.id === targetGroupId) {
  //         return { ...group, products: [...group.products, ...productToMove
  //           .filter((product) => !group.products.some((existing) => existing.id === product.id))
  //           .map((product) => ({ ...product, par: group.par ?? product.par ?? null }))] };
  //       }
  //       if (!duplicate && (selectedGroup.isAll || group.id === selectedGroup.id)) {
  //         return { ...group, products: group.products.filter((product) => !movingIds.includes(product.id)) };
  //       }
  //       return group;
  //     }),
  //   })));
  //   setProductToMove(null);
  //   setSelection({ group: selectionKey, ids: [] });
  // }

//dynamic api calls Change Group
async function moveProductToGroup(targetGroupId) {
  if (!selectedOrder || !selectedGroup || !productToMove) return;

  const movingIds = productToMove.map((product) => product.id);
  // Duplicate -> POST duplicate-items with targetOrderGuideGroupID
  if (duplicate) {
    await handleDuplicate({ targetGroupId });
    return;
  }
  // Call the API only for "Change Group" (not "Duplicate")
  if (!duplicate) {
    if (!userId) {
      toast.error("Unable to identify the logged-in user.");
      return;
    }

    const modifyBY = Number.isNaN(Number(userId)) ? userId : Number(userId);

    try {
      setIsMoving(true);

      await changeGroupPUT({
        itemIds: productToMove.map((product) =>
          Number(product.orderGroupItemID),   // 91, not the SKU "500141"
        ),
        targetOrderGuideGroupID: Number(targetGroupId), // 113
        modifyBY,
      });
    } catch (error) {
      console.error("Move items failed:", error);
      toast.error(error?.message || "Failed to move items.");
      return;                                // keep dialog open, don't touch UI
    } finally {
      setIsMoving(false);
    }
  }

  // API succeeded (or it's a local duplicate) -> update UI
  setQuickOrders((orders) =>
    orders.map((order) =>
      order.id !== selectedOrder.id
        ? order
        : touchOrder({
            ...order,
            groups: order.groups.map((group) => {
              if (group.id === targetGroupId) {
                return {
                  ...group,
                  products: [
                    ...group.products,
                    ...productToMove
                      .filter(
                        (product) =>
                          !group.products.some((e) => e.id === product.id),
                      )
                      .map((product) => ({
                        ...product,
                        orderGuideGroupID: Number(targetGroupId),
                        par: group.par ?? product.par ?? null,
                      })),
                  ],
                };
              }

              if (
                !duplicate &&
                (selectedGroup.isAll || group.id === selectedGroup.id)
              ) {
                return {
                  ...group,
                  products: group.products.filter(
                    (product) => !movingIds.includes(product.id),
                  ),
                };
              }

              return group;
            }),
          }),
    ),
  );

  toast.success(duplicate ? "Products duplicated." : "Products moved.");
  setProductToMove(null);
  setSelection({ group: selectionKey, ids: [] });
}
//API FOR MOVE TO TOP & BOTTOM
async function handleMovePosition(position) {
  // position is "top" or "bottom" (lowercase, used by reorderProducts)
  if (!selectedCount || isMoving) return;

  if (!userId) {
    toast.error("Unable to identify the logged-in user.");
    return;
  }

  const modifyBY = Number.isNaN(Number(userId)) ? userId : Number(userId);

  try {
    setIsMoving(true);

    await moveTotop({
      itemIds: selectedProducts.map((product) =>
        Number(product.orderGroupItemID),
      ),
      position: position === "top" ? "Top" : "Bottom", // API needs "Top" / "Bottom"
      modifyBY,
    });
  } catch (error) {
    console.error("Move position failed:", error);
    toast.error(error?.message || "Failed to move items.");
    return; // don't touch the UI if the API failed
  } finally {
    setIsMoving(false);
  }

  // API succeeded -> update the UI with your existing local reorder
  reorderProducts(position);
  toast.success(position === "top" ? "Moved to top." : "Moved to bottom.");
}

//duplicate function
async function handleDuplicate({ targetGroupId, newGroupName }) {
  if (!productToMove?.length || isMoving) return;

  if (!userId) {
    toast.error("Unable to identify the logged-in user.");
    return;
  }

  const createdBY = Number.isNaN(Number(userId)) ? userId : Number(userId);

  try {
    setIsMoving(true);

    const result = await itemsDuplicatePost({
      itemIds: productToMove.map((p) => Number(p.orderGroupItemID)),
      targetOrderGuideGroupID: targetGroupId ? Number(targetGroupId) : undefined,
      newGroupName,
      createdBY,
    });

    if (result.duplicatedCount === 0) {
      toast.info("No items were duplicated (they may already exist there).");
    } else {
      toast.success(
        newGroupName
          ? `Created "${newGroupName}" with ${result.duplicatedCount} item(s).`
          : `${result.duplicatedCount} item(s) duplicated.`,
      );
    }

    // Reload from the API (see note below)
    onRefresh?.();

    setProductToMove(null);
    setNewGroupName(null);
    setSelection({ group: selectionKey, ids: [] });
  } catch (error) {
    console.error("Duplicate failed:", error);
    toast.error(error?.message || "Failed to duplicate items.");
  } finally {
    setIsMoving(false);
  }
}
//Changegroup-- create group
async function handleMoveToNewGroup(name) {
  if (!productToMove?.length || isMoving) return;

  if (!userId) {
    toast.error("Unable to identify the logged-in user.");
    return;
  }

  const modifyBY = Number.isNaN(Number(userId)) ? userId : Number(userId);

  try {
    setIsMoving(true);

    // { itemIds, newGroupName, modifyBY }
    await changeGroupPUT({
      itemIds: productToMove.map((p) => Number(p.orderGroupItemID)),
      newGroupName: name,
      modifyBY,
    });

    toast.success(`Moved to new group "${name}".`);
    onRefresh?.(); // reload so the new group and its real IDs appear

    setProductToMove(null);
    setNewGroupName(null);
    setSelection({ group: selectionKey, ids: [] });
  } catch (error) {
    console.error("Move to new group failed:", error);
    toast.error(error?.message || "Failed to create group and move items.");
  } finally {
    setIsMoving(false);
  }
}

  async function confirmDeleteProduct() {
    if (!productToDelete) return;

    try {
      const response = await deleteOrderGroupItemApiv1_DEL(
        productToDelete.orderGroupItemID,
      );

      console.log("Delete Order Group Item Response:", response);
    } catch (error) {
      console.error("Delete Order Group Item Error:", error);
    }

    removeFromGroup(productToDelete.id);
    setProductToDelete(null);
  }

  async function persistDragReorder(activeId, overId) {
  if (isAllView) {
    toast.error("Select a specific group to reorder items.");
    return;
  }
  if (!userId) {
    toast.error("Unable to identify the logged-in user.");
    return;
  }

  const visibleIds = products.map((product) => product.id);
  const from = visibleIds.indexOf(activeId);
  const to = visibleIds.indexOf(overId);
  if (from < 0 || to < 0) return;

  const reorderedVisible = arrayMove(visibleIds, from, to);

  let visibleIndex = 0;
  const orderedIds = allProducts.map((product) =>
    visibleIds.includes(product.id) ? reorderedVisible[visibleIndex++] : product.id,
  );

  const idToProduct = new Map(allProducts.map((product) => [product.id, product]));
  const orderGroupItemIds = orderedIds.map((id) =>
    Number(idToProduct.get(id)?.orderGroupItemID),
  );

  const modifyBY = Number.isNaN(Number(userId)) ? userId : Number(userId);
  const ranks = new Map(orderedIds.map((id, index) => [id, index]));

  // Apply the new order to the UI immediately so the drop feels instant,
  // and keep a snapshot to roll back to if the API call fails.
  let previousGroupProducts = null;
  setSortBy("custom");
  setQuickOrders((orders) =>
    orders.map((order) => {
      if (order.id !== selectedOrder.id) return order;
      return touchOrder({
        ...order,
        groups: order.groups.map((group) => {
          if (group.id !== selectedGroup.id) return group;
          previousGroupProducts = group.products;
          return {
            ...group,
            products: [...group.products].sort(
              (a, b) => ranks.get(a.id) - ranks.get(b.id),
            ),
          };
        }),
      });
    }),
  );

  setIsReordering(true);
  try {
    await dispatch(
      PutItemSequence({
        orderGuideGroupID: Number(selectedGroup.id),
        orderGroupItemIds,
        modifyBY,
      }),
    ).unwrap();

    toast.success("Order group items updated");
  } catch (error) {
    console.error("Reorder items failed:", error);
    toast.error(error?.Msg || error?.message || "Failed to save the new order.");

    // API failed -> roll back to the order before the drag
    if (previousGroupProducts) {
      setQuickOrders((orders) =>
        orders.map((order) =>
          order.id !== selectedOrder.id
            ? order
            : touchOrder({
                ...order,
                groups: order.groups.map((group) =>
                  group.id !== selectedGroup.id
                    ? group
                    : { ...group, products: previousGroupProducts },
                ),
              }),
        ),
      );
    }
  } finally {
    setIsReordering(false);
  }
}
// async function persistDragReorder(activeId, overId) {
//   if (isAllView) {
//     toast.error("Select a specific group to reorder items.");
//     return;
//   }
//   if (!userId) {
//     toast.error("Unable to identify the logged-in user.");
//     return;
//   }

//   const visibleIds = products.map((product) => product.id);
//   const from = visibleIds.indexOf(activeId);
//   const to = visibleIds.indexOf(overId);
//   if (from < 0 || to < 0) return;

//   const reorderedVisible = arrayMove(visibleIds, from, to);

//   // Keep filtered-out products in their existing positions, same as reorderProducts
//   let visibleIndex = 0;
//   const orderedIds = allProducts.map((product) =>
//     visibleIds.includes(product.id) ? reorderedVisible[visibleIndex++] : product.id,
//   );

//   const idToProduct = new Map(allProducts.map((product) => [product.id, product]));
//   const orderGroupItemIds = orderedIds.map((id) =>
//     Number(idToProduct.get(id)?.orderGroupItemID),
//   );

//   const modifyBY = Number.isNaN(Number(userId)) ? userId : Number(userId);

//   try {
//     setIsReordering(true);

//     await dispatch(
//       PutItemSequence({
//         orderGuideGroupID: Number(selectedGroup.id),
//         orderGroupItemIds,
//         modifyBY,
//       }),
//     )
//     .unwrap()
//       .then(() => {
//         toast.success("Order group items updated");
//       });
//   } catch (error) {
//     console.error("Reorder items failed:", error);
//     toast.error(error?.Msg || error?.message || "Failed to save the new order.");
//     return; // API failed — don't touch the UI, drag snaps back visually next render
//   } finally {
//     setIsReordering(false);
//   }

//   // API succeeded -> update the UI
//   const ranks = new Map(orderedIds.map((id, index) => [id, index]));
//   setSortBy("custom");
//   setQuickOrders((orders) =>
//     orders.map((order) =>
//       order.id !== selectedOrder.id
//         ? order
//         : touchOrder({
//             ...order,
//             groups: order.groups.map((group) =>
//               group.id !== selectedGroup.id
//                 ? group
//                 : {
//                     ...group,
//                     products: [...group.products].sort(
//                       (a, b) => ranks.get(a.id) - ranks.get(b.id),
//                     ),
//                   },
//             ),
//           }),
//     ),
//   );
// }


  function openEditParDialog(product) {
    setProductToEditPar(product);
    setParDraft(
      product.par === null || product.par === undefined
        ? ""
        : String(product.par),
    );
  }

  // function saveProductPar() {
  //   if (!productToEditPar) return;

  //   const nextPar = parDraft.trim() === "" ? null : Number(parDraft);
  //   if (nextPar !== null && (!Number.isFinite(nextPar) || nextPar < 0)) return;

  //   updateProductInGroup(productToEditPar.id, {
  //     par: nextPar,
  //   });

  //   setProductToEditPar(null);
  //   setParDraft("");
  // }

  async function saveProductPar() {
  if (!productToEditPar || isSavingPar) return;

  const nextPar = parDraft.trim() === "" ? null : Number(parDraft);
  if (nextPar !== null && (!Number.isFinite(nextPar) || nextPar < 0)) return;

  if (!userId) {
    toast.error("Unable to identify the logged-in user.");
    return;
  }

  try {
    setIsSavingPar(true);

    await updateParPUT({
      orderGroupItemID: Number(productToEditPar.orderGroupItemID),
      parValue: nextPar,
      modifyBY: Number.isNaN(Number(userId)) ? userId : Number(userId),
    });
  } catch (error) {
    console.error("Update PAR failed:", error);
    toast.error(error?.message || "Failed to update PAR.");
    return; // keep the dialog open, don't touch the UI
  } finally {
    setIsSavingPar(false);
  }

  // API succeeded -> update the UI
  updateProductInGroup(productToEditPar.id, { par: nextPar });
  toast.success("PAR updated.");
  setProductToEditPar(null);
  setParDraft("");
}
  if (!selectedOrder || !selectedGroup) {
    return (
      <section className="grid h-full min-h-[420px] place-items-center rounded-lg border bg-card">
        <p className="text-sm text-muted-foreground">
          Select or create a group to begin.
        </p>
      </section>
    );
  }

  return (
    <>
      <section className="flex h-full min-h-0 w-full min-w-0 flex-col overflow-hidden rounded-lg border bg-card shadow-sm">
        <div className="flex shrink-0 flex-col gap-2 p-2 sm:flex-row sm:items-start sm:justify-between lg:p-3">
          <div className="flex min-w-0 gap-2 lg:gap-3">
            <Button
              variant="outline"
              size="icon-sm"
              className="mt-0.5 shrink-0 lg:hidden"
              aria-label="Back to order guides"
              onClick={onBack}
            >
              <ChevronLeft />
            </Button>

            <div className="min-w-0">
              <div className="flex min-w-0 items-center gap-2 text-[0.7rem] font-semibold text-muted-foreground lg:text-xs">
                <span className="truncate">{selectedOrder.name}</span>
                <span>/</span>
                <span className="truncate text-foreground">
                  {selectedGroup.name}
                </span>
              </div>

              <div className="mt-1 flex min-w-0 items-center gap-2">
                <h2 className="truncate text-lg font-bold lg:text-xl">
                  {selectedGroup.name}
                </h2>
                <Badge variant="secondary" className="h-5 px-1.5 text-[10px]">
                  {normalizedSearch
                    ? `${products.length} of ${allProducts.length} items`
                    : selectedGroup.isAll
                      ? `${selectedOrder.groups.reduce((total, group) => total + group.products.length, 0)} items · ${allProducts.length} unique`
                      : `${allProducts.length} items`}
                </Badge>
              </div>
            </div>
          </div>

          <div className="flex w-full min-w-0 flex-wrap items-center gap-2 [&>a]:flex-1 [&>button]:flex-1 sm:w-auto sm:self-center sm:[&>a]:flex-none sm:[&>button]:flex-none">
            {canAddProducts ? (
              <Button asChild variant="outline" size="sm" className="h-8">
                <Link href="/catalog">
                  <Plus className="size-4" />
                  Add Products
                </Link>
              </Button>
            ) : null}

            {canAddProducts ? (
              <Button
                type="button"
                variant={isOnDashboard ? "destructive" : "outline"}
                size="sm"
                className="h-8"
                onClick={toggleDashboardQuickOrder}
              >
                {!isOnDashboard ? <Plus className="size-4" /> : null}
                {isOnDashboard
                  ? "Remove from Quick Order"
                  : "Add to Quick Order"}
              </Button>
            ) : null}
          </div>
        </div>

        <div className="flex shrink-0 flex-wrap items-center gap-2 border-b px-2 pb-2 pt-0 lg:px-3 lg:pb-3">
          <div className="relative min-w-0 basis-full sm:basis-auto sm:flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={productSearch}
              onChange={(event) => setProductSearch(event.target.value)}
              placeholder="Search products..."
              aria-label="Search order guide products"
              className="h-9 pl-9 text-sm"
            />
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="h-9">
                Sort by <ChevronDown className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuRadioGroup value={sortBy} onValueChange={setSortBy}>
                <DropdownMenuRadioItem value="custom">Custom order</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="name-asc">
                  Item name A-Z
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="name-desc">
                  Item name Z-A
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="code-asc">
                  Item code A-Z
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="code-desc">
                  Item code Z-A
                </DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
          <div
            role="group"
            aria-label="Product layout"
            className="flex items-center rounded-lg border bg-muted/40 p-1"
          >
            <Button
              variant={layout === "list" ? "secondary" : "ghost"}
              size="icon-sm"
              className={
                layout === "list" ? "shadow-sm" : "text-muted-foreground"
              }
              aria-label="List layout"
              title="List layout"
              aria-pressed={layout === "list"}
              onClick={() => setLayout("list")}
            >
              <List className="size-4" />
            </Button>
            <span aria-hidden="true" className="mx-1 h-4 w-px bg-border" />
            <Button
              variant={layout === "card" ? "secondary" : "ghost"}
              size="icon-sm"
              className={
                layout === "card" ? "shadow-sm" : "text-muted-foreground"
              }
              aria-label="Card layout"
              title="Card layout"
              aria-pressed={layout === "card"}
              onClick={() => setLayout("card")}
            >
              <LayoutGrid className="size-4" />
            </Button>
          </div>

        </div>

        {products.length > 0 && (canEdit || canPlaceOrder) && (
          <div className="mx-2 flex flex-wrap items-center justify-between gap-2 rounded-lg bg-blue-50 p-2 lg:mx-3 dark:bg-blue-950/40 mt-2">
            <label className="flex shrink-0 cursor-pointer items-center gap-2 text-[10px] font-medium sm:text-xs">
              <input type="checkbox" checked={allSelected}
                ref={(node) => { if (node) node.indeterminate = selectedCount > 0 && !allSelected; }}
                onChange={() => setSelection({ group: selectionKey, ids: allSelected ? [] : products.map((product) => product.id) })}
                aria-label="Select all products" className="size-4 accent-blue-600" />
              {selectedCount ? `${selectedCount} selected` : "Select all"}
            </label>
            <div className="ml-auto flex items-center gap-1.5 lg:flex-wrap lg:gap-2">
            {canEdit  && (
              <div className="hidden flex-wrap gap-2 lg:flex">
               {!isAllView && (
  <>
               <Button variant="outline" size="sm"
  disabled={!selectedCount || isMoving}
  title={isAllView ? "Select a group to reorder items" : undefined}
  onClick={() => handleMovePosition("top")}>
  <ArrowUpToLine />Move to Top
</Button>
<Button variant="outline" size="sm"
  disabled={!selectedCount || isMoving}
  title={isAllView ? "Select a group to reorder items" : undefined}
  onClick={() => handleMovePosition("bottom")}>
  <ArrowDownToLine />Move to Bottom
</Button>
  </>
)}
                {/* <Button variant="outline" size="sm" disabled={!selectedCount} onClick={() => reorderProducts("top")}><ArrowUpToLine />Move to Top</Button>
                <Button variant="outline" size="sm" disabled={!selectedCount} onClick={() => reorderProducts("bottom")}><ArrowDownToLine />Move to Bottom</Button> */}
                <Button variant="outline" size="sm" disabled={!selectedCount} onClick={() => { setDuplicate(false); setNewGroupName(null); setProductToMove(selectedProducts); }}><Folder />Change Group</Button>
                <Button variant="outline" size="sm" disabled={!selectedCount} onClick={() => { setDuplicate(true); setNewGroupName(null); setProductToMove(selectedProducts); }}><Copy />Duplicate</Button>
              </div>
            )}
            {canPlaceOrder && (
              <Button size="sm" className="h-8 gap-1 px-2 text-[10px] sm:gap-2 sm:px-3 sm:text-xs" disabled={!selectedCount} onClick={() => {
                selectedProducts.forEach((product) => { if (!cartQuantities.get(product.id)) addItem(product, 1); });
              }}><ShoppingCart /><span className="lg:hidden">Add to Cart</span><span className="hidden lg:inline">{selectedCount ? `Add ${selectedCount} to Cart` : "Add to Cart"}</span></Button>
            )}
            {canEdit && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button size="sm" className="h-8 gap-1 px-2 text-[10px] sm:text-xs lg:hidden" disabled={!selectedCount}>
                    Actions <ChevronDown className="size-3" />
                  </Button>
                </DropdownMenuTrigger>
  
                <DropdownMenuContent align="end" className="w-44 lg:hidden">
                                             {!isAllView && (
  <>
                    <DropdownMenuItem disabled={isMoving} onSelect={() => handleMovePosition("top")}>
                    <ArrowUpToLine />Move to Top
                  </DropdownMenuItem>
                  <DropdownMenuItem disabled={isMoving} onSelect={() => handleMovePosition("bottom")}>
                    <ArrowDownToLine />Move to Bottom
                  </DropdownMenuItem>
                    </>
)}
          {/* <DropdownMenuItem onSelect={() => reorderProducts("top")}>
                    <ArrowUpToLine />Move to Top
                  </DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => reorderProducts("bottom")}>
                    <ArrowDownToLine />Move to Bottom
                  </DropdownMenuItem> */}
                  <DropdownMenuItem onSelect={() => { setDuplicate(false); setNewGroupName(null); setProductToMove(selectedProducts); }}>
                    <Folder />Change Group
                  </DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => { setDuplicate(true); setNewGroupName(null); setProductToMove(selectedProducts); }}>
                    <Copy />Duplicate
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
            </div>
          </div>
        )}

        <div className="min-h-0 flex-1 p-2 lg:p-3">
          {allProducts.length === 0 ? (
            <EmptyProductsCard canAddProducts={canAddProducts} />
          ) : products.length === 0 ? (
            <div className="grid min-h-[240px] place-items-center text-sm text-muted-foreground">
              No products match your search.
            </div>
          ) : (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragStart={({ active }) => setActiveProductId(active.id)}
              // onDragCancel={() => setActiveProductId(null)}
              // onDragEnd={({ active, over }) => {
              //   setActiveProductId(null);
              //   if (canEdit && layout === "list" && over && active.id !== over.id) {
              //     reorderProducts(null, active.id, over.id);
              //   }
              // }}
                onDragCancel={() => {
    setActiveProductId(null);
    document.activeElement?.blur();
  }}
  onDragEnd={({ active, over }) => {
    setActiveProductId(null);
    document.activeElement?.blur();
    if (canEdit && layout === "list" && !isAllView && over && active.id !== over.id) {
      persistDragReorder(active.id, over.id);
    }
  }}
            >
              <SortableContext items={products.map((product) => product.id)} strategy={verticalListSortingStrategy}>
            <div className="no-scrollbar h-full overflow-y-auto">
              <div
                className={cn(
                  "grid gap-2 sm:gap-3",
                  layout === "list"
                    ? "grid-cols-1"
                    : "grid-cols-1 min-[460px]:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4",
                )}
              >
                {products.map((product) => (
                  <SavedProductCard
                    key={product.id}
                    product={product}
                    layout={layout}
                    selected={selectedIds.includes(product.id)}
                    onSelect={() => setSelection({ group: selectionKey, ids: selectedIds.includes(product.id) ? selectedIds.filter((id) => id !== product.id) : [...selectedIds, product.id] })}
                    cartQuantity={cartQuantities.get(product.id) ?? 0}
                    onAddToCart={addItem}
                    onIncrement={incrementItem}
                    onDecrement={decrementItem}
                    onChangeGroup={(product) => { setDuplicate(false); setNewGroupName(null); setProductToMove([product]); }}
                    onEditPar={openEditParDialog}
                    onRequestDelete={setProductToDelete}
                    canEdit={canEdit}
                    canPlaceOrder={canPlaceOrder}
                     isAllView={isAllView}
                  />
                ))}
              </div>
            </div>
              </SortableContext>
              <DragOverlay>
                {activeProduct ? (
                  <div className="flex items-center gap-3 rounded-lg border border-primary/80 bg-background/95 p-3 shadow-2xl">
                    <GripVertical className="size-4 text-primary" />
                    <div className="size-12 shrink-0 overflow-hidden rounded">
                      <ProductImage product={activeProduct} listLayout />
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold">{activeProduct.name}</p>
                      <p className="text-sm text-muted-foreground">{formatPrice(activeProduct.price, activeProduct.unit)}</p>
                    </div>
                  </div>
                ) : null}
              </DragOverlay>
            </DndContext>
          )}
        </div>
      </section>

      <Dialog
        open={Boolean(productToMove)}
        // onOpenChange={(open) => !open && setProductToMove(null)}
          onOpenChange={(open) => {
    if (!open) {
      setProductToMove(null);
      setNewGroupName(null); // reset the create form when closing
    }
  }}

      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{duplicate ? "Duplicate to Group" : "Change Group"}</DialogTitle>
            <DialogDescription>
              {duplicate ? "Copy" : "Move"} the selected products to another group in {selectedOrder.name}.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-2 py-2">
            {selectedOrder.groups.map((group) => (
              <Button
                key={group.id}
                variant={
                  group.id === selectedGroup.id ? "secondary" : "outline"
                }
                className="h-11 w-full justify-between"
                disabled={group.id === selectedGroup.id || isMoving}
                onClick={() => moveProductToGroup(group.id)}
              >
                <span className="truncate">{group.name}</span>
                <span className="rounded-full bg-background/70 px-2 py-0.5 text-xs">
                  {group.products.length}
                </span>
              </Button>
            ))}
          </div>
          {/* {duplicate && ( */}
            <div className="space-y-3 border-t pt-3">
              <Button
                type="button"
                variant="outline"
                className="w-full justify-start"
                aria-expanded={newGroupName !== null}
                aria-controls="duplicate-create-group"
                 disabled={isMoving}
                onClick={() => setNewGroupName((name) => name ?? "")}
              >
                <Plus className="size-4" />
                Create group
              </Button>
              {newGroupName !== null && (
   
                // <form
                //   id="duplicate-create-group"
                //   className="space-y-2"
                //   onSubmit={(event) => {
                //     event.preventDefault();
                //     const name = newGroupName.trim();
                //     if (!name || !productToMove?.length) return;

                //     const group = {
                //       id: crypto.randomUUID(),
                //       name,
                //       products: productToMove.map((product) => ({ ...product })),
                //     };
                //     setQuickOrders((orders) =>
                //       orders.map((order) =>
                //         order.id === selectedOrder.id
                //           ? touchOrder({ ...order, groups: [...order.groups, group] })
                //           : order,
                //       ),
                //     );
                //     setProductToMove(null);
                //     setNewGroupName(null);
                //     setSelection({ group: selectionKey, ids: [] });
                //     toast.success(`Created "${name}" with the selected products.`);
                //   }}
                // >
                              <form
                id="dialog-create-group"
                className="space-y-2"
                onSubmit={(event) => {
                  event.preventDefault();
                  const name = newGroupName.trim();
                  if (!name) return;

                  if (duplicate) {
                    handleDuplicate({ newGroupName: name });
                  } else {
                    handleMoveToNewGroup(name);
                  }
                }}
              >
                  <label htmlFor="duplicate-group-name" className="block text-sm font-medium">
                    Group name
                  </label>
                  <Input
                    id="duplicate-group-name"
                    autoFocus
                    value={newGroupName}
                    onChange={(event) => setNewGroupName(event.target.value)}
                    placeholder="Enter group name"
                    required
                  />
                  <div className="flex justify-end pt-2">
                    <Button type="submit" disabled={!newGroupName.trim() || isMoving}>
                      Create
                    </Button>
                  </div>
                </form>
              )}
            </div>
          {/* // )} */}
        </DialogContent>
      </Dialog>

      <Dialog
        open={Boolean(productToDelete)}
        onOpenChange={(open) => !open && setProductToDelete(null)}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Delete Product</DialogTitle>
            <DialogDescription>
              Remove {productToDelete?.name} from {selectedGroup.name}?
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <Button variant="outline" onClick={() => setProductToDelete(null)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDeleteProduct}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={Boolean(productToEditPar)}
        onOpenChange={(open) => {
          if (!open) {
            setProductToEditPar(null);
            setParDraft("");
          }
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit PAR</DialogTitle>
            <DialogDescription>
              Update the PAR value for {productToEditPar?.name}.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-2 py-2">
            <Input
              type="number"
              min="0"
              value={parDraft}
              onChange={(event) => setParDraft(event.target.value)}
              placeholder="Enter PAR"
              aria-label="PAR value"
            />
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setProductToEditPar(null);
                setParDraft("");
              }}
            >
              Cancel
            </Button>
            <Button onClick={saveProductPar} disabled={isSavingPar}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}