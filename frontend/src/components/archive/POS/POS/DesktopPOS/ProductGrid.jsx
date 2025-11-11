import React from 'react';
import {
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  Chip,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  Add as AddIcon,
  Image as ImageIcon
} from '@mui/icons-material';

const ProductGrid = ({ products, onAddToCart }) => {
  return (
    <Box sx={{ height: '100%', overflow: 'auto' }}>
      <Grid container spacing={2}>
        {products.map((product) => (
          <Grid item xs={4} key={product.id}>
            <Card 
              sx={{ 
                height: 200,
                display: 'flex',
                flexDirection: 'column',
                cursor: 'pointer',
                transition: 'all 0.2s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: 3
                }
              }}
              onClick={() => onAddToCart(product)}
            >
              {/* Product Image */}
              <Box sx={{ 
                height: 100, 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                bgcolor: '#f5f5f5',
                position: 'relative'
              }}>
                <ImageIcon sx={{ fontSize: 40, color: 'text.secondary' }} />
                <Chip 
                  label={product.sku}
                  size="small"
                  sx={{ 
                    position: 'absolute',
                    top: 8,
                    right: 8,
                    fontSize: '0.7rem'
                  }}
                />
              </Box>

              {/* Product Details */}
              <CardContent sx={{ flexGrow: 1, p: 1.5 }}>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    fontWeight: 'medium',
                    mb: 1,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical'
                  }}
                >
                  {product.name}
                </Typography>
                
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Typography 
                    variant="h6" 
                    color="primary" 
                    sx={{ fontWeight: 'bold' }}
                  >
                    ₹{product.price.toFixed(2)}
                  </Typography>
                  
                  <Tooltip title="Add to Cart">
                    <IconButton 
                      size="small" 
                      color="primary"
                      onClick={(e) => {
                        e.stopPropagation();
                        onAddToCart(product);
                      }}
                      sx={{ 
                        bgcolor: 'primary.main',
                        color: 'white',
                        '&:hover': {
                          bgcolor: 'primary.dark'
                        }
                      }}
                    >
                      <AddIcon />
                    </IconButton>
                  </Tooltip>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      
      {products.length === 0 && (
        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          justifyContent: 'center',
          height: 200,
          color: 'text.secondary'
        }}>
          <ImageIcon sx={{ fontSize: 60, mb: 2 }} />
          <Typography variant="h6">No products found</Typography>
          <Typography variant="body2">Try selecting a different category</Typography>
        </Box>
      )}
    </Box>
  );
};

export default ProductGrid;
