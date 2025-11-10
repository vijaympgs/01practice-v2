import React, { useState } from 'react';
import {
  Box,
  Button,
  Grid,
  Typography,
  Paper
} from '@mui/material';
import {
  Backspace as BackspaceIcon,
  Clear as ClearIcon
} from '@mui/icons-material';

const NumericKeypad = ({ onValueChange, onEnter }) => {
  const [inputValue, setInputValue] = useState('');

  const handleNumberClick = (number) => {
    const newValue = inputValue + number;
    setInputValue(newValue);
    onValueChange?.(newValue);
  };

  const handleBackspace = () => {
    const newValue = inputValue.slice(0, -1);
    setInputValue(newValue);
    onValueChange?.(newValue);
  };

  const handleClear = () => {
    setInputValue('');
    onValueChange?.('');
  };

  const handleEnter = () => {
    onEnter?.(inputValue);
    setInputValue('');
  };

  const keypadButtons = [
    { label: '1', value: '1', color: 'default' },
    { label: '2', value: '2', color: 'default' },
    { label: '3', value: '3', color: 'default' },
    { label: '4', value: '4', color: 'default' },
    { label: '5', value: '5', color: 'default' },
    { label: '6', value: '6', color: 'default' },
    { label: '7', value: '7', color: 'default' },
    { label: '8', value: '8', color: 'default' },
    { label: '9', value: '9', color: 'default' },
    { label: '00', value: '00', color: 'default' },
    { label: '0', value: '0', color: 'default' },
    { label: '.', value: '.', color: 'default' }
  ];

  return (
    <Paper sx={{ p: 2, bgcolor: '#e3f2fd' }}>
      <Typography variant="h6" gutterBottom sx={{ textAlign: 'center' }}>
        Numeric Keypad
      </Typography>
      
      {/* Display */}
      <Box sx={{ 
        mb: 2, 
        p: 2, 
        bgcolor: 'white', 
        borderRadius: 1, 
        border: '1px solid #e0e0e0',
        minHeight: 40,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <Typography variant="h6" color="primary">
          {inputValue || '0.00'}
        </Typography>
      </Box>

      {/* Keypad Grid */}
      <Grid container spacing={1}>
        {keypadButtons.map((button) => (
          <Grid item xs={4} key={button.value}>
            <Button
              fullWidth
              variant="contained"
              color={button.color}
              onClick={() => handleNumberClick(button.value)}
              sx={{
                height: 50,
                fontSize: '1.2rem',
                fontWeight: 'bold',
                bgcolor: 'white',
                color: 'text.primary',
                border: '1px solid #e0e0e0',
                '&:hover': {
                  bgcolor: 'primary.main',
                  color: 'white'
                }
              }}
            >
              {button.label}
            </Button>
          </Grid>
        ))}
        
        {/* Action Buttons */}
        <Grid item xs={4}>
          <Button
            fullWidth
            variant="contained"
            color="error"
            onClick={handleBackspace}
            sx={{
              height: 50,
              fontSize: '1rem'
            }}
          >
            <BackspaceIcon />
          </Button>
        </Grid>
        
        <Grid item xs={4}>
          <Button
            fullWidth
            variant="contained"
            color="warning"
            onClick={handleClear}
            sx={{
              height: 50,
              fontSize: '1rem'
            }}
          >
            <ClearIcon />
          </Button>
        </Grid>
        
        <Grid item xs={4}>
          <Button
            fullWidth
            variant="contained"
            color="success"
            onClick={handleEnter}
            sx={{
              height: 50,
              fontSize: '1rem',
              fontWeight: 'bold'
            }}
          >
            ENTER
          </Button>
        </Grid>
      </Grid>

      {/* Quick Actions */}
      <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
        <Button
          variant="outlined"
          size="small"
          onClick={() => handleNumberClick('1.00')}
          sx={{ flexGrow: 1 }}
        >
          Qty: 1
        </Button>
        <Button
          variant="outlined"
          size="small"
          onClick={() => handleNumberClick('2.00')}
          sx={{ flexGrow: 1 }}
        >
          Qty: 2
        </Button>
        <Button
          variant="outlined"
          size="small"
          onClick={() => handleNumberClick('5.00')}
          sx={{ flexGrow: 1 }}
        >
          Qty: 5
        </Button>
      </Box>
    </Paper>
  );
};

export default NumericKeypad;
