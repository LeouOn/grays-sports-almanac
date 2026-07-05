/**
 * Platform-aware share.
 *
 * On native (Capacitor): opens the native share sheet.
 * On web: uses Web Share API if available, falls back to clipboard.
 */
import { Share } from '@capacitor/share';
import { isNative } from './platform';

export interface ShareOptions {
  title?: string;
  text: string;
  url?: string;
  dialogTitle?: string;
}

export async function share(opts: ShareOptions): Promise<void> {
  if (isNative()) {
    await Share.share({
      title: opts.title,
      text: opts.text,
      url: opts.url,
      dialogTitle: opts.dialogTitle ?? opts.title,
    });
    return;
  }
  // Web: prefer Web Share API (mobile browsers), fall back to clipboard
  if (typeof navigator !== 'undefined' && 'share' in navigator) {
    try {
      await navigator.share({
        title: opts.title,
        text: opts.text,
        url: opts.url,
      });
      return;
    } catch {
      // user cancelled or not supported, fall through to clipboard
    }
  }
  if (typeof navigator !== 'undefined' && navigator.clipboard) {
    await navigator.clipboard.writeText(
      [opts.title, opts.text, opts.url].filter(Boolean).join('\n'),
    );
  }
}
