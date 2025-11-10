import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0', // Bind to all interfaces (IPv4 and IPv6)
    port: 3004,
    allowedHosts: [
      'localhost',
      '127.0.0.1',
      'associate-captain-countries-folks.trycloudflare.com',
      'response-undo-bobby-automotive.trycloudflare.com',
      '.trycloudflare.com' // Allow all trycloudflare.com subdomains
    ],
    proxy: {
      '/api': {
        target: 'http://localhost:8000', // Backend server on localhost
        changeOrigin: true,
        secure: false,
        // Add timeout and error handling
        timeout: 10000,
        configure: (proxy, options) => {
          proxy.on('error', (err, req, res) => {
            console.error('Proxy error:', err);
          });
          proxy.on('proxyReq', (proxyReq, req, res) => {
            console.log('Proxying request:', req.method, req.url, '->', options.target + req.url);
          });
        },
      },
      '/media': {
        target: 'http://localhost:8000', // Backend server on localhost
        changeOrigin: true,
        secure: false,
      }
    }
  }
})
