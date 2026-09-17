"use client"

import { useEffect, useRef } from "react"
import { Provider } from "react-redux"
import { store } from "./store"
import { fetchGlobalConfig } from "./slices/configSlice"
import { fetchConfig } from "@/lib/config"

export function StoreProvider({ children }) {
  const initialized = useRef(false)

  if (!initialized.current) {
    store.dispatch(fetchGlobalConfig())
    initialized.current = true
  }

  useEffect(() => {
    // Load config.json asynchronously at runtime
    async function loadRuntimeConfig() {
      await fetchConfig()
    }
    loadRuntimeConfig()
  }, [])

  return <Provider store={store}>{children}</Provider>
}
