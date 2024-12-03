// src/app/store.js
import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/authSlice';
import snippetReducer from '../features/snippetSlice';
import contactReducer from '../features/contactSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    snippets: snippetReducer,
    contact: contactReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types
        ignoredActions: ['persist/PERSIST'],
      },
    }),
});