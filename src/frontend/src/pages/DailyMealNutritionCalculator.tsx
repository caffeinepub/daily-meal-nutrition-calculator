import { Header } from '@/components/Header';
import { CurrentMealSection } from '@/components/current-meal/CurrentMealSection';
import { AllMealsTodaySection } from '@/components/all-meals/AllMealsTodaySection';
import { DailySummaryDashboard } from '@/components/daily-summary/DailySummaryDashboard';
import { useCurrentMeal } from '@/state/useCurrentMeal';
import { useDayMeals } from '@/state/useDayMeals';

/**
 * Main page component for the Daily Meal Nutrition Calculator.
 * Orchestrates three main sections: Current Meal Builder, All Meals Today, and Daily Summary.
 */
export function DailyMealNutritionCalculator() {
  const currentMeal = useCurrentMeal();
  const dayMeals = useDayMeals();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-6 space-y-8 max-w-4xl">
        {/* Section 1: Current Meal Builder */}
        <CurrentMealSection 
          currentMeal={currentMeal}
          onSaveMeal={dayMeals.addMeal}
        />

        {/* Section 2: All Meals Today */}
        <AllMealsTodaySection 
          meals={dayMeals.meals}
          onRemoveMeal={dayMeals.removeMeal}
          onRemoveFoodFromMeal={() => {}}
        />

        {/* Section 3: Daily Summary Dashboard */}
        <DailySummaryDashboard 
          dailyTotals={dayMeals.dailyTotals}
          onClearDay={dayMeals.clearDay}
        />
      </main>

      {/* Footer with attribution */}
      <footer className="border-t mt-16 py-6">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>
            © {new Date().getFullYear()} Daily Meal Nutrition Calculator. Built with ❤️ using{' '}
            <a
              href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(
                typeof window !== 'undefined' ? window.location.hostname : 'daily-meal-calculator'
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
