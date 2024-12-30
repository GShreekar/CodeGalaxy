// src/features/snippetSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import api from '../utils/axiosConfig';

// Fetch single snippet thunk
export const fetchSnippetById = createAsyncThunk(
  'snippets/fetchSnippetById',
  async (id) => {
    const response = await axios.get(`${process.env.REACT_APP_API_URL}/snippet/${id}`);
    return response.data;
  }
);

// Add comment thunk
export const addComment = createAsyncThunk(
  'snippets/addComment',
  async ({ snippetId, text }, { getState }) => {
    const response = await axios.post(
      `${process.env.REACT_APP_API_URL}/snippet/${snippetId}/comment`,
      { text },
      {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      }
    );
    return response.data;
  }
);

export const createSnippet = createAsyncThunk(
  'snippets/createSnippet',
  async (snippetData) => {
    const response = await axios.post(
      `${process.env.REACT_APP_API_URL}/snippet`,
      snippetData,
      {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      }
    );
    return response.data;
  }
);

export const fetchSnippets = createAsyncThunk(
  'snippets/fetchSnippets',
  async ({ search = '', language = '', sort = '' } = {}) => {
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (language) params.append('language', language);
    if (sort) params.append('sort', sort);

    const response = await axios.get(
      `${process.env.REACT_APP_API_URL}/snippet?${params}`,
      {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      }
    );
    return response.data;
  }
);

export const upvoteSnippet = createAsyncThunk(
  'snippets/upvoteSnippet',
  async (snippetId, { rejectWithValue }) => {
    try {
      const response = await api.post(`/snippet/${snippetId}/upvote`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const downvoteSnippet = createAsyncThunk(
  'snippets/downvote',
  async (snippetId) => {
    const response = await axios.post(
      `${process.env.REACT_APP_API_URL}/snippet/${snippetId}/downvote`,
      {},
      {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      }
    );
    return response.data;
  }
);

export const fetchAllUserSnippets = createAsyncThunk(
  'snippets/fetchAllUserSnippets',
  async () => {
    const response = await axios.get(
      `${process.env.REACT_APP_API_URL}/snippet/users/all`
    );
    return response.data;
  }
);

export const getLanguageStats = createAsyncThunk(
  'snippets/getLanguageStats',
  async () => {
    const response = await axios.get(
      `${process.env.REACT_APP_API_URL}/snippet/stats/languages`
    );
    return response.data;
  }
);

const snippetSlice = createSlice({
  name: 'snippets',
  initialState: {
    snippets: [],
    currentSnippet: null,
    loading: false,
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch snippet by ID
      .addCase(fetchSnippetById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSnippetById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentSnippet = action.payload;
      })
      .addCase(fetchSnippetById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Add comment
      .addCase(addComment.fulfilled, (state, action) => {
        const index = state.snippets.findIndex(s => s._id === action.payload._id);
        if (index !== -1) {
          state.snippets[index] = action.payload;
        }
        if (state.currentSnippet?._id === action.payload._id) {
          state.currentSnippet = action.payload;
        }
      })
      .addCase(createSnippet.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createSnippet.fulfilled, (state, action) => {
        state.loading = false;
        state.snippets.unshift(action.payload);
      })
      .addCase(createSnippet.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchSnippets.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSnippets.fulfilled, (state, action) => {
        state.loading = false;
        state.snippets = action.payload;
      })
      .addCase(fetchSnippets.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(upvoteSnippet.fulfilled, (state, action) => {
        const index = state.snippets.findIndex(s => s._id === action.payload._id);
        if (index !== -1) {
          state.snippets[index] = action.payload;
        }
        if (state.currentSnippet?._id === action.payload._id) {
          state.currentSnippet = action.payload;
        }
      })
      .addCase(downvoteSnippet.fulfilled, (state, action) => {
        const index = state.snippets.findIndex(s => s._id === action.payload._id);
        if (index !== -1) {
          state.snippets[index] = action.payload;
        }
        if (state.currentSnippet?._id === action.payload._id) {
          state.currentSnippet = action.payload;
        }
      })
      .addCase(fetchAllUserSnippets.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllUserSnippets.fulfilled, (state, action) => {
        state.loading = false;
        state.snippets = action.payload;
      })
      .addCase(fetchAllUserSnippets.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(getLanguageStats.fulfilled, (state, action) => {
        state.languageStats = action.payload;
      });
  }
});

export default snippetSlice.reducer;