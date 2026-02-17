import { getApiKey } from '@/state/storage';
import { mapFoodDataToNutrients } from '@/utils/nutrientMapping';
import type { FoodItem } from '@/domain/models';

const USDA_API_BASE = 'https://api.nal.usda.gov/fdc/v1';

/**
 * Nutrition API client for USDA FoodData Central.
 * Handles food search and nutrient data retrieval with actionable error messages.
 * Persists baseline serving metadata for accurate unit conversions.
 */

interface USDASearchResult {
  foods: Array<{
    fdcId: number;
    description: string;
    foodNutrients: Array<{
      nutrientName: string;
      nutrientNumber: string;
      value: number;
      unitName: string;
    }>;
    servingSize?: number;
    servingSizeUnit?: string;
  }>;
}

/**
 * Search for a food item and return normalized nutrition data with baseline serving metadata.
 * @throws Error with actionable message if API key is missing, invalid, or request fails
 */
export async function searchFood(query: string): Promise<FoodItem | null> {
  const apiKey = getApiKey();
  
  if (!apiKey) {
    throw new Error('USDA API key not configured. Please add your API key in Settings (gear icon in header) to enable food search.');
  }

  try {
    const response = await fetch(
      `${USDA_API_BASE}/foods/search?query=${encodeURIComponent(query)}&pageSize=1&api_key=${apiKey}`
    );

    if (!response.ok) {
      if (response.status === 403 || response.status === 401) {
        throw new Error('Invalid USDA API key. Please check your API key in Settings and ensure it is correct.');
      }
      if (response.status === 429) {
        throw new Error('API rate limit exceeded. Please try again in a few moments.');
      }
      throw new Error(`USDA API request failed (${response.status}): ${response.statusText}. Please try again.`);
    }

    const data: USDASearchResult = await response.json();

    if (!data.foods || data.foods.length === 0) {
      throw new Error(`No nutrition data found for "${query}". Try a different search term.`);
    }

    const food = data.foods[0];
    const nutrients = mapFoodDataToNutrients(food.foodNutrients);

    // Determine baseline serving size and unit
    let baselineServingAmount = food.servingSize || 100;
    let baselineServingUnit: FoodItem['unit'] = 'grams';
    
    if (food.servingSizeUnit) {
      const unit = food.servingSizeUnit.toLowerCase();
      if (unit.includes('cup')) baselineServingUnit = 'cups';
      else if (unit.includes('piece') || unit.includes('item')) baselineServingUnit = 'pieces';
    }

    return {
      id: Date.now().toString() + Math.random(),
      name: food.description,
      servingDescription: `${baselineServingAmount}${baselineServingUnit === 'grams' ? 'g' : ' ' + baselineServingUnit}`,
      quantity: 1,
      unit: baselineServingUnit,
      nutrients,
      fdcId: food.fdcId,
      // Store baseline serving metadata for conversions
      baselineServingAmount,
      baselineServingUnit,
    };
  } catch (error) {
    // Preserve actionable error messages, don't swallow them
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Failed to fetch nutrition data from USDA API. Please check your internet connection and try again.');
  }
}
