import React, { useState, useEffect } from 'react';
import PageTitle from '../../components/common/PageTitle';
import CardHeader from '../../components/common/CardHeader';
import {
  Box,
  Paper,
  Typography,
  Tabs,
  Tab,
  useTheme,
} from '@mui/material';
import {
  Security as SecurityIcon,
  Person as PersonIcon,
  Group as GroupIcon,
  Assignment as AssignmentIcon,
  Backup as BackupIcon,
} from '@mui/icons-material';
import RoleMasterTab from './RoleMasterTab';
import RoleProgramMappingTab from './RoleProgramMappingTab';
import GroupRoleMappingTab from './GroupRoleMappingTab';
import UserCreationTab from './UserCreationTab';
import BackupDBDialog from './BackupDBDialog';
import themeService from '../../services/themeService';

const SecurityPage = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [backupDialogOpen, setBackupDialogOpen] = useState(false);
  const theme = useTheme();

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      pb: 3
    }}>
      <PageTitle 
        title="Security Module" 
        subtitle="Manage roles, groups, users, and access control"
      />

      {/* Modern Tabs */}
      <Box sx={{ px: 3 }}>
        <Paper 
          sx={{ 
            mb: 3,
            borderRadius: 0,
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
            overflow: 'hidden'
          }}
        >
          <Tabs 
            value={activeTab} 
            onChange={handleTabChange} 
            variant="scrollable" 
            scrollButtons="auto"
            sx={{
              '& .MuiTab-root': {
                minHeight: 72,
                textTransform: 'none',
                fontSize: '0.95rem',
                fontWeight: 500,
                color: theme.palette.grey[600],
                '&:hover': {
                  color: theme.palette.primary.main,
                  backgroundColor: theme.palette.primary.light + '15',
                },
              },
              '& .Mui-selected': {
                color: theme.palette.primary.main,
                fontWeight: 600,
              },
              '& .MuiTabs-indicator': {
                height: 4,
                borderRadius: '4px 4px 0 0',
              },
            }}
          >
            <Tab icon={<PersonIcon />} iconPosition="start" label="Role Master" />
            <Tab icon={<AssignmentIcon />} iconPosition="start" label="Role Program Mapping" />
            <Tab icon={<GroupIcon />} iconPosition="start" label="Group-Role Mapping" />
            <Tab icon={<SecurityIcon />} iconPosition="start" label="User Creation" />
            <Tab icon={<BackupIcon />} iconPosition="start" label="Backup DB" onClick={() => setBackupDialogOpen(true)} />
          </Tabs>
        </Paper>
      </Box>

      {/* Tab Content */}
      <Box sx={{ px: 3 }}>
        {activeTab === 0 && <RoleMasterTab />}
        {activeTab === 1 && <RoleProgramMappingTab />}
        {activeTab === 2 && <GroupRoleMappingTab />}
        {activeTab === 3 && <UserCreationTab />}
      </Box>

      {/* Backup DB Dialog */}
      <BackupDBDialog 
        open={backupDialogOpen} 
        onClose={() => setBackupDialogOpen(false)} 
      />
    </Box>
  );
};

export default SecurityPage;

