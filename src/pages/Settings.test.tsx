import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { Settings } from './Settings';

// Mock the provider settings hook
const mockSaveProvider = vi.fn();
const mockDeleteProvider = vi.fn();
const mockProviders: { providerName: string; apiKey: string; model: string; baseUrl: string }[] = [];

vi.mock('@/hooks/useProviderSettings', () => ({
  useProviderSettings: () => ({
    providers: mockProviders,
    saveProvider: mockSaveProvider,
    deleteProvider: mockDeleteProvider,
    getProvider: (name: string) => mockProviders.find((p) => p.providerName === name),
    activeProviderName: 'minimax',
    loading: false,
  }),
}));

// Mock the toast module
vi.mock('@/lib/toast', () => ({
  showError: vi.fn(),
  showSuccess: vi.fn(),
  showInfo: vi.fn(),
}));

const renderSettings = () =>
  render(
    <MemoryRouter>
      <Settings />
    </MemoryRouter>
  );

describe('Settings page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockProviders.length = 0;
    // window.confirm is undefined in happy-dom; stub it instead of spying
    vi.stubGlobal('confirm', vi.fn().mockReturnValue(true));
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('renders the page heading and description', () => {
    renderSettings();
    expect(screen.getByRole('heading', { name: /llm settings/i })).toBeTruthy();
    expect(screen.getByText(/configure your llm provider api keys/i)).toBeTruthy();
  });

  it('renders all 8 providers as cards', () => {
    renderSettings();
    const expectedProviders = [
      'Gemini', 'Claude', 'DeepSeek', 'GLM (Zhipu)',
      'MiniMax', 'OpenAI', 'OpenRouter', 'Ollama',
    ];
    for (const name of expectedProviders) {
      expect(screen.getByText(name)).toBeTruthy();
    }
  });

  it('shows "not set" for unconfigured providers', () => {
    renderSettings();
    expect(screen.getAllByText(/not set/).length).toBeGreaterThan(0);
  });

  it('shows "Configured" badge for providers with a saved config', () => {
    mockProviders.push({
      providerName: 'gemini',
      apiKey: 'AIza-test-key',
      model: 'gemini-2.0-flash',
      baseUrl: 'https://generativelanguage.googleapis.com/v1beta',
    });
    renderSettings();
    const configuredBadges = screen.getAllByText('Configured');
    expect(configuredBadges.length).toBe(1);
  });

  it('masks the API key by default, showing only first 8 and last 4 chars', () => {
    // slice(0,8) of this 22-char key returns 'sk-proj-' and slice(-4) returns
    // 'xyz0'. The rendered masked string is therefore 'sk-proj-…xyz0'.
    mockProviders.push({
      providerName: 'openai',
      apiKey: 'sk-proj-abc12345xyz0',
      model: 'gpt-4o',
      baseUrl: 'https://api.openai.com/v1',
    });
    const { container } = renderSettings();
    const text = container.textContent ?? '';
    // Masked prefix (first 8 chars) is present.
    expect(text).toContain('sk-proj-');
    // Masked suffix (last 4 chars) is present.
    expect(text).toContain('xyz0');
    // Raw middle of the key must NOT appear anywhere — that proves it's
    // been masked, not rendered in full.
    expect(text).not.toContain('bc12345');
  });

  it('clicking "Configure" opens the edit form for that provider', () => {
    renderSettings();
    const configureBtns = screen.getAllByRole('button', { name: /configure/i });
    fireEvent.click(configureBtns[0]); // Gemini

    // Edit form should appear: input fields for apiKey, model, baseUrl
    const inputs = screen.getAllByRole('textbox');
    expect(inputs.length).toBeGreaterThan(0);
  });

  it('"Save" button calls saveProvider with the edited values', async () => {
    renderSettings();
    const configureBtns = screen.getAllByRole('button', { name: /configure/i });
    fireEvent.click(configureBtns[0]); // Gemini

    // Fill in the form
    const apiKeyInput = screen.getAllByPlaceholderText(/sk-/i)[0] || screen.getAllByRole('textbox')[0];
    fireEvent.change(apiKeyInput, { target: { value: 'AIza-test' } });

    // Click Save
    const saveBtn = screen.getByRole('button', { name: /^save$/i });
    fireEvent.click(saveBtn);

    await waitFor(() => {
      expect(mockSaveProvider).toHaveBeenCalled();
    });
  });

  it('"Cancel" exits edit mode without saving', () => {
    renderSettings();
    fireEvent.click(screen.getAllByRole('button', { name: /configure/i })[0]);
    expect(screen.getByRole('button', { name: /^cancel$/i })).toBeTruthy();

    fireEvent.click(screen.getByRole('button', { name: /^cancel$/i }));

    // After cancel, configure button is back
    expect(screen.getAllByRole('button', { name: /configure/i }).length).toBeGreaterThan(0);
  });

  it('"Delete" button calls deleteProvider after confirm', async () => {
    mockProviders.push({
      providerName: 'deepseek',
      apiKey: 'sk-test',
      model: 'deepseek-v4-flash',
      baseUrl: 'https://api.deepseek.com',
    });
    renderSettings();

    // The delete button is a Ghost variant with a Trash2 icon — find the
    // button that contains the trash icon (the only "ghost" button in view).
    const allButtons = screen.getAllByRole('button');
    const deleteBtn = allButtons.find((b) => b.className.includes('text-red-400'));
    expect(deleteBtn).toBeTruthy();
    fireEvent.click(deleteBtn!);

    await waitFor(() => {
      expect(mockDeleteProvider).toHaveBeenCalledWith('deepseek');
    });
  });

  it('"Test connection" button shows loading then result', async () => {
    mockProviders.push({
      providerName: 'openai',
      apiKey: 'sk-test',
      model: 'gpt-4o',
      baseUrl: 'https://api.openai.com/v1',
    });
    // Mock successful fetch
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(
      new Response(JSON.stringify({ data: [] }), { status: 200 }),
    );

    renderSettings();
    const testBtn = screen.getByRole('button', { name: /test connection/i });
    fireEvent.click(testBtn);

    // Should show success state
    await waitFor(() => {
      expect(screen.getByText(/connected/i)).toBeTruthy();
    });
  });

  it('"Test connection" shows error on HTTP failure', async () => {
    mockProviders.push({
      providerName: 'openai',
      apiKey: 'sk-bad',
      model: 'gpt-4o',
      baseUrl: 'https://api.openai.com/v1',
    });
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(
      new Response('Unauthorized', { status: 401 }),
    );

    renderSettings();
    fireEvent.click(screen.getByRole('button', { name: /test connection/i }));

    await waitFor(() => {
      expect(screen.getByText(/http 401/i)).toBeTruthy();
    });
  });

  it('renders a "Get key" link to the provider docs for each provider', () => {
    renderSettings();
    const getKeyLinks = screen.getAllByText(/get key/i);
    expect(getKeyLinks.length).toBe(8);
  });

  it('shows the default model and base URL when editing a new provider', () => {
    renderSettings();
    fireEvent.click(screen.getAllByRole('button', { name: /configure/i })[0]); // Gemini

    const modelInput = screen.getAllByDisplayValue(/gemini-2.0-flash/)[0];
    expect(modelInput).toBeTruthy();
  });
});
