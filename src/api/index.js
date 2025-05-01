const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, '../../public')));

// Load card data
let cards = [];
let interpretations = {};

try {
  const cardsData = fs.readFileSync(path.join(__dirname, '../data/cards.json'), 'utf8');
  cards = JSON.parse(cardsData);
  
  const interpretationsData = fs.readFileSync(path.join(__dirname, '../data/interpretations.json'), 'utf8');
  interpretations = JSON.parse(interpretationsData);
  
  console.log(`Loaded ${cards.length} cards and interpretations for ${Object.keys(interpretations).length} cards`);
} catch (error) {
  console.error('Error loading data:', error);
  process.exit(1);
}

// 创建卡牌的URL友好名称
function createSlug(name) {
  return name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w\-]+/g, '');
}

// 为所有卡牌添加slug属性
cards.forEach(card => {
  card.slug = createSlug(card.english_name);
});

// API Endpoints
app.post('/api/draw_card', (req, res) => {
  try {
    // 仅从有解释的牌中随机选择一张
    const availableCards = cards.filter(card => 
      interpretations[card.english_name] !== undefined || 
      interpretations[card.name] !== undefined);
    
    if (availableCards.length === 0) {
      throw new Error('No cards with interpretations available');
    }
    
    // 从可用牌中随机选择
    const randomIndex = Math.floor(Math.random() * availableCards.length);
    const selectedCard = availableCards[randomIndex];
    
    // Determine if the card is upright or reversed (approximately 50% chance)
    const isReversed = Math.random() < 0.5;
    
    // 首先尝试使用英文名查找，然后尝试中文名
    let cardKey = selectedCard.english_name;
    if (!interpretations[cardKey]) {
      cardKey = selectedCard.name;
    }
    
    const orientation = isReversed ? 'reversed' : 'upright';
    const interpretation = interpretations[cardKey][orientation];
    
    // Return the card data and interpretation
    res.json({
      card: {
        ...selectedCard,
        is_reversed: isReversed
      },
      interpretation
    });
  } catch (error) {
    console.error('Error drawing card:', error);
    res.status(500).json({ error: 'Failed to draw card' });
  }
});

// API获取所有卡牌数据(用于生成网站地图)
app.get('/api/cards', (req, res) => {
  try {
    const cardsWithInterpretation = cards.filter(card => 
      interpretations[card.english_name] !== undefined || 
      interpretations[card.name] !== undefined);
    
    res.json(cardsWithInterpretation);
  } catch (error) {
    console.error('Error fetching cards:', error);
    res.status(500).json({ error: 'Failed to fetch cards' });
  }
});

// API获取特定卡牌数据
app.get('/api/cards/:slug', (req, res) => {
  try {
    const { slug } = req.params;
    const card = cards.find(c => c.slug === slug);
    
    if (!card) {
      return res.status(404).json({ error: 'Card not found' });
    }
    
    let cardKey = card.english_name;
    if (!interpretations[cardKey]) {
      cardKey = card.name;
    }
    
    if (!interpretations[cardKey]) {
      return res.status(404).json({ error: 'Interpretation not found' });
    }
    
    res.json({
      card,
      interpretations: interpretations[cardKey]
    });
  } catch (error) {
    console.error('Error fetching card:', error);
    res.status(500).json({ error: 'Failed to fetch card' });
  }
});

// 单卡页面路由 - 服务端渲染
app.get('/cards/:slug', (req, res) => {
  const { slug } = req.params;
  const card = cards.find(c => c.slug === slug);
  
  if (!card) {
    return res.redirect('/');
  }
  
  let cardKey = card.english_name;
  if (!interpretations[cardKey]) {
    cardKey = card.name;
  }
  
  if (!interpretations[cardKey]) {
    return res.redirect('/');
  }
  
  // 渲染卡牌的HTML页面
  const cardHtml = generateCardHtml(card, interpretations[cardKey]);
  res.send(cardHtml);
});

