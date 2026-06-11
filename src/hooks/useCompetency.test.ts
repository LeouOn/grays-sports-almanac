import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useCompetency } from './useCompetency';

describe('useCompetency', () => {
  beforeEach(() => {
    // Clear localStorage before each test for idempotency
    localStorage.clear();
  });

  afterEach(() => {
    // Ensure cleanup after tests
    localStorage.clear();
  });

  it('should initialize with an empty profile if localStorage is empty', () => {
    const { result } = renderHook(() => useCompetency());
    expect(result.current.profile).toEqual({});
  });

  it('should load initial profile from localStorage if present', () => {
    const mockData = { tech: { score: 50, questionsAnswered: 2, correctAnswers: 1 } };
    localStorage.setItem('tt-competency', JSON.stringify(mockData));

    const { result } = renderHook(() => useCompetency());
    expect(result.current.profile).toEqual(mockData);
  });

  it('should update competency for a new topic', () => {
    const { result } = renderHook(() => useCompetency());

    act(() => {
      result.current.updateCompetency('sports', true, 20);
    });

    expect(result.current.profile.sports).toEqual({
      score: 20,
      questionsAnswered: 1,
      correctAnswers: 1,
    });
    
    // Check if localStorage was updated
    expect(JSON.parse(localStorage.getItem('tt-competency') || '{}')).toEqual(result.current.profile);
  });

  it('should accurately calculate score bounds (max 100, min 0) and accumulate stats', () => {
    const { result } = renderHook(() => useCompetency());

    act(() => {
      result.current.updateCompetency('science', true, 90);
    });
    
    // Should cap at 100
    act(() => {
      result.current.updateCompetency('science', true, 20);
    });

    expect(result.current.profile.science).toEqual({
      score: 100,
      questionsAnswered: 2,
      correctAnswers: 2,
    });

    // Should cap at 0
    act(() => {
      result.current.updateCompetency('science', false, -150);
    });

    expect(result.current.profile.science).toEqual({
      score: 0,
      questionsAnswered: 3,
      correctAnswers: 2,
    });
  });

  it('should reset competency correctly', () => {
    const { result } = renderHook(() => useCompetency());

    act(() => {
      result.current.updateCompetency('finance', true, 50);
    });

    expect(result.current.profile.finance).toBeDefined();

    act(() => {
      result.current.resetCompetency();
    });

    expect(result.current.profile).toEqual({});
    expect(localStorage.getItem('tt-competency')).toBeNull();
  });
});
