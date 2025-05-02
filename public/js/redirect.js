/**
 * 重定向脚本 - 根据浏览器语言自动重定向到相应语言版本
 */
(function() {
  // 只在网站根路径才执行自动重定向
  const path = window.location.pathname;
  if (path !== '/' && path !== '/index.html') return;

  // 检查是否已经访问过网站（有语言偏好）
  const hasVisited = localStorage.getItem('hasVisited');
  if (hasVisited) return;

  // 标记为已访问，避免未来自动重定向
  localStorage.setItem('hasVisited', 'true');

  // 获取浏览器语言
  const browserLang = navigator.language || navigator.userLanguage;
  
  // 如果是中文浏览器，重定向到中文版
  if (browserLang.startsWith('zh')) {
    window.location.href = '/zh' + window.location.search;
  }
  // 其他语言默认使用英文版（已经在根路径，无需重定向）
})(); 