// 网站地图生成
app.get('/sitemap.xml', (req, res) => {
  const availableCards = cards.filter(card => 
    interpretations[card.english_name] !== undefined || 
    interpretations[card.name] !== undefined);
  
  // 生成XML
  let xml = '<?xml version="1.0" encoding="UTF-8"?>';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';
  
  // 添加首页
  xml += `
    <url>
      <loc>http://${req.headers.host}/</loc>
      <changefreq>weekly</changefreq>
      <priority>1.0</priority>
    </url>
  `;
  
  // 添加每张卡牌的页面
  availableCards.forEach(card => {
    xml += `
      <url>
        <loc>http://${req.headers.host}/cards/${card.slug}</loc>
        <changefreq>monthly</changefreq>
        <priority>0.8</priority>
      </url>
    `;
  });
  
  xml += '</urlset>';
  
  res.header('Content-Type', 'application/xml');
  res.send(xml);
});

// 生成卡牌详情页面的HTML
function generateCardHtml(card, cardInterpretations) {
  return `
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${card.name} (${card.english_name}) - 塔罗牌详解 | RWS 塔罗牌解说</title>
  <meta name="description" content="${card.name}牌是Rider-Waite-Smith塔罗牌中的一张重要牌面，代表着${cardInterpretations.upright.symbolism.substring(0, 50)}...">
  <link rel="canonical" href="/cards/${card.slug}">
  <meta property="og:title" content="${card.name} (${card.english_name}) - 塔罗牌详解">
  <meta property="og:description" content="${card.name}牌是Rider-Waite-Smith塔罗牌中的一张重要牌面，正位时象征着${cardInterpretations.upright.symbolism.substring(0, 80)}...">
  <meta property="og:image" content="/images/tarot/optimized/${card.image_filename}">
  <meta property="og:url" content="/cards/${card.slug}">
  <meta property="og:type" content="article">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
  <link rel="stylesheet" href="/css/styles.css">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Noto+Serif+SC:wght@400;700&family=Playfair+Display:ital,wght@0,400;0,700;1,400&display=swap" rel="stylesheet">
  
  <!-- 结构化数据 -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": "${card.name} (${card.english_name}) - 塔罗牌详解",
    "image": "/images/tarot/optimized/${card.image_filename}",
    "author": {
      "@type": "Organization",
      "name": "RWS 塔罗牌解说"
    },
    "publisher": {
      "@type": "Organization",
      "name": "RWS 塔罗牌解说",
      "logo": {
        "@type": "ImageObject",
        "url": "/images/logo.png"
      }
    },
    "description": "${card.name}牌是Rider-Waite-Smith塔罗牌中的一张重要牌面，本文详细解释了该牌在正位与逆位状态下的各种含义解读。"
  }
  </script>
</head>
<body>
  <div class="app-container">
    <header>
      <h1><a href="/" title="返回首页"><i class="fas fa-moon"></i> RWS 塔罗牌解说 <i class="fas fa-sun"></i></a></h1>
      <nav>
        <ul class="nav-list">
          <li><a href="/">首页</a></li>
          <li><a href="/cards-list.html">塔罗牌列表</a></li>
        </ul>
      </nav>
    </header>
    
    <main>
      <article class="card-detail">
        <header class="card-header">
          <h1>${card.name} (${card.english_name})</h1>
          <p class="card-meta">${card.arcana} | ${card.suit ? card.suit : ''}</p>
        </header>
        
        <div class="card-showcase">
          <div class="card-image">
            <img src="/images/tarot/optimized/${card.image_filename}" alt="${card.name} (${card.english_name})" title="${card.name} 塔罗牌">
          </div>
          
          <div class="card-basic-info">
            <h2>基本信息</h2>
            <ul>
              <li><strong>牌面编号:</strong> ${card.id}</li>
              <li><strong>牌组类别:</strong> ${card.arcana}</li>
              ${card.suit ? `<li><strong>所属花色:</strong> ${card.suit}</li>` : ''}
              ${card.rank ? `<li><strong>序号/等级:</strong> ${card.rank}</li>` : ''}
            </ul>
          </div>
        </div>
        
        <section class="interpretation-section">
          <h2>牌面解释</h2>
          
          <div class="interpretation-tabs">
            <div class="tab-header">
              <h3>正位解释</h3>
            </div>
            <div class="tab-content">
              <div class="interpretation-item">
                <h4>故事背景</h4>
                <p>${cardInterpretations.upright.story_background}</p>
              </div>
              
              <div class="interpretation-item">
                <h4>象征意义</h4>
                <p>${cardInterpretations.upright.symbolism}</p>
              </div>
              
              <div class="interpretation-item">
                <h4>感情解读</h4>
                <p>${cardInterpretations.upright.love}</p>
              </div>
              
              <div class="interpretation-item">
                <h4>事业解读</h4>
                <p>${cardInterpretations.upright.career}</p>
              </div>
              
              <div class="interpretation-item">
                <h4>学业解读</h4>
                <p>${cardInterpretations.upright.study}</p>
              </div>
              
              <div class="interpretation-item">
                <h4>整体概括</h4>
                <p>${cardInterpretations.upright.overall}</p>
              </div>
            </div>
          </div>
          
          <div class="interpretation-tabs">
            <div class="tab-header">
              <h3>逆位解释</h3>
            </div>
            <div class="tab-content">
              <div class="interpretation-item">
                <h4>故事背景</h4>
                <p>${cardInterpretations.reversed.story_background}</p>
              </div>
              
              <div class="interpretation-item">
                <h4>象征意义</h4>
                <p>${cardInterpretations.reversed.symbolism}</p>
              </div>
              
              <div class="interpretation-item">
                <h4>感情解读</h4>
                <p>${cardInterpretations.reversed.love}</p>
              </div>
              
              <div class="interpretation-item">
                <h4>事业解读</h4>
                <p>${cardInterpretations.reversed.career}</p>
              </div>
              
              <div class="interpretation-item">
                <h4>学业解读</h4>
                <p>${cardInterpretations.reversed.study}</p>
              </div>
              
              <div class="interpretation-item">
                <h4>整体概括</h4>
                <p>${cardInterpretations.reversed.overall}</p>
              </div>
            </div>
          </div>
        </section>
        
        <section class="related-cards">
          <h2>相关塔罗牌</h2>
          <div class="related-cards-list">
            ${generateRelatedCardsHTML(card, cards)}
          </div>
        </section>
      </article>
    </main>
    
    <footer>
      <div class="footer-nav">
        <ul>
          <li><a href="/">首页</a></li>
          <li><a href="/cards-list.html">塔罗牌列表</a></li>
          <li><a href="/about.html">关于我们</a></li>
        </ul>
      </div>
      <p>Rider-Waite-Smith 塔罗牌解说 &copy; ${new Date().getFullYear()}</p>
    </footer>
  </div>
</body>
</html>
  `;
}

