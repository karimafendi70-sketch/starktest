"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function WelcomePage() {
  const router = useRouter();

  return (
    <div className="min-h-screen gradient-welcome flex flex-col items-center justify-between p-6 text-white">
      <div className="flex-1 flex flex-col items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          {/* Logo */}
          <div className="mb-12 flex justify-center">
            <div className="space-y-2">
              <div className="w-16 h-3 bg-white/90 rounded-full mx-auto"></div>
              <div className="w-20 h-3 bg-white/80 rounded-full mx-auto"></div>
              <div className="w-24 h-3 bg-white/70 rounded-full mx-auto"></div>
            </div>
          </div>

          {/* App Name */}
          <h1 className="text-5xl font-bold mb-4 animate-float">thequiet</h1>
          <p className="text-xl text-white/90 mb-2">Sobriety & Habit Tracker</p>
          <p className="text-sm text-white/70 max-w-md mx-auto">
            Begin je reis naar een gezonder en gelukkiger leven
          </p>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="w-full max-w-md space-y-4"
      >
        {/* Get Started Button */}
        <button
          onClick={() => router.push("/onboarding/habits")}
          className="w-full bg-white text-purple-600 py-4 rounded-xl font-semibold text-lg hover:bg-white/90 transition-colors shadow-lg"
        >
          Aan de slag
        </button>

        {/* Login Button */}
        <button
          onClick={() => router.push("/login")}
          className="w-full bg-white/20 backdrop-blur-sm text-white py-4 rounded-xl font-semibold text-lg hover:bg-white/30 transition-colors border border-white/30"
        >
          Inloggen
        </button>

        {/* Restore Data Link */}
        <button
          onClick={() => router.push("/restore")}
          className="w-full text-white/80 py-2 text-sm hover:text-white transition-colors"
        >
          Terugkerende gebruiker met gegevens om te herstellen?
        </button>
      </motion.div>
    </div>
  );
}
