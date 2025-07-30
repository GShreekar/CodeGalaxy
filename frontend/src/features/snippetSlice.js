import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import api from '../utils/axiosConfig';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export const fetchSnippetById = createAsyncThunk(
  'snippets/fetchSnippetById',
  async (id) => {
    const response = await axios.get(`${API_URL}/snippet/${id}`);
    return response.data;
  }
);

export const addComment = createAsyncThunk(
  'snippets/addComment',
  async ({ snippetId, text }) => {
    const response = await api.post(`/snippet/${snippetId}/comment`, { text });
    return response.data;
  }
);

export const createSnippet = createAsyncThunk(
  'snippets/createSnippet',
  async (snippetData) => {
    const response = await api.post('/snippet', snippetData);
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

    const response = await axios.get(`${API_URL}/snippet?${params}`);
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
  'snippets/downvoteSnippet',
  async (snippetId) => {
    const response = await api.post(`/snippet/${snippetId}/downvote`);
    return response.data;
  }
);

export const fetchAllUserSnippets = createAsyncThunk(
  'snippets/fetchAllUserSnippets',
  async () => {
    const response = await axios.get(`${API_URL}/snippet/users/all`);
    return response.data;
  }
);

export const getLanguageStats = createAsyncThunk(
  'snippets/getLanguageStats',
  async () => {
    const response = await axios.get(`${API_URL}/snippet/stats/languages`);
    return response.data;
  }
);

const snippetSlice = createSlice({
  name: 'snippets',
  initialState: {
    snippets: [],
    currentSnippet: null,
    languageStats: [],
    loading: false,
    error: null
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentSnippet: (state) => {
      state.currentSnippet = null;
    }
  },
  extraReducers: (builder) => {
    builder
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

export const { clearError, clearCurrentSnippet } = snippetSlice.actions;
export default snippetSlice.reducer;