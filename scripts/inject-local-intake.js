const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');

const localIntakeSnippet = `  try{
    await fetch('/api/intake',{
      method:'POST', headers:{'Content-Type':'application/json'},
      body: JSON.stringify({
        firstname: answers.name,
        email: answers.email,
        phone: answers.phone||'',
        property_type: answers.property_type,
        goal: answers.goal,
        timeline: answers.timeline,
        city: answers.location,
        lead_source_page: answers.source || HP_CONFIG.SOURCE_TAG
      })
    });
  }catch(err){ console.warn('Local submit pending config:', err); }`;

function injectLocalIntake(filePath) {
  if (!fs.existsSync(filePath)) return;
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Skip if already injected
  if (content.includes("fetch('/api/intake'")) return;
  
  // Locate finish() function
  const finishIndex = content.indexOf("async function finish(){");
  if (finishIndex === -1) return;
  
  // Find the first try{ after finish()
  const tryIndex = content.indexOf("try{", finishIndex);
  if (tryIndex === -1) return;
  
  // We want to insert the snippet right before try{
  const beforeTry = content.substring(0, tryIndex);
  const afterTry = content.substring(tryIndex);
  
  const updatedContent = beforeTry + localIntakeSnippet + "\n  " + afterTry;
  fs.writeFileSync(filePath, updatedContent, 'utf8');
  console.log(`Injected local intake: ${path.relative(rootDir, filePath)}`);
}

// Inject in root files
const rootFiles = fs.readdirSync(rootDir).filter(f => f.endsWith('.html'));
rootFiles.forEach(f => injectLocalIntake(path.join(rootDir, f)));

// Inject in kassandra files
const kassandraDir = path.join(rootDir, 'kassandra');
if (fs.existsSync(kassandraDir)) {
  const kassandraFiles = fs.readdirSync(kassandraDir).filter(f => f.endsWith('.html'));
  kassandraFiles.forEach(f => injectLocalIntake(path.join(kassandraDir, f)));
}

console.log("Injection complete!");
