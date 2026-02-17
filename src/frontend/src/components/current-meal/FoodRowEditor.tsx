import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Trash2, Info } from 'lucide-react';
import { VitaminsMineralsPanel } from '@/components/nutrition/VitaminsMineralsPanel';
import { getScaledNutrients, computeServingMultiplier } from '@/utils/servingMath';
import type { FoodItem } from '@/domain/models';

interface FoodRowEditorProps {
  food: FoodItem;
  onUpdate: (updates: Partial<FoodItem>) => void;
  onRemove: () => void;
}

/**
 * Editable row for a single food item with explicit amount/unit controls and scaled nutrition display.
 * Shows nutrition values that reflect the user-entered amount and unit.
 */
export function FoodRowEditor({ food, onUpdate, onRemove }: FoodRowEditorProps) {
  // Get scaled nutrients based on user-entered amount/unit
  const scaledNutrients = getScaledNutrients(food);
  const conversionResult = computeServingMultiplier(food);

  return (
    <Card className="p-4">
      <div className="space-y-3">
        {/* Food Name and Remove Button */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <h4 className="font-medium text-sm">{food.name}</h4>
            <p className="text-xs text-muted-foreground">{food.servingDescription}</p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onRemove}
            className="h-8 w-8 text-destructive hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>

        {/* Amount and Unit Controls with Labels */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label htmlFor={`amount-${food.id}`} className="text-xs font-medium">
              Amount
            </Label>
            <Input
              id={`amount-${food.id}`}
              type="number"
              min="0.1"
              step="0.1"
              value={food.quantity}
              onChange={(e) => onUpdate({ quantity: parseFloat(e.target.value) || 1 })}
              className="h-9"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor={`unit-${food.id}`} className="text-xs font-medium">
              Unit
            </Label>
            <Select
              value={food.unit}
              onValueChange={(unit) => onUpdate({ unit: unit as FoodItem['unit'] })}
            >
              <SelectTrigger id={`unit-${food.id}`} className="h-9">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="grams">Grams</SelectItem>
                <SelectItem value="pieces">Pieces</SelectItem>
                <SelectItem value="cups">Cups</SelectItem>
                <SelectItem value="serving">Serving</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Conversion Fallback Note */}
        {!conversionResult.isDirectConversion && conversionResult.fallbackNote && (
          <div className="flex items-start gap-2 p-2 bg-muted/50 rounded text-xs text-muted-foreground">
            <Info className="h-3.5 w-3.5 mt-0.5 flex-shrink-0" />
            <span>{conversionResult.fallbackNote}</span>
          </div>
        )}

        {/* Nutrition Summary (Scaled) */}
        <div className="grid grid-cols-3 gap-2 text-xs">
          <div className="text-center p-2 bg-muted/50 rounded">
            <div className="font-semibold">{Math.round(scaledNutrients.calories)}</div>
            <div className="text-muted-foreground">cal</div>
          </div>
          <div className="text-center p-2 bg-muted/50 rounded">
            <div className="font-semibold">{Math.round(scaledNutrients.protein)}g</div>
            <div className="text-muted-foreground">protein</div>
          </div>
          <div className="text-center p-2 bg-muted/50 rounded">
            <div className="font-semibold">{Math.round(scaledNutrients.carbs)}g</div>
            <div className="text-muted-foreground">carbs</div>
          </div>
        </div>

        {/* Vitamins & Minerals Panel (Scaled) */}
        {scaledNutrients.vitamins && Object.keys(scaledNutrients.vitamins).length > 0 && (
          <VitaminsMineralsPanel vitamins={scaledNutrients.vitamins} />
        )}
      </div>
    </Card>
  );
}
