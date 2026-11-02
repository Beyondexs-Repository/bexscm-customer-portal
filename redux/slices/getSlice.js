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

  //GET_PROMOTION_LIST_for Overview Page slides
promotionData: [],
promotionLoading: false,
promotionStatus: "idle",
promotionError: null,
//Userslist_GET_INITIALSTATE
userslistData: [],
userslistLoading: false,
userslistStatus: "idle",
userslistError: null,

//USERS_LISTVIEW_BY_ID_EDIT_USER
edituserData: null,        // { user, assignments }
edituserLoading: false,
edituserStatus: "idle",
edituserError: null,

//GET_TERRITORY_LIST
territoryData: [],
territoryLoading: false,
territoryStatus: "idle",
//GET_AREA_LIST
areaData: [],
areaLoading: false,
areaStatus: "idle",
areaError: null,
//GET_LOCATION_LIST
locationData: [],
locationLoading: false,
locationStatus: "idle",
locationError: null,
//GET_DEPT_LIST
deptData: [],
deptLoading: false,
deptStatus: "idle",
deptError: null,

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


//PROMOTION_LISTVIEW
export const GetPromotionlist= createAsyncThunk(
  "Sidebar/Promotion_list",
  async (_, { rejectWithValue }) => {
    try {
      
      const URL = `${process.env.NEXT_PUBLIC_NRL_API_URL}/promotions`
 
       const response = await axios.get(URL, {
        headers: {
          Accept: "application/json",
          Authorization: `${process.env.NEXT_PUBLIC_AUTH_TOKEN}`,
        },
      });
 
      const result = response.data
 
      if (result?.success === false) {
        return rejectWithValue(
          result?.Msg || result?.message || "Failed to fetch promotions.",
        )
      }

      // API returns { success: true, data: [...] }; also accept a bare array
      return Array.isArray(result) ? result : result?.data ?? []
    } catch (error) {
      const data = error.response?.data
      return rejectWithValue(
        data?.Msg || data?.message || (typeof data === "string" ? data : null) || error.message,
      )
    }
  },
)

/*******************EMPLOYEE SCREEN GET API FUNCTIONS START***************************/

//USERS_LISTVIEW_BY_ID
export const Getuserslist = createAsyncThunk(
  "Users/Users_list__GET",
  async (custNmbrArg, { rejectWithValue }) => {
    try {
      const custnmbr = custNmbrArg || localStorage.getItem("custnmbr")

      if (!custnmbr || custnmbr === "undefined") {
        return rejectWithValue("Customer number missing. Please log in again.")
      }
 
      const URL = `${process.env.NEXT_PUBLIC_NRL_API_URL}/users/customer/${custnmbr}`

      const response = await axios.get(URL, {
        headers: {
          Accept: "application/json",
          Authorization: `${process.env.NEXT_PUBLIC_AUTH_TOKEN}`,
        },
      });
 
      const result = response.data
 
      if (result?.success === false) {
        throw new Error(result?.Msg || result?.message || "Failed to fetch orders.")
      }
 
      // The customer portal receives a bare array; also accept { data: [...] }
      return Array.isArray(result) ? result : result?.data ?? []
    } catch (error) {
      return rejectWithValue(error.response ? error.response.data : error.message)
    }
  }
)

//TERRITORY_LIST
export const GetTerritorylist = createAsyncThunk(
  "Territory/Territory_list_GET",
  async (custNmbrArg, { rejectWithValue }) => {
    try {
      const custnmbr = custNmbrArg || localStorage.getItem("custnmbr")

      if (!custnmbr || custnmbr === "undefined") {
        return rejectWithValue("Customer number missing. Please log in again.")
      }

      const URL = `${process.env.NEXT_PUBLIC_NRL_API_URL}/territory?custNmbr=${custnmbr}`

      const response = await axios.get(URL, {
        headers: {
          Accept: "application/json",
          Authorization: `${process.env.NEXT_PUBLIC_AUTH_TOKEN}`,
        },
      })

      const result = response.data

      if (result?.success === false) {
        return rejectWithValue(
          result?.Msg || result?.message || "Failed to fetch territories.",
        )
      }

      return Array.isArray(result) ? result : result?.data ?? []
    } catch (error) {
      const data = error.response?.data
      return rejectWithValue(
        data?.Msg || data?.message || (typeof data === "string" ? data : null) || error.message,
      )
    }
  },
)

