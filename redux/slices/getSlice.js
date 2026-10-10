import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import axios from "axios"

// ─── Inline API helper (no lib/api dependency — Crea pattern) ───────────────
// All axios calls are written directly inside each thunk's try block.
// Base URL and token come from environment variables.

// ============================================================
// INITIAL STATE  (Crea pattern — Data / Loading / Status / Error per thunk)
// ============================================================
const initialState = {

  // ── CART_GET /overview ─────────────────────────────
  GetCartData: [],
  GetCartLoading: false,
  GetCartStatus: "idle",
  GetCartError: null,

  // ── CARTGROUPS_GET /overview ─────────────────────────────
  GetCartGroupsData: null,
  GetCartGroupsLoading: false,
  GetCartGroupsStatus: "idle",
  GetCartGroupsError: null,



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

  // ── Ivoice GET /Customer Invoice ────
  customerInvoicesdata: [],
  customerInvoicesloading: false,
  customerInvoicesStatus: "idle",
  customerInvoiceserror: null,
  // Invoice details
  GetInvoicedetailsdata: null,
  GetInvoicedetailsloading: false,
  GetInvoicedetailsStatus: "idle",
  GetInvoicedetailserror: null,

  // InvoicePDF details
  GetinvoicePDFloading: false,
  GetinvoicePDFerror: null,

  error: null,
}

// ============================================================
// ASYNC THUNKS — GET
// (axios written inline — no lib/api folder — Crea architecture)
// ============================================================


