// src/features/contactSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const submitContact = createAsyncThunk(
  'contact/submitContact',
  async (contactData) => {
    const response = await axios.post(
      `${process.env.REACT_APP_API_URL}/contact`,
      contactData
    );
    return response.data;
  }
);

const contactSlice = createSlice({
  name: 'contact',
  initialState: {
    loading: false,
    error: null,
    success: false
  },
  reducers: {
    resetStatus: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(submitContact.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(submitContact.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(submitContact.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  }
});

export const { resetStatus } = contactSlice.actions;
export default contactSlice.reducer;