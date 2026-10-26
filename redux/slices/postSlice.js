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

// ── POST /ordergroupitems/add-to-cart ─────────────────────────────────────────
export const PostCart = createAsyncThunk(
  "cart/PostCart",
  async ({ data }, { rejectWithValue }) => {
    try {
      const URL = `${process.env.NEXT_PUBLIC_NRL_API_URL}/ordergroupitems/add-to-cart`

      const response = await axios.post(URL, data, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `${process.env.NEXT_PUBLIC_AUTH_TOKEN}`,
        },
      })

      const result = response.data
      if (result?.success === false) {
        return rejectWithValue(result?.Msg || result?.message || "Failed to add items to cart.")
      }

      return result
    } catch (error) {
      return rejectWithValue(error.response ? error.response.data : error.message)
    }
  }
)

// ── PUT /cart/customer/{custnmbr}/item/{itemNumber} ──────────────────────────
export const PutCartQuantity = createAsyncThunk(
  "cart/PutCartQuantity",
  async ({ itemNumber, quantity }, { rejectWithValue }) => {
    try {
      const custnmbr = localStorage.getItem("custnmbr")
      const URL = `${process.env.NEXT_PUBLIC_NRL_API_URL}/cart/customer/${custnmbr}/item/${itemNumber}`

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




// ── CART_SIDEBAR_Proceed_to_checkout_POST ──
export const proceedtoCheckoutPOST = createAsyncThunk(
  "cartsidebar/Post_proceedtocheckout",
  async (
    { custNmbr, deliveryDate, cutOffTime, notes, discountCode, poNumber },
    { rejectWithValue }
  ) => {
    try {
      const URL = `${process.env.NEXT_PUBLIC_NRL_API_URL}/checkout`

      const requestBody = {
        custNmbr,
        deliveryDate, // "2026-09-21"
        cutOffTime, // "14:00:00"
        notes,
        discountCode,
        poNumber,
        createType: "Web",
      }

      const response = await axios.post(URL, requestBody, {
        headers: {
          Accept: "application/json",
          Authorization: `${process.env.NEXT_PUBLIC_AUTH_TOKEN}`,
        },
      })

      if (response.data?.success === false) {
        throw new Error(
          response.data?.Msg || response.data?.message || response.data?.error || "Checkout failed."
        )
      }

      return response.data // { success, orderNumber, orderAmount }
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


// ── POST /cartimport/import-document (multipart: CustNmbr + File) ────────────
export const PostCartImportDocument = createAsyncThunk(
  "cart/PostCartImportDocument",
  async ({ custnmbr, file }, { rejectWithValue }) => {
    try {
      const URL = `${process.env.NEXT_PUBLIC_NRL_API_URL}/cartimport/import-document`

      const formData = new FormData()
      formData.append("CustNmbr", custnmbr)
      formData.append("File", file)

      // Don't set Content-Type yourself: the browser adds the multipart boundary
      const response = await axios.post(URL, formData, {
        headers: {
          Accept: "application/json",
          Authorization: `${process.env.NEXT_PUBLIC_AUTH_TOKEN}`,
        },
      })

      const result = response.data

      if (result?.success === false) {
        return rejectWithValue(
          result?.Msg || result?.message || "Failed to import document.",
        )
      }

      return {
        message: result?.message || "Items added to cart.",
        added: Array.isArray(result?.added) ? result.added : [],
        skipped: Array.isArray(result?.skipped) ? result.skipped : [],
      }
    } catch (error) {
      const data = error.response?.data
      return rejectWithValue(
        data?.Msg ||
          data?.message ||
          (typeof data === "string" ? data : null) ||
          error.message,
      )
    }
  },
)

//Catelog/ADD TO CART// POST===================================
export const PostCartcatelog = createAsyncThunk(
  "Catelog/CART_POST",
  async (
    { custnmbr, itemNumber, itemName, quantity, cartGroupID, source = "App/Web" },
    { rejectWithValue }
  ) => {
    try {
      const URL = `${process.env.NEXT_PUBLIC_NRL_API_URL}/cart`;

      const response = await axios.post(
        URL,
        {
          CUSTNMBR: custnmbr,
          ItemNumber: itemNumber,
          ItemName: itemName,
          Quantity: quantity,
          Source: source,
          cartGroupID,
        },
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `${process.env.NEXT_PUBLIC_AUTH_TOKEN}`,
          },
        }
      );

      if (response.data?.success === false) {
        throw new Error(
          response.data?.Msg || response.data?.message || "Failed to add item to cart."
        );
      }

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// ── POST /cartgroups ─────────────────────────────────────

export const PostCartGroup = createAsyncThunk(
  "cartGroup/PostCartGroup",
  async (
      {
          custnmbr,
          name,
          fulfillmentDate,
          visibility,
          createdBY,
        },
    { rejectWithValue }
  ) => {
    try {
      const URL = `${process.env.NEXT_PUBLIC_NRL_API_URL}/cartgroups`;

      const response = await axios.post(
        URL,
        {
          custnmbr,
          name,
          fulfillmentDate,
          visibility,
          createdBY,
        },
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `${process.env.NEXT_PUBLIC_AUTH_TOKEN}`,
          },
        }
      );

      if (response.data?.success === false) {
        throw new Error(
          response.data?.Msg ||
          response.data?.message ||
          "Failed to create cart."
        );
      }

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || error.message
      );
    }
  }
);


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

// ── PUT /Add to Quick orders orderguides/{orderGuideID} ──────────────────────────────────────────
export const PutOrderGuideQuikorders = createAsyncThunk(
  "orderGuide/Add to Quick orders",
  async ({ orderGuideID, quickOrder, modifyBY }, { rejectWithValue }) => {
    try {
      const URL = `${process.env.NEXT_PUBLIC_NRL_API_URL}/orderguides/quickorder/${orderGuideID}`
      console.log("PutOrderGuideQuikorders URL:", URL)

      const response = await axios.put(
        URL,
        { quickOrder, modifyBY },
        {
          headers: {
            Accept: "application/json",
            Authorization: `${process.env.NEXT_PUBLIC_AUTH_TOKEN}`,
          },
        }
      )

      if (response.data?.success === false) {
        throw new Error(response.data?.Msg || response.data?.message || "Failed to update order Guide Quik orders.")
      }

      return response.data
    } catch (error) {
      return rejectWithValue(error.response ? error.response.data : error.message)
    }
  }
)

// ── POST /quick order to add to cart ────────────────────────────────────────────────────
export const QuickOrdeguidetocartPOST = createAsyncThunk(
  "Overview/QuickOrderguideToAddtocart",
  async ({ data }, { rejectWithValue }) => {
    try {
      const URL = `${process.env.NEXT_PUBLIC_NRL_API_URL}/quickorder/add-to-cart`
      console.log("PostOrderGuideGroup URL:", URL)

      const response = await axios.post(
        URL,
        data,
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
  async ({ custnmbr, orderGuideIds }, { rejectWithValue }) => {
    try {
      const URL = `${process.env.NEXT_PUBLIC_NRL_API_URL}/orderguides/sequence`;

      const response = await axios.put(
        URL,
        { custnmbr, orderGuideIds },
        {
          headers: {
            Accept: "application/json",
            Authorization: `${process.env.NEXT_PUBLIC_AUTH_TOKEN}`,
          },
        }
      );

      if (response.data?.success === false) {
        throw new Error(
          response.data?.Msg || response.data?.message || "Failed to reorder order guides."
        );
      }

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response ? error.response.data : error.message);
    }
  }
);

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
        return rejectWithValue(
          response.data?.Msg || response.data?.message || "Failed to delete group.",
        )
      }

      return { orderGuideGroupID, ...response.data }
    } catch (error) {
      // always reject with a plain string so the UI can toast it directly
      const data = error.response?.data
      return rejectWithValue(
        data?.Msg || data?.message || data?.error || error.message || "Failed to delete group.",
      )
    }
  },
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
        return rejectWithValue(
          response.data?.Msg || response.data?.message || "Failed to delete item.",
        )
      }

      return { orderGroupItemID, ...response.data }
    } catch (error) {
      const data = error.response?.data
      return rejectWithValue(
        data?.Msg || data?.message || data?.error || error.message || "Failed to delete item.",
      )
    }
  },
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
  async ({ orderGuideGroupID, orderGroupItemIds, modifyBY }, { rejectWithValue }) => {
    try {
      const URL = `${process.env.NEXT_PUBLIC_NRL_API_URL}/ordergroupitems/sequence`
      console.log("PutItemSequence URL:", URL)

      const response = await axios.put(
        URL,
        { orderGuideGroupID, orderGroupItemIds, modifyBY },
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


//-POST ITEMS RATINGS IN MY ORDER SCREEN-------------------------------------------------->
export const myOrderitemsRating = createAsyncThunk(
  "MyOrder/itemsRatings",
  async ({ data }, { rejectWithValue }) => {
    try {
      const URL = `${process.env.NEXT_PUBLIC_NRL_API_URL}/itemratings/batch`
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

    resetOrderGuideStatus: (state) => {
      state.createOrderGuideStatus = "idle"
      state.updateOrderGuideStatus = "idle"
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



     
  },
})

export const {
  resetPostSlice,
  resetLoginStatus,
  // resetCartStatus,
  resetOrderGuideStatus,
} = postSlice.actions


export default postSlice.reducer
