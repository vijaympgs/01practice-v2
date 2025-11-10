import React, { useState, useEffect } from 'react';
import PageTitle from '../components/common/PageTitle';
import CardHeader from '../components/common/CardHeader';
import {
  Box,
  Container,
  Typography,
  Tabs,
  Tab,
  Paper,
  Alert,
  CircularProgress
} from '@mui/material';
import {
  Inventory as InventoryIcon,
  Analytics as AnalyticsIcon,
  Warning as WarningIcon,
  Search as SearchIcon
} from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts, fetchProductStats } from '../store/slices/productSlice';
import ProductList from '../components/products/ProductList';
import ProductForm from '../components/products/ProductForm';
import ProductDetail from '../components/products/ProductDetail';

const ProductsPage = () => {
  const dispatch = useDispatch();
  const { loading, error } = useSelector(state => state.products);
  
  const [activeTab, setActiveTab] = useState(0);
  const [formOpen, setFormOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [formMode, setFormMode] = useState('create');

  useEffect(() => {
    // Load products when component mounts
    dispatch(fetchProducts());
  }, [dispatch]);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    setSelectedProduct(null);
  };

  const handleAddProduct = () => {
    setFormMode('create');
    setSelectedProduct(null);
    setFormOpen(true);
  };

  const handleEditProduct = (product) => {
    setFormMode('edit');
    setSelectedProduct(product);
    setFormOpen(true);
  };

  const handleViewProduct = (product) => {
    setSelectedProduct(product);
    setActiveTab(2); // Switch to detail tab
  };

  const handleDeleteProduct = (product) => {
    // This will be handled by the ProductList component
    console.log('Delete product:', product);
  };

  const handleFormClose = () => {
    setFormOpen(false);
    setSelectedProduct(null);
  };

  const handleFormSubmit = () => {
    setFormOpen(false);
    setSelectedProduct(null);
    // Refresh the product list
    dispatch(fetchProducts());
  };

  const TabPanel = ({ children, value, index, ...other }) => {
    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`products-tabpanel-${index}`}
        aria-labelledby={`products-tab-${index}`}
        {...other}
      >
        {value === index && (
          <Box sx={{ p: 3 }}>
            {children}
          </Box>
        )}
      </div>
    );
  };

  if (loading && !selectedProduct) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="xl">
      <Box sx={{ pt: 5, pb: 3 }}>
        {/* Page Header */}
        <Box sx={{ mb: 4 }}>
          <PageTitle 
            title="Products" 
            subtitle="Manage your product inventory, pricing, and details"
            showIcon={true}
            icon={<InventoryIcon />}
          />
        </Box>

        {/* Error Alert */}
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {/* Tabs */}
        <Paper sx={{ mb: 3 }}>
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            aria-label="products tabs"
            variant="fullWidth"
          >
            <Tab
              icon={<InventoryIcon />}
              label="Product List"
              id="products-tab-0"
              aria-controls="products-tabpanel-0"
            />
            <Tab
              icon={<AnalyticsIcon />}
              label="Analytics"
              id="products-tab-1"
              aria-controls="products-tabpanel-1"
            />
            <Tab
              icon={<SearchIcon />}
              label="Product Details"
              id="products-tab-2"
              aria-controls="products-tabpanel-2"
            />
          </Tabs>
        </Paper>

        {/* Tab Panels */}
        <TabPanel value={activeTab} index={0}>
          <ProductList
            onAddProduct={handleAddProduct}
            onEditProduct={handleEditProduct}
            onViewProduct={handleViewProduct}
            onDeleteProduct={handleDeleteProduct}
          />
        </TabPanel>

        <TabPanel value={activeTab} index={1}>
          <Box>
            <Typography variant="h5" gutterBottom>
              Product Analytics
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Analytics and reporting features will be implemented in a future update.
            </Typography>
            {/* TODO: Implement analytics dashboard */}
          </Box>
        </TabPanel>

        <TabPanel value={activeTab} index={2}>
          {selectedProduct ? (
            <ProductDetail
              product={selectedProduct}
              onEdit={handleEditProduct}
              onDelete={handleDeleteProduct}
              onClose={() => setSelectedProduct(null)}
            />
          ) : (
            <Box textAlign="center" py={4}>
              <Typography variant="h6" color="text.secondary">
                Select a product to view details
              </Typography>
            </Box>
          )}
        </TabPanel>

        {/* Product Form Dialog */}
        <ProductForm
          open={formOpen}
          onClose={handleFormClose}
          product={selectedProduct}
          mode={formMode}
        />
      </Box>
    </Container>
  );
};

export default ProductsPage;
