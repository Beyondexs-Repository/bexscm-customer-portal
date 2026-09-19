import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { fetchCustomerOrdersApi, DEFAULT_CUSTNMBR } from "@/lib/api/ordersApi"

/**
 * Async Thunk to fetch a customer's orders via fetchCustomerOrdersApi (lib/api/ordersApi.js)
 * GET /customers/{custnmbr}/orders
 */
export const fetchCustomerOrders = createAsyncThunk(
  "orders/fetchCustomerOrd0ers",
  async (custnmbr = DEFAULT_CUSTNMBR, { rejectWithValue }) => {
    try {
      const resolvedCust = String(custnmbr || DEFAULT_CUSTNMBR).trim()
      const orders = await fetchCustomerOrdersApi(resolvedCust)
      return { custnmbr: resolvedCust, orders }
    } catch (err) {
      return rejectWithValue(err.message || "Failed to fetch orders")
    }
  }
)

const initialState = {
  items: [],
  customerId: DEFAULT_CUSTNMBR,
  status: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
  lastFetched: null,
}

export const ordersSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    resetOrdersState: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCustomerOrders.pending, (state) => {
        state.status = "loading"
        state.error = null
      })
      .addCase(fetchCustomerOrders.fulfilled, (state, action) => {
        state.status = "succeeded"
        state.items = action.payload.orders
        state.customerId = action.payload.custnmbr
        state.lastFetched = new Date().toISOString()

      })
      .addCase(fetchCustomerOrders.rejected, (state, action) => {
        state.status = "failed"
        state.error = action.payload || action.error.message
        state.items = []
      })
  },
})

export const { resetOrdersState } = ordersSlice.actions

// Selectors
export const selectOrders = (state) => state.orders.items
export const selectOrdersStatus = (state) => state.orders.status
export const selectOrdersError = (state) => state.orders.error
export const selectOrdersCustomerId = (state) => state.orders.customerId

export default ordersSlice.reducer
