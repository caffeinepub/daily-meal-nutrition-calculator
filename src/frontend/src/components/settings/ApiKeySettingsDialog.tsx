import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info } from 'lucide-react';
import { getApiKey, setApiKey } from '@/state/storage';

interface ApiKeySettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

/**
 * Dialog for entering and saving the USDA FoodData Central API key.
 * Stores the key in localStorage for reuse across sessions.
 */
export function ApiKeySettingsDialog({ open, onOpenChange }: ApiKeySettingsDialogProps) {
  const [apiKey, setApiKeyValue] = useState('');

  useEffect(() => {
    if (open) {
      const storedKey = getApiKey();
      setApiKeyValue(storedKey || '');
    }
  }, [open]);

  const handleSave = () => {
    setApiKey(apiKey.trim());
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>API Configuration</DialogTitle>
          <DialogDescription>
            Enter your USDA FoodData Central API key to enable nutrition lookups.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription className="text-xs">
              Get your free API key at{' '}
              <a
                href="https://fdc.nal.usda.gov/api-key-signup.html"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                fdc.nal.usda.gov/api-key-signup.html
              </a>
            </AlertDescription>
          </Alert>

          <div className="space-y-2">
            <Label htmlFor="api-key">API Key</Label>
            <Input
              id="api-key"
              type="password"
              placeholder="Enter your USDA API key"
              value={apiKey}
              onChange={(e) => setApiKeyValue(e.target.value)}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
