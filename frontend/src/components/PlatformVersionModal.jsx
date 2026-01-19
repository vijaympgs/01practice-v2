import React, { useEffect, useState } from 'react';
import { Dialog, DialogTitle, DialogContent, IconButton, Box, Typography, CircularProgress, Alert } from '@mui/material';
import { Close as CloseIcon, MenuBook as BookIcon } from '@mui/icons-material';
import ReactMarkdown from 'react-markdown';

const PlatformVersionModal = ({ open, onClose }) => {
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (open) {
            // Fetch the markdown file
            fetch('/PLATFORM_VERSION_INFO.md')
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Failed to load version information');
                    }
                    return response.text();
                })
                .then(text => {
                    setContent(text);
                    setLoading(false);
                })
                .catch(err => {
                    setError(err.message);
                    setLoading(false);
                });
        }
    }, [open]);

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="lg"
            fullWidth
            PaperProps={{
                sx: {
                    height: '90vh',
                    maxHeight: '90vh',
                }
            }}
        >
            {/* Header */}
            <DialogTitle
                sx={{
                    background: 'linear-gradient(135deg, #1976d2 0%, #0d47a1 100%)',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    py: 2,
                }}
            >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <BookIcon sx={{ fontSize: 28 }} />
                    <Box>
                        <Typography variant="h6" component="div" sx={{ fontWeight: 700, color: '#FFEB3B' }}>
                            Platform Version Information (Base Version)
                        </Typography>
                        <Typography variant="caption" sx={{ opacity: 0.9 }}>
                            Practice POS v1.0 - Comprehensive Overview
                        </Typography>
                        <Box sx={{ mt: 0.5 }}>
                            <Typography variant="caption" sx={{ display: 'block', opacity: 0.7, fontFamily: 'monospace', fontSize: '0.7rem' }}>
                                📦 Repo: vijaympgs/01practice-v2
                            </Typography>
                        </Box>
                    </Box>
                </Box>
                <IconButton
                    onClick={onClose}
                    sx={{
                        color: 'white',
                        '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' }
                    }}
                >
                    <CloseIcon />
                </IconButton>
            </DialogTitle>

            {/* Content */}
            <DialogContent
                sx={{
                    bgcolor: '#f5f5f5',
                    p: 0,
                    overflow: 'auto',
                }}
            >
                <Box sx={{ maxWidth: 1000, mx: 'auto', p: 4 }}>
                    {loading && (
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 300 }}>
                            <CircularProgress size={48} />
                            <Typography sx={{ mt: 2, color: 'text.secondary' }}>
                                Loading version information...
                            </Typography>
                        </Box>
                    )}

                    {error && (
                        <Alert severity="error" sx={{ mb: 2 }}>
                            Error: {error}
                        </Alert>
                    )}

                    {!loading && !error && (
                        <Box
                            sx={{
                                '& h1': {
                                    fontSize: '2rem',
                                    fontWeight: 700,
                                    color: '#1976d2',
                                    borderBottom: '2px solid #e3f2fd',
                                    pb: 1,
                                    mb: 2,
                                },
                                '& h2': {
                                    fontSize: '1.5rem',
                                    fontWeight: 600,
                                    color: '#424242',
                                    mt: 4,
                                    mb: 2,
                                },
                                '& h3': {
                                    fontSize: '1.25rem',
                                    fontWeight: 600,
                                    color: '#616161',
                                    mt: 3,
                                    mb: 1.5,
                                },
                                '& p': {
                                    color: '#616161',
                                    lineHeight: 1.7,
                                    mb: 1.5,
                                },
                                '& a': {
                                    color: '#1976d2',
                                    textDecoration: 'none',
                                    '&:hover': {
                                        textDecoration: 'underline',
                                    },
                                },
                                '& code': {
                                    bgcolor: '#e3f2fd',
                                    color: '#1976d2',
                                    px: 0.5,
                                    py: 0.25,
                                    borderRadius: 0.5,
                                    fontFamily: 'monospace',
                                    fontSize: '0.9em',
                                },
                                '& pre': {
                                    bgcolor: '#263238',
                                    color: '#aed581',
                                    p: 2,
                                    borderRadius: 1,
                                    overflow: 'auto',
                                    '& code': {
                                        bgcolor: 'transparent',
                                        color: 'inherit',
                                        p: 0,
                                    },
                                },
                                '& table': {
                                    width: '100%',
                                    borderCollapse: 'collapse',
                                    my: 2,
                                    '& th': {
                                        bgcolor: '#e3f2fd',
                                        color: '#1976d2',
                                        fontWeight: 600,
                                        p: 1.5,
                                        textAlign: 'left',
                                        borderBottom: '2px solid #90caf9',
                                    },
                                    '& td': {
                                        p: 1.5,
                                        borderBottom: '1px solid #e0e0e0',
                                    },
                                },
                                '& ul, & ol': {
                                    pl: 3,
                                    mb: 2,
                                },
                                '& li': {
                                    mb: 0.5,
                                    color: '#616161',
                                },
                                '& strong': {
                                    color: '#212121',
                                    fontWeight: 600,
                                },
                                '& hr': {
                                    border: 'none',
                                    borderTop: '1px solid #e0e0e0',
                                    my: 3,
                                },
                            }}
                        >
                            <ReactMarkdown>{content}</ReactMarkdown>
                        </Box>
                    )}
                </Box>
            </DialogContent>

            {/* Footer */}
            <Box
                sx={{
                    px: 3,
                    py: 1.5,
                    bgcolor: '#f5f5f5',
                    borderTop: '1px solid #e0e0e0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                }}
            >
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                    Press <Box component="kbd" sx={{ px: 1, py: 0.5, bgcolor: 'white', border: '1px solid #ccc', borderRadius: 0.5, fontFamily: 'monospace', fontSize: '0.75rem' }}>Ctrl</Box> + <Box component="kbd" sx={{ px: 1, py: 0.5, bgcolor: 'white', border: '1px solid #ccc', borderRadius: 0.5, fontFamily: 'monospace', fontSize: '0.75rem' }}>L</Box> to toggle this window
                </Typography>
                <IconButton
                    onClick={onClose}
                    size="small"
                    sx={{
                        bgcolor: '#1976d2',
                        color: 'white',
                        px: 2,
                        borderRadius: 1,
                        '&:hover': { bgcolor: '#1565c0' },
                    }}
                >
                    <Typography variant="button" sx={{ fontSize: '0.75rem', fontWeight: 600 }}>
                        Close
                    </Typography>
                </IconButton>
            </Box>
        </Dialog>
    );
};

export default PlatformVersionModal;
