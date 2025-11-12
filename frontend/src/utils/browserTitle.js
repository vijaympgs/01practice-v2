/**
 * Browser Title Utility
 * Dynamically updates browser title based on branding configuration
 */

import brandingService from '../services/brandingService';

class BrowserTitleManager {
  constructor() {
    this.defaultTitle = 'NewBorn Retail™ - AI-Powered ERP System';
    this.currentConfig = null;
    this.isInitialized = false;
    this.initPromise = null;
    this.init();
  }

  /**
   * Initialize the browser title manager
   */
  async init() {
    // Prevent multiple initializations
    if (this.initPromise) {
      return this.initPromise;
    }

    this.initPromise = this._doInit();
    return this.initPromise;
  }

  async _doInit() {
    try {
      // Wait for branding configuration to be fully loaded
      await brandingService.loadConfig();
      
      // Get the config after loading is complete
      let config = brandingService.getConfig();
      
      if (!config) {
        // Wait for branding configuration to be loaded
        await new Promise(resolve => {
          const checkConfig = () => {
            const currentConfig = brandingService.getConfig();
            if (currentConfig) {
              config = currentConfig;
              resolve();
            } else {
              // If config is not ready yet, wait a bit and check again
              setTimeout(checkConfig, 50);
            }
          };
          checkConfig();
        });
      }
      
      this.currentConfig = config;
      
      // Listen for branding changes
      const cleanup = brandingService.onBrandingChange((newConfig) => {
        this.currentConfig = newConfig;
        this.updateTitle();
      });
      
      // Set initial title
      this.updateTitle();
      this.isInitialized = true;
      return cleanup;
    } catch (error) {
      console.error('🔖 BrowserTitleManager: Error initializing:', error);
      this.setTitle(this.defaultTitle);
      this.isInitialized = true;
    }
  }

  /**
   * Update browser title based on current branding configuration
   */
  updateTitle() {
    if (!this.currentConfig || !this.currentConfig.company) {
      this.setTitle(this.defaultTitle);
      return;
    }

    const { company } = this.currentConfig;
    const mainName = company.main_name || 'NewBorn';
    const subName = company.sub_name || 'Retail';
    const trademark = company.show_trademark !== false ? (company.trademark || '™') : '';
    const tagline = company.show_tagline !== false ? (company.tagline || 'AI-Powered') : '';
    const appType = company.app_type || 'ERP System';

    // Build title parts
    let title = `${mainName} ${subName}${trademark}`;
    
    if (tagline) {
      title += ` - ${tagline}`;
    }
    
    title += ` ${appType}`;
    
    this.setTitle(title);
  }

  /**
   * Set the browser document title
   */
  setTitle(title) {
    if (typeof document !== 'undefined') {
      document.title = title;
    }
  }

  /**
   * Get current title
   */
  getCurrentTitle() {
    if (typeof document !== 'undefined') {
      return document.title;
    }
    return this.defaultTitle;
  }

  /**
   * Reset to default title
   */
  resetToDefault() {
    this.setTitle(this.defaultTitle);
  }
}

// Create singleton instance
const browserTitleManager = new BrowserTitleManager();

export default browserTitleManager;
