import { Box, CssBaseline, Toolbar, AppBar } from '@mui/material';
import { Outlet } from 'react-router-dom';
import SimplifiedSidebar from './layout/SimplifiedSidebar';

const DRAWER_WIDTH = 280;

const SimpleLayout = () => {
  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <SimplifiedSidebar />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          marginLeft: `${DRAWER_WIDTH}px`,
          minHeight: '100vh',
          backgroundColor: '#f5f5f5',
        }}
      >
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
};

export default SimpleLayout;
