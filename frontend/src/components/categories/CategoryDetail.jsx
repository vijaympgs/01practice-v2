import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Chip,
  Divider,
  Grid,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemIcon
} from '@mui/material';
import {
  Category as CategoryIcon,
  Description as DescriptionIcon,
  Sort as SortIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  Timeline as TimelineIcon,
  Inventory as InventoryIcon,
  ChildCare as ChildCareIcon
} from '@mui/icons-material';

const CategoryDetail = ({ category, onClose }) => {
  if (!category) return null;

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (isActive) => {
    return isActive ? 'success' : 'default';
  };

  const getStatusIcon = (isActive) => {
    return isActive ? <VisibilityIcon /> : <VisibilityOffIcon />;
  };

  return (
    <Dialog 
      open={true} 
      onClose={onClose}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>
        <Box display="flex" alignItems="center" gap={2}>
          <CategoryIcon color="primary" />
          <Typography variant="h6">
            {category.name}
          </Typography>
          <Chip
            label={category.is_active ? 'Active' : 'Inactive'}
            color={getStatusColor(category.is_active)}
            icon={getStatusIcon(category.is_active)}
            size="small"
          />
        </Box>
      </DialogTitle>

      <DialogContent>
        <Grid container spacing={3}>
          {/* Basic Information */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Basic Information
              </Typography>
              
              <List dense>
                <ListItem>
                  <ListItemIcon>
                    <CategoryIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary="Name"
                    secondary={category.name}
                  />
                </ListItem>

                {category.description && (
                  <ListItem>
                    <ListItemIcon>
                      <DescriptionIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary="Description"
                      secondary={category.description}
                    />
                  </ListItem>
                )}

                <ListItem>
                  <ListItemIcon>
                    <SortIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary="Sort Order"
                    secondary={category.sort_order}
                  />
                </ListItem>

                {category.parent && (
                  <ListItem>
                    <ListItemIcon>
                      <TimelineIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary="Parent Category"
                      secondary={category.parent.name}
                    />
                  </ListItem>
                )}
              </List>
            </Paper>
          </Grid>

          {/* Statistics */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Statistics
              </Typography>
              
              <List dense>
                <ListItem>
                  <ListItemIcon>
                    <TimelineIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary="Hierarchy Level"
                    secondary={category.level || 0}
                  />
                </ListItem>

                <ListItem>
                  <ListItemIcon>
                    <ChildCareIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary="Child Categories"
                    secondary={category.children_count || 0}
                  />
                </ListItem>

                <ListItem>
                  <ListItemIcon>
                    <InventoryIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary="Products"
                    secondary={category.products_count || 0}
                  />
                </ListItem>

                <ListItem>
                  <ListItemIcon>
                    <VisibilityIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary="Can be Deleted"
                    secondary={category.can_be_deleted ? 'Yes' : 'No'}
                  />
                </ListItem>
              </List>
            </Paper>
          </Grid>

          {/* Full Path */}
          {category.full_path && (
            <Grid item xs={12}>
              <Paper sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom>
                  Category Path
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {category.full_path}
                </Typography>
              </Paper>
            </Grid>
          )}

          {/* Timestamps */}
          <Grid item xs={12}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Timestamps
              </Typography>
              
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Typography variant="body2" color="text.secondary">
                    <strong>Created:</strong> {formatDate(category.created_at)}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="body2" color="text.secondary">
                    <strong>Last Updated:</strong> {formatDate(category.updated_at)}
                  </Typography>
                </Grid>
              </Grid>
            </Paper>
          </Grid>

          {/* Additional Information */}
          <Grid item xs={12}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Additional Information
              </Typography>
              
              <Box>
                <Typography variant="body2" color="text.secondary" paragraph>
                  <strong>Category ID:</strong> {category.id}
                </Typography>
                
                {category.parent && (
                  <Typography variant="body2" color="text.secondary" paragraph>
                    <strong>Parent ID:</strong> {category.parent.id}
                  </Typography>
                )}
                
                <Typography variant="body2" color="text.secondary">
                  <strong>Status:</strong> {category.is_active ? 'Active' : 'Inactive'}
                </Typography>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} variant="contained">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CategoryDetail;





















































