// Script to rename tarot card image files to match the expected format
const fs = require('fs');
const path = require('path');

// Load the cards data to get the expected filenames
const cardsData = JSON.parse(fs.readFileSync(path.join(__dirname, 'src/data/cards.json'), 'utf8'));

// Define mapping from current filenames to expected filenames
const filenameMapping = {};

// Current files in the images directory
const imageDir = path.join(__dirname, 'public/images/tarot');
const currentFiles = fs.readdirSync(imageDir);

// Create mapping from original names to target names
// For Major Arcana (0-21)
const majorArcanaMapping = {
  "0 – The Fool.jpg": "00_The_Fool.jpg",
  "I – The Magician.jpg": "01_The_Magician.jpg",
  "II – The High Priestess.jpg": "02_The_High_Priestess.jpg",
  "III – The Empress.jpg": "03_The_Empress.jpg",
  "IV – The Emperor.jpg": "04_The_Emperor.jpg",
  "V – The Hierophant.jpg": "05_The_Hierophant.jpg",
  "VI – The Lovers.jpg": "06_The_Lovers.jpg",
  "VII – The Chariot.jpg": "07_The_Chariot.jpg",
  "VIII – Strength.jpg": "08_Strength.jpg",
  "IX – The Hermit.jpg": "09_The_Hermit.jpg",
  "X – Wheel of Fortune.jpg": "10_Wheel_of_Fortune.jpg",
  "XI – Justice.jpg": "11_Justice.jpg",
  "XII – The Hanged Man.jpg": "12_The_Hanged_Man.jpg",
  "XIII – Death.jpg": "13_Death.jpg",
  "XIV – Temperance.jpg": "14_Temperance.jpg",
  "XV – The Devil.jpg": "15_The_Devil.jpg",
  "XVI – The Tower.jpg": "16_The_Tower.jpg",
  "XVII – The Star.jpg": "17_The_Star.jpg",
  "XVIII – The Moon.jpg": "18_The_Moon.jpg",
  "XIX – The Sun.jpg": "19_The_Sun.jpg",
  "XX – Judgement.jpg": "20_Judgement.jpg",
  "XXI – The World.jpg": "21_The_World.jpg"
};

// Minor Arcana - Wands (22-35)
const wandsMapping = {
  "Ace of Wands.jpg": "35_Ace_of_Wands.jpg",
  "Two of Wands.jpg": "22_Two_of_Wands.jpg",
  "Three of Wands.jpg": "23_Three_of_Wands.jpg",
  "Four of Wands.jpg": "24_Four_of_Wands.jpg",
  "Five of Wands.jpg": "25_Five_of_Wands.jpg",
  "Six of Wands.jpg": "26_Six_of_Wands.jpg",
  "Seven of Wands.jpg": "27_Seven_of_Wands.jpg",
  "Eight of Wands.jpg": "28_Eight_of_Wands.jpg",
  "Nine of Wands.jpg": "29_Nine_of_Wands.jpg",
  "Ten of Wands.jpg": "30_Ten_of_Wands.jpg",
  "Page of Wands.jpg": "31_Page_of_Wands.jpg",
  "Knight of Wands.jpg": "32_Knight_of_Wands.jpg",
  "Queen of Wands.jpg": "33_Queen_of_Wands.jpg",
  "King of Wands.jpg": "34_King_of_Wands.jpg"
};

// Minor Arcana - Cups (36-49)
const cupsMapping = {
  "Ace of Cups.jpg": "49_Ace_of_Cups.jpg",
  "Two of Cups.jpg": "36_Two_of_Cups.jpg",
  "Three of Cups.jpg": "37_Three_of_Cups.jpg",
  "Four of Cups.jpg": "38_Four_of_Cups.jpg",
  "Five of Cups.jpg": "39_Five_of_Cups.jpg",
  "Six of Cups.jpg": "40_Six_of_Cups.jpg",
  "Seven of Cups.jpg": "41_Seven_of_Cups.jpg",
  "Eight of Cups.jpg": "42_Eight_of_Cups.jpg",
  "Nine of Cups.jpg": "43_Nine_of_Cups.jpg",
  "Ten of Cups.jpg": "44_Ten_of_Cups.jpg",
  "Page of Cups.jpg": "45_Page_of_Cups.jpg",
  "Knight of Cups.jpg": "46_Knight_of_Cups.jpg",
  "Queen of Cups.jpg": "47_Queen_of_Cups.jpg",
  "King of Cups.jpg": "48_King_of_Cups.jpg"
};

