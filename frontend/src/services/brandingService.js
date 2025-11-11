/**
 * Branding Configuration Service
 * Loads and manages branding settings from configuration files
 */

class BrandingService {
  constructor() {
    this.config = null;
    this.loadConfig();
  }

  /**
   * Parse INI format configuration file
   */
  parseINIConfig(configText) {
    const config = {
      company: {}
    };
    
    const lines = configText.split('\n');
    let currentSection = null;
    
    for (const line of lines) {
      const trimmedLine = line.trim();
      
      // Skip empty lines and comments
      if (!trimmedLine || trimmedLine.startsWith('#')) {
        continue;
      }
      
      // Parse section headers
      const sectionMatch = trimmedLine.match(/^\[([^\]]+)\]$/);
      if (sectionMatch) {
        currentSection = sectionMatch[1];
        if (!config[currentSection]) {
          config[currentSection] = {};
        }
        continue;
      }
      
      // Parse key-value pairs
      const keyValueMatch = trimmedLine.match(/^([^=]+)=(.+)$/);
      if (keyValueMatch && currentSection) {
        const key = keyValueMatch[1].trim();
        let value = keyValueMatch[2].trim();
        
        // Remove quotes if present
        if (value.startsWith('"') && value.endsWith('"')) {
          value = value.slice(1, -1);
        }
        
        // Convert boolean strings
        if (value.toLowerCase() === 'true') {
          value = true;
        } else if (value.toLowerCase() === 'false') {
          value = false;
        }
        
        config[currentSection][key] = value;
      }
    }
    
    return config;
  }

  /**
   * Load branding configuration from the config file
   */
  async loadConfig() {
    try {
      // Default configuration
      const defaultConfig = {
        company: {
          main_name: 'NewBorn',
          sub_name: 'Retail',
          trademark: '™',
          tagline: 'AI-Powered',
          main_color: '#FF5722',
          text_color: '#ffffff',
          show_tagline: true,
          show_trademark: true
        }
      };

      // Try to load from .cfg file first
      try {
        const response = await fetch('/branding.cfg');
        if (response.ok) {
          const configText = await response.text();
          const fileConfig = this.parseINIConfig(configText);
          
          // Merge with defaults
          this.config = {
            company: {
              ...defaultConfig.company,
              ...fileConfig.company
            }
          };
          
          console.log('Branding configuration loaded from file:', this.config);
        } else {
          throw new Error('Config file not found');
        }
      } catch (fileError) {
        console.warn('Could not load branding.cfg file, using defaults:', fileError.message);
        this.config = defaultConfig;
      }

      // Try to load from localStorage for customization (overrides file config)
      const localConfig = localStorage.getItem('branding_config');
      if (localConfig) {
        try {
          const parsedConfig = JSON.parse(localConfig);
          this.config = { ...this.config, ...parsedConfig };
          console.log('Branding configuration merged with localStorage:', this.config);
        } catch (error) {
          console.warn('Invalid branding config in localStorage, using file/defaults:', error);
        }
      }

    } catch (error) {
      console.error('Error loading branding configuration:', error);
      // Fallback to default configuration
      this.config = {
        company: {
          main_name: 'NewBorn',
          sub_name: 'Retail',
          trademark: '™',
          tagline: 'AI-Powered',
          main_color: '#FF5722',
          text_color: '#ffffff',
          show_tagline: true,
          show_trademark: true
        }
      };
    }
  }

  /**
   * Get the complete branding configuration
   */
  getConfig() {
    return this.config;
  }

  /**
   * Get company name parts
   */
  getCompanyNames() {
    return {
      main_name: this.config?.company?.main_name || 'NewBorn',
      sub_name: this.config?.company?.sub_name || 'Retail'
    };
  }

  /**
   * Get branding elements
   */
  getBrandingElements() {
    return {
      trademark: this.config?.company?.trademark || '™',
      tagline: this.config?.company?.tagline || 'AI-Powered'
    };
  }

  /**
   * Get color settings
   */
  getColors() {
    return {
      main_color: this.config?.company?.main_color || '#FF5722',
      text_color: this.config?.company?.text_color || '#ffffff'
    };
  }

  /**
   * Get display settings
   */
  getDisplaySettings() {
    return {
      show_tagline: this.config?.company?.show_tagline !== false,
      show_trademark: this.config?.company?.show_trademark !== false
    };
  }

  /**
   * Update branding configuration (saves to localStorage)
   */
  updateConfig(newConfig) {
    try {
      this.config = { ...this.config, ...newConfig };
      localStorage.setItem('branding_config', JSON.stringify(this.config));
      
      // Dispatch custom event for immediate UI updates
      window.dispatchEvent(new CustomEvent('brandingChanged', { detail: this.config }));
      
      console.log('Branding configuration updated:', this.config);
      return true;
    } catch (error) {
      console.error('Error updating branding configuration:', error);
      return false;
    }
  }

  /**
   * Reset branding to defaults
   */
  resetToDefaults() {
    const defaultConfig = {
      company: {
        main_name: 'NewBorn',
        sub_name: 'Retail',
        trademark: '™',
        tagline: 'AI-Powered',
        main_color: '#FF5722',
        text_color: '#ffffff',
        show_tagline: true,
        show_trademark: true
      }
    };
    
    return this.updateConfig(defaultConfig);
  }

  /**
   * Listen for branding changes
   */
  onBrandingChange(callback) {
    const handler = (event) => {
      callback(event.detail);
    };
    
    window.addEventListener('brandingChanged', handler);
    
    // Return cleanup function
    return () => {
      window.removeEventListener('brandingChanged', handler);
    };
  }
}

// Create singleton instance
const brandingService = new BrandingService();

export default brandingService;
