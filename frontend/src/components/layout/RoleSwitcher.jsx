import React from 'react';
import {
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Avatar,
  Typography,
} from '@mui/material';
import { useUserRole } from '../../contexts/UserRoleContext';

const RoleSwitcher = () => {
  const { userRole, availableRoles, changeUserRole, getCurrentRole } = useUserRole();
  const currentRole = getCurrentRole();

  const handleRoleChange = (event) => {
    changeUserRole(event.target.value);
  };

  return (
    <Box sx={{ minWidth: 200 }}>
      <FormControl fullWidth size="small">
        <InputLabel>Role</InputLabel>
        <Select
          value={userRole}
          label="Role"
          onChange={handleRoleChange}
          renderValue={(selected) => {
            const role = availableRoles.find(r => r.id === selected);
            return (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Avatar sx={{ width: 24, height: 24, bgcolor: `${role?.color}.main` }}>
                  {role?.name.charAt(0)}
                </Avatar>
                <Typography variant="body2">
                  {role?.name}
                </Typography>
              </Box>
            );
          }}
        >
          {availableRoles.map((role) => (
            <MenuItem key={role.id} value={role.id}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
                <Avatar sx={{ width: 32, height: 32, bgcolor: `${role.color}.main` }}>
                  {role.name.charAt(0)}
                </Avatar>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="body1">{role.name}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    {role.description}
                  </Typography>
                </Box>
                <Chip 
                  label={role.color} 
                  size="small" 
                  color={role.color}
                  variant="outlined"
                />
              </Box>
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
};

export default RoleSwitcher;

