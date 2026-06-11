import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// Import all data sources
import { sportsAlmanac } from '../src/data/sports.js';
import { eraGuideData } from '../src/data/era-guide.js';
import { financialAlmanac } from '../src/data/finance.js';
import { disasterAlmanac } from '../src/data/disasters.js';
import { blueprintsData } from '../src/data/blueprints.js';
import { techTransferTargets } from '../src/data/tech-transfer.js';
import { medicalInterventions } from '../src/data/medical.js';
import { safetyProtocols } from '../src/data/safety.js';
import { engineeringData } from '../src/data/engineering.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export type Era = '1950s' | '1960s' | '1970s' | '1980s' | '1990s' | '2000s' | 'global';
export type BigCategory = 'culture' | 'science' | 'economics' | 'events' | 'engineering';
export type Subcategory = 'sports' | 'slang' | 'tech' | 'blueprints' | 'medical' | 'prices' | 'finance' | 'disasters' | 'safety' | 'cnc_machining' | 'semiconductors' | 'metallurgy' | 'aerospace' | 'telecommunications';

function getBigCategory(sub: Subcategory): BigCategory {
  switch (sub) {
    case 'sports':
    case 'slang':
      return 'culture';
    case 'tech':
    case 'blueprints':
    case 'medical':
      return 'science';
    case 'prices':
    case 'finance':
      return 'economics';
    case 'disasters':
    case 'safety':
      return 'events';
    case 'cnc_machining':
    case 'semiconductors':
    case 'metallurgy':
    case 'aerospace':
    case 'telecommunications':
      return 'engineering';
  }
}

// Helper to determine era from a year
function getEraFromYear(year: number): Era {
  if (year >= 1950 && year < 1960) return '1950s';
  if (year >= 1960 && year < 1970) return '1960s';
  if (year >= 1970 && year < 1980) return '1970s';
  if (year >= 1980 && year < 1990) return '1980s';
  if (year >= 1990 && year < 2000) return '1990s';
  if (year >= 2000) return '2000s';
  return 'global';
}

function getEraFromDateStr(dateStr: string): Era {
  const match = dateStr.match(/\d{4}/);
  if (match) {
    return getEraFromYear(parseInt(match[0], 10));
  }
  return 'global';
}

function createEmptySubcategories(): Record<Subcategory, string> {
  return { sports: '', slang: '', tech: '', blueprints: '', medical: '', prices: '', finance: '', disasters: '', safety: '', cnc_machining: '', semiconductors: '', metallurgy: '', aerospace: '', telecommunications: '' };
}

function createEmptyEra(): Record<BigCategory, Record<Subcategory, string>> {
  return {
    culture: createEmptySubcategories(),
    science: createEmptySubcategories(),
    economics: createEmptySubcategories(),
    events: createEmptySubcategories(),
    engineering: createEmptySubcategories()
  };
}

