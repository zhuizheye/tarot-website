// Navigation Components - Create reusable header and footer

document.addEventListener('DOMContentLoaded', function() {
  // 检查组件是否应该加载
  const headerComponent = document.getElementById('header-component');
  const footerComponent = document.getElementById('footer-component');

  // 插入页眉组件
  if (headerComponent) {
    headerComponent.innerHTML = `
      <header class="outer-header">
        <div class="app-container">
          <header>
            <h1><a href="/" title="Return to Home" data-i18n-title="navigation.returnHome"><i class="fas fa-moon"></i> RWS <span data-i18n="navigation.tarotTitle">Tarot Guide</span> <i class="fas fa-sun"></i></a></h1>
            <div style="display: flex; align-items: center;">
              <nav>
                <ul class="nav-list">
                  <li><a href="/" id="nav-home" data-i18n="navigation.home">Home</a></li>
                  <li><a href="/cards-list.html" id="nav-cards" data-i18n="navigation.cardsList">Cards List</a></li>
                  <li><a href="/readings.html" id="nav-readings" data-i18n="navigation.readings">Readings</a></li>
                  <li><a href="/about.html" id="nav-about" data-i18n="navigation.about">About</a></li>
                </ul>
              </nav>
              <div class="language-selector-container">
                <label for="language-selector" data-i18n="navigation.language">Language</label>
                <select id="language-selector" class="language-selector">
                  <option value="en-US">English</option>
                  <option value="zh-CN">中文</option>
                </select>
              </div>
            </div>
          </header>
        </div>
      </header>
    `;
  }
  
  // 插入页脚组件
  if (footerComponent) {
    footerComponent.innerHTML = `
      <footer class="outer-footer">
        <div class="app-container">
          <footer>
            <div class="footer-nav">
              <ul>
                <li><a href="/" data-i18n="navigation.home">Home</a></li>
                <li><a href="/cards-list.html" data-i18n="navigation.cardsList">Cards List</a></li>
                <li><a href="/readings.html" data-i18n="navigation.readings">Readings</a></li>
                <li><a href="/about.html" data-i18n="navigation.about">About</a></li>
              </ul>
            </div>
            <p>Rider-Waite-Smith <span data-i18n="navigation.tarotTitle">Tarot Guide</span> &copy; <script>document.write(new Date().getFullYear())</script></p>
          </footer>
        </div>
      </footer>
    `;
  }
  
  // 设置当前页面的活动导航项
  setActiveNavItem();
  
  // 初始化语言选择器行为
  initLanguageSelector();
});

// 设置活动导航项的函数
function setActiveNavItem() {
  // 获取当前页面URL路径
  const path = window.location.pathname;
  
  // 提取不包含语言前缀的实际路径
  let actualPath = path;
  if (path.startsWith('/zh/')) {
    actualPath = path.substring(3); // 移除/zh/前缀
  } else if (path === '/zh') {
    actualPath = '/';
  }
  
  // 移除所有导航项的'active'类
  document.querySelectorAll('.nav-list a').forEach(item => {
    item.classList.remove('active');
  });
  
  // 为匹配的导航项添加'active'类
  if (actualPath === '/' || actualPath === '/index.html') {
    document.getElementById('nav-home')?.classList.add('active');
  } else if (actualPath.includes('/cards-list.html') || actualPath.includes('/cards/')) {
    document.getElementById('nav-cards')?.classList.add('active');
  } else if (actualPath.includes('/readings.html') || actualPath.includes('/three-card-spread')) {
    document.getElementById('nav-readings')?.classList.add('active');
  } else if (actualPath.includes('/about.html')) {
    document.getElementById('nav-about')?.classList.add('active');
  }
}

// 初始化语言选择器
function initLanguageSelector() {
  const selector = document.getElementById('language-selector');
  if (selector && typeof i18n !== 'undefined') {
    // 设置当前语言
    selector.value = i18n.currentLanguage;
    
    // 添加切换语言事件
    selector.addEventListener('change', function() {
      i18n.changeLanguage(this.value);
    });
  }
} 