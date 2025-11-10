import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, TextField, Button } from '@mui/material';

const TestForm = ({ open, onClose }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: ''
  });

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Test Form - Focus Test</DialogTitle>
      <DialogContent>
        <TextField
          fullWidth
          name="firstName"
          label="First Name"
          value={formData.firstName}
          onChange={handleChange}
          margin="normal"
        />
        <TextField
          fullWidth
          name="lastName"
          label="Last Name"
          value={formData.lastName}
          onChange={handleChange}
          margin="normal"
        />
        <Button onClick={onClose} sx={{ mt: 2 }}>
          Close
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default TestForm;






