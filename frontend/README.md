--- 
title: "Documentation File" 
description: "Documentation file with automatic timestamp" 
date: "2025-11-14 10:28:50" 
modified: "2025-11-14 10:28:50" 
author: "Development Team" 
version: "1.0.0" 
category: "documentation" 
tags: [docs, timestamp] 
project: "Django POS System" 
path: "d:\Python\01practice\frontend\README.md" 
last_reviewed: "2025-11-14 10:28:50" 
review_status: "draft" 
--- 
 
--- 
title: "Documentation File" 
description: "Documentation file with automatic timestamp" 
date: "2025-11-14 10:12:37" 
modified: "2025-11-14 10:12:37" 
author: "Development Team" 
version: "1.0.0" 
category: "documentation" 
tags: [docs, timestamp] 
project: "Django POS System" 
path: "d:\Python\01practice\frontend\README.md" 
last_reviewed: "2025-11-14 10:12:37" 
review_status: "draft" 
--- 
 
# Flow Retail - Frontend

React frontend for the Flow Retail system built with Vite and Material-UI.

## Quick Start

1. **Install dependencies:**
```bash
npm install
```

2. **Create environment file:**
Create `.env` file in the frontend directory:
```env
VITE_API_BASE_URL=http://localhost:8000/api
```

3. **Start development server:**
```bash
npm run dev
```

Frontend will be available at http://localhost:3000

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Project Structure

```
frontend/
├── public/              # Static files
├── src/
│   ├── components/      # Reusable components
│   │   ├── common/      # Common components
│   │   ├── layout/      # Layout components
│   │   └── forms/       # Form components
│   ├── pages/           # Page components
│   │   ├── Auth/        # Authentication pages
│   │   ├── Dashboard/   # Dashboard
│   │   ├── POS/         # POS system (Phase 4)
│   │   ├── Products/    # Products (Phase 2)
│   │   ├── Categories/  # Categories (Phase 2)
│   │   ├── Customers/   # Customers (Phase 2)
│   │   ├── Suppliers/   # Suppliers (Phase 2)
│   │   ├── Inventory/   # Inventory (Phase 3)
│   │   ├── Sales/       # Sales (Phase 4)
│   │   └── Reports/     # Reports (Phase 5)
│   ├── services/        # API services
│   ├── store/           # Redux store
│   │   └── slices/      # Redux slices
│   ├── utils/           # Utility functions
│   ├── hooks/           # Custom hooks
│   ├── App.jsx          # Main App component
│   ├── main.jsx         # Entry point
│   └── index.css        # Global styles
├── package.json         # Dependencies
└── vite.config.js       # Vite configuration
```

## Features Implemented

### Phase 1 (Current)
- ✅ Authentication (Login/Register)
- ✅ Protected routes
- ✅ Layout with header and sidebar
- ✅ Dashboard
- ✅ Redux state management
- ✅ API service with JWT interceptors

### Coming Soon
- Phase 2: Master data interfaces
- Phase 3: Inventory management
- Phase 4: POS transaction system
- Phase 5: Reports and analytics

## Technologies Used

- **React 18** - UI framework
- **Vite** - Build tool
- **Material-UI** - Component library
- **Redux Toolkit** - State management
- **React Router** - Routing
- **Axios** - HTTP client
- **Recharts** - Charts (Phase 5)

## Environment Variables

```env
VITE_API_BASE_URL=http://localhost:8000/api
```

## Development Tips

### Adding a New Page

1. Create component in `src/pages/YourPage/YourPage.jsx`
2. Add route in `src/App.jsx`
3. Add menu item in `src/components/layout/Sidebar.jsx`

### Creating an API Service

1. Create service file in `src/services/yourService.js`
2. Import and use `api` from `src/services/api.js`

Example:
```javascript
import api from './api';

export const yourService = {
  async getAll() {
    const response = await api.get('/your-endpoint/');
    return response.data;
  },
};
```

### Adding Redux State

1. Create slice in `src/store/slices/yourSlice.js`
2. Add reducer to `src/store/index.js`

## Testing

```bash
npm test
```

## Building for Production

```bash
npm run build
```

Build output will be in the `dist/` directory.

## Troubleshooting

### Port 3000 already in use
```bash
# Kill process on port 3000
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:3000 | xargs kill -9
```

### Module not found
```bash
npm install
```

### API connection errors
- Ensure backend is running on http://localhost:8000
- Check VITE_API_BASE_URL in .env file
- Check CORS settings in backend

## Deployment

See main project README and IMPLEMENTATION_PLAN.md for deployment instructions.














