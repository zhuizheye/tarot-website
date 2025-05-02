// Internationalization (i18n) helper functions
const i18n = {
  currentLanguage: 'en-US',  // 默认为英文
  defaultLanguage: 'en-US',  // 默认语言改为英文
  supportedLanguages: ['en-US', 'zh-CN'],
  translations: {},
  isInitialized: false,

  // 从当前URL路径确定语言
  detectLanguageFromPath: function() {
    const path = window.location.pathname;
    
    // 检查路径是否以/zh开头
    if (path.startsWith('/zh/') || path === '/zh') {
      return 'zh-CN';
    }
    
    // 默认英文
    return 'en-US';
  },

  // 初始化i18n系统
  init: async function() {
    if (this.isInitialized) return;
    
    // 从URL路径确定当前语言
    this.currentLanguage = this.detectLanguageFromPath();
    
    // 设置文档语言属性
    document.documentElement.lang = this.currentLanguage.split('-')[0];
    
    // 加载翻译
    await this.loadTranslations(this.currentLanguage);
    
    // 应用翻译到页面
    this.updatePageLanguage();
    
    // 更新语言选择器
    this.updateLanguageSelector();
    
    this.isInitialized = true;
  },

  // 加载翻译
  loadTranslations: async function(lang) {
    try {
      const response = await fetch(`/translations/${lang}.json`);
      if (!response.ok) throw new Error(`Failed to load translations for ${lang}`);
      this.translations = await response.json();
    } catch (error) {
      console.error('Error loading translations:', error);
      // 如果加载失败，尝试加载默认语言
      if (lang !== this.defaultLanguage) {
        await this.loadTranslations(this.defaultLanguage);
      }
    }
  },
  
  // 获取翻译内容
  t: function(key) {
    const keys = key.split('.');
    let result = this.translations;
    
    for (const k of keys) {
      if (result && result[k]) {
        result = result[k];
      } else {
        console.warn(`Translation missing for key: ${key}`);
        return key; // 如果找不到翻译，返回键名
      }
    }
    
    return result;
  },
  
  // 切换语言 - 基于URL
  changeLanguage: function(lang) {
    if (this.supportedLanguages.includes(lang) && lang !== this.currentLanguage) {
      // 获取当前路径，不包括语言前缀
      let currentPath = window.location.pathname;
      let currentSearch = window.location.search || '';
      
      // 移除当前语言路径前缀(如果存在)
      if (this.currentLanguage === 'zh-CN' && currentPath.startsWith('/zh')) {
        currentPath = currentPath.replace(/^\/zh/, '') || '/';
      }
      
      // 根据新语言构建URL
      let newUrl;
      if (lang === 'zh-CN') {
        // 中文版添加/zh前缀
        newUrl = '/zh' + (currentPath === '/' ? '' : currentPath) + currentSearch;
      } else {
        // 英文版使用原始路径
        newUrl = currentPath + currentSearch;
      }
      
      // 导航到新URL
      window.location.href = newUrl;
    }
  },
  
  // 获取当前页面在另一语言中的URL
  getUrlInOtherLanguage: function(targetLang) {
    if (!this.supportedLanguages.includes(targetLang)) return '';
    
    // 获取当前路径
    let currentPath = window.location.pathname;
    let currentSearch = window.location.search || '';
    
    // 当前是中文版
    if (this.currentLanguage === 'zh-CN' && currentPath.startsWith('/zh')) {
      if (targetLang === 'en-US') {
        // 转换为英文URL - 移除/zh前缀
        return currentPath.replace(/^\/zh/, '') || '/' + currentSearch;
      }
      return currentPath + currentSearch; // 已经是中文
    } 
    // 当前是英文版
    else {
      if (targetLang === 'zh-CN') {
        // 转换为中文URL - 添加/zh前缀
        return '/zh' + (currentPath === '/' ? '' : currentPath) + currentSearch;
      }
      return currentPath + currentSearch; // 已经是英文
    }
  },
  
  // 更新页面内容的语言
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
  },
  
  // 更新语言选择器UI
  updateLanguageSelector: function() {
    const selector = document.getElementById('language-selector');
    if (selector) {
      Array.from(selector.options).forEach(option => {
        option.selected = option.value === this.currentLanguage;
      });
    }
  },
  
  // 修复站内链接，确保保持当前语言
  fixLinks: function() {
    // 为站内链接添加正确的语言前缀
    document.querySelectorAll('a[href^="/"]').forEach(link => {
      const href = link.getAttribute('href');
      
      // 跳过已有语言前缀的链接或锚点链接
      if (href.startsWith('/zh/') || href === '/zh' || href.startsWith('/#')) {
        return;
      }
      
      // 中文模式下添加/zh前缀
      if (this.currentLanguage === 'zh-CN') {
        link.setAttribute('href', '/zh' + (href === '/' ? '' : href));
      }
    });
  }
};

// 页面加载完成后进行初始化
document.addEventListener('DOMContentLoaded', () => {
  i18n.init().then(() => {
    // 修复站内链接
    i18n.fixLinks();
  });
}); 