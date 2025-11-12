import React, { useState, useEffect } from 'react';
import { Typography, Box } from '@mui/material';
import themeService from '../../services/themeService';
import brandingService from '../../services/brandingService';

const PageTitle = ({ 
  title, 
  subtitle, 
  showIcon = false, 
  icon = null,
  variant = 'h4',
  sx = {},
  useBranding = false // New prop to enable branding
}) => {
  const [themeColor, setThemeColor] = useState('#1565C0'); // Default Deep Blue
  const [isLoading, setIsLoading] = useState(true);
  const [brandingConfig, setBrandingConfig] = useState(null);
  
  useEffect(() => {
    const loadTheme = async () => {
      try {
        setIsLoading(true);
        const themeColors = await themeService.getThemeColors();
        setThemeColor(themeColors.primary);
      } catch (error) {
        console.error('Error loading theme for PageTitle:', error);
        // Keep default color if theme loading fails
      } finally {
        setIsLoading(false);
      }
    };

    loadTheme();
  }, []);

  useEffect(() => {
    if (useBranding) {
      // Load branding configuration
      const loadBranding = () => {
        const config = brandingService.getConfig();
        if (config) {
          setBrandingConfig(config);
        }
      };

      loadBranding();

      // Listen for branding changes
      const cleanup = brandingService.onBrandingChange((newConfig) => {
        setBrandingConfig(newConfig);
      });

      return cleanup;
    }
  }, [useBranding]);

  // Helper function to get branded company name
  const getBrandedCompanyName = () => {
    if (!brandingConfig?.company) return null;
    
    const { main_name, sub_name, trademark, show_trademark } = brandingConfig.company;
    const tm = show_trademark !== false ? (trademark || '™') : '';
    return `${main_name} ${sub_name}${tm}`;
  };

  // Helper function to process subtitle with branding
  const processSubtitle = () => {
    if (!useBranding || !subtitle || !brandingConfig?.company) return subtitle;
    
    const brandedName = getBrandedCompanyName();
    if (!brandedName) return subtitle;
    
    // Replace "NewBorn Retail™" with the branded name
    return subtitle.replace(/NewBorn Retail™/g, brandedName);
  };

  const titleStyles = {
    background: `linear-gradient(135deg, ${themeColor} 0%, ${themeColor}dd 100%)`,
    backgroundClip: 'text',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    fontWeight: 400, // Normal weight (not bold)
    fontSize: '1.3rem', // Smaller size
    lineHeight: 1.1, // Very tight
    ...sx
  };

  // Show loading state if theme is still loading
  if (isLoading) {
    return (
      <Box sx={{ mb: 1.5, pt: 0 }}>
        <Typography 
          variant={variant} 
          sx={{
            color: '#1565C0', // Default color while loading
            fontWeight: 400,
            fontSize: '1.3rem',
            lineHeight: 1.1,
            mb: 0,
            ...sx
          }}
        >
          {showIcon && icon && (
            <Box component="span" sx={{ mr: 2, display: 'inline-flex', alignItems: 'center' }}>
              {icon}
            </Box>
          )}
          {title}
          {subtitle && (
            <>
              <br />
              <Typography 
                component="span"
                variant="body1" 
                color="text.secondary" 
                sx={{ 
                  fontSize: '0.8rem',
                  fontWeight: 300,
                  lineHeight: 1.1,
                  display: 'block',
                  mt: 0
                }}
              >
                {processSubtitle()}
              </Typography>
            </>
          )}
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ mb: 1.5, pt: 0 }}>
      <Typography 
        variant={variant} 
        sx={{
          ...titleStyles,
          mb: 0, // No margin bottom - subtitle directly below
          lineHeight: 1.1 // Very tight line height
        }}
      >
        {showIcon && icon && (
          <Box component="span" sx={{ mr: 2, display: 'inline-flex', alignItems: 'center' }}>
            {icon}
          </Box>
        )}
        {title}
        {subtitle && (
          <>
            <br />
            <Typography 
              component="span"
              variant="body1" 
              color="text.secondary" 
              sx={{ 
                fontSize: '0.8rem', // Small subtitle
                fontWeight: 300, // Light weight
                lineHeight: 1.1, // Very tight line height
                display: 'block', // Force to next line
                mt: 0 // No top margin
              }}
            >
              {processSubtitle()}
            </Typography>
          </>
        )}
      </Typography>
    </Box>
  );
};

export default PageTitle;
