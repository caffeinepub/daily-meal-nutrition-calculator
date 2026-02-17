# Specification

## Summary
**Goal:** Let users edit each meal item’s quantity and unit (including exact grams) and have nutrition totals recalculate correctly.

**Planned changes:**
- Update Current Meal Builder food rows to include clear, explicit quantity and unit controls (English labels) that update the item’s nutrition and meal totals immediately.
- Store baseline serving metadata (amount + unit) on each added FoodItem (especially from USDA results) so user-entered amounts can be converted into a stable multiplier against the baseline serving for totals.
- Improve free-text parsing to extract inline quantity + unit (including “100g” no-space forms), clean the remaining food name, and initialize newly added items with the parsed quantity/unit and correct nutrition display.
- Add a safe fallback for units that can’t be reliably converted from the baseline: show an English explanation and treat the input as a serving multiplier without breaking calculations.

**User-visible outcome:** Users can type or select amounts like “150 grams”, switch units (grams/cups/pieces/serving) without re-adding foods, and see per-item and total meal nutrition update consistently.
