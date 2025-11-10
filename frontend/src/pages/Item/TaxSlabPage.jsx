import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Container,
  Avatar,
} from '@mui/material';
import {
  Construction as ConstructionIcon,
} from '@mui/icons-material';

const TaxSlabPage = () => {
  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <Card sx={{ 
        borderRadius: 4,
        boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        overflow: 'hidden'
      }}>
        <CardContent sx={{ p: 6, textAlign: 'center' }}>
          <Avatar
            sx={{
              width: 120,
              height: 120,
              bgcolor: 'rgba(255,255,255,0.2)',
              margin: '0 auto 2rem',
              backdropFilter: 'blur(10px)',
              border: '2px solid rgba(255,255,255,0.3)'
            }}
          >
            <ConstructionIcon sx={{ fontSize: 60 }} />
          </Avatar>
          
          <Typography variant="h3" gutterBottom sx={{ fontWeight: 'bold', mb: 2 }}>
            Under Construction
          </Typography>
          
          <Typography variant="h5" sx={{ mb: 3, opacity: 0.9 }}>
            Coming Soon
          </Typography>
          
          <Typography variant="body1" sx={{ mb: 4, opacity: 0.8, fontSize: '1.1rem' }}>
            We're working hard to bring you the Tax Slab Management features. 
            This section will include tax slab configuration, rate management, and advanced tax calculation options.
          </Typography>
        </CardContent>
      </Card>
    </Container>
  );
};

export default TaxSlabPage;




