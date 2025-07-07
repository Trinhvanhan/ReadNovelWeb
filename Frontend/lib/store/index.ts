import { configureStore } from "@reduxjs/toolkit"
import authSlice from "./slices/authSlice"
import readingSlice from "./slices/readingSlice"
import searchSlice from "./slices/searchSlice"
import notificationSlice from "./slices/notificationSlice"
import uiSlice from "./slices/uiSlice"
import { apiSlice } from "./api/apiSlice"

export const store = configureStore({
  reducer: {
    auth: authSlice,
    reading: readingSlice,
    search: searchSlice,
    notifications: notificationSlice,
    ui: uiSlice,
    api: apiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
      },
    }).concat(apiSlice.middleware),
  devTools: process.env.NODE_ENV !== "production",
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
