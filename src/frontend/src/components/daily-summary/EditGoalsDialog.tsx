import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Settings } from 'lucide-react';
import type { DailyGoals } from '@/state/useDailyGoals';

interface EditGoalsDialogProps {
  currentGoals: {
    calories: number;
    protein: number;
  };
  onSave: (goals: DailyGoals) => void;
}

/**
 * Dialog for editing daily calorie and protein goals with validation.
 */
export function EditGoalsDialog({ currentGoals, onSave }: EditGoalsDialogProps) {
  const [open, setOpen] = useState(false);
  const [calories, setCalories] = useState(currentGoals.calories.toString());
  const [protein, setProtein] = useState(currentGoals.protein.toString());
  const [errors, setErrors] = useState<{ calories?: string; protein?: string }>({});

  const handleOpen = (isOpen: boolean) => {
    setOpen(isOpen);
    if (isOpen) {
      // Reset to current values when opening
      setCalories(currentGoals.calories.toString());
      setProtein(currentGoals.protein.toString());
      setErrors({});
    }
  };

  const validate = (): boolean => {
    const newErrors: { calories?: string; protein?: string } = {};
    
    const caloriesNum = parseFloat(calories);
    const proteinNum = parseFloat(protein);

    if (isNaN(caloriesNum) || caloriesNum <= 0) {
      newErrors.calories = 'Please enter a positive number';
    }

    if (isNaN(proteinNum) || proteinNum <= 0) {
      newErrors.protein = 'Please enter a positive number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;

    onSave({
      calories: parseFloat(calories),
      protein: parseFloat(protein),
    });
    setOpen(false);
  };

  const isValid = !isNaN(parseFloat(calories)) && parseFloat(calories) > 0 &&
                  !isNaN(parseFloat(protein)) && parseFloat(protein) > 0;

  return (
    <Dialog open={open} onOpenChange={handleOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Settings className="h-4 w-4 mr-2" />
          Edit Goals
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Daily Goals</DialogTitle>
          <DialogDescription>
            Customize your daily calorie and protein targets. These goals will be used to track your progress.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="calories">
              Daily Calories (cal)
            </Label>
            <Input
              id="calories"
              type="number"
              min="1"
              step="1"
              value={calories}
              onChange={(e) => setCalories(e.target.value)}
              placeholder="2000"
              className={errors.calories ? 'border-destructive' : ''}
            />
            {errors.calories && (
              <p className="text-sm text-destructive">{errors.calories}</p>
            )}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="protein">
              Daily Protein (g)
            </Label>
            <Input
              id="protein"
              type="number"
              min="1"
              step="1"
              value={protein}
              onChange={(e) => setProtein(e.target.value)}
              placeholder="50"
              className={errors.protein ? 'border-destructive' : ''}
            />
            {errors.protein && (
              <p className="text-sm text-destructive">{errors.protein}</p>
            )}
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!isValid}>
            Save Goals
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
