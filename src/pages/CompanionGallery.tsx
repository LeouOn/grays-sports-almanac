import { useState, useEffect, useCallback, useRef } from 'react';
import { Link } from 'react-router';
import { Plus, Search, Trash2, Edit3, UserCheck, ArrowLeft, Download, Upload } from 'lucide-react';
import {
  listCompanions,
  searchCompanions,
  deleteCompanion,
} from '@/services/companionService';
import { type CustomCompanion } from '@/lib/idb';
import { useCompanion } from '@/context/CompanionContext';
import { CompanionEditor } from '@/components/CompanionEditor';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { showSuccess, showError } from '@/lib/toast';
import { exportCompanions, importCompanions, downloadJSON } from '@/services/companionIO';

export function CompanionGallery() {
  const { selectCustomCompanion, selectCompanion, activeCompanion } = useCompanion();
  const [companions, setCompanions] = useState<CustomCompanion[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [editorOpen, setEditorOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | undefined>(undefined);
  const [confirmDelete, setConfirmDelete] = useState<{ id: string; name: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const all = await listCompanions();
      setCompanions(all);
    } catch {
      showError('Failed to load companions');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
  }, [load]);

  // Debounced search
  useEffect(() => {
    if (!searchQuery.trim()) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      load();
      return;
    }
    const timer = setTimeout(async () => {
      try {
        const results = await searchCompanions(searchQuery);
        setCompanions(results);
      } catch {
        /* keep current results */
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery, load]);

  const handleDelete = async (id: string, name: string) => {
    // Show confirmation dialog before deleting
    setConfirmDelete({ id, name });
  };

  const confirmDeleteAction = async () => {
    if (!confirmDelete) return;
    const { id, name } = confirmDelete;
    setConfirmDelete(null);
    try {
      await deleteCompanion(id);
      showSuccess(`"${name}" deleted`);
      // If the deleted companion was active, reset to Athena
      if (activeCompanion.id === id) {
        selectCompanion('athena');
      }
      load();
    } catch {
      showError('Failed to delete companion');
    }
  };

  const handleSetActive = (companion: CustomCompanion) => {
    selectCustomCompanion(companion);
    showSuccess(`Active companion: ${companion.name}`);
  };

  const handleEdit = (id: string) => {
    setEditingId(id);
    setEditorOpen(true);
  };

  const handleNew = () => {
    setEditingId(undefined);
    setEditorOpen(true);
  };

  const handleExportAll = async () => {
    try {
      const json = await exportCompanions();
      downloadJSON(json, `companions-${new Date().toISOString().slice(0, 10)}.json`);
      showSuccess('Companions exported');
    } catch {
      showError('Failed to export companions');
    }
  };

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const count = await importCompanions(text);
      showSuccess(`Imported ${count} companion${count !== 1 ? 's' : ''}`);
      load();
    } catch (err) {
      showError(err instanceof Error ? err.message : 'Import failed');
    } finally {
      // Reset the input so the same file can be re-imported
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleEditorClose = () => {
    setEditorOpen(false);
    setEditingId(undefined);
    load();
  };

  const isCustomActive = (companionId: string) => activeCompanion.id === companionId;

  // Loading state
  if (loading) {
    return (
      <div className="space-y-8 animate-pulse">
        <div className="h-10 w-64 bg-neutral-800 rounded" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-44 bg-neutral-900 border border-neutral-800 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <Link
              to="/"
              className="inline-flex items-center justify-center size-7 rounded-md border border-neutral-800 bg-neutral-900/50 hover:bg-neutral-900 text-neutral-400 hover:text-white transition-all"
              aria-label="Back to Dashboard"
            >
              <ArrowLeft className="size-3.5" />
            </Link>
            <h1 className="text-2xl font-bold tracking-tight text-white">Companions</h1>
          </div>
          <p className="text-neutral-400">
            Create and manage your custom time travel companions.
          </p>
        </div>
        <Button onClick={handleNew} variant="default" size="sm" className="shrink-0">
          <Plus className="size-3.5 mr-1" />
          New Companion
        </Button>
        <div className="flex items-center gap-2">
          <Button onClick={handleExportAll} variant="outline" size="sm" className="shrink-0">
            <Download className="size-3.5 mr-1" />
            Export All
          </Button>
          <Button
            onClick={() => fileInputRef.current?.click()}
            variant="outline"
            size="sm"
            className="shrink-0"
          >
            <Upload className="size-3.5 mr-1" />
            Import
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={handleImport}
            className="hidden"
            aria-label="Import companions JSON file"
          />
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-neutral-500 pointer-events-none" />
        <input
          type="text"
          placeholder="Search companions..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full h-9 pl-9 pr-3 rounded-lg border border-neutral-800 bg-neutral-900 text-sm text-white placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-colors"
          aria-label="Search companions"
        />
      </div>

      {/* Empty state */}
      {companions.length === 0 && !searchQuery.trim() && (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="text-6xl mb-6">🤖</div>
          <h2 className="text-xl font-semibold text-neutral-200 mb-2">
            Create your first custom companion
          </h2>
          <p className="text-neutral-400 max-w-md mb-6">
            Design a unique personality to accompany you on your temporal journey.
            Give them a name, a backstory, and watch them come alive in your chats.
          </p>
          <Button onClick={handleNew} variant="default">
            <Plus className="size-4 mr-1" />
            New Companion
          </Button>
        </div>
      )}

      {/* Empty search results */}
      {companions.length === 0 && searchQuery.trim() && (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="text-5xl mb-4">🔍</div>
          <h2 className="text-lg font-medium text-neutral-300 mb-1">No companions found</h2>
          <p className="text-neutral-500 text-sm">
            No companions matching &quot;{searchQuery}&quot;. Try a different name or tag.
          </p>
        </div>
      )}

      {/* Card grid */}
      {companions.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {companions.map((c) => (
            <Card
              key={c.id}
              className={`bg-neutral-900 border-neutral-800 hover:border-indigo-800/50 transition-colors ${
                isCustomActive(c.id) ? 'ring-1 ring-indigo-500/50 border-indigo-500/30' : ''
              }`}
            >
              <CardContent className="pt-5 space-y-4">
                {/* Avatar + Name */}
                <div className="flex items-start gap-3">
                  <span className="text-4xl leading-none shrink-0" aria-hidden="true">
                    {c.avatar || '🤖'}
                  </span>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold text-white truncate">{c.name}</h3>
                    <p className="text-xs text-neutral-500 mt-0.5">
                      {new Date(c.createdAt).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </p>
                  </div>
                  {isCustomActive(c.id) && (
                    <span className="shrink-0 px-2 py-0.5 rounded-full bg-indigo-500/20 border border-indigo-500/30 text-[10px] font-semibold text-indigo-400">
                      Active
                    </span>
                  )}
                </div>

                {/* Style tags */}
                {c.styleTags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {c.styleTags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 rounded-full bg-neutral-800 text-xs text-neutral-400"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* Action buttons */}
                <div className="flex items-center gap-2 pt-1">
                  <Button
                    onClick={() => handleSetActive(c)}
                    variant={isCustomActive(c.id) ? 'default' : 'secondary'}
                    size="xs"
                    className="flex-1"
                    disabled={isCustomActive(c.id)}
                  >
                    <UserCheck className="size-3 mr-1" />
                    {isCustomActive(c.id) ? 'Active' : 'Set Active'}
                  </Button>
                  <Button
                    onClick={() => handleEdit(c.id)}
                    variant="ghost"
                    size="icon-xs"
                    aria-label={`Edit ${c.name}`}
                  >
                    <Edit3 className="size-3" />
                  </Button>
                  <Button
                    onClick={() => handleDelete(c.id, c.name)}
                    variant="ghost"
                    size="icon-xs"
                    aria-label={`Delete ${c.name}`}
                  >
                    <Trash2 className="size-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Editor modal */}
      {editorOpen && (
        <CompanionEditor
          companionId={editingId}
          onSave={handleEditorClose}
          onCancel={handleEditorClose}
        />
      )}

      {/* Delete confirmation modal */}
      {confirmDelete && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-start sm:items-center justify-center p-4 animate-in fade-in duration-200"
          role="dialog"
          aria-modal="true"
          aria-labelledby="confirm-delete-title"
        >
          <div className="bg-neutral-900 border border-neutral-800 w-full max-w-md rounded-xl shadow-2xl animate-in zoom-in-95 duration-200 p-6 space-y-4">
            <h2 id="confirm-delete-title" className="text-lg font-semibold text-white">
              Delete &quot;{confirmDelete.name}&quot;?
            </h2>
            <p className="text-sm text-neutral-400">
              This cannot be undone. The companion will be permanently removed from your collection.
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <Button
                onClick={() => setConfirmDelete(null)}
                variant="ghost"
                size="sm"
              >
                Cancel
              </Button>
              <Button
                onClick={confirmDeleteAction}
                variant="destructive"
                size="sm"
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
