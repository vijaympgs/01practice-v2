import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  IconButton,
  Paper,
  Typography,
  TextField,
  InputAdornment,
  Fade,
  Slide,
  Avatar,
  Divider,
  Chip
} from '@mui/material';
import {
  Chat as ChatIcon,
  Send as SendIcon,
  Close as CloseIcon,
  SmartToy as BotIcon,
  Person as PersonIcon
} from '@mui/icons-material';

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hello! I'm your AI assistant. How may I help you with OptiMind Retail™ today?",
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (inputValue.trim() === '') return;

    const userMessage = {
      id: Date.now(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate bot response
    setTimeout(() => {
      const botResponse = {
        id: Date.now() + 1,
        text: getBotResponse(inputValue),
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const getBotResponse = (userInput) => {
    const input = userInput.toLowerCase();
    
    if (input.includes('help') || input.includes('assist')) {
      return "I can help you with:\n• Navigation and menu guidance\n• Feature explanations\n• System troubleshooting\n• Quick actions and shortcuts\n\nWhat would you like to know?";
    } else if (input.includes('sales') || input.includes('order')) {
      return "For sales and order management:\n• Navigate to 'Sales & Order Management'\n• Use 'Sales Order Entry' for new orders\n• Check 'Sales Order Analytics' for insights\n• Access 'Quick Sales Order' for fast transactions";
    } else if (input.includes('inventory') || input.includes('stock')) {
      return "For inventory management:\n• Go to 'Inventory' section\n• Use 'Inventory Control' for stock management\n• Check real-time stock levels\n• Set up reorder points and alerts";
    } else if (input.includes('customer') || input.includes('client')) {
      return "For customer management:\n• Access 'Customer' under Master Data\n• Use 'Quick Customer' for fast creation\n• View customer history and analytics\n• Manage loyalty programs";
    } else if (input.includes('vendor') || input.includes('supplier')) {
      return "For vendor management:\n• Navigate to 'Vendor' under Master Data\n• Use 'Quick Vendor' for new suppliers\n• Check vendor performance analytics\n• Manage procurement workflows";
    } else if (input.includes('report') || input.includes('analytics')) {
      return "For reports and analytics:\n• Access 'Reports & Analytics' section\n• View sales, inventory, and customer reports\n• Check real-time dashboards\n• Export data in multiple formats";
    } else if (input.includes('pos') || input.includes('terminal')) {
      return "For POS operations:\n• Go to 'In-Store Operations'\n• Process transactions and payments\n• Manage cash drawer\n• Print receipts and reports";
    } else {
      return "I'm here to help! You can ask me about:\n• Navigation and features\n• How to perform specific tasks\n• System functionality\n• Quick tips and shortcuts\n\nTry asking: 'How do I create a sales order?' or 'Show me inventory reports'";
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSendMessage();
    }
  };

  const quickActions = [
    { label: 'Sales Order', action: 'How do I create a sales order?' },
    { label: 'Inventory', action: 'Show me inventory levels' },
    { label: 'Customer', action: 'Add new customer' },
    { label: 'Reports', action: 'Generate sales report' }
  ];

  const handleQuickAction = (action) => {
    setInputValue(action);
    handleSendMessage();
  };

  return (
    <Box
      sx={{
        position: 'fixed',
        bottom: 68,
        right: 20,
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
        gap: 1
      }}
    >
      {/* Chat Window */}
      <Fade in={isOpen} timeout={300}>
        <Paper
          sx={{
            width: 350,
            height: 500,
            display: isOpen ? 'flex' : 'none',
            flexDirection: 'column',
            borderRadius: 3,
            boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
            overflow: 'hidden',
            backgroundColor: '#ffffff'
          }}
        >
          {/* Header */}
          <Box
            sx={{
              backgroundColor: '#1976d2',
              color: 'white',
              p: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Avatar sx={{ bgcolor: '#ffffff', color: '#1976d2', width: 32, height: 32 }}>
                <BotIcon fontSize="small" />
              </Avatar>
              <Box>
                <Typography variant="subtitle2" fontWeight="bold">
                  AI Assistant
                </Typography>
                <Typography variant="caption" sx={{ opacity: 0.8 }}>
                  OptiMind Retail™ Support
                </Typography>
              </Box>
            </Box>
            <IconButton
              size="small"
              onClick={() => setIsOpen(false)}
              sx={{ color: 'white' }}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </Box>

          {/* Messages */}
          <Box
            sx={{
              flex: 1,
              p: 2,
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
              backgroundColor: '#fafafa'
            }}
          >
            {messages.map((message) => (
              <Box
                key={message.id}
                sx={{
                  display: 'flex',
                  justifyContent: message.sender === 'user' ? 'flex-end' : 'flex-start',
                  alignItems: 'flex-start',
                  gap: 1
                }}
              >
                {message.sender === 'bot' && (
                  <Avatar sx={{ bgcolor: '#1976d2', width: 24, height: 24, mt: 0.5 }}>
                    <BotIcon sx={{ fontSize: 14 }} />
                  </Avatar>
                )}
                <Paper
                  sx={{
                    p: 1.5,
                    maxWidth: '80%',
                    backgroundColor: message.sender === 'user' ? '#1976d2' : '#ffffff',
                    color: message.sender === 'user' ? 'white' : 'text.primary',
                    borderRadius: 2,
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                  }}
                >
                  <Typography variant="body2" sx={{ whiteSpace: 'pre-line' }}>
                    {message.text}
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{
                      opacity: 0.7,
                      fontSize: '0.7rem',
                      mt: 0.5,
                      display: 'block'
                    }}
                  >
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </Typography>
                </Paper>
                {message.sender === 'user' && (
                  <Avatar sx={{ bgcolor: '#424242', width: 24, height: 24, mt: 0.5 }}>
                    <PersonIcon sx={{ fontSize: 14 }} />
                  </Avatar>
                )}
              </Box>
            ))}

            {isTyping && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Avatar sx={{ bgcolor: '#1976d2', width: 24, height: 24 }}>
                  <BotIcon sx={{ fontSize: 14 }} />
                </Avatar>
                <Paper sx={{ p: 1.5, backgroundColor: '#ffffff', borderRadius: 2 }}>
                  <Typography variant="body2" sx={{ opacity: 0.7 }}>
                    AI is typing...
                  </Typography>
                </Paper>
              </Box>
            )}
            <div ref={messagesEndRef} />
          </Box>

          {/* Quick Actions */}
          {messages.length === 1 && (
            <Box sx={{ p: 2, backgroundColor: '#ffffff' }}>
              <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
                Quick Actions:
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {quickActions.map((action, index) => (
                  <Chip
                    key={index}
                    label={action.label}
                    size="small"
                    variant="outlined"
                    onClick={() => handleQuickAction(action.action)}
                    sx={{
                      fontSize: '0.7rem',
                      height: 24,
                      '&:hover': {
                        backgroundColor: '#1976d2',
                        color: 'white'
                      }
                    }}
                  />
                ))}
              </Box>
            </Box>
          )}

          <Divider />

          {/* Input */}
          <Box sx={{ p: 2, backgroundColor: '#ffffff' }}>
            <TextField
              fullWidth
              placeholder="Type your message..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              size="small"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      size="small"
                      onClick={handleSendMessage}
                      disabled={!inputValue.trim()}
                      sx={{
                        color: '#1976d2',
                        '&:hover': { backgroundColor: 'rgba(25, 118, 210, 0.1)' }
                      }}
                    >
                      <SendIcon fontSize="small" />
                    </IconButton>
                  </InputAdornment>
                )
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 3,
                  backgroundColor: '#f5f5f5'
                }
              }}
            />
          </Box>
        </Paper>
      </Fade>

      {/* Chat Toggle Button */}
      <IconButton
        onClick={() => setIsOpen(!isOpen)}
        sx={{
          backgroundColor: '#1976d2',
          color: 'white',
          width: 56,
          height: 56,
          boxShadow: '0 4px 16px rgba(25, 118, 210, 0.4)',
          '&:hover': {
            backgroundColor: '#1565c0',
            transform: 'scale(1.05)',
            boxShadow: '0 6px 20px rgba(25, 118, 210, 0.6)'
          },
          transition: 'all 0.3s ease'
        }}
      >
        <ChatIcon />
      </IconButton>
    </Box>
  );
};

export default ChatBot;
