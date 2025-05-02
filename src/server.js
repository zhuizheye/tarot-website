/**
 * Main server file for the Tarot Application
 */

const express = require('express');
const path = require('path');
const fs = require('fs');
const apiRoutes = require('./routes/api');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, '../public')));

// API routes
app.use('/api', apiRoutes);

// 添加语言路径重写规则

// 处理中文路径请求，将/zh路径映射到实际文件
app.get('/zh', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/zh/index.html'));
});

// 处理中文下的页面请求
app.get('/zh/:page', (req, res) => {
  const page = req.params.page;
  const filePath = path.join(__dirname, '../public', page);
  
  // 检查文件是否存在
  if (fs.existsSync(filePath)) {
    res.sendFile(filePath);
  } else {
    // 如果直接文件不存在，尝试加.html后缀
    const htmlPath = filePath + '.html';
    if (fs.existsSync(htmlPath)) {
      res.sendFile(htmlPath);
    } else {
      // 文件不存在，返回404
      res.status(404).sendFile(path.join(__dirname, '../public/404.html'));
    }
  }
});

// 处理中文下的cards路径请求 (如 /zh/cards/the-fool)
app.get('/zh/cards/:cardSlug', (req, res) => {
  const cardSlug = req.params.cardSlug;
  
  // 检查是否有特定的卡牌页面
  const specificCardPath = path.join(__dirname, `../public/cards/${cardSlug}.html`);
  
  if (fs.existsSync(specificCardPath)) {
    // 如果存在特定卡牌页面，提供该页面
    res.sendFile(specificCardPath);
  } else {
    // 否则，提供模板页面让客户端JS处理细节
    res.sendFile(path.join(__dirname, '../public/card-template.html'));
  }
});

// 处理其他中文嵌套路径请求
app.get('/zh/:dir/:subpage', (req, res) => {
  const dir = req.params.dir;
  const subpage = req.params.subpage;
  
  // 跳过已经处理的cards路径
  if (dir === 'cards') return;
  
  const filePath = path.join(__dirname, '../public', dir, subpage);
  
  // 检查文件是否存在
  if (fs.existsSync(filePath)) {
    res.sendFile(filePath);
  } else {
    // 如果直接文件不存在，尝试加.html后缀
    const htmlPath = filePath + '.html';
    if (fs.existsSync(htmlPath)) {
      res.sendFile(htmlPath);
    } else {
      // 文件不存在，返回404
      res.status(404).sendFile(path.join(__dirname, '../public/404.html'));
    }
  }
});

// Handle individual card pages dynamically
app.get('/cards/:cardSlug', (req, res) => {
  const cardSlug = req.params.cardSlug;
  
  // Check if the specific card HTML file exists
  const specificCardPath = path.join(__dirname, `../public/cards/${cardSlug}.html`);
  
  if (fs.existsSync(specificCardPath)) {
    // If a specific card page exists, serve it
    res.sendFile(specificCardPath);
  } else {
    // Otherwise, serve a generic template and let client-side JS handle the specifics
    res.sendFile(path.join(__dirname, '../public/card-template.html'));
  }
});

// Handle 404 errors
app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, '../public/404.html'));
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('服务器错误，请稍后再试');
});

// Start server
app.listen(PORT, () => {
  console.log(`Tarot application server running on port ${PORT}`);
}); 