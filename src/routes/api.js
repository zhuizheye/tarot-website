/**
 * API Routes for the Tarot Application
 */

const express = require('express');
const router = express.Router();
const { 
  handleDrawCard, 
  handleDrawMultipleCards, 
  getAllCards 
} = require('../api/drawCard');

// Draw a single card
router.post('/draw_card', handleDrawCard);

// Draw multiple cards
router.post('/draw_multiple_cards', handleDrawMultipleCards);

// Get all cards
router.get('/cards', getAllCards);

// Get a specific card by name (slug)
router.get('/cards/:cardSlug', (req, res) => {
  try {
    const { loadCardsData, getCardInterpretation } = require('../api/drawCard');
    const cardSlug = req.params.cardSlug.toLowerCase();
    
    // Load all cards
    const cards = loadCardsData();
    
    // Find the card that matches the slug
    const card = cards.find(c => {
      const slug = c.english_name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w\-]+/g, '');
      return slug === cardSlug;
    });
    
    if (!card) {
      return res.status(404).json({
        success: false,
        error: 'Card not found'
      });
    }
    
    // Get both upright and reversed interpretations
    const interpretations = require('../data/interpretations.json');
    const cardInterpretation = interpretations[card.english_name];
    
    if (!cardInterpretation) {
      return res.status(404).json({
        success: false,
        error: 'Card interpretation not found'
      });
    }
    
    res.json({
      success: true,
      card,
      interpretations: {
        upright: cardInterpretation.upright,
        reversed: cardInterpretation.reversed
      }
    });
  } catch (error) {
    console.error('Error handling get card request:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get card details'
    });
  }
});

// Get related cards
router.get('/related_cards/:cardId', (req, res) => {
  try {
    const { loadCardsData } = require('../api/drawCard');
    const cardId = parseInt(req.params.cardId);
    
    // Load all cards
    const cards = loadCardsData();
    
    // Find the target card
    const targetCard = cards.find(c => c.id === cardId);
    
    if (!targetCard) {
      return res.status(404).json({
        success: false,
        error: 'Card not found'
      });
    }
    
    // Generate related cards based on various criteria
    const relatedCards = [];
    
    // 1. Same arcana
    const sameArcanaCards = cards.filter(c => 
      c.id !== cardId && c.arcana === targetCard.arcana
    );
    
    // 2. Same suit (for minor arcana)
    const sameSuitCards = cards.filter(c => 
      c.id !== cardId && c.suit === targetCard.suit && c.suit !== null
    );
    
    // 3. Complementary cards (based on card meanings/associations)
    // This would ideally be based on a predefined mapping of complementary cards
    // For simplicity, we'll use numerical relationships for now
    const complementaryCards = cards.filter(c => {
      if (targetCard.arcana === "大阿卡那" && c.arcana === "大阿卡那") {
        // For major arcana, cards that sum to 21 are complementary
        return c.id !== cardId && c.rank + targetCard.rank === 21;
      }
      return false;
    });
    
    // Build a unique set of related cards
    const uniqueRelatedIds = new Set();
    
    // Add complementary cards first (they're most relevant)
    for (const card of complementaryCards) {
      if (relatedCards.length < 4 && !uniqueRelatedIds.has(card.id)) {
        relatedCards.push(card);
        uniqueRelatedIds.add(card.id);
      }
    }
    
    // Add same suit cards next
    for (const card of sameSuitCards) {
      if (relatedCards.length < 4 && !uniqueRelatedIds.has(card.id)) {
        relatedCards.push(card);
        uniqueRelatedIds.add(card.id);
      }
    }
    
    // Add same arcana cards to fill remaining slots
    for (const card of sameArcanaCards) {
      if (relatedCards.length < 4 && !uniqueRelatedIds.has(card.id)) {
        relatedCards.push(card);
        uniqueRelatedIds.add(card.id);
      }
    }
    
    // If we still don't have 4 related cards, add random cards
    if (relatedCards.length < 4) {
      const randomCards = cards.filter(c => 
        c.id !== cardId && !uniqueRelatedIds.has(c.id)
      );
      
      for (const card of randomCards) {
        if (relatedCards.length < 4) {
          relatedCards.push(card);
          uniqueRelatedIds.add(card.id);
        } else {
          break;
        }
      }
    }
    
    res.json({
      success: true,
      relatedCards
    });
  } catch (error) {
    console.error('Error handling get related cards request:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get related cards'
    });
  }
});

module.exports = router; 