"use client"

import { useEffect, useRef } from "react"
import { Provider } from "react-redux"
import { store } from "./store"
import { fetchGlobalConfig } from "./slices/configSlice"
import { initGlobalUrl } from "./slices/getUrlSlice"
import { fetchConfig } from "@/lib/config"

export function StoreProvider({ children }) {
  const initialized = useRef(false)

  if (!initialized.current) {
    // Initial sync initialization
    store.dispatch(initGlobalUrl())
    store.dispatch(fetchGlobalConfig())
    initialized.current = true
  }

  useEffect(() => {
    // Load config.json asynchronously and refresh global URLs
    async function loadRuntimeConfig() {
      await fetchConfig()
      store.dispatch(initGlobalUrl())
    }
    loadRuntimeConfig()
  }, [])

  return <Provider store={store}>{children}</Provider>
}
