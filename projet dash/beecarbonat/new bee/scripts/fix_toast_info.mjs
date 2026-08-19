import fs from 'fs';
import path from 'path';

function walkDir(dir, callback) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            if (entry.name === 'node_modules' || entry.name === '.next') continue;
            walkDir(fullPath, callback);
        } else {
            callback(fullPath);
        }
    }
}

let fixedCount = 0;

walkDir('./frontend/src', function(filePath) {
    if (!filePath.endsWith('.tsx') && !filePath.endsWith('.ts')) return;

    let content = fs.readFileSync(filePath, 'utf8');
    
    if (content.includes('toast.info(')) {
        content = content.replaceAll('toast.info(', 'toast(');
        fs.writeFileSync(filePath, content, 'utf8');
        console.log('Fixed toast.info →  toast():', filePath);
        fixedCount++;
    }
});

console.log('\n=== Done ===');
console.log('Total files fixed:', fixedCount);
