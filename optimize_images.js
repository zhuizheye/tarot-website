// Script to optimize tarot card images for web display
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

// Path to the tarot card images
const imageDir = path.join(__dirname, 'public/images/tarot');
const outputDir = path.join(__dirname, 'public/images/tarot/optimized');

// Create output directory if it doesn't exist
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Configure optimization settings
const config = {
  width: 500, // Optimal width for web display
  quality: 80, // JPEG quality (0-100)
  format: 'jpeg'
};

// Function to optimize images
async function optimizeImages() {
  try {
    // Get all image files
    const files = fs.readdirSync(imageDir);
    const imageFiles = files.filter(file => 
      file.endsWith('.jpg') && !file.includes('optimized')
    );
    
    console.log(`Found ${imageFiles.length} images to optimize`);
    
    // Process each image
    for (const file of imageFiles) {
      const inputPath = path.join(imageDir, file);
      const outputPath = path.join(outputDir, file);
      
      try {
        await sharp(inputPath)
          .resize({
            width: config.width,
            withoutEnlargement: true
          })
          .jpeg({ quality: config.quality })
          .toFile(outputPath);
        
        console.log(`✓ Optimized: ${file}`);
      } catch (err) {
        console.error(`✗ Error optimizing ${file}: ${err.message}`);
      }
    }
    
    console.log('\nOptimization complete!');
    console.log(`Original images: ${imageDir}`);
    console.log(`Optimized images: ${outputDir}`);
  } catch (err) {
    console.error(`Error processing images: ${err.message}`);
  }
}

// Execute the optimization
console.log('Starting image optimization...');
optimizeImages(); 