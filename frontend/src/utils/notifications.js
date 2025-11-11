/**
 * Global Notification Utilities
 * 
 * This file provides easy access to notification functions across the application.
 * Use these functions instead of alert() or console.error() for user-facing messages.
 * 
 * Usage in any component:
 * import { displayError, displaySuccess } from '../utils/notifications';
 * 
 * Example:
 *   displayError('Something went wrong', ['Field 1 is required', 'Field 2 is invalid']);
 *   displaySuccess('Operation completed successfully');
 * 
 * Note: Components must be within NotificationProvider (already set up in App.jsx)
 */

/**
 * Display an error notification
 * @param {string} message - Main error message
 * @param {Array<string>} items - Optional list of error items/details
 */
export const displayError = (message, items = []) => {
  // This will be dynamically set by components that use the hook
  // Components should use useNotification() hook directly
  console.warn('displayError called without useNotification hook. Use useNotification() hook in your component instead.');
  console.error('Error:', message, items);
};

/**
 * Display a success notification
 * @param {string} message - Success message
 */
export const displaySuccess = (message) => {
  // This will be dynamically set by components that use the hook
  // Components should use useNotification() hook directly
  console.warn('displaySuccess called without useNotification hook. Use useNotification() hook in your component instead.');
  console.log('Success:', message);
};

/**
 * Helper to extract error details from API error responses
 * Returns formatted error message and items array
 */
export const formatErrorResponse = (error) => {
  const errorData = error.response?.data;
  let errorMessage = 'An error occurred';
  let errorItems = [];
  
  if (errorData) {
    if (typeof errorData === 'string') {
      errorMessage = errorData;
    } else if (errorData.error) {
      errorMessage = errorData.error;
    } else if (errorData.detail) {
      errorMessage = errorData.detail;
    } else if (errorData.non_field_errors) {
      errorMessage = errorData.non_field_errors[0] || errorMessage;
    } else {
      // Extract field errors in format: "Field Name -> Error Message"
      Object.keys(errorData).forEach(field => {
        const fieldErrors = Array.isArray(errorData[field]) 
          ? errorData[field] 
          : [errorData[field]];
        fieldErrors.forEach(err => {
          // Format as "Section -> Field: Error"
          const formattedField = field.split('_').map(w => 
            w.charAt(0).toUpperCase() + w.slice(1)
          ).join(' ');
          errorItems.push(`${formattedField}: ${err}`);
        });
      });
      if (errorItems.length === 0) {
        errorMessage = error.message || errorMessage;
      } else {
        errorMessage = 'The following fields are either incomplete or invalid:';
      }
    }
  } else {
    errorMessage = error.message || errorMessage;
  }
  
  return { errorMessage, errorItems };
};

export default {
  displayError,
  displaySuccess,
  formatErrorResponse,
};

