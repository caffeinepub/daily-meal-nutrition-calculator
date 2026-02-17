import type { Nutrients } from '@/domain/models';

/**
 * Maps USDA FoodData Central nutrient data to our normalized Nutrients model.
 * Handles missing nutrients gracefully and extracts vitamins/minerals.
 */

interface USDANutrient {
  nutrientName: string;
  nutrientNumber: string;
  value: number;
  unitName: string;
}

// USDA nutrient number mappings for common macronutrients
const NUTRIENT_MAP: Record<string, string> = {
  '208': 'calories', // Energy (kcal)
  '203': 'protein', // Protein
  '205': 'carbs', // Carbohydrate
  '204': 'fat', // Total lipid (fat)
  '291': 'fiber', // Fiber, total dietary
  '269': 'sugar', // Sugars, total
};

// Vitamin and mineral nutrient numbers
const VITAMIN_MINERAL_NUMBERS = [
  '401', '404', '405', '406', '410', '415', '418', // Vitamins
  '301', '303', '304', '305', '306', '307', '309', // Minerals
];

export function mapFoodDataToNutrients(foodNutrients: USDANutrient[]): Nutrients {
  const nutrients: Nutrients = {
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
    fiber: 0,
    sugar: 0,
    vitamins: {},
  };

  for (const nutrient of foodNutrients) {
    const key = NUTRIENT_MAP[nutrient.nutrientNumber];
    
    if (key) {
      // Map to main macronutrients
      nutrients[key as keyof Omit<Nutrients, 'vitamins'>] = nutrient.value;
    } else if (VITAMIN_MINERAL_NUMBERS.includes(nutrient.nutrientNumber)) {
      // Collect vitamins and minerals
      nutrients.vitamins![nutrient.nutrientName] = nutrient.value;
    }
  }

  return nutrients;
}
