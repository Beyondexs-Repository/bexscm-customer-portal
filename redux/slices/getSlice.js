import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import axios from "axios"

// ─── Inline API helper (no lib/api dependency — Crea pattern) ───────────────
// All axios calls are written directly inside each thunk's try block.
// Base URL and token come from environment variables.

// ============================================================
// INITIAL STATE  (Crea pattern — Data / Loading / Status / Error per thunk)
// ============================================================
const initialState = {
  // ── Catalog Items  GET /items ─────────────────────────────
  itemsData: [],
  itemsLoading: false,
  itemsStatus: "idle",
  itemsError: null,

  // ── Customer Orders  GET /customers/{custnmbr}/orders ─────
  ordersData: [],
  ordersLoading: false,
  ordersStatus: "idle",
  ordersError: null,
  ordersCustomerId: "400001",

  // ── Order Guide List  GET /orderguides/customer/{custnmbr} ─
  orderGuideListData: [],
  orderGuideListLoading: false,
  orderGuideListStatus: "idle",
  orderGuideListError: null,

  // ── Order Guide Groups  GET /orderguidegroups/orderguide/{id} ─
  orderGuideGroupsData: [],
  orderGuideGroupsLoading: false,
  orderGuideGroupsStatus: "idle",
  orderGuideGroupsError: null,

  // ── Order Group Items  GET /ordergroupitems/group/{id} ────
  orderGroupItemsData: [],
  orderGroupItemsLoading: false,
  orderGroupItemsStatus: "idle",
  orderGroupItemsError: null,

  error: null,
}

// ============================================================
// ASYNC THUNKS — GET
// (axios written inline — no lib/api folder — Crea architecture)
// ============================================================

// ── GET /items ───────────────────────────────────────────────────────────────
export const GetItems = createAsyncThunk(
  "items/GetItems",
  async (_, { rejectWithValue }) => {
    try {
      const URL = `${process.env.NEXT_PUBLIC_NRL_API_URL}/items`
      console.log("GetItems URL:", URL)

      const response = await axios.get(URL, {
        headers: {
          Accept: "application/json",
          Authorization: `${process.env.NEXT_PUBLIC_AUTH_TOKEN}`,
        },
      })

      const result = response.data

      if (result?.success === false) {
        throw new Error(result?.Msg || result?.message || "Failed to fetch items.")
      }

      return Array.isArray(result) ? result : []
    } catch (error) {
      return rejectWithValue(error.response ? error.response.data : error.message)
    }
  }
)

// ── GET /customers/{custnmbr}/orders ─────────────────────────────────────────
export const GetCustomerOrders = createAsyncThunk(
  "orders/GetCustomerOrders",
  async (custnmbr = "400001", { rejectWithValue }) => {
    try {
      const resolvedCust = String(custnmbr || "400001").trim()
      const URL = `${process.env.NEXT_PUBLIC_NRL_API_URL}/customers/${resolvedCust}/orders`
      console.log("GetCustomerOrders URL:", URL)

      const response = await axios.get(URL, {
        headers: {
          Accept: "application/json",
          Authorization: `${process.env.NEXT_PUBLIC_AUTH_TOKEN}`,
        },
      })

      const result = response.data

      if (result?.success === false) {
        throw new Error(result?.Msg || result?.message || "Failed to fetch orders.")
      }

      const orders = Array.isArray(result) ? result : result?.orders || result?.data || []
      return { custnmbr: resolvedCust, orders }
    } catch (error) {
      return rejectWithValue(error.response ? error.response.data : error.message)
    }
  }
)

// ── GET /orderguides/customer/{custnmbr} ─────────────────────────────────────
export const GetOrderGuideList = createAsyncThunk(
  "orderGuide/GetOrderGuideList",
  async (_, { rejectWithValue }) => {
    try {
   const custnmbr = localStorage.getItem("custnmbr");
      const URL = `${process.env.NEXT_PUBLIC_NRL_API_URL}/orderguides/customer/${custnmbr}`
      console.log("GetOrderGuideList URL:", URL)

      const response = await axios.get(URL, {
        headers: {
          Accept: "application/json",
          Authorization: `${process.env.NEXT_PUBLIC_AUTH_TOKEN}`,
        },
      })

      const result = response.data

      if (result?.success === false) {
        throw new Error(result?.Msg || result?.message || "Failed to fetch order guides.")
      }

      const list = Array.isArray(result) ? result : Array.isArray(result?.data) ? result.data : []
      return list
    } catch (error) {
      return rejectWithValue(error.response ? error.response.data : error.message)
    }
  }
)

