import type { Nutrients, FoodItem, Meal } from '@/domain/models';
import { computeServingMultiplier, scaleNutrients } from './servingMath';

/**
 * Pure helper functions for computing nutrition totals.
 * Used to aggregate nutrients across foods and meals.
 */

/**
 * Compute total nutrients from a list of food items.
 * Accounts for quantity, unit, and baseline serving metadata.
 */
export function computeMealTotals(foods: FoodItem[]): Nutrients {
  const totals: Nutrients = {
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
    fiber: 0,
    sugar: 0,
    vitamins: {},
  };

  for (const food of foods) {
    // Compute multiplier using baseline serving metadata
    const { multiplier } = computeServingMultiplier(food);
    
    // Scale nutrients by multiplier
    const scaledNutrients = scaleNutrients(food.nutrients, multiplier);
    
    totals.calories += scaledNutrients.calories;
    totals.protein += scaledNutrients.protein;
    totals.carbs += scaledNutrients.carbs;
    totals.fat += scaledNutrients.fat;
    totals.fiber += scaledNutrients.fiber;
    totals.sugar += scaledNutrients.sugar;

    // Aggregate vitamins/minerals
    if (scaledNutrients.vitamins) {
      for (const [name, value] of Object.entries(scaledNutrients.vitamins)) {
        totals.vitamins![name] = (totals.vitamins![name] || 0) + value;
      }
    }
  }

  return totals;
}

/**
 * Compute daily totals from all meals.
 */
export function computeDailyTotals(meals: Meal[]): Nutrients {
  const totals: Nutrients = {
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
    fiber: 0,
    sugar: 0,
    vitamins: {},
  };

  for (const meal of meals) {
    totals.calories += meal.totals.calories;
    totals.protein += meal.totals.protein;
    totals.carbs += meal.totals.carbs;
    totals.fat += meal.totals.fat;
    totals.fiber += meal.totals.fiber;
    totals.sugar += meal.totals.sugar;

    // Aggregate vitamins/minerals
    if (meal.totals.vitamins) {
      for (const [name, value] of Object.entries(meal.totals.vitamins)) {
        totals.vitamins![name] = (totals.vitamins![name] || 0) + value;
      }
    }
  }

  return totals;
}
