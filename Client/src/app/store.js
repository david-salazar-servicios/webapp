import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice'; // Adjust the path as necessary
import { apiSlice } from "./api/apiSlice";

export const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    auth: authReducer,

  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
  devTools: true, // Enable Redux DevTools
});


