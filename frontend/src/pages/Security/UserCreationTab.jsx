import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  TextField,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  FormControlLabel,
  Tab,
  Tabs,
  Snackbar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  CircularProgress,
} from '@mui/material';
import {
  Save as SaveIcon,
  Clear as ClearIcon,
  Close as CloseIcon,
  Visibility as ViewIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { securityService } from '../../services/securityService';

const UserCreationTab = () => {
  const [activeSubTab, setActiveSubTab] = useState(0);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  
  const loadUsers = async () => {
    try {
      const data = await securityService.getAllUsers();
      setUsers(data);
    } catch (error) {
      console.error('Failed to load users:', error);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  // User Details form state
  const [userDetails, setUserDetails] = useState({
    userCode: '',
    userName: '',
    loginName: '',
    password: '',
    confirmPassword: '',
    expiryDays: 30,
    userLevel: '',
    authenticationPassword: '',
    userGroup: '',
    designation: '',
    phoneNumber: '',
    email: '',
    userLocationMapping: [],
  });

  // Form Access state
  const [formAccess, setFormAccess] = useState({
    security: false,
    posSetup: false,
    pos: false,
  });

  // Activity Mapping state
  const [activities, setActivities] = useState({
    priceChange: false,
    refund: false,
    reprint: false,
  });

  useEffect(() => {
    loadRoles();
  }, []);

  const handleSave = async () => {
    try {
      setLoading(true);
      
      // Validation
      if (!userDetails.userName || !userDetails.loginName || !userDetails.password) {
        throw new Error('Please fill in all required fields');
      }
      
      if (userDetails.password !== userDetails.confirmPassword) {
        throw new Error('Passwords do not match');
      }
      
      if (!userDetails.userLevel || !userDetails.authenticationPassword) {
        throw new Error('Please fill in user level and authentication password');
      }

      const userData = {
        userName: userDetails.userName,
        loginName: userDetails.loginName,
        password: userDetails.password,
        expiryDays: userDetails.expiryDays || 30,
        userLevel: userDetails.userLevel,
        authenticationPassword: userDetails.authenticationPassword,
        userGroup: userDetails.userGroup,
        designation: userDetails.designation,
        phoneNumber: userDetails.phoneNumber,
        email: userDetails.email,
        locations: userDetails.userLocationMapping,
        formAccess: formAccess,
        activities: activities,
      };

      await securityService.createUser(userData);
      setSnackbar({ open: true, message: 'User created successfully', severity: 'success' });
      
      // Clear form
      handleClear();
      loadUsers();
    } catch (error) {
      setSnackbar({ open: true, message: error.message || 'Failed to create user', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setUserDetails({
      userCode: '',
      userName: '',
      loginName: '',
      password: '',
      confirmPassword: '',
      expiryDays: 30,
      userLevel: '',
      authenticationPassword: '',
      userGroup: '',
      designation: '',
      phoneNumber: '',
      email: '',
      userLocationMapping: [],
    });
    setFormAccess({ security: false, posSetup: false, pos: false });
    setActivities({ priceChange: false, refund: false, reprint: false });
  };

  const handleView = (user) => {
    // For now, just show user details in a dialog
    alert(`User Details:\n\nCode: ${user.userCode}\nName: ${user.userName}\nLogin: ${user.loginName}\nEmail: ${user.email}`);
  };

  const handleEdit = (user) => {
    // Load user data into form
    setUserDetails({
      userCode: user.userCode,
      userName: user.userName,
      loginName: user.loginName,
      password: '', // Don't show password
      confirmPassword: '',
      expiryDays: user.expiryDays || 30,
      userLevel: user.userLevel,
      authenticationPassword: '',
      userGroup: user.userGroup,
      designation: user.designation,
      phoneNumber: user.phoneNumber || '',
      email: user.email || '',
      userLocationMapping: user.locations || [],
    });
    setFormAccess(user.formAccess || { security: false, posSetup: false, pos: false });
    setActivities(user.activities || { priceChange: false, refund: false, reprint: false });
  };

  const handleDelete = async (user) => {
    if (window.confirm(`Are you sure you want to delete user "${user.userName}"?`)) {
      try {
        setLoading(true);
        await securityService.deleteUser(user.id);
        setSnackbar({ open: true, message: 'User deleted successfully', severity: 'success' });
        loadUsers();
      } catch (error) {
        setSnackbar({ open: true, message: 'Failed to delete user: ' + error.message, severity: 'error' });
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <Box>
      {/* Sub Tabs */}
      <Paper sx={{ mb: 2 }}>
        <Tabs value={activeSubTab} onChange={(e, newValue) => setActiveSubTab(newValue)}>
          <Tab label="User Details" />
          <Tab label="Form Access & Activity Mapping" />
        </Tabs>
      </Paper>

      {/* Tab 0: User Details */}
      {activeSubTab === 0 && (
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            User Details
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="User Code"
                value={userDetails.userCode}
                disabled
                helperText="Auto-generated"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="User Name"
                value={userDetails.userName}
                onChange={(e) => setUserDetails({ ...userDetails, userName: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Login Name"
                value={userDetails.loginName}
                onChange={(e) => setUserDetails({ ...userDetails, loginName: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Password"
                type="password"
                value={userDetails.password}
                onChange={(e) => setUserDetails({ ...userDetails, password: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Confirm Password"
                type="password"
                value={userDetails.confirmPassword}
                onChange={(e) => setUserDetails({ ...userDetails, confirmPassword: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Expiry Days"
                type="number"
                value={userDetails.expiryDays}
                onChange={(e) => setUserDetails({ ...userDetails, expiryDays: parseInt(e.target.value) })}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>User Level (1-5)</InputLabel>
                <Select
                  value={userDetails.userLevel}
                  onChange={(e) => setUserDetails({ ...userDetails, userLevel: e.target.value })}
                  label="User Level (1-5)"
                >
                  <MenuItem value="1">Level 1</MenuItem>
                  <MenuItem value="2">Level 2</MenuItem>
                  <MenuItem value="3">Level 3</MenuItem>
                  <MenuItem value="4">Level 4</MenuItem>
                  <MenuItem value="5">Level 5</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Authentication Password"
                type="password"
                value={userDetails.authenticationPassword}
                onChange={(e) => setUserDetails({ ...userDetails, authenticationPassword: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>User Group</InputLabel>
                <Select
                  value={userDetails.userGroup}
                  onChange={(e) => setUserDetails({ ...userDetails, userGroup: e.target.value })}
                  label="User Group"
                >
                  <MenuItem value="billing">Billing</MenuItem>
                  <MenuItem value="manager">Manager</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Designation</InputLabel>
                <Select
                  value={userDetails.designation}
                  onChange={(e) => setUserDetails({ ...userDetails, designation: e.target.value })}
                  label="Designation"
                >
                  <MenuItem value="mngr">Manager</MenuItem>
                  <MenuItem value="tl">Team Lead</MenuItem>
                  <MenuItem value="cashier">Cashier</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Phone Number"
                value={userDetails.phoneNumber}
                onChange={(e) => setUserDetails({ ...userDetails, phoneNumber: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={userDetails.email}
                onChange={(e) => setUserDetails({ ...userDetails, email: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>User Location Mapping</InputLabel>
                <Select
                  multiple
                  value={userDetails.userLocationMapping}
                  onChange={(e) => setUserDetails({ ...userDetails, userLocationMapping: e.target.value })}
                  label="User Location Mapping"
                >
                  <MenuItem value="loc1">Location 1</MenuItem>
                  <MenuItem value="loc2">Location 2</MenuItem>
                  <MenuItem value="loc3">Location 3</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Paper>
      )}

      {/* Tab 1: Form Access & Activity Mapping */}
      {activeSubTab === 1 && (
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Form Access & Activity Mapping
          </Typography>
          
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle1" gutterBottom>
                Form Wise Access:
              </Typography>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formAccess.security}
                    onChange={(e) => setFormAccess({ ...formAccess, security: e.target.checked })}
                  />
                }
                label="Security"
              />
              <br />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formAccess.posSetup}
                    onChange={(e) => setFormAccess({ ...formAccess, posSetup: e.target.checked })}
                  />
                }
                label="POS Setup"
              />
              <br />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formAccess.pos}
                    onChange={(e) => setFormAccess({ ...formAccess, pos: e.target.checked })}
                  />
                }
                label="POS"
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography variant="subtitle1" gutterBottom>
                Activity Mapping:
              </Typography>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={activities.priceChange}
                    onChange={(e) => setActivities({ ...activities, priceChange: e.target.checked })}
                  />
                }
                label="Price Change"
              />
              <br />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={activities.refund}
                    onChange={(e) => setActivities({ ...activities, refund: e.target.checked })}
                  />
                }
                label="Refund"
              />
              <br />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={activities.reprint}
                    onChange={(e) => setActivities({ ...activities, reprint: e.target.checked })}
                  />
                }
                label="Reprint"
              />
            </Grid>
          </Grid>
        </Paper>
      )}

      {/* Users Table */}
      <Paper sx={{ p: 2, mt: 2 }}>
        <Typography variant="h6" gutterBottom>
          Existing Users
        </Typography>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold' }}>User Code</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>User Name</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Login Name</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>User Group</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Email</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    <CircularProgress />
                  </TableCell>
                </TableRow>
              ) : users.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    No users found. Create a new user above.
                  </TableCell>
                </TableRow>
              ) : (
                users.map((user) => (
                  <TableRow key={user.id} hover>
                    <TableCell>{user.userCode}</TableCell>
                    <TableCell>{user.userName}</TableCell>
                    <TableCell>{user.loginName}</TableCell>
                    <TableCell>{user.userGroup}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'center' }}>
                        <IconButton
                          size="small"
                          color="primary"
                          onClick={() => handleView(user)}
                          disabled={loading}
                          sx={{
                            '&:hover': {
                              backgroundColor: 'primary.light',
                            },
                          }}
                        >
                          <ViewIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                          size="small"
                          color="primary"
                          onClick={() => handleEdit(user)}
                          disabled={loading}
                          sx={{
                            '&:hover': {
                              backgroundColor: 'primary.light',
                            },
                          }}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleDelete(user)}
                          disabled={loading}
                          sx={{
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

      {/* Action Buttons */}
      <Paper sx={{ p: 2, mt: 2 }}>
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
          <Button
            variant="contained"
            startIcon={loading ? <CircularProgress size={20} /> : <SaveIcon />}
            onClick={handleSave}
            disabled={loading}
          >
            Save
          </Button>
          <Button
            variant="outlined"
            startIcon={<ClearIcon />}
            onClick={handleClear}
            disabled={loading}
          >
            Clear
          </Button>
          <Button
            variant="outlined"
            startIcon={<CloseIcon />}
            disabled={loading}
          >
            Close
          </Button>
        </Box>
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

export default UserCreationTab;

