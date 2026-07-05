import { Bookmark, BookmarkCheck } from 'lucide-react';
import { useBookmarks } from '@/hooks/useBookmarks';
import { showSuccess, showError } from '@/lib/toast';

interface BookmarkButtonProps {
  module: string;
  entryId: string;
  title?: string;
}

export function BookmarkButton({ module, entryId, title }: BookmarkButtonProps) {
  const { isBookmarked, toggleBookmark } = useBookmarks();
  const bookmarked = isBookmarked(module, entryId);

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const result = await toggleBookmark(module, entryId, title);
    if (result === true) {
      showSuccess('Bookmarked!');
    } else if (result === false) {
      showSuccess('Bookmark removed');
    } else {
      showError('Failed to update bookmark');
    }
  };

  return (
    <button
      onClick={handleClick}
      className="inline-flex items-center justify-center size-9 min-h-11 min-w-11 rounded-md border border-neutral-800 bg-neutral-900/50 hover:bg-neutral-900 text-neutral-400 hover:text-white transition-all cursor-pointer select-none shrink-0"
      title={bookmarked ? 'Remove bookmark' : 'Bookmark this entry'}
      aria-label={bookmarked ? 'Remove bookmark' : 'Bookmark this entry'}
      aria-pressed={bookmarked}
    >
      {bookmarked ? (
        <BookmarkCheck className="size-3.5 text-indigo-400" />
      ) : (
        <Bookmark className="size-3.5" />
      )}
    </button>
  );
}
