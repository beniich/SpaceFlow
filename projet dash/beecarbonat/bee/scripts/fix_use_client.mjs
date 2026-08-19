/**
 * Fix 'use client' placement in Next.js files.
 * 
 * Rules:
 * 1. If file starts with any import BEFORE 'use client' → move 'use client' to top
 * 2. NEVER add a new toast import — only move the directive
 * 3. If file has BOTH 'sonner' toast AND 'react-hot-toast' → remove the 'sonner' one (it was added by previous bad script)
 */

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
let errors = [];

walkDir('./frontend/src', function(filePath) {
    if (!filePath.endsWith('.tsx') && !filePath.endsWith('.ts')) return;

    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;
    let changed = false;

    // --- Fix 1: Remove duplicate sonner toast if file also has react-hot-toast ---
    const hasSonnerToast = /^import \{ toast \} from 'sonner';/m.test(content);
    const hasReactHotToast = /import (?:\{ toast \}|toast) from ['"]react-hot-toast['"]/m.test(content);
    
    if (hasSonnerToast && hasReactHotToast) {
        // Remove the sonner import line (was wrongly added)
        content = content.replace(/^import \{ toast \} from 'sonner';\r?\n/m, '');
        // Also remove any trailing blank line after "use client" if now there are two blank lines
        content = content.replace(/("use client"|'use client'[;]?)\r?\n\r?\n\r?\n/, "$1\n\n");
        changed = true;
        console.log('[DUP-TOAST] Fixed:', filePath);
    }

    // --- Fix 2: Move 'use client' before any import ---
    // Pattern: file does NOT start with 'use client' but has it somewhere in the first 5 lines
    const lines = content.split(/\r?\n/);
    const firstLine = lines[0].trim();
    
    if (firstLine !== "'use client'" && firstLine !== '"use client"') {
        // Check if there's a misplaced 'use client' in first 10 lines
        const useClientIdx = lines.findIndex((l, i) => i < 10 && (l.trim() === "'use client'" || l.trim() === '"use client"' || l.trim() === "'use client';" || l.trim() === '"use client";'));
        
        if (useClientIdx > 0) {
            // Remove it from current position
            const directive = lines[useClientIdx];
            lines.splice(useClientIdx, 1);
            // Remove empty line after removed directive if any
            if (lines[useClientIdx] && lines[useClientIdx].trim() === '') {
                lines.splice(useClientIdx, 1);
            }
            // Prepend directive at top
            lines.unshift('', directive);
            lines.unshift(directive === "'use client';" || directive === "'use client'" ? "'use client';" : '"use client"');
            // Actually let's do it cleanly:
            // Reconstruct: directive + blank + rest
            const restContent = lines.slice(2).join('\n'); // skip the two we just added
            content = directive + '\n\n' + lines.slice(2).join('\n');
            
            // Simpler approach - just rebuild
            const filteredLines = lines.filter((l, i) => i > 1);
            content = directive + '\n\n' + filteredLines.join('\n');
            changed = true;
            console.log('[USE-CLIENT] Fixed:', filePath);
        }
    }

    if (changed) {
        fs.writeFileSync(filePath, content, 'utf8');
        fixedCount++;
    }
});

console.log('\n=== Done ===');
console.log('Total files fixed:', fixedCount);
if (errors.length > 0) {
    console.log('Errors:', errors);
}
