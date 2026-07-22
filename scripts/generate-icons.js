// Kidoro Icon Generator
// Run: node scripts/generate-icons.js

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const ASSETS_DIR = path.join(__dirname, '..', 'assets');

async function generateIcons() {
  console.log('=== Generating Kidoro App Icons ===\n');

  // Main source: user's app-icon.webp (512x512)
  const appIcon = path.join(ASSETS_DIR, 'app-icon.webp');
  // YouTube icon source: user's yt_icon.svg
  const youtubeLogo = path.join(ASSETS_DIR, 'yt_icon.svg');

  // 1. Main app icon (1024x1024)
  console.log('1. Generating icon.png (1024×1024)...');
  await sharp(appIcon)
    .resize(1024, 1024)
    .png()
    .toFile(path.join(ASSETS_DIR, 'icon.png'));
  console.log('   ✅ icon.png created\n');

  // 2. Android adaptive icon (1024x1024)
  console.log('2. Generating adaptive-icon.png (1024×1024)...');
  await sharp(appIcon)
    .resize(1024, 1024)
    .png()
    .toFile(path.join(ASSETS_DIR, 'adaptive-icon.png'));
  console.log('   ✅ adaptive-icon.png created\n');

  // 3. Splash icon (1024x1024)
  console.log('3. Generating splash-icon.png (1024×1024)...');
  await sharp(appIcon)
    .resize(1024, 1024)
    .png()
    .toFile(path.join(ASSETS_DIR, 'splash-icon.png'));
  console.log('   ✅ splash-icon.png created\n');

  // 4. YouTube icon (1024x1024)
  console.log('4. Generating icon-youtube.png (1024×1024)...');
  await sharp(youtubeLogo)
    .resize(1024, 1024)
    .png()
    .toFile(path.join(ASSETS_DIR, 'icon-youtube.png'));
  console.log('   ✅ icon-youtube.png created\n');

  // 5. YouTube adaptive icon (1024x1024) - transparent bg for Android
  const youtubeAdaptive = path.join(ASSETS_DIR, 'yt-icon-adaptive.svg');
  console.log('5. Generating adaptive-icon-youtube.png (1024×1024)...');
  await sharp(youtubeAdaptive)
    .resize(1024, 1024)
    .png()
    .toFile(path.join(ASSETS_DIR, 'adaptive-icon-youtube.png'));
  console.log('   ✅ adaptive-icon-youtube.png created\n');

  // 6. Favicon (48x48)
  console.log('6. Generating favicon.png (48×48)...');
  await sharp(appIcon)
    .resize(48, 48)
    .png()
    .toFile(path.join(ASSETS_DIR, 'favicon.png'));
  console.log('   ✅ favicon.png created\n');

  // Verify files
  console.log('=== Verifying generated files ===');
  const files = ['icon.png', 'adaptive-icon.png', 'splash-icon.png', 'icon-youtube.png', 'adaptive-icon-youtube.png', 'favicon.png'];
  for (const file of files) {
    const filePath = path.join(ASSETS_DIR, file);
    if (fs.existsSync(filePath)) {
      const stats = fs.statSync(filePath);
      const sizeKB = (stats.size / 1024).toFixed(1);
      console.log(`   📄 ${file}: ${sizeKB} KB`);
    } else {
      console.log(`   ❌ ${file}: MISSING`);
    }
  }

  console.log('\n=== All icons generated successfully! ===');
}

generateIcons().catch(err => {
  console.error('Error generating icons:', err);
  process.exit(1);
});
