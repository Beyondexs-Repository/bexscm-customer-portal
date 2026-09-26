import { configureStore } from "@reduxjs/toolkit"
import configReducer from "./slices/configSlice"
import getSliceReducer from "./slices/getSlice"
import postSliceReducer from "./slices/postSlice"

export const makeStore = () => {
  return configureStore({
    reducer: {
      config: configReducer,
      getSlice: getSliceReducer,
      postSlice: postSliceReducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: false,
      }),
  })
}

export const store = makeStore()
