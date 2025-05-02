// Navigation Components - Create reusable header and footer

document.addEventListener('DOMContentLoaded', function() {
  // Insert the header component
  const headerPlaceholder = document.getElementById('header-component');
  if (headerPlaceholder) {
    headerPlaceholder.innerHTML = `
      <header class="outer-header">
        <div class="app-container">
          <header>
            <h1><a href="/" title="返回首页" data-i18n-title="navigation.returnHome"><i class="fas fa-moon"></i> RWS <span data-i18n="navigation.tarotTitle">塔罗牌解说</span> <i class="fas fa-sun"></i></a></h1>
            <div style="display: flex; align-items: center;">
              <nav>
                <ul class="nav-list">
                  <li><a href="/" id="nav-home" data-i18n="navigation.home">首页</a></li>
                  <li><a href="/cards-list.html" id="nav-cards" data-i18n="navigation.cardsList">塔罗牌列表</a></li>
                  <li><a href="/readings.html" id="nav-readings" data-i18n="navigation.readings">牌阵解读</a></li>
                  <li><a href="/about.html" id="nav-about" data-i18n="navigation.about">关于我们</a></li>
                </ul>
              </nav>
              <div class="language-selector-container">
                <label for="language-selector" data-i18n="navigation.language">语言</label>
                <select id="language-selector" class="language-selector" onchange="i18n.changeLanguage(this.value)">
                  <option value="zh-CN">中文</option>
                  <option value="en-US">English</option>
                </select>
              </div>
            </div>
          </header>
        </div>
      </header>
    `;
  }
  
  // Insert the footer component
  const footerPlaceholder = document.getElementById('footer-component');
  if (footerPlaceholder) {
    footerPlaceholder.innerHTML = `
      <footer class="outer-footer">
        <div class="app-container">
          <footer>
            <div class="footer-nav">
              <ul>
                <li><a href="/" data-i18n="navigation.home">首页</a></li>
                <li><a href="/cards-list.html" data-i18n="navigation.cardsList">塔罗牌列表</a></li>
                <li><a href="/readings.html" data-i18n="navigation.readings">牌阵解读</a></li>
                <li><a href="/about.html" data-i18n="navigation.about">关于我们</a></li>
              </ul>
            </div>
            <p>Rider-Waite-Smith <span data-i18n="navigation.tarotTitle">塔罗牌解说</span> &copy; <script>document.write(new Date().getFullYear())</script></p>
          </footer>
        </div>
      </footer>
    `;
  }
  
  // Set active navigation state based on current page
  setActiveNavItem();
  
  // Apply current language to the components
  if (typeof i18n !== 'undefined') {
    // Update language selector to match saved preference
    const savedLang = localStorage.getItem('preferredLanguage');
    if (savedLang) {
      const selector = document.getElementById('language-selector');
      if (selector) {
        selector.value = savedLang;
      }
    }
    
    // Apply translations to all component elements
    setTimeout(() => {
      i18n.updatePageLanguage();
    }, 100);
  }
});

// Function to set the active navigation item
function setActiveNavItem() {
  // Get the current page URL path
  const path = window.location.pathname;
  
  // Remove 'active' class from all navigation items
  document.querySelectorAll('.nav-list a').forEach(item => {
    item.classList.remove('active');
  });
  
  // Add 'active' class to the matching navigation item
  if (path === '/' || path === '/index.html') {
    document.getElementById('nav-home')?.classList.add('active');
  } else if (path.includes('/cards-list.html') || path.includes('/cards/')) {
    document.getElementById('nav-cards')?.classList.add('active');
  } else if (path.includes('/readings.html') || path.includes('/three-card-spread')) {
    document.getElementById('nav-readings')?.classList.add('active');
  } else if (path.includes('/about.html')) {
    document.getElementById('nav-about')?.classList.add('active');
  }
} 