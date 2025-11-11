import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import ErrorBoundary from './components/ErrorBoundary'

// Add error handling for root mounting
console.log('main.jsx: Starting React app initialization...');
const rootElement = document.getElementById('root');
if (!rootElement) {
  console.error('ERROR: Root element not found! Make sure index.html has a <div id="root"></div>');
  // Provide a visible error message if root element is missing
  document.body.innerHTML = '<div style="padding: 20px; color: red;"><h1>Error: Root element not found!</h1><p>Make sure index.html has a &lt;div id="root"&gt;&lt;/div&gt;</p></div>';
} else {
  console.log('main.jsx: Root element found, rendering App...');
  try {
    ReactDOM.createRoot(rootElement).render(
      <React.StrictMode>
        <ErrorBoundary>
          <App />
        </ErrorBoundary>
      </React.StrictMode>
    );
    console.log('main.jsx: App rendered successfully!');
  } catch (error) {
    console.error('ERROR in main.jsx render:', error);
    // Display render error on the page
    rootElement.innerHTML = `<div style="padding: 20px; color: red;"><h1>Render Error</h1><p>${error.message}</p><pre>${error.stack}</pre></div>`;
  }
}












