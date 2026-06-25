import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor, cleanup } from '@testing-library/react';

// Hoisted mocks: vi.mock factories run before top-level statements.
const { serviceMock, previewChatStub } = vi.hoisted(() => {
  const serviceMock = {
    createCompanion: vi.fn(),
    getCompanion: vi.fn(),
    updateCompanion: vi.fn(),
    deleteCompanion: vi.fn(),
  };
  // Stub the streaming preview chat — it calls /api/chat and parses SSE.
  const previewChatStub = vi.fn(({ onClose }: {
    companion: { name: string; prompt: string };
    onClose: () => void;
  }) => (
    <div data-testid="preview-chat-stub">
      <button onClick={onClose}>ClosePreview</button>
    </div>
  ));
  return { serviceMock, previewChatStub };
});

vi.mock('@/services/companionService', () => serviceMock);
vi.mock('@/components/CompanionPreviewChat', () => ({
  CompanionPreviewChat: previewChatStub,
}));

import { CompanionEditor } from '@/components/CompanionEditor';

const existingCompanion = {
  id: 'c1',
  name: 'Existing Bot',
  prompt: 'Existing prompt longer than ten chars',
  avatar: '🦊',
  styleTags: ['existing', 'tag'],
  createdAt: 1_700_000_000_000,
  updatedAt: 1_700_000_000_000,
};

describe('CompanionEditor — new mode', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    serviceMock.createCompanion.mockResolvedValue({
      id: 'new-id',
      ...existingCompanion,
    });
  });

  afterEach(() => {
    cleanup();
  });

  it('renders all form fields and the "New Companion" title', () => {
    render(<CompanionEditor onSave={vi.fn()} onCancel={vi.fn()} />);
    expect(screen.getByLabelText('Name')).toBeTruthy();
    expect(screen.getByLabelText('Prompt / Persona')).toBeTruthy();
    expect(screen.getByLabelText('Avatar (emoji)')).toBeTruthy();
    expect(screen.getByLabelText('Style Tags')).toBeTruthy();
    expect(screen.getByText('New Companion')).toBeTruthy();
  });

  it('shows validation error when name is empty on submit', () => {
    render(<CompanionEditor onSave={vi.fn()} onCancel={vi.fn()} />);

    fireEvent.change(screen.getByLabelText('Prompt / Persona'), {
      target: { value: 'A reasonably long prompt for testing' },
    });
    fireEvent.click(screen.getByText('Save'));

    expect(screen.getByText('Name is required')).toBeTruthy();
    expect(serviceMock.createCompanion).not.toHaveBeenCalled();
  });

  it('shows validation error when prompt is shorter than 10 characters', () => {
    render(<CompanionEditor onSave={vi.fn()} onCancel={vi.fn()} />);

    fireEvent.change(screen.getByLabelText('Name'), {
      target: { value: 'Test' },
    });
    fireEvent.change(screen.getByLabelText('Prompt / Persona'), {
      target: { value: 'short' },
    });
    fireEvent.click(screen.getByText('Save'));

    expect(
      screen.getByText('Prompt must be at least 10 characters'),
    ).toBeTruthy();
    expect(serviceMock.createCompanion).not.toHaveBeenCalled();
  });

  it('calls createCompanion with trimmed fields and parsed styleTags, then invokes onSave', async () => {
    const onSave = vi.fn();
    render(<CompanionEditor onSave={onSave} onCancel={vi.fn()} />);

    fireEvent.change(screen.getByLabelText('Name'), {
      target: { value: '  NewBot  ' },
    });
    fireEvent.change(screen.getByLabelText('Prompt / Persona'), {
      target: { value: '  A prompt with more than ten chars  ' },
    });
    fireEvent.change(screen.getByLabelText('Avatar (emoji)'), {
      target: { value: '🎩' },
    });
    fireEvent.change(screen.getByLabelText('Style Tags'), {
      target: { value: 'tag1, tag2 , tag3,' },
    });
    fireEvent.click(screen.getByText('Save'));

    await waitFor(() => {
      expect(serviceMock.createCompanion).toHaveBeenCalledWith({
        name: 'NewBot',
        prompt: 'A prompt with more than ten chars',
        avatar: '🎩',
        styleTags: ['tag1', 'tag2', 'tag3'],
      });
      expect(onSave).toHaveBeenCalledTimes(1);
    });
  });

  it('Cancel button calls onCancel without saving', () => {
    const onCancel = vi.fn();
    render(<CompanionEditor onSave={vi.fn()} onCancel={onCancel} />);

    fireEvent.click(screen.getByText('Cancel'));

    expect(onCancel).toHaveBeenCalledTimes(1);
    expect(serviceMock.createCompanion).not.toHaveBeenCalled();
  });

  it('clicking Preview renders the CompanionPreviewChat stub with the trimmed companion data', async () => {
    render(<CompanionEditor onSave={vi.fn()} onCancel={vi.fn()} />);

    fireEvent.change(screen.getByLabelText('Name'), {
      target: { value: '  PreviewBot  ' },
    });
    fireEvent.change(screen.getByLabelText('Prompt / Persona'), {
      target: { value: 'A test prompt for the preview chat' },
    });
    fireEvent.click(screen.getByText('Preview'));

    await waitFor(() => {
      expect(screen.getByTestId('preview-chat-stub')).toBeTruthy();
    });

    const props = previewChatStub.mock.calls[0][0] as {
      companion: { name: string; prompt: string };
    };
    expect(props.companion).toEqual({
      name: 'PreviewBot',
      prompt: 'A test prompt for the preview chat',
    });
  });
});

