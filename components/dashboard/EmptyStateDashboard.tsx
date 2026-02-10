"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { BookOpen, Camera, Mic, Tag, Lock, TrendingUp } from "lucide-react";

interface EmptyStateDashboardProps {
  user: {
    username: string;
  };
}

export function EmptyStateDashboard({ user }: EmptyStateDashboardProps) {
  const router = useRouter();

  const quickStartSteps = [
    {
      number: "1️⃣",
      title: "Write your thoughts",
      description: "Express yourself freely in your encrypted journal",
      icon: <BookOpen className="w-6 h-6" />,
    },
    {
      number: "2️⃣",
      title: "Add photos & voice",
      description: "Capture moments with photos and voice notes",
      icon: <Camera className="w-6 h-6" />,
    },
    {
      number: "3️⃣",
      title: "Keep your streak",
      description: "Build a daily writing habit and track your progress",
      icon: <TrendingUp className="w-6 h-6" />,
    },
  ];

  const proTips = [
    {
      icon: <Mic className="w-5 h-5" />,
      text: "Use voice-to-text for quick entries",
    },
    {
      icon: <BookOpen className="w-5 h-5" />,
      text: "Try book mode for a distraction-free reading experience",
    },
    {
      icon: <Tag className="w-5 h-5" />,
      text: "Organize entries with tags and moods",
    },
    {
      icon: <Lock className="w-5 h-5" />,
      text: "Everything is encrypted with AES-256",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Welcome Message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-bold mb-4">
            Welcome, {user.username}! 👋
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Your private journal is ready. Let's get started!
          </p>

          {/* Big CTA */}
          <motion.button
            onClick={() => router.push("/journal/new")}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-br from-purple-600 to-blue-600 text-white rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all"
          >
            <span className="text-2xl">✍️</span>
            Write Your First Entry
          </motion.button>
        </motion.div>

        {/* Quick Start Guide */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-12"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Quick Start Guide
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {quickStartSteps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + index * 0.1 }}
                className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow"
              >
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white mb-4">
                  {step.icon}
                </div>
                <div className="text-3xl mb-2">{step.number}</div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  {step.title}
                </h3>
                <p className="text-gray-600 text-sm">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Pro Tips */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-xl p-8 shadow-md"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            💡 Pro Tips
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {proTips.map((tip, index) => (
              <div key={index} className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center text-purple-600 flex-shrink-0">
                  {tip.icon}
                </div>
                <p className="text-gray-700 pt-2">{tip.text}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
