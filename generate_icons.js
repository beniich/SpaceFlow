const fs = require('fs');
const path = require('path');

const sharpPath = path.join(__dirname, 'node_modules', 'sharp');
let sharp;
try {
  sharp = require(sharpPath);
} catch (e) {
  sharp = require('sharp');
}

const svgPath = path.join(__dirname, 'frontend/public/favicon.svg');
const outDir = path.join(__dirname, 'frontend/public/icons');

if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

const sizes = [16, 32, 72, 96, 128, 144, 152, 180, 192, 256, 384, 512];

async function generate() {
  const svgBuffer = fs.readFileSync(svgPath);

  for (const size of sizes) {
    let filename = `icon-${size}x${size}.png`;
    if (size === 180) filename = 'apple-touch-icon.png';
    else if (size === 16) filename = 'favicon-16x16.png';
    else if (size === 32) filename = 'favicon-32x32.png';
    
    await sharp(svgBuffer)
      .resize(size, size)
      .png()
      .toFile(path.join(outDir, filename));
      
    console.log(`Generated ${filename}`);
  }
}

generate().catch(console.error);