// Minor Arcana - Swords (50-63)
const swordsMapping = {
  "Ace of Swords.jpg": "63_Ace_of_Swords.jpg",
  "Two of Swords.jpg": "50_Two_of_Swords.jpg",
  "Three of Swords.jpg": "51_Three_of_Swords.jpg",
  "Four of Swords.jpg": "52_Four_of_Swords.jpg",
  "Five of Swords.jpg": "53_Five_of_Swords.jpg",
  "Six of Swords.jpg": "54_Six_of_Swords.jpg",
  "Seven of Swords.jpg": "55_Seven_of_Swords.jpg",
  "Eight of Swords.jpg": "56_Eight_of_Swords.jpg",
  "Nine of Swords.jpg": "57_Nine_of_Swords.jpg",
  "Ten of Swords.jpg": "58_Ten_of_Swords.jpg",
  "Page of Swords.jpg": "59_Page_of_Swords.jpg",
  "Knight of Swords.jpg": "60_Knight_of_Swords.jpg",
  "Queen of Swords.jpg": "61_Queen_of_Swords.jpg",
  "King of Swords.jpg": "62_King_of_Swords.jpg"
};

// Minor Arcana - Pentacles (64-77)
const pentaclesMapping = {
  "Ace of Pentacles.jpg": "77_Ace_of_Pentacles.jpg",
  "Two of Pentacles.jpg": "64_Two_of_Pentacles.jpg",
  "Three of Pentacles.jpg": "65_Three_of_Pentacles.jpg",
  "Four of Pentacles.jpg": "66_Four_of_Pentacles.jpg",
  "Five of Pentacles.jpg": "67_Five_of_Pentacles.jpg",
  "Six of Pentacles.jpg": "68_Six_of_Pentacles.jpg",
  "Seven of Pentacles.jpg": "69_Seven_of_Pentacles.jpg",
  "Eight of Pentacles.jpg": "70_Eight_of_Pentacles.jpg",
  "Nine of Pentacles.jpg": "71_Nine_of_Pentacles.jpg",
  "Ten of Pentacles.jpg": "72_Ten_of_Pentacles.jpg",
  "Page of Pentacles.jpg": "73_Page_of_Pentacles.jpg",
  "Knight of Pentacles.jpg": "74_Knight_of_Pentacles.jpg",
  "Queen of Pentacles.jpg": "75_Queen_of_Pentacles.jpg",
  "King of Pentacles.jpg": "76_King_of_Pentacles.jpg"
};

// Combine all mappings
const allMappings = {
  ...majorArcanaMapping,
  ...wandsMapping,
  ...cupsMapping,
  ...swordsMapping,
  ...pentaclesMapping
};

// Extract expected filenames from cards.json
const expectedFilenames = new Set(cardsData.map(card => card.image_filename));

// Verify our mapping against cards.json
for (const targetFilename of expectedFilenames) {
  let found = false;
  for (const [_, mappedName] of Object.entries(allMappings)) {
    if (mappedName === targetFilename) {
      found = true;
      break;
    }
  }
  if (!found) {
    console.log(`Warning: Expected filename ${targetFilename} not found in mapping`);
  }
}

// Function to rename files
function renameFiles() {
  console.log(`Found ${currentFiles.length} files in the images directory`);
  
  let renamedCount = 0;
  let errorCount = 0;
  
  for (const originalFile of currentFiles) {
    const targetFile = allMappings[originalFile];
    
    if (targetFile) {
      try {
        fs.renameSync(
          path.join(imageDir, originalFile),
          path.join(imageDir, targetFile)
        );
        console.log(`Renamed: ${originalFile} -> ${targetFile}`);
        renamedCount++;
      } catch (error) {
        console.error(`Error renaming ${originalFile}: ${error.message}`);
        errorCount++;
      }
    } else {
      console.log(`Skipping: ${originalFile} (no mapping found)`);
    }
  }
  
  console.log(`\nRenaming complete: ${renamedCount} files renamed, ${errorCount} errors`);
}

// Execute the renaming
renameFiles(); 