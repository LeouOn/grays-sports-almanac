import { Share2 } from 'lucide-react';
import { share } from '@/lib/share';
import { showSuccess, showError } from '@/lib/toast';

interface ShareButtonProps {
  /** Title of the content being shared (used as the share sheet title). */
  title: string;
  /** Body text summarizing the shared content. */
  text: string;
  /** Optional extra classNames to merge onto the button. */
  className?: string;
}

/**
 * Reusable share button for content detail modals.
 *
 * Uses the platform-aware `share()` helper: native share sheet on Capacitor,
 * Web Share API on mobile browsers, clipboard fallback elsewhere. Shows a
 * success toast when the share completes.
 */
export function ShareButton({ title, text, className }: ShareButtonProps) {
  const handleClick = async () => {
    try {
      await share({ title, text });
      showSuccess('Shared!');
    } catch {
      showError('Failed to share');
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={
        className ??
        'text-neutral-400 hover:text-white transition-colors cursor-pointer inline-flex items-center justify-center'
      }
      aria-label={`Share ${title}`}
      title="Share"
    >
      <Share2 className="size-5" />
    </button>
  );
}
