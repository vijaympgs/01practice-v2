import React from 'react';
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Typography,
  Chip,
  Divider
} from '@mui/material';
import {
  Category as CategoryIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon
} from '@mui/icons-material';

const CategoryList = ({ categories, selectedCategory, onCategorySelect }) => {
  const [expandedCategories, setExpandedCategories] = React.useState({
    'All Categories': true,
    'Others': false
  });

  const toggleCategory = (category) => {
    setExpandedCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  const handleCategorySelect = (category) => {
    onCategorySelect(category);
  };

  return (
    <Box sx={{ 
      bgcolor: 'white', 
      borderRadius: 1, 
      border: '1px solid #e0e0e0',
      maxHeight: 400,
      overflow: 'auto'
    }}>
      <Box sx={{ p: 2, borderBottom: '1px solid #e0e0e0' }}>
        <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <CategoryIcon />
          Categories
        </Typography>
      </Box>
      
      <List sx={{ p: 0 }}>
        {categories.map((category, index) => (
          <React.Fragment key={category}>
            <ListItem sx={{ p: 0 }}>
              <ListItemButton
                onClick={() => {
                  if (category === 'All Categories' || category === 'Others') {
                    toggleCategory(category);
                  } else {
                    handleCategorySelect(category);
                  }
                }}
                selected={selectedCategory === category}
                sx={{
                  '&.Mui-selected': {
                    bgcolor: 'primary.main',
                    color: 'white',
                    '&:hover': {
                      bgcolor: 'primary.dark'
                    }
                  },
                  '&:hover': {
                    bgcolor: selectedCategory === category ? 'primary.dark' : 'action.hover'
                  }
                }}
              >
                <ListItemText 
                  primary={category}
                  primaryTypographyProps={{
                    fontSize: '0.9rem',
                    fontWeight: selectedCategory === category ? 'bold' : 'normal'
                  }}
                />
                {(category === 'All Categories' || category === 'Others') && (
                  expandedCategories[category] ? <ExpandLessIcon /> : <ExpandMoreIcon />
                )}
              </ListItemButton>
            </ListItem>
            
            {/* Show subcategories for expanded categories */}
            {expandedCategories[category] && category === 'All Categories' && (
              <Box sx={{ pl: 2, bgcolor: '#f8f9fa' }}>
                {categories.slice(1, -1).map((subCategory) => (
                  <ListItem key={subCategory} sx={{ p: 0 }}>
                    <ListItemButton
                      onClick={() => handleCategorySelect(subCategory)}
                      selected={selectedCategory === subCategory}
                      sx={{ pl: 3 }}
                    >
                      <ListItemText 
                        primary={subCategory}
                        primaryTypographyProps={{ fontSize: '0.8rem' }}
                      />
                    </ListItemButton>
                  </ListItem>
                ))}
              </Box>
            )}
            
            {expandedCategories[category] && category === 'Others' && (
              <Box sx={{ pl: 2, bgcolor: '#f8f9fa' }}>
                <ListItem sx={{ p: 0 }}>
                  <ListItemButton sx={{ pl: 3 }}>
                    <ListItemText 
                      primary="Subcategory 1"
                      primaryTypographyProps={{ fontSize: '0.8rem' }}
                    />
                  </ListItemButton>
                </ListItem>
                <ListItem sx={{ p: 0 }}>
                  <ListItemButton sx={{ pl: 3 }}>
                    <ListItemText 
                      primary="Subcategory 2"
                      primaryTypographyProps={{ fontSize: '0.8rem' }}
                    />
                  </ListItemButton>
                </ListItem>
              </Box>
            )}
            
            {index < categories.length - 1 && <Divider />}
          </React.Fragment>
        ))}
      </List>
      
      {/* Category Stats */}
      <Box sx={{ p: 2, borderTop: '1px solid #e0e0e0', bgcolor: '#f8f9fa' }}>
        <Chip 
          label={`${categories.length} categories`}
          size="small"
          color="primary"
          variant="outlined"
        />
      </Box>
    </Box>
  );
};

export default CategoryList;
