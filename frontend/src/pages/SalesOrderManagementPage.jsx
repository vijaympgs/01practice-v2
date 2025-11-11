import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Tabs,
  Tab,
  Paper,
  Grid,
  Card,
  CardContent,
  Chip,
  Button,
  IconButton,
  Tooltip
} from '@mui/material';
import salesManagementService from '../services/salesManagementService';
import { useNotification } from '../contexts/NotificationContext';
import {
  Add as AddIcon,
  List as ListIcon,
  Visibility as ViewIcon,
  CheckCircle as ApprovalIcon,
  LocalShipping as FulfillmentIcon,
  Receipt as InvoiceIcon,
  Speed as QuickIcon,
  Assessment as AnalyticsIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';

// Import our Sales Order Management components
import SalesOrderEntry from '../components/sales/SalesOrderEntry';
import SalesOrderList from '../components/sales/SalesOrderList';
import SalesOrderDetails from '../components/sales/SalesOrderDetails';
import SalesOrderApproval from '../components/sales/SalesOrderApproval';
import SalesOrderFulfillment from '../components/sales/SalesOrderFulfillment';
import SalesOrderInvoicing from '../components/sales/SalesOrderInvoicing';
import QuickSalesOrder from '../components/sales/QuickSalesOrder';
import SalesOrderAnalytics from '../components/sales/SalesOrderAnalytics';

const SalesOrderManagementPage = () => {
  const { displaySuccess, displayError } = useNotification();
  const [activeTab, setActiveTab] = useState(0);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderEntry, setShowOrderEntry] = useState(false);
  const [showQuickOrder, setShowQuickOrder] = useState(false);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  // Load sales orders from backend
  useEffect(() => {
    loadSalesOrders();
  }, []);

  // Map backend Sale to frontend SalesOrder format
  const mapSaleToOrder = (sale) => {
    return {
      id: sale.id,
      orderNumber: sale.sale_number || sale.id,
      customer: sale.customer ? {
        name: `${sale.customer.first_name || ''} ${sale.customer.last_name || ''}`.trim() || sale.customer.company_name || 'Walk-in Customer',
        email: sale.customer.email || '',
        id: sale.customer.id
      } : { name: 'Walk-in Customer', email: '', id: null },
      orderDate: sale.sale_date?.split('T')[0] || new Date().toISOString().split('T')[0],
      deliveryDate: sale.delivery_date || null,
      status: mapSaleStatusToOrderStatus(sale.status),
      total: parseFloat(sale.total_amount) || 0,
      subtotal: parseFloat(sale.subtotal) || 0,
      taxAmount: parseFloat(sale.tax_amount) || 0,
      discountAmount: parseFloat(sale.discount_amount) || 0,
      salesPerson: sale.cashier?.full_name || sale.cashier?.username || 'System',
      itemsCount: sale.items?.length || 0,
      priority: 'Normal',
      saleType: sale.sale_type,
      location: sale.location?.name || '',
      notes: sale.notes || '',
      items: sale.items || []
    };
  };

  // Map backend Sale status to frontend Order status
  const mapSaleStatusToOrderStatus = (saleStatus) => {
    const statusMap = {
      'draft': 'Draft',
      'completed': 'Completed',
      'cancelled': 'Cancelled',
      'refunded': 'Refunded',
      'partial_refund': 'Partially Refunded'
    };
    return statusMap[saleStatus] || saleStatus;
  };

  // Map frontend Order status to backend Sale status
  const mapOrderStatusToSaleStatus = (orderStatus) => {
    const statusMap = {
      'Draft': 'draft',
      'Pending': 'draft',
      'Approved': 'draft',
      'In Progress': 'draft',
      'Shipped': 'completed',
      'Delivered': 'completed',
      'Completed': 'completed',
      'Cancelled': 'cancelled',
      'Rejected': 'cancelled'
    };
    return statusMap[orderStatus] || 'draft';
  };

  const loadSalesOrders = async () => {
    try {
      setLoading(true);
      const response = await salesManagementService.getSales();
      const sales = response.data.results || response.data || [];
      const ordersList = sales.map(mapSaleToOrder);
      setOrders(ordersList);
    } catch (error) {
      console.error('Error loading sales orders:', error);
      displayError('Failed to load sales orders');
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleAddOrder = () => {
    setShowOrderEntry(true);
  };

  const handleAddQuickOrder = () => {
    setShowQuickOrder(true);
  };

  const handleViewOrder = (order) => {
    setSelectedOrder(order);
    setActiveTab(2); // Switch to Details tab
  };

  const handleEditOrder = (order) => {
    setSelectedOrder(order);
    setShowOrderEntry(true);
  };

  const handleSaveOrder = async (orderData) => {
    try {
      setLoading(true);
      
      // Map frontend order data to backend sale format
      const saleData = {
        customer: orderData.customer?.id || null,
        sale_type: orderData.saleType || 'cash',
        status: mapOrderStatusToSaleStatus(orderData.status || 'Draft'),
        subtotal: orderData.subtotal?.toString() || '0.00',
        tax_amount: orderData.taxAmount?.toString() || '0.00',
        discount_amount: orderData.discountAmount?.toString() || '0.00',
        total_amount: orderData.total?.toString() || '0.00',
        delivery_type: orderData.deliveryType || 'immediate',
        delivery_address: orderData.deliveryAddress || '',
        notes: orderData.notes || '',
        items: orderData.items?.map(item => ({
          product: item.productId || item.product?.id,
          quantity: item.quantity,
          unit_price: item.unitPrice?.toString() || '0.00',
          discount_amount: item.discountAmount?.toString() || '0.00',
          tax_amount: item.taxAmount?.toString() || '0.00',
          total_amount: item.totalAmount?.toString() || '0.00'
        })) || []
      };

      if (orderData.id) {
        // Update existing order
        await salesManagementService.updateSale(orderData.id, saleData);
        displaySuccess('Sales order updated successfully');
      } else {
        // Create new order
        await salesManagementService.createSale(saleData);
        displaySuccess('Sales order created successfully');
      }
      
      await loadSalesOrders();
      setShowOrderEntry(false);
      setShowQuickOrder(false);
      setActiveTab(1); // Switch to List tab
    } catch (error) {
      console.error('Error saving sales order:', error);
      displayError(error.response?.data?.detail || 'Failed to save sales order');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = () => {
    setShowOrderEntry(false);
    setShowQuickOrder(false);
    setSelectedOrder(null);
  };

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      setLoading(true);
      const saleStatus = mapOrderStatusToSaleStatus(newStatus);
      await salesManagementService.updateSale(orderId, { status: saleStatus });
      await loadSalesOrders();
      displaySuccess(`Order status updated to ${newStatus}`);
    } catch (error) {
      console.error('Error updating order status:', error);
      displayError('Failed to update order status');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (orderIds, comment) => {
    try {
      setLoading(true);
      const updatePromises = orderIds.map(orderId => 
        salesManagementService.updateSale(orderId, { 
          status: 'draft', // Keep as draft but can be marked as approved in notes
          notes: comment || 'Approved'
        })
      );
      await Promise.all(updatePromises);
      await loadSalesOrders();
      displaySuccess(`${orderIds.length} order(s) approved`);
    } catch (error) {
      console.error('Error approving orders:', error);
      displayError('Failed to approve orders');
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async (orderIds, comment) => {
    try {
      setLoading(true);
      const updatePromises = orderIds.map(orderId => 
        salesManagementService.updateSale(orderId, { 
          status: 'cancelled',
          notes: comment || 'Rejected'
        })
      );
      await Promise.all(updatePromises);
      await loadSalesOrders();
      displaySuccess(`${orderIds.length} order(s) rejected`);
    } catch (error) {
      console.error('Error rejecting orders:', error);
      displayError('Failed to reject orders');
    } finally {
      setLoading(false);
    }
  };

  const handlePrintPickingList = (orderId) => {
    console.log('Printing picking list for order:', orderId);
  };

  const handleGenerateInvoice = (orderId, settings) => {
    console.log('Generating invoice for order:', orderId, settings);
    handleUpdateStatus(orderId, 'Invoiced');
  };

  const handleSendInvoice = (orderId) => {
    console.log('Sending invoice for order:', orderId);
    handleUpdateStatus(orderId, 'Invoice Sent');
  };

  const handlePrintInvoice = (orderId) => {
    console.log('Printing invoice for order:', orderId);
  };

  const handleRefresh = async () => {
    await loadSalesOrders();
    displaySuccess('Data refreshed successfully');
  };

  const handleExport = () => {
    console.log('Exporting data...');
  };

  const tabs = [
    { label: 'Analytics', icon: <AnalyticsIcon />, component: 'analytics' },
    { label: 'Order List', icon: <ListIcon />, component: 'list' },
    { label: 'Order Details', icon: <ViewIcon />, component: 'details' },
    { label: 'Approval', icon: <ApprovalIcon />, component: 'approval' },
    { label: 'Fulfillment', icon: <FulfillmentIcon />, component: 'fulfillment' },
    { label: 'Invoicing', icon: <InvoiceIcon />, component: 'invoicing' }
  ];

  const renderTabContent = () => {
    switch (tabs[activeTab].component) {
      case 'analytics':
        return (
          <SalesOrderAnalytics 
            orders={orders}
            onRefresh={handleRefresh}
            onExport={handleExport}
          />
        );
      case 'list':
        return (
          <SalesOrderList 
            orders={orders}
            loading={loading}
            onAddOrder={handleAddOrder}
            onViewOrder={handleViewOrder}
            onEditOrder={handleEditOrder}
            onDeleteOrder={async (order) => {
              try {
                await salesManagementService.updateSale(order.id, { status: 'cancelled' });
                await loadSalesOrders();
                displaySuccess('Order deleted successfully');
              } catch (error) {
                displayError('Failed to delete order');
              }
            }}
          />
        );
      case 'details':
        return selectedOrder ? (
          <SalesOrderDetails 
            order={selectedOrder}
            onEdit={() => handleEditOrder(selectedOrder)}
            onClose={() => setSelectedOrder(null)}
            onPrint={() => handlePrintInvoice(selectedOrder.id)}
            onEmail={() => handleSendInvoice(selectedOrder.id)}
          />
        ) : (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant="h6" color="text.secondary">
              Select an order from the Order List to view details
            </Typography>
          </Box>
        );
      case 'approval':
        return (
          <SalesOrderApproval 
            orders={orders.filter(order => order.status === 'Pending')}
            onApprove={handleApprove}
            onReject={handleReject}
            onViewDetails={handleViewOrder}
          />
        );
      case 'fulfillment':
        return (
          <SalesOrderFulfillment 
            orders={orders.filter(order => ['Approved', 'In Progress', 'Shipped'].includes(order.status))}
            onUpdateStatus={handleUpdateStatus}
            onViewDetails={handleViewOrder}
            onPrintPickingList={handlePrintPickingList}
          />
        );
      case 'invoicing':
        return (
          <SalesOrderInvoicing 
            orders={orders.filter(order => ['Shipped', 'Delivered'].includes(order.status))}
            onGenerateInvoice={handleGenerateInvoice}
            onSendInvoice={handleSendInvoice}
            onPrintInvoice={handlePrintInvoice}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Container maxWidth="xl">
      <Box sx={{ pt: 5, pb: 3 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Box>
            <Typography 
              variant="h4" 
              component="h1" 
              gutterBottom
              sx={{ fontSize: '1.8rem', fontWeight: 600 }}
            >
              Sales Order Management
            </Typography>
            <Typography 
              variant="body1" 
              color="text.secondary"
              sx={{ fontSize: '0.875rem', fontWeight: 400, lineHeight: 1.4, mt: 0.5 }}
            >
              Comprehensive sales order processing, approval, fulfillment, and invoicing
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Tooltip title="Refresh">
              <IconButton onClick={handleRefresh}>
                <RefreshIcon />
              </IconButton>
            </Tooltip>
            <Button
              variant="outlined"
              startIcon={<QuickIcon />}
              onClick={handleAddQuickOrder}
              sx={{
                borderColor: '#4caf50',
                color: '#4caf50',
                '&:hover': {
                  borderColor: '#388e3c',
                  backgroundColor: 'rgba(76, 175, 80, 0.04)'
                }
              }}
            >
              Quick Order
            </Button>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleAddOrder}
            >
              New Order
            </Button>
          </Box>
        </Box>

        {/* Quick Stats */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box>
                    <Typography color="text.secondary" gutterBottom>
                      Total Orders
                    </Typography>
                    <Typography variant="h4" sx={{ fontWeight: 600 }}>
                      {orders.length}
                    </Typography>
                  </Box>
                  <Chip label="Active" color="primary" size="small" />
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box>
                    <Typography color="text.secondary" gutterBottom>
                      Pending Approval
                    </Typography>
                    <Typography variant="h4" sx={{ fontWeight: 600 }}>
                      {orders.filter(o => o.status === 'Pending').length}
                    </Typography>
                  </Box>
                  <Chip label="Pending" color="warning" size="small" />
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box>
                    <Typography color="text.secondary" gutterBottom>
                      In Fulfillment
                    </Typography>
                    <Typography variant="h4" sx={{ fontWeight: 600 }}>
                      {orders.filter(o => ['Approved', 'In Progress'].includes(o.status)).length}
                    </Typography>
                  </Box>
                  <Chip label="Processing" color="info" size="small" />
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box>
                    <Typography color="text.secondary" gutterBottom>
                      Completed
                    </Typography>
                    <Typography variant="h4" sx={{ fontWeight: 600 }}>
                      {orders.filter(o => o.status === 'Completed').length}
                    </Typography>
                  </Box>
                  <Chip label="Done" color="success" size="small" />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Main Content */}
        <Paper sx={{ width: '100%' }}>
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
            sx={{ borderBottom: 1, borderColor: 'divider' }}
          >
            {tabs.map((tab, index) => (
              <Tab
                key={index}
                label={tab.label}
                icon={tab.icon}
                iconPosition="start"
                sx={{ minHeight: 60 }}
              />
            ))}
          </Tabs>
          
          <Box sx={{ p: 3 }}>
            {renderTabContent()}
          </Box>
        </Paper>

        {/* Order Entry Dialog */}
        {showOrderEntry && (
          <Box sx={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, bgcolor: 'rgba(0,0,0,0.5)', zIndex: 1300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Box sx={{ bgcolor: 'white', borderRadius: 2, maxHeight: '90vh', overflow: 'auto', width: '90%', maxWidth: 1200 }}>
              <SalesOrderEntry 
                orderData={selectedOrder}
                onSave={handleSaveOrder}
                onCancel={handleCancelOrder}
              />
            </Box>
          </Box>
        )}

        {/* Quick Order Dialog */}
        {showQuickOrder && (
          <Box sx={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, bgcolor: 'rgba(0,0,0,0.5)', zIndex: 1300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Box sx={{ bgcolor: 'white', borderRadius: 2, maxHeight: '90vh', overflow: 'auto', width: '90%', maxWidth: 800 }}>
              <QuickSalesOrder 
                onSave={handleSaveOrder}
                onCancel={handleCancelOrder}
              />
            </Box>
          </Box>
        )}
      </Box>
    </Container>
  );
};

export default SalesOrderManagementPage;
