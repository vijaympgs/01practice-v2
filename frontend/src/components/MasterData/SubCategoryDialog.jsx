import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Typography,
  Alert,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import api from '../../services/api';

const SubCategoryDialog = ({ open, onClose, onSuccess, themeColor }) => {
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    description: '',
    category: '',
    sort_order: 1,
  });
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [categoriesLoading, setCategoriesLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (open) {
      loadCategories();
    }
  }, [open]);

  const loadCategories = async () => {
    setCategoriesLoading(true);
    try {
      const response = await api.get('/categories/itemcategories/?is_active=true');
      setCategories(response.data.results || response.data || []);
    } catch (error) {
      console.error('Error loading categories:', error);
      setError('Failed to load categories');
    } finally {
      setCategoriesLoading(false);
    }
  };

  const handleInputChange = (field) => (event) => {
    setFormData(prev => ({
      ...prev,
      [field]: event.target.value
    }));
    setError(''); // Clear error when user types
  };

  const handleSubmit = async () => {
    // Validation
    if (!formData.name.trim()) {
      setError('Sub-category name is required');
      return;
    }

    if (!formData.code.trim()) {
      setError('Sub-category code is required');
      return;
    }

    if (!formData.category) {
      setError('Please select a category');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await api.post('/categories/itemsubcategories/', {
        ...formData,
        is_active: true,
      });

      if (response.data) {
        onSuccess(response.data.subcategory || response.data);
        handleClose();
      }
    } catch (error) {
      console.error('Error creating subcategory:', error);
      const errorMessage = error.response?.data?.detail || 
                         error.response?.data?.message || 
                         'Failed to create subcategory. Please try again.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      name: '',
      code: '',
      description: '',
      category: '',
      sort_order: 1,
    });
    setError('');
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ 
        backgroundColor: themeColor, 
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        gap: 1
      }}>
        <AddIcon />
        Add New Sub-Category
      </DialogTitle>
      
      <DialogContent sx={{ p: 3 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <FormControl fullWidth required disabled={loading}>
            <InputLabel sx={{ color: themeColor }}>Category</InputLabel>
            <Select
              value={formData.category}
              onChange={handleInputChange('category')}
              label="Category"
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 0 } }}
            >
              {categories.map((category) => (
                <MenuItem key={category.id} value={category.id}>
                  {category.name} ({category.code})
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            label="Sub-Category Name"
            value={formData.name}
            onChange={handleInputChange('name')}
            fullWidth
            required
            disabled={loading}
            InputLabelProps={{ sx: { color: themeColor } }}
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 0 } }}
          />

          <TextField
            label="Sub-Category Code"
            value={formData.code}
            onChange={handleInputChange('code')}
            fullWidth
            required
            disabled={loading}
            placeholder="e.g., MOB, TV, KITCHEN"
            InputLabelProps={{ sx: { color: themeColor } }}
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 0 } }}
          />

          <TextField
            label="Description"
            value={formData.description}
            onChange={handleInputChange('description')}
            fullWidth
            multiline
            rows={3}
            disabled={loading}
            placeholder="Brief description of the sub-category..."
            InputLabelProps={{ sx: { color: themeColor } }}
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 0 } }}
          />

          <TextField
            label="Sort Order"
            type="number"
            value={formData.sort_order}
            onChange={handleInputChange('sort_order')}
            fullWidth
            disabled={loading}
            InputLabelProps={{ sx: { color: themeColor } }}
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 0 } }}
          />
        </Box>

        <Typography variant="caption" color="text.secondary" sx={{ mt: 2 }}>
          Note: This sub-category will be available for item classification under the selected category.
        </Typography>
      </DialogContent>

      <DialogActions sx={{ p: 3, backgroundColor: 'grey.50' }}>
        <Button
          onClick={handleClose}
          variant="outlined"
          disabled={loading}
          sx={{ 
            borderColor: themeColor,
            color: themeColor,
            '&:hover': {
              borderColor: themeColor,
              backgroundColor: `${themeColor}20`
            }
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={loading || categoriesLoading}
          startIcon={loading ? <CircularProgress size={20} /> : <AddIcon />}
          sx={{ 
            backgroundColor: themeColor,
            '&:hover': {
              backgroundColor: `${themeColor}dd`
            }
          }}
        >
          {loading ? 'Creating...' : 'Create Sub-Category'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SubCategoryDialog;
