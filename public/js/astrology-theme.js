/**
 * 占星主题 - 动态星空背景和占星元素
 * 为塔罗牌网站添加宇宙和占星相关的视觉效果
 */
document.addEventListener('DOMContentLoaded', function() {
  // 在页面加载后添加效果，防止闪烁
  setTimeout(() => {
    // 创建主要容器
    createAstrologyBackground();
    
    // 添加占星符号
    addAstrologySymbols();
    
    // 添加银河效果
    createGalacticEffect();
    
    // 添加星座连线效果
    createConstellationLines();
    
    // 添加鼠标星尘跟随效果
    addStardustTrail();
    
    // 最后将页面设为已加载状态
    document.body.classList.add('loaded');
  }, 100);
});

/**
 * 创建星空背景
 */
function createAstrologyBackground() {
  // 检查星空背景是否已存在
  if (document.querySelector('.astrology-background')) return;
  
  // 创建星空容器
  const starsContainer = document.createElement('div');
  starsContainer.className = 'astrology-background';
  starsContainer.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: -1;
    overflow: hidden;
  `;
  document.body.appendChild(starsContainer);
  
  // 创建星星
  for (let i = 0; i < 150; i++) {
    createStar(starsContainer);
  }
  
  // 添加CSS星空样式
  addStarsCss();
}

/**
 * 创建单个星星元素
 */
function createStar(container) {
  const star = document.createElement('div');
  star.className = 'star';
  
  // 随机位置
  const top = Math.random() * 100;
  const left = Math.random() * 100;
  
  // 随机大小 (更多小星星，少数大星星)
  const size = Math.random() < 0.8 ? 
    (Math.random() * 2 + 0.5) : // 小星星 (80%)
    (Math.random() * 3 + 2);    // 大星星 (20%)
  
  // 随机亮度
  const opacity = Math.random() * 0.5 + 0.3;
  
  // 随机闪烁速度
  const animationDuration = Math.random() * 3 + 2;
  
  star.style.cssText = `
    position: absolute;
    top: ${top}%;
    left: ${left}%;
    width: ${size}px;
    height: ${size}px;
    background-color: #fff;
    border-radius: 50%;
    opacity: ${opacity};
    animation: twinkle ${animationDuration}s ease-in-out infinite alternate;
    box-shadow: 0 0 ${size * 2}px rgba(255, 255, 255, ${opacity});
  `;
  
  // 随机延迟动画开始时间
  star.style.animationDelay = `${Math.random() * 5}s`;
  
  container.appendChild(star);
}

/**
 * 添加星空动画所需的CSS样式
 */
function addStarsCss() {
  // 检查是否已添加
  if (document.getElementById('astrology-stars-css')) return;
  
  const styleSheet = document.createElement('style');
  styleSheet.id = 'astrology-stars-css';
  styleSheet.textContent = `
    @keyframes twinkle {
      0% { opacity: 0.3; transform: scale(0.8); }
      100% { opacity: 1; transform: scale(1); }
    }
    
    @keyframes shooting-star {
      0% { transform: translate(0, 0) rotate(45deg) scale(0); opacity: 0; }
      10% { transform: translate(-10%, 10%) rotate(45deg) scale(1); opacity: 1; }
      100% { transform: translate(-100%, 100%) rotate(45deg) scale(0.2); opacity: 0; }
    }
    
    @keyframes constellation-glow {
      0% { opacity: 0.3; }
      50% { opacity: 0.8; }
      100% { opacity: 0.3; }
    }
    
    @keyframes rotate-galaxy {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    
    @keyframes float {
      0% { transform: translateY(0) rotate(0deg); }
      50% { transform: translateY(-10px) rotate(2deg); }
      100% { transform: translateY(0) rotate(0deg); }
    }
    
    .cosmic-symbol {
      animation: float 8s ease infinite;
    }
    
    .stardust {
      position: absolute;
      width: 3px;
      height: 3px;
      background: rgba(255, 215, 0, 0.5);
      border-radius: 50%;
      pointer-events: none;
      opacity: 0;
      transition: opacity 0.3s;
    }
  `;
  
  document.head.appendChild(styleSheet);
}

/**
 * 添加随机占星符号作为装饰元素
 */
function addAstrologySymbols() {
  // 占星符号
  const symbols = [
    '♈', '♉', '♊', '♋', '♌', '♍', 
    '♎', '♏', '♐', '♑', '♒', '♓', 
    '☉', '☽', '☿', '♀', '♂', '♃', '♄', '⛢', '♆', '♇'
  ];
  
  // 添加到页面边缘位置
  const edges = [
    { top: '5%', left: '2%' },
    { top: '15%', right: '3%' },
    { top: '85%', left: '5%' },
    { top: '75%', right: '4%' }
  ];
  
  // 创建符号容器
  const symbolsContainer = document.createElement('div');
  symbolsContainer.className = 'astrology-symbols';
  symbolsContainer.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: -1;
  `;
  
  // 随机选择符号并放置
  edges.forEach(position => {
    const symbol = document.createElement('div');
    const randomSymbol = symbols[Math.floor(Math.random() * symbols.length)];
    
    symbol.className = 'cosmic-symbol fixed';
    symbol.textContent = randomSymbol;
    symbol.style.cssText = `
      position: absolute;
      font-size: 3rem;
      color: rgba(255, 215, 0, 0.15);
      animation: float ${8 + Math.random() * 4}s ease infinite;
      animation-delay: ${Math.random() * 2}s;
    `;
    
    // 设置位置
    Object.keys(position).forEach(key => {
      symbol.style[key] = position[key];
    });
    
    symbolsContainer.appendChild(symbol);
  });
  
  document.body.appendChild(symbolsContainer);
}

/**
 * 创建银河效果
 */
function createGalacticEffect() {
  const galaxy = document.createElement('div');
  galaxy.className = 'galaxy-effect';
  galaxy.style.cssText = `
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 100vmax;
    height: 100vmax;
    background: radial-gradient(ellipse at center, 
                                rgba(14, 27, 66, 0) 0%, 
                                rgba(14, 27, 66, 0) 40%, 
                                rgba(25, 33, 80, 0.2) 60%, 
                                rgba(50, 30, 100, 0.3) 100%);
    opacity: 0.3;
    pointer-events: none;
    z-index: -1;
    animation: rotate-galaxy 240s linear infinite;
  `;
  
  document.body.appendChild(galaxy);
  
  // 随机添加几个流星
  setInterval(createShootingStar, 8000);
}

/**
 * 创建流星效果
 */
function createShootingStar() {
  const shootingStar = document.createElement('div');
  shootingStar.className = 'shooting-star';
  
  // 随机位置
  const top = Math.random() * 30; // 仅在页面上方出现
  const left = Math.random() * 70 + 15; // 避免从最边缘开始
  
  shootingStar.style.cssText = `
    position: fixed;
    top: ${top}%;
    left: ${left}%;
    width: 100px;
    height: 1px;
    background: linear-gradient(90deg, rgba(255,215,0,0) 0%, rgba(255,215,0,0.8) 50%, rgba(255,255,255,1) 100%);
    box-shadow: 0 0 10px rgba(255, 255, 255, 0.7);
    border-radius: 50%;
    animation: shooting-star 3s ease-out forwards;
    z-index: -1;
    opacity: 0;
    pointer-events: none;
  `;
  
  document.body.appendChild(shootingStar);
  
  // 动画结束后移除元素
  setTimeout(() => {
    if (shootingStar && shootingStar.parentNode) {
      shootingStar.parentNode.removeChild(shootingStar);
    }
  }, 3000);
}

/**
 * 创建星座连线效果
 */
function createConstellationLines() {
  // 检查是否在内容页面
  const cardDetail = document.querySelector('.card-detail');
  if (!cardDetail) return;
  
  // 创建星座容器
  const constellation = document.createElement('div');
  constellation.className = 'constellation';
  constellation.style.cssText = `
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 0;
    opacity: 0.2;
  `;
  
  // 创建SVG星座线
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('width', '100%');
  svg.setAttribute('height', '100%');
  svg.style.cssText = `
    position: absolute;
    top: 0;
    left: 0;
  `;
  
  // 创建星座点和线
  const points = createRandomPoints(5, 8);
  
  // 添加点
  points.forEach(point => {
    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circle.setAttribute('cx', point.x + '%');
    circle.setAttribute('cy', point.y + '%');
    circle.setAttribute('r', '2');
    circle.setAttribute('fill', 'rgba(255, 215, 0, 0.8)');
    circle.setAttribute('class', 'constellation-star');
    circle.style.animation = `constellation-glow ${3 + Math.random() * 3}s ease-in-out infinite`;
    svg.appendChild(circle);
  });
  
  // 连接点
  for (let i = 0; i < points.length - 1; i++) {
    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.setAttribute('x1', points[i].x + '%');
    line.setAttribute('y1', points[i].y + '%');
    line.setAttribute('x2', points[i + 1].x + '%');
    line.setAttribute('y2', points[i + 1].y + '%');
    line.setAttribute('stroke', 'rgba(255, 215, 0, 0.3)');
    line.setAttribute('stroke-width', '1');
    svg.appendChild(line);
  }
  
  // 连接首尾点完成星座
  if (points.length > 2) {
    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.setAttribute('x1', points[0].x + '%');
    line.setAttribute('y1', points[0].y + '%');
    line.setAttribute('x2', points[points.length - 1].x + '%');
    line.setAttribute('y2', points[points.length - 1].y + '%');
    line.setAttribute('stroke', 'rgba(255, 215, 0, 0.3)');
    line.setAttribute('stroke-width', '1');
    svg.appendChild(line);
  }
  
  constellation.appendChild(svg);
  cardDetail.appendChild(constellation);
}

/**
 * 创建随机点
 */
function createRandomPoints(min, max) {
  const numPoints = Math.floor(Math.random() * (max - min + 1)) + min;
  const points = [];
  
  for (let i = 0; i < numPoints; i++) {
    points.push({
      x: Math.random() * 90 + 5, // 保持边距
      y: Math.random() * 90 + 5  // 保持边距
    });
  }
  
  return points;
}

/**
 * 添加鼠标星尘跟随效果
 */
function addStardustTrail() {
  let timeout;
  const stardusts = [];
  const maxStardusts = 20;
  
  // 创建星尘容器
  const container = document.createElement('div');
  container.className = 'stardust-container';
  container.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 9999;
  `;
  document.body.appendChild(container);
  
  // 鼠标移动时创建星尘
  document.addEventListener('mousemove', e => {
    // 清除定时器
    clearTimeout(timeout);
    
    // 创建新星尘
    const stardust = document.createElement('div');
    stardust.className = 'stardust';
    stardust.style.left = e.clientX + 'px';
    stardust.style.top = e.clientY + 'px';
    
    // 随机大小和颜色
    const size = Math.random() * 3 + 1;
    const hue = Math.random() < 0.7 ? 45 : 220; // 主要金色，少量蓝色
    const saturation = Math.random() * 20 + 80;
    const lightness = Math.random() * 20 + 70;
    
    stardust.style.width = size + 'px';
    stardust.style.height = size + 'px';
    stardust.style.backgroundColor = `hsla(${hue}, ${saturation}%, ${lightness}%, 0.8)`;
    stardust.style.boxShadow = `0 0 ${size * 2}px hsla(${hue}, ${saturation}%, ${lightness}%, 0.5)`;
    
    // 添加到容器
    container.appendChild(stardust);
    stardusts.push(stardust);
    
    // 显示星尘
    setTimeout(() => {
      stardust.style.opacity = Math.random() * 0.5 + 0.3;
      
      // 随机移动
      const angle = Math.random() * Math.PI * 2;
      const distance = Math.random() * 30 + 10;
      const x = Math.cos(angle) * distance;
      const y = Math.sin(angle) * distance;
      
      stardust.style.transition = `opacity 1.5s ease, transform 1.5s ease`;
      stardust.style.transform = `translate(${x}px, ${y}px)`;
    }, 10);
    
    // 移除过多的星尘
    if (stardusts.length > maxStardusts) {
      const oldStardust = stardusts.shift();
      oldStardust.style.opacity = 0;
      setTimeout(() => {
        if (oldStardust.parentNode) {
          oldStardust.parentNode.removeChild(oldStardust);
        }
      }, 1500);
    }
    
    // 设置超时，没有移动时隐藏星尘
    timeout = setTimeout(() => {
      stardusts.forEach(dust => {
        dust.style.opacity = 0;
      });
    }, 2000);
  });
  
  // 鼠标离开时隐藏星尘
  document.addEventListener('mouseleave', () => {
    stardusts.forEach(dust => {
      dust.style.opacity = 0;
    });
  });
}

// 为可悬停元素添加星象效果
document.addEventListener('DOMContentLoaded', function() {
  // 为卡片添加光晕效果
  const cardHovers = document.querySelectorAll('.card-item, .drawn-card, .card-frame');
  
  cardHovers.forEach(card => {
    card.classList.add('card-hover');
    
    // 鼠标移动时更新光晕位置
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      
      card.style.setProperty('--x', `${x}%`);
      card.style.setProperty('--y', `${y}%`);
    });
    
    // 鼠标离开时重置
    card.addEventListener('mouseleave', () => {
      card.style.setProperty('--x', '50%');
      card.style.setProperty('--y', '50%');
    });
  });
}); 