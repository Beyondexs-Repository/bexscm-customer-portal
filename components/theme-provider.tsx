"use client"

import * as React from "react"

export type Theme = "dark" | "light" | "system"

export interface ThemeProviderContextType {
  theme: Theme
  setTheme: (theme: Theme) => void
  resolvedTheme: "dark" | "light"
  systemTheme: "dark" | "light"
  themes: Theme[]
}

const ThemeProviderContext = React.createContext<ThemeProviderContextType>({
  theme: "system",
  setTheme: () => null,
  resolvedTheme: "light",
  systemTheme: "light",
  themes: ["light", "dark", "system"],
})

function subscribeSystemTheme(callback: () => void) {
  if (typeof window === "undefined") return () => {}
  const media = window.matchMedia("(prefers-color-scheme: dark)")
  media.addEventListener("change", callback)
  return () => media.removeEventListener("change", callback)
}

function getSystemThemeSnapshot(): "dark" | "light" {
  if (typeof window === "undefined") return "light"
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
}

function getSystemThemeServerSnapshot(): "dark" | "light" {
  return "light"
}

export function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = "aloha-theme",
  attribute = "class",
}: {
  children: React.ReactNode
  defaultTheme?: Theme
  storageKey?: string
  attribute?: string
  [key: string]: unknown
}) {
  const [theme, setThemeState] = React.useState<Theme>(() => {
    if (typeof window === "undefined") return defaultTheme
    try {
      return (localStorage.getItem(storageKey) as Theme) || defaultTheme
    } catch {
      return defaultTheme
    }
  })

  const systemTheme = React.useSyncExternalStore(
    subscribeSystemTheme,
    getSystemThemeSnapshot,
    getSystemThemeServerSnapshot,
  )

  const resolvedTheme = React.useMemo(() => {
    if (theme === "system") {
      return systemTheme
    }
    return theme
  }, [theme, systemTheme])

  React.useEffect(() => {
    if (typeof window === "undefined") return

    const root = document.documentElement
    const effectiveTheme = theme === "system" ? systemTheme : theme

    if (attribute === "class") {
      root.classList.remove("light", "dark")
      root.classList.add(effectiveTheme)
    } else {
      root.setAttribute(attribute, effectiveTheme)
    }
  }, [theme, systemTheme, attribute])

  const setTheme = React.useCallback(
    (newTheme: Theme) => {
      try {
        localStorage.setItem(storageKey, newTheme)
      } catch (e) {
        console.warn("Failed to set theme in localStorage:", e)
      }
      setThemeState(newTheme)
    },
    [storageKey],
  )

  const value = React.useMemo(
    () => ({
      theme,
      setTheme,
      resolvedTheme,
      systemTheme,
      themes: ["light", "dark", "system"] as Theme[],
    }),
    [theme, setTheme, resolvedTheme, systemTheme],
  )

  return (
    <ThemeProviderContext.Provider value={value}>
      {children}
    </ThemeProviderContext.Provider>
  )
}

export function useTheme() {
  const context = React.useContext(ThemeProviderContext)
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider")
  }
  return context
}