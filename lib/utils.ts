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