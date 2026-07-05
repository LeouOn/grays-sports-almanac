/**
 * Platform-aware secure storage.
 *
 * On native (Capacitor Android/iOS): uses capacitor-secure-storage-plugin
 *   which encrypts and stores in Android Keystore / iOS Keychain.
 * On web: falls back to localStorage (less secure but functional for dev).
 *
 * Use for sensitive values like LLM API keys.
 */
import { isNative } from './platform';
// @ts-expect-error - capacitor-secure-storage-plugin has no bundled types
import { SecureStorage } from 'capacitor-secure-storage-plugin';

const secure = SecureStorage as {
  getItem(opts: { key: string }): Promise<{ value: string | null }>;
  setItem(opts: { key: string; value: string }): Promise<void>;
  removeItem(opts: { key: string }): Promise<void>;
  clear(): Promise<void>;
  keys(): Promise<{ keys: string[] }>;
};

export const secureStorage = {
  async get(key: string): Promise<string | null> {
    if (isNative()) {
      const { value } = await secure.getItem({ key });
      return value;
    }
    return localStorage.getItem(key);
  },

  async set(key: string, value: string): Promise<void> {
    if (isNative()) {
      await secure.setItem({ key, value });
      return;
    }
    localStorage.setItem(key, value);
  },

  async remove(key: string): Promise<void> {
    if (isNative()) {
      await secure.removeItem({ key });
      return;
    }
    localStorage.removeItem(key);
  },

  async keys(): Promise<string[]> {
    if (isNative()) {
      const { keys } = await secure.keys();
      return keys;
    }
      const out: string[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (k) out.push(k);
      }
      return out;
  },

  async clear(): Promise<void> {
    if (isNative()) {
      await secure.clear();
      return;
    }
    localStorage.clear();
  },
};
