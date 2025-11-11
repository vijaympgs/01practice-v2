import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Checkbox,
  Box,
  Typography,
  Alert,
  CircularProgress,
  Grid
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import {
  createCategory,
  updateCategory,
  fetchCategories,
  clearError
} from '../../store/slices/categorySlice';

const CategoryForm = ({ category, onClose }) => {
  const dispatch = useDispatch();
  const { loading, error, categories } = useSelector(state => state.categories);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    parent: '',
    is_active: true,
    sort_order: 0
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (category) {
      setFormData({
        name: category.name || '',
        description: category.description || '',
        parent: category.parent?.id || '',
        is_active: category.is_active ?? true,
        sort_order: category.sort_order || 0
      });
    }
  }, [category]);

  useEffect(() => {
    // Fetch categories for parent selection
    dispatch(fetchCategories({ is_active: true }));
  }, [dispatch]);

  const handleChange = (field) => (event) => {
    const value = event.target.type === 'checkbox' 
      ? event.target.checked 
      : event.target.value;
    
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: null
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Category name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Category name must be at least 2 characters';
    }

    if (formData.sort_order < 0) {
      newErrors.sort_order = 'Sort order must be a positive number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const submitData = {
        ...formData,
        parent: formData.parent || null,
        sort_order: parseInt(formData.sort_order) || 0
      };

      if (category) {
        await dispatch(updateCategory({
          id: category.id,
          categoryData: submitData
        })).unwrap();
      } else {
        await dispatch(createCategory(submitData)).unwrap();
      }

      onClose();
    } catch (error) {
      console.error('Form submission error:', error);
    }
  };

  const handleClose = () => {
    dispatch(clearError());
    onClose();
  };

  // Filter out current category from parent options
  const parentOptions = categories.filter(cat => 
    cat.id !== category?.id && cat.is_active
  );

  return (
    <Dialog 
      open={true} 
      onClose={handleClose}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>
        {category ? 'Edit Category' : 'Create New Category'}
      </DialogTitle>

      <form onSubmit={handleSubmit}>
        <DialogContent>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error.message || 'An error occurred'}
            </Alert>
          )}

          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Category Name"
                value={formData.name}
                onChange={handleChange('name')}
                error={!!errors.name}
                helperText={errors.name}
                required
                margin="normal"
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Sort Order"
                type="number"
                value={formData.sort_order}
                onChange={handleChange('sort_order')}
                error={!!errors.sort_order}
                helperText={errors.sort_order}
                margin="normal"
                inputProps={{ min: 0 }}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                value={formData.description}
                onChange={handleChange('description')}
                multiline
                rows={3}
                margin="normal"
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth margin="normal">
                <InputLabel>Parent Category</InputLabel>
                <Select
                  value={formData.parent}
                  onChange={handleChange('parent')}
                  label="Parent Category"
                >
                  <MenuItem value="">
                    <em>No Parent (Root Category)</em>
                  </MenuItem>
                  {parentOptions.map((cat) => (
                    <MenuItem key={cat.id} value={cat.id}>
                      {cat.full_path || cat.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <Box mt={2}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formData.is_active}
                      onChange={handleChange('is_active')}
                    />
                  }
                  label="Active"
                />
              </Box>
            </Grid>
          </Grid>

          {/* Form Preview */}
          <Box mt={3} p={2} bgcolor="grey.50" borderRadius={1}>
            <Typography variant="subtitle2" gutterBottom>
              Preview:
            </Typography>
            <Typography variant="body2">
              <strong>Name:</strong> {formData.name || 'Untitled Category'}
            </Typography>
            {formData.description && (
              <Typography variant="body2">
                <strong>Description:</strong> {formData.description}
              </Typography>
            )}
            {formData.parent && (
              <Typography variant="body2">
                <strong>Parent:</strong> {
                  parentOptions.find(cat => cat.id === formData.parent)?.name || 'Unknown'
                }
              </Typography>
            )}
            <Typography variant="body2">
              <strong>Status:</strong> {formData.is_active ? 'Active' : 'Inactive'}
            </Typography>
            <Typography variant="body2">
              <strong>Sort Order:</strong> {formData.sort_order}
            </Typography>
          </Box>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose} disabled={loading}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} /> : null}
          >
            {loading ? 'Saving...' : (category ? 'Update' : 'Create')}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default CategoryForm;





















































