"use client"

import { useSelector, useDispatch } from "react-redux"
import {
  selectGlobalUrl,
  selectConfig,
  selectConfigStatus,
  selectConfigError,
  selectLastFetched,
  setGlobalUrl,
  updateConfig,
  fetchGlobalConfig,
} from "@/lib/redux/slices/configSlice"

/**
 * Hook to access global URL, config.json data, API status, and dispatchers
 */
export function useGlobalConfig() {
  const dispatch = useDispatch()

  const globalUrl = useSelector(selectGlobalUrl)
  const config = useSelector(selectConfig)
  const status = useSelector(selectConfigStatus)
  const error = useSelector(selectConfigError)
  const lastFetched = useSelector(selectLastFetched)

  const changeGlobalUrl = (newUrl) => {
    dispatch(setGlobalUrl(newUrl))
  }

  const patchConfig = (partialConfig) => {
    dispatch(updateConfig(partialConfig))
  }

  const reloadConfig = () => {
    return dispatch(fetchGlobalConfig())
  }

  return {
    globalUrl,
    config,
    status,
    isLoading: status === "loading",
    isSuccess: status === "succeeded",
    isError: status === "failed",
    error,
    lastFetched,
    setGlobalUrl: changeGlobalUrl,
    updateConfig: patchConfig,
    reloadConfig,
  }
}
