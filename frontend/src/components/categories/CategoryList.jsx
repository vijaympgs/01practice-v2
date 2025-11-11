import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  IconButton,
  Tooltip,
  Menu,
  MenuItem,
  Checkbox,
  FormControlLabel,
  TextField,
  InputAdornment,
  Pagination,
  Alert,
  CircularProgress,
  Grid,
  Paper
} from '@mui/material';
import {
  Add as AddIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  MoreVert as MoreVertIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon
} from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchCategories,
  deleteCategory,
  bulkUpdateCategories,
  setFilters,
  clearFilters,
  setPagination
} from '../../store/slices/categorySlice';
import CategoryForm from './CategoryForm';
import CategoryDetail from './CategoryDetail';

const CategoryList = () => {
  const dispatch = useDispatch();
  const {
    categories,
    loading,
    error,
    pagination,
    filters
  } = useSelector(state => state.categories);

  const [selectedCategories, setSelectedCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState(new Set());

  useEffect(() => {
    dispatch(fetchCategories(filters));
  }, [dispatch, filters]);

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
    // Debounce search
    const timeoutId = setTimeout(() => {
      dispatch(setFilters({ search: event.target.value }));
    }, 500);
    return () => clearTimeout(timeoutId);
  };

  const handleFilterChange = (filterName, value) => {
    dispatch(setFilters({ [filterName]: value }));
  };

  const handleSelectCategory = (categoryId) => {
    setSelectedCategories(prev => 
      prev.includes(categoryId) 
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const handleSelectAll = () => {
    if (selectedCategories.length === categories.length) {
      setSelectedCategories([]);
    } else {
      setSelectedCategories(categories.map(cat => cat.id));
    }
  };

  const handleBulkAction = async (action) => {
    if (selectedCategories.length === 0) return;

    try {
      await dispatch(bulkUpdateCategories({
        action,
        categoryIds: selectedCategories
      })).unwrap();
      setSelectedCategories([]);
    } catch (error) {
      console.error('Bulk action failed:', error);
    }
  };

  const handleDelete = async (categoryId) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      try {
        await dispatch(deleteCategory(categoryId)).unwrap();
      } catch (error) {
        console.error('Delete failed:', error);
      }
    }
  };

  const handleMenuClick = (event, category) => {
    setAnchorEl(event.currentTarget);
    setSelectedCategory(category);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedCategory(null);
  };

  const handleEdit = () => {
    setShowForm(true);
    handleMenuClose();
  };

  const handleView = () => {
    setShowDetail(true);
    handleMenuClose();
  };

  const handleToggleExpand = (categoryId) => {
    setExpandedCategories(prev => {
      const newSet = new Set(prev);
      if (newSet.has(categoryId)) {
        newSet.delete(categoryId);
      } else {
        newSet.add(categoryId);
      }
      return newSet;
    });
  };

  const handlePageChange = (event, page) => {
    dispatch(setPagination({ page }));
    dispatch(fetchCategories({ ...filters, page }));
  };

  const renderCategoryCard = (category) => (
    <Card key={category.id} sx={{ mb: 2 }}>
      <CardContent>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box display="flex" alignItems="center" flex={1}>
            <Checkbox
              checked={selectedCategories.includes(category.id)}
              onChange={() => handleSelectCategory(category.id)}
              size="small"
            />
            
            <Box flex={1} ml={1}>
              <Box display="flex" alignItems="center" gap={1}>
                <Typography variant="h6" component="div">
                  {category.name}
                </Typography>
                <Chip
                  label={category.is_active ? 'Active' : 'Inactive'}
                  color={category.is_active ? 'success' : 'default'}
                  size="small"
                />
                {category.level > 0 && (
                  <Chip
                    label={`Level ${category.level}`}
                    variant="outlined"
                    size="small"
                  />
                )}
              </Box>
              
              {category.description && (
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  {category.description}
                </Typography>
              )}
              
              <Box display="flex" alignItems="center" gap={2} mt={1}>
                <Typography variant="caption" color="text.secondary">
                  Sort Order: {category.sort_order}
                </Typography>
                {category.children_count > 0 && (
                  <Typography variant="caption" color="text.secondary">
                    Children: {category.children_count}
                  </Typography>
                )}
                {category.products_count > 0 && (
                  <Typography variant="caption" color="text.secondary">
                    Products: {category.products_count}
                  </Typography>
                )}
              </Box>
            </Box>
          </Box>
          
          <Box display="flex" alignItems="center" gap={1}>
            {category.children_count > 0 && (
              <IconButton
                size="small"
                onClick={() => handleToggleExpand(category.id)}
              >
                {expandedCategories.has(category.id) ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              </IconButton>
            )}
            
            <IconButton
              size="small"
              onClick={(e) => handleMenuClick(e, category)}
            >
              <MoreVertIcon />
            </IconButton>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );

  if (loading && categories.length === 0) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1">
          Categories
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setShowForm(true)}
        >
          Add Category
        </Button>
      </Box>

      {/* Search and Filters */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              placeholder="Search categories..."
              value={searchQuery}
              onChange={handleSearch}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Box display="flex" gap={1}>
              <Button
                variant="outlined"
                startIcon={<FilterIcon />}
                onClick={() => setShowFilters(!showFilters)}
              >
                Filters
              </Button>
              <Button
                variant="outlined"
                onClick={() => dispatch(clearFilters())}
              >
                Clear
              </Button>
            </Box>
          </Grid>
        </Grid>

        {/* Filter Options */}
        {showFilters && (
          <Box mt={2}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={filters.is_active === true}
                      onChange={(e) => handleFilterChange('is_active', e.target.checked ? true : null)}
                    />
                  }
                  label="Active Only"
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={filters.root_only === true}
                      onChange={(e) => handleFilterChange('root_only', e.target.checked)}
                    />
                  }
                  label="Root Categories Only"
                />
              </Grid>
            </Grid>
          </Box>
        )}
      </Paper>

      {/* Bulk Actions */}
      {selectedCategories.length > 0 && (
        <Paper sx={{ p: 2, mb: 3 }}>
          <Box display="flex" alignItems="center" gap={2}>
            <Typography variant="body2">
              {selectedCategories.length} category(ies) selected
            </Typography>
            <Button
              size="small"
              onClick={() => handleBulkAction('activate')}
            >
              Activate
            </Button>
            <Button
              size="small"
              onClick={() => handleBulkAction('deactivate')}
            >
              Deactivate
            </Button>
            <Button
              size="small"
              color="error"
              onClick={() => setSelectedCategories([])}
            >
              Clear Selection
            </Button>
          </Box>
        </Paper>
      )}

      {/* Error Alert */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error.message || 'An error occurred'}
        </Alert>
      )}

      {/* Categories List */}
      <Box>
        {categories.length === 0 ? (
          <Paper sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="h6" color="text.secondary">
              No categories found
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Create your first category to get started
            </Typography>
          </Paper>
        ) : (
          categories.map(renderCategoryCard)
        )}
      </Box>

      {/* Pagination */}
      {pagination.count > pagination.pageSize && (
        <Box display="flex" justifyContent="center" mt={3}>
          <Pagination
            count={Math.ceil(pagination.count / pagination.pageSize)}
            page={pagination.page}
            onChange={handlePageChange}
            color="primary"
          />
        </Box>
      )}

      {/* Category Form Modal */}
      {showForm && (
        <CategoryForm
          category={selectedCategory}
          onClose={() => {
            setShowForm(false);
            setSelectedCategory(null);
          }}
        />
      )}

      {/* Category Detail Modal */}
      {showDetail && selectedCategory && (
        <CategoryDetail
          category={selectedCategory}
          onClose={() => {
            setShowDetail(false);
            setSelectedCategory(null);
          }}
        />
      )}

      {/* Action Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleView}>
          <ViewIcon sx={{ mr: 1 }} />
          View Details
        </MenuItem>
        <MenuItem onClick={handleEdit}>
          <EditIcon sx={{ mr: 1 }} />
          Edit
        </MenuItem>
        <MenuItem 
          onClick={() => handleDelete(selectedCategory?.id)}
          sx={{ color: 'error.main' }}
        >
          <DeleteIcon sx={{ mr: 1 }} />
          Delete
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default CategoryList;
















