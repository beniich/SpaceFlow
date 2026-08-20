const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else if (file.endsWith('.js')) {
      results.push(file);
    }
  });
  return results;
}

const files = walk('./src');
files.push('./prisma/seed.js');
files.push('./prisma/sector-templates.seed.js');
files.push('./server.js');

let changed = 0;
files.forEach(file => {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    let original = content;
    // Match const prisma = require('../config/database');
    content = content.replace(/const prisma = require\(['\"](\.\.\/config\/database|\.\.\/\.\.\/config\/database|\.\/config\/database)['\"]\);/g, 'const { prisma } = require(\'$1\');');
    if (content !== original) {
      fs.writeFileSync(file, content, 'utf8');
      changed++;
    }
  }
});
console.log('Modified ' + changed + ' files.');
