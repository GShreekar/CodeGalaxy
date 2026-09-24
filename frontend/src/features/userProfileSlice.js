import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../utils/axiosConfig';

// the public profile summary of a user being viewed — distinct from
// authSlice, which only ever represents the current logged-in user
export const fetchUserProfile = createAsyncThunk(
  'userProfile/fetchUserProfile',
  async (username, { rejectWithValue }) => {
    try {
      const response = await api.get(`/user/${username}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'User not found');
    }
  }
);

export const toggleFollow = createAsyncThunk(
  'userProfile/toggleFollow',
  async (username) => {
    const response = await api.post(`/user/${username}/follow`);
    return response.data;
  }
);

const userProfileSlice = createSlice({
  name: 'userProfile',
  initialState: {
    profile: null,
    loading: false,
    error: null
  },
  reducers: {
    clearUserProfile: (state) => {
      state.profile = null;
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.profile = null;
        state.error = action.payload;
      })
      .addCase(toggleFollow.fulfilled, (state, action) => {
        if (state.profile) {
          state.profile.isFollowing = action.payload.following;
          state.profile.followerCount = action.payload.followerCount;
        }
      });
  }
});

export const { clearUserProfile } = userProfileSlice.actions;
export default userProfileSlice.reducer;
