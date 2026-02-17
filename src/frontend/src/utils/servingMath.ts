import type { Nutrients, FoodItem } from '@/domain/models';

/**
 * Utility module for serving size conversions and nutrient scaling.
 * Centralizes logic for computing multipliers from user-entered amounts/units
 * vs baseline serving metadata.
 */

export interface ServingConversionResult {
  multiplier: number;
  isDirectConversion: boolean;
  fallbackNote?: string;
}

/**
 * Compute a safe multiplier from a FoodItem's user amount/unit vs baseline serving metadata.
 * Returns a multiplier and metadata about the conversion.
 */
export function computeServingMultiplier(food: FoodItem): ServingConversionResult {
  const { quantity, unit, baselineServingAmount, baselineServingUnit } = food;

  // If no baseline metadata, treat quantity as direct multiplier
  if (!baselineServingAmount || !baselineServingUnit) {
    return {
      multiplier: quantity,
      isDirectConversion: false,
      fallbackNote: 'Using quantity as serving multiplier',
    };
  }

  // If units match, compute direct ratio
  if (unit === baselineServingUnit) {
    const multiplier = quantity / baselineServingAmount;
    return {
      multiplier: isFinite(multiplier) && multiplier > 0 ? multiplier : 1,
      isDirectConversion: true,
    };
  }

  // Handle grams conversions (common case)
  if (unit === 'grams' && baselineServingUnit === 'grams') {
    const multiplier = quantity / baselineServingAmount;
    return {
      multiplier: isFinite(multiplier) && multiplier > 0 ? multiplier : 1,
      isDirectConversion: true,
    };
  }

  // Units don't match and can't be safely converted
  // Fall back to treating quantity as serving multiplier
  return {
    multiplier: quantity,
    isDirectConversion: false,
    fallbackNote: `Cannot convert ${unit} to ${baselineServingUnit}. Using quantity as serving multiplier.`,
  };
}

/**
 * Scale a Nutrients object by a multiplier.
 * Returns a new Nutrients object with all values scaled.
 */
export function scaleNutrients(nutrients: Nutrients, multiplier: number): Nutrients {
  const scaled: Nutrients = {
    calories: nutrients.calories * multiplier,
    protein: nutrients.protein * multiplier,
    carbs: nutrients.carbs * multiplier,
    fat: nutrients.fat * multiplier,
    fiber: nutrients.fiber * multiplier,
    sugar: nutrients.sugar * multiplier,
  };

  // Scale vitamins/minerals if present
  if (nutrients.vitamins) {
    scaled.vitamins = {};
    for (const [name, value] of Object.entries(nutrients.vitamins)) {
      scaled.vitamins[name] = value * multiplier;
    }
  }

  return scaled;
}

/**
 * Get scaled nutrients for a food item based on user-entered amount/unit.
 * This is the main function to use when displaying nutrition for a food.
 */
export function getScaledNutrients(food: FoodItem): Nutrients {
  const { multiplier } = computeServingMultiplier(food);
  return scaleNutrients(food.nutrients, multiplier);
}
