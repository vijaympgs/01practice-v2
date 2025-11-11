import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  Chip,
  Avatar,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Snackbar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Tooltip
} from '@mui/material';
import {
  PlayArrow,
  Stop,
  Pause,
  Refresh,
  AccountCircle,
  AccessTime,
  AttachMoney,
  TrendingUp,
  Settings,
  Visibility,
  Edit,
  Delete,
  Add,
  Search,
  FilterList,
  Download,
  Print
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const POSSessionManagement = () => {
  const navigate = useNavigate();
  
  // State management
  const [sessions, setSessions] = useState([]);
  const [activeSession, setActiveSession] = useState(null);
  const [sessionDialog, setSessionDialog] = useState(false);
  const [sessionDetails, setSessionDetails] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // Mock data for sessions
  const mockSessions = [
    {
      id: 'SES001',
      userId: 'U001',
      userName: 'John Smith',
      userRole: 'Cashier',
      startTime: new Date('2025-10-23T09:00:00'),
      endTime: null,
      status: 'active',
      tillId: 'TILL001',
      location: 'Main Store',
      floatAmount: 1000.00,
      transactions: 15,
      totalSales: 12500.00,
      cashSales: 8500.00,
      cardSales: 4000.00,
      refunds: 2,
      refundAmount: 250.00,
      voidTransactions: 1,
      voidAmount: 150.00
    },
    {
      id: 'SES002',
      userId: 'U002',
      userName: 'Jane Doe',
      userRole: 'Supervisor',
      startTime: new Date('2025-10-23T08:30:00'),
      endTime: new Date('2025-10-23T16:30:00'),
      status: 'completed',
      tillId: 'TILL002',
      location: 'Main Store',
      floatAmount: 1000.00,
      transactions: 28,
      totalSales: 18750.00,
      cashSales: 12000.00,
      cardSales: 6750.00,
      refunds: 3,
      refundAmount: 450.00,
      voidTransactions: 2,
      voidAmount: 300.00
    },
    {
      id: 'SES003',
      userId: 'U003',
      userName: 'Mike Johnson',
      userRole: 'Manager',
      startTime: new Date('2025-10-22T10:00:00'),
      endTime: new Date('2025-10-22T18:00:00'),
      status: 'completed',
      tillId: 'TILL001',
      location: 'Main Store',
      floatAmount: 1000.00,
      transactions: 22,
      totalSales: 15200.00,
      cashSales: 9500.00,
      cardSales: 5700.00,
      refunds: 1,
      refundAmount: 100.00,
      voidTransactions: 0,
      voidAmount: 0.00
    }
  ];

  useEffect(() => {
    setSessions(mockSessions);
    setActiveSession(mockSessions.find(s => s.status === 'active'));
  }, []);

  const handleStartSession = () => {
    navigate('/pos-login');
  };

  const handleEndSession = (sessionId) => {
    setSessions(prev => prev.map(session => 
      session.id === sessionId 
        ? { ...session, status: 'completed', endTime: new Date() }
        : session
    ));
    setActiveSession(null);
    setSnackbar({
      open: true,
      message: 'Session ended successfully',
      severity: 'success'
    });
  };

  const handleViewSession = (session) => {
    setSessionDetails(session);
    setSessionDialog(true);
  };

  const handleResumeSession = (sessionId) => {
    navigate('/pos');
    setSnackbar({
      open: true,
      message: 'Session resumed successfully',
      severity: 'success'
    });
  };

  const getSessionDuration = (session) => {
    const endTime = session.endTime || new Date();
    const startTime = new Date(session.startTime);
    const diff = endTime - startTime;
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    return `${hours}h ${minutes}m`;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'success';
      case 'completed': return 'primary';
      case 'paused': return 'warning';
      default: return 'default';
    }
  };

  const filteredSessions = sessions.filter(session => {
    const matchesSearch = session.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         session.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         session.tillId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || session.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="h4" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <AccountCircle color="primary" />
            POS Session Management
          </Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={handleStartSession}
              disabled={!!activeSession}
            >
              Start New Session
            </Button>
            <Button
              variant="outlined"
              startIcon={<Refresh />}
              onClick={() => window.location.reload()}
            >
              Refresh
            </Button>
          </Box>
        </Box>

        {/* Active Session Summary */}
        {activeSession && (
          <Card sx={{ bgcolor: 'success.light', color: 'success.contrastText', mb: 2 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h6" gutterBottom>
                    Active Session - {activeSession.userName}
                  </Typography>
                  <Typography variant="body2">
                    Till: {activeSession.tillId} | Duration: {getSessionDuration(activeSession)} | 
                    Transactions: {activeSession.transactions} | Sales: ₹{activeSession.totalSales.toLocaleString()}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button
                    variant="contained"
                    color="inherit"
                    startIcon={<PlayArrow />}
                    onClick={() => handleResumeSession(activeSession.id)}
                  >
                    Resume
                  </Button>
                  <Button
                    variant="outlined"
                    color="inherit"
                    startIcon={<Stop />}
                    onClick={() => handleEndSession(activeSession.id)}
                  >
                    End Session
                  </Button>
                </Box>
              </Box>
            </CardContent>
          </Card>
        )}

        {/* Filters */}
        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
          <TextField
            placeholder="Search sessions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />
            }}
            sx={{ flex: 1 }}
          />
          <FormControl sx={{ minWidth: 150 }}>
            <InputLabel>Status</InputLabel>
            <Select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              label="Status"
            >
              <MenuItem value="all">All Sessions</MenuItem>
              <MenuItem value="active">Active</MenuItem>
              <MenuItem value="completed">Completed</MenuItem>
              <MenuItem value="paused">Paused</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Paper>

      {/* Sessions List */}
      <Paper sx={{ p: 2 }}>
        <Typography variant="h6" gutterBottom>
          Session History ({filteredSessions.length} sessions)
        </Typography>
        
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Session ID</TableCell>
                <TableCell>User</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Start Time</TableCell>
                <TableCell>Duration</TableCell>
                <TableCell>Till</TableCell>
                <TableCell>Transactions</TableCell>
                <TableCell>Total Sales</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredSessions.map((session) => (
                <TableRow key={session.id} hover>
                  <TableCell>
                    <Typography variant="body2" fontWeight="medium">
                      {session.id}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Avatar sx={{ width: 32, height: 32 }}>
                        <AccountCircle />
                      </Avatar>
                      <Box>
                        <Typography variant="body2" fontWeight="medium">
                          {session.userName}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {session.location}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip label={session.userRole} size="small" variant="outlined" />
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={session.status} 
                      size="small" 
                      color={getStatusColor(session.status)}
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {new Date(session.startTime).toLocaleString()}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <AccessTime fontSize="small" />
                      <Typography variant="body2">
                        {getSessionDuration(session)}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" fontWeight="medium">
                      {session.tillId}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {session.transactions}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" fontWeight="medium" color="success.main">
                      ₹{session.totalSales.toLocaleString()}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 0.5 }}>
                      <Tooltip title="View Details">
                        <IconButton
                          size="small"
                          onClick={() => handleViewSession(session)}
                        >
                          <Visibility />
                        </IconButton>
                      </Tooltip>
                      {session.status === 'active' && (
                        <Tooltip title="Resume Session">
                          <IconButton
                            size="small"
                            onClick={() => handleResumeSession(session.id)}
                          >
                            <PlayArrow />
                          </IconButton>
                        </Tooltip>
                      )}
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Session Details Dialog */}
      <Dialog open={sessionDialog} onClose={() => setSessionDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          Session Details - {sessionDetails?.id}
        </DialogTitle>
        <DialogContent>
          {sessionDetails && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Session Information
                    </Typography>
                    <List dense>
                      <ListItem>
                        <ListItemText 
                          primary="User" 
                          secondary={sessionDetails.userName}
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemText 
                          primary="Role" 
                          secondary={sessionDetails.userRole}
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemText 
                          primary="Till ID" 
                          secondary={sessionDetails.tillId}
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemText 
                          primary="Location" 
                          secondary={sessionDetails.location}
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemText 
                          primary="Float Amount" 
                          secondary={`₹${sessionDetails.floatAmount.toLocaleString()}`}
                        />
                      </ListItem>
                    </List>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Transaction Summary
                    </Typography>
                    <List dense>
                      <ListItem>
                        <ListItemText 
                          primary="Total Transactions" 
                          secondary={sessionDetails.transactions}
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemText 
                          primary="Total Sales" 
                          secondary={`₹${sessionDetails.totalSales.toLocaleString()}`}
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemText 
                          primary="Cash Sales" 
                          secondary={`₹${sessionDetails.cashSales.toLocaleString()}`}
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemText 
                          primary="Card Sales" 
                          secondary={`₹${sessionDetails.cardSales.toLocaleString()}`}
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemText 
                          primary="Refunds" 
                          secondary={`${sessionDetails.refunds} (₹${sessionDetails.refundAmount.toLocaleString()})`}
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemText 
                          primary="Void Transactions" 
                          secondary={`${sessionDetails.voidTransactions} (₹${sessionDetails.voidAmount.toLocaleString()})`}
                        />
                      </ListItem>
                    </List>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSessionDialog(false)}>Close</Button>
          {sessionDetails?.status === 'active' && (
            <Button
              variant="contained"
              startIcon={<PlayArrow />}
              onClick={() => {
                handleResumeSession(sessionDetails.id);
                setSessionDialog(false);
              }}
            >
              Resume Session
            </Button>
          )}
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default POSSessionManagement;



