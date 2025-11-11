import api from './api';

class ThemeService {
  /**
   * Get the currently active theme from database
   */
  async getActiveTheme() {
    try {
      const response = await api.get('/theme/active-theme/');
      return response.data;
    } catch (error) {
      console.error('Error fetching active theme:', error);
      // Return default theme if API fails
      return {
        theme_name: 'blue',
        primary_color: '#1565C0',
        secondary_color: '#FF5722',
        background_color: '#f5f5f5'
      };
    }
  }

  /**
   * Set a theme as active in database
   */
  async setActiveTheme(themeId) {
    try {
      const response = await api.post('/theme/set-active-theme/', {
        theme_id: themeId
      });
      return response.data;
    } catch (error) {
      console.error('Error setting active theme:', error);
      throw error;
    }
  }

  /**
   * Create a new theme in database
   */
  async createTheme(themeData) {
    try {
      const response = await api.post('/theme/create-theme/', themeData);
      return response.data;
    } catch (error) {
      console.error('Error creating theme:', error);
      throw error;
    }
  }

  /**
   * Get all available themes
   */
  async getAllThemes() {
    try {
      const response = await api.get('/theme/themes/');
      return response.data;
    } catch (error) {
      console.error('Error fetching themes:', error);
      return [];
    }
  }

  /**
   * Update an existing theme
   */
  async updateTheme(themeId, themeData) {
    try {
      const response = await api.put(`/theme/themes/${themeId}/`, themeData);
      return response.data;
    } catch (error) {
      console.error('Error updating theme:', error);
      throw error;
    }
  }

  /**
   * Delete a theme
   */
  async deleteTheme(themeId) {
    try {
      const response = await api.delete(`/theme/themes/${themeId}/`);
      return response.data;
    } catch (error) {
      console.error('Error deleting theme:', error);
      throw error;
    }
  }

  /**
   * Get theme colors for CSS styling
   */
  async getThemeColors() {
    try {
      const theme = await this.getActiveTheme();
      return {
        primary: theme.primary_color,
        secondary: theme.secondary_color,
        background: theme.background_color,
        themeName: theme.theme_name
      };
    } catch (error) {
      console.error('Error getting theme colors:', error);
      return {
        primary: '#1565C0',
        secondary: '#FF5722',
        background: '#f5f5f5',
        themeName: 'blue'
      };
    }
  }

  /**
   * Create default themes if they don't exist
   */
  async initializeDefaultThemes() {
    try {
      const themes = await this.getAllThemes();
      
      if (themes.length === 0) {
        // Create default blue theme
        await this.createTheme({
          theme_name: 'blue',
          primary_color: '#1565C0',
          secondary_color: '#FF5722',
          background_color: '#f5f5f5',
          is_active: true
        });

        // Create default black theme
        await this.createTheme({
          theme_name: 'black',
          primary_color: '#333333',
          secondary_color: '#666666',
          background_color: '#1a1a1a',
          is_active: false
        });
      }
    } catch (error) {
      console.error('Error initializing default themes:', error);
    }
  }
}

export default new ThemeService();
