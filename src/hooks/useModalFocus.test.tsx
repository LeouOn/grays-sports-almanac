import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { useState } from 'react';
import { useModalFocus } from './useModalFocus';

// Test harness: a button that opens a modal whose container uses the hook.
function Harness() {
  const [isOpen, setIsOpen] = useState(false);
  const modalRef = useModalFocus<HTMLDivElement>(isOpen);
  return (
    <div>
      <button onClick={() => setIsOpen(true)}>open</button>
      {isOpen && (
        <div ref={modalRef} role="dialog" aria-modal="true">
          <button>first</button>
          <a href="#x">middle</a>
          <input type="text" />
          <button onClick={() => setIsOpen(false)}>close</button>
        </div>
      )}
    </div>
  );
}

function focusAllFirst() {
  return Array.from(
    document.querySelectorAll<HTMLElement>('button, [href], input'),
  );
}

describe('useModalFocus', () => {
  beforeEach(() => {
    cleanup();
    // Reset focus to body between tests.
    (document.body as HTMLElement).focus?.();
  });

  it('moves focus into the modal when it opens', () => {
    render(<Harness />);
    const trigger = screen.getByText('open');
    trigger.focus();
    expect(document.activeElement).toBe(trigger);

    fireEvent.click(trigger);

    const first = screen.getByText('first');
    expect(document.activeElement).toBe(first);
  });

  it('restores focus to the trigger when the modal closes', () => {
    render(<Harness />);
    const trigger = screen.getByText('open');
    trigger.focus();
    fireEvent.click(trigger);
    expect(document.activeElement).not.toBe(trigger);

    fireEvent.click(screen.getByText('close'));

    expect(document.activeElement).toBe(trigger);
  });

  it('traps Tab so focus cycles back to the first element from the last', () => {
    render(<Harness />);
    const trigger = screen.getByText('open');
    trigger.focus();
    fireEvent.click(trigger);

    const [, , , lastBtn] = focusAllFirst().filter(
      el => el.textContent !== 'open',
    );
    // Focus the last button inside the modal explicitly.
    lastBtn.focus();
    expect(document.activeElement).toBe(lastBtn);

    fireEvent.keyDown(lastBtn, { key: 'Tab' });

    const first = screen.getByText('first');
    expect(document.activeElement).toBe(first);
  });

  it('traps Shift+Tab so focus cycles back to the last element from the first', () => {
    render(<Harness />);
    const trigger = screen.getByText('open');
    trigger.focus();
    fireEvent.click(trigger);

    const first = screen.getByText('first');
    expect(document.activeElement).toBe(first);

    fireEvent.keyDown(first, { key: 'Tab', shiftKey: true });

    const closeBtn = screen.getByText('close');
    expect(document.activeElement).toBe(closeBtn);
  });

  it('does nothing when the modal is closed (no crash, no DOM change)', () => {
    const { container } = render(<Harness />);
    // Modal is closed; pressing Tab should not throw.
    expect(container.querySelector('[role="dialog"]')).toBeNull();
    fireEvent.keyDown(document.body, { key: 'Tab' });
    expect(container.querySelector('[role="dialog"]')).toBeNull();
  });
});
