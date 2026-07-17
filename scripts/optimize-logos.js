const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');

function optimizeFile(filePath, isAgent = false) {
  if (!fs.existsSync(filePath)) return;
  let content = fs.readFileSync(filePath, 'utf8');
  let changed = false;

  // 1. Corporate Logo Optimization
  const corporateTarget = '<img src="assets/logo-landscape-dark.png" alt="Harbor Point Holding" style="height: 38px; display: block;">';
  const corporateTargetAlternate = '<img src="assets/logo-landscape-dark.png" alt="Harbor Point Holding" style="height: 38px; display: block;"';
  const corporateReplacement = '<img src="assets/logo-landscape-dark.png" alt="Harbor Point Holding" width="180" height="38" style="height: 38px; width: auto; display: block;" fetchpriority="high">';
  
  if (content.includes(corporateTarget)) {
    content = content.replace(new RegExp(corporateTarget, 'g'), corporateReplacement);
    changed = true;
  }
  
  // 2. Legal / 404 Logo Optimization
  const legalTarget = '<img src="assets/logo-landscape-dark.png" alt="Harbor Point Holding" style="height: 38px; display: block;">';
  const legalReplacement = '<img src="assets/logo-landscape-dark.png" alt="Harbor Point Holding" width="180" height="38" style="height: 38px; width: auto; display: block;" fetchpriority="high">';
  if (content.includes(legalTarget)) {
    content = content.replace(new RegExp(legalTarget, 'g'), legalReplacement);
    changed = true;
  }

  // 3. Agent Logo Optimization (kassandra/ pages)
  const agentTarget = '<img src="../assets/logo-house-green.jpg" alt="Harbor Point Holding" style="height: 42px; border-radius: 4px;">';
  const agentReplacement = '<img src="../assets/logo-house-green.jpg" alt="Harbor Point Holding" width="42" height="42" style="height: 42px; width: auto; border-radius: 4px;" fetchpriority="high">';
  
  if (content.includes(agentTarget)) {
    content = content.replace(new RegExp(agentTarget, 'g'), agentReplacement);
    changed = true;
  }

  // 4. VDR Deal Room Logo Optimization
  const vdrTarget1 = '<img src="../../assets/logo-lighthouse-green.jpg" alt="KGrace CRE Consulting" style="width: 80px; height: 80px; border-radius: 6px; display: block; margin: 0 auto;">';
  const vdrReplacement1 = '<img src="../../assets/logo-lighthouse-green.jpg" alt="KGrace CRE Consulting" width="80" height="80" style="width: 80px; height: 80px; border-radius: 6px; display: block; margin: 0 auto;" fetchpriority="high">';
  
  const vdrTarget2 = '<img src="../../assets/logo-lighthouse-green.jpg" alt="KGrace CRE Consulting" style="width: 42px; height: 42px; border-radius: 4px;">';
  const vdrReplacement2 = '<img src="../../assets/logo-lighthouse-green.jpg" alt="KGrace CRE Consulting" width="42" height="42" style="width: 42px; height: 42px; border-radius: 4px;" fetchpriority="high">';

  if (content.includes(vdrTarget1)) {
    content = content.replace(new RegExp(vdrTarget1, 'g'), vdrReplacement1);
    changed = true;
  }
  if (content.includes(vdrTarget2)) {
    content = content.replace(new RegExp(vdrTarget2, 'g'), vdrReplacement2);
    changed = true;
  }

  if (changed) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Optimized: ${path.relative(rootDir, filePath)}`);
  }
}

// Optimize all root html files
const rootFiles = fs.readdirSync(rootDir).filter(f => f.endsWith('.html'));
rootFiles.forEach(f => optimizeFile(path.join(rootDir, f), false));

// Optimize all kassandra files
const kassandraDir = path.join(rootDir, 'kassandra');
if (fs.existsSync(kassandraDir)) {
  const kassandraFiles = fs.readdirSync(kassandraDir).filter(f => f.endsWith('.html'));
  kassandraFiles.forEach(f => optimizeFile(path.join(kassandraDir, f), true));
  
  // Optimize deals folder
  const dealsDir = path.join(kassandraDir, 'deals');
  if (fs.existsSync(dealsDir)) {
    const dealFiles = fs.readdirSync(dealsDir).filter(f => f.endsWith('.html'));
    dealFiles.forEach(f => optimizeFile(path.join(dealsDir, f), true));
  }
}

console.log("Optimization complete!");
