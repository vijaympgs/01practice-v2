import React from 'react';
import { Box, Typography, Paper, Stack, Grid, Divider, Chip } from '@mui/material';
import { useTheme } from '@mui/material/styles';

const mockCampaigns = [
  { name: 'Festive Flash Sale', status: 'Scheduled', channel: 'Email', launchDate: '18 Nov 2025' },
  { name: 'Weekend UPI Cashback', status: 'Live', channel: 'Push Notification', launchDate: 'Today' },
  { name: 'Abandoned Cart Reminder', status: 'Paused', channel: 'SMS', launchDate: 'Rolling' },
];

const mockMetrics = [
  { label: 'Active Campaigns', value: '7', accent: '#2563eb' },
  { label: 'Total Reach (30d)', value: '1.2M', accent: '#7c3aed' },
  { label: 'Avg. CTR', value: '4.6%', accent: '#059669' },
  { label: 'Conversions', value: '18,420', accent: '#f59e0b' },
];

const DigitalMarketingConsole = () => {
  const theme = useTheme();

  return (
    <Box sx={{ px: { xs: 1.5, md: 3 }, py: { xs: 2, md: 3 }, display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Stack spacing={0.75}>
        <Typography variant="h5" sx={{ fontWeight: 600 }}>
          Digital Marketing Console
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Monitor omnichannel campaigns, track performance, and sync promotional content for upcoming releases.
          This is a staging dashboard, ideal for reviewing placement ideas before wiring live data.
        </Typography>
      </Stack>

      <Grid container spacing={2.5}>
        {mockMetrics.map((metric) => (
          <Grid item xs={12} sm={6} md={3} key={metric.label}>
            <Paper
              variant="outlined"
              sx={{
                p: 2,
                borderRadius: 1,
                bgcolor: theme.palette.background.paper,
                borderTop: `3px solid ${metric.accent}`,
              }}
            >
              <Typography variant="caption" color="text.secondary" sx={{ letterSpacing: 0.4, textTransform: 'uppercase' }}>
                {metric.label}
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 600, mt: 1 }}>
                {metric.value}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>

      <Paper variant="outlined" sx={{ borderRadius: 1 }}>
        <Box sx={{ p: 2.5 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
              Campaign Pipeline
            </Typography>
            <Chip label="Sandbox Data" size="small" color="primary" variant="outlined" />
          </Stack>
          <Divider sx={{ my: 2 }} />

          <Grid container spacing={2}>
            {mockCampaigns.map((campaign) => (
              <Grid item xs={12} md={4} key={campaign.name}>
                <Paper
                  variant="outlined"
                  sx={{
                    p: 2,
                    borderRadius: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 1.5,
                    height: '100%',
                  }}
                >
                  <Stack spacing={0.5}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                      {campaign.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Channel: {campaign.channel}
                    </Typography>
                  </Stack>
                  <Stack direction="row" spacing={1} alignItems="center" justifyContent="space-between" sx={{ mt: 'auto' }}>
                    <Chip
                      label={campaign.status}
                      size="small"
                      color={campaign.status === 'Live' ? 'success' : campaign.status === 'Scheduled' ? 'primary' : 'warning'}
                      variant={campaign.status === 'Paused' ? 'outlined' : 'filled'}
                    />
                    <Typography variant="caption" color="text.secondary">
                      Launch: {campaign.launchDate}
                    </Typography>
                  </Stack>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Paper>

      <Paper variant="outlined" sx={{ borderRadius: 1 }}>
        <Box sx={{ p: 2.5, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
            Next Actions
          </Typography>
          <Typography variant="body2" color="text.secondary">
            • Connect CRM segments to auto-populate audiences<br />
            • Define approval workflow for promotional creatives<br />
            • Schedule “Store Anniversary” omnichannel campaign for 02 Dec 2025
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
};

export default DigitalMarketingConsole;

