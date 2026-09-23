import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../utils/axiosConfig';

export const fetchCollections = createAsyncThunk(
  'collections/fetchCollections',
  async () => {
    const response = await api.get('/collections');
    return response.data;
  }
);

export const createCollection = createAsyncThunk(
  'collections/createCollection',
  async ({ name, description }, { rejectWithValue }) => {
    try {
      const response = await api.post('/collections', { name, description });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create collection');
    }
  }
);

export const fetchCollectionById = createAsyncThunk(
  'collections/fetchCollectionById',
  async (id) => {
    const response = await api.get(`/collections/${id}`);
    return response.data;
  }
);

export const updateCollection = createAsyncThunk(
  'collections/updateCollection',
  async ({ id, ...fields }, { rejectWithValue }) => {
    try {
      const response = await api.patch(`/collections/${id}`, fields);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update collection');
    }
  }
);

export const deleteCollection = createAsyncThunk(
  'collections/deleteCollection',
  async (id) => {
    await api.delete(`/collections/${id}`);
    return id;
  }
);

export const addSnippetToCollection = createAsyncThunk(
  'collections/addSnippetToCollection',
  async ({ collectionId, snippetId }) => {
    const response = await api.post(`/collections/${collectionId}/snippets/${snippetId}`);
    return response.data;
  }
);

export const removeSnippetFromCollection = createAsyncThunk(
  'collections/removeSnippetFromCollection',
  async ({ collectionId, snippetId }) => {
    const response = await api.delete(`/collections/${collectionId}/snippets/${snippetId}`);
    return response.data;
  }
);

const replaceCollection = (state, collection) => {
  const index = state.items.findIndex((c) => c._id === collection._id);
  if (index !== -1) {
    state.items[index] = { ...state.items[index], ...collection, snippetCount: collection.snippets?.length };
  }
  if (state.current?._id === collection._id) {
    state.current = collection;
  }
};

const collectionSlice = createSlice({
  name: 'collections',
  initialState: {
    items: [],
    loaded: false,
    current: null,
    loading: false,
    error: null
  },
  reducers: {
    clearCurrentCollection: (state) => {
      state.current = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCollections.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCollections.fulfilled, (state, action) => {
        state.loading = false;
        state.loaded = true;
        state.items = action.payload;
      })
      .addCase(fetchCollections.rejected, (state) => {
        state.loading = false;
      })
      .addCase(createCollection.fulfilled, (state, action) => {
        state.items.unshift({ ...action.payload, snippetCount: 0 });
      })
      .addCase(fetchCollectionById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCollectionById.fulfilled, (state, action) => {
        state.loading = false;
        state.current = action.payload;
      })
      .addCase(fetchCollectionById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(updateCollection.fulfilled, replaceCollection)
      .addCase(deleteCollection.fulfilled, (state, action) => {
        const deletedId = action.payload;
        state.items = state.items.filter((c) => c._id !== deletedId);
        if (state.current?._id === deletedId) {
          state.current = null;
        }
      })
      .addCase(addSnippetToCollection.fulfilled, replaceCollection)
      .addCase(removeSnippetFromCollection.fulfilled, replaceCollection);
  }
});

export const { clearCurrentCollection } = collectionSlice.actions;
export default collectionSlice.reducer;
