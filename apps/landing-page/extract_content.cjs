const fs = require('fs');

const contentFile = 'src/data/content.ts';
const uiFile = 'src/i18n/ui.ts';

const content = fs.readFileSync(contentFile, 'utf8');

// Simple extraction logic for the Product objects
const products = [];
// This is a very rough regex, but it should work for the specific structure of content.ts
const productRegex = /const (\w+): Product = {([\s\S]*?)};/g;
let match;
while ((match = productRegex.exec(content)) !== null) {
  const idMatch = /id: "([^"]+)"/.exec(match[2]);
  if (idMatch) {
    const productId = idMatch[1];
    
    // Extract basic fields
    const fields = ['name', 'tagline'];
    const translations = {};
    
    fields.forEach(f => {
      const fMatch = new RegExp(`${f}: "([^"]+)"`).exec(match[2]);
      if (fMatch) translations[`product.${productId}.${f}`] = fMatch[1];
    });

    // Extract hero
    const heroTitleMatch = /hero: {[\s\S]*?title: "([^"]+)"/.exec(match[2]);
    const heroSubtitleMatch = /hero: {[\s\S]*?subtitle: "([^"]+)"/.exec(match[2]);
    if (heroTitleMatch) translations[`product.${productId}.hero.title`] = heroTitleMatch[1];
    if (heroSubtitleMatch) translations[`product.${productId}.hero.subtitle`] = heroSubtitleMatch[1];

    // Extract features
    const featuresBlockMatch = /features: \[([\s\S]*?)\]/.exec(match[2]);
    if (featuresBlockMatch) {
      const featureRegex = /{[\s\S]*?id: "([^"]+)"[\s\S]*?name: "([^"]+)"[\s\S]*?description: "([^"]+)"/g;
      let fMatch;
      while ((fMatch = featureRegex.exec(featuresBlockMatch[1])) !== null) {
        translations[`product.${productId}.feature.${fMatch[1]}.name`] = fMatch[2];
        translations[`product.${productId}.feature.${fMatch[1]}.desc`] = fMatch[3];
      }
    }

    // Extract AI Agents
    const agentsBlockMatch = /aiAgents: \[([\s\S]*?)\]/.exec(match[2]);
    if (agentsBlockMatch) {
      const agentRegex = /{[\s\S]*?id: "([^"]+)"[\s\S]*?title: "([^"]+)"[\s\S]*?description: "([^"]+)"/g;
      let aMatch;
      while ((aMatch = agentRegex.exec(agentsBlockMatch[1])) !== null) {
        translations[`product.${productId}.agent.${aMatch[1]}.title`] = aMatch[2];
        translations[`product.${productId}.agent.${aMatch[1]}.desc`] = aMatch[3];
      }
    }

    // Extract differentials
    const differentialsMatch = /differentials: \[([\s\S]*?)\]/.exec(match[2]);
    if (differentialsMatch) {
      const diffs = differentialsMatch[1].split(',').map(s => s.trim().replace(/^"|"$/g, ''));
      diffs.forEach((diff, i) => {
        if (diff) translations[`product.${productId}.diff.${i}`] = diff;
      });
    }

    products.push(translations);
  }
}

// Update ui.ts
let uiContent = fs.readFileSync(uiFile, 'utf8');

// Find pt-br block
const ptBrRegex = /'pt-br': \{([\s\S]*?)\},/;
const ptBrMatch = uiContent.match(ptBrRegex);

if (ptBrMatch) {
  let ptBrBlock = ptBrMatch[1];
  products.forEach(p => {
    for (const [key, value] of Object.entries(p)) {
      if (!ptBrBlock.includes(`'${key}':`)) {
        ptBrBlock += `    '${key}': '${value.replace(/'/g, "\\'")}',\n`;
      }
    }
  });
  
  uiContent = uiContent.replace(ptBrMatch[0], `'pt-br': {${ptBrBlock}},`);
  fs.writeFileSync(uiFile, uiContent, 'utf8');
  console.log('Extraídas traduções dos produtos para ui.ts');
}