// 生成相关卡牌HTML
function generateRelatedCardsHTML(currentCard, allCards) {
  // 根据卡牌类型、花色等筛选相关卡牌
  let relatedCards = allCards.filter(card => {
    // 避免当前卡牌
    if (card.id === currentCard.id) return false;
    
    // 同一种类别的卡牌
    if (card.arcana === currentCard.arcana) return true;
    
    // 同一种花色的卡牌
    if (currentCard.suit && card.suit === currentCard.suit) return true;
    
    return false;
  });
  
  // 限制相关卡牌数量为4个
  relatedCards = relatedCards.slice(0, 4);
  
  if (relatedCards.length === 0) return '<p>没有相关卡牌</p>';
  
  let html = '<ul class="cards-grid">';
  relatedCards.forEach(card => {
    html += `
      <li>
        <a href="/cards/${card.slug}" title="${card.name} (${card.english_name})">
          <div class="card-thumbnail">
            <img src="/images/tarot/optimized/${card.image_filename}" alt="${card.name}">
          </div>
          <h3>${card.name}</h3>
        </a>
      </li>
    `;
  });
  html += '</ul>';
  
  return html;
}

// 生成卡牌列表页面
app.get('/cards-list.html', (req, res) => {
  const availableCards = cards.filter(card => 
    interpretations[card.english_name] !== undefined || 
    interpretations[card.name] !== undefined);
  
  const html = generateCardsListHtml(availableCards);
  res.send(html);
});

