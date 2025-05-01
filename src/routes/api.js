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
    const uniqueRelatedIds = new Set();
    
    // Priority 1: Complementary cards (based on card meanings/associations)
    let complementaryCards = [];
    
    if (targetCard.arcana === "大阿卡那") {
      // For major arcana, cards that sum to 21 are complementary (0+21, 1+20, etc.)
      complementaryCards = cards.filter(c => {
        if (c.id !== cardId && c.arcana === "大阿卡那") {
          // The Fool (0) and The World (21) are complementary
          if ((targetCard.rank === 0 && c.rank === 21) || (targetCard.rank === 21 && c.rank === 0)) {
            return true;
          }
          // Other major arcana cards that sum to 21 are complementary
          if (targetCard.rank > 0 && targetCard.rank < 21 && (c.rank + targetCard.rank === 21)) {
            return true;
          }
        }
        return false;
      });
    } else if (targetCard.suit) {
      // For minor arcana, cards of same rank but different suit can be complementary
      complementaryCards = cards.filter(c => 
        c.id !== cardId && 
        c.arcana === "小阿卡那" && 
        c.rank === targetCard.rank && 
        c.suit !== targetCard.suit
      );
    }
    
    // Add complementary cards first (they're most relevant)
    for (const card of complementaryCards) {
      if (relatedCards.length < 4 && !uniqueRelatedIds.has(card.id)) {
        relatedCards.push(card);
        uniqueRelatedIds.add(card.id);
      }
    }
    
    // Priority 2: Same suit (for minor arcana) or adjacent numbers (for major arcana)
    if (targetCard.arcana === "大阿卡那") {
      // For major arcana, adjacent numbers are related
      const adjacentRanks = [targetCard.rank - 1, targetCard.rank + 1].filter(r => r >= 0 && r <= 21);
      const adjacentCards = cards.filter(c => 
        c.id !== cardId && 
        c.arcana === "大阿卡那" && 
        adjacentRanks.includes(c.rank)
      );
      
      for (const card of adjacentCards) {
        if (relatedCards.length < 4 && !uniqueRelatedIds.has(card.id)) {
          relatedCards.push(card);
          uniqueRelatedIds.add(card.id);
        }
      }
    } else if (targetCard.suit) {
      // For minor arcana, same suit cards are related (especially adjacent ranks)
      const sameSuitCards = cards.filter(c => 
        c.id !== cardId && 
        c.suit === targetCard.suit
      ).sort((a, b) => {
        // Sort by how close they are to the target rank
        const distA = Math.abs(a.rank - targetCard.rank);
        const distB = Math.abs(b.rank - targetCard.rank);
        return distA - distB;
      });
      
      for (const card of sameSuitCards) {
        if (relatedCards.length < 4 && !uniqueRelatedIds.has(card.id)) {
          relatedCards.push(card);
          uniqueRelatedIds.add(card.id);
        }
      }
    }
    
    // Priority 3: Same arcana (fill remaining slots)
    const sameArcanaCards = cards.filter(c => 
      c.id !== cardId && c.arcana === targetCard.arcana && !uniqueRelatedIds.has(c.id)
    );
    
    for (const card of sameArcanaCards) {
      if (relatedCards.length < 4 && !uniqueRelatedIds.has(card.id)) {
        relatedCards.push(card);
        uniqueRelatedIds.add(card.id);
      }
    }
    
    // If we still need more cards, add random ones
    if (relatedCards.length < 4) {
      const randomCards = cards.filter(c => 
        c.id !== cardId && !uniqueRelatedIds.has(c.id)
      ).sort(() => 0.5 - Math.random());
      
      for (const card of randomCards) {
        if (relatedCards.length < 4) {
          relatedCards.push(card);
          uniqueRelatedIds.add(card.id);
        } else {
          break;
        }
      }
    }
    
    return res.json({
      success: true,
      relatedCards
    });
  } catch (error) {
    console.error('Error getting related cards:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to get related cards'
    });
  }
});

module.exports = router; 