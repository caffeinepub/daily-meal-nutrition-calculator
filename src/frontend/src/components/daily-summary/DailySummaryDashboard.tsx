import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Trash2, TrendingUp, TrendingDown, CheckCircle2 } from 'lucide-react';
import { NutritionTable } from '@/components/nutrition/NutritionTable';
import { getHealthHints, calculateProgress } from '@/utils/recommendations';
import { useDailyGoals } from '@/state/useDailyGoals';
import { EditGoalsDialog } from './EditGoalsDialog';
import type { Nutrients } from '@/domain/models';

interface DailySummaryDashboardProps {
  dailyTotals: Nutrients;
  onClearDay: () => void;
}

/**
 * Daily Nutrition Summary Dashboard showing totals, progress toward editable goals, and health hints.
 */
export function DailySummaryDashboard({ dailyTotals, onClearDay }: DailySummaryDashboardProps) {
  const { effectiveGoals, updateGoals } = useDailyGoals();
  const hints = getHealthHints(dailyTotals, effectiveGoals);
  const progress = calculateProgress(dailyTotals, effectiveGoals);

  const isEmpty = dailyTotals.calories === 0;

  return (
    <section>
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle>Daily Nutrition Summary</CardTitle>
              <CardDescription>Your total nutrition for today</CardDescription>
            </div>
            <div className="flex gap-2">
              <EditGoalsDialog
                currentGoals={{
                  calories: effectiveGoals.calories,
                  protein: effectiveGoals.protein,
                }}
                onSave={updateGoals}
              />
              {!isEmpty && (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Trash2 className="h-4 w-4 mr-2" />
                      Clear Day
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Clear Today's Data?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This will remove all meals and reset your daily totals. This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={onClearDay}>Clear All</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {isEmpty ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>No meals tracked yet today. Start building your first meal!</p>
            </div>
          ) : (
            <>
              {/* Daily Totals */}
              <div>
                <h4 className="font-semibold mb-3">Daily Totals</h4>
                <NutritionTable nutrients={dailyTotals} />
              </div>

              {/* Progress Bars */}
              <div className="space-y-4">
                <h4 className="font-semibold">Progress Toward Daily Goals</h4>
                
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Calories</span>
                      <span className="text-muted-foreground">
                        {Math.round(dailyTotals.calories)} / {effectiveGoals.calories} cal
                      </span>
                    </div>
                    <Progress value={progress.calories} className="h-2" />
                  </div>

                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Protein</span>
                      <span className="text-muted-foreground">
                        {Math.round(dailyTotals.protein)} / {effectiveGoals.protein}g
                      </span>
                    </div>
                    <Progress value={progress.protein} className="h-2" />
                  </div>

                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Carbohydrates</span>
                      <span className="text-muted-foreground">
                        {Math.round(dailyTotals.carbs)} / {effectiveGoals.carbs}g
                      </span>
                    </div>
                    <Progress value={progress.carbs} className="h-2" />
                  </div>

                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Fat</span>
                      <span className="text-muted-foreground">
                        {Math.round(dailyTotals.fat)} / {effectiveGoals.fat}g
                      </span>
                    </div>
                    <Progress value={progress.fat} className="h-2" />
                  </div>
                </div>
              </div>

              {/* Health Hints */}
              {hints.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-semibold">Health Insights</h4>
                  <div className="flex flex-wrap gap-2">
                    {hints.map((hint, index) => (
                      <Badge
                        key={index}
                        variant={hint.type === 'warning' ? 'destructive' : hint.type === 'success' ? 'default' : 'secondary'}
                        className="flex items-center gap-1"
                      >
                        {hint.type === 'warning' && <TrendingDown className="h-3 w-3" />}
                        {hint.type === 'success' && <CheckCircle2 className="h-3 w-3" />}
                        {hint.type === 'info' && <TrendingUp className="h-3 w-3" />}
                        {hint.message}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </section>
  );
}
