/**
 * Tarot card drawing API handler
 * This file handles the card drawing functionality for the website
 */

const fs = require('fs');
const path = require('path');

// Path to JSON data files
const CARDS_DATA_PATH = path.join(__dirname, '../data/cards.json');
const INTERPRETATIONS_DATA_PATH = path.join(__dirname, '../data/interpretations.json');

// Cache for cards and interpretations data
let cardsCache = null;
let interpretationsCache = null;

/**
 * Load cards data from JSON file
 * @returns {Array} Array of card objects
 */
function loadCardsData() {
  if (cardsCache) return cardsCache;
  
  try {
    const data = fs.readFileSync(CARDS_DATA_PATH, 'utf8');
    cardsCache = JSON.parse(data);
    return cardsCache;
  } catch (error) {
    console.error('Error loading cards data:', error);
    return [];
  }
}

/**
 * Load interpretations data from JSON file
 * @returns {Object} Object containing card interpretations
 */
function loadInterpretationsData() {
  if (interpretationsCache) return interpretationsCache;
  
  try {
    const data = fs.readFileSync(INTERPRETATIONS_DATA_PATH, 'utf8');
    interpretationsCache = JSON.parse(data);
    return interpretationsCache;
  } catch (error) {
    console.error('Error loading interpretations data:', error);
    return {};
  }
}

/**
 * Draw a random card from the deck
 * @returns {Object} Random card object
 */
function drawRandomCard() {
  const cards = loadCardsData();
  if (cards.length === 0) {
    throw new Error('No cards available');
  }
  
  const randomIndex = Math.floor(Math.random() * cards.length);
  const card = cards[randomIndex];
  
  // Randomly determine if the card is reversed (approximately 30% chance)
  card.is_reversed = Math.random() < 0.3;
  
  return card;
}

/**
 * Get interpretation for a specific card
 * @param {Object} card Card object
 * @returns {Object} Card interpretation
 */
function getCardInterpretation(card) {
  const interpretations = loadInterpretationsData();
  const cardInterpretation = interpretations[card.english_name];
  
  if (!cardInterpretation) {
    // Fallback interpretation if not found
    return {
      story_background: `${card.name} (${card.english_name}) 的故事背景暂无数据。`,
      symbolism: `${card.name} 的象征意义暂无数据。`,
      love: `${card.name} 在感情方面的解读暂无数据。`,
      career: `${card.name} 在事业方面的解读暂无数据。`,
      study: `${card.name} 在学业方面的解读暂无数据。`,
      overall: `${card.name} 的整体解读暂无数据。`
    };
  }
  
  // Get upright or reversed interpretation based on card orientation
  const orientation = card.is_reversed ? 'reversed' : 'upright';
  return cardInterpretation[orientation];
}

/**
 * API handler for drawing a tarot card
 * @param {Object} req Express request object
 * @param {Object} res Express response object
 */
function handleDrawCard(req, res) {
  try {
    const card = drawRandomCard();
    const interpretation = getCardInterpretation(card);
    
    res.json({
      success: true,
      card,
      interpretation
    });
  } catch (error) {
    console.error('Error handling draw card request:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to draw a card'
    });
  }
}

/**
 * API handler for drawing multiple tarot cards
 * @param {Object} req Express request object
 * @param {Object} res Express response object
 */
function handleDrawMultipleCards(req, res) {
  try {
    const count = parseInt(req.body.count) || 3;
    const drawnCards = [];
    const usedIndices = new Set();
    
    const cards = loadCardsData();
    if (cards.length === 0) {
      throw new Error('No cards available');
    }
    
    // Draw unique cards
    for (let i = 0; i < count; i++) {
      let randomIndex;
      
      // Ensure we don't draw the same card twice
      do {
        randomIndex = Math.floor(Math.random() * cards.length);
      } while (usedIndices.has(randomIndex));
      
      usedIndices.add(randomIndex);
      const card = { ...cards[randomIndex] };
      
      // Randomly determine if the card is reversed
      card.is_reversed = Math.random() < 0.3;
      
      // Get interpretation for the card
      const interpretation = getCardInterpretation(card);
      
      drawnCards.push({
        card,
        interpretation
      });
    }
    
    res.json({
      success: true,
      cards: drawnCards
    });
  } catch (error) {
    console.error('Error handling draw multiple cards request:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to draw cards'
    });
  }
}

/**
 * API handler for getting all cards
 * @param {Object} req Express request object
 * @param {Object} res Express response object
 */
function getAllCards(req, res) {
  try {
    const cards = loadCardsData();
    res.json(cards);
  } catch (error) {
    console.error('Error handling get all cards request:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get cards'
    });
  }
}

module.exports = {
  handleDrawCard,
  handleDrawMultipleCards,
  getAllCards,
  drawRandomCard,
  getCardInterpretation,
  loadCardsData,
  loadInterpretationsData
}; 