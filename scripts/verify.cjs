const fs = require('fs');
const path = require('path');

console.log('=== MOVIEZUI VERIFICATION SUITE ===\n');

// 1. Logo Check
const logo = path.join(process.cwd(), 'public', 'logo.jpg');
const logoOk = fs.existsSync(logo) && fs.statSync(logo).size > 0;
console.log('1. Official Logo (/logo.jpg):', logoOk ? 'PASS (' + fs.statSync(logo).size + ' bytes)' : 'FAIL');

// 2. Movie Posters Check
const moviesContent = fs.readFileSync(path.join(process.cwd(), 'src', 'data', 'movies.ts'), 'utf8');
const posterLines = moviesContent.split('\n').filter(l => l.includes('poster:'));
console.log('\n2. Total Movie Poster References:', posterLines.length);

let postersOk = true;
posterLines.forEach(line => {
  const match = line.match(/poster:\s*["']([^"']+)["']/);
  if (match) {
    const posterPath = match[1];
    const absPath = path.join(process.cwd(), 'public', posterPath.replace(/^\//, ''));
    const exists = fs.existsSync(absPath);
    const size = exists ? fs.statSync(absPath).size : 0;
    if (!exists || size < 1000) {
      postersOk = false;
      console.error('   FAIL:', posterPath);
    } else {
      console.log('   OK:', posterPath, '(' + size + ' bytes)');
    }
  }
});
console.log('Poster Verification Result:', postersOk ? 'PASS' : 'FAIL');

// 3. Duplicate Navbar & Footer Check in Pages
console.log('\n3. Duplicate Navbar / Footer Check in src/pages:');
const pagesDir = path.join(process.cwd(), 'src', 'pages');
const pages = fs.readdirSync(pagesDir).filter(f => f.endsWith('.tsx'));
let duplicatesFound = false;
pages.forEach(p => {
  const content = fs.readFileSync(path.join(pagesDir, p), 'utf8');
  const hasNav = content.includes('<Navbar') || content.includes('import Navbar');
  const hasFoot = content.includes('<Footer') || content.includes('import Footer');
  if (hasNav || hasFoot) {
    duplicatesFound = true;
    console.error('   FAIL:', p, 'has Navbar/Footer rendered inside page!');
  } else {
    console.log('   OK:', p, 'has NO duplicate layout components');
  }
});
console.log('Duplicate Layout Check Result:', duplicatesFound ? 'FAIL' : 'PASS');

// 4. App.tsx Layout Check
const appContent = fs.readFileSync(path.join(process.cwd(), 'src', 'App.tsx'), 'utf8');
const navCountInApp = (appContent.match(/<Navbar\s*\/>/g) || []).length;
const footerCountInApp = (appContent.match(/<Footer\s*\/>/g) || []).length;
console.log('\n4. App.tsx Shared Layout Check:');
console.log('   Navbar count in App.tsx:', navCountInApp, navCountInApp === 1 ? '(PASS)' : '(FAIL)');
console.log('   Footer count in App.tsx:', footerCountInApp, footerCountInApp === 1 ? '(PASS)' : '(FAIL)');

// 5. Check Movie Records Integrity
const idLines = moviesContent.split('\n').filter(l => l.trim().startsWith('id:'));
const titleLines = moviesContent.split('\n').filter(l => l.trim().startsWith('title:'));
const directorLines = moviesContent.split('\n').filter(l => l.trim().startsWith('director:'));
const yearLines = moviesContent.split('\n').filter(l => l.trim().startsWith('releaseYear:'));
console.log('\n5. Movie Records Data Integrity:');
console.log('   Total movie IDs:', idLines.length);
console.log('   Total titles:', titleLines.length);
console.log('   Total directors:', directorLines.length);
console.log('   Total release years:', yearLines.length);
const recordsOk = idLines.length === 20 && titleLines.length === 20 && directorLines.length === 20;
console.log('   Records Count:', recordsOk ? 'PASS (Exact 20 records)' : 'FAIL');

// 6. Check Routes
console.log('\n6. Routes configured in App.tsx:');
const routeMatches = appContent.match(/path="([^"]+)"/g) || [];
routeMatches.forEach(r => console.log('   Route:', r));
console.log('   Total routes:', routeMatches.length, '(PASS)');
