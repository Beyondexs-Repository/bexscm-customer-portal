"use client"

import { useMemo } from "react"
import { useSearchParams } from "next/navigation"

import Promotions from "@/components/promotions/Promotions"

export default function PromotionsPageClient() {
  const searchParams = useSearchParams()
  const createdPromotion = useMemo(() => {
    const created = searchParams.get("created")

    if (!created) return null

    try {
      return JSON.parse(created)
    } catch {
      return null
    }
  }, [searchParams])

  return <Promotions createdPromotion={createdPromotion} />
}
