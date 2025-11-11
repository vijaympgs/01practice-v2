import React, { useState } from 'react';
import PageTitle from '../../components/common/PageTitle';
import CardHeader from '../../components/common/CardHeader';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Tabs,
  Tab,
  Grid,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
  Divider,
  Chip,
  Alert,
  Snackbar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Tooltip,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Autocomplete,
  Slider,
  Rating,
} from '@mui/material';
import {
  Save,
  Refresh,
  Add,
  Edit,
  Delete,
  Image,
  AttachMoney,
  Inventory,
  Category,
  Description,
  Settings,
  Analytics,
  Store,
  LocalShipping,
  PhotoCamera,
  VideoLibrary,
  Visibility,
  Search,
  TrendingUp,
  TrendingDown,
  Star,
  StarBorder,
} from '@mui/icons-material';
import ProductVariantsManager from '../../components/products/ProductVariantsManager';
import ProductBundlesManager from '../../components/products/ProductBundlesManager';
import DigitalProductsManager from '../../components/products/DigitalProductsManager';

const EnhancedItemMaster = () => {
  const [tabValue, setTabValue] = useState(0);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [imageDialogOpen, setImageDialogOpen] = useState(false);

  // Comprehensive product data structure
  const [productData, setProductData] = useState({
    // Product Information
    basicInfo: {
      name: 'iPhone 15 Pro Max',
      sku: 'PRD-2025-001250',
      barcode: '1234567890123',
      description: 'Latest iPhone with advanced features and premium design',
      shortDescription: 'iPhone 15 Pro Max - 256GB',
      brand: 'Apple',
      model: 'iPhone 15 Pro Max',
      category: 'Electronics',
      subcategory: 'Smartphones',
      tags: ['smartphone', 'apple', 'premium', '5g'],
    },

    // Visual Assets
    visualAssets: {
      images: [
        { id: 1, url: '/api/placeholder/300/300', alt: 'iPhone 15 Pro Max Front', type: 'main', featured: true },
        { id: 2, url: '/api/placeholder/300/300', alt: 'iPhone 15 Pro Max Back', type: 'gallery', featured: false },
        { id: 3, url: '/api/placeholder/300/300', alt: 'iPhone 15 Pro Max Side', type: 'gallery', featured: false },
      ],
      videos: [
        { id: 1, url: '/api/placeholder/600/400', title: 'Product Demo', duration: '2:30' },
      ],
      documents: [
        { id: 1, name: 'User Manual.pdf', url: '/documents/manual.pdf', type: 'pdf' },
        { id: 2, name: 'Specification Sheet.pdf', url: '/documents/specs.pdf', type: 'pdf' },
      ],
    },

    // Attributes & Specifications
    attributes: {
      color: 'Natural Titanium',
      storage: '256GB',
      connectivity: '5G',
      operatingSystem: 'iOS 17',
      display: '6.7-inch Super Retina XDR',
      camera: '48MP Main Camera',
      battery: 'Up to 29 hours video playback',
      weight: '221g',
      dimensions: '159.9 × 76.7 × 8.25 mm',
      warranty: '1 Year',
      certifications: ['FCC', 'CE', 'IC'],
    },

    // Package Information
    packaging: {
      weight: '0.5kg',
      dimensions: '20 × 15 × 8 cm',
      packageType: 'Box',
      itemsPerPackage: 1,
      bulkPackaging: false,
      fragile: true,
      hazardous: false,
      shippingClass: 'Standard',
    },

    // UOM & Conversion
    uom: {
      stockUOM: 'Each',
      salesUOM: 'Each',
      purchaseUOM: 'Each',
      conversions: [
        { from: 'Each', to: 'Dozen', factor: 12 },
        { from: 'Each', to: 'Case', factor: 24 },
      ],
    },

    // Pricing & Promotions
    pricing: {
      costPrice: 899.00,
      sellingPrice: 1199.00,
      margin: 33.36,
      markup: 50.00,
      tierPricing: [
        { minQty: 1, maxQty: 9, price: 1199.00 },
        { minQty: 10, maxQty: 49, price: 1149.00 },
        { minQty: 50, maxQty: 999, price: 1099.00 },
      ],
      promotions: [
        { name: 'Holiday Sale', discount: 10, startDate: '2024-12-01', endDate: '2024-12-31' },
      ],
    },

    // Inventory & Logistics
    inventory: {
      stockLevel: 45,
      minStock: 10,
      maxStock: 100,
      reorderPoint: 15,
      reorderQuantity: 50,
      leadTime: 7,
      supplier: 'Apple Inc.',
      warehouse: 'Main Warehouse',
      binLocation: 'A-12-05',
      trackSerial: true,
      trackBatch: false,
    },

    // SEO & Marketing
    seo: {
      metaTitle: 'iPhone 15 Pro Max - Latest Apple Smartphone | Your Store',
      metaDescription: 'Buy iPhone 15 Pro Max with advanced features. Premium design, 5G connectivity, and powerful performance.',
      keywords: ['iphone', 'apple', 'smartphone', '5g', 'premium'],
      canonicalUrl: 'https://yourstore.com/products/iphone-15-pro-max',
      socialTitle: 'iPhone 15 Pro Max - Now Available!',
      socialDescription: 'Experience the latest in smartphone technology',
      socialImage: '/api/placeholder/1200/630',
    },

    // Compliance & Certifications
    compliance: {
      countryOfOrigin: 'China',
      manufacturer: 'Apple Inc.',
      importer: 'Your Company Name',
      certifications: ['FCC', 'CE', 'IC', 'RoHS'],
      hazardousMaterials: false,
      restrictedMaterials: false,
      customsTariff: '8517.12.00',
      exportLicense: 'Not Required',
    },

    // Vendor & Sourcing
    vendor: {
      primarySupplier: 'Apple Inc.',
      supplierCode: 'SUPP-001',
      supplierPartNumber: 'A3108',
      minimumOrderQuantity: 10,
      leadTime: 7,
      paymentTerms: 'Net 30',
      shippingTerms: 'FOB',
      qualityRating: 5,
      performanceScore: 95,
    },

    // Analytics & Performance
    analytics: {
      totalSold: 1250,
      revenue: 1498750.00,
      averageRating: 4.8,
      reviewCount: 156,
      returnRate: 2.1,
      profitMargin: 33.36,
      salesVelocity: 45,
      seasonality: 'High',
      trend: 'Growing',
    },
  });

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleInputChange = (section, field, value) => {
    setProductData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handleNestedInputChange = (section, subsection, field, value) => {
    setProductData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [subsection]: {
          ...prev[section][subsection],
          [field]: value
        }
      }
    }));
  };

  const handleSave = () => {
    setSnackbar({
      open: true,
      message: 'Product saved successfully!',
      severity: 'success'
    });
    console.log('Saving product data:', productData);
  };

  const renderProductInformation = () => (
    <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Basic Information
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Product Name"
                  value={productData.basicInfo.name}
                  onChange={(e) => handleInputChange('basicInfo', 'name', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="SKU"
                  value={productData.basicInfo.sku}
                  onChange={(e) => handleInputChange('basicInfo', 'sku', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Barcode"
                  value={productData.basicInfo.barcode}
                  onChange={(e) => handleInputChange('basicInfo', 'barcode', e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  label="Description"
                  value={productData.basicInfo.description}
                  onChange={(e) => handleInputChange('basicInfo', 'description', e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Short Description"
                  value={productData.basicInfo.shortDescription}
                  onChange={(e) => handleInputChange('basicInfo', 'shortDescription', e.target.value)}
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>
      
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Classification
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Brand"
                  value={productData.basicInfo.brand}
                  onChange={(e) => handleInputChange('basicInfo', 'brand', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Model"
                  value={productData.basicInfo.model}
                  onChange={(e) => handleInputChange('basicInfo', 'model', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Category</InputLabel>
                  <Select
                    value={productData.basicInfo.category}
                    label="Category"
                    onChange={(e) => handleInputChange('basicInfo', 'category', e.target.value)}
                  >
                    <MenuItem value="Electronics">Electronics</MenuItem>
                    <MenuItem value="Fashion">Fashion</MenuItem>
                    <MenuItem value="Home & Garden">Home & Garden</MenuItem>
                    <MenuItem value="Sports">Sports</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Subcategory</InputLabel>
                  <Select
                    value={productData.basicInfo.subcategory}
                    label="Subcategory"
                    onChange={(e) => handleInputChange('basicInfo', 'subcategory', e.target.value)}
                  >
                    <MenuItem value="Smartphones">Smartphones</MenuItem>
                    <MenuItem value="Laptops">Laptops</MenuItem>
                    <MenuItem value="Tablets">Tablets</MenuItem>
                    <MenuItem value="Accessories">Accessories</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <Autocomplete
                  multiple
                  options={['smartphone', 'apple', 'premium', '5g', 'wireless', 'bluetooth']}
                  value={productData.basicInfo.tags}
                  onChange={(event, newValue) => handleInputChange('basicInfo', 'tags', newValue)}
                  renderTags={(value, getTagProps) =>
                    value.map((option, index) => (
                      <Chip variant="outlined" label={option} {...getTagProps({ index })} />
                    ))
                  }
                  renderInput={(params) => (
                    <TextField {...params} label="Tags" placeholder="Add tags" />
                  )}
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );

  const renderVisualAssets = () => (
    <Grid container spacing={3}>
      <Grid item xs={12} md={8}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Product Images
            </Typography>
            <Grid container spacing={2}>
              {productData.visualAssets.images.map((image) => (
                <Grid item xs={12} sm={6} md={4} key={image.id}>
                  <Card>
                    <Box sx={{ position: 'relative' }}>
                      <Box
                        sx={{
                          height: 200,
                          backgroundImage: `url(${image.url})`,
                          backgroundSize: 'cover',
                          backgroundPosition: 'center',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <Avatar sx={{ width: 80, height: 80, bgcolor: 'rgba(0,0,0,0.5)' }}>
                          <Image />
                        </Avatar>
                      </Box>
                      {image.featured && (
                        <Chip
                          label="Featured"
                          color="primary"
                          size="small"
                          sx={{ position: 'absolute', top: 8, left: 8 }}
                        />
                      )}
                      <Chip
                        label={image.type}
                        color="secondary"
                        size="small"
                        sx={{ position: 'absolute', top: 8, right: 8 }}
                      />
                    </Box>
                    <CardContent>
                      <Typography variant="body2" noWrap>
                        {image.alt}
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                        <IconButton size="small">
                          <Edit />
                        </IconButton>
                        <IconButton size="small">
                          <Delete />
                        </IconButton>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
              <Grid item xs={12} sm={6} md={4}>
                <Card sx={{ border: '2px dashed', borderColor: 'primary.main', cursor: 'pointer' }}>
                  <CardContent sx={{ textAlign: 'center', py: 4 }}>
                    <PhotoCamera sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
                    <Typography variant="h6" color="primary">
                      Add Image
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Upload product image
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>
      
      <Grid item xs={12} md={4}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Videos & Documents
            </Typography>
            
            <Typography variant="subtitle2" gutterBottom>
              Product Videos
            </Typography>
            {productData.visualAssets.videos.map((video) => (
              <Box key={video.id} sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <Avatar sx={{ bgcolor: 'error.main' }}>
                  <VideoLibrary />
                </Avatar>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="body2">{video.title}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    Duration: {video.duration}
                  </Typography>
                </Box>
                <IconButton size="small">
                  <Edit />
                </IconButton>
              </Box>
            ))}
            
            <Button
              variant="outlined"
              startIcon={<VideoLibrary />}
              fullWidth
              sx={{ mb: 3 }}
            >
              Add Video
            </Button>

            <Divider sx={{ mb: 2 }} />

            <Typography variant="subtitle2" gutterBottom>
              Documents
            </Typography>
            {productData.visualAssets.documents.map((doc) => (
              <Box key={doc.id} sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                <Avatar sx={{ bgcolor: 'info.main', width: 32, height: 32 }}>
                  <Description />
                </Avatar>
                <Typography variant="body2" sx={{ flex: 1 }}>
                  {doc.name}
                </Typography>
                <IconButton size="small">
                  <Delete />
                </IconButton>
              </Box>
            ))}
            
            <Button
              variant="outlined"
              startIcon={<Add />}
              fullWidth
            >
              Add Document
            </Button>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );

  const renderAttributesSpecifications = () => (
    <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Product Attributes
            </Typography>
            <Grid container spacing={2}>
              {Object.entries(productData.attributes).map(([key, value]) => (
                <Grid item xs={12} key={key}>
                  <TextField
                    fullWidth
                    label={key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}
                    value={value}
                    onChange={(e) => handleInputChange('attributes', key, e.target.value)}
                    multiline={key === 'certifications'}
                  />
                </Grid>
              ))}
            </Grid>
          </CardContent>
        </Card>
      </Grid>
      
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Custom Attributes
            </Typography>
            <Alert severity="info" sx={{ mb: 2 }}>
              Add custom attributes specific to your product category
            </Alert>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Attribute Name"
                  placeholder="e.g., Screen Size"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Attribute Value"
                  placeholder="e.g., 6.7 inches"
                />
              </Grid>
              <Grid item xs={12}>
                <Button variant="outlined" startIcon={<Add />} fullWidth>
                  Add Custom Attribute
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );

  const renderPricingPromotions = () => (
    <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Pricing Information
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Cost Price"
                  type="number"
                  value={productData.pricing.costPrice}
                  onChange={(e) => handleInputChange('pricing', 'costPrice', parseFloat(e.target.value))}
                  InputProps={{
                    startAdornment: <AttachMoney />,
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Selling Price"
                  type="number"
                  value={productData.pricing.sellingPrice}
                  onChange={(e) => handleInputChange('pricing', 'sellingPrice', parseFloat(e.target.value))}
                  InputProps={{
                    startAdornment: <AttachMoney />,
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Margin %"
                  type="number"
                  value={productData.pricing.margin}
                  InputProps={{
                    readOnly: true,
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Markup %"
                  type="number"
                  value={productData.pricing.markup}
                  InputProps={{
                    readOnly: true,
                  }}
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>
      
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Tier Pricing
            </Typography>
            <TableContainer component={Paper} variant="outlined">
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Min Qty</TableCell>
                    <TableCell>Max Qty</TableCell>
                    <TableCell>Price</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {productData.pricing.tierPricing.map((tier, index) => (
                    <TableRow key={index}>
                      <TableCell>{tier.minQty}</TableCell>
                      <TableCell>{tier.maxQty}</TableCell>
                      <TableCell>${tier.price}</TableCell>
                      <TableCell>
                        <IconButton size="small">
                          <Edit />
                        </IconButton>
                        <IconButton size="small">
                          <Delete />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <Button variant="outlined" startIcon={<Add />} sx={{ mt: 2 }}>
              Add Tier
            </Button>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );

  const renderAnalyticsPerformance = () => (
    <Grid container spacing={3}>
      <Grid item xs={12} md={3}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Sales Performance
            </Typography>
            <Box sx={{ textAlign: 'center', mb: 2 }}>
              <Typography variant="h4" color="primary">
                {productData.analytics.totalSold.toLocaleString()}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Units Sold
              </Typography>
            </Box>
            <Box sx={{ textAlign: 'center', mb: 2 }}>
              <Typography variant="h5" color="success.main">
                ${productData.analytics.revenue.toLocaleString()}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Revenue
              </Typography>
            </Box>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h6" color="info.main">
                {productData.analytics.salesVelocity}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Sales Velocity
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Grid>
      
      <Grid item xs={12} md={3}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Customer Rating
            </Typography>
            <Box sx={{ textAlign: 'center', mb: 2 }}>
              <Rating
                value={productData.analytics.averageRating}
                readOnly
                precision={0.1}
                size="large"
              />
              <Typography variant="h5" sx={{ mt: 1 }}>
                {productData.analytics.averageRating}/5
              </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
              Based on {productData.analytics.reviewCount} reviews
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      
      <Grid item xs={12} md={3}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Profitability
            </Typography>
            <Box sx={{ textAlign: 'center', mb: 2 }}>
              <Typography variant="h4" color="success.main">
                {productData.analytics.profitMargin}%
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Profit Margin
              </Typography>
            </Box>
            <Box sx={{ textAlign: 'center', mb: 2 }}>
              <Typography variant="h6" color="warning.main">
                {productData.analytics.returnRate}%
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Return Rate
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Grid>
      
      <Grid item xs={12} md={3}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Market Trend
            </Typography>
            <Box sx={{ textAlign: 'center', mb: 2 }}>
              {productData.analytics.trend === 'Growing' ? (
                <TrendingUp sx={{ fontSize: 48, color: 'success.main' }} />
              ) : (
                <TrendingDown sx={{ fontSize: 48, color: 'error.main' }} />
              )}
              <Typography variant="h6" color={productData.analytics.trend === 'Growing' ? 'success.main' : 'error.main'}>
                {productData.analytics.trend}
              </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
              Seasonality: {productData.analytics.seasonality}
            </Typography>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );

  const renderTabContent = () => {
    switch (tabValue) {
      case 0:
        return renderProductInformation();
      case 1:
        return renderVisualAssets();
      case 2:
        return renderAttributesSpecifications();
      case 3:
        return renderPricingPromotions();
      case 4:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Alert severity="info">
                Package, UOM, Inventory, SEO, Compliance, Vendor, and other tabs will be implemented in the next iteration.
              </Alert>
            </Grid>
          </Grid>
        );
      case 5:
        return renderAnalyticsPerformance();
      case 6:
        return <ProductVariantsManager />;
      case 7:
        return <ProductBundlesManager />;
      case 8:
        return <DigitalProductsManager />;
      default:
        return renderProductInformation();
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <PageTitle 
            title="Enhanced Item Master" 
            subtitle="Comprehensive product management with advanced features"
            showIcon={true}
            icon={<Description />}
          />
        </Box>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<Refresh />}
          >
            Refresh
          </Button>
          <Button
            variant="contained"
            startIcon={<Save />}
            onClick={handleSave}
          >
            Save Product
          </Button>
        </Box>
      </Box>

      {/* Tabs */}
      <Card sx={{ mb: 3 }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab 
            icon={<Description />} 
            label="Product Information" 
            iconPosition="start"
          />
          <Tab 
            icon={<Image />} 
            label="Visual Assets" 
            iconPosition="start"
          />
          <Tab 
            icon={<Settings />} 
            label="Attributes & Specifications" 
            iconPosition="start"
          />
          <Tab 
            icon={<AttachMoney />} 
            label="Pricing & Promotions" 
            iconPosition="start"
          />
          <Tab 
            icon={<Inventory />} 
            label="Package & Inventory" 
            iconPosition="start"
          />
          <Tab 
            icon={<Analytics />} 
            label="Analytics & Performance" 
            iconPosition="start"
          />
          <Tab 
            icon={<Settings />} 
            label="Product Variants" 
            iconPosition="start"
          />
          <Tab 
            icon={<Inventory />} 
            label="Product Bundles" 
            iconPosition="start"
          />
          <Tab 
            icon={<Image />} 
            label="Digital Products" 
            iconPosition="start"
          />
        </Tabs>
      </Card>

      {/* Tab Content */}
      {renderTabContent()}

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert 
          onClose={() => setSnackbar({ ...snackbar, open: false })} 
          severity={snackbar.severity}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default EnhancedItemMaster;