// //AREA_LIST
// export const GetAreaList = createAsyncThunk(
//   "Area/Area_list_GET",
//   async (territoryID, { rejectWithValue }) => {
//     if (!territoryID?.length) return []

//     try {
//      const URL = `${process.env.NEXT_PUBLIC_NRL_API_URL}/area?territoryId=${territoryID}`
//      const response = await axios.get(URL, {
//         headers: {
//           Accept: "application/json",
//           Authorization: `${process.env.NEXT_PUBLIC_AUTH_TOKEN}`,
//         },
//       })

//       const result = response.data

//       if (result?.success === false) {
//         return rejectWithValue(
//           result?.Msg || result?.message || "Failed to fetch areas.",
//         )
//       }

//       return Array.isArray(result) ? result : result?.data ?? []
//     } catch (error) {
//       const data = error.response?.data
//       return rejectWithValue(
//         data?.Msg || data?.message || (typeof data === "string" ? data : null) || error.message,
//       )
//     }
//   },
// )

// //LOCATION_LIST
// export const GetLocationList = createAsyncThunk(
//   "Location/Location_list_GET",
//   async (areaId, { rejectWithValue }) => {
//     if (!areaId?.length) return []

//     try {
//      const URL = `${process.env.NEXT_PUBLIC_NRL_API_URL}/location?areaId=${areaId}`
//      const response = await axios.get(URL, {
//         headers: {
//           Accept: "application/json",
//           Authorization: `${process.env.NEXT_PUBLIC_AUTH_TOKEN}`,
//         },
//       })

//       const result = response.data

//       if (result?.success === false) {
//         return rejectWithValue(
//           result?.Msg || result?.message || "Failed to fetch locations.",
//         )
//       }

//       return Array.isArray(result) ? result : result?.data ?? []
//     } catch (error) {
//       const data = error.response?.data
//       return rejectWithValue(
//         data?.Msg || data?.message || (typeof data === "string" ? data : null) || error.message,
//       )
//     }
//   },
// )
// //DEPT_LIST
// export const GetdeptList = createAsyncThunk(
//   "Department/Department_list_GET",
//   async (locationId, { rejectWithValue }) => {
//     if (!locationId?.length) return []

//     try {
//      const URL = `${process.env.NEXT_PUBLIC_NRL_API_URL}/department?locationId=${locationId}`
//      const response = await axios.get(URL, {
//         headers: {
//           Accept: "application/json",
//           Authorization: `${process.env.NEXT_PUBLIC_AUTH_TOKEN}`,
//         },
//       })

//       const result = response.data

//       if (result?.success === false) {
//         return rejectWithValue(
//           result?.Msg || result?.message || "Failed to fetch locations.",
//         )
//       }

//       return Array.isArray(result) ? result : result?.data ?? []
//     } catch (error) {
//       const data = error.response?.data
//       return rejectWithValue(
//         data?.Msg || data?.message || (typeof data === "string" ? data : null) || error.message,
//       )
//     }
//   },
// )

export const GetAreaList = createAsyncThunk(
  "Area/Area_list_GET",
  async (territoryIds, { rejectWithValue }) => {
    if (!territoryIds?.length) return [];

    try {
      const headers = {
        Accept: "application/json",
        Authorization: `${process.env.NEXT_PUBLIC_AUTH_TOKEN}`,
      };

      // Retain each request's parent when the filtered API omits it in records.
      const parentIds = [...new Set(territoryIds)];
      // one request per territory ID (the API rejects comma-separated lists)
      const responses = await Promise.all(
        parentIds.map((id) =>
          axios.get(
            `${process.env.NEXT_PUBLIC_NRL_API_URL}/area?territoryId=${id}`,
            { headers },
          ),
        ),
      );

      return responses.flatMap(({ data }, index) => {
        if (data?.success === false) {
          throw new Error(data?.Msg || data?.message || "Failed to fetch areas.");
        }
        const records = Array.isArray(data) ? data : data?.data ?? [];
        return records.map((area) => ({
          ...area,
          territoryID: area.territoryID ?? area.territoryId ?? parentIds[index],
        }));
      });
    } catch (error) {
      const data = error.response?.data;
      return rejectWithValue(
        data?.Msg ||
          data?.message ||
          (typeof data === "string" ? data : null) ||
          error.message,
      );
    }
  },
);

