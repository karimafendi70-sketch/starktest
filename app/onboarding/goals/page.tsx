"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";

const availableGoals = [
  "Mentale gezondheid verbeteren",
  "Controle over mijn leven krijgen",
  "Gezondheidsproblemen aanpakken",
  "Relaties verbeteren",
  "Spiritueel of religieus leven verdiepen",
  "Trots zijn op mezelf",
  "Productiviteit verhogen",
  "Beter slapen en meer energie hebben",
  "Juridische zaken afhandelen",
  "Nieuwe interesses en hobby's ontdekken",
  "Geld besparen",
  "Andere",
];

export default function GoalsPage() {
  const router = useRouter();
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);

  const toggleGoal = (goal: string) => {
    if (selectedGoals.includes(goal)) {
      setSelectedGoals(selectedGoals.filter((g) => g !== goal));
    } else if (selectedGoals.length < 3) {
      setSelectedGoals([...selectedGoals, goal]);
    }
  };

  const handleNext = () => {
    if (selectedGoals.length > 0) {
      localStorage.setItem("selectedGoals", JSON.stringify(selectedGoals));
      router.push("/dashboard");
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
            <h1 className="text-xl font-semibold">
              Wat zou je specifiek willen verbeteren in je leven?
            </h1>
            <p className="text-sm text-muted-foreground">
              Kies maximaal 3
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-6 py-6 pb-32">
        {/* Goals List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-3"
        >
          {availableGoals.map((goal, index) => (
            <motion.button
              key={goal}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.04 }}
              onClick={() => toggleGoal(goal)}
              disabled={
                !selectedGoals.includes(goal) && selectedGoals.length >= 3
              }
              className={`w-full px-4 py-4 rounded-lg text-left font-medium transition-all flex items-center justify-between ${
                selectedGoals.includes(goal)
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted hover:bg-muted/80 disabled:opacity-50 disabled:cursor-not-allowed"
              }`}
            >
              <span className="text-sm">{goal}</span>
              {selectedGoals.includes(goal) && (
                <span className="text-xl">✓</span>
              )}
            </motion.button>
          ))}
        </motion.div>

        {/* Selected Count */}
        <div className="mt-6 text-center text-sm text-muted-foreground">
          {selectedGoals.length} van 3 geselecteerd
        </div>
      </div>

      {/* Bottom Button */}
      <div className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-sm border-t border-border p-6">
        <div className="max-w-2xl mx-auto">
          <button
            onClick={handleNext}
            disabled={selectedGoals.length === 0}
            className={`w-full py-4 rounded-xl font-semibold text-lg transition-all ${
              selectedGoals.length > 0
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
