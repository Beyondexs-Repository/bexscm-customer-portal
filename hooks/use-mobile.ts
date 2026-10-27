import * as React from "react"

function getServerSnapshot() {
  return false
}

export function useIsMobile(breakpoint = 768) {
  const subscribe = React.useCallback((onChange: () => void) => {
    const query = window.matchMedia(`(max-width: ${breakpoint - 1}px)`)
    query.addEventListener("change", onChange)
    return () => query.removeEventListener("change", onChange)
  }, [breakpoint])

  const getSnapshot = React.useCallback(
    () => window.matchMedia(`(max-width: ${breakpoint - 1}px)`).matches,
    [breakpoint]
  )

  return React.useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
}