export const GetLocationList = createAsyncThunk(
  "Location/Location_list_GET",
  async (areaIds, { rejectWithValue }) => {
    if (!areaIds?.length) return [];

    try {
      const headers = {
        Accept: "application/json",
        Authorization: `${process.env.NEXT_PUBLIC_AUTH_TOKEN}`,
      };

      // one request per area ID
      const parentIds = [...new Set(areaIds)];
      const responses = await Promise.all(
        parentIds.map((id) =>
          axios.get(
            `${process.env.NEXT_PUBLIC_NRL_API_URL}/location?areaId=${id}`,
            { headers },
          ),
        ),
      );

      return responses.flatMap(({ data }, index) => {
        if (data?.success === false) {
          throw new Error(data?.Msg || data?.message || "Failed to fetch locations.");
        }
        const records = Array.isArray(data) ? data : data?.data ?? [];
        return records.map((location) => ({
          ...location,
          areaID: location.areaID ?? location.areaId ?? parentIds[index],
        }));
      });
    } catch (error) {
      const data = error.response?.data;
      return rejectWithValue(
        data?.Msg ||
          data?.message ||
          (typeof data === "string" ? data : null) ||
          error.message,
      );
    }
  },
);

export const GetdeptList = createAsyncThunk(
  "Department/Department_list_GET",
  async (locationIds, { rejectWithValue }) => {
    if (!locationIds?.length) return [];

    try {
      const headers = {
        Accept: "application/json",
        Authorization: `${process.env.NEXT_PUBLIC_AUTH_TOKEN}`,
      };

      // one request per location (store) ID
      const parentIds = [...new Set(locationIds)];
      const responses = await Promise.all(
        parentIds.map((id) =>
          axios.get(
            `${process.env.NEXT_PUBLIC_NRL_API_URL}/department?locationId=${id}`,
            { headers },
          ),
        ),
      );

      return responses.flatMap(({ data }, index) => {
        if (data?.success === false) {
          throw new Error(data?.Msg || data?.message || "Failed to fetch departments.");
        }
        const records = Array.isArray(data) ? data : data?.data ?? [];
        return records.map((department) => ({
          ...department,
          locationID: department.locationID ?? department.locationId ?? parentIds[index],
        }));
      });
    } catch (error) {
      const data = error.response?.data;
      return rejectWithValue(
        data?.Msg ||
          data?.message ||
          (typeof data === "string" ? data : null) ||
          error.message,
      );
    }
  },
);


