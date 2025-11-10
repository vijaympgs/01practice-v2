import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  TextField,
  Box,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  Save as SaveIcon,
  Cancel as CancelIcon,
} from '@mui/icons-material';

const BackupDBDialog = ({ open, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const handleBackup = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Mock backup process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setSuccess(true);
      setLoading(false);
      
      // Close dialog after 2 seconds
      setTimeout(() => {
        handleClose();
      }, 2000);
      
    } catch (error) {
      setError('Failed to backup database: ' + error.message);
      setLoading(false);
    }
  };

  const handleClose = () => {
    setSuccess(false);
    setError(null);
    onClose();
  };

  return (
    <Dialog 
      open={open} 
      onClose={handleClose} 
      maxWidth="sm" 
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
        }
      }}
    >
      <DialogTitle
        sx={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          py: 2,
          px: 3,
          fontWeight: 600,
        }}
      >
        Database Backup
      </DialogTitle>
      <DialogContent sx={{ py: 3, px: 3 }}>
        {success ? (
          <Alert severity="success" sx={{ borderRadius: 2 }}>
            Database backup completed successfully!
          </Alert>
        ) : error ? (
          <Alert severity="error" sx={{ borderRadius: 2 }}>{error}</Alert>
        ) : (
          <>
            <Typography variant="body1" gutterBottom sx={{ fontWeight: 500 }}>
              This will create a duplicate copy of the database for future reference.
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
              Are you sure you want to proceed with the backup?
            </Typography>
            {loading && (
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 3, p: 2, backgroundColor: 'grey.50', borderRadius: 2 }}>
                <CircularProgress size={24} sx={{ mr: 2 }} />
                <Typography sx={{ fontWeight: 500 }}>Backing up database...</Typography>
              </Box>
            )}
          </>
        )}
      </DialogContent>
      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button 
          onClick={handleClose} 
          disabled={loading || success}
          sx={{ borderRadius: 2, px: 3 }}
        >
          Close
        </Button>
        {!success && (
          <Button
            variant="contained"
            startIcon={loading ? <CircularProgress size={20} /> : <SaveIcon />}
            onClick={handleBackup}
            disabled={loading}
            sx={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              borderRadius: 2,
              px: 3,
              '&:hover': {
                boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
              },
            }}
          >
            Backup DB
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default BackupDBDialog;

