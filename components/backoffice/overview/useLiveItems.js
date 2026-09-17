"use client"

import { useEffect, useState } from "react"
import {
  buildDashboardStats,
  buildTopCategories,
  fetchItemsApi,
} from "./dashboard-data"

export function useLiveItems() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [stats, setStats] = useState(() => buildDashboardStats())
  const [topCategories, setTopCategories] = useState(() => buildTopCategories())

  useEffect(() => {
    let isMounted = true

    async function loadLiveItems() {
      try {
        setLoading(true)
        const liveItems = await fetchItemsApi()
        if (isMounted) {
          setItems(liveItems)
          setStats(buildDashboardStats(liveItems))
          setTopCategories(buildTopCategories(liveItems))
          setError(null)
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message)
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    loadLiveItems()

    return () => {
      isMounted = false
    }
  }, [])

  return {
    items,
    loading,
    error,
    stats,
    topCategories,
    refetch: async () => {
      setLoading(true)
      const liveItems = await fetchItemsApi()
      setItems(liveItems)
      setStats(buildDashboardStats(liveItems))
      setTopCategories(buildTopCategories(liveItems))
      setLoading(false)
    },
  }
}
