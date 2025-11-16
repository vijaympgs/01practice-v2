import { chromium } from 'playwright';
import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Base URL for the frontend
const BASE_URL = 'http://localhost:3000';
const API_BASE_URL = process.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

// Viewport settings
const VIEWPORT = { width: 1920, height: 1080 };

// Helper function to parse command line arguments
function parseArg(key) {
  const arg = process.argv.find(a => a.startsWith(`--${key}=`));
  if (arg) {
    // Handle quoted values (remove quotes)
    const value = arg.split('=').slice(1).join('='); // Join in case value contains '='
    return value.replace(/^["']|["']$/g, ''); // Remove surrounding quotes
  }
  return null;
}

// Authentication credentials (from environment variables or command line args)
const LOGIN_USERNAME = process.env.SCREENSHOT_USERNAME || parseArg('username');
const LOGIN_PASSWORD = process.env.SCREENSHOT_PASSWORD || parseArg('password');
const LOGIN_COMPANY = process.env.SCREENSHOT_COMPANY || parseArg('company');

// Debug: Log parsed credentials (without password)
console.log('🔍 Debug - Command line arguments:', process.argv.slice(2));
if (LOGIN_USERNAME || LOGIN_PASSWORD || LOGIN_COMPANY) {
  console.log('🔑 Credentials detected:');
  if (LOGIN_USERNAME) console.log(`   Username: ${LOGIN_USERNAME}`);
  if (LOGIN_PASSWORD) console.log(`   Password: ${'*'.repeat(LOGIN_PASSWORD.length)}`);
  if (LOGIN_COMPANY) console.log(`   Company: ${LOGIN_COMPANY}`);
  console.log('');
} else {
  console.log('⚠️  No credentials detected from command line or environment variables\n');
}

// Screenshot output directory (project root)
const SCREENSHOTS_DIR = join(__dirname, '..', '..', 'screenshots');

// All routes extracted from App.jsx
const ROUTES = [
  // Public routes
  { path: '/login', name: 'login', category: 'auth', public: true },
  { path: '/login_new', name: 'login-new', category: 'auth', public: true },
  { path: '/register', name: 'register', category: 'auth', public: true },
  
  // Protected routes (will be skipped if redirect to login)
  { path: '/', name: 'home', category: 'dashboard', public: false },
  { path: '/dashboard', name: 'dashboard', category: 'dashboard', public: false },
  { path: '/home', name: 'home-alt', category: 'dashboard', public: false },
  { path: '/under-construction', name: 'under-construction', category: 'general', public: false },
  { path: '/location-selection', name: 'location-selection', category: 'auth', public: false },
  
  // Organization
  { path: '/organization', name: 'organization', category: 'organization', public: false },
  
  // Master Data
  { path: '/master-data/general', name: 'master-data-general', category: 'master-data', public: false },
  { path: '/master-data/configuration', name: 'master-data-configuration', category: 'master-data', public: false },
  { path: '/master-data/uom-setup', name: 'master-data-uom-setup', category: 'master-data', public: false },
  { path: '/master-data/uom-conversion', name: 'master-data-uom-conversion', category: 'master-data', public: false },
  { path: '/master-data/customers', name: 'master-data-customers', category: 'master-data', public: false },
  { path: '/master-data/vendors', name: 'master-data-vendors', category: 'master-data', public: false },
  
  // Item Management
  { path: '/item/attributes', name: 'item-attributes', category: 'items', public: false },
  { path: '/item/attribute-values', name: 'item-attribute-values', category: 'items', public: false },
  { path: '/item/tax-setup', name: 'item-tax-setup', category: 'items', public: false },
  { path: '/item/tax-slab', name: 'item-tax-slab', category: 'items', public: false },
  { path: '/item/item-master', name: 'item-master', category: 'items', public: false },
  { path: '/item/advanced-item-master', name: 'item-advanced-master', category: 'items', public: false },
  { path: '/company-master', name: 'company-master', category: 'master-data', public: false },
  { path: '/setup-masters', name: 'setup-masters', category: 'master-data', public: false },
  { path: '/configuration-masters', name: 'configuration-masters', category: 'master-data', public: false },
  { path: '/enhanced-item-master', name: 'enhanced-item-master', category: 'items', public: false },
  
  // Users & Permissions
  { path: '/users', name: 'users', category: 'users', public: false },
  { path: '/user-permissions', name: 'user-permissions', category: 'users', public: false },
  { path: '/user-permissions/pos-functions', name: 'user-permissions-pos-functions', category: 'users', public: false },
  
  // Security
  { path: '/security', name: 'security', category: 'security', public: false },
  
  // Business Rules
  { path: '/business-rules', name: 'business-rules', category: 'settings', public: false },
  { path: '/business-rules/general', name: 'business-rules-general', category: 'settings', public: false },
  
  // Settings
  { path: '/settings', name: 'settings', category: 'settings', public: false },
  { path: '/settings/dataops-studio', name: 'settings-dataops-studio', category: 'settings', public: false },
  { path: '/settings/layout-preferences', name: 'settings-layout-preferences', category: 'settings', public: false },
  { path: '/settings/digital-marketing', name: 'settings-digital-marketing', category: 'settings', public: false },
  { path: '/settings/html-preview', name: 'settings-html-preview', category: 'settings', public: false },
  { path: '/settings/web-console', name: 'settings-web-console', category: 'settings', public: false },
  
  // POS Masters
  { path: '/pos-masters', name: 'pos-masters', category: 'pos', public: false },
  { path: '/code-settings', name: 'code-settings', category: 'pos', public: false },
  
  // Inventory & Procurement
  { path: '/inventory', name: 'inventory', category: 'inventory', public: false },
  { path: '/procurement-workflows', name: 'procurement-workflows', category: 'procurement', public: false },
  { path: '/purchases', name: 'purchases', category: 'procurement', public: false },
  
  // Sales & CRM
  { path: '/sales', name: 'sales', category: 'sales', public: false },
  { path: '/sales-order-management', name: 'sales-order-management', category: 'sales', public: false },
  { path: '/customer-management', name: 'customer-management', category: 'crm', public: false },
  
  // POS Routes
  { path: '/pos', name: 'pos', category: 'pos', public: false },
  { path: '/pos-indexeddb', name: 'pos-indexeddb', category: 'pos', public: false },
  { path: '/pos-session-manager', name: 'pos-session-manager', category: 'pos', public: false },
  { path: '/pos-test-runner', name: 'pos-test-runner', category: 'pos', public: false },
  { path: '/pos-status-check', name: 'pos-status-check', category: 'pos', public: false },
  { path: '/pos-sessions', name: 'pos-sessions', category: 'pos', public: false },
  { path: '/pos/terminal-setup', name: 'pos-terminal-setup', category: 'pos', public: false },
  { path: '/pos/terminal-configuration', name: 'pos-terminal-configuration', category: 'pos', public: false },
  { path: '/pos/day-open', name: 'pos-day-open', category: 'pos', public: false },
  { path: '/pos/session-open', name: 'pos-session-open', category: 'pos', public: false },
  { path: '/pos/shift-management', name: 'pos-shift-management', category: 'pos', public: false },
  { path: '/pos/session-management', name: 'pos-session-management', category: 'pos', public: false },
  { path: '/pos/desktop', name: 'pos-desktop', category: 'pos', public: false },
  { path: '/pos/billing', name: 'pos-billing', category: 'pos', public: false },
  { path: '/pos/settlement', name: 'pos-settlement', category: 'pos', public: false },
  { path: '/pos/day-management', name: 'pos-day-management', category: 'pos', public: false },
  { path: '/pos/day-management-console', name: 'pos-day-management-console', category: 'pos', public: false },
  { path: '/pos/settlement-advanced', name: 'pos-settlement-advanced', category: 'pos', public: false },
  { path: '/pos/session-close', name: 'pos-session-close', category: 'pos', public: false },
  { path: '/pos/day-close', name: 'pos-day-close', category: 'pos', public: false },
  { path: '/pos/customer-receivables', name: 'pos-customer-receivables', category: 'pos', public: false },
  { path: '/pos/home-delivery', name: 'pos-home-delivery', category: 'pos', public: false },
  { path: '/pos/day-end', name: 'pos-day-end', category: 'pos', public: false },
  { path: '/pos/code-master', name: 'pos-code-master', category: 'pos', public: false },
  
  // Advanced POS Modules
  { path: '/pos/advanced-terminal-features', name: 'pos-advanced-terminal-features', category: 'pos', public: false },
  { path: '/pos/advanced-settlement', name: 'pos-advanced-settlement', category: 'pos', public: false },
  { path: '/pos/advanced-receivables', name: 'pos-advanced-receivables', category: 'pos', public: false },
  { path: '/pos/advanced-delivery', name: 'pos-advanced-delivery', category: 'pos', public: false },
  { path: '/pos/advanced-day-end', name: 'pos-advanced-day-end', category: 'pos', public: false },
  
  // POS V2 Prototype Routes
  { path: '/posv2/terminal-configuration', name: 'posv2-terminal-configuration', category: 'pos', public: false },
  { path: '/posv2/day-open', name: 'posv2-day-open', category: 'pos', public: false },
  { path: '/posv2/session-open', name: 'posv2-session-open', category: 'pos', public: false },
  { path: '/posv2/desktop', name: 'posv2-desktop', category: 'pos', public: false },
  { path: '/posv2/settlement', name: 'posv2-settlement', category: 'pos', public: false },
  { path: '/posv2/session-close', name: 'posv2-session-close', category: 'pos', public: false },
  { path: '/posv2/day-end', name: 'posv2-day-end', category: 'pos', public: false },
  { path: '/posv2/day-close', name: 'posv2-day-close', category: 'pos', public: false },
  { path: '/posv2/shift-workflow', name: 'posv2-shift-workflow', category: 'pos', public: false },
  
  // Reports
  { path: '/reports', name: 'reports', category: 'reports', public: false },
  
  // Profile
  { path: '/profile', name: 'profile', category: 'user', public: false },
  
  // Wireframes
  { path: '/wireframes', name: 'wireframes', category: 'admin', public: false },
  
  // Procurement Routes
  { path: '/procurement/purchase-request', name: 'procurement-purchase-request', category: 'procurement', public: false },
  { path: '/procurement/purchase-enquiry', name: 'procurement-purchase-enquiry', category: 'procurement', public: false },
  { path: '/procurement/purchase-quotation', name: 'procurement-purchase-quotation', category: 'procurement', public: false },
  { path: '/procurement/purchase-order', name: 'procurement-purchase-order', category: 'procurement', public: false },
  { path: '/procurement/goods-received-note', name: 'procurement-goods-received-note', category: 'procurement', public: false },
  { path: '/procurement/purchase-invoice', name: 'procurement-purchase-invoice', category: 'procurement', public: false },
  { path: '/procurement/purchase-return', name: 'procurement-purchase-return', category: 'procurement', public: false },
  { path: '/procurement/procurement-advice', name: 'procurement-procurement-advice', category: 'procurement', public: false },
  
  // Inventory Routes
  { path: '/inventory/system-go-live', name: 'inventory-system-go-live', category: 'inventory', public: false },
  
  // Stock Nexus Routes
  { path: '/stock-nexus/initial-setup', name: 'stock-nexus-initial-setup', category: 'inventory', public: false },
  { path: '/stock-nexus/movement-tracking', name: 'stock-nexus-movement-tracking', category: 'inventory', public: false },
  { path: '/stock-nexus/transfer-confirm', name: 'stock-nexus-transfer-confirm', category: 'inventory', public: false },
  { path: '/stock-nexus/count-adjust', name: 'stock-nexus-count-adjust', category: 'inventory', public: false },
  
  // Archive Routes
  { path: '/archive/products', name: 'archive-products', category: 'archive', public: false },
  { path: '/archive/categories', name: 'archive-categories', category: 'archive', public: false },
  { path: '/archive/customers', name: 'archive-customers', category: 'archive', public: false },
  { path: '/archive/suppliers', name: 'archive-suppliers', category: 'archive', public: false },
  { path: '/archive/purchase-orders', name: 'archive-purchase-orders', category: 'archive', public: false },
  { path: '/archive/orders', name: 'archive-orders', category: 'archive', public: false },
  { path: '/archive/sales', name: 'archive-sales', category: 'archive', public: false },
  { path: '/archive/reports', name: 'archive-reports', category: 'archive', public: false },
  { path: '/archive/inventory-control', name: 'archive-inventory-control', category: 'archive', public: false },
  { path: '/archive/inventory', name: 'archive-inventory', category: 'archive', public: false },
];

/**
 * Sanitize route name for filename
 */
function sanitizeFilename(name) {
  return name.replace(/[^a-z0-9-]/gi, '-').toLowerCase();
}

/**
 * Check if server is running
 */
async function checkServerRunning(page) {
  try {
    const response = await page.goto(BASE_URL, {
      waitUntil: 'domcontentloaded',
      timeout: 5000,
    });
    return response && response.status() < 500;
  } catch (error) {
    return false;
  }
}

/**
 * Perform login and store authentication tokens
 */
async function performLogin(page) {
  if (!LOGIN_USERNAME || !LOGIN_PASSWORD) {
    console.log('⚠️  No login credentials provided. Skipping authentication.');
    console.log('   To capture protected routes, provide credentials via:');
    console.log('   - Environment variables: SCREENSHOT_USERNAME, SCREENSHOT_PASSWORD');
    console.log('   - Optional: SCREENSHOT_COMPANY (can be skipped for testing)');
    console.log('   - Command line: --username=user --password=pass [--company=company]');
    return false;
  }

  try {
    console.log('🔐 Attempting to login...');
    
    // Navigate to login page
    await page.goto(`${BASE_URL}/login`, {
      waitUntil: 'networkidle',
      timeout: 10000,
    });

    // Wait for login form to be ready
    await page.waitForSelector('input[name="username"]', { timeout: 10000 });
    
    // Wait for companies to load - check for loading indicator
    console.log(`   ⏳ Waiting for companies to load...`);
    try {
      // Wait for loading to complete (either companies loaded or error shown)
      await page.waitForFunction(
        () => {
          const loadingText = document.querySelector('label')?.textContent || '';
          return !loadingText.includes('Loading...');
        },
        { timeout: 10000 }
      );
    } catch (e) {
      console.log(`   ℹ️  Still waiting for companies...`);
    }
    await page.waitForTimeout(2000); // Extra wait for companies to populate

    // Fill in company - it's REQUIRED based on the form
    try {
      // Try multiple selectors for Material-UI Select component
      const selectors = [
        'select[name="company"]',
        '#company',
        '[name="company"]',
        'div[role="combobox"]', // Material-UI Select uses combobox
      ];
      
      let companySelect = null;
      for (const selector of selectors) {
        companySelect = await page.$(selector).catch(() => null);
        if (companySelect) {
          console.log(`   ✓ Found company field using: ${selector}`);
          break;
        }
      }
      
      if (!companySelect) {
        // Try Material-UI Select (it's not a native select, it's a div)
        companySelect = await page.$('div.MuiSelect-root, [aria-labelledby*="company"]').catch(() => null);
        if (companySelect) {
          console.log(`   ✓ Found Material-UI company select`);
        }
      }
      
      if (companySelect) {
        // If it's a native select
        if (await companySelect.evaluate(el => el.tagName === 'SELECT')) {
          const companies = await page.$$eval('select[name="company"] option', options => 
            options.map(opt => ({ value: opt.value, text: opt.textContent.trim() })).filter(opt => opt.value)
          );
          
          if (companies.length > 0) {
            console.log(`   📋 Available companies: ${companies.map(c => c.text).join(', ')}`);
            
            // Try to find matching company by:
            // 1. Exact match (full text: "Default Company (DEFCO)")
            // 2. Company name only: "Default Company"
            // 3. Company code: "DEFCO" or "(DEFCO)"
            // 4. Partial match (fallback)
            console.log(`   🔍 Looking for company: "${LOGIN_COMPANY}"`);
            
            let matchedCompany = companies.find(c => c.text === LOGIN_COMPANY);
            if (matchedCompany) {
              console.log(`   ✓ Matched by exact text`);
            } else {
              // Try matching by company name (without code)
              matchedCompany = companies.find(c => {
                const nameOnly = c.text.split('(')[0].trim();
                return nameOnly === LOGIN_COMPANY;
              });
              if (matchedCompany) {
                console.log(`   ✓ Matched by company name: "${matchedCompany.text.split('(')[0].trim()}"`);
              }
            }
            if (!matchedCompany) {
              // Try matching by company code (e.g., "DEFCO" or "(DEFCO)")
              const codeToMatch = LOGIN_COMPANY.toUpperCase().replace(/[()]/g, '');
              matchedCompany = companies.find(c => {
                const codeMatch = c.text.match(/\(([^)]+)\)/);
                if (codeMatch) {
                  return codeMatch[1].toUpperCase() === codeToMatch;
                }
                return false;
              });
              if (matchedCompany) {
                const codeMatch = matchedCompany.text.match(/\(([^)]+)\)/);
                console.log(`   ✓ Matched by company code: "${codeMatch ? codeMatch[1] : ''}"`);
              }
            }
            if (!matchedCompany) {
              // Try partial match (case insensitive)
              matchedCompany = companies.find(c => 
                c.text.toLowerCase().includes(LOGIN_COMPANY.toLowerCase()) ||
                LOGIN_COMPANY.toLowerCase().includes(c.text.toLowerCase())
              );
              if (matchedCompany) {
                console.log(`   ✓ Matched by partial text`);
              }
            }
            
            if (matchedCompany) {
              await page.selectOption('select[name="company"]', matchedCompany.value);
              await page.waitForTimeout(1000);
              console.log(`   ✓ Selected company: ${matchedCompany.text} (ID: ${matchedCompany.value})`);
            } else {
              // Try by value (company ID)
              try {
                await page.selectOption('select[name="company"]', LOGIN_COMPANY);
                await page.waitForTimeout(1000);
                console.log(`   ✓ Selected company by ID: ${LOGIN_COMPANY}`);
              } catch (e2) {
                console.log(`   ⚠️  Could not find company "${LOGIN_COMPANY}"`);
                console.log(`   📋 Available: ${companies.map(c => c.text).join(', ')}`);
                // Select first available company as fallback
                if (companies.length > 0) {
                  await page.selectOption('select[name="company"]', companies[0].value);
                  console.log(`   ⚠️  Selected first available company: ${companies[0].text}`);
                }
              }
            }
          } else {
            console.log(`   ⚠️  No companies available in dropdown`);
          }
        } else {
          // Material-UI Select - use JavaScript to open and select
          console.log(`   📝 Material-UI Select detected, opening dropdown...`);
          
          // Get the select element's ID or use the element directly
          const selectId = await companySelect.getAttribute('id').catch(() => null);
          
          // Try multiple methods to open the dropdown
          try {
            // Method 1: Click with force (bypasses pointer events)
            await companySelect.click({ force: true, timeout: 5000 });
            await page.waitForTimeout(500);
          } catch (e1) {
            try {
              // Method 2: Use JavaScript to trigger click
              await page.evaluate((id) => {
                const select = document.getElementById(id) || document.querySelector('[name="company"]');
                if (select) {
                  select.click();
                }
              }, selectId);
              await page.waitForTimeout(500);
            } catch (e2) {
              try {
                // Method 3: Use keyboard to open (Space or Enter)
                await companySelect.focus();
                await page.keyboard.press('ArrowDown');
                await page.waitForTimeout(500);
              } catch (e3) {
                console.log(`   ⚠️  Could not open dropdown, trying direct selection...`);
              }
            }
          }
          
          // Wait for menu to appear
          await page.waitForTimeout(1000);
          
          // Try to get menu items
          let menuItems = [];
          try {
            menuItems = await page.$$eval('ul[role="listbox"] li, [role="option"]', items =>
              items.map(item => ({ text: item.textContent.trim(), value: item.getAttribute('data-value') || item.textContent.trim() }))
            );
          } catch (e) {
            // If menu didn't open, try using JavaScript to get options directly
            menuItems = await page.evaluate(() => {
              const select = document.querySelector('[name="company"]');
              if (select) {
                // Try to get options from the hidden select or from React state
                const options = Array.from(document.querySelectorAll('li[role="option"], [data-value]'));
                return options.map(opt => ({
                  text: opt.textContent.trim(),
                  value: opt.getAttribute('data-value') || opt.textContent.trim()
                }));
              }
              return [];
            });
          }
          
          if (menuItems.length > 0) {
            console.log(`   📋 Available companies: ${menuItems.map(c => c.text).join(', ')}`);
            
            // Try to find matching company
            console.log(`   🔍 Looking for company: "${LOGIN_COMPANY}"`);
            
            let matchedItem = menuItems.find(item => item.text === LOGIN_COMPANY);
            if (matchedItem) {
              console.log(`   ✓ Matched by exact text`);
            } else {
              // Try matching by company name (without code)
              matchedItem = menuItems.find(item => {
                const nameOnly = item.text.split('(')[0].trim();
                return nameOnly === LOGIN_COMPANY;
              });
              if (matchedItem) {
                console.log(`   ✓ Matched by company name: "${matchedItem.text.split('(')[0].trim()}"`);
              }
            }
            if (!matchedItem) {
              // Try matching by company code (e.g., "DEFCO" or "(DEFCO)")
              const codeToMatch = LOGIN_COMPANY.toUpperCase().replace(/[()]/g, '');
              matchedItem = menuItems.find(item => {
                const codeMatch = item.text.match(/\(([^)]+)\)/);
                if (codeMatch) {
                  return codeMatch[1].toUpperCase() === codeToMatch;
                }
                return false;
              });
              if (matchedItem) {
                const codeMatch = matchedItem.text.match(/\(([^)]+)\)/);
                console.log(`   ✓ Matched by company code: "${codeMatch ? codeMatch[1] : ''}"`);
              }
            }
            if (!matchedItem) {
              // Try partial match (case insensitive)
              matchedItem = menuItems.find(item => 
                item.text.toLowerCase().includes(LOGIN_COMPANY.toLowerCase()) ||
                LOGIN_COMPANY.toLowerCase().includes(item.text.toLowerCase())
              );
              if (matchedItem) {
                console.log(`   ✓ Matched by partial text`);
              }
            }
            
            if (matchedItem) {
              // Try to click the menu item
              try {
                const menuItem = await page.locator(`li[role="option"]:has-text("${matchedItem.text}")`).first();
                await menuItem.click({ timeout: 5000 });
                await page.waitForTimeout(1000);
                console.log(`   ✓ Selected company: ${matchedItem.text}`);
              } catch (e) {
                // Fallback: use JavaScript to set value
                await page.evaluate((value) => {
                  const select = document.querySelector('[name="company"]');
                  if (select) {
                    // Trigger change event
                    const event = new Event('change', { bubbles: true });
                    select.value = value;
                    select.dispatchEvent(event);
                  }
                }, matchedItem.value);
                await page.waitForTimeout(1000);
                console.log(`   ✓ Selected company via JS: ${matchedItem.text}`);
              }
            } else if (menuItems.length > 0) {
              // Select first available
              try {
                await page.locator('li[role="option"]').first().click({ timeout: 5000 });
                await page.waitForTimeout(1000);
                console.log(`   ⚠️  Selected first available company: ${menuItems[0].text}`);
              } catch (e) {
                console.log(`   ⚠️  Could not select company automatically`);
              }
            }
          } else {
            console.log(`   ⚠️  No company options found in dropdown`);
          }
        }
      } else {
        console.log(`   ⚠️  Company field not found - form may have changed`);
      }
    } catch (e) {
      console.log(`   ⚠️  Company selection error: ${e.message}`);
    }

    // Fill in username
    console.log(`   📝 Filling username: ${LOGIN_USERNAME}`);
    await page.fill('input[name="username"]', LOGIN_USERNAME);
    await page.waitForTimeout(500);

    // Fill in password
    console.log(`   📝 Filling password`);
    await page.fill('input[name="password"]', LOGIN_PASSWORD);
    await page.waitForTimeout(500);

    // Submit the form
    console.log(`   🔘 Clicking login button...`);
    await page.click('button[type="submit"]');
    await page.waitForTimeout(2000); // Wait a moment for form submission

    // Wait for navigation after login (either to dashboard or location selection)
    try {
      await page.waitForNavigation({ waitUntil: 'networkidle', timeout: 15000 });
      console.log(`   ✓ Navigation completed`);
    } catch (e) {
      // Navigation might have already happened or taking longer
      console.log(`   ℹ️  Waiting for navigation (may have already completed)`);
      await page.waitForTimeout(3000);
    }

    // Wait a bit for React to update state
    await page.waitForTimeout(2000);
    
    // Check current URL
    const currentUrl = page.url();
    console.log(`   📍 Current URL: ${currentUrl}`);
    
    // Check for error messages if still on login page
    if (currentUrl.includes('/login')) {
      try {
        const errorMessages = await page.$$eval('.MuiAlert-root, .error, [role="alert"]', elements => 
          elements.map(el => el.textContent.trim()).filter(text => text.length > 0)
        );
        if (errorMessages.length > 0) {
          console.log(`   ⚠️  Error messages found on page:`);
          errorMessages.forEach(msg => console.log(`      - ${msg}`));
        }
        
        // Check if company field is required and empty
        const companyField = await page.$('select[name="company"]');
        if (companyField) {
          const companyValue = await page.$eval('select[name="company"]', el => el.value);
          if (!companyValue || companyValue === '') {
            console.log(`   ⚠️  Company field appears to be required but is empty`);
            console.log(`   💡 Try providing company name or check if company selection is needed`);
          }
        }
      } catch (e) {
        // Error checking failed, continue
      }
    }

    // Check if we're on location selection page and handle it
    if (currentUrl.includes('/location-selection')) {
      console.log('   📍 On location selection page, selecting first location...');
      try {
        // Wait for location options to appear
        await page.waitForSelector('button, [role="button"], .MuiButton-root', { timeout: 5000 });
        // Click the first selectable location (usually a button or card)
        await page.click('button:first-of-type, [role="button"]:first-of-type').catch(() => {
          // If that doesn't work, try clicking any button with "Select" or "Continue"
          page.click('button:has-text("Select"), button:has-text("Continue")').catch(() => {});
        });
        await page.waitForNavigation({ waitUntil: 'networkidle', timeout: 10000 }).catch(() => {});
        await page.waitForTimeout(2000);
      } catch (e) {
        console.log('   ⚠️  Could not select location automatically');
      }
    }

    // Check if login was successful by checking localStorage for tokens
    const accessToken = await page.evaluate(() => {
      return localStorage.getItem('accessToken');
    });

    if (accessToken) {
      console.log('✅ Login successful!');
      return true;
    } else {
      // Check if we're still on login page (login failed)
      const finalUrl = page.url();
      if (finalUrl.includes('/login')) {
        console.log('❌ Login failed - still on login page');
        return false;
      }
      // Might have navigated but token not set yet, wait a bit more
      await page.waitForTimeout(2000);
      const accessToken2 = await page.evaluate(() => {
        return localStorage.getItem('accessToken');
      });
      if (accessToken2) {
        console.log('✅ Login successful!');
        return true;
      }
      console.log('⚠️  Login status unclear - proceeding anyway');
      return true; // Proceed optimistically
    }
  } catch (error) {
    console.log(`❌ Login error: ${error.message}`);
    return false;
  }
}

