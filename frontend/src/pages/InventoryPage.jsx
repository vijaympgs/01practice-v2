import React, { useState, useEffect } from 'react';
import PageTitle from '../components/common/PageTitle';
import CardHeader from '../components/common/CardHeader';
import {
  Box,
  Button,
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  Chip,
  Alert,
  Tabs,
  Tab,
} from '@mui/material';
import {
  Inventory as InventoryIcon,
  Add as AddIcon,
  Assessment as AssessmentIcon,
  Warning as WarningIcon,
  TrendingUp as TrendingUpIcon,
  SwapHoriz as TransferIcon,
  Warehouse as WarehouseIcon,
  QrCode as QrCodeIcon,
} from '@mui/icons-material';
import InventoryList from '../components/inventory/InventoryList';
import StockAdjustmentDialog from '../components/inventory/StockAdjustmentDialog';
import PurchaseOrderDialog from '../components/inventory/PurchaseOrderDialog';
import InventoryStats from '../components/inventory/InventoryStats';
import StockOverview from '../components/inventory/StockOverview';
import StockMovements from '../components/inventory/StockMovements';
import InventoryAnalytics from '../components/inventory/InventoryAnalytics';
import WarehouseManagement from '../components/inventory/WarehouseManagement';
import PhysicalCount from '../components/inventory/PhysicalCount';
import inventoryService from '../services/inventoryService';

const InventoryPage = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [stats, setStats] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [adjustmentDialogOpen, setAdjustmentDialogOpen] = useState(false);
  const [purchaseOrderDialogOpen, setPurchaseOrderDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [statsData, alertsData] = await Promise.all([
        inventoryService.getInventoryStats(),
        inventoryService.getActiveAlerts(),
      ]);
      
      setStats(statsData.data);
      setAlerts(alertsData.data.results || alertsData.data);
    } catch (err) {
      setError('Failed to load inventory data');
      console.error('Inventory load error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const getAlertSeverity = (severity) => {
    switch (severity) {
      case 'critical':
        return 'error';
      case 'high':
        return 'warning';
      case 'medium':
        return 'info';
      default:
        return 'success';
    }
  };

  if (loading) {
    return (
      <Container maxWidth="xl" sx={{ pt: 4, pb: 3 }}>
        <Typography>Loading inventory...</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ pt: 5, pb: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <PageTitle 
            title="📦 Inventory" 
            subtitle="Manage stock levels, movements, and inventory analytics"
          />
          <Typography 
            variant="body1" 
            color="text.secondary"
            sx={{ 
              fontSize: '0.875rem', // 14px - smaller secondary text
              fontWeight: 400,
              lineHeight: 1.4,
              mt: 0.5
            }}
          >
            Monitor stock levels, manage purchase orders, and track inventory movements
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<TrendingUpIcon />}
            onClick={() => setAdjustmentDialogOpen(true)}
          >
            Adjust Stock
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setPurchaseOrderDialogOpen(true)}
          >
            New Purchase Order
          </Button>
        </Box>
      </Box>

      {/* Alerts Section */}
      {alerts.length > 0 && (
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <WarningIcon color="warning" />
            Active Alerts ({alerts.length})
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {alerts.slice(0, 5).map((alert) => (
              <Alert 
                key={alert.id} 
                severity={getAlertSeverity(alert.severity)}
                sx={{ mb: 1, minWidth: 200 }}
              >
                <Typography variant="body2">
                  <strong>{alert.product_name}</strong>: {alert.message}
                </Typography>
              </Alert>
            ))}
          </Box>
        </Box>
      )}

      {/* Stats Cards */}
      {stats && (
        <Box sx={{ mb: 3 }}>
          <InventoryStats stats={stats} />
        </Box>
      )}

      {/* Main Content Tabs */}
      <Card>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={activeTab} onChange={handleTabChange} variant="scrollable" scrollButtons="auto">
            <Tab 
              icon={<InventoryIcon />} 
              label="Stock Overview" 
              iconPosition="start"
            />
            <Tab 
              icon={<TransferIcon />} 
              label="Stock Movements" 
              iconPosition="start"
            />
            <Tab 
              icon={<AssessmentIcon />} 
              label="Analytics" 
              iconPosition="start"
            />
            <Tab 
              icon={<WarehouseIcon />} 
              label="Warehouse Management" 
              iconPosition="start"
            />
            <Tab 
              icon={<QrCodeIcon />} 
              label="Physical Count" 
              iconPosition="start"
            />
          </Tabs>
        </Box>
        
        <Box sx={{ p: 0 }}>
          {activeTab === 0 && (
            <StockOverview 
              onRefresh={fetchData}
              onStockAdjust={() => setAdjustmentDialogOpen(true)}
            />
          )}
          
          {activeTab === 1 && (
            <StockMovements 
              onRefresh={fetchData}
            />
          )}

          {activeTab === 2 && (
            <InventoryAnalytics 
              onRefresh={fetchData}
            />
          )}

          {activeTab === 3 && (
            <WarehouseManagement 
              onRefresh={fetchData}
            />
          )}

          {activeTab === 4 && (
            <PhysicalCount 
              onRefresh={fetchData}
            />
          )}
        </Box>
      </Card>

      {/* Dialogs */}
      <StockAdjustmentDialog
        open={adjustmentDialogOpen}
        onClose={() => setAdjustmentDialogOpen(false)}
        onSuccess={() => {
          setAdjustmentDialogOpen(false);
          fetchData();
        }}
      />

      <PurchaseOrderDialog
        open={purchaseOrderDialogOpen}
        onClose={() => setPurchaseOrderDialogOpen(false)}
        onSuccess={() => {
          setPurchaseOrderDialogOpen(false);
          fetchData();
        }}
      />
    </Container>
  );
};

export default InventoryPage;


