import { useState, useEffect, useCallback } from 'react'

/**
 * Like useState, but persists the value to localStorage under `key`,
 * so it survives a page reload. Used for theme mode and DataGrid state.
 */
export function usePersistentState(key, defaultValue) {
  const [value, setValue] = useState(() => {
    try {
      const stored = window.localStorage.getItem(key)
      return stored !== null ? JSON.parse(stored) : defaultValue
    } catch {
      return defaultValue
    }
  })

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value))
    } catch {
      /* storage full or unavailable — ignore */
    }
  }, [key, value])

  const reset = useCallback(() => {
    try {
      window.localStorage.removeItem(key)
    } catch {
      /* ignore */
    }
    setValue(defaultValue)
  }, [key, defaultValue])

  return [value, setValue, reset]
}
