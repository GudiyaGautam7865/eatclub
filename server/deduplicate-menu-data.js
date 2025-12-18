import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const menusDir = path.join(__dirname, '..', 'client', 'public', 'data', 'menus');

console.log('🔍 Analyzing menu data for duplicates...\n');

const files = fs.readdirSync(menusDir).filter(f => f.endsWith('.json'));
let totalRemoved = 0;
let filesModified = 0;

for (const file of files) {
  const filePath = path.join(menusDir, file);
  const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  
  const originalCount = data.items.length;
  const seen = new Set();
  const uniqueItems = [];
  let duplicatesInFile = 0;

  for (const item of data.items) {
    // Create unique key: name + categoryId + brandId (implicit via productId)
    const key = `${item.name}|${item.categoryId}|${data.productId}`;
    
    if (seen.has(key)) {
      duplicatesInFile++;
    } else {
      seen.add(key);
      uniqueItems.push(item);
    }
  }

  if (duplicatesInFile > 0) {
    console.log(`📝 ${file}`);
    console.log(`   Original: ${originalCount} items`);
    console.log(`   Unique: ${uniqueItems.length} items`);
    console.log(`   Removed: ${duplicatesInFile} duplicates`);
    
    // Update data and write back
    data.items = uniqueItems;
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    
    totalRemoved += duplicatesInFile;
    filesModified++;
    console.log(`   ✅ File updated\n`);
  }
}

console.log('='.repeat(60));
console.log('📊 DEDUPLICATION SUMMARY');
console.log('='.repeat(60));
console.log(`Files processed: ${files.length}`);
console.log(`Files modified: ${filesModified}`);
console.log(`Total duplicates removed: ${totalRemoved}\n`);

// Show new totals
let newTotal = 0;
for (const file of files) {
  const filePath = path.join(menusDir, file);
  const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  newTotal += data.items.length;
}

console.log(`✅ New total items: ${newTotal}`);
console.log('='.repeat(60));
