/**
 * Génère les icônes PWA à partir du SVG source
 * Usage: node scripts/generate-icons.js
 */
import { readFileSync, existsSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const require = createRequire(import.meta.url);

const sizes = [
  { name: 'icon-72x72.png',         size: 72  },
  { name: 'icon-96x96.png',         size: 96  },
  { name: 'icon-128x128.png',       size: 128 },
  { name: 'icon-144x144.png',       size: 144 },
  { name: 'icon-152x152.png',       size: 152 },
  { name: 'icon-192x192.png',       size: 192 },
  { name: 'icon-384x384.png',       size: 384 },
  { name: 'icon-512x512.png',       size: 512 },
  { name: 'badge-72x72.png',        size: 72  },
  { name: 'favicon-32x32.png',      size: 32  },
  { name: 'apple-touch-icon.png',   size: 180 },
];

const sourceSvg = join(__dirname, '../public/icons/icon.svg');
const outputDir = join(__dirname, '../public/icons');

if (!existsSync(outputDir)) mkdirSync(outputDir, { recursive: true });

console.log('🕷️  Génération des icônes PWA...\n');

async function run() {
  let sharp;
  try {
    sharp = require('sharp');
  } catch (e) {
    console.error('❌ sharp non installé. Exécutez : npm install -D sharp');
    process.exit(1);
  }

  const svgBuffer = readFileSync(sourceSvg);

  for (const { name, size } of sizes) {
    await sharp(svgBuffer)
      .resize(size, size, { fit: 'contain', background: { r: 15, g: 23, b: 42, alpha: 1 } })
      .png({ quality: 100, compressionLevel: 9 })
      .toFile(join(outputDir, name));
    console.log(`✅ ${name.padEnd(30)} (${size}x${size})`);
  }

  console.log('\n✨ Toutes les icônes générées avec sharp !');
}

run().catch(err => {
  console.error('❌ Erreur:', err.message);
  process.exit(1);
});

