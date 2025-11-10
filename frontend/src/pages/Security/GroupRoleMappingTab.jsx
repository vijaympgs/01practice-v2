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
  Checkbox,
  FormControlLabel,
  Snackbar,
  CircularProgress,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  Save as SaveIcon,
  Clear as ClearIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import { securityService } from '../../services/securityService';

const GroupRoleMappingTab = () => {
  const [groups, setGroups] = useState([]);
  const [roles, setRoles] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogMode, setDialogMode] = useState('new');
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    groupCode: '',
    groupName: '',
  });
  const [selectedRoles, setSelectedRoles] = useState([]);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    loadGroups();
    loadRoles();
  }, []);

  const loadGroups = async () => {
    try {
      const data = await securityService.getAllGroups();
      setGroups(data);
    } catch (error) {
      console.error('Failed to load groups:', error);
    }
  };

  const loadRoles = async () => {
    try {
      const data = await securityService.getAllRoles();
      setRoles(data);
    } catch (error) {
      console.error('Failed to load roles:', error);
    }
  };

  const handleNew = () => {
    setFormData({ groupCode: '', groupName: '' });
    setSelectedRoles([]);
    setDialogMode('new');
    setSelectedGroup(null);
    setOpenDialog(true);
  };

  const handleEdit = (group) => {
    setSelectedGroup(group);
    setFormData({
      groupCode: group.groupCode,
      groupName: group.groupName,
    });
    setSelectedRoles(group.roles || []);
    setDialogMode('edit');
    setOpenDialog(true);
  };

  const handleView = (group) => {
    setSelectedGroup(group);
    setFormData({
      groupCode: group.groupCode,
      groupName: group.groupName,
    });
    setSelectedRoles(group.roles || []);
    setDialogMode('view');
    setOpenDialog(true);
  };

  const handleDelete = async (group) => {
    if (window.confirm(`Are you sure you want to delete group "${group.groupName}"?`)) {
      try {
        setLoading(true);
        await securityService.deleteGroup(group.id);
        setSnackbar({ open: true, message: 'Group deleted successfully', severity: 'success' });
        loadGroups();
      } catch (error) {
        setSnackbar({ open: true, message: 'Failed to delete group: ' + error.message, severity: 'error' });
      } finally {
        setLoading(false);
      }
    }
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      
      if (!formData.groupCode || !formData.groupName) {
        throw new Error('Please fill in all required fields');
      }

      if (dialogMode === 'new') {
        await securityService.createGroup({
          groupCode: formData.groupCode,
          groupName: formData.groupName,
          roles: selectedRoles
        });
        setSnackbar({ open: true, message: 'Group created successfully', severity: 'success' });
      } else if (dialogMode === 'edit') {
        await securityService.updateGroup(selectedGroup.id, {
          groupCode: formData.groupCode,
          groupName: formData.groupName,
          roles: selectedRoles
        });
        setSnackbar({ open: true, message: 'Group updated successfully', severity: 'success' });
      }

      setOpenDialog(false);
      loadGroups();
    } catch (error) {
      setSnackbar({ open: true, message: error.message || 'Failed to save group', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setFormData({ groupCode: '', groupName: '' });
    setSelectedRoles([]);
  };

  return (
    <Box>
      <Paper sx={{ p: 2, mb: 2 }}>
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
          <Button variant="contained" startIcon={<AddIcon />} onClick={handleNew} disabled={loading}>
            New
          </Button>
          <Button variant="outlined" startIcon={<ClearIcon />} onClick={handleClear} disabled={loading}>
            Clear
          </Button>
          <Button variant="outlined" startIcon={<CloseIcon />} disabled={loading}>
            Close
          </Button>
        </Box>
      </Paper>

      <Paper>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold' }}>Group Code</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Group Name</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Mapped Roles</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={4} align="center">
                    <CircularProgress />
                  </TableCell>
                </TableRow>
              ) : groups.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} align="center">
                    No groups found. Create a new group.
                  </TableCell>
                </TableRow>
              ) : (
                groups.map((group) => (
                  <TableRow key={group.id} hover>
                    <TableCell>{group.groupCode}</TableCell>
                    <TableCell>{group.groupName}</TableCell>
                    <TableCell>
                      {group.roles && group.roles.length > 0 
                        ? group.roles.map(roleId => {
                            const role = roles.find(r => r.id === roleId);
                            return role ? role.roleName : '';
                          }).filter(Boolean).join(', ')
                        : 'No roles mapped'}
                    </TableCell>
                    <TableCell>
                      <IconButton
                        size="small"
                        color="primary"
                        onClick={() => handleView(group)}
                        disabled={loading}
                      >
                        <ViewIcon />
                      </IconButton>
                      <IconButton
                        size="small"
                        color="primary"
                        onClick={() => handleEdit(group)}
                        disabled={loading}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => handleDelete(group)}
                        disabled={loading}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          {dialogMode === 'new' ? 'Create New Group' : 'Edit Group'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Group Code"
                  value={formData.groupCode}
                  onChange={(e) => setFormData({ ...formData, groupCode: e.target.value })}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Group Name"
                  value={formData.groupName}
                  onChange={(e) => setFormData({ ...formData, groupName: e.target.value })}
                  required
                />
              </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle2" gutterBottom>
                Select Roles:
              </Typography>
              {roles.map((role) => (
                <FormControlLabel
                  key={role.id}
                  control={
                    <Checkbox
                      checked={selectedRoles.includes(role.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedRoles([...selectedRoles, role.id]);
                        } else {
                          setSelectedRoles(selectedRoles.filter(id => id !== role.id));
                        }
                      }}
                      disabled={dialogMode === 'view'}
                    />
                  }
                  label={`${role.roleName} (${role.roleCode})`}
                />
              ))}
            </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} disabled={loading}>
            Close
          </Button>
          {dialogMode !== 'view' && (
            <Button
              variant="contained"
              startIcon={loading ? <CircularProgress size={20} /> : <SaveIcon />}
              onClick={handleSave}
              disabled={loading}
            >
              Save
            </Button>
          )}
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        message={snackbar.message}
      />
    </Box>
  );
};

export default GroupRoleMappingTab;

