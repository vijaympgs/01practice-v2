import { useEffect } from 'react';

/**
 * Custom hook for POS keyboard shortcuts
 * Implements industry-standard shortcuts for fast operation
 */
const useKeyboardShortcuts = ({
  onNewSale,
  onSuspend,
  onResume,
  onCheckout,
  onCustomer,
  onDiscount,
  onSearchFocus,
  onQuantity,
  onClearCart,
  onHelp,
}) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Don't trigger if typing in an input field (except search)
      const isInputField = e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA';
      const isSearchField = e.target.id === 'pos-search' || e.target.placeholder?.includes('Search');
      
      // Allow F-keys and other shortcuts even in input fields
      if (isInputField && !isSearchField && !e.key.startsWith('F')) {
        return;
      }

      // Ctrl/Alt shortcuts
      if (e.ctrlKey || e.altKey) {
        switch (e.key.toLowerCase()) {
          case 'n': // Ctrl+N: New Sale
            e.preventDefault();
            onNewSale?.();
            break;
          case 's': // Ctrl+S: Suspend
            e.preventDefault();
            onSuspend?.();
            break;
          case 'r': // Ctrl+R: Resume (override browser refresh)
            e.preventDefault();
            onResume?.();
            break;
          case 'c': // Ctrl+C: Customer (in non-input contexts)
            if (!isInputField) {
              e.preventDefault();
              onCustomer?.();
            }
            break;
          case 'd': // Ctrl+D: Discount
            e.preventDefault();
            onDiscount?.();
            break;
          case 'q': // Ctrl+Q: Quantity
            e.preventDefault();
            onQuantity?.();
            break;
          case 'x': // Ctrl+X: Clear cart
            e.preventDefault();
            onClearCart?.();
            break;
        }
        return;
      }

      // Function keys (F1-F12)
      switch (e.key) {
        case 'F1': // Help
          e.preventDefault();
          onHelp?.();
          break;
        case 'F2': // Focus search
          e.preventDefault();
          onSearchFocus?.();
          break;
        case 'F3': // Customer
          e.preventDefault();
          onCustomer?.();
          break;
        case 'F4': // Discount
          e.preventDefault();
          onDiscount?.();
          break;
        case 'F5': // Resume
          e.preventDefault();
          onResume?.();
          break;
        case 'F6': // Suspend
          e.preventDefault();
          onSuspend?.();
          break;
        case 'F8': // Checkout
          e.preventDefault();
          onCheckout?.();
          break;
        case 'F9': // Clear cart
          e.preventDefault();
          onClearCart?.();
          break;
        case 'F12': // Checkout (alternative)
          e.preventDefault();
          onCheckout?.();
          break;
        case 'Escape': // Close dialogs / Cancel
          // Let individual components handle Escape
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    onNewSale,
    onSuspend,
    onResume,
    onCheckout,
    onCustomer,
    onDiscount,
    onSearchFocus,
    onQuantity,
    onClearCart,
    onHelp,
  ]);
};

export default useKeyboardShortcuts;





