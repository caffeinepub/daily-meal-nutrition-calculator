/**
 * Core domain models for the Daily Meal Nutrition Calculator.
 * These types define the structure of food items, meals, and nutrition data.
 */

export interface Nutrients {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  sugar: number;
  vitamins?: Record<string, number>;
}

export interface FoodItem {
  id: string;
  name: string;
  servingDescription: string;
  quantity: number;
  unit: 'grams' | 'pieces' | 'cups' | 'serving';
  nutrients: Nutrients;
  fdcId?: number; // USDA FoodData Central ID
  // Baseline serving metadata for conversions
  baselineServingAmount?: number;
  baselineServingUnit?: 'grams' | 'pieces' | 'cups' | 'serving';
}

export interface Meal {
  id: string;
  name: string;
  foods: FoodItem[];
  totals: Nutrients;
  timestamp: number;
}

export interface ParsedFoodInput {
  name: string;
  quantity?: number;
  unit?: FoodItem['unit'];
}

export interface DayState {
  meals: Meal[];
  date: string; // ISO date string
}
