import React from 'react';
import { Box, Typography, Card, CardContent, Button, Alert } from '@mui/material';
import { ArrowBack, Assessment } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const ArchiveReports = () => {
  const navigate = useNavigate();

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <PageTitle 
            title="Legacy Reports (Archive)" 
            subtitle="Legacy reports interface for reference"
            showIcon={true}
            icon={<Assessment />}
          />
          <Typography variant="body1" color="text.secondary">
            Legacy reports interface for reference
          </Typography>
        </Box>
        <Button
          variant="outlined"
          startIcon={<ArrowBack />}
          onClick={() => navigate('/reports')}
        >
          View Current Reports
        </Button>
      </Box>

      <Alert severity="info" sx={{ mb: 3 }}>
        This is the archived version of the Reports interface. The current enhanced version is available in Reports & Analytics.
      </Alert>

      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Legacy Reports Interface
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            This archive contains the original reports interface that was replaced 
            with the enhanced Reports & Analytics section with specialized analytics for Sales, Inventory, Financial, and Customer data.
          </Typography>
          
          <Box sx={{ mt: 3 }}>
            <Button
              variant="contained"
              startIcon={<Assessment />}
              onClick={() => navigate('/reports')}
              sx={{ mr: 2 }}
            >
              Go to Current Reports
            </Button>
            <Button
              variant="outlined"
              onClick={() => navigate('/reports/sales')}
            >
              Go to Sales Analytics
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default ArchiveReports;
