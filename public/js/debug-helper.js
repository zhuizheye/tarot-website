/**
 * Debug Helper Script
 * This script helps diagnose issues with page loading and i18n functionality
 */

(function() {
  console.log('Debug Helper loaded');
  
  // Check if the page elements are properly loaded
  function checkPageElements() {
    console.log('--- Page Elements Check ---');
    
    // Critical elements for the app
    const criticalElements = [
      { id: 'header-component', name: 'Header Component' },
      { id: 'footer-component', name: 'Footer Component' },
      { id: 'tarot-deck', name: 'Tarot Deck' },
      { id: 'draw-button', name: 'Draw Button' },
      { id: 'language-selector', name: 'Language Selector' }
    ];
    
    let allFound = true;
    criticalElements.forEach(element => {
      const el = document.getElementById(element.id);
      if (el) {
        console.log(`✅ ${element.name} found`);
      } else {
        console.log(`❌ ${element.name} NOT found`);
        allFound = false;
      }
    });
    
    // Check i18n status
    console.log('--- i18n Status ---');
    if (window.i18n) {
      console.log(`✅ i18n object exists`);
      console.log(`- Initialized: ${window.i18n.isInitialized}`);
      console.log(`- Current Language: ${window.i18n.currentLanguage}`);
      
      // Test a translation
      try {
        const testKey = 'navigation.home';
        const translation = window.i18n.t(testKey);
        console.log(`- Test translation for "${testKey}": "${translation}"`);
      } catch (e) {
        console.log(`❌ Error testing translation: ${e.message}`);
      }
    } else {
      console.log(`❌ i18n object NOT found`);
      allFound = false;
    }
    
    // Check for required scripts
    console.log('--- Script Loading Check ---');
    const requiredScripts = [
      { name: 'GSAP', test: () => typeof gsap !== 'undefined' },
      { name: 'i18n.js', test: () => typeof i18n !== 'undefined' },
      { name: 'app.js', test: () => document.querySelector('script[src*="app.js"]') !== null }
    ];
    
    requiredScripts.forEach(script => {
      if (script.test()) {
        console.log(`✅ ${script.name} loaded`);
      } else {
        console.log(`❌ ${script.name} NOT loaded`);
        allFound = false;
      }
    });
    
    return allFound;
  }
  
  // Add a visual debug panel
  function createDebugPanel() {
    const panel = document.createElement('div');
    panel.style.cssText = `
      position: fixed;
      bottom: 0;
      right: 0;
      width: 300px;
      background: rgba(0, 0, 0, 0.8);
      color: #00ff00;
      font-family: monospace;
      padding: 10px;
      font-size: 12px;
      max-height: 300px;
      overflow-y: auto;
      z-index: 9999;
      border-top-left-radius: 5px;
    `;
    panel.id = 'debug-panel';
    
    const header = document.createElement('div');
    header.textContent = '🐞 Debug Panel';
    header.style.cssText = `
      font-weight: bold;
      margin-bottom: 5px;
      cursor: pointer;
      display: flex;
      justify-content: space-between;
    `;
    
    const status = document.createElement('div');
    status.id = 'debug-status';
    status.style.cssText = `flex: 1; margin-left: 10px;`;
    
    const toggleButton = document.createElement('button');
    toggleButton.textContent = '−';
    toggleButton.style.cssText = `
      background: none;
      border: none;
      color: #00ff00;
      cursor: pointer;
    `;
    
    const content = document.createElement('div');
    content.id = 'debug-content';
    
    let hidden = false;
    toggleButton.addEventListener('click', () => {
      if (hidden) {
        content.style.display = 'block';
        toggleButton.textContent = '−';
      } else {
        content.style.display = 'none';
        toggleButton.textContent = '+';
      }
      hidden = !hidden;
    });
    
    header.appendChild(status);
    header.appendChild(toggleButton);
    panel.appendChild(header);
    panel.appendChild(content);
    document.body.appendChild(panel);
    
    return { panel, content, status };
  }
  
  // Run diagnostics and populate debug panel
  function runDiagnostics() {
    const { content, status } = createDebugPanel();
    
    // Initial check
    const allOk = checkPageElements();
    
    status.textContent = allOk ? '✅ All OK' : '❌ Issues detected';
    status.style.color = allOk ? '#00ff00' : '#ff0000';
    
    // Add detected issues to debug panel
    content.innerHTML = `
      <div>Page loaded at: ${new Date().toLocaleTimeString()}</div>
      <div>URL: ${window.location.href}</div>
      <div>Language: ${document.documentElement.lang}</div>
      <div>i18n language: ${window.i18n ? window.i18n.currentLanguage : 'Not available'}</div>
      <div>Local Storage Language: ${localStorage.getItem('preferredLanguage') || 'Not set'}</div>
      <hr>
      <div style="margin-top: 5px;">
        <strong>Debug Actions:</strong>
        <button id="refresh-i18n">Refresh i18n</button>
        <button id="refresh-components">Reload Components</button>
        <button id="clear-storage">Clear Storage</button>
      </div>
    `;
    
    // Add action handlers
    document.getElementById('refresh-i18n').addEventListener('click', () => {
      if (window.i18n && typeof window.i18n.init === 'function') {
        window.i18n.init();
        alert('i18n reinitialized');
      } else {
        alert('i18n object not available');
      }
    });
    
    document.getElementById('refresh-components').addEventListener('click', () => {
      if (typeof loadHeaderComponent === 'function' && typeof loadFooterComponent === 'function') {
        loadHeaderComponent();
        loadFooterComponent();
        alert('Components reloaded');
      } else {
        alert('Component functions not available');
      }
    });
    
    document.getElementById('clear-storage').addEventListener('click', () => {
      localStorage.clear();
      alert('Local storage cleared. Page will reload.');
      window.location.reload();
    });
  }
  
  // Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', runDiagnostics);
  } else {
    // DOM already loaded
    runDiagnostics();
  }
})(); 