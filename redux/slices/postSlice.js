import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import axios from "axios"

// ============================================================
// INITIAL STATE  (Crea pattern — Data / Loading / Status / Error per thunk)
// ============================================================
const initialState = {
  // ── Auth / Login  POST /auth/login ──────────────────────
  loginData: {},
  loginLoading: false,
  loginStatus: "idle",
  loginError: null,

  // ── POST /cart ───────────────────────────────────────────
  postCartData: {},
  postCartLoading: false,
  postCartStatus: "idle",
  postCartError: null,

  // ── PUT /cart/customer/{custnmbr}/item/{itemNumber} ──────
  updateCartData: {},
  updateCartLoading: false,
  updateCartStatus: "idle",
  updateCartError: null,

  // ── POST /checkout/{custnmbr} ────────────────────────────
  checkoutData: {},
  checkoutLoading: false,
  checkoutStatus: "idle",
  checkoutError: null,

  // ── POST /orders/reorder/{orderNumber} ───────────────────
  reorderData: {},
  reorderLoading: false,
  reorderStatus: "idle",
  reorderError: null,

  // ── POST /orderguides ────────────────────────────────────
  createOrderGuideData: {},
  createOrderGuideLoading: false,
  createOrderGuideStatus: "idle",
  createOrderGuideError: null,

  // ── PUT /orderguides/{orderGuideID} ──────────────────────
  updateOrderGuideData: {},
  updateOrderGuideLoading: false,
  updateOrderGuideStatus: "idle",
  updateOrderGuideError: null,

  // ── DELETE /orderguides/{orderGuideID} ───────────────────
  deleteOrderGuideData: {},
  deleteOrderGuideLoading: false,
  deleteOrderGuideStatus: "idle",
  deleteOrderGuideError: null,

  // ── PUT /orderguides/sequence ────────────────────────────
  orderGuideSequenceData: {},
  orderGuideSequenceLoading: false,
  orderGuideSequenceStatus: "idle",
  orderGuideSequenceError: null,

  // ── POST /orderguidegroups ───────────────────────────────
  createOrderGuideGroupData: {},
  createOrderGuideGroupLoading: false,
  createOrderGuideGroupStatus: "idle",
  createOrderGuideGroupError: null,

  // ── PUT /orderguidegroups/{orderGuideGroupID} ────────────
  updateOrderGuideGroupData: {},
  updateOrderGuideGroupLoading: false,
  updateOrderGuideGroupStatus: "idle",
  updateOrderGuideGroupError: null,

  // ── DELETE /orderguidegroups/{orderGuideGroupID} ─────────
  deleteOrderGuideGroupData: {},
  deleteOrderGuideGroupLoading: false,
  deleteOrderGuideGroupStatus: "idle",
  deleteOrderGuideGroupError: null,

  // ── DELETE /ordergroupitems/{orderGroupItemID} ───────────
  deleteOrderGroupItemData: {},
  deleteOrderGroupItemLoading: false,
  deleteOrderGroupItemStatus: "idle",
  deleteOrderGroupItemError: null,

  // ── PUT /orderguidegroups/move-items ─────────────────────
  moveItemsData: {},
  moveItemsLoading: false,
  moveItemsStatus: "idle",
  moveItemsError: null,

  // ── PUT /orderguidegroups/move-items (position) ──────────
  moveToTopData: {},
  moveToTopLoading: false,
  moveToTopStatus: "idle",
  moveToTopError: null,

  // ── POST /orderguidegroups/duplicate-items ───────────────
  duplicateItemsData: {},
  duplicateItemsLoading: false,
  duplicateItemsStatus: "idle",
  duplicateItemsError: null,

  // ── PUT /ordergroupitems/par/{orderGroupItemID} ──────────
  updateParData: {},
  updateParLoading: false,
  updateParStatus: "idle",
  updateParError: null,

  // ── PUT /ordergroupitems/par/bulk ────────────────────────
  updateBulkParData: {},
  updateBulkParLoading: false,
  updateBulkParStatus: "idle",
  updateBulkParError: null,

  // ── PUT /ordergroupitems/sequence ────────────────────────
  itemSequenceData: {},
  itemSequenceLoading: false,
  itemSequenceStatus: "idle",
  itemSequenceError: null,

  error: null,
}

// ============================================================
// ASYNC THUNKS — POST / PUT / DELETE
// Plain axios inline, same shape as Crea's PostUserLanguage:
//   const URL = `${process.env...}...`
//   axios.post/put/delete(URL, body, { headers })
//   catch (error) { rejectWithValue(error.response ? error.response.data : error.message) }
// ============================================================

