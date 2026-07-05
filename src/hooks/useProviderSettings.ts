import { useCallback, useEffect, useState } from 'react';
import { secureStorage } from '@/lib/secure-storage';

/**
 * Persisted configuration for a single LLM provider.
 *
 * Fields map 1:1 to the localStorage key-value pattern from the spec:
 *   `{providerName}_api_key`, `{providerName}_model`, `{providerName}_base_url`.
 * On native (Capacitor), these are stored in the device keystore via
 * `capacitor-secure-storage-plugin`. On web, they fall back to localStorage.
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
async function readNames(): Promise<readonly string[]> {
  const raw = await secureStorage.get(NAMES_KEY);
  if (!raw) return [];
  return raw
    .split(',')
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
}

/** Persist the name registry, clearing the key entirely when empty. */
async function writeNames(names: readonly string[]): Promise<void> {
  if (names.length === 0) {
    await secureStorage.remove(NAMES_KEY);
    return;
  }
  await secureStorage.set(NAMES_KEY, names.join(','));
}

/** Assemble a ProviderConfig from the three slots for `name`. */
async function readProvider(name: string): Promise<ProviderConfig> {
  const [apiKey, model, baseUrl] = await Promise.all([
    secureStorage.get(`${name}_api_key`),
    secureStorage.get(`${name}_model`),
    secureStorage.get(`${name}_base_url`),
  ]);
  return {
    providerName: name,
    apiKey: apiKey ?? '',
    model: model ?? '',
    baseUrl: baseUrl ?? '',
  };
}

/** Rebuild the full ProviderConfig list from the registry. */
async function readAllProviders(): Promise<readonly ProviderConfig[]> {
  const names = await readNames();
  return Promise.all(names.map(readProvider));
}

export interface ProviderSettings {
  /** Every configured provider, in registry (insertion) order. */
  readonly providers: readonly ProviderConfig[];
  /** Persist `config` (3 keys) and register its name if new. */
  readonly saveProvider: (config: ProviderConfig) => Promise<void>;
  /** Remove the 3 keys for `name` and unregister it. */
  readonly deleteProvider: (name: string) => Promise<void>;
  /** Look up a configured provider by name, or `undefined` if not registered. */
  readonly getProvider: (name: string) => Promise<ProviderConfig | undefined>;
  /** First configured provider name, falling back to {@link DEFAULT_PROVIDER_NAME}. */
  readonly activeProviderName: string;
  /** True until the initial load from secureStorage completes. */
  readonly loading: boolean;
}

/**
 * Client-side CRUD for LLM provider configs backed by secureStorage.
 *
 * The returned `providers` array is reactive: `saveProvider` / `deleteProvider`
 * persist to secureStorage then refresh state so consumers re-render.
 */
export function useProviderSettings(): ProviderSettings {
  const [providers, setProviders] = useState<readonly ProviderConfig[]>([]);
  const [loading, setLoading] = useState(true);

  // Initial load from secureStorage
  useEffect(() => {
    let cancelled = false;
    readAllProviders()
      .then((list) => {
        if (!cancelled) {
          setProviders(list);
          setLoading(false);
        }
      })
      .catch(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const saveProvider = useCallback(async (config: ProviderConfig): Promise<void> => {
    const { providerName, apiKey, model, baseUrl } = config;
    await Promise.all([
      secureStorage.set(`${providerName}_api_key`, apiKey),
      secureStorage.set(`${providerName}_model`, model),
      secureStorage.set(`${providerName}_base_url`, baseUrl),
    ]);
    const names = await readNames();
    if (!names.includes(providerName)) {
      await writeNames([...names, providerName]);
    }
    const list = await readAllProviders();
    setProviders(list);
  }, []);

  const deleteProvider = useCallback(async (name: string): Promise<void> => {
    await Promise.all([
      secureStorage.remove(`${name}_api_key`),
      secureStorage.remove(`${name}_model`),
      secureStorage.remove(`${name}_base_url`),
    ]);
    const names = await readNames();
    await writeNames(names.filter((n) => n !== name));
    const list = await readAllProviders();
    setProviders(list);
  }, []);

  const getProvider = useCallback(async (name: string): Promise<ProviderConfig | undefined> => {
    const names = await readNames();
    if (!names.includes(name)) return undefined;
    return readProvider(name);
  }, []);

  const activeProviderName = providers[0]?.providerName ?? DEFAULT_PROVIDER_NAME;

  return { providers, saveProvider, deleteProvider, getProvider, activeProviderName, loading };
}
