"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, Search } from "lucide-react";

const alcoholicDrinks = [
  "Alcohol",
  "Bier",
  "Bourbon",
  "Comazuipen",
  "Drank",
  "Gin",
  "Rum",
  "Tequila",
  "Whisky",
  "Wijn",
  "Wodka",
];

export default function HabitsPage() {
  const router = useRouter();
  const [selectedHabits, setSelectedHabits] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  const toggleHabit = (habit: string) => {
    if (selectedHabits.includes(habit)) {
      setSelectedHabits(selectedHabits.filter((h) => h !== habit));
    } else {
      setSelectedHabits([...selectedHabits, habit]);
    }
  };

  const filteredHabits = alcoholicDrinks.filter((habit) =>
    habit.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleNext = () => {
    if (selectedHabits.length > 0) {
      // Store selected habits in localStorage for now
      localStorage.setItem("selectedHabits", JSON.stringify(selectedHabits));
      router.push("/onboarding/frequency");
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <div className="sticky top-0 bg-background/95 backdrop-blur-sm border-b border-border z-10">
        <div className="max-w-2xl mx-auto px-6 py-4 flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-muted rounded-lg transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-xl font-semibold">Waar stop je mee?</h1>
            <p className="text-sm text-muted-foreground">
              Je kunt later meer toevoegen
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-6 py-6">
        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Zoeken..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-muted border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>

        {/* Category */}
        <div className="mb-4">
          <h2 className="text-lg font-semibold mb-4">Alcoholische dranken</h2>
        </div>

        {/* Habits List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-2"
        >
          {filteredHabits.map((habit, index) => (
            <motion.button
              key={habit}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => toggleHabit(habit)}
              className={`w-full px-4 py-4 rounded-lg text-left font-medium transition-all flex items-center justify-between ${
                selectedHabits.includes(habit)
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted hover:bg-muted/80"
              }`}
            >
              <span>{habit}</span>
              {selectedHabits.includes(habit) && (
                <span className="text-2xl">✓</span>
              )}
            </motion.button>
          ))}
        </motion.div>
      </div>

      {/* Bottom Button */}
      <div className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-sm border-t border-border p-6">
        <div className="max-w-2xl mx-auto">
          <button
            onClick={handleNext}
            disabled={selectedHabits.length === 0}
            className={`w-full py-4 rounded-xl font-semibold text-lg transition-all ${
              selectedHabits.length > 0
                ? "bg-primary text-primary-foreground hover:bg-primary/90"
                : "bg-muted text-muted-foreground cursor-not-allowed"
            }`}
          >
            Volgende
          </button>
        </div>
      </div>
    </div>
  );
}
