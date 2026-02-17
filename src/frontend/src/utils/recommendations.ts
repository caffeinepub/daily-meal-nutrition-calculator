import type { Nutrients } from '@/domain/models';

/**
 * Recommended daily intake values and health hint logic.
 * Uses simple deterministic rules for generating insights.
 * Supports custom user goals for calories and protein.
 */

export interface RecommendedIntake {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
}

export interface HealthHint {
  type: 'success' | 'warning' | 'info';
  message: string;
}

/**
 * Calculate progress percentages toward daily goals.
 * Caps progress at 100% for display purposes.
 */
export function calculateProgress(
  actual: Nutrients,
  recommended: RecommendedIntake
): Record<string, number> {
  return {
    calories: Math.min((actual.calories / recommended.calories) * 100, 100),
    protein: Math.min((actual.protein / recommended.protein) * 100, 100),
    carbs: Math.min((actual.carbs / recommended.carbs) * 100, 100),
    fat: Math.min((actual.fat / recommended.fat) * 100, 100),
  };
}

/**
 * Generate health hints based on daily totals vs recommended intake.
 * Uses effective goals (including user custom goals for calories/protein).
 * Rules:
 * - Protein < 80% of target: "Protein low today"
 * - Calories > 110% of target: "Calories exceeded"
 * - All macros within 80-110%: "Balanced nutrition"
 * - Fiber < 20g: "Consider adding more fiber"
 */
export function getHealthHints(
  actual: Nutrients,
  recommended: RecommendedIntake
): HealthHint[] {
  const hints: HealthHint[] = [];

  const proteinPercent = (actual.protein / recommended.protein) * 100;
  const caloriesPercent = (actual.calories / recommended.calories) * 100;
  const carbsPercent = (actual.carbs / recommended.carbs) * 100;
  const fatPercent = (actual.fat / recommended.fat) * 100;

  // Check protein (uses custom goal if set)
  if (proteinPercent < 80) {
    hints.push({
      type: 'warning',
      message: 'Protein low today',
    });
  }

  // Check calories (uses custom goal if set)
  if (caloriesPercent > 110) {
    hints.push({
      type: 'info',
      message: 'Calories exceeded',
    });
  }

  // Check for balanced nutrition
  const isBalanced =
    proteinPercent >= 80 &&
    proteinPercent <= 110 &&
    caloriesPercent >= 80 &&
    caloriesPercent <= 110 &&
    carbsPercent >= 80 &&
    carbsPercent <= 110 &&
    fatPercent >= 80 &&
    fatPercent <= 110;

  if (isBalanced) {
    hints.push({
      type: 'success',
      message: 'Balanced nutrition',
    });
  }

  // Check fiber
  if (actual.fiber < 20) {
    hints.push({
      type: 'info',
      message: 'Consider adding more fiber',
    });
  }

  return hints;
}
