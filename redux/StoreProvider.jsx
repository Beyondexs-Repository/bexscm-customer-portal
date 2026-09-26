"use client"

import { useRef } from "react"
import { Provider } from "react-redux"
import { store } from "./store"
import { fetchGlobalConfig } from "./slices/configSlice"

export function StoreProvider({ children }) {
  const initialized = useRef(false)

  if (!initialized.current) {
    store.dispatch(fetchGlobalConfig())
    initialized.current = true
  }

  return <Provider store={store}>{children}</Provider>
}
