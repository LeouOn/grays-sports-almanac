/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { defaultCompanions, type Companion } from '../data/companions';
import { athenaPreferences, formatPreferences } from '../data/companions/athena-preferences';
import { migrateFromLocalStorage } from '../services/companionMigration';
import { getActiveCompanion, setActiveDefault, setActiveCustom } from '../services/activeCompanionSelector';
import { type CustomCompanion } from '@/lib/idb';

export type ProviderId = 'google' | 'deepseek' | 'zhipu' | 'minimax' | 'openrouter';

/** Cost-ordered fallback chain — tried in order, first success wins */
export const COMPANION_PROVIDER_FALLBACK: ProviderId[] = ['minimax', 'zhipu', 'deepseek', 'google'];

interface CompanionContextType {
  activeCompanion: Companion;
  selectCompanion: (id: string) => void;
  selectCustomCompanion: (companion: CustomCompanion) => void;
  customName: string;
  setCustomName: (name: string) => void;
  customPrompt: string;
  setCustomPrompt: (prompt: string) => void;
  companionProvider: ProviderId;
  setCompanionProvider: (provider: ProviderId) => void;
  userName: string;
  setUserName: (name: string) => void;
}

const CompanionContext = createContext<CompanionContextType | undefined>(undefined);

export function CompanionProvider({ children }: { children: React.ReactNode }) {
  // Migration effect — runs once on mount, fire-and-forget
  useEffect(() => {
    migrateFromLocalStorage();
  }, []);

  const [activeId, setActiveId] = useState<string>(() => {
    const active = getActiveCompanion();
    return active.defaultId || 'athena';
  });

  // For custom companions loaded from IndexedDB
  const [customCompanion, setCustomCompanionState] = useState<CustomCompanion | null>(() => {
    // Custom companions are loaded async; start with null
    return null;
  });
  const [activeType, setActiveType] = useState<'default' | 'custom'>(() => {
    return getActiveCompanion().type;
  });

  const [companionProvider, setCompanionProviderState] = useState<ProviderId>(() => {
    return (localStorage.getItem('companion_provider') as ProviderId) || 'google';
  });

  const [userName, setUserNameState] = useState<string>(() => {
    return localStorage.getItem('traveler_user_name') || 'Yune';
  });

  const [customName, setCustomNameState] = useState<string>(() => {
    return localStorage.getItem('companion_custom_name') || 'Time Cop';
  });

  const [customPrompt, setCustomPromptState] = useState<string>(() => {
    return localStorage.getItem('companion_custom_prompt') || 'You are a sarcastic time cop from the year 3000. You make dry jokes, mock the user\'s simplistic temporal strategies, and constant references to hover-vehicles.';
  });

  const setCustomName = (name: string) => {
    setCustomNameState(name);
    localStorage.setItem('companion_custom_name', name);
  };

  const setCustomPrompt = (prompt: string) => {
    setCustomPromptState(prompt);
    localStorage.setItem('companion_custom_prompt', prompt);
  };

  const setCompanionProvider = (provider: ProviderId) => {
    setCompanionProviderState(provider);
    localStorage.setItem('companion_provider', provider);
  };

  const setUserName = (name: string) => {
    setUserNameState(name);
    localStorage.setItem('traveler_user_name', name);
  };

  // Compute active companion
  const activeCompanion: Companion = (() => {
    // Custom companion from IndexedDB takes priority
    if (activeType === 'custom' && customCompanion) {
      return {
        id: customCompanion.id,
        name: customCompanion.name,
        avatar: customCompanion.avatar || '🤖',
        description: customCompanion.styleTags.join(', ') || 'Custom companion',
        prompt: customCompanion.prompt,
      };
    }

    const base = defaultCompanions.find(c => c.id === activeId) || defaultCompanions[0];
    if (base.id === 'custom') {
      return {
        ...base,
        name: customName || 'Custom Companion',
        prompt: customPrompt
      };
    }
    if (base.id === 'athena') {
      const safeName = userName || 'Yune';
      return {
        ...base,
        prompt: base.prompt
          .replace(/\{\{preferences\}\}/g, formatPreferences(athenaPreferences))
          .replace(/\{\{userName\}\}/g, safeName),
      };
    }
    return base;
  })();

  const selectCompanion = (id: string) => {
    if (defaultCompanions.some(c => c.id === id)) {
      setActiveDefault(id);
      setActiveId(id);
      setActiveType('default');
      setCustomCompanionState(null);
    }
  };

  const selectCustomCompanion = useCallback((companion: CustomCompanion) => {
    setActiveCustom(companion.id);
    setCustomCompanionState(companion);
    setActiveType('custom');
  }, []);

  return (
    <CompanionContext.Provider
      value={{
        activeCompanion,
        selectCompanion,
        selectCustomCompanion,
        customName,
        setCustomName,
        customPrompt,
        setCustomPrompt,
        companionProvider,
        setCompanionProvider,
        userName,
        setUserName,
      }}
    >
      {children}
    </CompanionContext.Provider>
  );
}

export function useCompanion() {
  const context = useContext(CompanionContext);
  if (context === undefined) {
    throw new Error('useCompanion must be used within a CompanionProvider');
  }
  return context;
}
