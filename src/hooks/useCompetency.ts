import { useState, useEffect } from 'react';

export type CompetencyStats = {
  score: number;
  questionsAnswered: number;
  correctAnswers: number;
};

export type CompetencyProfile = Record<string, CompetencyStats>;

export function useCompetency() {
  const [profile, setProfile] = useState<CompetencyProfile>(() => {
    try {
      const stored = localStorage.getItem('tt-competency');
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error('Failed to load competency profile from local storage', e);
    }
    return {};
  });

  useEffect(() => {
    if (Object.keys(profile).length > 0) {
      localStorage.setItem('tt-competency', JSON.stringify(profile));
    } else {
      localStorage.removeItem('tt-competency');
    }
  }, [profile]);

  const updateCompetency = (topic: string, isCorrect: boolean, delta: number) => {
    setProfile(prev => {
      // Create a lowercase key to avoid duplicate topics
      const key = topic.toLowerCase();
      const existing = prev[key] || { score: 0, questionsAnswered: 0, correctAnswers: 0 };
      
      // Score ranges from 0 to 100
      const newScore = Math.max(0, Math.min(100, existing.score + delta));
      
      return {
        ...prev,
        [key]: {
          score: newScore,
          questionsAnswered: existing.questionsAnswered + 1,
          correctAnswers: existing.correctAnswers + (isCorrect ? 1 : 0),
        }
      };
    });
  };

  const resetCompetency = () => {
    setProfile({});
  };

  return {
    profile,
    updateCompetency,
    resetCompetency
  };
}
