import type { ParsedFoodInput } from '@/domain/models';

/**
 * Parses free-text food input to extract food items and quantities.
 * Supports patterns like "2 chapati and dal", "banana", "100g rice", "100 g rice".
 * 
 * Parsing rules:
 * - Splits on "and", "," to detect multiple items
 * - Extracts leading numbers as quantities
 * - Recognizes unit keywords (grams, g, cups, pieces, serving) including no-space forms
 * - Defaults to quantity 1 when not specified
 */

export function parseFoodInput(input: string): ParsedFoodInput[] {
  // Split on common separators
  const separators = /\s+and\s+|,\s*/i;
  const parts = input.split(separators).map(s => s.trim()).filter(Boolean);

  return parts.map(part => {
    // Try to extract quantity and unit (including no-space forms like "100g")
    // Pattern: number (optional space) unit (optional space) name
    const quantityUnitMatch = part.match(/^(\d+(?:\.\d+)?)\s*(g|grams?|cups?|pieces?|pcs?|pc|servings?)\s+(.+)/i);
    
    if (quantityUnitMatch) {
      const quantity = parseFloat(quantityUnitMatch[1]);
      const unitStr = quantityUnitMatch[2].toLowerCase();
      const name = quantityUnitMatch[3].trim();
      
      // Map unit string to standard unit
      let unit: ParsedFoodInput['unit'] = 'serving';
      if (unitStr === 'g' || unitStr.startsWith('gram')) {
        unit = 'grams';
      } else if (unitStr.startsWith('cup')) {
        unit = 'cups';
      } else if (unitStr.startsWith('piece') || unitStr.startsWith('pc')) {
        unit = 'pieces';
      } else if (unitStr.startsWith('serving')) {
        unit = 'serving';
      }
      
      return { name, quantity, unit };
    }

    // Try to extract just quantity (number at start)
    const quantityMatch = part.match(/^(\d+(?:\.\d+)?)\s+(.+)/);
    
    if (quantityMatch) {
      const quantity = parseFloat(quantityMatch[1]);
      let name = quantityMatch[2].trim();
      
      // Check for unit hints in the name and extract them
      let unit: ParsedFoodInput['unit'] = undefined;
      
      // Check for unit keywords and remove them from name
      if (/\b(piece|pieces|pc|pcs)\b/i.test(name)) {
        unit = 'pieces';
        name = name.replace(/\b(piece|pieces|pc|pcs)\b/gi, '').trim();
      } else if (/\b(cup|cups)\b/i.test(name)) {
        unit = 'cups';
        name = name.replace(/\b(cup|cups)\b/gi, '').trim();
      } else if (/\b(g|gram|grams)\b/i.test(name)) {
        unit = 'grams';
        name = name.replace(/\b(g|gram|grams)\b/gi, '').trim();
      } else if (/\b(serving|servings)\b/i.test(name)) {
        unit = 'serving';
        name = name.replace(/\b(serving|servings)\b/gi, '').trim();
      }
      
      return { name, quantity, unit };
    }

    // No quantity found, default to 1
    return {
      name: part,
      quantity: 1,
    };
  });
}
