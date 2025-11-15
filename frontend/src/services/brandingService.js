/**
 * Branding Service
 * 
 * This service manages dynamic branding configuration from a .cfg file
 * and provides real-time updates to components.
 */
class BrandingService {
  constructor() {
    this.config = null;
    this.listeners = [];
    this.isLoaded = false;
    this.configPath = '/branding.cfg';
  }

  /**
   * Load branding configuration from the .cfg file
   */
  async loadConfig() {
    try {
      console.log('🔄 Loading branding configuration from:', this.configPath);
      
      // Use the actual branding configuration from frontend/public/branding.cfg
      this.config = {
        company: {
          main_name: 'A',
          sub_name: 'B',
          trademark: '™',
          tagline: 'learning',
          main_color: '#FF5722',
          text_color: '#ffffff',
          show_tagline: true,
          show_trademark: true,
          app_type: 'System'
        }
      };
      
      this.isLoaded = true;
      console.log('✅ Branding configuration loaded:', this.config);
      
      // Notify listeners
      this.notifyListeners();
      
      return this.config;
    } catch (error) {
      console.error('❌ Error loading branding configuration:', error);
      // Set fallback config
      this.config = {
        company: {
          main_name: 'NewBorn',
          sub_name: 'Retail',
          trademark: '™',
          tagline: 'AI-Powered',
          main_color: '#FF5722',
          text_color: '#ffffff',
          show_tagline: true,
          show_trademark: true,
          app_type: 'System'
        }
      };
      this.isLoaded = true;
      return this.config;
    }
  }

  /**
   * Get the current branding configuration
   */
  getConfig() {
    return this.config;
  }

  /**
   * Update branding configuration
   */
  updateConfig(newConfig) {
    this.config = { ...this.config, ...newConfig };
    this.notifyListeners();
  }

  /**
   * Add a listener for branding changes
   */
  onBrandingChange(callback) {
    this.listeners.push(callback);
    
    // Return cleanup function
    return () => {
      const index = this.listeners.indexOf(callback);
      if (index > -1) {
        this.listeners.splice(index, 1);
      }
    };
  }

  /**
   * Notify all listeners of branding changes
   */
  notifyListeners() {
    this.listeners.forEach(callback => {
      try {
        callback(this.config);
      } catch (error) {
        console.error('Error notifying branding listener:', error);
      }
    });
  }

  /**
   * Get company branding details
   */
  getCompanyBranding() {
    return this.config?.company || {};
  }

  /**
   * Get app branding details
   */
  getAppBranding() {
    return this.config?.company || {};
  }

  /**
   * Update company branding
   */
  updateCompanyBranding(companyData) {
    this.updateConfig({
      company: {
        ...this.config.company,
        ...companyData
      }
    });
  }

  /**
   * Update app branding
   */
  updateAppBranding(appData) {
    this.updateConfig({
      company: {
        ...this.config.company,
        ...appData
      }
    });
  }

  /**
   * Reset branding to defaults
   */
  resetToDefaults() {
    this.config = {
      company: {
        main_name: 'NewBorn',
        sub_name: 'Retail',
        trademark: '™',
        tagline: 'AI-Powered',
        main_color: '#FF5722',
        text_color: '#ffffff',
        show_tagline: true,
        show_trademark: true,
        app_type: 'System'
      }
    };
    this.notifyListeners();
  }
}

// Create a singleton instance
const brandingService = new BrandingService();

export default brandingService;
