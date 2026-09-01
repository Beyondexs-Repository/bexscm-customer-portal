import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { fetchAppConfig } from "@/lib/api/configApi"

const DEFAULT_GLOBAL_URL =
  process.env.NEXT_PUBLIC_DEFAULT_GLOBAL_URL || "https://crateapi.bexlgems.com/api/"

/**
 * Async Thunk to perform API call fetching config.json and resolving global URL
 */
export const fetchGlobalConfig = createAsyncThunk(
  "config/fetchGlobalConfig",
  async (_, { rejectWithValue }) => {
    try {
      const configData = await fetchAppConfig()
      return configData
    } catch (err) {
      return rejectWithValue(err.message || "Failed to load global config")
    }
  }
)

const initialState = {
  globalUrl: DEFAULT_GLOBAL_URL,
  config: null,
  status: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
  lastFetched: null,
}

export const configSlice = createSlice({
  name: "config",
  initialState,
  reducers: {
    setGlobalUrl: (state, action) => {
      state.globalUrl = action.payload
    },
    updateConfig: (state, action) => {
      state.config = {
        ...state.config,
        ...action.payload,
      }
      if (action.payload.globalUrl) {
        state.globalUrl = action.payload.globalUrl
      }
    },
    resetConfigState: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchGlobalConfig.pending, (state) => {
        state.status = "loading"
        state.error = null
      })
      .addCase(fetchGlobalConfig.fulfilled, (state, action) => {
        state.status = "succeeded"
        state.config = action.payload
        if (action.payload.globalUrl) {
          state.globalUrl = action.payload.globalUrl
        }
        state.lastFetched = new Date().toISOString()
      })
      .addCase(fetchGlobalConfig.rejected, (state, action) => {
        state.status = "failed"
        state.error = action.payload || action.error.message
      })
  },
})

export const { setGlobalUrl, updateConfig, resetConfigState } = configSlice.actions

// Selectors
export const selectGlobalUrl = (state) => state.config.globalUrl
export const selectConfig = (state) => state.config.config
export const selectConfigStatus = (state) => state.config.status
export const selectConfigError = (state) => state.config.error
export const selectLastFetched = (state) => state.config.lastFetched

export default configSlice.reducer
