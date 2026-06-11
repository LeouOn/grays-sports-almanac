import { sportsAlmanac } from '../data/sports';
import { financialAlmanac } from '../data/finance';
import { eraGuideData } from '../data/era-guide';
import { disasterAlmanac } from '../data/disasters';
import { techTransferTargets } from '../data/tech-transfer';
import { medicalInterventions } from '../data/medical';
import { safetyProtocols } from '../data/safety';
import { blueprintsData } from '../data/blueprints';

export interface SearchResult {
  module: 'Sports' | 'Finance' | 'Era Guide' | 'Disasters' | 'Tech' | 'Medical' | 'Safety' | 'Blueprints';
  title: string;
  subtitle: string;
  description: string;
  link: string;
  year?: number;
}

export function searchAll(query: string): SearchResult[] {
  if (!query || !query.trim()) return [];
  const q = query.toLowerCase().trim();

  const results: SearchResult[] = [];

  // 1. Sports
  sportsAlmanac.forEach(e => {
    if (
      e.event.toLowerCase().includes(q) ||
      e.winner.toLowerCase().includes(q) ||
      e.loser.toLowerCase().includes(q) ||
      e.sport.toLowerCase().includes(q) ||
      (e.notableDetails && e.notableDetails.toLowerCase().includes(q))
    ) {
      results.push({
        module: 'Sports',
        title: `${e.event} (${e.year})`,
        subtitle: `${e.sport} · Winner: ${e.winner} · Score: ${e.score || 'N/A'}`,
        description: e.notableDetails,
        link: '/sports',
        year: e.year
      });
    }
  });

  // 2. Finance
  financialAlmanac.forEach(e => {
    if (
      e.event.toLowerCase().includes(q) ||
      e.category.toLowerCase().includes(q) ||
      e.notableDetails.toLowerCase().includes(q) ||
      e.entrySignal.toLowerCase().includes(q) ||
      e.exitSignal.toLowerCase().includes(q)
    ) {
      results.push({
        module: 'Finance',
        title: `${e.event} (${e.year})`,
        subtitle: `${e.category} · Entry: ${e.entrySignal}`,
        description: e.notableDetails,
        link: '/finance',
        year: e.year
      });
    }
  });

  // 3. Era Guide
  eraGuideData.forEach(e => {
    if (
      e.item.toLowerCase().includes(q) ||
      e.category.toLowerCase().includes(q) ||
      e.description.toLowerCase().includes(q) ||
      e.advice.toLowerCase().includes(q)
    ) {
      results.push({
        module: 'Era Guide',
        title: `${e.item} (${e.era})`,
        subtitle: `${e.category} · Advice: ${e.advice.substring(0, 80)}...`,
        description: e.description,
        link: '/era-guide'
      });
    }
  });

  // 4. Disasters
  disasterAlmanac.forEach(e => {
    if (
      e.event.toLowerCase().includes(q) ||
      e.cause.toLowerCase().includes(q) ||
      e.location.toLowerCase().includes(q) ||
      e.category.toLowerCase().includes(q) ||
      e.intervention.toLowerCase().includes(q)
    ) {
      results.push({
        module: 'Disasters',
        title: `${e.event} (${e.date})`,
        subtitle: `${e.location} · Lives at Stake: ${e.estimatedLivesSaved}`,
        description: e.cause,
        link: '/disasters',
        year: e.year
      });
    }
  });

  // 5. Tech Transfer
  techTransferTargets.forEach(e => {
    if (
      e.concept.toLowerCase().includes(q) ||
      e.targetRecipient.toLowerCase().includes(q) ||
      e.description.toLowerCase().includes(q) ||
      e.deliveryMethod.toLowerCase().includes(q) ||
      e.estimatedImpact.toLowerCase().includes(q)
    ) {
      results.push({
        module: 'Tech',
        title: `${e.concept} (Optimal: ${e.optimalYear})`,
        subtitle: `Recipient: ${e.targetRecipient} · Impact: ${e.estimatedImpact}`,
        description: e.description,
        link: '/tech-transfer',
        year: e.optimalYear
      });
    }
  });

  // 6. Medical
  medicalInterventions.forEach(e => {
    if (
      e.condition.toLowerCase().includes(q) ||
      e.targetRecipient.toLowerCase().includes(q) ||
      e.description.toLowerCase().includes(q) ||
      e.deliveryMethod.toLowerCase().includes(q) ||
      e.details.toLowerCase().includes(q)
    ) {
      results.push({
        module: 'Medical',
        title: `${e.condition} (Optimal: ${e.optimalYear})`,
        subtitle: `Recipient: ${e.targetRecipient} · Lives Saved: ${e.estimatedLivesSaved}`,
        description: e.description,
        link: '/medical',
        year: e.optimalYear
      });
    }
  });

  // 7. Safety
  safetyProtocols.forEach(e => {
    if (
      e.title.toLowerCase().includes(q) ||
      e.category.toLowerCase().includes(q) ||
      e.description.toLowerCase().includes(q) ||
      e.protocol.toLowerCase().includes(q) ||
      e.eraNote.toLowerCase().includes(q)
    ) {
      results.push({
        module: 'Safety',
        title: e.title,
        subtitle: `${e.category} · Note: ${e.eraNote}`,
        description: e.description,
        link: '/safety'
      });
    }
  });

  // 8. Blueprints
  blueprintsData.forEach(e => {
    if (
      e.title.toLowerCase().includes(q) ||
      e.category.toLowerCase().includes(q) ||
      e.description.toLowerCase().includes(q) ||
      e.keyPrinciples.some(p => p.toLowerCase().includes(q)) ||
      e.materialsRequired.some(m => m.toLowerCase().includes(q)) ||
      e.stepByStepGuide.toLowerCase().includes(q)
    ) {
      results.push({
        module: 'Blueprints',
        title: e.title,
        subtitle: `${e.category} · Difficulty: ${e.difficulty} · Tolerances: ${e.tolerances}`,
        description: e.description,
        link: '/blueprints'
      });
    }
  });

  return results.slice(0, 20); // Cap at 20 results for performance
}