/**
 * Capture screenshot for a single route
 */
async function captureRouteScreenshot(page, route, isAuthenticated = false) {
  const url = `${BASE_URL}${route.path}`;
  const filename = `${sanitizeFilename(route.name)}.png`;
  const filepath = join(SCREENSHOTS_DIR, filename);
  
  try {
    console.log(`📸 Capturing ${route.path}...`);
    
    // Navigate to the route
    const response = await page.goto(url, {
      waitUntil: 'networkidle',
      timeout: 30000,
    });
    
    // Wait a bit for React to render
    await page.waitForTimeout(2000);
    
    // Check if redirected to login (protected route)
    const currentUrl = page.url();
    if (currentUrl.includes('/login') && !route.public) {
      // Only skip if we're not authenticated
      if (!isAuthenticated) {
        console.log(`   ⏭️  Skipped (protected route - redirected to login)`);
        return {
          route: route.path,
          name: route.name,
          category: route.category,
          status: 'skipped',
          reason: 'protected_route',
        };
      } else {
        // If authenticated but still redirected to login, there might be an issue
        console.log(`   ⚠️  Warning: Authenticated but redirected to login`);
      }
    }
    
    // Check if page loaded successfully
    if (!response || response.status() >= 400) {
      console.log(`   ❌ Failed (HTTP ${response?.status() || 'unknown'})`);
      return {
        route: route.path,
        name: route.name,
        category: route.category,
        status: 'failed',
        reason: `http_error_${response?.status() || 'unknown'}`,
      };
    }
    
    // Capture full-page screenshot
    await page.screenshot({
      path: filepath,
      fullPage: true,
    });
    
    console.log(`   ✅ Saved: ${filename}`);
    
    return {
      route: route.path,
      name: route.name,
      category: route.category,
      filename: filename,
      status: 'success',
      url: currentUrl,
    };
  } catch (error) {
    console.log(`   ❌ Error: ${error.message}`);
    return {
      route: route.path,
      name: route.name,
      category: route.category,
      status: 'error',
      reason: error.message,
    };
  }
}

