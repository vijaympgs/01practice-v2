import React from 'react';
import { Box, Typography, Card, CardContent, Button, Alert } from '@mui/material';
import { ArrowBack, Category } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const ArchiveCategories = () => {
  const navigate = useNavigate();

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <PageTitle 
            title="Legacy Categories (Archive)" 
            subtitle="Legacy categories interface for reference"
            showIcon={true}
            icon={<Category />}
          />
          <Typography variant="body1" color="text.secondary">
            Legacy category management interface for reference
          </Typography>
        </Box>
        <Button
          variant="outlined"
          startIcon={<ArrowBack />}
          onClick={() => navigate('/categories')}
        >
          View Current Categories
        </Button>
      </Box>

      <Alert severity="info" sx={{ mb: 3 }}>
        This is the archived version of the Categories interface. The current enhanced version is available in Product Hierarchy.
      </Alert>

      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Legacy Category Management Interface
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            This archive contains the original category management forms that were replaced 
            with the enhanced Product Hierarchy interface in the Master Data Management section.
          </Typography>
          
          <Box sx={{ mt: 3 }}>
            <Button
              variant="contained"
              startIcon={<Category />}
              onClick={() => navigate('/categories')}
              sx={{ mr: 2 }}
            >
              Go to Current Product Hierarchy
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default ArchiveCategories;
