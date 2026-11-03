"use client";

import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Check, ChevronRight, Loader2, Search, Store as StoreIcon, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { GetUserStores } from "../redux/slices/getSlice";

// shape of one store returned by the location API
type Store = {
  locationID: number;
  areaID?: number;
  territoryID?: number;
  storeNo?: string | null;
  storeName: string;
  address1?: string | null;
  zip?: string | null;
  isActive?: boolean;
};

const SELECTED_LOCATION_KEY = "selectedLocation";

// the store response has no city, so show address + zip
function storeSubtitle(store: Store): string {
  return [store.address1, store.zip].filter(Boolean).join(", ");
}

export function LocationSwitcher() {
  // any: dispatching a thunk is not a plain action, so the default Dispatch type rejects it
  const dispatch = useDispatch<any>();
  const stores = useSelector((state: any) => state.getSlice.userStoresData) as Store[];
  const storesLoading = useSelector((state: any) => state.getSlice.userStoresLoading) as boolean;
  const storesStatus = useSelector((state: any) => state.getSlice.userStoresStatus) as string;
  const storesError = useSelector((state: any) => state.getSlice.userStoresError) as unknown;

  const [open, setOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null); // locationID of the active store
  const [draftId, setDraftId] = useState<number | null>(null); // highlighted in the dialog, not applied yet
  const [search, setSearch] = useState("");

  // logged-in user, saved by the login screen (read in an effect to avoid a hydration mismatch)
  const [account, setAccount] = useState({ name: "", email: "" });
  useEffect(() => {
    setAccount({
      name: localStorage.getItem("name") ?? "",
      email: localStorage.getItem("emailID") ?? "",
    });
  }, []);

  // load the user's stores once
  useEffect(() => {
    if (storesStatus === "idle") dispatch(GetUserStores());
  }, [dispatch, storesStatus]);

  // when the stores arrive: restore the saved choice, otherwise use the first store
  useEffect(() => {
    if (!stores.length || selectedId !== null) return;

    let savedId: number | null = null;
    try {
      savedId = JSON.parse(localStorage.getItem(SELECTED_LOCATION_KEY) || "null")?.locationID ?? null;
    } catch {
      savedId = null;
    }

    const initial = stores.find((s) => s.locationID === savedId) ?? stores[0];
    setSelectedId(initial.locationID);

    // save it too, so users who never open the dialog still have an active store
    localStorage.setItem(SELECTED_LOCATION_KEY, JSON.stringify(initial));
    window.dispatchEvent(new CustomEvent("crate-location-change", { detail: initial }));
  }, [stores, selectedId]);

  const selectedLocation = useMemo<Store | null>(
    () => stores.find((s) => s.locationID === selectedId) ?? null,
    [stores, selectedId],
  );

  const filteredLocations = useMemo<Store[]>(() => {
    const q = search.trim().toLowerCase();
    return stores.filter((s) =>
      `${s.storeName} ${s.address1 ?? ""} ${s.zip ?? ""} ${s.storeNo ?? ""}`
        .toLowerCase()
        .includes(q),
    );
  }, [stores, search]);

  function applyLocation() {
    const location = stores.find((s) => s.locationID === draftId);
    if (location) {
      setSelectedId(location.locationID);
      localStorage.setItem(SELECTED_LOCATION_KEY, JSON.stringify(location));
      // let other parts of the app react to the change
      window.dispatchEvent(new CustomEvent("crate-location-change", { detail: location }));
    }
    setOpen(false);
  }

  // the popup only makes sense when there is something to choose between (any role)
  const canSwitch = stores.length > 1;
  const isLoadingStores = storesLoading || storesStatus === "idle";

  // nothing matched this login -> fall back to the signed-in user's own details
  const noStores = !isLoadingStores && storesStatus !== "failed" && stores.length === 0;

  const displayLocation = selectedLocation ?? stores[0] ?? null;
  const triggerName = isLoadingStores
    ? "Loading stores..."
    : displayLocation
      ? displayLocation.storeName
      : storesStatus === "failed"
        ? "Unable to load locations"
        : account.name || "No locations available";
  const triggerSubtitle = displayLocation
    ? storeSubtitle(displayLocation)
    : noStores
      ? account.email
      : "";

  const cardClass =
    "h-auto gap-3 border border-orange-200 bg-gradient-to-r from-sky-100 via-background to-orange-100 px-3 py-3.5 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:gap-0 dark:border-orange-900 dark:from-sky-950 dark:to-orange-950";

  // card content, shared by the clickable and the read-only version.
  // While loading, no store or account details are shown.
  const cardContent = isLoadingStores ? (
    <span className="min-w-0 flex-1 truncate text-xs font-semibold text-muted-foreground group-data-[collapsible=icon]:hidden">
      Loading stores...
    </span>
  ) : (
    <>
      <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-sky-200 text-orange-500 group-data-[collapsible=icon]:size-4 group-data-[collapsible=icon]:bg-transparent dark:bg-sky-900">
        {noStores ? (
          <User className="size-5 group-data-[collapsible=icon]:size-4" />
        ) : (
          <StoreIcon className="size-5 group-data-[collapsible=icon]:size-4" />
        )}
      </span>
      <span className="grid min-w-0 flex-1 gap-0.5 text-left group-data-[collapsible=icon]:hidden">
        <span className="truncate text-xs font-semibold">{triggerName}</span>
        {triggerSubtitle && (
          <span className="truncate text-xs text-muted-foreground">{triggerSubtitle}</span>
        )}
      </span>
    </>
  );

  return (
    <Dialog
      open={open && canSwitch}
      onOpenChange={(nextOpen: boolean) => {
        if (nextOpen) {
          setDraftId(selectedId);
          setSearch("");
        }
        setOpen(nextOpen);
      }}
    >
      <SidebarMenu>
        <SidebarMenuItem>
          {canSwitch ? (
            // more than one store: the card opens the dialog (chevron arrow shown)
            <DialogTrigger asChild>
              <SidebarMenuButton
                size="lg"
                tooltip="Switch location"
                aria-label={`Switch location: ${triggerName}${triggerSubtitle ? `, ${triggerSubtitle}` : ""}`}
                className={cardClass}
              >
                {cardContent}
                <ChevronRight className="ml-auto size-4 text-primary group-data-[collapsible=icon]:hidden" />
              </SidebarMenuButton>
            </DialogTrigger>
          ) : (
            // zero or one store: just show it, nothing to open
            <SidebarMenuButton
              asChild
              size="lg"
              tooltip={triggerName}
              className={cn(cardClass, "cursor-default")}
            >
              <div role="group" aria-label={`Location: ${triggerName}${triggerSubtitle ? `, ${triggerSubtitle}` : ""}`}>
                {cardContent}
              </div>
            </SidebarMenuButton>
          )}
        </SidebarMenuItem>
      </SidebarMenu>

      <DialogContent className="gap-4 sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="pr-6 text-lg font-semibold">Switch location</DialogTitle>
          <DialogDescription>Select a store location to view and manage its data.</DialogDescription>
        </DialogHeader>
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => setSearch(event.target.value)}
            placeholder="Search locations..."
            aria-label="Search locations"
            className="pl-9"
          />
        </div>
        <div className="max-h-[45vh] space-y-2 overflow-y-auto p-0.5" role="group" aria-label="Store locations">
          {storesLoading && (
            <p className="flex items-center justify-center gap-2 py-6 text-sm text-muted-foreground">
              <Loader2 className="size-4 animate-spin" />
              Loading locations...
            </p>
          )}

          {storesStatus === "failed" && (
            <p role="alert" className="py-6 text-center text-sm text-destructive">
              {typeof storesError === "string" ? storesError : "Failed to load locations."}
            </p>
          )}

          {filteredLocations.map((location) => {
            const selected = draftId === location.locationID;
            return (
              <button
                key={location.locationID}
                type="button"
                aria-pressed={selected}
                onClick={() => setDraftId(location.locationID)}
                className={cn(
                  "flex w-full items-center gap-3 rounded-lg border p-3 text-left outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring",
                  selected
                    ? "border-orange-300 bg-gradient-to-r from-sky-50 via-background to-orange-50 dark:border-orange-800 dark:from-sky-950 dark:to-orange-950"
                    : "hover:bg-muted/50",
                )}
              >
                <span className={cn("grid size-9 shrink-0 place-items-center rounded-xl", selected ? "bg-sky-100 text-orange-500 dark:bg-sky-900" : "bg-muted text-muted-foreground")}>
                  <StoreIcon className="size-5" />
                </span>
                <span className="grid min-w-0 flex-1 gap-0.5">
                  <span className="truncate text-sm font-semibold">{location.storeName}</span>
                  <span className="truncate text-xs text-muted-foreground">{storeSubtitle(location)}</span>
                </span>
                {selected && <span className="grid size-5 shrink-0 place-items-center rounded-full bg-orange-500 text-white"><Check className="size-3.5" /></span>}
              </button>
            );
          })}

          {!storesLoading && stores.length > 0 && filteredLocations.length === 0 && (
            <p className="py-6 text-center text-sm text-muted-foreground">No locations found.</p>
          )}
        </div>
        <div className="flex justify-end gap-2 pt-1">
          <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
          <Button disabled={draftId === null} onClick={applyLocation}>Select Location</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}