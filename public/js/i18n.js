// Internationalization (i18n) helper functions
const i18n = {
  currentLanguage: 'zh-CN',
  defaultLanguage: 'zh-CN',
  supportedLanguages: ['zh-CN', 'en-US'],
  translations: {},

  // Initialize i18n system
  init: async function() {
    // Try to load language preference from localStorage
    const savedLang = localStorage.getItem('preferredLanguage');
    
    if (savedLang && this.supportedLanguages.includes(savedLang)) {
      this.currentLanguage = savedLang;
    } else {
      // Default to browser language or fallback to default
      const browserLang = navigator.language;
      if (this.supportedLanguages.includes(browserLang)) {
        this.currentLanguage = browserLang;
      }
    }

    // Load translations for current language
    await this.loadTranslations(this.currentLanguage);
    
    // Apply translations to page
    this.updatePageLanguage();
    
    // Update language selector
    this.updateLanguageSelector();

    // Set document language attribute
    document.documentElement.lang = this.currentLanguage.split('-')[0];
  },

  // Load translation file for specified language
  loadTranslations: async function(lang) {
    try {
      const response = await fetch(`/translations/${lang}.json`);
      if (!response.ok) throw new Error(`Failed to load translations for ${lang}`);
      this.translations = await response.json();
    } catch (error) {
      console.error('Error loading translations:', error);
      // Fallback to default language if translation file can't be loaded
      if (lang !== this.defaultLanguage) {
        await this.loadTranslations(this.defaultLanguage);
      }
    }
  },
  
  // Get translation for a key
  t: function(key) {
    const keys = key.split('.');
    let result = this.translations;
    
    for (const k of keys) {
      if (result && result[k]) {
        result = result[k];
      } else {
        console.warn(`Translation missing for key: ${key}`);
        return key; // Return the key if translation not found
      }
    }
    
    return result;
  },
  
  // Switch language
  changeLanguage: async function(lang) {
    if (this.supportedLanguages.includes(lang) && lang !== this.currentLanguage) {
      this.currentLanguage = lang;
      localStorage.setItem('preferredLanguage', lang);
      await this.loadTranslations(lang);
      this.updatePageLanguage();
      this.updateLanguageSelector();
      
      // Handle URL structure if using path-based approach
      this.updateUrl(lang);
    }
  },
  
  // Update page content with new language
  updatePageLanguage: function() {
    document.querySelectorAll('[data-i18n]').forEach(element => {
      const key = element.getAttribute('data-i18n');
      element.textContent = this.t(key);
    });
    
    document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
      const key = element.getAttribute('data-i18n-placeholder');
      element.placeholder = this.t(key);
    });
    
    document.querySelectorAll('[data-i18n-title]').forEach(element => {
      const key = element.getAttribute('data-i18n-title');
      element.title = this.t(key);
    });
    
    // Update HTML lang attribute
    document.documentElement.lang = this.currentLanguage.split('-')[0];
  },
  
  // Update language selector UI
  updateLanguageSelector: function() {
    const selector = document.getElementById('language-selector');
    if (selector) {
      Array.from(selector.options).forEach(option => {
        option.selected = option.value === this.currentLanguage;
      });
    }
  },
  
  // Update URL to reflect current language
  updateUrl: function(lang) {
    // Skip URL update if using component approach with shared state
    // Uncomment if using path-based language approach
    /*
    const currentPath = window.location.pathname;
    const pathParts = currentPath.split('/').filter(p => p);
    
    // If first part is a language code, replace it
    if (this.supportedLanguages.includes(pathParts[0])) {
      pathParts[0] = lang;
    } else {
      // Otherwise insert language at beginning
      pathParts.unshift(lang);
    }
    
    const newPath = '/' + pathParts.join('/');
    window.history.pushState({}, '', newPath);
    */
  }
};

// Initialize i18n when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  i18n.init();
}); 