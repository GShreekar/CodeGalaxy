import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../utils/axiosConfig';

export const fetchSnippetById = createAsyncThunk(
  'snippets/fetchSnippetById',
  async (id) => {
    const response = await api.get(`/snippet/${id}`);
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

export const updateSnippet = createAsyncThunk(
  'snippets/updateSnippet',
  async ({ id, ...fields }) => {
    const response = await api.patch(`/snippet/${id}`, fields);
    return response.data;
  }
);

export const deleteSnippet = createAsyncThunk(
  'snippets/deleteSnippet',
  async (id) => {
    await api.delete(`/snippet/${id}`);
    return id;
  }
);

export const fetchSnippets = createAsyncThunk(
  'snippets/fetchSnippets',
  async ({ search = '', language = '', sort = '', author = '', excludeAuthor = '', tags = '', page = 1, limit = '' } = {}) => {
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (language) params.append('language', language);
    if (sort) params.append('sort', sort);
    if (author) params.append('author', author);
    if (excludeAuthor) params.append('excludeAuthor', excludeAuthor);
    if (tags) params.append('tags', tags);
    if (limit) params.append('limit', limit);
    params.append('page', page);

    const response = await api.get(`/snippet?${params}`);
    return response.data;
  }
);

export const fetchTrendingSnippets = createAsyncThunk(
  'snippets/fetchTrendingSnippets',
  async ({ language = '', limit = '' } = {}) => {
    const params = new URLSearchParams();
    if (language) params.append('language', language);
    if (limit) params.append('limit', limit);

    const response = await api.get(`/snippet/trending?${params}`);
    return response.data;
  }
);

export const fetchSnippetAuthors = createAsyncThunk(
  'snippets/fetchSnippetAuthors',
  async () => {
    const response = await api.get('/snippet/authors');
    return response.data;
  }
);

export const fetchUserSnippets = createAsyncThunk(
  'snippets/fetchUserSnippets',
  async ({ username, sort = '', page = 1 }) => {
    const params = new URLSearchParams();
    if (sort) params.append('sort', sort);
    params.append('page', page);

    const response = await api.get(`/user/${username}/snippets?${params}`);
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

export const toggleBookmark = createAsyncThunk(
  'snippets/toggleBookmark',
  async (snippetId) => {
    const response = await api.post(`/snippet/${snippetId}/bookmark`);
    return response.data;
  }
);

export const fetchUserBookmarks = createAsyncThunk(
  'snippets/fetchUserBookmarks',
  async ({ page = 1 } = {}) => {
    const params = new URLSearchParams();
    params.append('page', page);

    const response = await api.get(`/user/bookmarks?${params}`);
    return response.data;
  }
);

export const getLanguageStats = createAsyncThunk(
  'snippets/getLanguageStats',
  async () => {
    const response = await api.get('/snippet/stats/languages');
    return response.data;
  }
);

const replaceInItems = (state, snippet) => {
  const index = state.items.findIndex(s => s._id === snippet._id);
  if (index !== -1) {
    state.items[index] = snippet;
  }
  if (state.currentSnippet?._id === snippet._id) {
    state.currentSnippet = snippet;
  }
};

// shared by fetchSnippets and fetchUserSnippets — both return the same
// { items, page, limit, total, pages } shape from the same backend service
const applySnippetsPage = (state, action) => {
  state.loading = false;
  const { items, page, limit, total, pages } = action.payload;
  // page > 1 means this came from a "Load more" click: append instead of replace
  state.items = (action.meta.arg?.page ?? 1) > 1 ? [...state.items, ...items] : items;
  state.page = page;
  state.limit = limit;
  state.total = total;
  state.pages = pages;
};

const snippetSlice = createSlice({
  name: 'snippets',
  initialState: {
    items: [],
    page: 1,
    limit: 20,
    total: 0,
    pages: 1,
    trending: [],
    authors: [],
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
        replaceInItems(state, action.payload);
      })
      .addCase(updateSnippet.fulfilled, (state, action) => {
        replaceInItems(state, action.payload);
      })
      .addCase(deleteSnippet.fulfilled, (state, action) => {
        const deletedId = action.payload;
        state.items = state.items.filter(s => s._id !== deletedId);
        state.total = Math.max(0, state.total - 1);
        if (state.currentSnippet?._id === deletedId) {
          state.currentSnippet = null;
        }
      })
      .addCase(createSnippet.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createSnippet.fulfilled, (state, action) => {
        state.loading = false;
        state.items.unshift(action.payload);
        state.total += 1;
      })
      .addCase(createSnippet.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchSnippets.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSnippets.fulfilled, applySnippetsPage)
      .addCase(fetchSnippets.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchUserSnippets.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserSnippets.fulfilled, applySnippetsPage)
      .addCase(fetchUserSnippets.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchUserBookmarks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserBookmarks.fulfilled, applySnippetsPage)
      .addCase(fetchUserBookmarks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(toggleBookmark.fulfilled, (state, action) => {
        replaceInItems(state, action.payload);
      })
      .addCase(fetchTrendingSnippets.fulfilled, (state, action) => {
        state.trending = action.payload;
      })
      .addCase(fetchSnippetAuthors.fulfilled, (state, action) => {
        state.authors = action.payload;
      })
      .addCase(upvoteSnippet.fulfilled, (state, action) => {
        replaceInItems(state, action.payload);
      })
      .addCase(downvoteSnippet.fulfilled, (state, action) => {
        replaceInItems(state, action.payload);
      })
      .addCase(getLanguageStats.fulfilled, (state, action) => {
        state.languageStats = action.payload;
      });
  }
});

export const { clearError, clearCurrentSnippet } = snippetSlice.actions;
export default snippetSlice.reducer;
