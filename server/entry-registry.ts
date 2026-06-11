import crypto from 'node:crypto';
import type { AthenaDb, EntryRow } from './db.js';
import { upsertEntry } from './db.js';

import { sportsAlmanac } from '../src/data/sports.js';
import { financialAlmanac } from '../src/data/finance.js';
import { eraGuideData } from '../src/data/era-guide.js';
import { disasterAlmanac } from '../src/data/disasters.js';
import { techTransferTargets } from '../src/data/tech-transfer.js';
import { medicalInterventions } from '../src/data/medical.js';
import { safetyProtocols } from '../src/data/safety.js';
import { blueprintsData } from '../src/data/blueprints.js';
import { engineeringData } from '../src/data/engineering.js';

function hashFields(...fields: (string | number | null | undefined)[]): string {
  const content = fields.map(f => String(f ?? '')).join('|');
  return crypto.createHash('sha256').update(content).digest('hex').slice(0, 16);
}

export function registerEntries(db: AthenaDb): void {
  const rows: EntryRow[] = [];

  for (const e of sportsAlmanac) {
    rows.push({
      entry_id: e.id, module: 'sports', title: `${e.event} (${e.year})`,
      era: null, year: e.year, category: e.sport, subcategory: null,
      tags: JSON.stringify(e.tags ?? []), data_hash: hashFields(e.event, e.winner, e.score, e.notableDetails),
    });
  }

  for (const e of financialAlmanac) {
    rows.push({
      entry_id: e.id, module: 'finance', title: `${e.event} (${e.date})`,
      era: null, year: e.year, category: e.category, subcategory: null,
      tags: JSON.stringify(e.tags ?? []), data_hash: hashFields(e.event, e.notableDetails, e.direction),
    });
  }

  for (const e of eraGuideData) {
    rows.push({
      entry_id: e.id!, module: 'era-guide', title: `${e.item} (${e.era})`,
      era: e.era, year: null, category: e.category, subcategory: null,
      tags: JSON.stringify(e.tags ?? []), data_hash: hashFields(e.item, e.description, e.advice),
    });
  }

  for (const e of disasterAlmanac) {
    rows.push({
      entry_id: e.id, module: 'disasters', title: e.event,
      era: null, year: e.year, category: e.category, subcategory: null,
      tags: JSON.stringify(e.tags ?? []), data_hash: hashFields(e.event, e.cause, e.intervention),
    });
  }

  for (const e of techTransferTargets) {
    rows.push({
      entry_id: e.id, module: 'tech-transfer', title: e.concept,
      era: null, year: e.optimalYear, category: null, subcategory: null,
      tags: JSON.stringify(e.tags ?? []), data_hash: hashFields(e.concept, e.description, e.optimalYear),
    });
  }

  for (const e of medicalInterventions) {
    rows.push({
      entry_id: e.id, module: 'medical', title: e.condition,
      era: null, year: e.optimalYear, category: null, subcategory: null,
      tags: JSON.stringify(e.tags ?? []), data_hash: hashFields(e.condition, e.details, e.optimalYear),
    });
  }

  for (const e of safetyProtocols) {
    rows.push({
      entry_id: e.id, module: 'safety', title: e.title,
      era: null, year: null, category: e.category, subcategory: null,
      tags: JSON.stringify(e.tags ?? []), data_hash: hashFields(e.title, e.protocol, e.eraNote),
    });
  }

  for (const e of blueprintsData) {
    rows.push({
      entry_id: e.id, module: 'blueprints', title: e.title,
      era: null, year: null, category: e.category, subcategory: null,
      tags: JSON.stringify(e.tags ?? []), data_hash: hashFields(e.title, e.description, e.stepByStepGuide),
    });
  }

  for (const e of engineeringData) {
    rows.push({
      entry_id: e.id, module: 'engineering', title: e.conceptName,
      era: e.era, year: null, category: null, subcategory: e.subDomain,
      tags: JSON.stringify(e.tags ?? []), data_hash: hashFields(e.conceptName, e.description, JSON.stringify(e.keySpecs)),
    });
  }

  const insert = db._db.transaction(() => {
    for (const row of rows) {
      upsertEntry(db, row);
    }
  });
  insert();
}
