import React, { useState, useEffect, useMemo } from 'react';
import {
  Box,
  Typography,
  Paper,
  Stack,
  TextField,
  Button,
  IconButton,
  Alert,
  CircularProgress,
  InputAdornment,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import LaunchIcon from '@mui/icons-material/Launch';
import RefreshIcon from '@mui/icons-material/Refresh';
import SearchIcon from '@mui/icons-material/Search';

const DEFAULT_URL = 'https://www.cursor.com/community';

const normalizeUrl = (value) => {
  if (!value) return DEFAULT_URL;
  const trimmed = value.trim();
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    return trimmed;
  }
  if (trimmed.startsWith('localhost') || trimmed.startsWith('127.0.0.1') || trimmed.startsWith('0.0.0.0')) {
    return `http://${trimmed}`;
  }
  if (trimmed.includes('.') && !trimmed.includes(' ')) {
    return `https://${trimmed}`;
  }
  // Treat as a search query
  const encoded = encodeURIComponent(trimmed);
  return `https://www.google.com/search?q=${encoded}`;
};

const WebConsole = () => {
  const theme = useTheme();
  const [addressInput, setAddressInput] = useState(DEFAULT_URL);
  const [currentUrl, setCurrentUrl] = useState(DEFAULT_URL);
  const [loading, setLoading] = useState(false);
  const [iframeError, setIframeError] = useState('');
  const [iframeKey, setIframeKey] = useState(0);
  const [proxySrc, setProxySrc] = useState(DEFAULT_URL);
  const [isUsingProxy, setIsUsingProxy] = useState(false);
  const allowList = useMemo(
    () => [
      'www.google.com',
      'google.com',
      'cursor.com',
      'www.cursor.com',
      'sites.google.com',
      'localhost',
      '127.0.0.1',
      '0.0.0.0',
    ],
    []
  );

  useEffect(() => {
    if (!currentUrl) return undefined;

    setLoading(true);
    setIframeError('');
    const timer = setTimeout(() => {
      if (loading) {
        setIframeError('The site may be blocking embedded views. Try opening in a new tab.');
        setLoading(false);
      }
    }, 5000);

    return () => clearTimeout(timer);
  }, [currentUrl]);

  useEffect(() => {
    try {
      const parsed = new URL(currentUrl);
      const hostname = parsed.hostname?.toLowerCase() || '';
      const shouldProxy = allowList.some((allowed) => hostname === allowed || hostname.endsWith(`.${allowed}`));
      setIsUsingProxy(shouldProxy);
      if (shouldProxy) {
        setProxySrc(`/api/utils/web-proxy/?target=${encodeURIComponent(parsed.href)}`);
      } else {
        setProxySrc(parsed.href);
      }
    } catch (error) {
      setIsUsingProxy(false);
      setProxySrc(currentUrl);
    }
  }, [currentUrl, allowList]);

  const handleNavigate = (event) => {
    event.preventDefault();
    const normalized = normalizeUrl(addressInput);
    setCurrentUrl(normalized);
    setIframeKey((prev) => prev + 1);
  };

  const handleRefresh = () => {
    setLoading(true);
    setIframeError('');
    setIframeKey((key) => key + 1);
  };

  const handleOpenExternal = () => {
    if (currentUrl) {
      window.open(currentUrl, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <Box sx={{ px: { xs: 1.5, md: 3 }, py: { xs: 2, md: 3 }, display: 'flex', flexDirection: 'column', gap: 2.5, height: '100%' }}>
      <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', md: 'center' }} spacing={1.5}>
        <Stack spacing={0.5}>
          <Typography variant="h5" sx={{ fontWeight: 600 }}>
            Web Console
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Browse internal docs or external sites inside an embedded frame. Enter a URL or search term below to load the page. Some
            websites may restrict embedded views; use the open-in-tab button when needed.
          </Typography>
        </Stack>
        <Button variant="outlined" startIcon={<LaunchIcon />} onClick={handleOpenExternal} disabled={!currentUrl}>
          Open Current in New Tab
        </Button>
      </Stack>

      <Paper variant="outlined" sx={{ borderRadius: 2, px: { xs: 1.5, md: 2 }, py: { xs: 1.5, md: 2 }, boxShadow: '0 12px 32px rgba(15, 23, 42, 0.08)' }}>
        <Box component="form" onSubmit={handleNavigate} sx={{ display: 'flex', gap: 1 }}>
          <TextField
            fullWidth
            value={addressInput}
            onChange={(event) => setAddressInput(event.target.value)}
            placeholder="Type URL or search (e.g., cursor.com, POS settlement workflow)"
            size="small"
            InputProps={{
              sx: { borderRadius: 999, backgroundColor: theme.palette.background.paper },
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" />
                </InputAdornment>
              ),
            }}
          />
          <Button type="submit" variant="contained" sx={{ borderRadius: 999 }}>
            Go
          </Button>
          <IconButton onClick={handleRefresh} size="small" sx={{ border: '1px solid', borderColor: theme.palette.divider }}>
            <RefreshIcon fontSize="small" />
          </IconButton>
        </Box>
      </Paper>

      <Paper
        variant="outlined"
        sx={{
          position: 'relative',
          flex: 1,
          borderRadius: 2,
          overflow: 'hidden',
          minHeight: 480,
          boxShadow: '0 16px 40px rgba(15, 23, 42, 0.08)',
          display: 'flex',
        }}
      >
        {loading && !iframeError && (
          <Box
            sx={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 2,
              background: 'rgba(245, 247, 250, 0.65)',
            }}
          >
            <Stack spacing={1} alignItems="center">
              <CircularProgress size={28} />
              <Typography variant="body2" color="text.secondary">
                Loading {isUsingProxy ? proxySrc : currentUrl}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {isUsingProxy ? 'Via secure proxy' : 'Direct load'}
              </Typography>
            </Stack>
          </Box>
        )}

        {iframeError && (
          <Box
            sx={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 2,
              background: 'rgba(245, 247, 250, 0.9)',
              px: 2,
            }}
          >
            <Alert
              severity="warning"
              action={
                <Button color="primary" size="small" startIcon={<LaunchIcon />} onClick={handleOpenExternal}>
                  Open in Tab
                </Button>
              }
              sx={{ maxWidth: 520 }}
            >
              {iframeError}
            </Alert>
          </Box>
        )}

        <Box
          component="iframe"
          key={iframeKey}
          src={proxySrc}
          title="Web Console"
          onLoad={() => setLoading(false)}
          onError={() => {
            setIframeError('Unable to load this site in the embedded view.');
            setLoading(false);
          }}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          sandbox="allow-same-origin allow-forms allow-scripts allow-popups"
          style={{ border: 'none', flex: 1 }}
        />
      </Paper>
    </Box>
  );
};

export default WebConsole;
