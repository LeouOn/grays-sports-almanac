import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor, cleanup } from '@testing-library/react';
import { MemoryRouter } from 'react-router';

// Hoisted mocks: vi.mock factories run before top-level statements, so any
// shared state (mock fns, stubs) must be created via vi.hoisted.
const { serviceMock, ioMock, editorStub, contextMock } = vi.hoisted(() => {
  const serviceMock = {
    listCompanions: vi.fn(),
    searchCompanions: vi.fn(),
    deleteCompanion: vi.fn(),
    createCompanion: vi.fn(),
    getCompanion: vi.fn(),
    updateCompanion: vi.fn(),
  };
  const ioMock = {
    exportCompanions: vi.fn(),
    importCompanions: vi.fn(),
    downloadJSON: vi.fn(),
  };
  // Stub for the editor modal — captures the props it was rendered with so we
  // can verify the gallery passes companionId correctly when editing.
  const editorStub = vi.fn(({ companionId, onSave, onCancel }: {
    companionId?: string;
    onSave: () => void;
    onCancel: () => void;
  }) => (
    <div data-testid="companion-editor-stub">
      <span data-testid="stub-companion-id">{companionId ?? ''}</span>
      <button onClick={onSave}>StubSave</button>
      <button onClick={onCancel}>StubCancel</button>
    </div>
  ));
  // Stable context object so tests can assert on selectCustomCompanion calls
  const contextMock = {
    selectCustomCompanion: vi.fn(),
    selectCompanion: vi.fn(),
    activeCompanion: {
      id: 'athena',
      name: 'Athena',
      avatar: '🦉',
      description: 'Default companion',
      prompt: 'default prompt',
    },
  };
  return { serviceMock, ioMock, editorStub, contextMock };
});

vi.mock('@/services/companionService', () => serviceMock);
vi.mock('@/services/companionIO', () => ioMock);
vi.mock('@/components/CompanionEditor', () => ({ CompanionEditor: editorStub }));
vi.mock('@/context/CompanionContext', () => ({
  useCompanion: () => contextMock,
}));

import { CompanionGallery } from '@/pages/CompanionGallery';

function renderGallery() {
  return render(
    <MemoryRouter>
      <CompanionGallery />
    </MemoryRouter>,
  );
}

const sampleCompanions = [
  {
    id: 'c1',
    name: 'Doc Brown',
    prompt: 'Scientist from 1985',
    avatar: '👨‍🔬',
    styleTags: ['scientist', 'eccentric'],
    createdAt: 1_700_000_000_000,
    updatedAt: 1_700_000_000_000,
  },
  {
    id: 'c2',
    name: 'Marty McFly',
    prompt: 'Cool teenager from the 80s',
    avatar: '🎸',
    styleTags: ['80s', 'cool'],
    createdAt: 1_700_000_500_000,
    updatedAt: 1_700_000_500_000,
  },
];

