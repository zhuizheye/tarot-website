// Internationalization (i18n) helper functions
const i18n = {
  currentLanguage: 'en-US',  // 默认为英文
  defaultLanguage: 'en-US',  // 默认语言改为英文
  supportedLanguages: ['en-US', 'zh-CN'],
  translations: {},
  isInitialized: false,
  safeHtmlMode: true,  // 安全模式下会转义HTML

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

    // 立即添加防闪烁样式
    this.addAntiFlashStyles();
    
    // 从URL路径确定当前语言
    this.currentLanguage = this.detectLanguageFromPath();
    
    // 设置文档语言属性
    document.documentElement.lang = this.currentLanguage.split('-')[0];
    
    try {
      // 加载翻译
      await this.loadTranslations(this.currentLanguage);
      
      // 应用翻译到页面
      this.updatePageLanguage();
      
      // 更新语言选择器
      this.updateLanguageSelector();
      
      // 修复站内链接
      this.fixLinks();
    } finally {
      // 移除防闪烁样式，显示内容
      this.removeAntiFlashStyles();
      this.isInitialized = true;
    }
  },

  // 添加防止闪烁的样式
  addAntiFlashStyles: function() {
    // 创建一个样式标签
    const style = document.createElement('style');
    style.id = 'i18n-anti-flash';
    style.textContent = `
      /* 隐藏所有带data-i18n属性的元素，直到翻译应用完成 */
      [data-i18n], [data-i18n-html], [data-i18n-placeholder], [data-i18n-title], [data-i18n-value], [data-i18n-alt] {
        opacity: 0;
        transition: opacity 0.2s ease-in-out;
      }
      /* 确保页面整体可见，只是翻译内容暂时不可见 */
      body {
        visibility: visible;
      }
    `;
    document.head.appendChild(style);
  },

  // 移除防闪烁样式
  removeAntiFlashStyles: function() {
    // 移除样式标签并设置元素可见
    const style = document.getElementById('i18n-anti-flash');
    if (style) {
      // 先将所有元素设为可见
      document.querySelectorAll('[data-i18n], [data-i18n-html], [data-i18n-placeholder], [data-i18n-title], [data-i18n-value], [data-i18n-alt]')
        .forEach(el => el.style.opacity = '1');
      
      // 短暂延迟后移除样式，确保过渡效果
      setTimeout(() => {
        style.remove();
      }, 100);
    }
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
  t: function(key, params = {}) {
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
    
    // 如果结果是字符串，处理参数替换
    if (typeof result === 'string') {
      // 替换参数，格式为 {{paramName}}
      result = this.replaceParams(result, params);
      
      // 如果处于安全模式且不是HTML内容，则转义HTML
      if (this.safeHtmlMode && !key.endsWith('.html')) {
        result = this.escapeHTML(result);
      }
    }
    
    return result;
  },
  
  // 替换翻译文本中的参数
  replaceParams: function(text, params) {
    return text.replace(/\{\{(\w+)\}\}/g, (match, paramName) => {
      return params[paramName] !== undefined ? params[paramName] : match;
    });
  },
  
  // 转义HTML特殊字符
  escapeHTML: function(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
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
    // 处理data-i18n属性的元素 - 文本内容
    document.querySelectorAll('[data-i18n]').forEach(element => {
      const key = element.getAttribute('data-i18n');
      const params = this.getParamsFromElement(element);
      element.innerHTML = this.t(key, params);
    });
    
    // 处理data-i18n-html属性的元素 - HTML内容
    document.querySelectorAll('[data-i18n-html]').forEach(element => {
      const key = element.getAttribute('data-i18n-html');
      const params = this.getParamsFromElement(element);
      // 使用.html结尾的键名表示这是HTML内容
      element.innerHTML = this.t(`${key}.html`, params);
    });
    
    // 处理data-i18n-placeholder属性的元素
    document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
      const key = element.getAttribute('data-i18n-placeholder');
      const params = this.getParamsFromElement(element);
      element.placeholder = this.t(key, params);
    });
    
    // 处理data-i18n-title属性的元素
    document.querySelectorAll('[data-i18n-title]').forEach(element => {
      const key = element.getAttribute('data-i18n-title');
      const params = this.getParamsFromElement(element);
      element.title = this.t(key, params);
    });
    
    // 处理data-i18n-value属性的元素
    document.querySelectorAll('[data-i18n-value]').forEach(element => {
      const key = element.getAttribute('data-i18n-value');
      const params = this.getParamsFromElement(element);
      element.value = this.t(key, params);
    });
    
    // 处理data-i18n-alt属性的元素（图片alt文本）
    document.querySelectorAll('[data-i18n-alt]').forEach(element => {
      const key = element.getAttribute('data-i18n-alt');
      const params = this.getParamsFromElement(element);
      element.alt = this.t(key, params);
    });
  },
  
  // 从元素中提取参数
  getParamsFromElement: function(element) {
    const params = {};
    
    // 获取所有data-i18n-param-*属性
    const attributes = element.attributes;
    for (let i = 0; i < attributes.length; i++) {
      const attr = attributes[i];
      if (attr.name.startsWith('data-i18n-param-')) {
        const paramName = attr.name.substring('data-i18n-param-'.length);
        params[paramName] = attr.value;
      }
    }
    
    return params;
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

// 立即检测语言并添加防闪烁样式
(function() {
  const currentLang = i18n.detectLanguageFromPath();
  document.documentElement.lang = currentLang.split('-')[0];
  
  // 添加语言类以便于CSS选择器使用
  document.documentElement.classList.add(`lang-${currentLang}`);
  
  // 如果是中文页面，提前设置html和body的字体
  if (currentLang === 'zh-CN') {
    document.documentElement.style.fontFamily = "'Noto Serif SC', serif";
  }
  
  // 添加防闪烁样式
  i18n.addAntiFlashStyles();
})();

// 页面加载完成后进行完整初始化
document.addEventListener('DOMContentLoaded', () => {
  i18n.init();
}); 