// ── GetCart ─────────────────────────────────────
export const GetCart = createAsyncThunk(
  "Overview/GetCartAPI",
  async (_, { rejectWithValue }) => {
    try {
      const custnmbr = localStorage.getItem("custnmbr");

      const URL = `${process.env.NEXT_PUBLIC_NRL_API_URL}/cart/customer/${custnmbr}`;

      const response = await axios.get(URL, {
        headers: {
          Accept: "application/json",
          Authorization: `${process.env.NEXT_PUBLIC_AUTH_TOKEN}`,
        },
      });

      const result = response.data;

      if (result?.success === false) {
        throw new Error(
          result?.Msg ||
          result?.message ||
          "Failed to fetch order guides."
        );
      }

      const list = Array.isArray(result)
        ? result
        : Array.isArray(result?.data)
          ? result.data
          : [];

      return list;
    } catch (error) {
      return rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);


// ── GetCartGroups ─────────────────────────────────────
export const GetCartGroups = createAsyncThunk(
  "Overview/GetCartGroupsAPI",
  async (_, { rejectWithValue }) => {
    try {
      const custnmbr = localStorage.getItem("custnmbr");

      const URL = `${process.env.NEXT_PUBLIC_NRL_API_URL}/cartgroups/customer/${custnmbr}`;

      const response = await axios.get(URL, {
        headers: {
          Accept: "application/json",
          Authorization: `${process.env.NEXT_PUBLIC_AUTH_TOKEN}`,
        },
      });

      const result = response.data;

      if (result?.success === false) {
        throw new Error(
          result?.Msg ||
          result?.message ||
          "Failed to fetch cart groups."
        );
      }

      return result;
    } catch (error) {
      return rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);




// ── GET /items ───────────────────────────────────────────────────────────────
export const GetItems = createAsyncThunk(
  "items/GetItems",
  async (_, { rejectWithValue }) => {
    try {
      const custnmbr = localStorage.getItem("custnmbr");
      const URL = `${process.env.NEXT_PUBLIC_NRL_API_URL}/items?custNmbr=${custnmbr}`

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

      // accept a bare array or { data: [...] }
      const list = Array.isArray(result) ? result : result?.data ?? []

      // { item: {...}, inOrderGuide } → { ...item, inOrderGuide }
      return list.map((entry) => ({
        ...(entry.item ?? entry),
        inOrderGuide: entry.inOrderGuide ?? false,
      }))
    } catch (error) {
      return rejectWithValue(error.response ? error.response.data : error.message)
    }
  }
)

// ── GET /customers/{custnmbr}/orders ─────────────────────────────────────────
export const GetCustomerOrders = createAsyncThunk(
  "orders/GetCustomerOrders",
  async (_, { rejectWithValue }) => {
    try {
      const custnmbr = localStorage.getItem("custnmbr");
      const URL = `${process.env.NEXT_PUBLIC_NRL_API_URL}/customers/${custnmbr}/orders`
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
      return { custnmbr, orders }
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

      const URL = `${process.env.NEXT_PUBLIC_NRL_API_URL}/orderguides/customer/${custnmbr}`;

      const response = await axios.get(URL, {
        headers: {
          Accept: "application/json",
          Authorization: `${process.env.NEXT_PUBLIC_AUTH_TOKEN}`,
        },
      });

      const result = response.data;

      if (result?.success === false) {
        throw new Error(
          result?.Msg ||
          result?.message ||
          "Failed to fetch order guides."
        );
      }

      const list = Array.isArray(result)
        ? result
        : Array.isArray(result?.data)
          ? result.data
          : [];

      return list;
    } catch (error) {
      return rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);


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


// ── GET /ORDERGUIDE/Download PAR Sheet ───────────────────────────
export const GetOrderGuidePARsheet = createAsyncThunk(
  "orderGuide/PARsheetdownload",
  async (orderGuideID, { rejectWithValue }) => {
    try {
      const URL = `${process.env.NEXT_PUBLIC_NRL_API_URL}/orderguides/par-sheet/${orderGuideID}`

      const response = await axios.get(URL, {
        responseType: "blob", // required for file downloads
        headers: {
          Accept: "*/*",
          Authorization: `${process.env.NEXT_PUBLIC_AUTH_TOKEN}`,
        },
      })

      const contentType =
        response.headers["content-type"] || "application/octet-stream"

      // Some APIs return a JSON error body with HTTP 200
      if (contentType.includes("application/json")) {
        const text = await response.data.text()
        let json = null
        try { json = JSON.parse(text) } catch { }
        throw new Error(json?.Msg || json?.message || "Failed to download PAR sheet.")
      }

      // File name: from Content-Disposition if available, otherwise build one
      const disposition = response.headers["content-disposition"] || ""
      const match = disposition.match(/filename\*?=(?:UTF-8'')?"?([^";]+)"?/i)
      let fileName = match ? decodeURIComponent(match[1]) : null

      if (!fileName) {
        const ext = contentType.includes("pdf")
          ? "pdf"
          : contentType.includes("csv")
            ? "csv"
            : contentType.includes("spreadsheet") || contentType.includes("excel")
              ? "xlsx"
              : "xlsx" // <-- change if your API returns another type
        fileName = `PAR-Sheet-${orderGuideID}.${ext}`
      }

      // Trigger the browser download
      const blobUrl = window.URL.createObjectURL(
        new Blob([response.data], { type: contentType }),
      )
      const link = document.createElement("a")
      link.href = blobUrl
      link.download = fileName
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(blobUrl)

      return { fileName }
    } catch (error) {
      // With responseType "blob", error bodies also arrive as a Blob
      if (error.response?.data instanceof Blob) {
        try {
          const text = await error.response.data.text()
          return rejectWithValue(JSON.parse(text))
        } catch {
          return rejectWithValue(`Failed to download PAR sheet. HTTP ${error.response.status}`)
        }
      }
      return rejectWithValue(error.response ? error.response.data : error.message)
    }
  }
)



// ── GET /Invoice/{CustomerInvoiceItems} ───────────────────────────
export const GetCustomerInvoiceItems = createAsyncThunk(
  "Invoice/CustomerInvoiceItems",
  async (_, { rejectWithValue }) => {
    try {
      const custnmbr = localStorage.getItem("custnmbr");



      const URL = `${process.env.NEXT_PUBLIC_NRL_API_URL}/invoices/customer/${custnmbr}`
      console.log("CustomerInvoiceItems URL:", URL)

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

// ── GET /invoices/{invoiceNumber}  (invoice details) ─────────────────────────
export const GetInvoicedetails = createAsyncThunk(
  "Invoice_list/Invoice_Details",
  async (INVNumber, { rejectWithValue }) => {
    try {
      const URL = `${process.env.NEXT_PUBLIC_NRL_API_URL}/invoices/${encodeURIComponent(INVNumber)}`
      console.log("Invoice_Details URL:", URL)

      const response = await axios.get(URL, {
        headers: {
          Accept: "application/json",
          Authorization: `${process.env.NEXT_PUBLIC_AUTH_TOKEN}`,
        },
      })

      const result = response.data

      if (result?.success === false) {
        throw new Error(result?.Msg || result?.message || "Failed to fetch invoice details.")
      }

      // details endpoint: data is an OBJECT (not an array).
      // The old line returned [] here, which is why nothing showed up.
      const data = result?.data
      return data && !Array.isArray(data) ? data : null
    } catch (error) {
      return rejectWithValue(error.response ? error.response.data : error.message)
    }
  }
)

// ── GET /Invoice/Download Invoice_PDF ───────────────────────────
// export const GetinvoicePDF = createAsyncThunk(
//   "INVOICE_GET/InvoicePDF",
//   async (INVNumber, { rejectWithValue }) => {
//     try {
//       const URL = `${process.env.NEXT_PUBLIC_NRL_API_URL}/invoices/pdf/${INVNumber}`

//       const response = await axios.get(URL, {
//         responseType: "blob", // required for file downloads
//         headers: {
//           Accept: "*/*",
//           Authorization: `${process.env.NEXT_PUBLIC_AUTH_TOKEN}`,
//         },
//       })

//       const contentType =
//         response.headers["content-type"] || "application/octet-stream"

//       // Some APIs return a JSON error body with HTTP 200
//       if (contentType.includes("application/json")) {
//         const text = await response.data.text()
//         let json = null
//         try { json = JSON.parse(text) } catch {}
//         throw new Error(json?.Msg || json?.message || "Failed to download PAR sheet.")
//       }

//       // File name: from Content-Disposition if available, otherwise build one
//       const disposition = response.headers["content-disposition"] || ""
//       const match = disposition.match(/filename\*?=(?:UTF-8'')?"?([^";]+)"?/i)
//       let fileName = match ? decodeURIComponent(match[1]) : null

//       if (!fileName) {
//         const ext = contentType.includes("pdf")
//           ? "pdf"
//           : contentType.includes("csv")
//             ? "csv"
//             : contentType.includes("spreadsheet") || contentType.includes("excel")
//               ? "xlsx"
//               : "xlsx" // <-- change if your API returns another type
//         fileName = `PAR-Sheet-${orderGuideID}.${ext}`
//       }

//       // Trigger the browser download
//       const blobUrl = window.URL.createObjectURL(
//         new Blob([response.data], { type: contentType }),
//       )
//       const link = document.createElement("a")
//       link.href = blobUrl
//       link.download = fileName
//       document.body.appendChild(link)
//       link.click()
//       link.remove()
//       window.URL.revokeObjectURL(blobUrl)

//       return { fileName }
//     } catch (error) {
//       // With responseType "blob", error bodies also arrive as a Blob
//       if (error.response?.data instanceof Blob) {
//         try {
//           const text = await error.response.data.text()
//           return rejectWithValue(JSON.parse(text))
//         } catch {
//           return rejectWithValue(`Failed to download PAR sheet. HTTP ${error.response.status}`)
//         }
//       }
//       return rejectWithValue(error.response ? error.response.data : error.message)
//     }
//   }
// )


export const GetinvoicePDF = createAsyncThunk(
  "Invoice/InvoicePDF",
  async (invoiceNumber, { rejectWithValue }) => {
    try {
      const URL = `${process.env.NEXT_PUBLIC_NRL_API_URL}/invoices/pdf/${encodeURIComponent(invoiceNumber)}` // <-- your real PDF endpoint

      const response = await axios.get(URL, {
        responseType: "blob",
        headers: {
          Accept: "application/pdf",
          Authorization: `${process.env.NEXT_PUBLIC_AUTH_TOKEN}`,
        },
      })

      const blobUrl = window.URL.createObjectURL(
        new Blob([response.data], { type: "application/pdf" }),
      )
      const a = document.createElement("a")
      a.href = blobUrl
      a.download = `${invoiceNumber}.pdf`
      document.body.appendChild(a)
      a.click()
      a.remove()
      window.URL.revokeObjectURL(blobUrl)

      return { invoiceNumber }
    } catch (error) {
      return rejectWithValue(error.response ? error.message : error.message)
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

      // ── GetcartAPI ──────────────────────────────────────────
      .addCase(GetCart.pending, (state) => {
        state.GetCartStatus = "loading"
        state.GetCartLoading = true
        state.GetCartError = null
      })
      .addCase(GetCart.fulfilled, (state, action) => {
        state.GetCartStatus = "succeeded"
        state.GetCartLoading = false
        state.GetCartData = action.payload
      })
      .addCase(GetCart.rejected, (state, action) => {
        state.GetCartStatus = "failed"
        state.GetCartLoading = false
        state.GetCartError = action.payload || action.error.message
        state.GetCartData = []
      })


      // ── GetCartGroups API ─────────────────────────────────
      .addCase(GetCartGroups.pending, (state) => {
        state.GetCartGroupsStatus = "loading";
        state.GetCartGroupsLoading = true;
        state.GetCartGroupsError = null;
      })

      .addCase(GetCartGroups.fulfilled, (state, action) => {
        state.GetCartGroupsStatus = "succeeded";
        state.GetCartGroupsLoading = false;
        state.GetCartGroupsData = action.payload;
      })

      .addCase(GetCartGroups.rejected, (state, action) => {
        state.GetCartGroupsStatus = "failed";
        state.GetCartGroupsLoading = false;
        state.GetCartGroupsError =
          action.payload || action.error.message;
        state.GetCartGroupsData = null;
      })


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

      // ── GetCustomerInvoiceItems_GET addcase ──────────────────────────────────────────
      .addCase(GetCustomerInvoiceItems.pending, (state) => {
        state.customerInvoicesStatus = "loading"
        state.customerInvoicesloading = true
        state.itemsError = null
      })
      .addCase(GetCustomerInvoiceItems.fulfilled, (state, action) => {
        state.customerInvoicesStatus = "succeeded"
        state.customerInvoicesloading = false
        state.customerInvoicesdata = action.payload
      })
      .addCase(GetCustomerInvoiceItems.rejected, (state, action) => {
        state.customerInvoicesStatus = "failed"
        state.customerInvoicesloading = false
        state.customerInvoiceserror = action.payload || action.error.message
        state.customerInvoicesdata = []
      })


      // ── Invoice / GetInvoicedetails_GET addcase ──────────────────────────────────────────
      // ── Invoice details ────────────────────────────────────────────────────
      .addCase(GetInvoicedetails.pending, (state) => {
        state.GetInvoicedetailsStatus = "loading"
        state.GetInvoicedetailsloading = true
        state.GetInvoicedetailserror = null // removed state.itemsError
      })
      .addCase(GetInvoicedetails.fulfilled, (state, action) => {
        state.GetInvoicedetailsStatus = "succeeded"
        state.GetInvoicedetailsloading = false
        state.GetInvoicedetailsdata = action.payload // object or null
      })
      .addCase(GetInvoicedetails.rejected, (state, action) => {
        state.GetInvoicedetailsStatus = "failed"
        state.GetInvoicedetailsloading = false
        state.GetInvoicedetailserror = action.payload || action.error.message
        state.GetInvoicedetailsdata = null
      })



      // Invoice_PDF
      .addCase(GetinvoicePDF.pending, (state) => {
        state.GetinvoicePDFloading = true
        state.GetinvoicePDFerror = null
      })
      .addCase(GetinvoicePDF.fulfilled, (state) => {
        state.GetinvoicePDFloading = false
      })
      .addCase(GetinvoicePDF.rejected, (state, action) => {
        state.GetinvoicePDFloading = false
        state.GetinvoicePDFerror = action.payload || action.error.message
      })
  },
})

export const { resetGetSlice, clearOrderGroupItems, clearOrderGuideGroups } = getSlice.actions

// ============================================================
// SELECTORS
// ============================================================
// Items
// export const selectItemsData        = (state) => state.getSlice.itemsData
// export const selectItemsLoading     = (state) => state.getSlice.itemsLoading
// export const selectItemsStatus      = (state) => state.getSlice.itemsStatus
// export const selectItemsError       = (state) => state.getSlice.itemsError

// Orders
// export const selectOrdersData       = (state) => state.getSlice.ordersData
// export const selectOrdersLoading    = (state) => state.getSlice.ordersLoading
// export const selectOrdersStatus     = (state) => state.getSlice.ordersStatus
// export const selectOrdersError      = (state) => state.getSlice.ordersError
// export const selectOrdersCustomerId = (state) => state.getSlice.ordersCustomerId

// Order Guide List
// export const selectOrderGuideListData    = (state) => state.getSlice.orderGuideListData
// export const selectOrderGuideListLoading = (state) => state.getSlice.orderGuideListLoading
// export const selectOrderGuideListStatus  = (state) => state.getSlice.orderGuideListStatus

// Order Guide Groups
// export const selectOrderGuideGroupsData    = (state) => state.getSlice.orderGuideGroupsData
// export const selectOrderGuideGroupsLoading = (state) => state.getSlice.orderGuideGroupsLoading
// export const selectOrderGuideGroupsStatus  = (state) => state.getSlice.orderGuideGroupsStatus

// Order Group Items
// export const selectOrderGroupItemsData    = (state) => state.getSlice.orderGroupItemsData
// export const selectOrderGroupItemsLoading = (state) => state.getSlice.orderGroupItemsLoading
// export const selectOrderGroupItemsStatus  = (state) => state.getSlice.orderGroupItemsStatus

export default getSlice.reducer