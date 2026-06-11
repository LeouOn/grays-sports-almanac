/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useEffect } from 'react';
import { defaultCompanions, type Companion } from '../data/companions';
import { athenaPreferences, formatPreferences } from '../data/companions/athena-preferences';

export type ProviderId = 'google' | 'deepseek' | 'zhipu' | 'minimax' | 'openrouter';

/** Cost-ordered fallback chain — tried in order, first success wins */
export const COMPANION_PROVIDER_FALLBACK: ProviderId[] = ['minimax', 'zhipu', 'deepseek', 'google'];

interface CompanionContextType {
  activeCompanion: Companion;
  selectCompanion: (id: string) => void;
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
  const [activeId, setActiveId] = useState<string>(() => {
    return localStorage.getItem('companion_active_id') || 'athena';
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

  useEffect(() => {
    localStorage.setItem('companion_active_id', activeId);
  }, [activeId]);

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
      setActiveId(id);
    }
  };

  return (
    <CompanionContext.Provider
      value={{
        activeCompanion,
        selectCompanion,
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
