import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const menusDir = path.join(__dirname, '..', 'client', 'public', 'data', 'menus');
const files = fs.readdirSync(menusDir).filter(f => f.endsWith('.json'));

let totalItems = 0;
let totalCategories = 0;
const details = [];

for (const file of files) {
  const data = JSON.parse(fs.readFileSync(path.join(menusDir, file), 'utf8'));
  totalItems += data.items.length;
  totalCategories += data.categories.length;
  details.push({
    file,
    productId: data.productId,
    categories: data.categories.length,
    items: data.items.length
  });
}

console.log('='.repeat(60));
console.log('MENU DATA SUMMARY FROM PUBLIC FOLDER');
console.log('='.repeat(60));
console.log(`\nTotal across all menus:`);
console.log(`  Categories: ${totalCategories}`);
console.log(`  Items: ${totalItems}`);
console.log(`\nPer-menu breakdown:`);
details.forEach(d => {
  console.log(`  ${d.productId.padEnd(20)} - ${d.items} items, ${d.categories} categories`);
});
console.log('='.repeat(60));
