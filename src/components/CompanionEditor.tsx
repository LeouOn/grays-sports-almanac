import { useState, useEffect } from 'react';
import { X, Eye, Trash2, Save } from 'lucide-react';
import {
  createCompanion,
  getCompanion,
  updateCompanion,
  deleteCompanion,
  type CompanionInput,
} from '@/services/companionService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CompanionPreviewChat } from '@/components/CompanionPreviewChat';
import { showSuccess, showError } from '@/lib/toast';

interface CompanionEditorProps {
  companionId?: string;
  onSave: () => void;
  onCancel: () => void;
}

export function CompanionEditor({ companionId, onSave, onCancel }: CompanionEditorProps) {
  const isEdit = !!companionId;
  const [name, setName] = useState('');
  const [prompt, setPrompt] = useState('');
  const [avatar, setAvatar] = useState('🤖');
  const [styleTagsInput, setStyleTagsInput] = useState('');
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(isEdit);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPreview, setShowPreview] = useState(false);
const [confirmDelete, setConfirmDelete] = useState(false);

  // Load existing companion data for edit mode
  useEffect(() => {
    if (!companionId) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoading(true);
    getCompanion(companionId)
      .then((c) => {
        if (c) {
          setName(c.name);
          setPrompt(c.prompt);
          setAvatar(c.avatar || '🤖');
          setStyleTagsInput(c.styleTags.join(', '));
        }
      })
      .catch(() => showError('Failed to load companion'))
      .finally(() => setLoading(false));
  }, [companionId]);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!name.trim()) newErrors.name = 'Name is required';
    if (!prompt.trim()) newErrors.prompt = 'Prompt is required';
    else if (prompt.trim().length < 10) newErrors.prompt = 'Prompt must be at least 10 characters';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    setSaving(true);

    const styleTags = styleTagsInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const input: CompanionInput = {
      name: name.trim(),
      prompt: prompt.trim(),
      avatar: avatar.trim() || '🤖',
      styleTags,
    };

    try {
      if (isEdit && companionId) {
        await updateCompanion(companionId, input);
        showSuccess('Companion updated');
      } else {
        await createCompanion(input);
        showSuccess('Companion created');
      }
      onSave();
    } catch {
      showError('Failed to save companion');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!companionId) return;
    setConfirmDelete(false);
    try {
      await deleteCompanion(companionId);
      showSuccess('Companion deleted');
      onSave();
    } catch {
      showError('Failed to delete companion');
    }
  };

