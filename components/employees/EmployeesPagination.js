"use client"

import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react"
import { useTranslations } from "next-intl"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const PAGE_SIZE_OPTIONS = [5, 10, 20, 50]

export function EmployeesPagination({
  currentPage,
  pageSize,
  selectedRows = 0,
  totalRows = 0,
  totalPages,
  onPageChange,
  onPageSizeChange,
}) {
  const t = useTranslations("employees")
  const canGoBack = currentPage > 1
  const canGoForward = currentPage < totalPages

  return (
    <div className=" px-4 py-2">
      <div className="hidden items-center justify-between gap-4 md:flex">
        <p className="text-sm font-medium text-muted-foreground">
          {t("selectedRows", { selected: selectedRows, total: totalRows })}
        </p>

        <div className="flex items-center justify-end gap-6">
          <div className="flex items-center gap-2 text-sm">
            <span className="font-semibold text-foreground">{t("rowsPerPage")}</span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="h-9 min-w-16 justify-between rounded-md px-3 font-semibold"
                >
                  {pageSize}
                  <ChevronDown className="size-4 text-muted-foreground" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="min-w-16">
                {PAGE_SIZE_OPTIONS.map((option) => (
                  <DropdownMenuItem
                    key={option}
                    onSelect={() => onPageSizeChange(option)}
                  >
                    {option}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <p className="shrink-0 text-sm font-semibold text-foreground">
            {t("pageOf", { current: currentPage, total: totalPages })}
          </p>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon-sm"
              aria-label={t("firstPage")}
              disabled={!canGoBack}
              onClick={() => onPageChange(1)}
            >
              <ChevronsLeft className="size-4" />
            </Button>
            <Button
              variant="outline"
              size="icon-sm"
              aria-label={t("previousPage")}
              disabled={!canGoBack}
              onClick={() => onPageChange(currentPage - 1)}
            >
              <ChevronLeft className="size-4" />
            </Button>
            <Button
              variant="outline"
              size="icon-sm"
              aria-label={t("nextPage")}
              disabled={!canGoForward}
              onClick={() => onPageChange(currentPage + 1)}
            >
              <ChevronRight className="size-4" />
            </Button>
            <Button
              variant="outline"
              size="icon-sm"
              aria-label={t("lastPage")}
              disabled={!canGoForward}
              onClick={() => onPageChange(totalPages)}
            >
              <ChevronsRight className="size-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between gap-3 md:hidden">
        <p className="shrink-0 text-sm font-semibold text-foreground">
        {t("pageOf", { current: currentPage, total: totalPages })}
      </p>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon-sm"
            aria-label={t("firstPage")}
            disabled={!canGoBack}
            onClick={() => onPageChange(1)}
          >
            <ChevronsLeft className="size-4" />
          </Button>
          <Button
            variant="outline"
            size="icon-sm"
            aria-label={t("previousPage")}
            disabled={!canGoBack}
            onClick={() => onPageChange(currentPage - 1)}
          >
            <ChevronLeft className="size-4" />
          </Button>
          <Button
            variant="outline"
            size="icon-sm"
            aria-label={t("nextPage")}
            disabled={!canGoForward}
            onClick={() => onPageChange(currentPage + 1)}
          >
            <ChevronRight className="size-4" />
          </Button>
          <Button
            variant="outline"
            size="icon-sm"
            aria-label={t("lastPage")}
            disabled={!canGoForward}
            onClick={() => onPageChange(totalPages)}
          >
            <ChevronsRight className="size-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
