import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Plus, Loader2 } from 'lucide-react';
import { FoodRowEditor } from './FoodRowEditor';
import { SaveMealControls } from './SaveMealControls';
import { NutritionTable } from '@/components/nutrition/NutritionTable';
import { parseFoodInput } from '@/utils/foodParser';
import { searchFood } from '@/services/nutritionApiClient';
import { toast } from 'sonner';
import type { CurrentMealState } from '@/state/useCurrentMeal';
import type { Meal } from '@/domain/models';

interface CurrentMealSectionProps {
  currentMeal: CurrentMealState;
  onSaveMeal: (meal: Meal) => void;
}

/**
 * Current Meal Builder section: allows adding foods with parsed quantities/units,
 * editing amounts/units explicitly, and saving the meal to a daily meal slot.
 */
export function CurrentMealSection({ currentMeal, onSaveMeal }: CurrentMealSectionProps) {
  const [foodInput, setFoodInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleAddFood = async () => {
    if (!foodInput.trim()) {
      toast.error('Please enter a food name');
      return;
    }

    setIsLoading(true);
    try {
      // Parse the input to extract food items with quantities and units
      const parsedItems = parseFoodInput(foodInput);
      
      // Search for each parsed item
      for (const item of parsedItems) {
        const result = await searchFood(item.name);
        if (result) {
          // Apply parsed quantity and unit to the food item
          currentMeal.addFood({
            ...result,
            quantity: item.quantity || result.quantity,
            unit: item.unit || result.unit,
          });
        }
      }

      setFoodInput('');
      toast.success(`Added ${parsedItems.length} food item(s)`);
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error('Failed to add food');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isLoading) {
      handleAddFood();
    }
  };

  return (
    <section>
      <Card>
        <CardHeader>
          <CardTitle>Current Meal Builder</CardTitle>
          <CardDescription>
            Add foods to build your meal. Try "100g rice", "2 cups milk", or "banana"
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Food Input */}
          <div className="flex gap-2">
            <Input
              placeholder="Enter food (e.g., 100g rice, 2 cups milk, banana)"
              value={foodInput}
              onChange={(e) => setFoodInput(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={isLoading}
            />
            <Button onClick={handleAddFood} disabled={isLoading}>
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Plus className="h-4 w-4" />
              )}
              <span className="ml-2 hidden sm:inline">Add Food</span>
            </Button>
          </div>

          {/* Food List */}
          {currentMeal.foods.length > 0 ? (
            <div className="space-y-3">
              {currentMeal.foods.map((food) => (
                <FoodRowEditor
                  key={food.id}
                  food={food}
                  onUpdate={(updates) => currentMeal.updateFood(food.id, updates)}
                  onRemove={() => currentMeal.removeFood(food.id)}
                />
              ))}

              {/* Meal Totals */}
              <div className="pt-4 border-t">
                <h4 className="font-semibold mb-3">Meal Totals</h4>
                <NutritionTable nutrients={currentMeal.mealTotals} />
              </div>

              {/* Save Meal Controls */}
              <SaveMealControls
                currentMeal={currentMeal}
                onSaveMeal={onSaveMeal}
              />
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <p>No foods added yet. Start by entering a food name above.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </section>
  );
}