const handleDeleteClick = () => {
    setConfirmDelete(true);
};

  // Loading skeleton for edit mode
  if (loading) {
    return (
      <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-start sm:items-center justify-center p-4 animate-in fade-in duration-200">
        <div className="bg-neutral-900 border border-neutral-800 w-full max-w-lg rounded-xl shadow-2xl animate-in zoom-in-95 duration-200 p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-6 w-32 bg-neutral-800 rounded" />
            <div className="h-8 bg-neutral-800 rounded" />
            <div className="h-24 bg-neutral-800 rounded" />
            <div className="h-8 bg-neutral-800 rounded" />
          </div>
        </div>
      </div>
    );
  }

  // Preview chat mode
  if (showPreview) {
    return (
      <CompanionPreviewChat
        companion={{ name: name.trim() || 'Preview', prompt: prompt.trim() }}
        onClose={() => setShowPreview(false)}
      />
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-start sm:items-center justify-center p-4 animate-in fade-in duration-200">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="companion-editor-title"
        className="bg-neutral-900 border border-neutral-800 w-full max-w-lg rounded-xl shadow-2xl flex flex-col max-h-[80dvh] overflow-hidden animate-in zoom-in-95 duration-200"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-neutral-800 shrink-0">
          <h2 id="companion-editor-title" className="text-base font-bold text-white">
            {isEdit ? 'Edit Companion' : 'New Companion'}
          </h2>
          <button
            onClick={onCancel}
            className="text-neutral-500 hover:text-white transition-colors cursor-pointer"
            aria-label="Close editor"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Form */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Name */}
          <div>
            <label
              htmlFor="companion-name"
              className="text-[10px] font-bold tracking-wider text-neutral-500 uppercase block mb-1"
            >
              Name
            </label>
            <Input
              id="companion-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Professor Paradox"
              className={
                errors.name
                  ? 'border-red-500/50 focus:border-red-500 bg-neutral-900 text-white'
                  : 'bg-neutral-900 text-white border-neutral-800'
              }
            />
            {errors.name && (
              <p className="text-[10px] text-red-400 mt-1">{errors.name}</p>
            )}
          </div>

          {/* Prompt */}
          <div>
            <label
              htmlFor="companion-prompt"
              className="text-[10px] font-bold tracking-wider text-neutral-500 uppercase block mb-1"
            >
              Prompt / Persona
            </label>
            <textarea
              id="companion-prompt"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe your companion's voice, personality, knowledge, and catchphrases..."
              rows={5}
              className={`w-full rounded-lg border px-2.5 py-1.5 text-sm text-white focus:outline-none focus:ring-0 font-sans leading-relaxed resize-y ${
                errors.prompt
                  ? 'border-red-500/50 focus:border-red-500 bg-red-950/10'
                  : 'bg-neutral-900 border-neutral-800 focus:border-indigo-500'
              }`}
            />
            {errors.prompt ? (
              <p className="text-[10px] text-red-400 mt-1">{errors.prompt}</p>
            ) : (
              <p className="text-[10px] text-neutral-500 mt-1">
                Min 10 characters. Used as the system prompt for the chat model.
              </p>
            )}
          </div>

          {/* Avatar */}
          <div>
            <label
              htmlFor="companion-avatar"
              className="text-[10px] font-bold tracking-wider text-neutral-500 uppercase block mb-1"
            >
              Avatar (emoji)
            </label>
            <div className="flex items-center gap-3">
              <span className="text-3xl">{avatar.trim() || '🤖'}</span>
              <Input
                id="companion-avatar"
                type="text"
                value={avatar}
                onChange={(e) => setAvatar(e.target.value)}
                placeholder="🤖"
                maxLength={8}
                className="flex-1 bg-neutral-900 text-white border-neutral-800"
              />
            </div>
          </div>

          {/* Style Tags */}
          <div>
            <label
              htmlFor="companion-tags"
              className="text-[10px] font-bold tracking-wider text-neutral-500 uppercase block mb-1"
            >
              Style Tags
            </label>
            <Input
              id="companion-tags"
              type="text"
              value={styleTagsInput}
              onChange={(e) => setStyleTagsInput(e.target.value)}
              placeholder="e.g. humorous, 80s, scientist"
              className="bg-neutral-900 text-white border-neutral-800"
            />
            <p className="text-[10px] text-neutral-500 mt-1">
              Comma-separated tags to describe your companion&apos;s style.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-neutral-800 bg-neutral-950/20 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            {isEdit && (
              <Button onClick={handleDeleteClick} variant="destructive" size="sm">
                <Trash2 className="size-3.5 mr-1" />
                Delete
              </Button>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Button
              onClick={() => setShowPreview(true)}
              variant="ghost"
              size="sm"
              disabled={!prompt.trim()}
            >
              <Eye className="size-3.5 mr-1" />
              Preview
            </Button>
            <Button onClick={onCancel} variant="secondary" size="sm">
              Cancel
            </Button>
            <Button onClick={handleSave} variant="default" size="sm" disabled={saving}>
              <Save className="size-3.5 mr-1" />
              {saving ? 'Saving...' : 'Save'}
            </Button>
          </div>
        </div>
      </div>

      {/* Delete confirmation modal */}
      {confirmDelete && (
        <div
          className="absolute inset-0 z-10 bg-black/80 backdrop-blur-md flex items-start sm:items-center justify-center p-4 animate-in fade-in duration-200"
          role="dialog"
          aria-modal="true"
          aria-labelledby="confirm-delete-title"
        >
          <div className="bg-neutral-900 border border-neutral-800 w-full max-w-md rounded-xl shadow-2xl animate-in zoom-in-95 duration-200 p-6 space-y-4">
            <h2 id="confirm-delete-title" className="text-lg font-semibold text-white">
              Delete this companion?
            </h2>
            <p className="text-sm text-neutral-400">
              This cannot be undone. The companion will be permanently removed from your collection.
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <Button
                onClick={() => setConfirmDelete(false)}
                variant="ghost"
                size="sm"
              >
                Cancel
              </Button>
              <Button
                onClick={handleDelete}
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
