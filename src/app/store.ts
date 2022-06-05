import { configureStore } from "@reduxjs/toolkit";
import { productNotificationSlice } from "./services/productNotificationSlice";

export const createStore = (initialState = {}) => {
  const store = configureStore({
    reducer: {
      [productNotificationSlice.reducerPath]: productNotificationSlice.reducer,
    },
    preloadedState: initialState,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({ serializableCheck: { warnAfter: 75 } }).concat(
        productNotificationSlice.middleware,
      ),
  });
  return store;
};

export const store = createStore();
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