async function generateKnowledgeBase() {
  console.log('Generating hierarchical knowledge base...');

  const modules: Record<Era, Record<BigCategory, Record<Subcategory, string>>> = {
    '1950s': createEmptyEra(),
    '1960s': createEmptyEra(),
    '1970s': createEmptyEra(),
    '1980s': createEmptyEra(),
    '1990s': createEmptyEra(),
    '2000s': createEmptyEra(),
    'global': createEmptyEra()
  };

  function append(era: Era, sub: Subcategory, line: string) {
    const cat = getBigCategory(sub);
    modules[era][cat][sub] += line;
  }

  // 1. SPORTS
  sportsAlmanac.forEach(event => {
    const era = getEraFromYear(event.year);
    let line = `- ${event.event} (${event.year}): ${event.winner} def. ${event.loser} ${event.score || ''}`;
    if (event.odds && event.odds !== 'Even') line += ` (${event.odds})`;
    line += `, ${event.notableDetails}\n`;
    append(era, 'sports', line);
  });

  // 2. ERA PRICES & SLANG & TECH TIMELINE
  eraGuideData.forEach(d => {
    let era: Era = 'global';
    if (d.era === '1950s') era = '1950s';
    else if (d.era === '1960s') era = '1960s';
    else if (d.era === '1970s') era = '1970s';
    else if (d.era === '1980s') era = '1980s';
    else if (d.era === '1990s') era = '1990s';
    else if (d.era === '2000s') era = '2000s';

    if (d.category === 'Prices') {
      append(era, 'prices', `- ${d.item}: ${d.description}\n`);
    } else if (d.category === 'Slang') {
      append(era, 'slang', `- ${d.item}\n`);
    } else if (d.category === 'Tech Constraints') {
      append(era, 'tech', `- ${d.item}: ${d.description}\n`);
    }
  });

  // 5. FINANCIAL EVENTS
  financialAlmanac.forEach(event => {
    const era = getEraFromDateStr(event.date);
    append(era, 'finance', `- ${event.date} (${event.category}): ${event.event}. Direction: ${event.direction.toUpperCase()}. ${event.peakPrice ? 'Peak: ' + event.peakPrice : ''} ${event.troughPrice ? 'Trough: ' + event.troughPrice : ''} ${event.notableDetails}\n`);
  });

  // 6. DISASTERS
  disasterAlmanac.forEach(event => {
    const era = getEraFromDateStr(event.date);
    append(era, 'disasters', `- ${event.event} (${event.date}): ${event.casualties}. Cause: ${event.cause}\n`);
  });

  // 7. BOOTSTRAP BLUEPRINTS
  blueprintsData.forEach(bp => {
    append('global', 'blueprints', `- ${bp.title}: ${bp.description} Key materials: ${bp.materialsRequired.join(', ')}.\n`);
  });

  // 8. TECH TRANSFER
  techTransferTargets.forEach(tt => {
    const era = getEraFromYear(tt.optimalYear);
    append(era, 'tech', `- Tech Transfer Target: ${tt.concept} (Optimal Year: ${tt.optimalYear}): ${tt.description} Target: ${tt.targetRecipient}.\n`);
  });

  // 9. MEDICAL INTERVENTIONS
  medicalInterventions.forEach(med => {
    const era = getEraFromYear(med.optimalYear);
    append(era, 'medical', `- ${med.condition} (Optimal Year: ${med.optimalYear}): ${med.description}\n`);
  });

  // 10. SAFETY PROTOCOLS
  safetyProtocols.forEach(sp => {
    append('global', 'safety', `- ${sp.title} (${sp.category}): ${sp.description}\n`);
  });

  // 11. ENGINEERING & MANUFACTURING
  engineeringData.forEach(spec => {
    const specsString = Object.entries(spec.keySpecs).map(([k, v]) => `${k}: ${v}`).join(', ');
    const provenanceString = `[Source: ${spec.provenance.sourceSite} (${spec.provenance.sourceUrl}), Confidence: ${spec.provenance.confidence}]`;
    const line = `- ${spec.conceptName} (${spec.era}): ${spec.description} | Specs: ${specsString} | ${provenanceString}\n`;
    append(spec.era, spec.subDomain, line);
  });

  const outputDir = path.join(__dirname, '../server/knowledge');
  // clear directory
  await fs.rm(outputDir, { recursive: true, force: true });
  await fs.mkdir(outputDir, { recursive: true });

  let indexContent = `// THIS FILE IS AUTO-GENERATED. DO NOT EDIT DIRECTLY.\n\n`;
  const exportNames: string[] = [];

  for (const era of Object.keys(modules) as Era[]) {
    for (const cat of Object.keys(modules[era]) as BigCategory[]) {
      for (const sub of Object.keys(modules[era][cat]) as Subcategory[]) {
        const content = modules[era][cat][sub];
        if (content.trim()) {
          const varName = `era_${era.replace(/s$/, '')}__${cat}__${sub}`; 
          const fileName = `${era}_${cat}_${sub}.ts`;
          const filePath = path.join(outputDir, fileName);
          
          const fileContent = `export const ${varName} = \`\n## ${era.toUpperCase()} ${cat.toUpperCase()} - ${sub.toUpperCase()}\n${content.replace(/`/g, '\\`')}\`;\n`;
          await fs.writeFile(filePath, fileContent, 'utf8');
          
          indexContent += `import { ${varName} } from './${fileName.replace('.ts', '.js')}';\n`;
          exportNames.push(varName);
        }
      }
    }
  }

  indexContent += `\nexport const KNOWLEDGE_MODULES: Record<string, Record<string, Record<string, string>>> = {\n`;
  for (const era of Object.keys(modules) as Era[]) {
    indexContent += `  '${era}': {\n`;
    for (const cat of Object.keys(modules[era]) as BigCategory[]) {
      indexContent += `    '${cat}': {\n`;
      for (const sub of Object.keys(modules[era][cat]) as Subcategory[]) {
        if (modules[era][cat][sub].trim()) {
          const varName = `era_${era.replace(/s$/, '')}__${cat}__${sub}`;
          indexContent += `      '${sub}': ${varName},\n`;
        }
      }
      indexContent += `    },\n`;
    }
    indexContent += `  },\n`;
  }
  indexContent += `};\n`;

  await fs.writeFile(path.join(outputDir, 'index.ts'), indexContent, 'utf8');

  console.log(`Modular knowledge base successfully generated at ${outputDir}`);
}

generateKnowledgeBase().catch(err => {
  console.error('Error generating knowledge base:', err);
  process.exit(1);
});