/**
 * Main function
 */
async function main() {
  console.log('🚀 Starting screenshot capture...\n');
  
  // Create screenshots directory
  if (!existsSync(SCREENSHOTS_DIR)) {
    mkdirSync(SCREENSHOTS_DIR, { recursive: true });
    console.log(`📁 Created screenshots directory: ${SCREENSHOTS_DIR}\n`);
  }
  
  // Launch browser
  console.log('🌐 Launching browser...');
  const browser = await chromium.launch({
    headless: true,
  });
  
  const context = await browser.newContext({
    viewport: VIEWPORT,
  });
  
  const page = await context.newPage();
  
  // Check if server is running
  console.log(`🔍 Checking if server is running at ${BASE_URL}...`);
  const serverRunning = await checkServerRunning(page);
  if (!serverRunning) {
    console.error(`❌ Server is not running at ${BASE_URL}`);
    console.error('   Please start the frontend server with: npm run dev');
    await browser.close();
    process.exit(1);
  }
  console.log('✅ Server is running\n');
  
  // Attempt to login if credentials provided
  let isAuthenticated = false;
  if (LOGIN_USERNAME && LOGIN_PASSWORD) {
    isAuthenticated = await performLogin(page);
    if (isAuthenticated) {
      console.log('✅ Authenticated - will capture protected routes\n');
    } else {
      console.log('⚠️  Authentication failed - will only capture public routes\n');
    }
  } else {
    console.log('ℹ️  No credentials provided - will only capture public routes\n');
  }
  
  // Capture screenshots for all routes
  console.log(`\n📸 Capturing screenshots for ${ROUTES.length} routes...\n`);
  const results = [];
  
  for (const route of ROUTES) {
    const result = await captureRouteScreenshot(page, route, isAuthenticated);
    results.push(result);
  }
  
  // Close browser
  await browser.close();
  
  // Generate summary
  const summary = {
    timestamp: new Date().toISOString(),
    totalRoutes: ROUTES.length,
    successful: results.filter(r => r.status === 'success').length,
    skipped: results.filter(r => r.status === 'skipped').length,
    failed: results.filter(r => r.status === 'failed' || r.status === 'error').length,
    results: results,
  };
  
  // Save summary
  const summaryPath = join(SCREENSHOTS_DIR, 'summary.json');
  writeFileSync(summaryPath, JSON.stringify(summary, null, 2));
  
  // Print summary
  console.log('\n' + '='.repeat(60));
  console.log('📊 Summary');
  console.log('='.repeat(60));
  console.log(`Total routes: ${summary.totalRoutes}`);
  console.log(`✅ Successful: ${summary.successful}`);
  console.log(`⏭️  Skipped: ${summary.skipped}`);
  console.log(`❌ Failed: ${summary.failed}`);
  console.log(`\n📄 Summary saved to: ${summaryPath}`);
  console.log(`📁 Screenshots saved to: ${SCREENSHOTS_DIR}`);
  console.log('='.repeat(60));
  
  // Exit with appropriate code
  if (summary.failed > 0) {
    process.exit(1);
  }
}

// Run main function
main().catch((error) => {
  console.error('❌ Fatal error:', error);
  process.exit(1);
});

