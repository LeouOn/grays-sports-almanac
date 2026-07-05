import { useEffect, useRef, type RefObject } from 'react';

// Elements that are keyboard-focusable by default. We intentionally exclude
// [tabindex="-1"] (programmatically focusable but skipped in tab order) and
// disabled controls.
const FOCUSABLE_SELECTOR = [
  'a[href]:not([disabled])',
  'button:not([disabled])',
  'textarea:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  '[tabindex]:not([tabindex="-1"]):not([disabled])',
].join(',');

function getFocusable(container: HTMLElement): HTMLElement[] {
  return Array.from(
    container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR),
  ).filter(
    // Drop visually hidden elements (offsetParent is null when display:none
    // or hidden). Keep the currently focused element so the trap stays put
    // even if it lives in a zero-size container.
    el => el.offsetParent !== null || el === document.activeElement,
  );
}

/**
 * Trap keyboard focus inside a modal-style overlay.
 *
 * Attach the returned ref to the modal container element. When `isOpen`
 * flips to true the hook:
 *   1. remembers the currently focused element (the trigger),
 *   2. moves focus to the first focusable child of the container,
 *   3. cycles Tab / Shift+Tab so focus never leaves the container,
 *   4. restores focus to the trigger when `isOpen` flips back to false.
 *
 * Escape-to-close and all other key handling remain the caller's
 * responsibility — this hook only owns focus, not visibility.
 */
export function useModalFocus<T extends HTMLElement>(
  isOpen: boolean,
): RefObject<T | null> {
  const ref = useRef<T>(null);
  const previousFocus = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    previousFocus.current = (document.activeElement as HTMLElement) ?? null;

    // Lock body scroll while the modal is open so the background page can't
    // scroll underneath on mobile (especially iOS Safari / Capacitor WebView).
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const node = ref.current;
    if (node) {
      const focusable = getFocusable(node);
      const first = focusable[0];
      if (first) first.focus();
      else node.focus();
    }

    const handleKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;
      const current = ref.current;
      if (!current) return;

      const focusable = getFocusable(current);
      if (focusable.length === 0) {
        e.preventDefault();
        current.focus();
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement as HTMLElement | null;

      if (e.shiftKey) {
        if (active === first || !current.contains(active)) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (active === last || !current.contains(active)) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener('keydown', handleKey);

    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = prevOverflow;
      const prev = previousFocus.current;
      if (prev && typeof prev.focus === 'function') {
        prev.focus();
      }
    };
  }, [isOpen]);

  return ref;
}
