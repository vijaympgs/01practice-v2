import React, { useState } from 'react';
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
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import api from '../../services/api';

const CategoryDialog = ({ open, onClose, onSuccess, themeColor }) => {
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    description: '',
    sort_order: 1,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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
      setError('Category name is required');
      return;
    }

    if (!formData.code.trim()) {
      setError('Category code is required');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await api.post('/categories/itemcategories/', {
        ...formData,
        is_active: true,
      });

      if (response.data) {
        onSuccess(response.data.category || response.data);
        handleClose();
      }
    } catch (error) {
      console.error('Error creating category:', error);
      const errorMessage = error.response?.data?.detail || 
                         error.response?.data?.message || 
                         'Failed to create category. Please try again.';
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
        Add New Category
      </DialogTitle>
      
      <DialogContent sx={{ p: 3 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            label="Category Name"
            value={formData.name}
            onChange={handleInputChange('name')}
            fullWidth
            required
            disabled={loading}
            InputLabelProps={{ sx: { color: themeColor } }}
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 0 } }}
          />

          <TextField
            label="Category Code"
            value={formData.code}
            onChange={handleInputChange('code')}
            fullWidth
            required
            disabled={loading}
            placeholder="e.g., ELEC, APP, HOME"
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
            placeholder="Brief description of the category..."
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
          Note: This category will be available for item classification in the Item Master.
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
          disabled={loading}
          startIcon={loading ? <CircularProgress size={20} /> : <AddIcon />}
          sx={{ 
            backgroundColor: themeColor,
            '&:hover': {
              backgroundColor: `${themeColor}dd`
            }
          }}
        >
          {loading ? 'Creating...' : 'Create Category'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CategoryDialog;