// ── POST /auth/login ─────────────────────────────────────────────────────────
export const PostLogin = createAsyncThunk(
  "auth/PostLogin",
  async ({ data }, { rejectWithValue }) => {
    try {
      const URL = `${process.env.NEXT_PUBLIC_NRL_API_URL}/auth/login`
      console.log("PostLogin URL:", URL)

      const response = await axios.post(
        URL, data, {
          headers: {
            Accept: "application/json",
            Authorization: `${process.env.NEXT_PUBLIC_AUTH_TOKEN}`,
          },
        }
      )

    return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);

// ── POST /cart ────────────────────────────────────────────────────────────────
export const PostCart = createAsyncThunk(
  "cart/PostCart",
  async ({ CUSTNMBR = "400001", ItemNumber, ItemName, Quantity, Source = "App/Web" }, { rejectWithValue }) => {
    try {
      const URL = `${process.env.NEXT_PUBLIC_NRL_API_URL}/cart`
      console.log("PostCart URL:", URL)

      const response = await axios.post(
        URL,
        { CUSTNMBR, ItemNumber, ItemName, Quantity, Source },
        {
          headers: {
            Accept: "application/json",
            Authorization: `${process.env.NEXT_PUBLIC_AUTH_TOKEN}`,
          },
        }
      )

      return response.data
    } catch (error) {
      return rejectWithValue(error.response ? error.response.data : error.message)
    }
  }
)

// ── PUT /cart/customer/{custnmbr}/item/{itemNumber} ──────────────────────────
export const PutCartQuantity = createAsyncThunk(
  "cart/PutCartQuantity",
  async ({ custnmbr = "400001", itemNumber, quantity }, { rejectWithValue }) => {
    try {
      const URL = `${process.env.NEXT_PUBLIC_NRL_API_URL}/cart/customer/${custnmbr}/item/${itemNumber}`
      console.log("PutCartQuantity URL:", URL)

      const response = await axios.put(
        URL,
        { quantity },
        {
          headers: {
            Accept: "application/json",
            Authorization: `${process.env.NEXT_PUBLIC_AUTH_TOKEN}`,
          },
        }
      )

      return response.data
    } catch (error) {
      return rejectWithValue(error.response ? error.response.data : error.message)
    }
  }
)

// ── POST /checkout/{custnmbr} ────────────────────────────────────────────────
export const PostCheckout = createAsyncThunk(
  "cart/PostCheckout",
  async (custnmbr = "400001", { rejectWithValue }) => {
    try {
      const URL = `${process.env.NEXT_PUBLIC_NRL_API_URL}/checkout/${custnmbr}`
      console.log("PostCheckout URL:", URL)

      const response = await axios.post(
        URL,
        null,
        {
          headers: {
            Accept: "application/json",
            Authorization: `${process.env.NEXT_PUBLIC_AUTH_TOKEN}`,
          },
        }
      )

      return response.data
    } catch (error) {
      return rejectWithValue(error.response ? error.response.data : error.message)
    }
  }
)

// ── POST /orders/reorder/{orderNumber} ───────────────────────────────────────
export const PostReorder = createAsyncThunk(
  "orders/PostReorder",
  async ({ orderNumber, items }, { rejectWithValue }) => {
    try {
      const URL = `${process.env.NEXT_PUBLIC_NRL_API_URL}/orders/reorder/${orderNumber}`
      console.log("PostReorder URL:", URL)

      const requestBody = {
        items: items.map((item) => ({
          itemNumber: String(item.itemNumber),
          quantity: Number(item.quantity),
        })),
      }
      console.log("PostReorder Request Body:", requestBody)

      const response = await axios.post(URL, requestBody, {
        headers: {
          Accept: "application/json",
          Authorization: `${process.env.NEXT_PUBLIC_AUTH_TOKEN}`,
        },
      })

      if (response.data?.success === false) {
        throw new Error(response.data?.Msg || response.data?.message || "Failed to reorder.")
      }

      return response.data
    } catch (error) {
      return rejectWithValue(error.response ? error.response.data : error.message)
    }
  }
)

// ── POST /orderguides ─────────────────────────────────────────────────────────
export const PostOrderGuide = createAsyncThunk(
  "orderGuide/PostOrderGuide",
  async ({ name, custnmbr, createdBY }, { rejectWithValue }) => {
    try {
      const URL = `${process.env.NEXT_PUBLIC_NRL_API_URL}/orderguides`
      console.log("PostOrderGuide URL:", URL)

      const response = await axios.post(
        URL,
        { name, custnmbr, createdBY },
        {
          headers: {
            Accept: "application/json",
            Authorization: `${process.env.NEXT_PUBLIC_AUTH_TOKEN}`,
          },
        }
      )

      if (response.data?.success === false) {
        throw new Error(response.data?.Msg || response.data?.message || "Failed to create order guide.")
      }

      return response.data
    } catch (error) {
      return rejectWithValue(error.response ? error.response.data : error.message)
    }
  }
)

// ── PUT /orderguides/{orderGuideID} ──────────────────────────────────────────
export const PutOrderGuide = createAsyncThunk(
  "orderGuide/PutOrderGuide",
  async ({ orderGuideID, name, modifyBY }, { rejectWithValue }) => {
    try {
      const URL = `${process.env.NEXT_PUBLIC_NRL_API_URL}/orderguides/${orderGuideID}`
      console.log("PutOrderGuide URL:", URL)

      const response = await axios.put(
        URL,
        { name, modifyBY },
        {
          headers: {
            Accept: "application/json",
            Authorization: `${process.env.NEXT_PUBLIC_AUTH_TOKEN}`,
          },
        }
      )

      if (response.data?.success === false) {
        throw new Error(response.data?.Msg || response.data?.message || "Failed to update order guide.")
      }

      return response.data
    } catch (error) {
      return rejectWithValue(error.response ? error.response.data : error.message)
    }
  }
)

// ── DELETE /orderguides/{orderGuideID} ───────────────────────────────────────
export const DeleteOrderGuide = createAsyncThunk(
  "orderGuide/DeleteOrderGuide",
  async (orderGuideID, { rejectWithValue }) => {
    try {
      const URL = `${process.env.NEXT_PUBLIC_NRL_API_URL}/orderguides/${orderGuideID}`
      console.log("DeleteOrderGuide URL:", URL)

      const response = await axios.delete(URL, {
        headers: {
          Accept: "application/json",
          Authorization: `${process.env.NEXT_PUBLIC_AUTH_TOKEN}`,
        },
      })

      if (response.data?.success === false) {
        throw new Error(response.data?.Msg || response.data?.message || "Failed to delete order guide.")
      }

      return { orderGuideID, ...response.data }
    } catch (error) {
      return rejectWithValue(error.response ? error.response.data : error.message)
    }
  }
)

// ── PUT /orderguides/sequence ─────────────────────────────────────────────────
export const PutOrderGuideSequence = createAsyncThunk(
  "orderGuide/PutOrderGuideSequence",
  async ({ orderGuideID, sequence, modifyBY }, { rejectWithValue }) => {
    try {
      const URL = `${process.env.NEXT_PUBLIC_NRL_API_URL}/orderguides/sequence`
      console.log("PutOrderGuideSequence URL:", URL)

      const response = await axios.put(
        URL,
        { orderGuideID, sequence, modifyBY },
        {
          headers: {
            Accept: "application/json",
            Authorization: `${process.env.NEXT_PUBLIC_AUTH_TOKEN}`,
          },
        }
      )

      if (response.data?.success === false) {
        throw new Error(response.data?.Msg || response.data?.message || "Failed to reorder order guides.")
      }

      return response.data
    } catch (error) {
      return rejectWithValue(error.response ? error.response.data : error.message)
    }
  }
)

// ── POST /orderguidegroups ────────────────────────────────────────────────────
export const PostOrderGuideGroup = createAsyncThunk(
  "orderGuide/PostOrderGuideGroup",
  async ({ orderGuideID, name, createdBY }, { rejectWithValue }) => {
    try {
      const URL = `${process.env.NEXT_PUBLIC_NRL_API_URL}/orderguidegroups`
      console.log("PostOrderGuideGroup URL:", URL)

      const response = await axios.post(
        URL,
        { orderGuideID, name, createdBY },
        {
          headers: {
            Accept: "application/json",
            Authorization: `${process.env.NEXT_PUBLIC_AUTH_TOKEN}`,
          },
        }
      )

      if (response.data?.success === false) {
        throw new Error(response.data?.Msg || response.data?.message || "Failed to create group.")
      }

      return response.data
    } catch (error) {
      return rejectWithValue(error.response ? error.response.data : error.message)
    }
  }
)

// ── PUT /orderguidegroups/{orderGuideGroupID} ─────────────────────────────────
export const PutOrderGuideGroup = createAsyncThunk(
  "orderGuide/PutOrderGuideGroup",
  async ({ orderGuideGroupID, name, modifyBY }, { rejectWithValue }) => {
    try {
      const URL = `${process.env.NEXT_PUBLIC_NRL_API_URL}/orderguidegroups/${orderGuideGroupID}`
      console.log("PutOrderGuideGroup URL:", URL)

      const response = await axios.put(
        URL,
        { name, modifyBY },
        {
          headers: {
            Accept: "application/json",
            Authorization: `${process.env.NEXT_PUBLIC_AUTH_TOKEN}`,
          },
        }
      )

      if (response.data?.success === false) {
        throw new Error(response.data?.Msg || response.data?.message || "Failed to rename group.")
      }

      return response.data
    } catch (error) {
      return rejectWithValue(error.response ? error.response.data : error.message)
    }
  }
)

// ── DELETE /orderguidegroups/{orderGuideGroupID} ──────────────────────────────
export const DeleteOrderGuideGroup = createAsyncThunk(
  "orderGuide/DeleteOrderGuideGroup",
  async (orderGuideGroupID, { rejectWithValue }) => {
    try {
      const URL = `${process.env.NEXT_PUBLIC_NRL_API_URL}/orderguidegroups/${orderGuideGroupID}`
      console.log("DeleteOrderGuideGroup URL:", URL)

      const response = await axios.delete(URL, {
        headers: {
          Accept: "application/json",
          Authorization: `${process.env.NEXT_PUBLIC_AUTH_TOKEN}`,
        },
      })

      if (response.data?.success === false) {
        throw new Error(response.data?.Msg || response.data?.message || "Failed to delete group.")
      }

      return { orderGuideGroupID, ...response.data }
    } catch (error) {
      return rejectWithValue(error.response ? error.response.data : error.message)
    }
  }
)

// ── DELETE /ordergroupitems/{orderGroupItemID} ────────────────────────────────
export const DeleteOrderGroupItem = createAsyncThunk(
  "orderGuide/DeleteOrderGroupItem",
  async (orderGroupItemID, { rejectWithValue }) => {
    try {
      const URL = `${process.env.NEXT_PUBLIC_NRL_API_URL}/ordergroupitems/${orderGroupItemID}`
      console.log("DeleteOrderGroupItem URL:", URL)

      const response = await axios.delete(URL, {
        headers: {
          Accept: "application/json",
          Authorization: `${process.env.NEXT_PUBLIC_AUTH_TOKEN}`,
        },
      })

      if (response.data?.success === false) {
        throw new Error(response.data?.Msg || response.data?.message || "Failed to delete item.")
      }

      return { orderGroupItemID, ...response.data }
    } catch (error) {
      return rejectWithValue(error.response ? error.response.data : error.message)
    }
  }
)

// ── PUT /orderguidegroups/move-items  (change group) ─────────────────────────
export const PutMoveItems = createAsyncThunk(
  "orderGuide/PutMoveItems",
  async ({ itemIds, targetOrderGuideGroupID, newGroupName, modifyBY }, { rejectWithValue }) => {
    try {
      const URL = `${process.env.NEXT_PUBLIC_NRL_API_URL}/orderguidegroups/move-items`
      console.log("PutMoveItems URL:", URL)

      const body = { itemIds, modifyBY }
      if (newGroupName) body.newGroupName = newGroupName
      else body.targetOrderGuideGroupID = targetOrderGuideGroupID

      const response = await axios.put(URL, body, {
        headers: {
          Accept: "application/json",
          Authorization: `${process.env.NEXT_PUBLIC_AUTH_TOKEN}`,
        },
      })

      // Fail only on an explicit success:false.
      // An empty body or a missing "success" field is treated as OK.
      if (response.data?.success === false) {
        throw new Error(response.data?.Msg || response.data?.message || "Failed to move items.")
      }

      return response.data
    } catch (error) {
      return rejectWithValue(error.response ? error.response.data : error.message)
    }
  }
)

// ── PUT /orderguidegroups/move-items  (move to top / bottom) ─────────────────
export const PutMoveToPosition = createAsyncThunk(
  "orderGuide/PutMoveToPosition",
  async ({ itemIds, position, modifyBY }, { rejectWithValue }) => {
    try {
      const URL = `${process.env.NEXT_PUBLIC_NRL_API_URL}/orderguidegroups/move-items`
      console.log("PutMoveToPosition URL:", URL)

      const response = await axios.put(
        URL,
        { itemIds, position, modifyBY },
        {
          headers: {
            Accept: "application/json",
            Authorization: `${process.env.NEXT_PUBLIC_AUTH_TOKEN}`,
          },
        }
      )

      if (response.data?.success === false) {
        throw new Error(response.data?.Msg || response.data?.message || "Failed to move items.")
      }

      return response.data
    } catch (error) {
      return rejectWithValue(error.response ? error.response.data : error.message)
    }
  }
)

// ── POST /orderguidegroups/duplicate-items ────────────────────────────────────
export const PostDuplicateItems = createAsyncThunk(
  "orderGuide/PostDuplicateItems",
  async ({ itemIds, targetOrderGuideGroupID, newGroupName, createdBY }, { rejectWithValue }) => {
    try {
      const URL = `${process.env.NEXT_PUBLIC_NRL_API_URL}/orderguidegroups/duplicate-items`
      console.log("PostDuplicateItems URL:", URL)

      const body = { itemIds, createdBY }
      if (newGroupName) body.newGroupName = newGroupName
      else body.targetOrderGuideGroupID = targetOrderGuideGroupID

      const response = await axios.post(URL, body, {
        headers: {
          Accept: "application/json",
          Authorization: `${process.env.NEXT_PUBLIC_AUTH_TOKEN}`,
        },
      })

      if (response.data?.success === false) {
        throw new Error(response.data?.Msg || response.data?.message || "Failed to duplicate items.")
      }

      return response.data
    } catch (error) {
      return rejectWithValue(error.response ? error.response.data : error.message)
    }
  }
)

// ── PUT /ordergroupitems/par/{orderGroupItemID}  (single PAR) ────────────────
export const PutUpdatePar = createAsyncThunk(
  "orderGuide/PutUpdatePar",
  async ({ orderGroupItemID, parValue, modifyBY }, { rejectWithValue }) => {
    try {
      const URL = `${process.env.NEXT_PUBLIC_NRL_API_URL}/ordergroupitems/par/${orderGroupItemID}`
      console.log("PutUpdatePar URL:", URL)

      const response = await axios.put(
        URL,
        { parValue, modifyBY },
        {
          headers: {
            Accept: "application/json",
            Authorization: `${process.env.NEXT_PUBLIC_AUTH_TOKEN}`,
          },
        }
      )

      return response.data
    } catch (error) {
      return rejectWithValue(error.response ? error.response.data : error.message)
    }
  }
)

// ── PUT /ordergroupitems/par/bulk  (bulk PAR update) ─────────────────────────
export const PutBulkPar = createAsyncThunk(
  "orderGuide/PutBulkPar",
  async ({ items, modifyBY }, { rejectWithValue }) => {
    try {
      const URL = `${process.env.NEXT_PUBLIC_NRL_API_URL}/ordergroupitems/par/bulk`
      console.log("PutBulkPar URL:", URL)

      const response = await axios.put(
        URL,
        { items, modifyBY },
        {
          headers: {
            Accept: "application/json",
            Authorization: `${process.env.NEXT_PUBLIC_AUTH_TOKEN}`,
          },
        }
      )

      if (response.data?.success === false) {
        throw new Error(response.data?.Msg || response.data?.message || "Failed to update PAR.")
      }

      return response.data
    } catch (error) {
      return rejectWithValue(error.response ? error.response.data : error.message)
    }
  }
)

// ── PUT /ordergroupitems/sequence  (drag-and-drop reorder) ───────────────────
export const PutItemSequence = createAsyncThunk(
  "orderGuide/PutItemSequence",
  async ({ orderGroupItemID, sequence, modifyBY }, { rejectWithValue }) => {
    try {
      const URL = `${process.env.NEXT_PUBLIC_NRL_API_URL}/ordergroupitems/sequence`
      console.log("PutItemSequence URL:", URL)

      const response = await axios.put(
        URL,
        { orderGroupItemID, sequence, modifyBY },
        {
          headers: {
            Accept: "application/json",
            Authorization: `${process.env.NEXT_PUBLIC_AUTH_TOKEN}`,
          },
        }
      )

      if (response.data?.success === false) {
        throw new Error(response.data?.Msg || response.data?.message || "Failed to reorder items.")
      }

      return response.data
    } catch (error) {
      return rejectWithValue(error.response ? error.response.data : error.message)
    }
  }
)

// ============================================================
// SLICE  (Crea pattern — createSlice with extraReducers builder)
// ============================================================
const postSlice = createSlice({
  name: "postSlice",
  initialState,
  reducers: {
    resetPostSlice: () => initialState,
    resetLoginStatus: (state) => {
      state.loginStatus = "idle"
      state.loginError = null
    },
    resetCartStatus: (state) => {
      state.postCartStatus = "idle"
      state.updateCartStatus = "idle"
      state.checkoutStatus = "idle"
      state.postCartError = null
    },
    resetOrderGuideStatus: (state) => {
      state.createOrderGuideStatus = "idle"
      state.updateOrderGuideStatus = "idle"
      state.deleteOrderGuideStatus = "idle"
      state.createOrderGuideGroupStatus = "idle"
      state.updateOrderGuideGroupStatus = "idle"
      state.deleteOrderGuideGroupStatus = "idle"
      state.deleteOrderGroupItemStatus = "idle"
    },
  },
  extraReducers(builder) {
    builder

      // ── PostLogin ─────────────────────────────────────────
      .addCase(PostLogin.pending, (state) => {
        state.loginStatus = "loading"
        state.loginLoading = true
        state.loginError = null
      })
      .addCase(PostLogin.fulfilled, (state, action) => {
        state.loginStatus = "succeeded"
        state.loginLoading = false
        state.loginData = action.payload
      })
      .addCase(PostLogin.rejected, (state, action) => {
        state.loginStatus = "failed"
        state.loginLoading = false
        state.loginError = action.payload || action.error.message
      })

      // ── PostCart ──────────────────────────────────────────
      .addCase(PostCart.pending, (state) => {
        state.postCartStatus = "loading"
        state.postCartLoading = true
        state.postCartError = null
      })
      .addCase(PostCart.fulfilled, (state, action) => {
        state.postCartStatus = "succeeded"
        state.postCartLoading = false
        state.postCartData = action.payload
      })
      .addCase(PostCart.rejected, (state, action) => {
        state.postCartStatus = "failed"
        state.postCartLoading = false
        state.postCartError = action.payload || action.error.message
      })

      // ── PutCartQuantity ───────────────────────────────────
      .addCase(PutCartQuantity.pending, (state) => {
        state.updateCartStatus = "loading"
        state.updateCartLoading = true
        state.updateCartError = null
      })
      .addCase(PutCartQuantity.fulfilled, (state, action) => {
        state.updateCartStatus = "succeeded"
        state.updateCartLoading = false
        state.updateCartData = action.payload
      })
      .addCase(PutCartQuantity.rejected, (state, action) => {
        state.updateCartStatus = "failed"
        state.updateCartLoading = false
        state.updateCartError = action.payload || action.error.message
      })

      // ── PostCheckout ──────────────────────────────────────
      .addCase(PostCheckout.pending, (state) => {
        state.checkoutStatus = "loading"
        state.checkoutLoading = true
        state.checkoutError = null
      })
      .addCase(PostCheckout.fulfilled, (state, action) => {
        state.checkoutStatus = "succeeded"
        state.checkoutLoading = false
        state.checkoutData = action.payload
      })
      .addCase(PostCheckout.rejected, (state, action) => {
        state.checkoutStatus = "failed"
        state.checkoutLoading = false
        state.checkoutError = action.payload || action.error.message
      })

      // ── PostReorder ───────────────────────────────────────
      .addCase(PostReorder.pending, (state) => {
        state.reorderStatus = "loading"
        state.reorderLoading = true
        state.reorderError = null
      })
      .addCase(PostReorder.fulfilled, (state, action) => {
        state.reorderStatus = "succeeded"
        state.reorderLoading = false
        state.reorderData = action.payload
      })
      .addCase(PostReorder.rejected, (state, action) => {
        state.reorderStatus = "failed"
        state.reorderLoading = false
        state.reorderError = action.payload || action.error.message
      })

      // ── PostOrderGuide ────────────────────────────────────
      .addCase(PostOrderGuide.pending, (state) => {
        state.createOrderGuideStatus = "loading"
        state.createOrderGuideLoading = true
        state.createOrderGuideError = null
      })
      .addCase(PostOrderGuide.fulfilled, (state, action) => {
        state.createOrderGuideStatus = "succeeded"
        state.createOrderGuideLoading = false
        state.createOrderGuideData = action.payload
      })
      .addCase(PostOrderGuide.rejected, (state, action) => {
        state.createOrderGuideStatus = "failed"
        state.createOrderGuideLoading = false
        state.createOrderGuideError = action.payload || action.error.message
      })

      // ── PutOrderGuide ─────────────────────────────────────
      .addCase(PutOrderGuide.pending, (state) => {
        state.updateOrderGuideStatus = "loading"
        state.updateOrderGuideLoading = true
        state.updateOrderGuideError = null
      })
      .addCase(PutOrderGuide.fulfilled, (state, action) => {
        state.updateOrderGuideStatus = "succeeded"
        state.updateOrderGuideLoading = false
        state.updateOrderGuideData = action.payload
      })
      .addCase(PutOrderGuide.rejected, (state, action) => {
        state.updateOrderGuideStatus = "failed"
        state.updateOrderGuideLoading = false
        state.updateOrderGuideError = action.payload || action.error.message
      })

      // ── DeleteOrderGuide ──────────────────────────────────
      .addCase(DeleteOrderGuide.pending, (state) => {
        state.deleteOrderGuideStatus = "loading"
        state.deleteOrderGuideLoading = true
        state.deleteOrderGuideError = null
      })
      .addCase(DeleteOrderGuide.fulfilled, (state, action) => {
        state.deleteOrderGuideStatus = "succeeded"
        state.deleteOrderGuideLoading = false
        state.deleteOrderGuideData = action.payload
      })
      .addCase(DeleteOrderGuide.rejected, (state, action) => {
        state.deleteOrderGuideStatus = "failed"
        state.deleteOrderGuideLoading = false
        state.deleteOrderGuideError = action.payload || action.error.message
      })

      // ── PutOrderGuideSequence ─────────────────────────────
      .addCase(PutOrderGuideSequence.pending, (state) => {
        state.orderGuideSequenceStatus = "loading"
        state.orderGuideSequenceLoading = true
      })
      .addCase(PutOrderGuideSequence.fulfilled, (state, action) => {
        state.orderGuideSequenceStatus = "succeeded"
        state.orderGuideSequenceLoading = false
        state.orderGuideSequenceData = action.payload
      })
      .addCase(PutOrderGuideSequence.rejected, (state, action) => {
        state.orderGuideSequenceStatus = "failed"
        state.orderGuideSequenceLoading = false
        state.orderGuideSequenceError = action.payload || action.error.message
      })

      // ── PostOrderGuideGroup ───────────────────────────────
      .addCase(PostOrderGuideGroup.pending, (state) => {
        state.createOrderGuideGroupStatus = "loading"
        state.createOrderGuideGroupLoading = true
        state.createOrderGuideGroupError = null
      })
      .addCase(PostOrderGuideGroup.fulfilled, (state, action) => {
        state.createOrderGuideGroupStatus = "succeeded"
        state.createOrderGuideGroupLoading = false
        state.createOrderGuideGroupData = action.payload
      })
      .addCase(PostOrderGuideGroup.rejected, (state, action) => {
        state.createOrderGuideGroupStatus = "failed"
        state.createOrderGuideGroupLoading = false
        state.createOrderGuideGroupError = action.payload || action.error.message
      })

      // ── PutOrderGuideGroup ────────────────────────────────
      .addCase(PutOrderGuideGroup.pending, (state) => {
        state.updateOrderGuideGroupStatus = "loading"
        state.updateOrderGuideGroupLoading = true
        state.updateOrderGuideGroupError = null
      })
      .addCase(PutOrderGuideGroup.fulfilled, (state, action) => {
        state.updateOrderGuideGroupStatus = "succeeded"
        state.updateOrderGuideGroupLoading = false
        state.updateOrderGuideGroupData = action.payload
      })
      .addCase(PutOrderGuideGroup.rejected, (state, action) => {
        state.updateOrderGuideGroupStatus = "failed"
        state.updateOrderGuideGroupLoading = false
        state.updateOrderGuideGroupError = action.payload || action.error.message
      })

      // ── DeleteOrderGuideGroup ─────────────────────────────
      .addCase(DeleteOrderGuideGroup.pending, (state) => {
        state.deleteOrderGuideGroupStatus = "loading"
        state.deleteOrderGuideGroupLoading = true
        state.deleteOrderGuideGroupError = null
      })
      .addCase(DeleteOrderGuideGroup.fulfilled, (state, action) => {
        state.deleteOrderGuideGroupStatus = "succeeded"
        state.deleteOrderGuideGroupLoading = false
        state.deleteOrderGuideGroupData = action.payload
      })
      .addCase(DeleteOrderGuideGroup.rejected, (state, action) => {
        state.deleteOrderGuideGroupStatus = "failed"
        state.deleteOrderGuideGroupLoading = false
        state.deleteOrderGuideGroupError = action.payload || action.error.message
      })

      // ── DeleteOrderGroupItem ──────────────────────────────
      .addCase(DeleteOrderGroupItem.pending, (state) => {
        state.deleteOrderGroupItemStatus = "loading"
        state.deleteOrderGroupItemLoading = true
        state.deleteOrderGroupItemError = null
      })
      .addCase(DeleteOrderGroupItem.fulfilled, (state, action) => {
        state.deleteOrderGroupItemStatus = "succeeded"
        state.deleteOrderGroupItemLoading = false
        state.deleteOrderGroupItemData = action.payload
      })
      .addCase(DeleteOrderGroupItem.rejected, (state, action) => {
        state.deleteOrderGroupItemStatus = "failed"
        state.deleteOrderGroupItemLoading = false
        state.deleteOrderGroupItemError = action.payload || action.error.message
      })

      // ── PutMoveItems ──────────────────────────────────────
      .addCase(PutMoveItems.pending, (state) => {
        state.moveItemsStatus = "loading"
        state.moveItemsLoading = true
      })
      .addCase(PutMoveItems.fulfilled, (state, action) => {
        state.moveItemsStatus = "succeeded"
        state.moveItemsLoading = false
        state.moveItemsData = action.payload
      })
      .addCase(PutMoveItems.rejected, (state, action) => {
        state.moveItemsStatus = "failed"
        state.moveItemsLoading = false
        state.moveItemsError = action.payload || action.error.message
      })

      // ── PutMoveToPosition ─────────────────────────────────
      .addCase(PutMoveToPosition.pending, (state) => {
        state.moveToTopStatus = "loading"
        state.moveToTopLoading = true
      })
      .addCase(PutMoveToPosition.fulfilled, (state, action) => {
        state.moveToTopStatus = "succeeded"
        state.moveToTopLoading = false
        state.moveToTopData = action.payload
      })
      .addCase(PutMoveToPosition.rejected, (state, action) => {
        state.moveToTopStatus = "failed"
        state.moveToTopLoading = false
        state.moveToTopError = action.payload || action.error.message
      })

      // ── PostDuplicateItems ────────────────────────────────
      .addCase(PostDuplicateItems.pending, (state) => {
        state.duplicateItemsStatus = "loading"
        state.duplicateItemsLoading = true
      })
      .addCase(PostDuplicateItems.fulfilled, (state, action) => {
        state.duplicateItemsStatus = "succeeded"
        state.duplicateItemsLoading = false
        state.duplicateItemsData = action.payload
      })
      .addCase(PostDuplicateItems.rejected, (state, action) => {
        state.duplicateItemsStatus = "failed"
        state.duplicateItemsLoading = false
        state.duplicateItemsError = action.payload || action.error.message
      })

      // ── PutUpdatePar ──────────────────────────────────────
      .addCase(PutUpdatePar.pending, (state) => {
        state.updateParStatus = "loading"
        state.updateParLoading = true
      })
      .addCase(PutUpdatePar.fulfilled, (state, action) => {
        state.updateParStatus = "succeeded"
        state.updateParLoading = false
        state.updateParData = action.payload
      })
      .addCase(PutUpdatePar.rejected, (state, action) => {
        state.updateParStatus = "failed"
        state.updateParLoading = false
        state.updateParError = action.payload || action.error.message
      })

      // ── PutBulkPar ────────────────────────────────────────
      .addCase(PutBulkPar.pending, (state) => {
        state.updateBulkParStatus = "loading"
        state.updateBulkParLoading = true
      })
      .addCase(PutBulkPar.fulfilled, (state, action) => {
        state.updateBulkParStatus = "succeeded"
        state.updateBulkParLoading = false
        state.updateBulkParData = action.payload
      })
      .addCase(PutBulkPar.rejected, (state, action) => {
        state.updateBulkParStatus = "failed"
        state.updateBulkParLoading = false
        state.updateBulkParError = action.payload || action.error.message
      })

      // ── PutItemSequence ───────────────────────────────────
      .addCase(PutItemSequence.pending, (state) => {
        state.itemSequenceStatus = "loading"
        state.itemSequenceLoading = true
      })
      .addCase(PutItemSequence.fulfilled, (state, action) => {
        state.itemSequenceStatus = "succeeded"
        state.itemSequenceLoading = false
        state.itemSequenceData = action.payload
      })
      .addCase(PutItemSequence.rejected, (state, action) => {
        state.itemSequenceStatus = "failed"
        state.itemSequenceLoading = false
        state.itemSequenceError = action.payload || action.error.message
      })
  },
})

export const {
  resetPostSlice,
  resetLoginStatus,
  resetCartStatus,
  resetOrderGuideStatus,
} = postSlice.actions

// ============================================================
// SELECTORS
// ============================================================
// Auth
export const selectLoginData    = (state) => state.postSlice.loginData
export const selectLoginLoading = (state) => state.postSlice.loginLoading
export const selectLoginStatus  = (state) => state.postSlice.loginStatus
export const selectLoginError   = (state) => state.postSlice.loginError

// Cart POST
export const selectPostCartStatus  = (state) => state.postSlice.postCartStatus
export const selectPostCartLoading = (state) => state.postSlice.postCartLoading
export const selectPostCartError   = (state) => state.postSlice.postCartError

// Cart PUT
export const selectUpdateCartStatus  = (state) => state.postSlice.updateCartStatus
export const selectUpdateCartLoading = (state) => state.postSlice.updateCartLoading

// Checkout
export const selectCheckoutData    = (state) => state.postSlice.checkoutData
export const selectCheckoutStatus  = (state) => state.postSlice.checkoutStatus
export const selectCheckoutLoading = (state) => state.postSlice.checkoutLoading
export const selectCheckoutError   = (state) => state.postSlice.checkoutError

// Reorder
export const selectReorderStatus  = (state) => state.postSlice.reorderStatus
export const selectReorderLoading = (state) => state.postSlice.reorderLoading
export const selectReorderError   = (state) => state.postSlice.reorderError

// Order Guide
export const selectCreateOrderGuideStatus = (state) => state.postSlice.createOrderGuideStatus
export const selectUpdateOrderGuideStatus = (state) => state.postSlice.updateOrderGuideStatus
export const selectDeleteOrderGuideStatus = (state) => state.postSlice.deleteOrderGuideStatus

// Order Guide Group
export const selectCreateOrderGuideGroupStatus = (state) => state.postSlice.createOrderGuideGroupStatus
export const selectUpdateOrderGuideGroupStatus = (state) => state.postSlice.updateOrderGuideGroupStatus
export const selectDeleteOrderGuideGroupStatus = (state) => state.postSlice.deleteOrderGuideGroupStatus

// Order Group Item
export const selectDeleteOrderGroupItemStatus = (state) => state.postSlice.deleteOrderGroupItemStatus

// PAR
export const selectUpdateParStatus    = (state) => state.postSlice.updateParStatus
export const selectUpdateBulkParStatus = (state) => state.postSlice.updateBulkParStatus

export default postSlice.reducer