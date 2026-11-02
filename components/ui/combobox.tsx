"use client"

import * as React from "react"
import { Combobox as ComboboxPrimitive } from "@base-ui/react/combobox"
import { CheckIcon, ChevronDownIcon, XIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

// Adapted from shadcn's radix-nova combobox to use this project's Button.
const Combobox = ComboboxPrimitive.Root
const ComboboxValue = ComboboxPrimitive.Value

function ComboboxChips({ className, ...props }: ComboboxPrimitive.Chips.Props) {
  return (
    <ComboboxPrimitive.Chips
      data-slot="combobox-chips"
      className={cn(
        "flex min-h-9 w-full flex-wrap items-center gap-1 rounded-lg border border-input bg-background px-2 py-1 text-xs focus-within:border-ring focus-within:ring-2 focus-within:ring-ring/50 has-disabled:opacity-50",
        className
      )}
      {...props}
    />
  )
}

function ComboboxChip({ children, className, ...props }: ComboboxPrimitive.Chip.Props) {
  return (
    <ComboboxPrimitive.Chip
      data-slot="combobox-chip"
      className={cn("flex max-w-full items-center gap-1 rounded-sm bg-blue-100 py-0.5 pl-1.5 text-xs text-foreground dark:bg-blue-500/20", className)}
      {...props}
    >
      <span className="min-w-0 truncate">{children}</span>
      <ComboboxPrimitive.ChipRemove
        render={<Button type="button" variant="ghost" size="icon-xs" />}
        aria-label={`Remove ${typeof children === "string" ? children : "selection"}`}
      >
        <XIcon className="size-3" />
      </ComboboxPrimitive.ChipRemove>
    </ComboboxPrimitive.Chip>
  )
}

function ComboboxChipsInput({ className, ...props }: ComboboxPrimitive.Input.Props) {
  return (
    <ComboboxPrimitive.Input
      data-slot="combobox-input"
      className={cn("h-6 min-w-20 flex-1 bg-transparent text-xs outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed", className)}
      {...props}
    />
  )
}

function ComboboxTrigger(props: ComboboxPrimitive.Trigger.Props) {
  return (
    <ComboboxPrimitive.Trigger
      render={<Button type="button" variant="ghost" size="icon-xs" />}
      {...props}
    >
      <ChevronDownIcon className="size-3.5" />
    </ComboboxPrimitive.Trigger>
  )
}

function ComboboxClear(props: ComboboxPrimitive.Clear.Props) {
  return (
    <ComboboxPrimitive.Clear
      data-slot="combobox-clear"
      render={<Button type="button" variant="ghost" size="icon-xs" />}
      tabIndex={0}
      {...props}
    >
      <XIcon className="size-3.5" />
    </ComboboxPrimitive.Clear>
  )
}

function ComboboxContent({
  className,
  anchor,
  inline = false,
  ...props
}: ComboboxPrimitive.Popup.Props & {
  anchor?: React.RefObject<HTMLDivElement | null>
  inline?: boolean
}) {
  const content = (
    <ComboboxPrimitive.Positioner
      anchor={anchor}
      align="start"
      sideOffset={4}
      positionMethod="fixed"
      className="isolate z-[60]"
    >
      <ComboboxPrimitive.Popup
        data-slot="combobox-content"
        className={cn("group/combobox-content max-h-(--available-height) w-(--anchor-width) max-w-(--available-width) overflow-hidden rounded-lg bg-popover text-popover-foreground shadow-md ring-1 ring-foreground/10", className)}
        {...props}
      />
    </ComboboxPrimitive.Positioner>
  )
  // Keep nested pickers inside the Radix Sheet's focus and dismissal boundary.
  return (
    <ComboboxPrimitive.Portal container={inline ? anchor : undefined}>
      {content}
    </ComboboxPrimitive.Portal>
  )
}

function ComboboxList({ className, ...props }: ComboboxPrimitive.List.Props) {
  return <ComboboxPrimitive.List className={cn("max-h-60 scroll-py-1 overflow-y-auto overscroll-contain p-1", className)} {...props} />
}

function ComboboxItem({ className, children, ...props }: ComboboxPrimitive.Item.Props) {
  return (
    <ComboboxPrimitive.Item
      className={cn("relative flex cursor-default items-center gap-2 rounded-md py-2 pr-7 pl-2 text-xs outline-none select-none data-highlighted:bg-accent data-highlighted:text-accent-foreground data-disabled:pointer-events-none data-disabled:opacity-50", className)}
      {...props}
    >
      {children}
      <ComboboxPrimitive.ItemIndicator className="absolute right-2">
        <CheckIcon className="size-3.5" />
      </ComboboxPrimitive.ItemIndicator>
    </ComboboxPrimitive.Item>
  )
}

function ComboboxEmpty(props: ComboboxPrimitive.Empty.Props) {
  return <ComboboxPrimitive.Empty className="hidden px-2 py-3 text-center text-xs text-muted-foreground group-data-empty/combobox-content:block" {...props} />
}

function useComboboxAnchor() {
  return React.useRef<HTMLDivElement | null>(null)
}

export {
  Combobox,
  ComboboxValue,
  ComboboxChips,
  ComboboxChip,
  ComboboxChipsInput,
  ComboboxTrigger,
  ComboboxClear,
  ComboboxContent,
  ComboboxList,
  ComboboxItem,
  ComboboxEmpty,
  useComboboxAnchor,
}