// ── GET /orderguidegroups/orderguide/{orderGuideID} ──────────────────────────
export const GetOrderGuideGroups = createAsyncThunk(
  "orderGuide/GetOrderGuideGroups",
  async (orderGuideID, { rejectWithValue }) => {
    try {
      const URL = `${process.env.NEXT_PUBLIC_NRL_API_URL}/orderguidegroups/orderguide/${orderGuideID}`
      console.log("GetOrderGuideGroups URL:", URL)

      const response = await axios.get(URL, {
        headers: {
          Accept: "application/json",
          Authorization: `${process.env.NEXT_PUBLIC_AUTH_TOKEN}`,
        },
      })

      const result = response.data

      if (result?.success === false) {
        throw new Error(result?.Msg || result?.message || "Failed to fetch order guide groups.")
      }

      const list = Array.isArray(result?.data) ? result.data : Array.isArray(result) ? result : []
      return list
    } catch (error) {
      return rejectWithValue(error.response ? error.response.data : error.message)
    }
  }
)

// ── GET /ordergroupitems/group/{orderGuideGroupID} ───────────────────────────
export const GetOrderGroupItems = createAsyncThunk(
  "orderGuide/GetOrderGroupItems",
  async (orderGuideGroupID, { rejectWithValue }) => {
    try {
      const URL = `${process.env.NEXT_PUBLIC_NRL_API_URL}/ordergroupitems/group/${orderGuideGroupID}`
      console.log("GetOrderGroupItems URL:", URL)

      const response = await axios.get(URL, {
        headers: {
          Accept: "application/json",
          Authorization: `${process.env.NEXT_PUBLIC_AUTH_TOKEN}`,
        },
      })

      const result = response.data

      if (result?.success === false) {
        throw new Error(result?.Msg || result?.message || "Failed to fetch order group items.")
      }

      return Array.isArray(result) ? result : Array.isArray(result?.data) ? result.data : []
    } catch (error) {
      return rejectWithValue(error.response ? error.response.data : error.message)
    }
  }
)

