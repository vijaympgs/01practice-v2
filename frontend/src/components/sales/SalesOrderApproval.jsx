import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Button,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Checkbox,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Avatar,
  IconButton,
  Tooltip,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon
} from '@mui/material';
import {
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Visibility as ViewIcon,
  Edit as EditIcon,
  Person as PersonIcon,
  CalendarToday as CalendarIcon,
  AttachMoney as MoneyIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
  Approval as ApprovalIcon,
  Comment as CommentIcon
} from '@mui/icons-material';

const SalesOrderApproval = ({ orders = [], onApprove, onReject, onViewDetails }) => {
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [approvalComment, setApprovalComment] = useState('');
  const [rejectionComment, setRejectionComment] = useState('');
  const [showApprovalDialog, setShowApprovalDialog] = useState(false);
  const [showRejectionDialog, setShowRejectionDialog] = useState(false);
  const [selectedOrderForAction, setSelectedOrderForAction] = useState(null);

  // Mock data - replace with actual API data
  const pendingOrders = orders.length > 0 ? orders : [
    {
      id: 'SO-001',
      orderNumber: 'SO-2024-001',
      customer: { name: 'ABC Corporation', email: 'contact@abc.com' },
      orderDate: '2024-01-15',
      total: 2450.00,
      salesPerson: 'John Smith',
      priority: 'High',
      itemsCount: 3,
      requestedBy: 'John Smith',
      requestedDate: '2024-01-15',
      creditLimit: 10000.00,
      currentBalance: 2500.00,
      availableCredit: 7500.00
    },
    {
      id: 'SO-002',
      orderNumber: 'SO-2024-002',
      customer: { name: 'XYZ Industries', email: 'sales@xyz.com' },
      orderDate: '2024-01-16',
      total: 1890.50,
      salesPerson: 'Jane Doe',
      priority: 'Normal',
      itemsCount: 2,
      requestedBy: 'Jane Doe',
      requestedDate: '2024-01-16',
      creditLimit: 5000.00,
      currentBalance: 1200.00,
      availableCredit: 3800.00
    },
    {
      id: 'SO-003',
      orderNumber: 'SO-2024-003',
      customer: { name: 'DEF Enterprises', email: 'info@def.com' },
      orderDate: '2024-01-17',
      total: 3200.75,
      salesPerson: 'Mike Johnson',
      priority: 'Urgent',
      itemsCount: 5,
      requestedBy: 'Mike Johnson',
      requestedDate: '2024-01-17',
      creditLimit: 15000.00,
      currentBalance: 8000.00,
      availableCredit: 7000.00
    }
  ];

  const handleSelectOrder = (orderId) => {
    setSelectedOrders(prev => 
      prev.includes(orderId) 
        ? prev.filter(id => id !== orderId)
        : [...prev, orderId]
    );
  };

  const handleSelectAll = () => {
    if (selectedOrders.length === pendingOrders.length) {
      setSelectedOrders([]);
    } else {
      setSelectedOrders(pendingOrders.map(order => order.id));
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'Urgent': return 'error';
      case 'High': return 'warning';
      case 'Normal': return 'success';
      case 'Low': return 'default';
      default: return 'default';
    }
  };

  const getCreditStatus = (order) => {
    const creditUtilization = (order.currentBalance / order.creditLimit) * 100;
    if (creditUtilization > 90) return { status: 'critical', color: 'error', text: 'Credit Limit Exceeded' };
    if (creditUtilization > 80) return { status: 'warning', color: 'warning', text: 'High Credit Usage' };
    if (creditUtilization > 60) return { status: 'caution', color: 'info', text: 'Moderate Credit Usage' };
    return { status: 'good', color: 'success', text: 'Good Credit Standing' };
  };

  const handleBulkApprove = () => {
    if (selectedOrders.length === 0) return;
    
    const ordersToApprove = pendingOrders.filter(order => selectedOrders.includes(order.id));
    
    // Check for credit limit issues
    const creditIssues = ordersToApprove.filter(order => {
      const creditStatus = getCreditStatus(order);
      return creditStatus.status === 'critical' || creditStatus.status === 'warning';
    });

    if (creditIssues.length > 0) {
      setSelectedOrderForAction(creditIssues[0]);
      setShowApprovalDialog(true);
    } else {
      onApprove(selectedOrders, approvalComment);
      setSelectedOrders([]);
      setApprovalComment('');
    }
  };

  const handleBulkReject = () => {
    if (selectedOrders.length === 0) return;
    setShowRejectionDialog(true);
  };

  const handleApproveOrder = (orderId) => {
    setSelectedOrderForAction(pendingOrders.find(order => order.id === orderId));
    setShowApprovalDialog(true);
  };

  const handleRejectOrder = (orderId) => {
    setSelectedOrderForAction(pendingOrders.find(order => order.id === orderId));
    setShowRejectionDialog(true);
  };

  const confirmApproval = () => {
    if (selectedOrderForAction) {
      onApprove([selectedOrderForAction.id], approvalComment);
    } else {
      onApprove(selectedOrders, approvalComment);
    }
    setShowApprovalDialog(false);
    setSelectedOrderForAction(null);
    setApprovalComment('');
    setSelectedOrders([]);
  };

  const confirmRejection = () => {
    if (selectedOrderForAction) {
      onReject([selectedOrderForAction.id], rejectionComment);
    } else {
      onReject(selectedOrders, rejectionComment);
    }
    setShowRejectionDialog(false);
    setSelectedOrderForAction(null);
    setRejectionComment('');
    setSelectedOrders([]);
  };

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" component="h1" gutterBottom sx={{ fontSize: '1.8rem', fontWeight: 600 }}>
            Sales Order Approval
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            <Chip icon={<ApprovalIcon />} label={`${pendingOrders.length} Pending Approval`} color="warning" variant="outlined" />
            <Chip label={`${selectedOrders.length} Selected`} color="primary" variant="outlined" />
          </Box>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="outlined"
            color="success"
            startIcon={<CheckCircleIcon />}
            onClick={handleBulkApprove}
            disabled={selectedOrders.length === 0}
          >
            Approve Selected
          </Button>
          <Button
            variant="outlined"
            color="error"
            startIcon={<CancelIcon />}
            onClick={handleBulkReject}
            disabled={selectedOrders.length === 0}
          >
            Reject Selected
          </Button>
        </Box>
      </Box>

      {/* Credit Limit Warnings */}
      <Alert severity="info" sx={{ mb: 3 }}>
        <Typography variant="body2">
          <strong>Approval Guidelines:</strong> Review credit limits, customer payment history, and order details before approving. 
          Orders exceeding credit limits require special authorization.
        </Typography>
      </Alert>

      {/* Orders Table */}
      <Card>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox">
                  <Checkbox
                    indeterminate={selectedOrders.length > 0 && selectedOrders.length < pendingOrders.length}
                    checked={selectedOrders.length === pendingOrders.length}
                    onChange={handleSelectAll}
                  />
                </TableCell>
                <TableCell>Order Details</TableCell>
                <TableCell>Customer</TableCell>
                <TableCell>Credit Status</TableCell>
                <TableCell>Amount</TableCell>
                <TableCell>Requested By</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {pendingOrders.map((order) => {
                const creditStatus = getCreditStatus(order);
                const isSelected = selectedOrders.includes(order.id);
                
                return (
                  <TableRow key={order.id} hover selected={isSelected}>
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={isSelected}
                        onChange={() => handleSelectOrder(order.id)}
                      />
                    </TableCell>
                    <TableCell>
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {order.orderNumber}
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', mt: 0.5 }}>
                          <Chip
                            label={order.priority}
                            color={getPriorityColor(order.priority)}
                            size="small"
                            variant="outlined"
                          />
                          <Typography variant="caption" color="text.secondary">
                            {order.itemsCount} items
                          </Typography>
                        </Box>
                        <Typography variant="caption" color="text.secondary">
                          {new Date(order.orderDate).toLocaleDateString()}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}>
                          <PersonIcon fontSize="small" />
                        </Avatar>
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            {order.customer.name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {order.customer.email}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box>
                        <Chip
                          label={creditStatus.text}
                          color={creditStatus.color}
                          size="small"
                          variant="outlined"
                        />
                        <Typography variant="caption" display="block" color="text.secondary">
                          ${order.availableCredit.toFixed(2)} available
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          ${order.currentBalance.toFixed(2)} / ${order.creditLimit.toFixed(2)}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        ${order.total.toFixed(2)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box>
                        <Typography variant="body2">
                          {order.requestedBy}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {new Date(order.requestedDate).toLocaleDateString()}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 0.5 }}>
                        <Tooltip title="View Details">
                          <IconButton
                            size="small"
                            onClick={() => onViewDetails(order)}
                          >
                            <ViewIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Approve">
                          <IconButton
                            size="small"
                            color="success"
                            onClick={() => handleApproveOrder(order.id)}
                          >
                            <CheckCircleIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Reject">
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => handleRejectOrder(order.id)}
                          >
                            <CancelIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      {/* Approval Dialog */}
      <Dialog open={showApprovalDialog} onClose={() => setShowApprovalDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <CheckCircleIcon color="success" />
            Approve Sales Order{selectedOrders.length > 1 ? 's' : ''}
          </Box>
        </DialogTitle>
        <DialogContent>
          {selectedOrderForAction && (
            <Box sx={{ mb: 2 }}>
              <Alert severity="warning">
                <Typography variant="body2">
                  <strong>Credit Limit Warning:</strong> This order may exceed customer credit limits. 
                  Please review carefully before approval.
                </Typography>
              </Alert>
            </Box>
          )}
          
          <TextField
            fullWidth
            multiline
            rows={3}
            label="Approval Comments"
            value={approvalComment}
            onChange={(e) => setApprovalComment(e.target.value)}
            placeholder="Add any comments or notes for this approval..."
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowApprovalDialog(false)}>Cancel</Button>
          <Button onClick={confirmApproval} variant="contained" color="success">
            Confirm Approval
          </Button>
        </DialogActions>
      </Dialog>

      {/* Rejection Dialog */}
      <Dialog open={showRejectionDialog} onClose={() => setShowRejectionDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <CancelIcon color="error" />
            Reject Sales Order{selectedOrders.length > 1 ? 's' : ''}
          </Box>
        </DialogTitle>
        <DialogContent>
          <Alert severity="warning" sx={{ mb: 2 }}>
            <Typography variant="body2">
              <strong>Warning:</strong> Rejected orders will be returned to the sales person for revision.
            </Typography>
          </Alert>
          
          <TextField
            fullWidth
            multiline
            rows={3}
            label="Rejection Reason"
            value={rejectionComment}
            onChange={(e) => setRejectionComment(e.target.value)}
            placeholder="Please provide a reason for rejection..."
            required
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowRejectionDialog(false)}>Cancel</Button>
          <Button 
            onClick={confirmRejection} 
            variant="contained" 
            color="error"
            disabled={!rejectionComment.trim()}
          >
            Confirm Rejection
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default SalesOrderApproval;