// 生成卡牌列表HTML
function generateCardsListHtml(cards) {
  // 将卡牌按大阿卡那和小阿卡那分组
  const majorArcana = cards.filter(card => card.arcana === '大阿卡那');
  const minorArcana = cards.filter(card => card.arcana === '小阿卡那');
  
  return `
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>塔罗牌列表 - RWS 塔罗牌解说</title>
  <meta name="description" content="完整的Rider-Waite-Smith塔罗牌列表，包含所有大阿卡那和小阿卡那牌面的详细解释和图像。">
  <link rel="canonical" href="/cards-list.html">
  <meta property="og:title" content="塔罗牌完整列表 - RWS 塔罗牌解说">
  <meta property="og:description" content="浏览Rider-Waite-Smith塔罗牌全部78张牌面，了解每张牌的含义和解释。">
  <meta property="og:url" content="/cards-list.html">
  <meta property="og:type" content="website">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
  <link rel="stylesheet" href="/css/styles.css">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Noto+Serif+SC:wght@400;700&family=Playfair+Display:ital,wght@0,400;0,700;1,400&display=swap" rel="stylesheet">
</head>
<body>
  <div class="app-container">
    <header>
      <h1><a href="/" title="返回首页"><i class="fas fa-moon"></i> RWS 塔罗牌解说 <i class="fas fa-sun"></i></a></h1>
      <nav>
        <ul class="nav-list">
          <li><a href="/">首页</a></li>
          <li><a href="/cards-list.html" class="active">塔罗牌列表</a></li>
        </ul>
      </nav>
    </header>
    
    <main>
      <section class="cards-list">
        <h1>塔罗牌完整列表</h1>
        
        <div class="arcana-section">
          <h2>大阿卡那 (Major Arcana)</h2>
          <p>大阿卡那牌代表生活中的重大主题和精神力量，通常反映人生中的重要转折点和精神旅程。</p>
          
          <div class="cards-grid">
            ${majorArcana.map(card => `
              <div class="card-item">
                <a href="/cards/${card.slug}" title="${card.name} (${card.english_name})">
                  <div class="card-thumbnail">
                    <img src="/images/tarot/optimized/${card.image_filename}" alt="${card.name}">
                  </div>
                  <h3>${card.name}</h3>
                  <p class="card-english-name">${card.english_name}</p>
                </a>
              </div>
            `).join('')}
          </div>
        </div>
        
        <div class="arcana-section">
          <h2>小阿卡那 (Minor Arcana)</h2>
          <p>小阿卡那牌反映日常生活中的起伏和挑战，通常代表我们面对的实际情况和短期事件。</p>
          
          <div class="cards-grid">
            ${minorArcana.map(card => `
              <div class="card-item">
                <a href="/cards/${card.slug}" title="${card.name} (${card.english_name})">
                  <div class="card-thumbnail">
                    <img src="/images/tarot/optimized/${card.image_filename}" alt="${card.name}">
                  </div>
                  <h3>${card.name}</h3>
                  <p class="card-english-name">${card.english_name}</p>
                </a>
              </div>
            `).join('')}
          </div>
        </div>
      </section>
    </main>
    
    <footer>
      <div class="footer-nav">
        <ul>
          <li><a href="/">首页</a></li>
          <li><a href="/cards-list.html">塔罗牌列表</a></li>
          <li><a href="/about.html">关于我们</a></li>
        </ul>
      </div>
      <p>Rider-Waite-Smith 塔罗牌解说 &copy; ${new Date().getFullYear()}</p>
    </footer>
  </div>
</body>
</html>
  `;
}

// Catch-all route to serve the main app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../../public/index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app; 