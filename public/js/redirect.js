// 语言重定向脚本
(function() {
  // 只在网站根目录执行重定向
  if (window.location.pathname === '/' || window.location.pathname === '/index.html') {
    // 获取浏览器语言
    const browserLang = navigator.language || navigator.userLanguage;
    
    // 检查是否为中文用户
    if (browserLang.startsWith('zh')) {
      // 重定向到中文版本
      window.location.href = '/zh' + window.location.search;
    }
    // 对于其他语言，保留在英文版默认页面
  }
})(); 