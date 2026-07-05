import { useCallback, useState } from 'react';

/**
 * Persisted configuration for a single LLM provider.
 *
 * Fields map 1:1 to the localStorage key-value pattern from the spec:
 *   `{providerName}_api_key`, `{providerName}_model`, `{providerName}_base_url`.
 */
export interface ProviderConfig {
  readonly providerName: string;
  readonly baseUrl: string;
  readonly apiKey: string;
  readonly model: string;
}

/** Registry key holding the comma-separated list of configured provider names. */
const NAMES_KEY = 'provider_names';

/**
 * Default provider used when none is configured — first link in the
 * cost-ordered fallback chain (`minimax`).
 */
export const DEFAULT_PROVIDER_NAME = 'minimax';

/** Read the configured provider names in insertion order. */
function readNames(): readonly string[] {
  const raw = localStorage.getItem(NAMES_KEY);
  if (!raw) return [];
  return raw
    .split(',')
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
}

/** Persist the name registry, clearing the key entirely when empty. */
function writeNames(names: readonly string[]): void {
  if (names.length === 0) {
    localStorage.removeItem(NAMES_KEY);
    return;
  }
  localStorage.setItem(NAMES_KEY, names.join(','));
}

/** Assemble a ProviderConfig from the three localStorage slots for `name`. */
function readProvider(name: string): ProviderConfig {
  return {
    providerName: name,
    apiKey: localStorage.getItem(`${name}_api_key`) ?? '',
    model: localStorage.getItem(`${name}_model`) ?? '',
    baseUrl: localStorage.getItem(`${name}_base_url`) ?? '',
  };
}

/** Rebuild the full ProviderConfig list from the registry. */
function readAllProviders(): readonly ProviderConfig[] {
  return readNames().map(readProvider);
}

export interface ProviderSettings {
  /** Every configured provider, in registry (insertion) order. */
  readonly providers: readonly ProviderConfig[];
  /** Persist `config` (3 keys) and register its name if new. */
  readonly saveProvider: (config: ProviderConfig) => void;
  /** Remove the 3 keys for `name` and unregister it. */
  readonly deleteProvider: (name: string) => void;
  /** Look up a configured provider by name, or `undefined` if not registered. */
  readonly getProvider: (name: string) => ProviderConfig | undefined;
  /** First configured provider name, falling back to {@link DEFAULT_PROVIDER_NAME}. */
  readonly activeProviderName: string;
}

/**
 * Client-side CRUD for LLM provider configs backed by localStorage.
 *
 * The returned `providers` array is reactive: `saveProvider` / `deleteProvider`
 * mutate localStorage then refresh state so consumers re-render.
 */
export function useProviderSettings(): ProviderSettings {
  const [providers, setProviders] = useState<readonly ProviderConfig[]>(readAllProviders);

  const saveProvider = useCallback((config: ProviderConfig): void => {
    const { providerName, apiKey, model, baseUrl } = config;
    localStorage.setItem(`${providerName}_api_key`, apiKey);
    localStorage.setItem(`${providerName}_model`, model);
    localStorage.setItem(`${providerName}_base_url`, baseUrl);
    const names = readNames();
    if (!names.includes(providerName)) {
      writeNames([...names, providerName]);
    }
    setProviders(readAllProviders());
  }, []);

  const deleteProvider = useCallback((name: string): void => {
    localStorage.removeItem(`${name}_api_key`);
    localStorage.removeItem(`${name}_model`);
    localStorage.removeItem(`${name}_base_url`);
    writeNames(readNames().filter((n) => n !== name));
    setProviders(readAllProviders());
  }, []);

  const getProvider = useCallback((name: string): ProviderConfig | undefined => {
    if (!readNames().includes(name)) return undefined;
    return readProvider(name);
  }, []);

  const activeProviderName = providers[0]?.providerName ?? DEFAULT_PROVIDER_NAME;

  return { providers, saveProvider, deleteProvider, getProvider, activeProviderName };
}
