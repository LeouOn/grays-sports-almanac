import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { AthenaQuizReaction } from './AthenaQuizReaction';
import athenaStatic from '../data/athena-static.json';

const reactions = athenaStatic.quizReactions as Record<string, string>;

describe('AthenaQuizReaction', () => {
  it('renders the reaction for a known tier/performance/category combo', () => {
    const reaction = reactions['1:high:history'];
    render(<AthenaQuizReaction tier={1} performance="high" category="history" />);
    // Verify a fragment of the actual reaction text appears
    expect(screen.getByText(new RegExp(reaction.slice(0, 20)))).toBeTruthy();
    expect(screen.getByText(/Athena/)).toBeTruthy();
  });

  it('falls back to generic category when specific category has no match', () => {
    const generic = reactions['1:low:generic'];
    render(<AthenaQuizReaction tier={1} performance="low" category="nonexistent-xyz" />);
    expect(screen.getByText(new RegExp(generic.slice(0, 20)))).toBeTruthy();
  });

  it('renders nothing when no matching reaction exists and no generic fallback', () => {
    const { container } = render(
      <AthenaQuizReaction tier={9} performance="impossible" category="nothing" />,
    );
    expect(container.firstChild).toBeNull();
  });

  it('renders different reactions for different tiers', () => {
    const { unmount } = render(<AthenaQuizReaction tier={1} performance="low" category="sports" />);
    const tier1Reaction = reactions['1:low:sports'];
    expect(screen.getByText(new RegExp(tier1Reaction.slice(0, 15)))).toBeTruthy();
    unmount();

    const tier3Reaction = reactions['3:low:sports'];
    render(<AthenaQuizReaction tier={3} performance="low" category="sports" />);
    expect(screen.getByText(new RegExp(tier3Reaction.slice(0, 15)))).toBeTruthy();
  });
});
