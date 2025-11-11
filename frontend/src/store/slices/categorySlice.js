import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import categoryService from '../../services/categoryService';

// Async thunks
export const fetchCategories = createAsyncThunk(
  'categories/fetchCategories',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await categoryService.getCategories(params);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchCategory = createAsyncThunk(
  'categories/fetchCategory',
  async (id, { rejectWithValue }) => {
    try {
      const response = await categoryService.getCategory(id);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const createCategory = createAsyncThunk(
  'categories/createCategory',
  async (categoryData, { rejectWithValue }) => {
    try {
      const response = await categoryService.createCategory(categoryData);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const updateCategory = createAsyncThunk(
  'categories/updateCategory',
  async ({ id, categoryData }, { rejectWithValue }) => {
    try {
      const response = await categoryService.updateCategory(id, categoryData);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const deleteCategory = createAsyncThunk(
  'categories/deleteCategory',
  async (id, { rejectWithValue }) => {
    try {
      const response = await categoryService.deleteCategory(id);
      return { id, response };
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchCategoryTree = createAsyncThunk(
  'categories/fetchCategoryTree',
  async (_, { rejectWithValue }) => {
    try {
      const response = await categoryService.getCategoryTree();
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const searchCategories = createAsyncThunk(
  'categories/searchCategories',
  async ({ query, filters = {} }, { rejectWithValue }) => {
    try {
      const response = await categoryService.searchCategories(query, filters);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const bulkUpdateCategories = createAsyncThunk(
  'categories/bulkUpdateCategories',
  async ({ action, categoryIds, additionalData = {} }, { rejectWithValue }) => {
    try {
      const response = await categoryService.bulkUpdateCategories(action, categoryIds, additionalData);
      return { action, categoryIds, response };
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchCategoryStats = createAsyncThunk(
  'categories/fetchCategoryStats',
  async (_, { rejectWithValue }) => {
    try {
      const response = await categoryService.getCategoryStats();
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Initial state
const initialState = {
  categories: [],
  categoryTree: [],
  currentCategory: null,
  stats: null,
  loading: false,
  error: null,
  searchResults: [],
  searchQuery: '',
  pagination: {
    count: 0,
    next: null,
    previous: null,
    page: 1,
    pageSize: 20
  },
  filters: {
    is_active: null,
    parent_id: null,
    root_only: false
  }
};

// Slice
const categorySlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentCategory: (state) => {
      state.currentCategory = null;
    },
    clearSearchResults: (state) => {
      state.searchResults = [];
      state.searchQuery = '';
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = {
        is_active: null,
        parent_id: null,
        root_only: false
      };
    },
    setPagination: (state, action) => {
      state.pagination = { ...state.pagination, ...action.payload };
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch categories
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload.results || action.payload;
        state.pagination = {
          count: action.payload.count || action.payload.length,
          next: action.payload.next,
          previous: action.payload.previous,
          page: state.pagination.page,
          pageSize: state.pagination.pageSize
        };
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch single category
      .addCase(fetchCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.currentCategory = action.payload;
      })
      .addCase(fetchCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Create category
      .addCase(createCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.categories.unshift(action.payload.category);
        state.pagination.count += 1;
      })
      .addCase(createCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update category
      .addCase(updateCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCategory.fulfilled, (state, action) => {
        state.loading = false;
        const categoryId = action.meta.arg.id;
        const index = state.categories.findIndex(
          cat => cat.id === categoryId
        );
        if (index !== -1) {
          state.categories[index] = { ...state.categories[index], ...action.payload };
        }
        if (state.currentCategory?.id === categoryId) {
          state.currentCategory = { ...state.currentCategory, ...action.payload };
        }
      })
      .addCase(updateCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Delete category
      .addCase(deleteCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = state.categories.filter(
          cat => cat.id !== action.payload.id
        );
        state.pagination.count -= 1;
        if (state.currentCategory?.id === action.payload.id) {
          state.currentCategory = null;
        }
      })
      .addCase(deleteCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch category tree
      .addCase(fetchCategoryTree.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCategoryTree.fulfilled, (state, action) => {
        state.loading = false;
        state.categoryTree = action.payload.categories;
      })
      .addCase(fetchCategoryTree.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Search categories
      .addCase(searchCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.searchResults = action.payload.categories;
        state.searchQuery = action.payload.query;
      })
      .addCase(searchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Bulk update categories
      .addCase(bulkUpdateCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(bulkUpdateCategories.fulfilled, (state, action) => {
        state.loading = false;
        const { action: updateAction, categoryIds } = action.payload;
        
        if (updateAction === 'activate' || updateAction === 'deactivate') {
          const isActive = updateAction === 'activate';
          state.categories = state.categories.map(cat => 
            categoryIds.includes(cat.id) ? { ...cat, is_active: isActive } : cat
          );
        }
      })
      .addCase(bulkUpdateCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch category stats
      .addCase(fetchCategoryStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCategoryStats.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = action.payload;
      })
      .addCase(fetchCategoryStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const {
  clearError,
  clearCurrentCategory,
  clearSearchResults,
  setFilters,
  clearFilters,
  setPagination
} = categorySlice.actions;

export default categorySlice.reducer;



