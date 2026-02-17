import type { DayState } from '@/domain/models';
import type { DailyGoals } from './useDailyGoals';

/**
 * Browser localStorage persistence layer for app state.
 * Handles API key storage, daily meal data, and daily goals with versioning and safe error handling.
 */

const STORAGE_KEYS = {
  API_KEY: 'daily-meal-api-key',
  DAY_STATE: 'daily-meal-day-state',
  DAILY_GOALS: 'daily-meal-goals',
  VERSION: 'v1',
};

// Check if localStorage is available (browser context)
function isStorageAvailable(): boolean {
  try {
    return typeof window !== 'undefined' && typeof localStorage !== 'undefined';
  } catch {
    return false;
  }
}

// API Key Management

export function getApiKey(): string | null {
  if (!isStorageAvailable()) return null;
  try {
    return localStorage.getItem(STORAGE_KEYS.API_KEY);
  } catch (error) {
    console.error('Failed to read API key from localStorage:', error);
    return null;
  }
}

export function setApiKey(key: string): void {
  if (!isStorageAvailable()) {
    console.error('localStorage not available - cannot save API key');
    return;
  }
  try {
    localStorage.setItem(STORAGE_KEYS.API_KEY, key);
  } catch (error) {
    console.error('Failed to save API key to localStorage:', error);
    throw new Error('Unable to save API key. Please check browser storage settings.');
  }
}

export function clearApiKey(): void {
  if (!isStorageAvailable()) return;
  try {
    localStorage.removeItem(STORAGE_KEYS.API_KEY);
  } catch (error) {
    console.error('Failed to clear API key from localStorage:', error);
  }
}

// Day State Management

export function loadDayState(): DayState | null {
  if (!isStorageAvailable()) return null;
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.DAY_STATE);
    if (!stored) return null;

    const parsed = JSON.parse(stored);
    
    // Check if data is from today
    const today = new Date().toISOString().split('T')[0];
    if (parsed.date !== today) {
      // Clear old data
      clearDayState();
      return null;
    }

    return parsed;
  } catch (error) {
    console.error('Failed to load day state from localStorage:', error);
    return null;
  }
}

export function saveDayState(state: DayState): void {
  if (!isStorageAvailable()) {
    console.error('localStorage not available - cannot save day state');
    return;
  }
  try {
    localStorage.setItem(STORAGE_KEYS.DAY_STATE, JSON.stringify(state));
  } catch (error) {
    console.error('Failed to save day state to localStorage:', error);
    // Don't throw - allow app to continue functioning without persistence
  }
}

export function clearDayState(): void {
  if (!isStorageAvailable()) return;
  try {
    localStorage.removeItem(STORAGE_KEYS.DAY_STATE);
  } catch (error) {
    console.error('Failed to clear day state from localStorage:', error);
  }
}

// Daily Goals Management (independent from day state)

export function loadDailyGoals(): DailyGoals | null {
  if (!isStorageAvailable()) return null;
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.DAILY_GOALS);
    if (!stored) return null;
    return JSON.parse(stored);
  } catch (error) {
    console.error('Failed to load daily goals from localStorage:', error);
    return null;
  }
}

export function saveDailyGoals(goals: DailyGoals): void {
  if (!isStorageAvailable()) {
    console.error('localStorage not available - cannot save daily goals');
    return;
  }
  try {
    localStorage.setItem(STORAGE_KEYS.DAILY_GOALS, JSON.stringify(goals));
  } catch (error) {
    console.error('Failed to save daily goals to localStorage:', error);
    // Don't throw - allow app to continue functioning without persistence
  }
}

export function clearDailyGoals(): void {
  if (!isStorageAvailable()) return;
  try {
    localStorage.removeItem(STORAGE_KEYS.DAILY_GOALS);
  } catch (error) {
    console.error('Failed to clear daily goals from localStorage:', error);
  }
}
