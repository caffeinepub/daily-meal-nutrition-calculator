import { useState, useMemo } from 'react';
import { computeMealTotals } from '@/utils/aggregations';
import type { FoodItem, Nutrients } from '@/domain/models';

/**
 * Hook for managing the current meal being built.
 * Provides actions to add, update, remove foods and compute meal totals.
 */

export interface CurrentMealState {
  foods: FoodItem[];
  mealTotals: Nutrients;
  addFood: (food: FoodItem) => void;
  updateFood: (foodId: string, updates: Partial<FoodItem>) => void;
  removeFood: (foodId: string) => void;
  clearMeal: () => void;
}

export function useCurrentMeal(): CurrentMealState {
  const [foods, setFoods] = useState<FoodItem[]>([]);

  // Compute meal totals whenever foods change
  const mealTotals = useMemo(() => computeMealTotals(foods), [foods]);

  const addFood = (food: FoodItem) => {
    setFoods(prev => [...prev, food]);
  };

  const updateFood = (foodId: string, updates: Partial<FoodItem>) => {
    setFoods(prev =>
      prev.map(food =>
        food.id === foodId
          ? { ...food, ...updates }
          : food
      )
    );
  };

  const removeFood = (foodId: string) => {
    setFoods(prev => prev.filter(food => food.id !== foodId));
  };

  const clearMeal = () => {
    setFoods([]);
  };

  return {
    foods,
    mealTotals,
    addFood,
    updateFood,
    removeFood,
    clearMeal,
  };
}
