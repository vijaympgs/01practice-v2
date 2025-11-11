import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Stack,
  Button,
  Chip,
  Divider,
  Tooltip,
} from '@mui/material';
import LaunchIcon from '@mui/icons-material/Launch';

import { getMenuCategories } from '../../utils/menuStructure';

const sanitizeCategoryItems = (category) => {
  const items = [];
  const seenPaths = new Set();

  const pushItem = (item) => {
    if (!item || !item.path) {
      return;
    }
    if (item.hidden) {
      return;
    }
    if (seenPaths.has(item.path)) {
      return;
    }
    seenPaths.add(item.path);
    items.push({
      text: item.text || category.title,
      description: item.description,
      moduleName: item.moduleName,
      path: item.path,
    });
  };

  if (category.path) {
    pushItem({
      text: category.title,
      path: category.path,
      moduleName: category.type?.toLowerCase(),
    });
  }

  (category.items || []).forEach((item) => pushItem(item));

  return items;
};

const WireframeIndex = () => {
  const categories = useMemo(() => {
    try {
      return getMenuCategories({});
    } catch (error) {
      console.error('WireframeIndex: failed to load menu categories', error);
      return [];
    }
  }, []);

  const visibleCategories = useMemo(
    () =>
      categories
        .filter((category) => category && !category.hidden)
        .map((category) => ({
          ...category,
          items: sanitizeCategoryItems(category),
        }))
        .filter((category) => category.items.length > 0),
    [categories]
  );

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h3" gutterBottom>
        Wireframe Launchpad
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" sx={{ maxWidth: 720 }}>
        Use this launchpad to jump directly into any available wireframe. Screens are grouped by the
        same categories used in the main navigation. Ideal for quick reviews, demos, and QA runs.
      </Typography>

      <Divider sx={{ my: 3 }} />

      <Grid container spacing={3}>
        {visibleCategories.map((category) => (
          <Grid item xs={12} md={6} key={category.type || category.title}>
            <Card variant="outlined" sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardContent sx={{ flexGrow: 1 }}>
                <Stack direction="row" spacing={1} alignItems="center" mb={1}>
                  <Typography variant="h5" color={category.color || 'primary'}>
                    {category.title}
                  </Typography>
                  {category.type && (
                    <Chip
                      label={category.type.replace(/_/g, ' ')}
                      size="small"
                      sx={{ textTransform: 'capitalize' }}
                    />
                  )}
                </Stack>
                {category.description && (
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {category.description}
                  </Typography>
                )}

                <Stack spacing={1.5}>
                  {category.items.map((item) => (
                    <Tooltip
                      key={item.path}
                      title={item.moduleName ? `Module: ${item.moduleName}` : ''}
                      placement="top"
                      arrow
                    >
                      <Button
                        component={Link}
                        to={item.path}
                        variant="outlined"
                        endIcon={<LaunchIcon fontSize="small" />}
                        sx={{
                          justifyContent: 'space-between',
                          textTransform: 'none',
                        }}
                      >
                        <Box sx={{ textAlign: 'left' }}>
                          <Typography variant="subtitle1">{item.text}</Typography>
                          {item.description && (
                            <Typography variant="caption" color="text.secondary">
                              {item.description}
                            </Typography>
                          )}
                        </Box>
                      </Button>
                    </Tooltip>
                  ))}
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default WireframeIndex;

