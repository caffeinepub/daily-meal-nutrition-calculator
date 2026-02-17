import { DailyMealNutritionCalculator } from './pages/DailyMealNutritionCalculator';
import { ThemeProvider } from 'next-themes';
import { Toaster } from '@/components/Toaster';

function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <DailyMealNutritionCalculator />
      <Toaster />
    </ThemeProvider>
  );
}

export default App;
