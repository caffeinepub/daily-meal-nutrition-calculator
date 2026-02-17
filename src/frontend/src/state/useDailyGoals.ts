import { useState, useEffect } from 'react';
import { loadDailyGoals, saveDailyGoals } from './storage';

/**
 * React hook for managing editable daily nutrition goals.
 * Provides effective goals (defaults + user overrides) and update actions.
 */

export interface DailyGoals {
  calories?: number;
  protein?: number;
}

export interface EffectiveGoals {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
}

const DEFAULT_GOALS: EffectiveGoals = {
  calories: 2000,
  protein: 50,
  carbs: 275,
  fat: 78,
  fiber: 28,
};

export function useDailyGoals() {
  const [customGoals, setCustomGoals] = useState<DailyGoals>({});
  const [isLoading, setIsLoading] = useState(true);

  // Load saved goals on mount
  useEffect(() => {
    const saved = loadDailyGoals();
    if (saved) {
      setCustomGoals(saved);
    }
    setIsLoading(false);
  }, []);

  // Compute effective goals (defaults + overrides)
  const effectiveGoals: EffectiveGoals = {
    ...DEFAULT_GOALS,
    ...(customGoals.calories !== undefined && { calories: customGoals.calories }),
    ...(customGoals.protein !== undefined && { protein: customGoals.protein }),
  };

  // Update goals and persist
  const updateGoals = (goals: DailyGoals) => {
    const newGoals = { ...customGoals, ...goals };
    setCustomGoals(newGoals);
    saveDailyGoals(newGoals);
  };

  return {
    effectiveGoals,
    customGoals,
    updateGoals,
    isLoading,
  };
}
