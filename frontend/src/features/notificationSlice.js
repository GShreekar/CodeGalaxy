import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../utils/axiosConfig';
import { logout, sessionExpired } from './authSlice';

export const fetchNotifications = createAsyncThunk(
  'notifications/fetchNotifications',
  async ({ page = 1 } = {}) => {
    const params = new URLSearchParams();
    params.append('page', page);

    const response = await api.get(`/notifications?${params}`);
    return response.data;
  }
);

// cheap, polled on an interval by the bell icon so the unread badge stays
// fresh without fetching the whole list every time
export const fetchUnreadCount = createAsyncThunk(
  'notifications/fetchUnreadCount',
  async () => {
    const response = await api.get('/notifications/unread-count');
    return response.data;
  }
);

export const markNotificationRead = createAsyncThunk(
  'notifications/markNotificationRead',
  async (id) => {
    await api.post(`/notifications/${id}/read`);
    return id;
  }
);

export const markAllNotificationsRead = createAsyncThunk(
  'notifications/markAllNotificationsRead',
  async () => {
    await api.post('/notifications/read-all');
  }
);

// called on logout/session-expiry so a re-login as a different user never
// briefly shows the previous session's notifications
const resetNotifications = (state) => {
  state.items = [];
  state.page = 1;
  state.total = 0;
  state.pages = 1;
  state.unreadCount = 0;
};

const notificationSlice = createSlice({
  name: 'notifications',
  initialState: {
    items: [],
    page: 1,
    limit: 20,
    total: 0,
    pages: 1,
    unreadCount: 0,
    loading: false,
    error: null
  },
  reducers: {
    clearNotifications: resetNotifications
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotifications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        const { items, page, limit, total, pages, unreadCount } = action.payload;
        state.loading = false;
        state.items = page > 1 ? [...state.items, ...items] : items;
        state.page = page;
        state.limit = limit;
        state.total = total;
        state.pages = pages;
        state.unreadCount = unreadCount;
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchUnreadCount.fulfilled, (state, action) => {
        state.unreadCount = action.payload.unreadCount;
      })
      .addCase(markNotificationRead.fulfilled, (state, action) => {
        const notification = state.items.find((n) => n._id === action.payload);
        if (notification && !notification.read) {
          notification.read = true;
          state.unreadCount = Math.max(0, state.unreadCount - 1);
        }
      })
      .addCase(markAllNotificationsRead.fulfilled, (state) => {
        state.items.forEach((n) => { n.read = true; });
        state.unreadCount = 0;
      })
      // a logged-out or session-expired user must never keep seeing the
      // previous session's notifications after someone else logs in
      .addCase(logout.fulfilled, resetNotifications)
      .addCase(logout.rejected, resetNotifications)
      .addCase(sessionExpired, resetNotifications);
  }
});

export const { clearNotifications } = notificationSlice.actions;
export default notificationSlice.reducer;