//USERS_LISTVIEW_BY_ID_EDIT_USER
export const EdituserGet = createAsyncThunk(
  "Users/User_by_id_GET",
  async (userId, { rejectWithValue }) => {
    try {

      
        if (userId === undefined || userId === null || userId === "") {
      return rejectWithValue("User id is missing.")
    }

 
      const URL = `${process.env.NEXT_PUBLIC_NRL_API_URL}/users/${userId}`

      const response = await axios.get(URL, {
        headers: {
          Accept: "application/json",
          Authorization: `${process.env.NEXT_PUBLIC_AUTH_TOKEN}`,
        },
      });
 
      const result = response.data
 
           if (result?.success === false) {
        return rejectWithValue(
          result?.Msg || result?.message || "Failed to fetch user.",
        )
      }

      // keep BOTH the user and its assignments
      return {
        user: result?.data ?? null,
        assignments: {
          territoryIds: result?.assignments?.territoryIds ?? [],
          areaIds: result?.assignments?.areaIds ?? [],
          locationIds: result?.assignments?.locationIds ?? [],
          departmentIds: result?.assignments?.departmentIds ?? [],
        },
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

/*******************EMPLOYEE SCREEN GET API FUNCTIONS END***************************/









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

  clearAreaList: (state) => {
    state.areaData = []
    state.areaLoading = false
    state.areaStatus = "idle"
    state.areaError = null
  },
  clearLocationList: (state) => {
    state.locationData = []
    state.locationLoading = false
    state.locationStatus = "idle"
    state.locationError = null
  },
  clearDepartmentList: (state) => {
    state.deptData = []
    state.deptLoading = false
    state.deptStatus = "idle"
    state.deptError = null
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

      //GET_PROMOTION_LIST_GET

.addCase(GetPromotionlist.pending, (state) => {
  state.promotionStatus = "loading"
  state.promotionLoading = true
  state.promotionError = null
})
.addCase(GetPromotionlist.fulfilled, (state, action) => {
  state.promotionStatus = "succeeded"
  state.promotionLoading = false
 state.promotionData = Array.isArray(action.payload) ? action.payload : []
 console.log("GetPromotionlist fulfilled:", state.promotionData)
})
.addCase(GetPromotionlist.rejected, (state, action) => {
  state.promotionStatus = "failed"
  state.promotionLoading = false
  state.promotionError = action.payload || action.error.message
  state.promotionData = []
})

/*******************EMPLOYEE SCREEN GET API FUNCTIONS START***************************/

//Userslist_GET_ADDCASE
.addCase(Getuserslist.pending, (state) => {
  state.userslistStatus = "loading"
  state.userslistLoading = true
  state.userslistError = null
})
.addCase(Getuserslist.fulfilled, (state, action) => {
  state.userslistStatus = "succeeded"
  state.userslistLoading = false
  state.userslistData = action.payload
})
.addCase(Getuserslist.rejected, (state, action) => {
  state.userslistStatus = "failed"
  state.userslistLoading = false
  state.userslistError = action.payload || action.error.message
  state.userslistData = []
})


//GET_USER_BY_ID
.addCase(EdituserGet.pending, (state) => {
  state.edituserStatus = "loading"
  state.edituserLoading = true
  state.edituserError = null
})
.addCase(EdituserGet.fulfilled, (state, action) => {
  state.edituserStatus = "succeeded"
  state.edituserLoading = false
  state.edituserData = action.payload
})
.addCase(EdituserGet.rejected, (state, action) => {
  state.edituserStatus = "failed"
  state.edituserLoading = false
  state.edituserError = action.payload || action.error.message
  state.edituserData = null
})

//GET_TERRITORY_LIST_GET
.addCase(GetTerritorylist.pending, (state) => {
  state.territoryStatus = "loading"
  state.territoryLoading = true
  state.territoryError = null
})
.addCase(GetTerritorylist.fulfilled, (state, action) => {
  state.territoryStatus = "succeeded"
  state.territoryLoading = false
  state.territoryData = Array.isArray(action.payload) ? action.payload : []
})
.addCase(GetTerritorylist.rejected, (state, action) => {
  state.territoryStatus = "failed"
  state.territoryLoading = false
  state.territoryError = action.payload || action.error.message
  state.territoryData = []
})


//GET_AREA_LIST_GET
.addCase(GetAreaList.pending, (state) => {
  state.areaStatus = "loading"
  state.areaLoading = true
  state.areaError = null
})
.addCase(GetAreaList.fulfilled, (state, action) => {
  state.areaStatus = "succeeded"
  state.areaLoading = false
  state.areaData = Array.isArray(action.payload) ? action.payload : []
})
.addCase(GetAreaList.rejected, (state, action) => {
  state.areaStatus = "failed"
  state.areaLoading = false
  state.areaError = action.payload || action.error.message
  state.areaData = []
})

//GET_LOCATION_LIST
.addCase(GetLocationList.pending, (state) => {
  state.locationStatus = "loading"
  state.locationLoading = true
  state.locationError = null
})
.addCase(GetLocationList.fulfilled, (state, action) => {
  state.locationStatus = "succeeded"
  state.locationLoading = false
  state.locationData = Array.isArray(action.payload) ? action.payload : []
})
.addCase(GetLocationList.rejected, (state, action) => {
  state.locationStatus = "failed"
  state.locationLoading = false
  state.locationError = action.payload || action.error.message
  state.locationData = []
})
//GET_DEPT_LIST
.addCase(GetdeptList.pending, (state) => {
  state.deptStatus = "loading"
  state.deptLoading = true
  state.deptError = null
})
.addCase(GetdeptList.fulfilled, (state, action) => {
  state.deptStatus = "succeeded"
  state.deptLoading = false
  state.deptData = Array.isArray(action.payload) ? action.payload : []
})
.addCase(GetdeptList.rejected, (state, action) => {
  state.deptStatus = "failed"
  state.deptLoading = false
  state.deptError = action.payload || action.error.message
  state.deptData = []
})

/*******************EMPLOYEE SCREEN GET API FUNCTIONS END***************************/




  },
})

export const {
  resetGetSlice,
  clearOrderGroupItems,
  clearOrderGuideGroups,
  clearAreaList,
  clearLocationList,
  clearDepartmentList,
} = getSlice.actions



export default getSlice.reducer
