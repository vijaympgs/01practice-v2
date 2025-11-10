import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  FormControlLabel,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Snackbar,
  IconButton,
} from '@mui/material';
import {
  Save as SaveIcon,
  Clear as ClearIcon,
  Close as CloseIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { securityService } from '../../services/securityService';

const RoleProgramMappingTab = () => {
  const [roles, setRoles] = useState([]);
  const [mappings, setMappings] = useState([]);
  const [selectedRole, setSelectedRole] = useState('');
  const [moduleName, setModuleName] = useState('POS');
  const [selectedPrograms, setSelectedPrograms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedMapping, setSelectedMapping] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    loadRoles();
    loadMappings();
  }, []);

  const loadRoles = async () => {
    try {
      const data = await securityService.getAllRoles();
      setRoles(data);
    } catch (error) {
      console.error('Failed to load roles:', error);
    }
  };

  const loadMappings = async () => {
    try {
      const data = await securityService.getAllRoleProgramMappings();
      setMappings(data);
    } catch (error) {
      console.error('Failed to load mappings:', error);
    }
  };

  const handleProgramToggle = (program) => {
    setSelectedPrograms(prev =>
      prev.includes(program)
        ? prev.filter(p => p !== program)
        : [...prev, program]
    );
  };

  const handleEdit = (mapping) => {
    setSelectedMapping(mapping);
    setSelectedRole(mapping.roleCode);
    setSelectedPrograms([...mapping.programs]);
    setEditMode(true);
  };

  const handleClear = () => {
    setSelectedRole('');
    setSelectedPrograms([]);
    setEditMode(false);
    setSelectedMapping(null);
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      
      if (!selectedRole) {
        throw new Error('Please select a role');
      }
      
      if (selectedPrograms.length === 0) {
        throw new Error('Please select at least one program');
      }

      if (editMode && selectedMapping) {
        await securityService.updateRoleProgramMapping(selectedMapping.id, {
          programs: selectedPrograms
        });
        setSnackbar({ open: true, message: 'Role program mapping updated successfully', severity: 'success' });
      } else {
        await securityService.createRoleProgramMapping({
          roleCode: selectedRole,
          moduleName: moduleName,
          programs: selectedPrograms
        });
        setSnackbar({ open: true, message: 'Role program mapping created successfully', severity: 'success' });
      }

      handleClear();
      loadMappings();
    } catch (error) {
      setSnackbar({ open: true, message: error.message || 'Failed to save mapping', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (mapping) => {
    if (window.confirm(`Are you sure you want to delete mapping for "${mapping.roleName}"?`)) {
      try {
        setLoading(true);
        await securityService.deleteRoleProgramMapping(mapping.id);
        setSnackbar({ open: true, message: 'Mapping deleted successfully', severity: 'success' });
        loadMappings();
      } catch (error) {
        setSnackbar({ open: true, message: 'Failed to delete mapping: ' + error.message, severity: 'error' });
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <Box>
      {/* Modern Form */}
      <Paper 
        sx={{ 
          p: 3, 
          mb: 3,
          borderRadius: 2,
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
          background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
        }}
      >
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Role Name</InputLabel>
              <Select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                label="Role Name"
              >
                {roles.map((role) => (
                  <MenuItem key={role.id} value={role.roleCode}>
                    {role.roleName} ({role.roleCode})
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Module Name</InputLabel>
              <Select
                value={moduleName}
                onChange={(e) => setModuleName(e.target.value)}
                label="Module Name"
              >
                <MenuItem value="POS">POS</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="subtitle2" gutterBottom>
              Select Programs (Check all that apply):
            </Typography>
            <Box sx={{ p: 2, bgcolor: 'grey.100', borderRadius: 1 }}>
              <Typography variant="body2" color="text.secondary">
                POS Programs feature has been removed. This functionality is no longer available.
              </Typography>
            </Box>
          </Grid>
        </Grid>

        <Box sx={{ mt: 3, display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
          <Button
            variant="contained"
            startIcon={<SaveIcon />}
            onClick={handleSave}
            disabled={loading || !selectedRole}
            sx={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
              borderRadius: 2,
              px: 3,
              py: 1.5,
            }}
          >
            Save Mapping
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
            }}
          >
            Close
          </Button>
        </Box>
      </Paper>

      {/* Modern Mappings Table */}
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
                <TableCell sx={{ fontWeight: 700, fontSize: '0.95rem', color: 'grey.700' }}>Role Name</TableCell>
                <TableCell sx={{ fontWeight: 700, fontSize: '0.95rem', color: 'grey.700' }}>Role Code</TableCell>
                <TableCell sx={{ fontWeight: 700, fontSize: '0.95rem', color: 'grey.700' }}>Module</TableCell>
                <TableCell sx={{ fontWeight: 700, fontSize: '0.95rem', color: 'grey.700' }}>Accessible Programs</TableCell>
                <TableCell sx={{ fontWeight: 700, fontSize: '0.95rem', color: 'grey.700', textAlign: 'center' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 8 }}>
                    <CircularProgress />
                  </TableCell>
                </TableRow>
              ) : mappings.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 8, color: 'grey.500' }}>
                    No mappings found. Create a new mapping above.
                  </TableCell>
                </TableRow>
              ) : (
                mappings.map((mapping, index) => (
                  <TableRow 
                    key={mapping.id} 
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
                    <TableCell sx={{ fontWeight: 500 }}>{mapping.roleName}</TableCell>
                    <TableCell sx={{ fontWeight: 500 }}>{mapping.roleCode}</TableCell>
                    <TableCell sx={{ fontWeight: 500 }}>{mapping.moduleName}</TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {mapping.programs.map((program, idx) => (
                          <Box
                            key={idx}
                            sx={{
                              px: 1.5,
                              py: 0.5,
                              borderRadius: 2,
                              backgroundColor: 'success.light',
                              color: 'success.dark',
                              fontSize: '0.75rem',
                              fontWeight: 500,
                            }}
                          >
                            {program}
                          </Box>
                        ))}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'center' }}>
                        <IconButton
                          size="small"
                          onClick={() => handleEdit(mapping)}
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
                          onClick={() => handleDelete(mapping)}
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

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        message={snackbar.message}
      />
    </Box>
  );
};

export default RoleProgramMappingTab;

