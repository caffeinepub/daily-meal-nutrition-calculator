import { useState, useEffect, useMemo } from 'react';
import { computeDailyTotals } from '@/utils/aggregations';
import { loadDayState, saveDayState } from '@/state/storage';
import type { Meal, Nutrients } from '@/domain/models';

/**
 * Hook for managing all meals for the current day with localStorage persistence.
 * Provides actions to add/remove meals and computed daily totals.
 * Compatible with FoodItem baseline serving fields for backward compatibility.
 */

export interface DayMealsState {
  meals: Meal[];
  dailyTotals: Nutrients;
  addMeal: (meal: Meal) => void;
  removeMeal: (mealId: string) => void;
  clearDay: () => void;
}

export function useDayMeals(): DayMealsState {
  const today = new Date().toISOString().split('T')[0];
  const [meals, setMeals] = useState<Meal[]>(() => {
    const dayState = loadDayState();
    return dayState?.meals || [];
  });

  // Persist to localStorage whenever meals change
  useEffect(() => {
    saveDayState({ meals, date: today });
  }, [meals, today]);

  // Compute daily totals whenever meals change
  const dailyTotals = useMemo(() => computeDailyTotals(meals), [meals]);

  const addMeal = (meal: Meal) => {
    setMeals(prev => [...prev, meal]);
  };

  const removeMeal = (mealId: string) => {
    setMeals(prev => prev.filter(meal => meal.id !== mealId));
  };

  const clearDay = () => {
    setMeals([]);
  };

  return {
    meals,
    dailyTotals,
    addMeal,
    removeMeal,
    clearDay,
  };
}