describe('CompanionEditor — edit mode', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  it('pre-fills existing companion data on mount', async () => {
    serviceMock.getCompanion.mockResolvedValue(existingCompanion);

    render(
      <CompanionEditor
        companionId="c1"
        onSave={vi.fn()}
        onCancel={vi.fn()}
      />,
    );

    await waitFor(() => {
      expect(
        (screen.getByLabelText('Name') as HTMLInputElement).value,
      ).toBe('Existing Bot');
    });
    expect(
      (screen.getByLabelText('Prompt / Persona') as HTMLTextAreaElement)
        .value,
    ).toBe('Existing prompt longer than ten chars');
    expect(
      (screen.getByLabelText('Avatar (emoji)') as HTMLInputElement).value,
    ).toBe('🦊');
    // styleTags joined with ", "
    expect(
      (screen.getByLabelText('Style Tags') as HTMLInputElement).value,
    ).toBe('existing, tag');
    expect(screen.getByText('Edit Companion')).toBeTruthy();
  });

  it('calls updateCompanion (not createCompanion) when saving in edit mode', async () => {
    serviceMock.getCompanion.mockResolvedValue(existingCompanion);
    serviceMock.updateCompanion.mockResolvedValue({ id: 'c1' });

    const onSave = vi.fn();
    render(
      <CompanionEditor
        companionId="c1"
        onSave={onSave}
        onCancel={vi.fn()}
      />,
    );

    await waitFor(() => {
      expect(
        (screen.getByLabelText('Name') as HTMLInputElement).value,
      ).toBe('Existing Bot');
    });

    fireEvent.change(screen.getByLabelText('Name'), {
      target: { value: 'Renamed Bot' },
    });
    fireEvent.click(screen.getByText('Save'));

    await waitFor(() => {
      expect(serviceMock.updateCompanion).toHaveBeenCalledWith(
        'c1',
        expect.objectContaining({ name: 'Renamed Bot' }),
      );
    });
    expect(serviceMock.createCompanion).not.toHaveBeenCalled();
    expect(onSave).toHaveBeenCalledTimes(1);
  });

  it('shows a Delete button in edit mode that opens a confirmation dialog', async () => {
    serviceMock.getCompanion.mockResolvedValue(existingCompanion);

    render(
      <CompanionEditor
        companionId="c1"
        onSave={vi.fn()}
        onCancel={vi.fn()}
      />,
    );

    await waitFor(() => {
      expect(
        (screen.getByLabelText('Name') as HTMLInputElement).value,
      ).toBe('Existing Bot');
    });

    // The footer Delete button is the first "Delete" match before the dialog renders
    const deleteButtons = screen.getAllByRole('button', { name: 'Delete' });
    fireEvent.click(deleteButtons[0]);

    // Confirmation dialog appears
    expect(screen.getByText('Delete this companion?')).toBeTruthy();
    expect(serviceMock.deleteCompanion).not.toHaveBeenCalled();
  });

  it('confirming the delete dialog calls deleteCompanion and closes the editor', async () => {
    serviceMock.getCompanion.mockResolvedValue(existingCompanion);
    serviceMock.deleteCompanion.mockResolvedValue(undefined);

    const onSave = vi.fn();
    render(
      <CompanionEditor
        companionId="c1"
        onSave={onSave}
        onCancel={vi.fn()}
      />,
    );

    await waitFor(() => {
      expect(
        (screen.getByLabelText('Name') as HTMLInputElement).value,
      ).toBe('Existing Bot');
    });

    // Open the delete confirmation
    const footerDeleteButtons = screen.getAllByRole('button', {
      name: 'Delete',
    });
    fireEvent.click(footerDeleteButtons[0]);

    // Now two Delete buttons exist — the dialog one is the second
    const allDeleteButtons = screen.getAllByRole('button', {
      name: 'Delete',
    });
    fireEvent.click(allDeleteButtons[allDeleteButtons.length - 1]);

    await waitFor(() => {
      expect(serviceMock.deleteCompanion).toHaveBeenCalledWith('c1');
      expect(onSave).toHaveBeenCalledTimes(1);
    });
  });
});