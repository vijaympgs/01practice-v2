/**
 * Theme Service
 * 
 * This service manages theme configuration with database persistence
 * and provides real-time theme switching capabilities.
 */
import api from './api';

class ThemeService {
  constructor() {
    this.themes = [];
    this.activeTheme = null;
    this.isLoaded = false;
  }

  /**
   * Initialize default themes if they don't exist
   */
  async initializeDefaultThemes() {
    try {
      console.log('🔄 Initializing default themes...');
      
      // Check if themes already exist
      const existingThemes = await this.getAllThemes();
      if (existingThemes.length > 0) {
        console.log('✅ Themes already exist:', existingThemes.length);
        return existingThemes;
      }

      // Create default themes
      const defaultThemes = [
        {
          theme_name: 'blue',
          name: 'Blue Theme',
          primary_color: '#1565C0',
          secondary_color: '#FF5722',
          background_color: '#f5f5f5',
          text_color: '#333333',
          is_active: true
        },
        {
          theme_name: 'black',
          name: 'Black Theme',
          primary_color: '#333333',
          secondary_color: '#666666',
          background_color: '#ffffff',
          text_color: '#000000',
          is_active: false
        },
        {
          theme_name: 'green',
          name: 'Green Theme',
          primary_color: '#2E7D32',
          secondary_color: '#FF6F00',
          background_color: '#f1f8e9',
          text_color: '#1b5e20',
          is_active: false
        },
        {
          theme_name: 'purple',
          name: 'Purple Theme',
          primary_color: '#7B1FA2',
          secondary_color: '#FF5722',
          background_color: '#f3e5f5',
          text_color: '#4a148c',
          is_active: false
        }
      ];

      // Create themes via API (if available)
      for (const themeData of defaultThemes) {
        try {
          await api.post('/theme-management/themes/', themeData);
          console.log('✅ Created theme:', themeData.theme_name);
        } catch (error) {
          console.warn('⚠️ Could not create theme via API:', themeData.theme_name, error.message);
        }
      }

      console.log('✅ Default themes initialized');
      return defaultThemes;
    } catch (error) {
      console.error('❌ Error initializing default themes:', error);
      return [];
    }
  }

  /**
   * Get all available themes
   */
  async getAllThemes() {
    try {
      console.log('🔄 Loading all themes...');
      
      // Try to load from API first
      try {
        const response = await api.get('/theme-management/themes/');
        this.themes = response.data.results || response.data || [];
        console.log('✅ Themes loaded from API:', this.themes.length);
      } catch (apiError) {
        console.warn('⚠️ Could not load themes from API, using fallback:', apiError.message);
        
        // Fallback to default themes
        this.themes = [
          {
            id: 1,
            theme_name: 'blue',
            name: 'Blue Theme',
            primary_color: '#1565C0',
            secondary_color: '#FF5722',
            background_color: '#f5f5f5',
            text_color: '#333333',
            is_active: true
          },
          {
            id: 2,
            theme_name: 'black',
            name: 'Black Theme',
            primary_color: '#333333',
            secondary_color: '#666666',
            background_color: '#ffffff',
            text_color: '#000000',
            is_active: false
          },
          {
            id: 3,
            theme_name: 'green',
            name: 'Green Theme',
            primary_color: '#2E7D32',
            secondary_color: '#FF6F00',
            background_color: '#f1f8e9',
            text_color: '#1b5e20',
            is_active: false
          },
          {
            id: 4,
            theme_name: 'purple',
            name: 'Purple Theme',
            primary_color: '#7B1FA2',
            secondary_color: '#FF5722',
            background_color: '#f3e5f5',
            text_color: '#4a148c',
            is_active: false
          }
        ];
      }

      this.isLoaded = true;
      return this.themes;
    } catch (error) {
      console.error('❌ Error loading themes:', error);
      this.themes = [];
      return [];
    }
  }

  /**
   * Get the currently active theme
   */
  async getActiveTheme() {
    try {
      console.log('🔄 Loading active theme...');
      
      // Try to load from API first
      try {
        const response = await api.get('/theme-management/themes/active/');
        this.activeTheme = response.data;
        console.log('✅ Active theme loaded from API:', this.activeTheme?.theme_name);
      } catch (apiError) {
        console.warn('⚠️ Could not load active theme from API, using fallback:', apiError.message);
        
        // Fallback to localStorage or first theme
        const cachedTheme = localStorage.getItem('activeTheme');
        if (cachedTheme) {
          try {
            this.activeTheme = JSON.parse(cachedTheme);
            console.log('✅ Active theme loaded from localStorage:', this.activeTheme?.theme_name);
          } catch (parseError) {
            console.warn('⚠️ Could not parse cached theme, using first available theme');
            this.activeTheme = this.themes.length > 0 ? this.themes[0] : null;
          }
        } else {
          this.activeTheme = this.themes.length > 0 ? this.themes[0] : null;
        }
      }

      return this.activeTheme;
    } catch (error) {
      console.error('❌ Error loading active theme:', error);
      return null;
    }
  }

