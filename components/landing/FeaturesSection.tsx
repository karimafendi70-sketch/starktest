"use client";

import { motion } from "framer-motion";
import { Lock, Camera, BookOpen, Mic, BarChart, Tag, Zap, Cloud } from "lucide-react";

export function FeaturesSection() {
  const mainFeatures = [
    {
      icon: <Lock className="w-8 h-8" />,
      title: "Truly Private",
      description: "AES-256 encryption keeps your thoughts secure. Everything stays on your device.",
    },
    {
      icon: <Camera className="w-8 h-8" />,
      title: "Photo Journaling",
      description: "Capture moments with photos and voice notes. Rich multimedia entries.",
    },
    {
      icon: <BookOpen className="w-8 h-8" />,
      title: "Beautiful Reading",
      description: "Immersive book mode for distraction-free reading and writing.",
    },
  ];

  const additionalFeatures = [
    { icon: <Mic className="w-5 h-5" />, text: "Voice-to-text" },
    { icon: <BarChart className="w-5 h-5" />, text: "Writing stats" },
    { icon: <Zap className="w-5 h-5" />, text: "Streak tracking" },
    { icon: <Tag className="w-5 h-5" />, text: "Tags & moods" },
    { icon: <Cloud className="w-5 h-5" />, text: "Optional sync" },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container-responsive">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Everything You Need
          </h2>
          <p className="text-xl text-gray-600">
            A complete journaling experience, beautifully designed
          </p>
        </motion.div>

        {/* Main Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {mainFeatures.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-all border border-gray-100"
            >
              <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white mb-6">
                {feature.icon}
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Showcase Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-gray-50 rounded-2xl p-12"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Screenshot/GIF Placeholder */}
            <div className="rounded-xl overflow-hidden shadow-xl">
              <div className="aspect-video bg-gradient-to-br from-purple-100 to-blue-100 flex items-center justify-center">
                <div className="text-center text-gray-600">
                  <div className="text-6xl mb-4">📖</div>
                  <p className="text-lg font-semibold">Book Mode</p>
                </div>
              </div>
            </div>

            {/* Feature List */}
            <div>
              <h3 className="text-3xl font-bold text-gray-900 mb-6">
                Powerful Features
              </h3>
              <div className="space-y-4">
                {additionalFeatures.map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center gap-4"
                  >
                    <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center text-purple-600">
                      {feature.icon}
                    </div>
                    <span className="text-lg text-gray-700">{feature.text}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
