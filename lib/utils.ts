import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export function getItemImage(item?: { image?: string | null }): string {
  const img = item?.image
  if (!img) return ""
  if (/^(https?:|data:|\/)/.test(img)) return img
  return `${process.env.NEXT_PUBLIC_IMAGE_BASE_URL}/${img}`
}

export function formatDeliveryDate(value?: string | null): string {
  if (!value) return ""

  // "9/27/2026 12:00:00 AM" → parse M/D/YYYY manually (avoids timezone day-shift and Safari parsing quirks)
  const m = value.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})/)
  const date = m
    ? new Date(Number(m[3]), Number(m[1]) - 1, Number(m[2]))
    : new Date(value)

  if (isNaN(date.getTime())) return value   // unknown format → show as-is

  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
}