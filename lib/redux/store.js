import { configureStore } from "@reduxjs/toolkit"
import configReducer from "./slices/configSlice"
import getUrlReducer from "./slices/getUrlSlice"

export const makeStore = () => {
  return configureStore({
    reducer: {
      config: configReducer,
      globalurl: getUrlReducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: false,
      }),
  })
}

export const store = makeStore()
