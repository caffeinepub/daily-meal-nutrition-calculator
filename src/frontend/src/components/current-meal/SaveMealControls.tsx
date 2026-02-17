import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Save } from 'lucide-react';
import { toast } from 'sonner';
import type { CurrentMealState } from '@/state/useCurrentMeal';
import type { Meal } from '@/domain/models';

interface SaveMealControlsProps {
  currentMeal: CurrentMealState;
  onSaveMeal: (meal: Meal) => void;
}

const MEAL_CATEGORIES = ['Breakfast', 'Lunch', 'Snacks', 'Dinner', 'Custom'] as const;

/**
 * Controls for saving the current meal to a daily meal slot (Breakfast/Lunch/etc or custom name).
 */
export function SaveMealControls({ currentMeal, onSaveMeal }: SaveMealControlsProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('Breakfast');
  const [customName, setCustomName] = useState('');

  const handleSave = () => {
    if (currentMeal.foods.length === 0) {
      toast.error('Add at least one food before saving');
      return;
    }

    const mealName = selectedCategory === 'Custom' ? customName.trim() : selectedCategory;
    
    if (!mealName) {
      toast.error('Please enter a meal name');
      return;
    }

    const meal: Meal = {
      id: Date.now().toString(),
      name: mealName,
      foods: currentMeal.foods,
      totals: currentMeal.mealTotals,
      timestamp: Date.now(),
    };

    onSaveMeal(meal);
    currentMeal.clearMeal();
    setDialogOpen(false);
    setCustomName('');
    toast.success(`Saved to ${mealName}`);
  };

  return (
    <>
      <Button onClick={() => setDialogOpen(true)} className="w-full">
        <Save className="h-4 w-4 mr-2" />
        Save Meal
      </Button>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Save Meal</DialogTitle>
            <DialogDescription>
              Choose a meal category or enter a custom name
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Meal Category</Label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {MEAL_CATEGORIES.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedCategory === 'Custom' && (
              <div className="space-y-2">
                <Label>Custom Meal Name</Label>
                <Input
                  placeholder="e.g., Mid-morning snack"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                />
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
