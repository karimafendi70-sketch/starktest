"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, Plus, Minus } from "lucide-react";

export default function FrequencyPage() {
  const router = useRouter();
  const [frequency, setFrequency] = useState(0);

  const increment = () => setFrequency(frequency + 1);
  const decrement = () => {
    if (frequency > 0) setFrequency(frequency - 1);
  };

  const handleNext = () => {
    localStorage.setItem("frequency", frequency.toString());
    router.push("/onboarding/goals");
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Header */}
      <div className="sticky top-0 bg-background/95 backdrop-blur-sm border-b border-border z-10">
        <div className="max-w-2xl mx-auto px-6 py-4 flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-muted rounded-lg transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 pb-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-xl"
        >
          <h1 className="text-2xl font-bold mb-4">
            Op de dagen dat u nicotine gebruikte, hoe vaak gebruikte u het?
          </h1>
          <p className="text-muted-foreground mb-12">
            Gemiddeld, voordat je begon met bijhouden
          </p>

          {/* Counter Display */}
          <div className="mb-12">
            <motion.div
              key={frequency}
              initial={{ scale: 1.2, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-6xl font-bold mb-2"
            >
              {frequency}
            </motion.div>
            <div className="text-2xl text-muted-foreground">keer</div>
          </div>

          {/* Counter Buttons */}
          <div className="flex items-center justify-center gap-6">
            <button
              onClick={decrement}
              className="w-16 h-16 rounded-full bg-muted hover:bg-muted/80 flex items-center justify-center transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={frequency === 0}
            >
              <Minus className="w-8 h-8" />
            </button>
            <div className="w-20"></div>
            <button
              onClick={increment}
              className="w-16 h-16 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 flex items-center justify-center transition-all"
            >
              <Plus className="w-8 h-8" />
            </button>
          </div>
        </motion.div>
      </div>

      {/* Bottom Button */}
      <div className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-sm border-t border-border p-6">
        <div className="max-w-2xl mx-auto">
          <button
            onClick={handleNext}
            className="w-full py-4 rounded-xl font-semibold text-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-all"
          >
            Volgende
          </button>
        </div>
      </div>
    </div>
  );
}
