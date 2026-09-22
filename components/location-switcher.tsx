"use client";

import { useState } from "react";
import { Check, ChevronRight, Search, Store } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

import locations from "@/data/locations.json";

export function LocationSwitcher() {
  const [open, setOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(locations[0]);
  const [draftId, setDraftId] = useState(selectedLocation.id);
  const [search, setSearch] = useState("");
  const filteredLocations = locations.filter((location) =>
    `${location.name} ${location.city}`.toLowerCase().includes(search.trim().toLowerCase()),
  );

  return (
    <Dialog open={open} onOpenChange={(nextOpen) => {
      if (nextOpen) {
        setDraftId(selectedLocation.id);
        setSearch("");
      }
      setOpen(nextOpen);
    }}>
      <SidebarMenu>
        <SidebarMenuItem>
          <DialogTrigger asChild>
            <SidebarMenuButton
              size="lg"
              tooltip="Switch location"
              aria-label={`Switch location: ${selectedLocation.name}, ${selectedLocation.city}`}
              className="h-auto gap-3 border border-orange-200 bg-gradient-to-r from-sky-100 via-background to-orange-100 px-3 py-3.5 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:gap-0 dark:border-orange-900 dark:from-sky-950 dark:to-orange-950"
            >
              <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-sky-200 text-orange-500 group-data-[collapsible=icon]:size-4 group-data-[collapsible=icon]:bg-transparent dark:bg-sky-900">
                <Store className="size-5 group-data-[collapsible=icon]:size-4" />
              </span>
              <span className="grid min-w-0 flex-1 gap-0.5 text-left group-data-[collapsible=icon]:hidden">
                <span className="truncate text-xs font-semibold">{selectedLocation.name}</span>
                <span className="truncate text-xs text-muted-foreground">{selectedLocation.city}</span>
              </span>
              <ChevronRight className="ml-auto size-4 text-primary group-data-[collapsible=icon]:hidden" />
            </SidebarMenuButton>
          </DialogTrigger>
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
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search locations..."
            aria-label="Search locations"
            className="pl-9"
          />
        </div>
        <div className="max-h-[45vh] space-y-2 overflow-y-auto p-0.5" role="group" aria-label="Store locations">
          {filteredLocations.map((location) => {
            const selected = draftId === location.id;
            return (
              <button
                key={location.id}
                type="button"
                aria-pressed={selected}
                onClick={() => setDraftId(location.id)}
                className={cn(
                  "flex w-full items-center gap-3 rounded-lg border p-3 text-left outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring",
                  selected
                    ? "border-orange-300 bg-gradient-to-r from-sky-50 via-background to-orange-50 dark:border-orange-800 dark:from-sky-950 dark:to-orange-950"
                    : "hover:bg-muted/50",
                )}
              >
                <span className={cn("grid size-9 shrink-0 place-items-center rounded-xl", selected ? "bg-sky-100 text-orange-500 dark:bg-sky-900" : "bg-muted text-muted-foreground")}>
                  <Store className="size-5" />
                </span>
                <span className="grid min-w-0 flex-1 gap-0.5">
                  <span className="truncate text-sm font-semibold">{location.name}</span>
                  <span className="text-xs text-muted-foreground">{location.city}</span>
                </span>
                {selected && <span className="grid size-5 shrink-0 place-items-center rounded-full bg-orange-500 text-white"><Check className="size-3.5" /></span>}
              </button>
            );
          })}
          {filteredLocations.length === 0 && <p className="py-6 text-center text-sm text-muted-foreground">No locations found.</p>}
        </div>
        <div className="flex justify-end gap-2 pt-1">
          <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={() => {
            const location = locations.find((item) => item.id === draftId);
            if (location) setSelectedLocation(location);
            setOpen(false);
          }}>Select Location</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
