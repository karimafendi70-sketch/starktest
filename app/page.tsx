"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { motion } from "framer-motion";

export default function WelcomePage() {
  const router = useRouter();
  const { isAuthenticated, isSetup } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/journal");
    } else if (isSetup) {
      router.push("/journal/login");
    }
  }, [isAuthenticated, isSetup, router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700 flex flex-col items-center justify-between p-6 text-white">
      <div className="flex-1 flex flex-col items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          {/* Logo */}
          <div className="mb-12 flex justify-center">
            <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-white/30">
              <svg
                className="w-12 h-12 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                />
              </svg>
            </div>
          </div>

          {/* App Name */}
          <h1 className="text-5xl font-bold mb-4">Encrypted Journal</h1>
          <p className="text-xl text-white/90 mb-2">Your Private Digital Diary</p>
          <p className="text-sm text-white/70 max-w-md mx-auto">
            A completely local, encrypted personal journal. Your thoughts stay on your device,
            always private and secure.
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
          onClick={() => router.push("/journal/setup")}
          className="w-full bg-white text-purple-600 py-4 rounded-xl font-semibold text-lg hover:bg-white/90 transition-colors shadow-lg"
        >
          Get Started
        </button>

        {/* Features List */}
        <div className="text-center text-white/60 text-xs space-y-1 pt-4">
          <p>🔒 AES-256 encryption • 📱 Completely offline</p>
          <p>🌙 Dark mode • 🏷️ Tags & moods • 📊 Statistics</p>
        </div>
      </motion.div>
    </div>
  );
}
