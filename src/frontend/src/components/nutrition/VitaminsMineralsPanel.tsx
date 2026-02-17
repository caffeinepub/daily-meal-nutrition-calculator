import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

interface VitaminsMineralsPanelProps {
  vitamins: Record<string, number>;
}

/**
 * Expandable panel showing vitamins and minerals to keep the main nutrition table readable.
 */
export function VitaminsMineralsPanel({ vitamins }: VitaminsMineralsPanelProps) {
  const entries = Object.entries(vitamins);

  if (entries.length === 0) {
    return null;
  }

  return (
    <Accordion type="single" collapsible>
      <AccordionItem value="vitamins" className="border-none">
        <AccordionTrigger className="text-xs py-2 hover:no-underline">
          View Vitamins & Minerals ({entries.length})
        </AccordionTrigger>
        <AccordionContent>
          <div className="grid grid-cols-2 gap-2 text-xs">
            {entries.map(([name, value]) => (
              <div key={name} className="flex justify-between p-2 bg-muted/20 rounded">
                <span className="text-muted-foreground">{name}</span>
                <span className="font-medium">{value.toFixed(1)}</span>
              </div>
            ))}
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
