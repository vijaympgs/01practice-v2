import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import supplierService from '../../services/supplierService';

// Async thunks
export const fetchSuppliers = createAsyncThunk(
  'suppliers/fetchSuppliers',
  async (params, { rejectWithValue }) => {
    try {
      const response = await supplierService.getSuppliers(params);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchSupplier = createAsyncThunk(
  'suppliers/fetchSupplier',
  async (id, { rejectWithValue }) => {
    try {
      const response = await supplierService.getSupplier(id);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const createSupplier = createAsyncThunk(
  'suppliers/createSupplier',
  async (supplierData, { rejectWithValue }) => {
    try {
      const response = await supplierService.createSupplier(supplierData);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateSupplier = createAsyncThunk(
  'suppliers/updateSupplier',
  async (payload, { rejectWithValue }) => {
    try {
      const { id, ...supplierData } = payload;
      const response = await supplierService.updateSupplier(id, supplierData);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const patchSupplier = createAsyncThunk(
  'suppliers/patchSupplier',
  async ({ id, supplierData }, { rejectWithValue }) => {
    try {
      const response = await supplierService.patchSupplier(id, supplierData);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteSupplier = createAsyncThunk(
  'suppliers/deleteSupplier',
  async (id, { rejectWithValue }) => {
    try {
      await supplierService.deleteSupplier(id);
      return id; // Return the ID of the deleted supplier
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchSupplierStats = createAsyncThunk(
  'suppliers/fetchSupplierStats',
  async (_, { rejectWithValue }) => {
    try {
      const response = await supplierService.getSupplierStats();
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const searchSuppliers = createAsyncThunk(
  'suppliers/searchSuppliers',
  async ({ query, filters }, { rejectWithValue }) => {
    try {
      const response = await supplierService.searchSuppliers(query, filters);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchSupplierPerformance = createAsyncThunk(
  'suppliers/fetchSupplierPerformance',
  async (id, { rejectWithValue }) => {
    try {
      const response = await supplierService.getSupplierPerformance(id);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const bulkUpdateSuppliers = createAsyncThunk(
  'suppliers/bulkUpdateSuppliers',
  async ({ supplierIds, updates }, { rejectWithValue }) => {
    try {
      const response = await supplierService.bulkUpdateSuppliers(supplierIds, updates);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const activateSupplier = createAsyncThunk(
  'suppliers/activateSupplier',
  async (id, { rejectWithValue }) => {
    try {
      const response = await supplierService.activateSupplier(id);
      return response.supplier;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deactivateSupplier = createAsyncThunk(
  'suppliers/deactivateSupplier',
  async (id, { rejectWithValue }) => {
    try {
      const response = await supplierService.deactivateSupplier(id);
      return response.supplier;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const togglePreferredStatus = createAsyncThunk(
  'suppliers/togglePreferredStatus',
  async (id, { rejectWithValue }) => {
    try {
      const response = await supplierService.togglePreferredStatus(id);
      return response.supplier;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const toggleVerifiedStatus = createAsyncThunk(
  'suppliers/toggleVerifiedStatus',
  async (id, { rejectWithValue }) => {
    try {
      const response = await supplierService.toggleVerifiedStatus(id);
      return response.supplier;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchRecentSuppliers = createAsyncThunk(
  'suppliers/fetchRecentSuppliers',
  async (days, { rejectWithValue }) => {
    try {
      const response = await supplierService.getRecentSuppliers(days);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchPreferredSuppliers = createAsyncThunk(
  'suppliers/fetchPreferredSuppliers',
  async (params, { rejectWithValue }) => {
    try {
      const response = await supplierService.getPreferredSuppliers(params);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Initial state
const initialState = {
  suppliers: [],
  currentSupplier: null,
  stats: null,
  performance: null,
  recentSuppliers: [],
  preferredSuppliers: [],
  loading: false,
  error: null,
  pagination: {
    count: 0,
    next: null,
    previous: null,
    page: 1,
    pageSize: 20
  },
  filters: {},
  searchTerm: ''
};

const supplierSlice = createSlice({
  name: 'suppliers',
  initialState,
  reducers: {
    setSearchTerm: (state, action) => {
      state.searchTerm = action.payload;
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = {};
    },
    setPagination: (state, action) => {
      state.pagination = { ...state.pagination, ...action.payload };
    },
    clearError: (state) => {
      state.error = null;
    },
    resetPagination: (state) => {
      state.pagination = {
        count: 0,
        next: null,
        previous: null,
        page: 1,
        pageSize: 20
      };
    },
    clearCurrentSupplier: (state) => {
      state.currentSupplier = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch suppliers
      .addCase(fetchSuppliers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSuppliers.fulfilled, (state, action) => {
        state.loading = false;
        state.suppliers = action.payload.results || action.payload;
        state.pagination = {
          count: action.payload.count || 0,
          next: action.payload.next,
          previous: action.payload.previous,
          page: state.pagination.page,
          pageSize: state.pagination.pageSize
        };
      })
      .addCase(fetchSuppliers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch single supplier
      .addCase(fetchSupplier.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSupplier.fulfilled, (state, action) => {
        state.loading = false;
        state.currentSupplier = action.payload;
      })
      .addCase(fetchSupplier.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Create supplier
      .addCase(createSupplier.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createSupplier.fulfilled, (state, action) => {
        state.loading = false;
        state.suppliers.unshift(action.payload);
        state.pagination.count += 1;
      })
      .addCase(createSupplier.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update supplier
      .addCase(updateSupplier.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateSupplier.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.suppliers.findIndex(s => s.id === action.payload.id);
        if (index !== -1) {
          state.suppliers[index] = action.payload;
        }
        if (state.currentSupplier && state.currentSupplier.id === action.payload.id) {
          state.currentSupplier = action.payload;
        }
      })
      .addCase(updateSupplier.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Patch supplier
      .addCase(patchSupplier.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(patchSupplier.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.suppliers.findIndex(s => s.id === action.payload.id);
        if (index !== -1) {
          state.suppliers[index] = action.payload;
        }
        if (state.currentSupplier && state.currentSupplier.id === action.payload.id) {
          state.currentSupplier = action.payload;
        }
      })
      .addCase(patchSupplier.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Delete supplier
      .addCase(deleteSupplier.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteSupplier.fulfilled, (state, action) => {
        state.loading = false;
        state.suppliers = state.suppliers.filter(supplier => supplier.id !== action.payload);
        state.pagination.count -= 1;
      })
      .addCase(deleteSupplier.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch supplier stats
      .addCase(fetchSupplierStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSupplierStats.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = action.payload;
      })
      .addCase(fetchSupplierStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Search suppliers
      .addCase(searchSuppliers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchSuppliers.fulfilled, (state, action) => {
        state.loading = false;
        state.suppliers = action.payload.results || action.payload;
        state.pagination = {
          count: action.payload.count || 0,
          next: action.payload.next,
          previous: action.payload.previous,
          page: state.pagination.page,
          pageSize: state.pagination.pageSize
        };
      })
      .addCase(searchSuppliers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch supplier performance
      .addCase(fetchSupplierPerformance.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSupplierPerformance.fulfilled, (state, action) => {
        state.loading = false;
        state.performance = action.payload;
      })
      .addCase(fetchSupplierPerformance.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Bulk update suppliers
      .addCase(bulkUpdateSuppliers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(bulkUpdateSuppliers.fulfilled, (state, action) => {
        state.loading = false;
        // Refresh suppliers after bulk update
      })
      .addCase(bulkUpdateSuppliers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Activate supplier
      .addCase(activateSupplier.fulfilled, (state, action) => {
        const index = state.suppliers.findIndex(s => s.id === action.payload.id);
        if (index !== -1) {
          state.suppliers[index] = action.payload;
        }
        if (state.currentSupplier && state.currentSupplier.id === action.payload.id) {
          state.currentSupplier = action.payload;
        }
      })

      // Deactivate supplier
      .addCase(deactivateSupplier.fulfilled, (state, action) => {
        const index = state.suppliers.findIndex(s => s.id === action.payload.id);
        if (index !== -1) {
          state.suppliers[index] = action.payload;
        }
        if (state.currentSupplier && state.currentSupplier.id === action.payload.id) {
          state.currentSupplier = action.payload;
        }
      })

      // Toggle preferred status
      .addCase(togglePreferredStatus.fulfilled, (state, action) => {
        const index = state.suppliers.findIndex(s => s.id === action.payload.id);
        if (index !== -1) {
          state.suppliers[index] = action.payload;
        }
        if (state.currentSupplier && state.currentSupplier.id === action.payload.id) {
          state.currentSupplier = action.payload;
        }
      })

      // Toggle verified status
      .addCase(toggleVerifiedStatus.fulfilled, (state, action) => {
        const index = state.suppliers.findIndex(s => s.id === action.payload.id);
        if (index !== -1) {
          state.suppliers[index] = action.payload;
        }
        if (state.currentSupplier && state.currentSupplier.id === action.payload.id) {
          state.currentSupplier = action.payload;
        }
      })

      // Fetch recent suppliers
      .addCase(fetchRecentSuppliers.fulfilled, (state, action) => {
        state.recentSuppliers = action.payload.results || action.payload;
      })

      // Fetch preferred suppliers
      .addCase(fetchPreferredSuppliers.fulfilled, (state, action) => {
        state.preferredSuppliers = action.payload.results || action.payload;
      });
  },
});

export const {
  setSearchTerm,
  setFilters,
  clearFilters,
  setPagination,
  clearError,
  resetPagination,
  clearCurrentSupplier
} = supplierSlice.actions;

export default supplierSlice.reducer;








