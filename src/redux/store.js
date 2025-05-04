import { configureStore } from "@reduxjs/toolkit";
import { domainApi } from "./domainApi";

export const store = configureStore({
  reducer: {
    [domainApi.reducerPath]: domainApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(domainApi.middleware),
});
