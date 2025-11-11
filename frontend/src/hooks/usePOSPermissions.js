import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import posFunctionService from '../services/posFunctionService';

/**
 * Custom hook for POS function permissions
 * 
 * Returns:
 * - permissions: Object mapping function codes to permission details
 * - loading: Boolean indicating if permissions are being loaded
 * - canExecute: Function to check if a function can be executed
 * - requiresApproval: Function to check if a function requires approval
 */
export const usePOSPermissions = () => {
  const { user } = useSelector((state) => state.auth);
  const [permissions, setPermissions] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPermissions();
  }, [user]);

  const loadPermissions = async () => {
    try {
      setLoading(true);
      
      // Admin and superuser have all permissions
      if (user?.is_superuser || user?.is_staff || user?.role === 'admin') {
        // Load all functions and mark as allowed
        const functions = await posFunctionService.getFunctions();
        const allPermissions = {};
        
        (functions.results || functions).forEach(func => {
          allPermissions[func.function_code] = {
            allowed: true,
            requires_approval: false,
            function_name: func.function_name,
            keyboard_shortcut: func.keyboard_shortcut,
            category: func.category
          };
        });
        
        setPermissions(allPermissions);
        setLoading(false);
        return;
      }

      // Load role-based permissions for POS users
      if (user && (user.role === 'posmanager' || user.role === 'posuser')) {
        const userPermissions = await posFunctionService.getUserPermissions();
        setPermissions(userPermissions || {});
      } else {
        // Not a POS role, no permissions
        setPermissions({});
      }
    } catch (error) {
      console.error('Failed to load POS permissions:', error);
      // Default: allow all for now (fail open)
      setPermissions({ all: true });
    } finally {
      setLoading(false);
    }
  };

  /**
   * Check if a function can be executed
   * @param {string} functionCode - Function code (e.g., 'F1', 'ALT_F3', 'CTRL_F4')
   * @returns {boolean}
   */
  const canExecute = (functionCode) => {
    if (!functionCode) return false;
    
    // Admin and superuser can execute all functions
    if (user?.is_superuser || user?.is_staff || user?.role === 'admin') {
      return true;
    }

    // If loading, fail-open (allow by default)
    if (loading) {
      return true;
    }

    // Check if function is in permissions and allowed
    const permission = permissions[functionCode];
    return permission?.allowed === true;
  };

  /**
   * Check if a function requires approval
   * @param {string} functionCode - Function code
   * @returns {boolean}
   */
  const requiresApproval = (functionCode) => {
    if (!functionCode) return false;
    
    // Admin and superuser don't need approval
    if (user?.is_superuser || user?.is_staff || user?.role === 'admin') {
      return false;
    }

    const permission = permissions[functionCode];
    return permission?.requires_approval === true;
  };

  /**
   * Get permission details for a function
   * @param {string} functionCode - Function code
   * @returns {object|null}
   */
  const getPermission = (functionCode) => {
    return permissions[functionCode] || null;
  };

  return {
    permissions,
    loading,
    canExecute,
    requiresApproval,
    getPermission,
    refreshPermissions: loadPermissions
  };
};

export default usePOSPermissions;

