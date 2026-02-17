import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface NutritionTotals {
    fat: bigint;
    fiber: bigint;
    carbohydrates: bigint;
    calories: bigint;
    count: bigint;
    protein: bigint;
}
export type Time = bigint;
export interface FoodEntry {
    fat: bigint;
    fiber: bigint;
    carbohydrates: bigint;
    calories: bigint;
    description: string;
    timestamp: Time;
    protein: bigint;
}
export interface backendInterface {
    /**
     * / Retrieve all food entries for the caller, sorted by calories.
     */
    getMyFoods(): Promise<Array<FoodEntry>>;
    /**
     * / Compute aggregate nutrition totals for the caller's food entries.
     */
    getNutritionTotals(): Promise<NutritionTotals>;
    /**
     * / Log a new food entry for the caller.
     */
    logFood(food: FoodEntry): Promise<void>;
}
