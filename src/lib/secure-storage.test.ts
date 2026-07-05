import { describe, it, expect, vi, beforeEach } from 'vitest';

// Use vi.hoisted so the mock objects are available when vi.mock factories run
// (vi.mock is hoisted to the top of the file, before any const declarations).
const mocks = vi.hoisted(() => ({
  isNative: vi.fn(() => false),
  secure: {
    getItem: vi.fn(),
    setItem: vi.fn(),
    removeItem: vi.fn(),
    keys: vi.fn(),
    clear: vi.fn(),
  },
}));

vi.mock('@/lib/platform', () => ({
  isNative: () => mocks.isNative(),
}));
vi.mock('capacitor-secure-storage-plugin', () => ({
  SecureStorage: mocks.secure,
}));

const { isNative: mockIsNative, secure: mockSecure } = mocks;

import { secureStorage } from './secure-storage';

describe('secureStorage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    mockIsNative.mockReturnValue(false);
  });

  describe('on web (localStorage fallback)', () => {
    it('set stores a value in localStorage', async () => {
      await secureStorage.set('key1', 'value1');
      expect(localStorage.getItem('key1')).toBe('value1');
    });

    it('get retrieves a value from localStorage', async () => {
      localStorage.setItem('key1', 'value1');
      const result = await secureStorage.get('key1');
      expect(result).toBe('value1');
    });

    it('get returns null for missing key', async () => {
      const result = await secureStorage.get('nonexistent');
      expect(result).toBeNull();
    });

    it('remove deletes the key from localStorage', async () => {
      localStorage.setItem('key1', 'value1');
      await secureStorage.remove('key1');
      expect(localStorage.getItem('key1')).toBeNull();
    });

    it('keys returns all localStorage keys', async () => {
      localStorage.setItem('a', '1');
      localStorage.setItem('b', '2');
      const keys = await secureStorage.keys();
      expect(keys).toEqual(expect.arrayContaining(['a', 'b']));
    });

    it('clear empties localStorage', async () => {
      localStorage.setItem('a', '1');
      localStorage.setItem('b', '2');
      await secureStorage.clear();
      expect(localStorage.length).toBe(0);
    });

    it('does NOT call SecureStorage plugin on web', async () => {
      await secureStorage.set('key', 'val');
      await secureStorage.get('key');
      await secureStorage.remove('key');
      expect(mockSecure.setItem).not.toHaveBeenCalled();
      expect(mockSecure.getItem).not.toHaveBeenCalled();
      expect(mockSecure.removeItem).not.toHaveBeenCalled();
    });
  });

  describe('on native (Capacitor SecureStorage)', () => {
    beforeEach(() => {
      mockIsNative.mockReturnValue(true);
    });

    it('set calls SecureStorage.setItem', async () => {
      mockSecure.setItem.mockResolvedValue(undefined);
      await secureStorage.set('api_key_openai', 'sk-test');
      expect(mockSecure.setItem).toHaveBeenCalledWith({
        key: 'api_key_openai',
        value: 'sk-test',
      });
    });

    it('get calls SecureStorage.getItem and returns the value', async () => {
      mockSecure.getItem.mockResolvedValue({ value: 'sk-test' });
      const result = await secureStorage.get('api_key_openai');
      expect(result).toBe('sk-test');
      expect(mockSecure.getItem).toHaveBeenCalledWith({ key: 'api_key_openai' });
    });

    it('get returns null when SecureStorage returns null value', async () => {
      mockSecure.getItem.mockResolvedValue({ value: null });
      const result = await secureStorage.get('missing');
      expect(result).toBeNull();
    });

    it('remove calls SecureStorage.removeItem', async () => {
      mockSecure.removeItem.mockResolvedValue(undefined);
      await secureStorage.remove('api_key_openai');
      expect(mockSecure.removeItem).toHaveBeenCalledWith({ key: 'api_key_openai' });
    });

    it('keys returns the SecureStorage keys', async () => {
      mockSecure.keys.mockResolvedValue({ keys: ['a', 'b', 'c'] });
      const keys = await secureStorage.keys();
      expect(keys).toEqual(['a', 'b', 'c']);
    });

    it('clear calls SecureStorage.clear', async () => {
      mockSecure.clear.mockResolvedValue(undefined);
      await secureStorage.clear();
      expect(mockSecure.clear).toHaveBeenCalled();
    });
  });
});
