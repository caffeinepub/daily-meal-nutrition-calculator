import { Toaster as SonnerToaster } from 'sonner';
import { useTheme } from 'next-themes';

/**
 * Toast notification wrapper using sonner with theme support.
 * Provides consistent toast styling across light and dark modes.
 */
export function Toaster() {
  const { theme } = useTheme();

  return (
    <SonnerToaster
      theme={theme as 'light' | 'dark' | 'system'}
      position="top-center"
      toastOptions={{
        classNames: {
          toast: 'bg-background text-foreground border-border',
          description: 'text-muted-foreground',
          actionButton: 'bg-primary text-primary-foreground',
          cancelButton: 'bg-muted text-muted-foreground',
        },
      }}
    />
  );
}
