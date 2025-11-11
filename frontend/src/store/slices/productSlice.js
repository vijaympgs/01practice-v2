import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import productService from '../../services/productService';

// Async thunks
export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async (params, { rejectWithValue }) => {
    try {
      const response = await productService.getProducts(params);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchProduct = createAsyncThunk(
  'products/fetchProduct',
  async (id, { rejectWithValue }) => {
    try {
      const response = await productService.getProduct(id);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const createProduct = createAsyncThunk(
  'products/createProduct',
  async (productData, { rejectWithValue }) => {
    try {
      const response = await productService.createProduct(productData);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateProduct = createAsyncThunk(
  'products/updateProduct',
  async (payload, { rejectWithValue }) => {
    try {
      const { id, ...productData } = payload;
      const response = await productService.updateProduct(id, productData);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const patchProduct = createAsyncThunk(
  'products/patchProduct',
  async ({ id, productData }, { rejectWithValue }) => {
    try {
      const response = await productService.patchProduct(id, productData);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteProduct = createAsyncThunk(
  'products/deleteProduct',
  async (id, { rejectWithValue }) => {
    try {
      await productService.deleteProduct(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchProductStats = createAsyncThunk(
  'products/fetchProductStats',
  async (_, { rejectWithValue }) => {
    try {
      const response = await productService.getProductStats();
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const searchProducts = createAsyncThunk(
  'products/searchProducts',
  async ({ query, filters }, { rejectWithValue }) => {
    try {
      const response = await productService.searchProducts(query, filters);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchLowStockProducts = createAsyncThunk(
  'products/fetchLowStockProducts',
  async (threshold, { rejectWithValue }) => {
    try {
      const response = await productService.getLowStockProducts(threshold);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const bulkUpdateStock = createAsyncThunk(
  'products/bulkUpdateStock',
  async (updates, { rejectWithValue }) => {
    try {
      const response = await productService.bulkUpdateStock(updates);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateStock = createAsyncThunk(
  'products/updateStock',
  async ({ id, stockQuantity }, { rejectWithValue }) => {
    try {
      const response = await productService.updateStock(id, stockQuantity);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Initial state
const initialState = {
  products: [],
  currentProduct: null,
  stats: null,
  searchResults: [],
  lowStockProducts: [],
  loading: false,
  error: null,
  filters: {
    category: '',
    is_active: '',
    stock_status: '',
    min_price: '',
    max_price: '',
    search: ''
  },
  pagination: {
    count: 0,
    next: null,
    previous: null,
    page: 1,
    pageSize: 20
  }
};

// Product slice
const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentProduct: (state) => {
      state.currentProduct = null;
    },
    clearSearchResults: (state) => {
      state.searchResults = [];
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = {
        category: '',
        is_active: '',
        stock_status: '',
        min_price: '',
        max_price: '',
        search: ''
      };
    },
    setPagination: (state, action) => {
      state.pagination = { ...state.pagination, ...action.payload };
    },
    resetPagination: (state) => {
      state.pagination = {
        count: 0,
        next: null,
        previous: null,
        page: 1,
        pageSize: 20
      };
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch products
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload.results || action.payload;
        state.pagination = {
          count: action.payload.count || 0,
          next: action.payload.next,
          previous: action.payload.previous,
          page: state.pagination.page,
          pageSize: state.pagination.pageSize
        };
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch single product
      .addCase(fetchProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.currentProduct = action.payload;
      })
      .addCase(fetchProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Create product
      .addCase(createProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.products.unshift(action.payload);
        state.pagination.count += 1;
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update product
      .addCase(updateProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.products.findIndex(p => p.id === action.payload.id);
        if (index !== -1) {
          state.products[index] = action.payload;
        }
        if (state.currentProduct && state.currentProduct.id === action.payload.id) {
          state.currentProduct = action.payload;
        }
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Patch product
      .addCase(patchProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(patchProduct.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.products.findIndex(p => p.id === action.payload.product.id);
        if (index !== -1) {
          state.products[index] = action.payload.product;
        }
        if (state.currentProduct && state.currentProduct.id === action.payload.product.id) {
          state.currentProduct = action.payload.product;
        }
      })
      .addCase(patchProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Delete product
      .addCase(deleteProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.products = state.products.filter(p => p.id !== action.payload);
        state.pagination.count -= 1;
        if (state.currentProduct && state.currentProduct.id === action.payload) {
          state.currentProduct = null;
        }
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch product stats
      .addCase(fetchProductStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductStats.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = action.payload;
      })
      .addCase(fetchProductStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Search products
      .addCase(searchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.searchResults = action.payload.products || [];
      })
      .addCase(searchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch low stock products
      .addCase(fetchLowStockProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLowStockProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.lowStockProducts = action.payload.products || [];
      })
      .addCase(fetchLowStockProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Bulk update stock
      .addCase(bulkUpdateStock.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(bulkUpdateStock.fulfilled, (state, action) => {
        state.loading = false;
        // Update products in the list with new stock quantities
        action.payload.updated_products.forEach(updatedProduct => {
          const index = state.products.findIndex(p => p.id === updatedProduct.id);
          if (index !== -1) {
            state.products[index].stock_quantity = updatedProduct.stock_quantity;
          }
        });
      })
      .addCase(bulkUpdateStock.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update stock
      .addCase(updateStock.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateStock.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.products.findIndex(p => p.id === action.payload.product.id);
        if (index !== -1) {
          state.products[index] = action.payload.product;
        }
        if (state.currentProduct && state.currentProduct.id === action.payload.product.id) {
          state.currentProduct = action.payload.product;
        }
      })
      .addCase(updateStock.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const {
  clearError,
  clearCurrentProduct,
  clearSearchResults,
  setFilters,
  clearFilters,
  setPagination,
  resetPagination
} = productSlice.actions;

export default productSlice.reducer;

