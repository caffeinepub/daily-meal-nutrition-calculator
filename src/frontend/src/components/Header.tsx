import { Settings, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ApiKeySettingsDialog } from '@/components/settings/ApiKeySettingsDialog';
import { useState, useEffect } from 'react';
import { getApiKey } from '@/state/storage';

/**
 * App header with logo, title, settings button, and API key prerequisite indicator.
 * Shows a clear alert when USDA API key is not configured.
 */
export function Header() {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [hasApiKey, setHasApiKey] = useState(false);

  useEffect(() => {
    // Check API key on mount and when settings dialog closes
    setHasApiKey(!!getApiKey());
  }, [settingsOpen]);

  // Build image URL relative to app base for IC canister hosting
  const logoUrl = new URL('./assets/generated/daily-meal-logo.dim_256x256.png', window.location.origin).href;

  return (
    <>
      <header className="border-b bg-card sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between max-w-4xl">
          <div className="flex items-center gap-3">
            <img 
              src={logoUrl}
              alt="Daily Meal Logo" 
              className="w-10 h-10 rounded-lg"
            />
            <div>
              <h1 className="text-xl font-bold text-foreground">Daily Meal Nutrition</h1>
              <p className="text-xs text-muted-foreground">Track your nutrition, meal by meal</p>
            </div>
          </div>
          
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => setSettingsOpen(true)}
            aria-label="Settings"
          >
            <Settings className="h-5 w-5" />
          </Button>
        </div>

        {!hasApiKey && (
          <div className="container mx-auto px-4 pb-3 max-w-4xl">
            <Alert variant="default" className="bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800">
              <AlertCircle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
              <AlertDescription className="text-amber-800 dark:text-amber-200">
                <span className="font-medium">API Key Required:</span> Please configure your USDA FoodData Central API key in{' '}
                <button 
                  onClick={() => setSettingsOpen(true)}
                  className="underline hover:no-underline font-medium"
                >
                  Settings
                </button>
                {' '}to search for foods.
              </AlertDescription>
            </Alert>
          </div>
        )}
      </header>

      <ApiKeySettingsDialog open={settingsOpen} onOpenChange={setSettingsOpen} />
    </>
  );
}
