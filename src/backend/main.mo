import Map "mo:core/Map";
import Order "mo:core/Order";
import Principal "mo:core/Principal";
import Array "mo:core/Array";
import Runtime "mo:core/Runtime";
import Iter "mo:core/Iter";
import Time "mo:core/Time";

actor {
  /// Define core types for food entries and nutrition totals.
  type FoodEntry = {
    description : Text;
    calories : Nat;
    protein : Nat;
    carbohydrates : Nat;
    fat : Nat;
    fiber : Nat;
    timestamp : Time.Time;
  };

  type NutritionTotals = {
    calories : Nat;
    protein : Nat;
    carbohydrates : Nat;
    fat : Nat;
    fiber : Nat;
    count : Nat;
  };

  module FoodEntry {
    public func compare(f1 : FoodEntry, f2 : FoodEntry) : Order.Order {
      Nat.compare(f1.calories, f2.calories);
    };
  };

  /// Persistent storage for user food logs.
  let foodLogs = Map.empty<Principal, [FoodEntry]>();

  /// Log a new food entry for the caller.
  public shared ({ caller }) func logFood(food : FoodEntry) : async () {
    let updatedEntries = switch (foodLogs.get(caller)) {
      case (null) { [food] };
      case (?entries) { entries.concat([food]) };
    };
    foodLogs.add(caller, updatedEntries);
  };

  /// Retrieve all food entries for the caller, sorted by calories.
  public query ({ caller }) func getMyFoods() : async [FoodEntry] {
    switch (foodLogs.get(caller)) {
      case (null) { Runtime.trap("User has no food logs stored") };
      case (?entries) { entries.sort() }; // Uses FoodEntry.compare
    };
  };

  /// Compute aggregate nutrition totals for the caller's food entries.
  public query ({ caller }) func getNutritionTotals() : async NutritionTotals {
    switch (foodLogs.get(caller)) {
      case (null) { {
        calories = 0;
        protein = 0;
        carbohydrates = 0;
        fat = 0;
        fiber = 0;
        count = 0;
      } };
      case (?entries) {
        var calories = 0;
        var protein = 0;
        var carbohydrates = 0;
        var fat = 0;
        var fiber = 0;

        entries.values().forEach(
          func(entry) {
            calories += entry.calories;
            protein += entry.protein;
            carbohydrates += entry.carbohydrates;
            fat += entry.fat;
            fiber += entry.fiber;
          }
        );

        {
          calories;
          protein;
          carbohydrates;
          fat;
          fiber;
          count = entries.size();
        };
      };
    };
  };
};
