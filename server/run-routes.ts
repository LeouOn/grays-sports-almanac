import { Router } from 'express';
import crypto from 'node:crypto';
import type { AthenaDb } from './db.js';
import { getRun, insertRun, updateRun, insertBeat, getBeats } from './db.js';
import {
  ERA_IDS, createRun, nextBeatType, canRetire, applyChoice, applyKnowledgeCheck,
  retireRun, computeScore, EngineError,
  type Beat, type EraId, type RunState,
} from './run-engine.js';
import {
  generateBeat, generateKnowledgeCheckBeat, generateCompanionQuip, resolveRunModel, templateBeat,
} from './run-llm.js';
import { KiwixClient } from './wiki-tools.js';
import { KNOWLEDGE_MODULES } from './knowledge/index.js';
import { defaultCompanions } from '../src/data/companions.js';
import type { LanguageModelV2 } from 'ai';

export interface RunRouteDeps {
  generateBeatFn?: typeof generateBeat;
  generateKnowledgeCheckBeatFn?: typeof generateKnowledgeCheckBeat;
  generateCompanionQuipFn?: typeof generateCompanionQuip;
  resolveModelFn?: () => LanguageModelV2;
  kiwix?: KiwixClient | null;
}

function curatedExcerpt(era: string): string {
  const modules = KNOWLEDGE_MODULES[era] ?? KNOWLEDGE_MODULES['global'] ?? {};
  let out = '';
  for (const cat of Object.values(modules)) {
    for (const text of Object.values(cat)) {
      out += text + '\n';
      if (out.length > 3000) return out.slice(0, 3000);
    }
  }
  return out;
}

export function createRunRoutes(db: AthenaDb, deps: RunRouteDeps = {}): Router {
  const router = Router();
  const genBeat = deps.generateBeatFn ?? generateBeat;
  const genCheck = deps.generateKnowledgeCheckBeatFn ?? generateKnowledgeCheckBeat;
  const genQuip = deps.generateCompanionQuipFn ?? generateCompanionQuip;
  const kiwix = deps.kiwix !== undefined ? deps.kiwix : new KiwixClient();

  // Amendment: lazy, fallible model resolver. Eager resolution would throw
  // at router construction in keyless environments (CI, offline dev) and
  // break the route tests. Cache the resolved value; on throw, cache null
  // so subsequent calls stay deterministic.
  let modelSlot: LanguageModelV2 | null | undefined;
  const resolveModel = (): LanguageModelV2 | null => {
    if (modelSlot === undefined) {
      try {
        modelSlot = (deps.resolveModelFn ?? resolveRunModel)();
      } catch {
        modelSlot = null; // keyless environment — template beats only
      }
    }
    return modelSlot;
  };

  async function buildBeat(state: RunState): Promise<Beat> {
    const excerpt = curatedExcerpt(state.era);
    const type = nextBeatType(state);
    const model = resolveModel();
    let beat: Beat;
    if (type === 'knowledge_check') {
      beat = await genCheck({
        state,
        model,
        kiwix: model ? kiwix : null,
        curatedExcerpt: excerpt,
      });
    } else if (model) {
      beat = await genBeat({ state, curatedExcerpt: excerpt, model, kiwix });
    } else {
      // No model → template beats only (CI / offline / no provider keys).
      beat = templateBeat(state, excerpt);
    }
    const companion = defaultCompanions.find(c => c.id === state.companionId);
    if (companion && companion.id !== 'custom' && model) {
      // Skip quip in keyless mode — callProviderChain would attempt ollama
      // (OPTIONAL_KEY) and hang on TCP timeout when no model is available.
      // Template beats already imply no LLM.
      beat.companionQuip = await genQuip({
        companionName: companion.name,
        companionPrompt: companion.prompt,
        beatTitle: beat.title,
      });
    }
    insertBeat(db, state.runId, beat);
    return beat;
  }

  function loadActiveRun(id: string): RunState {
    const state = getRun(db, id);
    if (!state) {
      const err = new Error(`run ${id} not found`);
      err.name = 'NotFoundError';
      throw err;
    }
    return state;
  }

  router.post('/start', async (req, res) => {
    const { era, companionId } = req.body ?? {};
    if (!ERA_IDS.includes(era as EraId)) {
      res.status(400).json({ error: `era must be one of ${ERA_IDS.join(', ')}` });
      return;
    }
    if (!defaultCompanions.some(c => c.id === companionId)) {
      res.status(400).json({ error: 'unknown companionId' });
      return;
    }
    const state = createRun(era as EraId, companionId, crypto.randomUUID());
    insertRun(db, state);
    const beat = await buildBeat(state);
    res.status(201).json({ run: state, beat });
  });

  router.post('/:id/choice', async (req, res) => {
    try {
      const state = loadActiveRun(req.params.id);
      const beats = getBeats(db, state.runId);
      const current = beats[beats.length - 1];
      if (!current || current.type === 'knowledge_check') {
        res.status(400).json({ error: 'current beat expects a knowledge-check answer' });
        return;
      }
      const next = applyChoice(state, current, req.body?.choiceId);
      updateRun(db, next);
      const beat = next.outcome === 'active' ? await buildBeat(next) : null;
      res.json({ run: next, beat, ...(next.outcome !== 'active' ? { score: computeScore(next) } : {}) });
    } catch (err) {
      handleRouteError(err, res);
    }
  });

  router.post('/:id/knowledge-check', async (req, res) => {
    try {
      const state = loadActiveRun(req.params.id);
      const beats = getBeats(db, state.runId);
      const current = beats[beats.length - 1];
      if (!current?.knowledgeCheck) {
        res.status(400).json({ error: 'current beat is not a knowledge check' });
        return;
      }
      const answerIndex = req.body?.answerIndex;
      if (typeof answerIndex !== 'number' || answerIndex < 0 || answerIndex >= current.knowledgeCheck.options.length) {
        res.status(400).json({ error: 'answerIndex out of range' });
        return;
      }
      const correct = answerIndex === current.knowledgeCheck.correctIndex;
      const next = applyKnowledgeCheck(state, correct);
      updateRun(db, next);
      const beat = next.outcome === 'active' ? await buildBeat(next) : null;
      res.json({ correct, run: next, beat, ...(next.outcome !== 'active' ? { score: computeScore(next) } : {}) });
    } catch (err) {
      handleRouteError(err, res);
    }
  });

  router.post('/:id/retire', (req, res) => {
    try {
      const state = loadActiveRun(req.params.id);
      if (!canRetire(state)) {
        res.status(409).json({ error: 'cannot retire yet — survive to beat 6' });
        return;
      }
      const retired = retireRun(state);
      updateRun(db, retired);
      res.json({ run: retired, score: computeScore(retired) });
    } catch (err) {
      handleRouteError(err, res);
    }
  });

  router.get('/:id', (req, res) => {
    try {
      const state = loadActiveRun(req.params.id);
      res.json({ run: state, beats: getBeats(db, state.runId), score: computeScore(state) });
    } catch (err) {
      handleRouteError(err, res);
    }
  });

  return router;
}

function handleRouteError(err: unknown, res: import('express').Response): void {
  if (err instanceof EngineError) {
    res.status(400).json({ error: err.message });
    return;
  }
  if (err instanceof Error && err.name === 'NotFoundError') {
    res.status(404).json({ error: err.message });
    return;
  }
  const msg = err instanceof Error ? err.message : String(err);
  res.status(500).json({ error: msg });
}
