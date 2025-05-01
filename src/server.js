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