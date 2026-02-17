import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import type { Nutrients } from '@/domain/models';

interface NutritionTableProps {
  nutrients: Nutrients;
  compact?: boolean;
}

/**
 * Displays macronutrient information in a clean, readable table format.
 */
export function NutritionTable({ nutrients, compact = false }: NutritionTableProps) {
  const rows = [
    { label: 'Calories', value: Math.round(nutrients.calories), unit: 'cal' },
    { label: 'Protein', value: Math.round(nutrients.protein), unit: 'g' },
    { label: 'Carbohydrates', value: Math.round(nutrients.carbs), unit: 'g' },
    { label: 'Fat', value: Math.round(nutrients.fat), unit: 'g' },
    { label: 'Fiber', value: Math.round(nutrients.fiber), unit: 'g' },
    { label: 'Sugar', value: Math.round(nutrients.sugar), unit: 'g' },
  ];

  if (compact) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-sm">
        {rows.map((row) => (
          <div key={row.label} className="flex justify-between p-2 bg-muted/30 rounded">
            <span className="text-muted-foreground">{row.label}</span>
            <span className="font-medium">
              {row.value}
              {row.unit}
            </span>
          </div>
        ))}
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nutrient</TableHead>
          <TableHead className="text-right">Amount</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.map((row) => (
          <TableRow key={row.label}>
            <TableCell className="font-medium">{row.label}</TableCell>
            <TableCell className="text-right">
              {row.value}
              {row.unit}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
