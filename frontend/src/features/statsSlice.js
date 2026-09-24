import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../utils/axiosConfig';

// creator-facing analytics for the logged-in user's own snippets
export const fetchUserStats = createAsyncThunk(
  'stats/fetchUserStats',
  async () => {
    const response = await api.get('/user/stats');
    return response.data;
  }
);

const statsSlice = createSlice({
  name: 'stats',
  initialState: {
    data: null,
    loading: false,
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserStats.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchUserStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  }
});

export default statsSlice.reducer;
