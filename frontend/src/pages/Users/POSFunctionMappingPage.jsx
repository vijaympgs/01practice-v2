import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Switch,
  Checkbox,
  FormControlLabel,
  Button,
  Chip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  CircularProgress,
  Alert,
  Snackbar,
  Tooltip,
  IconButton,
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  Save as SaveIcon,
  Refresh as RefreshIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
} from '@mui/icons-material';
import { useSelector } from 'react-redux';
import PageTitle from '../../components/common/PageTitle';
import posFunctionService from '../../services/posFunctionService';

const POSFunctionMappingPage = () => {
  const { user } = useSelector((state) => state.auth);
  const [selectedRole, setSelectedRole] = useState('posuser');
  const [functions, setFunctions] = useState([]);
  const [mappings, setMappings] = useState({});
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  
  // Check if user is admin
  const isAdmin = user?.is_superuser || user?.is_staff || user?.role === 'admin';

  const categories = [
    { code: 'BASIC', name: 'Basic Operations' },
    { code: 'DISCOUNT', name: 'Discount Operations' },
    { code: 'PAYMENT', name: 'Payment Operations' },
    { code: 'TRANSACTION', name: 'Transaction Management' },
    { code: 'ADMIN', name: 'Administrative' },
  ];

  // Load functions and mappings
  useEffect(() => {
    loadData();
  }, [selectedRole]);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Load all functions
      const functionsData = await posFunctionService.getFunctions();
      const functionsList = functionsData.results || functionsData;
      setFunctions(functionsList);

      // Load role mappings
      const mappingsData = await posFunctionService.getRoleMappings(selectedRole);
      const mappingsList = mappingsData.results || mappingsData;
      
      // Convert to object for easy lookup
      const mappingsObj = {};
      mappingsList.forEach(mapping => {
        mappingsObj[mapping.function_code || mapping.function?.function_code] = {
          id: mapping.id,
          is_allowed: mapping.is_allowed,
          requires_approval: mapping.requires_approval
        };
      });
      
      setMappings(mappingsObj);
    } catch (error) {
      console.error('Error loading POS functions:', error);
      console.error('Error details:', {
        message: error.message,
        code: error.code,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        url: error.config?.url || error.request?.responseURL,
      });
      
      let errorMessage = 'Failed to load POS functions. ';
      
      if (error.response?.status === 404) {
        errorMessage += 'API endpoint not found. ';
        errorMessage += 'Please ensure: 1) Backend migrations are run (python manage.py migrate users), 2) POS functions are initialized (python manage.py init_pos_functions), 3) Backend server is running.';
      } else if (error.response?.status === 403) {
        errorMessage += 'Access denied. ';
        if (!isAdmin) {
          errorMessage += `You are logged in as "${user?.role || 'unknown'}" but this page requires admin access. Please log in as an admin user (admin/admin).`;
        } else {
          errorMessage += 'Your admin privileges may have expired. Please log out and log in again.';
        }
      } else if (error.response?.status === 401) {
        errorMessage += 'Authentication required. Please log in again.';
      } else if (error.response?.status === 500) {
        errorMessage += 'Server error. ';
        const serverError = error.response?.data;
        if (serverError?.detail) {
          errorMessage += serverError.detail;
        } else if (serverError?.error) {
          errorMessage += serverError.error;
        } else {
          errorMessage += 'Check backend logs for details.';
        }
      } else if (error.code === 'ERR_NETWORK' || error.code === 'ECONNREFUSED') {
        errorMessage += 'Cannot connect to backend server. Please ensure the backend is running on http://localhost:8000.';
      } else {
        errorMessage += error.response?.data?.detail || 
                        error.response?.data?.message || 
                        error.message || 
                        'Unknown error occurred.';
      }
      
      setSnackbar({
        open: true,
        message: errorMessage,
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleToggleFunction = (functionCode, allowed) => {
    setMappings(prev => ({
      ...prev,
      [functionCode]: {
        ...prev[functionCode],
        is_allowed: allowed,
        requires_approval: allowed ? (prev[functionCode]?.requires_approval || false) : false
      }
    }));
  };

  const handleToggleApproval = (functionCode, requiresApproval) => {
    setMappings(prev => ({
      ...prev,
      [functionCode]: {
        ...prev[functionCode],
        requires_approval: requiresApproval
      }
    }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);

      // Prepare mappings for bulk update
      const mappingsToSave = functions.map(func => ({
        function_id: func.id,
        function_code: func.function_code,
        is_allowed: mappings[func.function_code]?.is_allowed || false,
        requires_approval: mappings[func.function_code]?.requires_approval || false
      }));

      await posFunctionService.bulkUpdateRoleMappings(selectedRole, mappingsToSave);

      setSnackbar({
        open: true,
        message: `POS function mappings saved successfully for ${selectedRole === 'posmanager' ? 'POS Manager' : 'POS User'}`,
        severity: 'success'
      });

      // Reload data
      await loadData();
    } catch (error) {
      console.error('Error saving mappings:', error);
      setSnackbar({
        open: true,
        message: error.response?.data?.detail || 'Failed to save mappings',
        severity: 'error'
      });
    } finally {
      setSaving(false);
    }
  };

  const getCategoryFunctions = (categoryCode) => {
    return functions.filter(f => f.category === categoryCode);
  };

  const getTotalAllowed = () => {
    return Object.values(mappings).filter(m => m?.is_allowed).length;
  };

  // Show access denied message if not admin
  if (!isAdmin) {
    return (
      <Box sx={{ p: 3 }}>
        <PageTitle 
          title="POS Function Role Mapping" 
          subtitle="Configure which POS functions are available for each role"
        />
        <Alert severity="error" sx={{ mt: 2 }}>
          <Typography variant="h6" gutterBottom>
            Access Denied
          </Typography>
          <Typography variant="body2">
            This page requires administrator privileges. You are currently logged in as "{user?.role || 'unknown'}".
          </Typography>
          <Typography variant="body2" sx={{ mt: 1 }}>
            Please log in as an admin user to access POS function mappings.
          </Typography>
        </Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <PageTitle 
        title="POS Function Role Mapping" 
        subtitle="Configure which POS functions are available for each role"
      />

      {/* Role Selector */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel>Select Role</InputLabel>
            <Select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              label="Select Role"
            >
              <MenuItem value="posmanager">POS Manager</MenuItem>
              <MenuItem value="posuser">POS User</MenuItem>
            </Select>
          </FormControl>

          <Chip 
            label={`${getTotalAllowed()} functions allowed`}
            color="primary"
            variant="outlined"
          />

          <Box sx={{ flexGrow: 1 }} />

          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={loadData}
            disabled={loading}
          >
            Refresh
          </Button>

          <Button
            variant="contained"
            startIcon={<SaveIcon />}
            onClick={handleSave}
            disabled={saving || loading}
          >
            Save Mappings
          </Button>
        </Box>
      </Paper>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          {/* Function Categories */}
          {categories.map((category) => {
            const categoryFunctions = getCategoryFunctions(category.code);
            
            if (categoryFunctions.length === 0) {
              return null;
            }

            return (
              <Accordion key={category.code} defaultExpanded>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
                    <Typography variant="h6">{category.name}</Typography>
                    <Chip 
                      label={`${categoryFunctions.length} functions`}
                      size="small"
                      variant="outlined"
                    />
                    <Box sx={{ flexGrow: 1 }} />
                    <Typography variant="body2" color="text.secondary">
                      {categoryFunctions.filter(f => mappings[f.function_code]?.is_allowed).length} allowed
                    </Typography>
                  </Box>
                </AccordionSummary>
                <AccordionDetails>
                  <TableContainer>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>Function</TableCell>
                          <TableCell>Shortcut</TableCell>
                          <TableCell>Description</TableCell>
                          <TableCell align="center">Allowed</TableCell>
                          <TableCell align="center">Requires Approval</TableCell>
                          <TableCell align="center">Critical</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {categoryFunctions.map((func) => {
                          const mapping = mappings[func.function_code] || {};
                          const isAllowed = mapping.is_allowed || false;
                          const requiresApproval = mapping.requires_approval || false;

                          return (
                            <TableRow key={func.function_code}>
                              <TableCell>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                  <Typography variant="body2" fontWeight="medium">
                                    {func.function_name}
                                  </Typography>
                                  <Chip 
                                    label={func.function_code}
                                    size="small"
                                    color="primary"
                                    variant="outlined"
                                  />
                                </Box>
                              </TableCell>
                              <TableCell>
                                <Chip 
                                  label={func.keyboard_shortcut}
                                  size="small"
                                  sx={{ fontFamily: 'monospace' }}
                                />
                              </TableCell>
                              <TableCell>
                                <Typography variant="body2" color="text.secondary">
                                  {func.description || '-'}
                                </Typography>
                              </TableCell>
                              <TableCell align="center">
                                <Switch
                                  checked={isAllowed}
                                  onChange={(e) => handleToggleFunction(func.function_code, e.target.checked)}
                                  color="primary"
                                />
                              </TableCell>
                              <TableCell align="center">
                                <Checkbox
                                  checked={requiresApproval}
                                  onChange={(e) => handleToggleApproval(func.function_code, e.target.checked)}
                                  disabled={!isAllowed}
                                  color="warning"
                                />
                              </TableCell>
                              <TableCell align="center">
                                {func.is_critical ? (
                                  <Chip 
                                    label="Critical" 
                                    size="small" 
                                    color="error"
                                    icon={<CheckCircleIcon />}
                                  />
                                ) : (
                                  <Typography variant="body2" color="text.secondary">-</Typography>
                                )}
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </AccordionDetails>
              </Accordion>
            );
          })}

          {/* Summary */}
          <Paper sx={{ p: 2, mt: 3, backgroundColor: 'info.light' }}>
            <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
              Summary for {selectedRole === 'posmanager' ? 'POS Manager' : 'POS User'}
            </Typography>
            <Typography variant="body2">
              • Total Functions: {functions.length}
              {' • '}
              Allowed: {getTotalAllowed()}
              {' • '}
              Blocked: {functions.length - getTotalAllowed()}
              {' • '}
              Requiring Approval: {Object.values(mappings).filter(m => m?.requires_approval).length}
            </Typography>
          </Paper>
        </>
      )}

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setSnackbar({ ...snackbar, open: false })} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default POSFunctionMappingPage;

