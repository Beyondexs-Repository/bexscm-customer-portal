import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"

// ─── Default API base URL ───────────────────────────────────────────────────
const BASE_URL = process.env.NEXT_PUBLIC_NRL_API_URL || "https://crateapi.bexlgems.com/api"
const AUTH_TOKEN = process.env.NEXT_PUBLIC_AUTH_TOKEN || ""

// ─── Shared fetch helper (inline — no lib/api dependency) ───────────────────
async function apiFetchInline(endpoint, options = {}) {
  const url = `${BASE_URL}${endpoint}`
  const response = await fetch(url, {
    ...options,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: AUTH_TOKEN,
      ...(options.headers || {}),
    },
  })
  const text = await response.text()
  let result = null
  try {
    result = text ? JSON.parse(text) : null
  } catch {
    result = null
  }
  if (!response.ok) {
    throw new Error(result?.Msg || result?.message || result?.error || `HTTP ${response.status}`)
  }
  return result
}

// ─── INITIAL STATE ───────────────────────────────────────────────────────────
const initialState = {
  // Global config
  globalUrl: BASE_URL,
  config: null,
  configStatus: "idle",
  configError: null,
}

// ─── CONFIG THUNK ────────────────────────────────────────────────────────────
export const fetchGlobalConfig = createAsyncThunk(
  "config/fetchGlobalConfig",
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetch("/config.json", { cache: "no-store" })
      if (!res.ok) throw new Error("Config not found")
      return await res.json()
    } catch (err) {
      return rejectWithValue(err.message || "Failed to load global config")
    }
  }
)

// ─── SLICE ───────────────────────────────────────────────────────────────────
export const configSlice = createSlice({
  name: "config",
  initialState,
  reducers: {
    setGlobalUrl: (state, action) => {
      state.globalUrl = action.payload
    },
    resetConfigState: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchGlobalConfig.pending, (state) => {
        state.configStatus = "loading"
        state.configError = null
      })
      .addCase(fetchGlobalConfig.fulfilled, (state, action) => {
        state.configStatus = "succeeded"
        state.config = action.payload
        if (action.payload?.globalUrl) state.globalUrl = action.payload.globalUrl
        if (action.payload?.API_URL) state.globalUrl = action.payload.API_URL
      })
      .addCase(fetchGlobalConfig.rejected, (state, action) => {
        state.configStatus = "failed"
        state.configError = action.payload || action.error.message
      })
  },
})

export const { setGlobalUrl, resetConfigState } = configSlice.actions

// Selectors
export const selectGlobalUrl = (state) => state.config.globalUrl
export const selectConfig = (state) => state.config.config
export const selectConfigStatus = (state) => state.config.configStatus

export default configSlice.reducer