  /**
   * Set a theme as active
   */
  async setActiveTheme(themeId) {
    try {
      console.log('🔄 Setting active theme:', themeId);
      
      // Try to set via API first
      try {
        await api.post(`/theme-management/themes/${themeId}/set_active/`);
        console.log('✅ Active theme set via API');
      } catch (apiError) {
        console.warn('⚠️ Could not set active theme via API, using localStorage:', apiError.message);
        
        // Fallback to localStorage
        const theme = this.themes.find(t => t.id === themeId);
        if (theme) {
          localStorage.setItem('activeTheme', JSON.stringify(theme));
          console.log('✅ Active theme set in localStorage');
        }
      }

      // Update local state
      this.activeTheme = this.themes.find(t => t.id === themeId);
      
      // Update all themes to set only one as active
      this.themes = this.themes.map(theme => ({
        ...theme,
        is_active: theme.id === themeId
      }));

      return this.activeTheme;
    } catch (error) {
      console.error('❌ Error setting active theme:', error);
      throw error;
    }
  }

  /**
   * Create a new theme
   */
  async createTheme(themeData) {
    try {
      console.log('🔄 Creating theme:', themeData.theme_name);
      
      const response = await api.post('/theme-management/themes/', themeData);
      const newTheme = response.data;
      
      this.themes.push(newTheme);
      console.log('✅ Theme created:', newTheme.theme_name);
      
      return newTheme;
    } catch (error) {
      console.error('❌ Error creating theme:', error);
      throw error;
    }
  }

  /**
   * Update an existing theme
   */
  async updateTheme(themeId, themeData) {
    try {
      console.log('🔄 Updating theme:', themeId);
      
      const response = await api.put(`/theme-management/themes/${themeId}/`, themeData);
      const updatedTheme = response.data;
      
      // Update local state
      const index = this.themes.findIndex(t => t.id === themeId);
      if (index !== -1) {
        this.themes[index] = updatedTheme;
      }
      
      console.log('✅ Theme updated:', updatedTheme.theme_name);
      return updatedTheme;
    } catch (error) {
      console.error('❌ Error updating theme:', error);
      throw error;
    }
  }

  /**
   * Delete a theme
   */
  async deleteTheme(themeId) {
    try {
      console.log('🔄 Deleting theme:', themeId);
      
      await api.delete(`/theme-management/themes/${themeId}/`);
      
      // Update local state
      this.themes = this.themes.filter(t => t.id !== themeId);
      
      console.log('✅ Theme deleted:', themeId);
      return true;
    } catch (error) {
      console.error('❌ Error deleting theme:', error);
      throw error;
    }
  }

  /**
   * Get theme by ID
   */
  getThemeById(themeId) {
    return this.themes.find(theme => theme.id === themeId);
  }

  /**
   * Get theme by name
   */
  getThemeByName(themeName) {
    return this.themes.find(theme => theme.theme_name === themeName);
  }

  /**
   * Apply theme to UI immediately
   */
  applyThemeToUI(theme) {
    console.log('🎨 Applying theme to UI:', theme?.theme_name);
    
    if (!theme) return;

    // Apply theme to root element
    const root = document.documentElement;
    root.style.setProperty('--theme-primary', theme.primary_color);
    root.style.setProperty('--theme-secondary', theme.secondary_color);
    root.style.setProperty('--theme-background', theme.background_color);
    root.style.setProperty('--theme-text', theme.text_color);

    // Apply theme to body
    document.body.style.backgroundColor = theme.background_color || '#f5f5f5';
    document.body.style.color = theme.text_color || '#333333';

    // Store in localStorage for persistence
    localStorage.setItem('activeTheme', JSON.stringify(theme));

    // Dispatch custom event for theme change
    window.dispatchEvent(new CustomEvent('themeChanged', { detail: theme }));

    console.log('✅ Theme applied to UI');
  }

  /**
   * Get current theme from localStorage
   */
  getCurrentThemeFromStorage() {
    try {
      const cachedTheme = localStorage.getItem('activeTheme');
      return cachedTheme ? JSON.parse(cachedTheme) : null;
    } catch (error) {
      console.error('Error parsing cached theme:', error);
      return null;
    }
  }

  /**
   * Get theme colors for components
   */
  async getThemeColors() {
    try {
      // Get active theme, fallback to default if not loaded
      let theme = this.activeTheme;
      if (!theme) {
        theme = await this.getActiveTheme();
      }
      
      // If still no theme, use fallback
      if (!theme) {
        const fallbackTheme = this.getCurrentThemeFromStorage();
        if (fallbackTheme) {
          theme = fallbackTheme;
        } else {
          // Ultimate fallback to blue theme
          theme = {
            primary_color: '#1565C0',
            secondary_color: '#FF5722',
            background_color: '#f5f5f5',
            text_color: '#333333'
          };
        }
      }

      return {
        primary: theme.primary_color || '#1565C0',
        secondary: theme.secondary_color || '#FF5722',
        background: theme.background_color || '#f5f5f5',
        text: theme.text_color || '#333333'
      };
    } catch (error) {
      console.error('Error getting theme colors:', error);
      // Return fallback colors
      return {
        primary: '#1565C0',
        secondary: '#FF5722',
        background: '#f5f5f5',
        text: '#333333'
      };
    }
  }

  /**
   * Reset to default theme
   */
  async resetToDefault() {
    try {
      console.log('🔄 Resetting to default theme...');
      
      const blueTheme = this.themes.find(t => t.theme_name === 'blue');
      if (blueTheme) {
        await this.setActiveTheme(blueTheme.id);
        this.applyThemeToUI(blueTheme);
        console.log('✅ Reset to default theme');
      }
    } catch (error) {
      console.error('❌ Error resetting to default theme:', error);
      throw error;
    }
  }
}

// Create a singleton instance
const themeService = new ThemeService();

export default themeService;
