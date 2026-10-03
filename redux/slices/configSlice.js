import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { getConfig } from "@/lib/config"

const BASE_URL = getConfig().API_URL

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
      return getConfig()
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
