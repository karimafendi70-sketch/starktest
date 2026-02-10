"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { FileText, Lock } from "lucide-react";

export default function WelcomePage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700 flex flex-col items-center justify-center p-6 text-white">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-12"
      >
        {/* Logo */}
        <div className="mb-8 flex justify-center">
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
        <h1 className="text-5xl font-bold mb-4">Your Private, Encrypted Journal</h1>
        <p className="text-xl text-white/90 mb-6">Write freely. Stay private. Always encrypted.</p>
        
        {/* Multi-User Feature Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium mb-8">
          <span>✨</span>
          <span>Up to 5 Users • AES-256 Encryption • Offline First</span>
        </div>
      </motion.div>

      {/* Go to Encrypted Diary Section */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="w-full max-w-2xl mb-12"
      >
        <div className="bg-white/10 backdrop-blur-md border-2 border-white/30 rounded-2xl p-8 text-center">
          <div className="mb-6">
            <Lock className="w-16 h-16 mx-auto mb-4 text-white" />
            <h2 className="text-3xl font-bold mb-3">🔐 Access Your Encrypted Diary</h2>
            <p className="text-white/80 text-lg">
              Your private space with military-grade encryption
            </p>
          </div>
          
          <button
            onClick={() => router.push("/users")}
            className="inline-flex items-center gap-3 px-8 py-4 bg-white text-purple-600 rounded-xl font-bold text-lg hover:bg-white/90 transition-all transform hover:scale-105"
          >
            Enter Your Private Space
            <span className="text-2xl">→</span>
          </button>
          
          <p className="mt-4 text-sm text-white/60">
            Support for up to 5 different users on this device
          </p>
        </div>
      </motion.div>

      {/* Dual Mode Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        {/* Notes Mode */}
        <motion.button
          onClick={() => router.push("/notes")}
          whileHover={{ scale: 1.02, y: -5 }}
          whileTap={{ scale: 0.98 }}
          className="bg-white/10 backdrop-blur-md border-2 border-white/30 rounded-2xl p-8 text-center hover:bg-white/20 transition-all group"
        >
          <div className="mb-6 flex justify-center">
            <div className="w-16 h-16 bg-blue-500/30 rounded-xl flex items-center justify-center group-hover:bg-blue-500/40 transition-colors">
              <FileText className="w-8 h-8 text-white" />
            </div>
          </div>
          <h2 className="text-3xl font-bold mb-3">📝 Quick Notes</h2>
          <p className="text-white/80 mb-2">Simple & Fast</p>
          <p className="text-sm text-white/60 mb-6">
            Take quick notes without any password. Perfect for everyday thoughts and ideas.
          </p>
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-white/20 rounded-lg font-semibold group-hover:bg-white/30 transition-colors">
            Start Taking Notes →
          </div>
        </motion.button>

        {/* Diary Mode - Alternative Access */}
        <motion.button
          onClick={() => router.push("/journal")}
          whileHover={{ scale: 1.02, y: -5 }}
          whileTap={{ scale: 0.98 }}
          className="bg-white/10 backdrop-blur-md border-2 border-white/30 rounded-2xl p-8 text-center hover:bg-white/20 transition-all group"
        >
          <div className="mb-6 flex justify-center">
            <div className="w-16 h-16 bg-purple-500/30 rounded-xl flex items-center justify-center group-hover:bg-purple-500/40 transition-colors">
              <Lock className="w-8 h-8 text-white" />
            </div>
          </div>
          <h2 className="text-3xl font-bold mb-3">🔐 Legacy Diary</h2>
          <p className="text-white/80 mb-2">Single-User Mode</p>
          <p className="text-sm text-white/60 mb-6">
            Original password-protected journal. Use the button above for multi-user access.
          </p>
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-white/20 rounded-lg font-semibold group-hover:bg-white/30 transition-colors">
            Open Legacy Diary →
          </div>
        </motion.button>
      </motion.div>

      {/* Features Footer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="mt-12 text-center text-white/60 text-sm space-y-2"
      >
        <p>✨ Beautiful book reading mode • 🌙 Dark mode • 🏷️ Tags & moods</p>
        <p>📊 Statistics • 💾 Export & backup • 🔒 Completely offline</p>
      </motion.div>
    </div>
  );
}
