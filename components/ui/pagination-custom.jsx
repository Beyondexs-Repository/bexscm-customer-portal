"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight, ChevronDown } from "lucide-react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

export function getPageNumbers(currentPage, totalPages, delta = 1) {
  if (totalPages <= 1) return [1]

  const range = []
  const rangeWithDots = []

  for (let i = 1; i <= totalPages; i++) {
    if (
      i === 1 ||
      i === totalPages ||
      (i >= currentPage - delta && i <= currentPage + delta)
    ) {
      range.push(i)
    }
  }

  let l = null
  for (let i of range) {
    if (l !== null) {
      if (i - l === 2) {
        rangeWithDots.push(l + 1)
      } else if (i - l !== 1) {
        rangeWithDots.push("...")
      }
    }
    rangeWithDots.push(i)
    l = i
  }

  return rangeWithDots
}

export default function PaginationCustom({
  currentPage = 1,
  totalPages = 1,
  pageSize = 20,
  totalItems = 0,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [10, 20, 50, 100],
  className,
  labels = {},
  showItemRange = false,
}) {
  const showLabel = labels.show || "Show"
  const perPageLabel = labels.perPage || "per page"

  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1
  const endItem = Math.min(currentPage * pageSize, totalItems)

  const pageNumbers = getPageNumbers(currentPage, totalPages)

  return (
    <div
      className={cn(
        "flex flex-col gap-3 border-t pt-3 pb-1 sm:flex-row sm:items-center sm:justify-between",
        className
      )}
    >
      {/* Page Navigation Controls - Matches the design in the provided image */}
      <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
        {/* Previous Page Button */}
        <button
          type="button"
          disabled={currentPage <= 1}
          onClick={() => onPageChange && onPageChange(currentPage - 1)}
          className="inline-flex size-8 items-center justify-center rounded-md border border-input bg-card text-foreground shadow-xs transition-colors hover:bg-accent hover:text-accent-foreground disabled:pointer-events-none disabled:opacity-40"
          aria-label="Previous page"
        >
          <ChevronLeft className="size-4 text-muted-foreground" />
        </button>

        {/* Page Number Buttons */}
        {pageNumbers.map((page, idx) => {
          if (page === "...") {
            return (
              <span
                key={`ellipsis-${idx}`}
                className="inline-flex size-8 items-center justify-center rounded-md border border-input bg-card text-xs text-muted-foreground select-none"
              >
                ...
              </span>
            )
          }

          const isCurrent = page === currentPage

          return (
            <button
              key={`page-${page}`}
              type="button"
              onClick={() => onPageChange && onPageChange(Number(page))}
              className={cn(
                "inline-flex h-8 min-w-[32px] px-2.5 items-center justify-center rounded-md text-xs font-semibold shadow-xs transition-colors",
                isCurrent
                  ? "bg-primary text-primary-foreground border border-primary"
                  : "border border-input bg-card text-foreground hover:bg-accent hover:text-accent-foreground"
              )}
            >
              {page}
            </button>
          )
        })}

        {/* Next Page Button */}
        <button
          type="button"
          disabled={currentPage >= totalPages}
          onClick={() => onPageChange && onPageChange(currentPage + 1)}
          className="inline-flex size-8 items-center justify-center rounded-md border border-input bg-card text-foreground shadow-xs transition-colors hover:bg-accent hover:text-accent-foreground disabled:pointer-events-none disabled:opacity-40"
          aria-label="Next page"
        >
          <ChevronRight className="size-4 text-muted-foreground" />
        </button>
      </div>

      {/* Right Side Controls: Item count & Page Size Selector */}
      <div className="flex flex-wrap items-center gap-4 sm:gap-6">
        {showItemRange && totalItems > 0 && (
          <span className="text-xs text-muted-foreground">
            Showing <span className="font-semibold text-foreground">{startItem}</span> to{" "}
            <span className="font-semibold text-foreground">{endItem}</span> of{" "}
            <span className="font-semibold text-foreground">{totalItems}</span> orders
          </span>
        )}

        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span>{showLabel}</span>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                className="inline-flex h-8 items-center gap-2 rounded-md border border-input bg-card px-2.5 text-xs font-semibold text-foreground shadow-xs hover:bg-accent focus:outline-none focus:ring-1 focus:ring-ring"
              >
                <span>{pageSize}</span>
                <ChevronDown className="size-3.5 text-muted-foreground" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="min-w-[5rem]">
              {pageSizeOptions.map((option) => (
                <DropdownMenuItem
                  key={option}
                  onClick={() => onPageSizeChange && onPageSizeChange(option)}
                  className={cn(
                    "cursor-pointer text-xs font-medium justify-between",
                    pageSize === option && "font-bold text-primary"
                  )}
                >
                  {option}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <span>{perPageLabel}</span>
        </div>
      </div>
    </div>
  )
}
