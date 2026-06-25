import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { Quiz } from './Quiz';
import type { ReactNode } from 'react';

// ── Mocks ───────────────────────────────────────────────────────────────

const mockSendMessage = vi.fn();
const mockSetMessages = vi.fn();

vi.mock('@ai-sdk/react', () => ({
  useChat: () => ({
    messages: [] as Array<{
      id: string;
      role: string;
      parts: Array<{ type: string; text: string }>;
    }>,
    sendMessage: mockSendMessage,
    status: 'ready' as const,
    setMessages: mockSetMessages,
  }),
}));

const mockSelectCompanion = vi.fn();
const mockCompanion = {
  id: 'athena',
  name: 'Athena',
  avatar: '🦉',
  description: 'Test companion',
  prompt: 'Test prompt',
};

vi.mock('@/context/CompanionContext', () => ({
  useCompanion: () => ({
    activeCompanion: mockCompanion,
    selectCompanion: mockSelectCompanion,
    customName: 'Time Cop',
    setCustomName: vi.fn(),
    customPrompt: '',
    setCustomPrompt: vi.fn(),
    companionProvider: 'zhipu',
    setCompanionProvider: vi.fn(),
    userName: 'Yune',
    setUserName: vi.fn(),
  }),
  CompanionProvider: ({ children }: { children: ReactNode }) => <>{children}</>,
}));

vi.mock('@/hooks/useCompetency', () => ({
  useCompetency: () => ({
    profile: {},
    updateCompetency: vi.fn(),
    resetCompetency: vi.fn(),
  }),
}));

vi.mock('react-router', () => ({
  useSearchParams: () => [new URLSearchParams()],
}));

// Mock fetch for model loading endpoint
const mockFetch = vi.fn().mockResolvedValue({
  json: () => Promise.resolve({ models: ['GLM-4', 'glm-4-flash'] }),
});
vi.stubGlobal('fetch', mockFetch);

// Mock crypto.randomUUID
vi.stubGlobal('crypto', {
  randomUUID: () => 'test-uuid-1234',
});

// ── Helpers ─────────────────────────────────────────────────────────────

function renderQuiz() {
  return render(<Quiz />);
}

// ── Tests ───────────────────────────────────────────────────────────────

describe('Quiz Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders quiz page with tier selectors, era selectors, category selectors, and chat area', () => {
    renderQuiz();

    // Tier selectors
    expect(screen.getByText('Tier 1: Recall')).toBeInTheDocument();
    expect(screen.getByText('Tier 2: Judgment')).toBeInTheDocument();
    expect(screen.getByText('Tier 3: Roleplay')).toBeInTheDocument();

    // Era selectors
    expect(screen.getByText('1950s')).toBeInTheDocument();
    expect(screen.getByText('1960s')).toBeInTheDocument();
    expect(screen.getByText('global')).toBeInTheDocument();

    // Category (domain) selectors
    expect(screen.getByText('culture')).toBeInTheDocument();
    expect(screen.getByText('science')).toBeInTheDocument();
    expect(screen.getByText('economics')).toBeInTheDocument();
    expect(screen.getByText('events')).toBeInTheDocument();
    expect(screen.getByText('engineering')).toBeInTheDocument();

    // Chat area elements
    expect(screen.getByText('Start your training session')).toBeInTheDocument();
    expect(screen.getByText('Initialize AI Examiner')).toBeInTheDocument();

    // Input and send button
    expect(screen.getByPlaceholderText(/Type your message/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Send' })).toBeInTheDocument();
  });

  it('allows user to select different tiers and updates the description', () => {
    renderQuiz();

    // Initially Tier 1 is selected
    expect(screen.getByText('🧠 Tier 1: Factual Recall')).toBeInTheDocument();

    // Click Tier 2
    fireEvent.click(screen.getByText('Tier 2: Judgment'));
    expect(screen.getByText('⚖️ Tier 2: Situational Judgment')).toBeInTheDocument();
    expect(screen.getByText('Choose actions in historic scenarios. Balance timeline preservation against butterflies.')).toBeInTheDocument();

    // Click Tier 3
    fireEvent.click(screen.getByText('Tier 3: Roleplay'));
    expect(screen.getByText('🎭 Tier 3: Immersive Roleplay')).toBeInTheDocument();
    expect(screen.getByText('Converse in character with post-era residents. Avoid using future terms or modern slang.')).toBeInTheDocument();

    // Tier change should clear messages via setMessages
    expect(mockSetMessages).toHaveBeenCalledWith([]);
  });

  it('allows typing a message and submitting via the form', () => {
    renderQuiz();

    const input = screen.getByPlaceholderText(/Type your message/i);
    const sendButton = screen.getByRole('button', { name: 'Send' });

    // Send button should be disabled when input is empty
    expect(sendButton).toBeDisabled();

    // Type a message via fireEvent.change
    fireEvent.change(input, { target: { value: 'What was the price of milk in 1950?' } });
    expect(input).toHaveValue('What was the price of milk in 1950?');

    // Submit the form
    fireEvent.submit(input.closest('form')!);

    // sendMessage should have been called with the typed text
    expect(mockSendMessage).toHaveBeenCalledTimes(1);
    const [messageArg, optionsArg] = mockSendMessage.mock.calls[0];
    expect(messageArg.text).toBe('What was the price of milk in 1950?');
    expect(optionsArg.body).toHaveProperty('tier', 'tier1');
    expect(optionsArg.body).toHaveProperty('provider', 'zhipu');
    expect(optionsArg.body).toHaveProperty('eras');
    expect(optionsArg.body).toHaveProperty('categories');
  });

  it('renders provider selector buttons', () => {
    renderQuiz();

    // Provider buttons with emoji icons — verified via title attributes
    expect(screen.getByTitle(/Gemini/)).toBeInTheDocument();
    expect(screen.getByTitle(/DeepSeek/)).toBeInTheDocument();
    expect(screen.getByTitle(/Zhipu/)).toBeInTheDocument();
    expect(screen.getByTitle(/MiniMax/)).toBeInTheDocument();
    expect(screen.getByTitle(/OpenRouter/)).toBeInTheDocument();
  });

  it('calls sendMessage when Initialize AI Examiner button is clicked', () => {
    renderQuiz();

    fireEvent.click(screen.getByText('Initialize AI Examiner'));

    expect(mockSendMessage).toHaveBeenCalledTimes(1);
    const [messageArg] = mockSendMessage.mock.calls[0];
    expect(messageArg.text).toBe('start');
  });

  it('toggles era selection on click without errors', () => {
    renderQuiz();

    // "1950s" should be selected by default (all selected)
    const era1950s = screen.getByText('1950s');
    // Click to deselect — verifies no crash on toggle
    fireEvent.click(era1950s);
    expect(era1950s).toBeInTheDocument();
  });
});
