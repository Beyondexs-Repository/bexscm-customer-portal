// import { configureStore } from "@reduxjs/toolkit"
// import configReducer from "./slices/configSlice"

// export const makeStore = () => {
//   return configureStore({
//     reducer: {
//       config: configReducer,
//     },
//     middleware: (getDefaultMiddleware) =>
//       getDefaultMiddleware({
//         serializableCheck: false,
//       }),
//   })
// }

// export const store = makeStore()
import { configureStore } from "@reduxjs/toolkit"
import configReducer from "./slices/configSlice"
import ordersReducer from "./slices/ordersSlice"

export const makeStore = () => {
  return configureStore({
    reducer: {
      config: configReducer,
      orders: ordersReducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: false,
      }),
  })
}

export const store = makeStore()

