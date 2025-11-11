import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import customerService from '../../services/customerService';

// Async thunks
export const fetchCustomers = createAsyncThunk(
  'customers/fetchCustomers',
  async (params, { rejectWithValue }) => {
    try {
      const response = await customerService.getCustomers(params);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchCustomer = createAsyncThunk(
  'customers/fetchCustomer',
  async (id, { rejectWithValue }) => {
    try {
      const response = await customerService.getCustomer(id);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const createCustomer = createAsyncThunk(
  'customers/createCustomer',
  async (customerData, { rejectWithValue }) => {
    try {
      const response = await customerService.createCustomer(customerData);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateCustomer = createAsyncThunk(
  'customers/updateCustomer',
  async (payload, { rejectWithValue }) => {
    try {
      const { id, ...customerData } = payload;
      const response = await customerService.updateCustomer(id, customerData);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const patchCustomer = createAsyncThunk(
  'customers/patchCustomer',
  async ({ id, customerData }, { rejectWithValue }) => {
    try {
      const response = await customerService.patchCustomer(id, customerData);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteCustomer = createAsyncThunk(
  'customers/deleteCustomer',
  async (id, { rejectWithValue }) => {
    try {
      await customerService.deleteCustomer(id);
      return id; // Return the ID of the deleted customer
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchCustomerStats = createAsyncThunk(
  'customers/fetchCustomerStats',
  async (_, { rejectWithValue }) => {
    try {
      const response = await customerService.getCustomerStats();
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const searchCustomers = createAsyncThunk(
  'customers/searchCustomers',
  async ({ query, filters }, { rejectWithValue }) => {
    try {
      const response = await customerService.searchCustomers(query, filters);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchCustomerHistory = createAsyncThunk(
  'customers/fetchCustomerHistory',
  async (id, { rejectWithValue }) => {
    try {
      const response = await customerService.getCustomerHistory(id);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const bulkUpdateCustomers = createAsyncThunk(
  'customers/bulkUpdateCustomers',
  async ({ customerIds, updates }, { rejectWithValue }) => {
    try {
      const response = await customerService.bulkUpdateCustomers(customerIds, updates);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const activateCustomer = createAsyncThunk(
  'customers/activateCustomer',
  async (id, { rejectWithValue }) => {
    try {
      const response = await customerService.activateCustomer(id);
      return response.customer;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deactivateCustomer = createAsyncThunk(
  'customers/deactivateCustomer',
  async (id, { rejectWithValue }) => {
    try {
      const response = await customerService.deactivateCustomer(id);
      return response.customer;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const toggleVipStatus = createAsyncThunk(
  'customers/toggleVipStatus',
  async (id, { rejectWithValue }) => {
    try {
      const response = await customerService.toggleVipStatus(id);
      return response.customer;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchRecentCustomers = createAsyncThunk(
  'customers/fetchRecentCustomers',
  async (days, { rejectWithValue }) => {
    try {
      const response = await customerService.getRecentCustomers(days);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchBirthdayCustomers = createAsyncThunk(
  'customers/fetchBirthdayCustomers',
  async (_, { rejectWithValue }) => {
    try {
      const response = await customerService.getBirthdayCustomers();
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Initial state
const initialState = {
  customers: [],
  currentCustomer: null,
  stats: null,
  history: null,
  recentCustomers: [],
  birthdayCustomers: [],
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

const customerSlice = createSlice({
  name: 'customers',
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
    clearCurrentCustomer: (state) => {
      state.currentCustomer = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch customers
      .addCase(fetchCustomers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCustomers.fulfilled, (state, action) => {
        state.loading = false;
        state.customers = action.payload.results || action.payload;
        state.pagination = {
          count: action.payload.count || 0,
          next: action.payload.next,
          previous: action.payload.previous,
          page: state.pagination.page,
          pageSize: state.pagination.pageSize
        };
      })
      .addCase(fetchCustomers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch single customer
      .addCase(fetchCustomer.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCustomer.fulfilled, (state, action) => {
        state.loading = false;
        state.currentCustomer = action.payload;
      })
      .addCase(fetchCustomer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Create customer
      .addCase(createCustomer.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createCustomer.fulfilled, (state, action) => {
        state.loading = false;
        state.customers.unshift(action.payload);
        state.pagination.count += 1;
      })
      .addCase(createCustomer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update customer
      .addCase(updateCustomer.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCustomer.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.customers.findIndex(c => c.id === action.payload.id);
        if (index !== -1) {
          state.customers[index] = action.payload;
        }
        if (state.currentCustomer && state.currentCustomer.id === action.payload.id) {
          state.currentCustomer = action.payload;
        }
      })
      .addCase(updateCustomer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Patch customer
      .addCase(patchCustomer.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(patchCustomer.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.customers.findIndex(c => c.id === action.payload.id);
        if (index !== -1) {
          state.customers[index] = action.payload;
        }
        if (state.currentCustomer && state.currentCustomer.id === action.payload.id) {
          state.currentCustomer = action.payload;
        }
      })
      .addCase(patchCustomer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Delete customer
      .addCase(deleteCustomer.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteCustomer.fulfilled, (state, action) => {
        state.loading = false;
        state.customers = state.customers.filter(customer => customer.id !== action.payload);
        state.pagination.count -= 1;
      })
      .addCase(deleteCustomer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch customer stats
      .addCase(fetchCustomerStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCustomerStats.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = action.payload;
      })
      .addCase(fetchCustomerStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Search customers
      .addCase(searchCustomers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchCustomers.fulfilled, (state, action) => {
        state.loading = false;
        state.customers = action.payload.results || action.payload;
        state.pagination = {
          count: action.payload.count || 0,
          next: action.payload.next,
          previous: action.payload.previous,
          page: state.pagination.page,
          pageSize: state.pagination.pageSize
        };
      })
      .addCase(searchCustomers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch customer history
      .addCase(fetchCustomerHistory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCustomerHistory.fulfilled, (state, action) => {
        state.loading = false;
        state.history = action.payload;
      })
      .addCase(fetchCustomerHistory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Bulk update customers
      .addCase(bulkUpdateCustomers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(bulkUpdateCustomers.fulfilled, (state, action) => {
        state.loading = false;
        // Refresh customers after bulk update
      })
      .addCase(bulkUpdateCustomers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Activate customer
      .addCase(activateCustomer.fulfilled, (state, action) => {
        const index = state.customers.findIndex(c => c.id === action.payload.id);
        if (index !== -1) {
          state.customers[index] = action.payload;
        }
        if (state.currentCustomer && state.currentCustomer.id === action.payload.id) {
          state.currentCustomer = action.payload;
        }
      })

      // Deactivate customer
      .addCase(deactivateCustomer.fulfilled, (state, action) => {
        const index = state.customers.findIndex(c => c.id === action.payload.id);
        if (index !== -1) {
          state.customers[index] = action.payload;
        }
        if (state.currentCustomer && state.currentCustomer.id === action.payload.id) {
          state.currentCustomer = action.payload;
        }
      })

      // Toggle VIP status
      .addCase(toggleVipStatus.fulfilled, (state, action) => {
        const index = state.customers.findIndex(c => c.id === action.payload.id);
        if (index !== -1) {
          state.customers[index] = action.payload;
        }
        if (state.currentCustomer && state.currentCustomer.id === action.payload.id) {
          state.currentCustomer = action.payload;
        }
      })

      // Fetch recent customers
      .addCase(fetchRecentCustomers.fulfilled, (state, action) => {
        state.recentCustomers = action.payload.results || action.payload;
      })

      // Fetch birthday customers
      .addCase(fetchBirthdayCustomers.fulfilled, (state, action) => {
        state.birthdayCustomers = action.payload.results || action.payload;
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
  clearCurrentCustomer
} = customerSlice.actions;

export default customerSlice.reducer;








