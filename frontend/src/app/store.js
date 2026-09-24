import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/authSlice';
import snippetReducer from '../features/snippetSlice';
import contactReducer from '../features/contactSlice';
import userProfileReducer from '../features/userProfileSlice';
import collectionReducer from '../features/collectionSlice';
import notificationReducer from '../features/notificationSlice';
import statsReducer from '../features/statsSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    snippets: snippetReducer,
    contact: contactReducer,
    userProfile: userProfileReducer,
    collections: collectionReducer,
    notifications: notificationReducer,
    stats: statsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
});