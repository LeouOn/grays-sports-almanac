/**
 * Platform detection helper.
 *
 * Returns true when running inside a native Capacitor shell (iOS/Android).
 * On web, returns false and we fall back to web APIs.
 */
import { Capacitor } from '@capacitor/core';

export const isNative = (): boolean => Capacitor.isNativePlatform();

export const platform = (): 'ios' | 'android' | 'web' =>
  Capacitor.getPlatform() as 'ios' | 'android' | 'web';