// ============================================================
// SLICE  (Crea pattern — createSlice with extraReducers builder)
// ============================================================
const getSlice = createSlice({
  name: "getSlice",
  initialState,
  reducers: {
    resetGetSlice: () => initialState,
    clearOrderGroupItems: (state) => {
      state.orderGroupItemsData = []
      state.orderGroupItemsStatus = "idle"
    },
    clearOrderGuideGroups: (state) => {
      state.orderGuideGroupsData = []
      state.orderGuideGroupsStatus = "idle"
    },
  },
  extraReducers(builder) {
    builder

      // ── GetItems ──────────────────────────────────────────
      .addCase(GetItems.pending, (state) => {
        state.itemsStatus = "loading"
        state.itemsLoading = true
        state.itemsError = null
      })
      .addCase(GetItems.fulfilled, (state, action) => {
        state.itemsStatus = "succeeded"
        state.itemsLoading = false
        state.itemsData = action.payload
      })
      .addCase(GetItems.rejected, (state, action) => {
        state.itemsStatus = "failed"
        state.itemsLoading = false
        state.itemsError = action.payload || action.error.message
        state.itemsData = []
      })

      // ── GetCustomerOrders ─────────────────────────────────
      .addCase(GetCustomerOrders.pending, (state) => {
        state.ordersStatus = "loading"
        state.ordersLoading = true
        state.ordersError = null
      })
      .addCase(GetCustomerOrders.fulfilled, (state, action) => {
        state.ordersStatus = "succeeded"
        state.ordersLoading = false
        state.ordersData = action.payload.orders
        state.ordersCustomerId = action.payload.custnmbr
      })
      .addCase(GetCustomerOrders.rejected, (state, action) => {
        state.ordersStatus = "failed"
        state.ordersLoading = false
        state.ordersError = action.payload || action.error.message
        state.ordersData = []
      })

      // ── GetOrderGuideList ─────────────────────────────────
      .addCase(GetOrderGuideList.pending, (state) => {
        state.orderGuideListStatus = "loading"
        state.orderGuideListLoading = true
        state.orderGuideListError = null
      })
      .addCase(GetOrderGuideList.fulfilled, (state, action) => {
        state.orderGuideListStatus = "succeeded"
        state.orderGuideListLoading = false
        state.orderGuideListData = action.payload
        console.log(state.orderGuideListData, "--find state.orderGuideListData in getslice");
      })
      .addCase(GetOrderGuideList.rejected, (state, action) => {
        state.orderGuideListStatus = "failed"
        state.orderGuideListLoading = false
        state.orderGuideListError = action.payload || action.error.message
        state.orderGuideListData = []
      })

      // ── GetOrderGuideGroups ───────────────────────────────
      .addCase(GetOrderGuideGroups.pending, (state) => {
        state.orderGuideGroupsStatus = "loading"
        state.orderGuideGroupsLoading = true
        state.orderGuideGroupsError = null
      })
      .addCase(GetOrderGuideGroups.fulfilled, (state, action) => {
        state.orderGuideGroupsStatus = "succeeded"
        state.orderGuideGroupsLoading = false
        state.orderGuideGroupsData = action.payload
      })
      .addCase(GetOrderGuideGroups.rejected, (state, action) => {
        state.orderGuideGroupsStatus = "failed"
        state.orderGuideGroupsLoading = false
        state.orderGuideGroupsError = action.payload || action.error.message
        state.orderGuideGroupsData = []
      })

      // ── GetOrderGroupItems ────────────────────────────────
      .addCase(GetOrderGroupItems.pending, (state) => {
        state.orderGroupItemsStatus = "loading"
        state.orderGroupItemsLoading = true
        state.orderGroupItemsError = null
      })
      .addCase(GetOrderGroupItems.fulfilled, (state, action) => {
        state.orderGroupItemsStatus = "succeeded"
        state.orderGroupItemsLoading = false
        state.orderGroupItemsData = action.payload
      })
      .addCase(GetOrderGroupItems.rejected, (state, action) => {
        state.orderGroupItemsStatus = "failed"
        state.orderGroupItemsLoading = false
        state.orderGroupItemsError = action.payload || action.error.message
        state.orderGroupItemsData = []
      })
  },
})

export const { resetGetSlice, clearOrderGroupItems, clearOrderGuideGroups } = getSlice.actions

// ============================================================
// SELECTORS
// ============================================================
// Items
export const selectItemsData        = (state) => state.getSlice.itemsData
export const selectItemsLoading     = (state) => state.getSlice.itemsLoading
export const selectItemsStatus      = (state) => state.getSlice.itemsStatus
export const selectItemsError       = (state) => state.getSlice.itemsError

// Orders
export const selectOrdersData       = (state) => state.getSlice.ordersData
export const selectOrdersLoading    = (state) => state.getSlice.ordersLoading
export const selectOrdersStatus     = (state) => state.getSlice.ordersStatus
export const selectOrdersError      = (state) => state.getSlice.ordersError
export const selectOrdersCustomerId = (state) => state.getSlice.ordersCustomerId

// Order Guide List
export const selectOrderGuideListData    = (state) => state.getSlice.orderGuideListData
export const selectOrderGuideListLoading = (state) => state.getSlice.orderGuideListLoading
export const selectOrderGuideListStatus  = (state) => state.getSlice.orderGuideListStatus

// Order Guide Groups
export const selectOrderGuideGroupsData    = (state) => state.getSlice.orderGuideGroupsData
export const selectOrderGuideGroupsLoading = (state) => state.getSlice.orderGuideGroupsLoading
export const selectOrderGuideGroupsStatus  = (state) => state.getSlice.orderGuideGroupsStatus

// Order Group Items
export const selectOrderGroupItemsData    = (state) => state.getSlice.orderGroupItemsData
export const selectOrderGroupItemsLoading = (state) => state.getSlice.orderGroupItemsLoading
export const selectOrderGroupItemsStatus  = (state) => state.getSlice.orderGroupItemsStatus

export default getSlice.reducer