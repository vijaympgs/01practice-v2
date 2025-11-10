import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';

// Default sidebar preferences
const DEFAULT_SIDEBAR_PREFERENCES = {
  name: 'Default Sidebar Configuration',
  description: 'Standard sidebar layout and behavior settings',
  is_active: true,
  sidebar_width: 280,
  sidebar_position: 'left',
  sidebar_theme: 'light',
  sidebar_auto_collapse: false,
  sidebar_show_icons: true,
  sidebar_show_labels: true,
  sidebar_compact_mode: false,
  sidebar_expanded_sections: {
    'Master Data': true,
    'Transactions': true,
    'Reports & Analytics': false
  },
  // Menu visibility settings
  menu_visibility: {
    show_advanced_customer_master: false,
    show_vendor_analytics: false,
    show_experimental_features: false
  }
};

// Create the Layout Context
const LayoutContext = createContext();

// Custom hook to use the Layout Context
export const useLayout = () => {
  const context = useContext(LayoutContext);
  if (!context) {
    console.warn('useLayout called outside LayoutProvider, returning default context');
    return {
      getMenuVisibility: {},
      getSidebarStyles: () => ({}),
      getSidebarBehavior: () => ({}),
      toggleSidebar: () => {},
      setSidebarOpenState: () => {},
      sidebarOpen: true,
      loading: false
    };
  }
  return context;
};

// Layout Provider Component
export const LayoutProvider = ({ children }) => {
  const [sidebarPreferences, setSidebarPreferences] = useState(DEFAULT_SIDEBAR_PREFERENCES);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [loading, setLoading] = useState(false);

  // Skip automatic loading in development mode
  useEffect(() => {
    if (!import.meta.env.DEV) {
      loadPreferences();
    } else {
      // In development, just use defaults without loading delay
      setLoading(false);
    }
  }, []);

  // Load preferences from localStorage
  const loadPreferences = () => {
    try {
      const savedPreferences = localStorage.getItem('layoutPreferences');
      if (savedPreferences) {
        const parsed = JSON.parse(savedPreferences);
        // Merge with defaults to ensure all properties exist
        const mergedPreferences = { ...DEFAULT_SIDEBAR_PREFERENCES, ...parsed };
        setSidebarPreferences(mergedPreferences);
      }
    } catch (error) {
      console.error('Error loading layout preferences:', error);
      // Fall back to defaults
      setSidebarPreferences(DEFAULT_SIDEBAR_PREFERENCES);
    } finally {
      setLoading(false);
    }
  };

  // Save preferences to localStorage
  const savePreferences = useCallback((newPreferences) => {
    try {
      const mergedPreferences = { ...sidebarPreferences, ...newPreferences };
      localStorage.setItem('layoutPreferences', JSON.stringify(mergedPreferences));
      setSidebarPreferences(mergedPreferences);
      return true;
    } catch (error) {
      console.error('Error saving layout preferences:', error);
      return false;
    }
  }, [sidebarPreferences]);

  // Reset preferences to defaults
  const resetPreferences = useCallback(() => {
    try {
      localStorage.removeItem('layoutPreferences');
      setSidebarPreferences(DEFAULT_SIDEBAR_PREFERENCES);
      return true;
    } catch (error) {
      console.error('Error resetting layout preferences:', error);
      return false;
    }
  }, []);

  // Toggle sidebar open/close
  const toggleSidebar = useCallback(() => {
    setSidebarOpen(prev => !prev);
  }, []);

  // Set sidebar open state
  const setSidebarOpenState = useCallback((isOpen) => {
    setSidebarOpen(isOpen);
  }, []);

  // Get computed sidebar styles based on preferences
  const getSidebarStyles = useMemo(() => {
    const { sidebar_width, sidebar_position, sidebar_theme, sidebar_compact_mode } = sidebarPreferences;
    
    return {
      width: sidebar_width,
      position: sidebar_position,
      theme: sidebar_theme,
      compact: sidebar_compact_mode,
      // Computed styles
      drawerWidth: sidebar_width,
      marginLeft: sidebarOpen && sidebar_position === 'left' ? sidebar_width : 0,
      marginRight: sidebarOpen && sidebar_position === 'right' ? sidebar_width : 0,
    };
  }, [sidebarPreferences, sidebarOpen]);

  // Get sidebar behavior settings
  const getSidebarBehavior = useMemo(() => {
    const { 
      sidebar_auto_collapse, 
      sidebar_show_icons, 
      sidebar_show_labels, 
      sidebar_expanded_sections 
    } = sidebarPreferences;
    
    return {
      autoCollapse: sidebar_auto_collapse,
      showIcons: sidebar_show_icons,
      showLabels: sidebar_show_labels,
      expandedSections: sidebar_expanded_sections,
    };
  }, [sidebarPreferences]);

  // Get menu visibility settings
  const getMenuVisibility = useMemo(() => {
    return sidebarPreferences.menu_visibility || {};
  }, [sidebarPreferences]);

  // Check if preferences should auto-collapse on small screens
  const shouldAutoCollapse = useCallback((screenWidth) => {
    return sidebarPreferences.sidebar_auto_collapse && screenWidth < 768; // Mobile breakpoint
  }, [sidebarPreferences]);

  // Apply preferences on login - manual trigger only
  const applyPreferencesOnLogin = useCallback(() => {
    if (!import.meta.env.DEV) {
      loadPreferences();
    }
    // In development mode, this does nothing to avoid conflicts
  }, []);

  // Clear preferences on logout (optional)
  const clearPreferencesOnLogout = useCallback(() => {
    // Keep preferences but reset sidebar state
    setSidebarOpen(true);
    // Optionally reload preferences for next login
    loadPreferences();
  }, []);

  const contextValue = useMemo(() => ({
    // State
    sidebarPreferences,
    sidebarOpen,
    loading,
    
    // Actions
    savePreferences,
    resetPreferences,
    loadPreferences,
    toggleSidebar,
    setSidebarOpenState,
    
    // Computed values
    getSidebarStyles,
    getSidebarBehavior,
    getMenuVisibility,
    shouldAutoCollapse,
    
    // Auth-related actions
    applyPreferencesOnLogin,
    clearPreferencesOnLogout,
    
    // Defaults
    defaultPreferences: DEFAULT_SIDEBAR_PREFERENCES,
  }), [
    sidebarPreferences,
    sidebarOpen,
    loading,
    savePreferences,
    resetPreferences,
    toggleSidebar,
    setSidebarOpenState,
    getSidebarStyles,
    getSidebarBehavior,
    getMenuVisibility,
    shouldAutoCollapse,
    applyPreferencesOnLogin,
    clearPreferencesOnLogout
  ]);

  return (
    <LayoutContext.Provider value={contextValue}>
      {children}
    </LayoutContext.Provider>
  );
};

export default LayoutProvider;
