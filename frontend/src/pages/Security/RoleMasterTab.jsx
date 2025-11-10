import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  TextField,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Snackbar,
  CircularProgress,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  Clear as ClearIcon,
  Close as CloseIcon,
  Save as SaveIcon,
} from '@mui/icons-material';
import { securityService } from '../../services/securityService';

const RoleMasterTab = () => {
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  
  // Form state
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogMode, setDialogMode] = useState('new'); // 'new', 'edit', 'view'
  const [selectedRole, setSelectedRole] = useState(null);
  const [formData, setFormData] = useState({
    roleCode: '',
    roleName: '',
  });

  // Load roles
  useEffect(() => {
    loadRoles();
  }, []);

  const loadRoles = async () => {
    try {
      setLoading(true);
      const data = await securityService.getAllRoles();
      setRoles(data);
    } catch (error) {
      setError('Failed to load roles: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleNew = () => {
    setFormData({ roleCode: '', roleName: '' });
    setDialogMode('new');
    setSelectedRole(null);
    setOpenDialog(true);
  };

  const handleEdit = (role) => {
    setSelectedRole(role);
    setFormData({
      roleCode: role.roleCode,
      roleName: role.roleName,
    });
    setDialogMode('edit');
    setOpenDialog(true);
  };

  const handleView = (role) => {
    setSelectedRole(role);
    setFormData({
      roleCode: role.roleCode,
      roleName: role.roleName,
    });
    setDialogMode('view');
    setOpenDialog(true);
  };

  const handleDelete = async (role) => {
    if (window.confirm(`Are you sure you want to delete role "${role.roleName}"?`)) {
      try {
        setLoading(true);
        await securityService.deleteRole(role.id);
        setSuccess('Role deleted successfully');
        setSnackbar({ open: true, message: 'Role deleted successfully', severity: 'success' });
        loadRoles();
      } catch (error) {
        setError('Failed to delete role: ' + error.message);
        setSnackbar({ open: true, message: 'Failed to delete role: ' + error.message, severity: 'error' });
      } finally {
        setLoading(false);
      }
    }
  };

  const handleClear = () => {
    setFormData({ roleCode: '', roleName: '' });
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      setError(null);

      // Validation
      if (!formData.roleCode || !formData.roleName) {
        throw new Error('Please fill in all required fields');
      }

      if (dialogMode === 'new') {
        await securityService.createRole(formData);
        setSuccess('Role created successfully');
        setSnackbar({ open: true, message: 'Role created successfully', severity: 'success' });
      } else if (dialogMode === 'edit') {
        await securityService.updateRole(selectedRole.id, formData);
        setSuccess('Role updated successfully');
        setSnackbar({ open: true, message: 'Role updated successfully', severity: 'success' });
      }

      setOpenDialog(false);
      loadRoles();
    } catch (error) {
      setError('Failed to save role: ' + error.message);
      setSnackbar({ open: true, message: 'Failed to save role: ' + error.message, severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setOpenDialog(false);
    setFormData({ roleCode: '', roleName: '' });
    setSelectedRole(null);
  };

  return (
    <Box>
      {/* Modern Action Buttons */}
      <Paper 
        sx={{ 
          p: 3, 
          mb: 3,
          borderRadius: 2,
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
          background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
        }}
      >
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleNew}
            disabled={loading}
            sx={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
              '&:hover': {
                boxShadow: '0 6px 20px rgba(102, 126, 234, 0.6)',
              },
              borderRadius: 2,
              px: 3,
              py: 1.5,
            }}
          >
            New Role
          </Button>
          <Button
            variant="outlined"
            startIcon={<ClearIcon />}
            onClick={handleClear}
            disabled={loading}
            sx={{
              borderRadius: 2,
              px: 3,
              py: 1.5,
              borderColor: 'grey.300',
              '&:hover': {
                borderColor: 'grey.400',
                backgroundColor: 'grey.50',
              },
            }}
          >
            Clear
          </Button>
          <Button
            variant="outlined"
            startIcon={<CloseIcon />}
            disabled={loading}
            sx={{
              borderRadius: 2,
              px: 3,
              py: 1.5,
              borderColor: 'grey.300',
              '&:hover': {
                borderColor: 'grey.400',
                backgroundColor: 'grey.50',
              },
            }}
          >
            Close
          </Button>
        </Box>
      </Paper>

      {/* Modern Table */}
      <Paper
        sx={{
          borderRadius: 2,
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
          overflow: 'hidden',
        }}
      >
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: 'grey.50' }}>
                <TableCell sx={{ fontWeight: 700, fontSize: '0.95rem', color: 'grey.700' }}>
                  Role Code
                </TableCell>
                <TableCell sx={{ fontWeight: 700, fontSize: '0.95rem', color: 'grey.700' }}>
                  Role Name
                </TableCell>
                <TableCell sx={{ fontWeight: 700, fontSize: '0.95rem', color: 'grey.700', textAlign: 'center' }}>
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={3} align="center" sx={{ py: 8 }}>
                    <CircularProgress />
                  </TableCell>
                </TableRow>
              ) : roles.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} align="center" sx={{ py: 8, color: 'grey.500' }}>
                    No roles found
                  </TableCell>
                </TableRow>
              ) : (
                roles.map((role, index) => (
                  <TableRow 
                    key={role.id} 
                    hover
                    sx={{
                      backgroundColor: index % 2 === 0 ? 'white' : 'grey.50',
                      '&:hover': {
                        backgroundColor: 'action.hover',
                        transform: 'scale(1.01)',
                        transition: 'all 0.2s ease',
                      },
                    }}
                  >
                    <TableCell sx={{ fontWeight: 500 }}>{role.roleCode}</TableCell>
                    <TableCell sx={{ fontWeight: 500 }}>{role.roleName}</TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'center' }}>
                        <IconButton
                          size="small"
                          onClick={() => handleView(role)}
                          disabled={loading}
                          sx={{
                            color: 'primary.main',
                            '&:hover': {
                              backgroundColor: 'primary.light',
                            },
                          }}
                        >
                          <ViewIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => handleEdit(role)}
                          disabled={loading}
                          sx={{
                            color: 'success.main',
                            '&:hover': {
                              backgroundColor: 'success.light',
                            },
                          }}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => handleDelete(role)}
                          disabled={loading}
                          sx={{
                            color: 'error.main',
                            '&:hover': {
                              backgroundColor: 'error.light',
                            },
                          }}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Modern Dialog */}
      <Dialog 
        open={openDialog} 
        onClose={handleClose} 
        maxWidth="sm" 
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
          }
        }}
      >
        <DialogTitle
          sx={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            py: 2,
            px: 3,
            fontWeight: 600,
          }}
        >
          {dialogMode === 'new' && 'Create New Role'}
          {dialogMode === 'edit' && 'Edit Role'}
          {dialogMode === 'view' && 'View Role'}
        </DialogTitle>
        <DialogContent sx={{ py: 3, px: 3 }}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Role Code"
                value={formData.roleCode}
                onChange={(e) => setFormData({ ...formData, roleCode: e.target.value })}
                disabled={dialogMode === 'view'}
                required
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                  },
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Role Name"
                value={formData.roleName}
                onChange={(e) => setFormData({ ...formData, roleName: e.target.value })}
                disabled={dialogMode === 'view'}
                required
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                  },
                }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button 
            onClick={handleClose} 
            disabled={loading}
            sx={{
              borderRadius: 2,
              px: 3,
            }}
          >
            Close
          </Button>
          {dialogMode !== 'view' && (
            <Button
              variant="contained"
              startIcon={loading ? <CircularProgress size={20} /> : <SaveIcon />}
              onClick={handleSave}
              disabled={loading}
              sx={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                borderRadius: 2,
                px: 3,
                '&:hover': {
                  boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
                },
              }}
            >
              Save
            </Button>
          )}
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        message={snackbar.message}
      />
    </Box>
  );
};

export default RoleMasterTab;

