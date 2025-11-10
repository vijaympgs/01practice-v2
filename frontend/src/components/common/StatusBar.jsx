import React from 'react';
import { Box, Typography, LinearProgress, Divider, Chip, Tooltip } from '@mui/material';
import { Wifi, WifiOff, Sync, SyncProblem } from '@mui/icons-material';

/**
 * Status Bar Component
 * Displays status information in 4 sections with medium grey background and thin dark grey border
 * 
 * @param {Object} props
 * @param {string} props.message - Status message to display (Section 1)
 * @param {boolean} props.loading - Whether to show loading indicator
 * @param {string} props.type - 'info', 'success', 'warning', 'error' (optional)
 * @param {string} props.themeColor - Theme color for styling (optional)
 * @param {string} props.userInfo - User information (Section 2, optional)
 * @param {boolean} props.isOnline - Online/Offline status (optional)
 * @param {string} props.syncStatus - Sync status: 'synced', 'syncing', 'error' (optional)
 */
const StatusBar = ({ 
  message, 
  loading = false,
  type = 'info',
  themeColor = '#1976d2',
  userInfo,
  systemInfo,
  isOnline = true,
  syncStatus = 'synced'
}) => {
  const getSyncIcon = () => {
    switch (syncStatus) {
      case 'syncing':
        return <Sync sx={{ animation: 'spin 1s linear infinite' }} />;
      case 'error':
        return <SyncProblem />;
      default:
        return <Sync />;
    }
  };

  const getSyncColor = () => {
    switch (syncStatus) {
      case 'syncing':
        return 'info';
      case 'error':
        return 'error';
      default:
        return 'success';
    }
  };
  // Always render StatusBar as footer with 4 sections
  return (
    <Box
      sx={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 1300, // Above most content, below modals
        backgroundColor: '#d3d3d3', // Light grey background
        border: '1px solid #616161', // Thin dark grey border
        borderTop: '1px solid #616161', // Ensure top border is also thin dark grey
        px: 1.5,
        py: 0.25,
        minHeight: '32px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 1,
      }}
    >
      {/* Section 1: Status Message */}
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          minWidth: 0, // Allow text truncation
        }}
      >
        {loading && (
          <LinearProgress
            sx={{
              height: 2,
              borderRadius: 2,
              mr: 1,
              width: 80,
              backgroundColor: 'rgba(0,0,0,0.1)',
              '& .MuiLinearProgress-bar': {
                backgroundColor: themeColor,
              },
            }}
          />
        )}
        <Typography
          variant="body2"
          sx={{
            color: '#212121',
            fontWeight: 400,
            fontSize: '0.8125rem',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {message || 'Ready'}
        </Typography>
      </Box>

      {/* Thick 3D Divider */}
      <Box
        sx={{
          width: '3px',
          height: '65%',
          mx: 1,
          background: 'linear-gradient(to right, #888888 0%, #666666 50%, #444444 100%)',
          borderLeft: '1px solid #aaa',
          borderRight: '1px solid #333',
          boxShadow: 'inset -1px 0 1px rgba(255,255,255,0.3), inset 1px 0 1px rgba(0,0,0,0.5)',
        }}
      />

      {/* Section 2: User Info */}
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minWidth: 0,
        }}
      >
        <Typography
          variant="body2"
          sx={{
            color: '#212121',
            fontWeight: 400,
            fontSize: '0.8125rem',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {userInfo || 'User: --'}
        </Typography>
      </Box>

      {/* Thick 3D Divider */}
      <Box
        sx={{
          width: '3px',
          height: '65%',
          mx: 1,
          background: 'linear-gradient(to right, #888888 0%, #666666 50%, #444444 100%)',
          borderLeft: '1px solid #aaa',
          borderRight: '1px solid #333',
          boxShadow: 'inset -1px 0 1px rgba(255,255,255,0.3), inset 1px 0 1px rgba(0,0,0,0.5)',
        }}
      />

      {/* Section 3: Empty (reserved for future use) */}
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minWidth: 0,
        }}
      >
      </Box>

      {/* Thick 3D Divider */}
      <Box
        sx={{
          width: '3px',
          height: '65%',
          mx: 1,
          background: 'linear-gradient(to right, #888888 0%, #666666 50%, #444444 100%)',
          borderLeft: '1px solid #aaa',
          borderRight: '1px solid #333',
          boxShadow: 'inset -1px 0 1px rgba(255,255,255,0.3), inset 1px 0 1px rgba(0,0,0,0.5)',
        }}
      />

      {/* Section 4: Connection Info with Online/Sync Chips */}
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
          gap: 1,
          minWidth: 0,
        }}
      >
        {/* Online Status Chip */}
        <Tooltip title={isOnline ? 'Online' : 'Offline'}>
          <Chip
            icon={isOnline ? <Wifi /> : <WifiOff />}
            label={isOnline ? 'Online' : 'Offline'}
            size="small"
            color={isOnline ? 'success' : 'error'}
            sx={{ 
              fontSize: '0.7rem',
              height: '24px',
              '& .MuiChip-icon': { fontSize: '0.9rem' }
            }}
          />
        </Tooltip>

        {/* Sync Status Chip */}
        <Tooltip title={`Sync Status: ${syncStatus}`}>
          <Chip
            icon={getSyncIcon()}
            label={syncStatus === 'syncing' ? 'Syncing...' : 'Synced'}
            size="small"
            color={getSyncColor()}
            sx={{ 
              fontSize: '0.7rem',
              height: '24px',
              '& .MuiChip-icon': { fontSize: '0.9rem' }
            }}
          />
        </Tooltip>
      </Box>
    </Box>
  );
};

export default StatusBar;