describe('CompanionGallery', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    serviceMock.listCompanions.mockResolvedValue([]);
    serviceMock.searchCompanions.mockResolvedValue([]);
  });

  afterEach(() => {
    cleanup();
  });

  it('renders heading and empty state when no companions exist', async () => {
    renderGallery();
    expect(await screen.findByText('Companions')).toBeTruthy();
    expect(
      screen.getByText(/Create your first custom companion/i),
    ).toBeTruthy();
    // Both the mount effect and the search-effect (searchQuery='' triggers load())
    // invoke listCompanions — we just verify it was called, not the exact count.
    expect(serviceMock.listCompanions).toHaveBeenCalled();
  });

  it('renders companion cards when listCompanions returns data', async () => {
    serviceMock.listCompanions.mockResolvedValue(sampleCompanions);
    renderGallery();

    expect(await screen.findByText('Doc Brown')).toBeTruthy();
    expect(screen.getByText('Marty McFly')).toBeTruthy();
    // Style tags should render as badges
    expect(screen.getByText('scientist')).toBeTruthy();
    expect(screen.getByText('eccentric')).toBeTruthy();
    expect(screen.getByText('80s')).toBeTruthy();
  });

  it('filters via searchCompanions when the search input has a value', async () => {
    serviceMock.listCompanions.mockResolvedValue(sampleCompanions);
    serviceMock.searchCompanions.mockResolvedValue([sampleCompanions[0]]);

    renderGallery();
    await screen.findByText('Doc Brown');

    const input = screen.getByLabelText('Search companions') as HTMLInputElement;
    fireEvent.change(input, { target: { value: 'Doc' } });

    // Debounced — searchCompanions should be called after the 300ms timer
    await waitFor(
      () => {
        expect(serviceMock.searchCompanions).toHaveBeenCalledWith('Doc');
      },
      { timeout: 2000 },
    );
  });

  it('clicking the New Companion button opens the editor modal', async () => {
    renderGallery();
    await screen.findByText('Companions');

    // Both the header and the empty-state render "New Companion" buttons — click the first
    const newButtons = screen.getAllByText('New Companion');
    fireEvent.click(newButtons[0]);

    expect(await screen.findByTestId('companion-editor-stub')).toBeTruthy();
    // No companionId passed in create mode
    expect(screen.getByTestId('stub-companion-id').textContent).toBe('');
  });

  it('clicking Edit on a companion opens the editor with companionId set', async () => {
    serviceMock.listCompanions.mockResolvedValue(sampleCompanions);
    renderGallery();
    await screen.findByText('Doc Brown');

    fireEvent.click(screen.getByLabelText('Edit Doc Brown'));

    await waitFor(() => {
      expect(screen.getByTestId('companion-editor-stub')).toBeTruthy();
    });
    expect(screen.getByTestId('stub-companion-id').textContent).toBe('c1');
  });

  it('clicking Set Active calls selectCustomCompanion with that companion', async () => {
    serviceMock.listCompanions.mockResolvedValue(sampleCompanions);
    renderGallery();
    await screen.findByText('Doc Brown');

    // Each card renders its own "Set Active" button — click the first (Doc Brown)
    fireEvent.click(screen.getAllByText('Set Active')[0]);

    expect(contextMock.selectCustomCompanion).toHaveBeenCalledWith(
      expect.objectContaining({ id: 'c1', name: 'Doc Brown' }),
    );
  });

  it('delete button shows confirmation dialog, then calls deleteCompanion when confirmed', async () => {
    serviceMock.listCompanions.mockResolvedValue(sampleCompanions);
    serviceMock.deleteCompanion.mockResolvedValue(undefined);

    renderGallery();
    await screen.findByText('Doc Brown');

    fireEvent.click(screen.getByLabelText('Delete Doc Brown'));

    // Confirmation dialog appears with the companion name in the title
    expect(screen.getByText(/Delete "Doc Brown"\?/)).toBeTruthy();
    expect(serviceMock.deleteCompanion).not.toHaveBeenCalled();

    // Confirm — the dialog's "Delete" button (text-only, distinct from icon buttons)
    fireEvent.click(screen.getByRole('button', { name: 'Delete' }));

    await waitFor(() => {
      expect(serviceMock.deleteCompanion).toHaveBeenCalledWith('c1');
    });
  });

  it('Cancel on the delete confirmation does NOT call deleteCompanion', async () => {
    serviceMock.listCompanions.mockResolvedValue(sampleCompanions);

    renderGallery();
    await screen.findByText('Doc Brown');

    fireEvent.click(screen.getByLabelText('Delete Doc Brown'));
    expect(screen.getByText(/Delete "Doc Brown"\?/)).toBeTruthy();

    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));

    expect(serviceMock.deleteCompanion).not.toHaveBeenCalled();
    // Dialog is dismissed
    expect(screen.queryByText(/Delete "Doc Brown"\?/)).toBeNull();
  });

  it('Export All triggers exportCompanions and downloadJSON with a date-stamped filename', async () => {
    const json = '{"version":1,"exportedAt":1,"companions":[]}';
    serviceMock.listCompanions.mockResolvedValue(sampleCompanions);
    ioMock.exportCompanions.mockResolvedValue(json);

    renderGallery();
    await screen.findByText('Doc Brown');

    fireEvent.click(screen.getByText('Export All'));

    await waitFor(() => {
      expect(ioMock.exportCompanions).toHaveBeenCalledTimes(1);
      expect(ioMock.downloadJSON).toHaveBeenCalledTimes(1);
    });
    // Filename pattern: companions-YYYY-MM-DD.json
    const filename = ioMock.downloadJSON.mock.calls[0][1] as string;
    expect(filename).toMatch(/^companions-\d{4}-\d{2}-\d{2}\.json$/);
    expect(ioMock.downloadJSON.mock.calls[0][0]).toBe(json);
  });

  it('clicking Import triggers the hidden file input click', async () => {
    serviceMock.listCompanions.mockResolvedValue([]);
    renderGallery();
    await screen.findByText('Companions');

    const fileInput = screen.getByLabelText(
      'Import companions JSON file',
    ) as HTMLInputElement;
    const clickSpy = vi
      .spyOn(fileInput, 'click')
      .mockImplementation(() => {});

    fireEvent.click(screen.getByText('Import'));

    expect(clickSpy).toHaveBeenCalledTimes(1);
  });
});