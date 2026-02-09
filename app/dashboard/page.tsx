"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Home, TrendingUp, BookOpen, Settings } from "lucide-react";

export default function DashboardPage() {
  const [sobrietyStart] = useState(new Date());
  const [timeDiff, setTimeDiff] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [selectedHabits, setSelectedHabits] = useState<string[]>([]);
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);

  useEffect(() => {
    // Load data from localStorage
    const habits = localStorage.getItem("selectedHabits");
    const goals = localStorage.getItem("selectedGoals");
    
    if (habits) setSelectedHabits(JSON.parse(habits));
    if (goals) setSelectedGoals(JSON.parse(goals));

    // Update timer every second
    const interval = setInterval(() => {
      const now = new Date();
      const diff = now.getTime() - sobrietyStart.getTime();
      
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      
      setTimeDiff({ days, hours, minutes, seconds });
    }, 1000);

    return () => clearInterval(interval);
  }, [sobrietyStart]);

  return (
    <div className="min-h-screen bg-background text-foreground pb-20">
      {/* Header */}
      <div className="bg-gradient-to-br from-purple-600 to-pink-600 text-white px-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl font-bold mb-2">thequiet</h1>
          <p className="text-white/90">Welkom terug!</p>
        </motion.div>
      </div>

      {/* Main Content */}
      <div className="max-w-2xl mx-auto px-6 py-6 space-y-6">
        {/* Sobriety Counter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-card border border-border rounded-2xl p-6 shadow-lg"
        >
          <h2 className="text-xl font-semibold mb-6 text-center">
            Nuchter sinds
          </h2>
          
          <div className="grid grid-cols-4 gap-4 mb-6">
            <div className="text-center">
              <motion.div
                key={timeDiff.days}
                initial={{ scale: 1.2 }}
                animate={{ scale: 1 }}
                className="text-4xl font-bold text-primary"
              >
                {timeDiff.days}
              </motion.div>
              <div className="text-sm text-muted-foreground mt-1">Dagen</div>
            </div>
            <div className="text-center">
              <motion.div
                key={timeDiff.hours}
                initial={{ scale: 1.2 }}
                animate={{ scale: 1 }}
                className="text-4xl font-bold text-primary"
              >
                {timeDiff.hours}
              </motion.div>
              <div className="text-sm text-muted-foreground mt-1">Uren</div>
            </div>
            <div className="text-center">
              <motion.div
                key={timeDiff.minutes}
                initial={{ scale: 1.2 }}
                animate={{ scale: 1 }}
                className="text-4xl font-bold text-primary"
              >
                {timeDiff.minutes}
              </motion.div>
              <div className="text-sm text-muted-foreground mt-1">Minuten</div>
            </div>
            <div className="text-center">
              <motion.div
                key={timeDiff.seconds}
                initial={{ scale: 1.2 }}
                animate={{ scale: 1 }}
                className="text-4xl font-bold text-primary"
              >
                {timeDiff.seconds}
              </motion.div>
              <div className="text-sm text-muted-foreground mt-1">Seconden</div>
            </div>
          </div>

          {selectedHabits.length > 0 && (
            <div className="text-center text-muted-foreground text-sm">
              Vrij van: {selectedHabits.join(", ")}
            </div>
          )}
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-2 gap-4"
        >
          <div className="bg-card border border-border rounded-xl p-4">
            <div className="text-2xl font-bold text-green-500">€0</div>
            <div className="text-sm text-muted-foreground">Geld bespaard</div>
          </div>
          <div className="bg-card border border-border rounded-xl p-4">
            <div className="text-2xl font-bold text-blue-500">
              {timeDiff.hours + timeDiff.days * 24}u
            </div>
            <div className="text-sm text-muted-foreground">Tijd teruggewonnen</div>
          </div>
        </motion.div>

        {/* Goals */}
        {selectedGoals.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-card border border-border rounded-xl p-6"
          >
            <h3 className="font-semibold mb-4">Jouw doelen</h3>
            <ul className="space-y-2">
              {selectedGoals.map((goal, index) => (
                <li
                  key={index}
                  className="flex items-start gap-2 text-sm"
                >
                  <span className="text-primary mt-1">✓</span>
                  <span className="text-muted-foreground">{goal}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        )}

        {/* Daily Check-in Button */}
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="w-full bg-primary text-primary-foreground py-4 rounded-xl font-semibold hover:bg-primary/90 transition-colors"
        >
          Dagelijkse check-in
        </motion.button>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-sm border-t border-border">
        <div className="max-w-2xl mx-auto flex justify-around py-3">
          <button className="flex flex-col items-center gap-1 text-primary">
            <Home className="w-6 h-6" />
            <span className="text-xs font-medium">Home</span>
          </button>
          <button className="flex flex-col items-center gap-1 text-muted-foreground hover:text-foreground transition-colors">
            <TrendingUp className="w-6 h-6" />
            <span className="text-xs">Voortgang</span>
          </button>
          <button className="flex flex-col items-center gap-1 text-muted-foreground hover:text-foreground transition-colors">
            <BookOpen className="w-6 h-6" />
            <span className="text-xs">Dagboek</span>
          </button>
          <button className="flex flex-col items-center gap-1 text-muted-foreground hover:text-foreground transition-colors">
            <Settings className="w-6 h-6" />
            <span className="text-xs">Instellingen</span>
          </button>
        </div>
      </div>
    </div>
  );
}
