import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { NutritionTable } from '@/components/nutrition/NutritionTable';
import { getScaledNutrients } from '@/utils/servingMath';
import type { Meal } from '@/domain/models';

interface AllMealsTodaySectionProps {
  meals: Meal[];
  onRemoveMeal: (mealId: string) => void;
  onRemoveFoodFromMeal: (mealId: string, foodId: string) => void;
}

/**
 * Displays all saved meals for today with expandable details and per-meal totals.
 * Shows scaled nutrition values that reflect each food's user-entered amount/unit.
 */
export function AllMealsTodaySection({ meals, onRemoveMeal }: AllMealsTodaySectionProps) {
  if (meals.length === 0) {
    return (
      <section>
        <Card>
          <CardHeader>
            <CardTitle>All Meals Today</CardTitle>
            <CardDescription>Your saved meals will appear here</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-muted-foreground">
              <p>No meals saved yet. Build and save your first meal above!</p>
            </div>
          </CardContent>
        </Card>
      </section>
    );
  }

  return (
    <section>
      <Card>
        <CardHeader>
          <CardTitle>All Meals Today</CardTitle>
          <CardDescription>
            {meals.length} meal{meals.length !== 1 ? 's' : ''} saved
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="space-y-2">
            {meals.map((meal) => (
              <AccordionItem key={meal.id} value={meal.id} className="border rounded-lg px-4">
                <AccordionTrigger className="hover:no-underline">
                  <div className="flex items-center justify-between w-full pr-4">
                    <div className="text-left">
                      <div className="font-semibold">{meal.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {meal.foods.length} item{meal.foods.length !== 1 ? 's' : ''} • {Math.round(meal.totals.calories)} cal
                      </div>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-4 pt-2">
                    {/* Food Items with Scaled Nutrition */}
                    <div className="space-y-2">
                      {meal.foods.map((food) => {
                        const scaledNutrients = getScaledNutrients(food);
                        return (
                          <div key={food.id} className="flex justify-between items-center text-sm p-2 bg-muted/30 rounded">
                            <div>
                              <div className="font-medium">{food.name}</div>
                              <div className="text-xs text-muted-foreground">
                                {food.quantity} {food.unit}
                              </div>
                            </div>
                            <div className="text-right text-xs">
                              <div>{Math.round(scaledNutrients.calories)} cal</div>
                              <div className="text-muted-foreground">
                                P: {Math.round(scaledNutrients.protein)}g • C: {Math.round(scaledNutrients.carbs)}g
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Meal Totals */}
                    <div className="border-t pt-3">
                      <h5 className="font-semibold text-sm mb-2">Meal Totals</h5>
                      <NutritionTable nutrients={meal.totals} compact />
                    </div>

                    {/* Remove Meal Button */}
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => onRemoveMeal(meal.id)}
                      className="w-full"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Remove Meal
                    </Button>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>
    </section>
  );
}
