"use client";

import { motion } from 'framer-motion';
import { Lock, Camera, BookOpen, Cloud, Palette, Users } from 'lucide-react';

const features = [
  {
    icon: Lock,
    title: 'End-to-End Encryption',
    description: 'Your data, your eyes only. Military-grade AES-256 encryption protects every word.',
    gradient: 'from-purple-500 to-indigo-500',
  },
  {
    icon: Camera,
    title: 'Photo Journal',
    description: 'Capture moments with encrypted photos. Images are encrypted before storage.',
    gradient: 'from-blue-500 to-cyan-500',
  },
  {
    icon: BookOpen,
    title: 'Book Reading Mode',
    description: 'Read like a physical diary with beautiful page-flip animations and vintage styling.',
    gradient: 'from-amber-500 to-orange-500',
  },
  {
    icon: Cloud,
    title: 'Works Offline',
    description: 'No cloud, no tracking, no internet required. Your data never leaves your device.',
    gradient: 'from-green-500 to-emerald-500',
  },
  {
    icon: Palette,
    title: 'Beautiful Themes',
    description: 'Customize your experience with multiple themes, fonts, and textures.',
    gradient: 'from-pink-500 to-rose-500',
  },
  {
    icon: Users,
    title: 'Multi-User Support',
    description: 'Up to 5 private journals on the same device. Each user has separate encryption.',
    gradient: 'from-violet-500 to-purple-500',
  },
];

export function FeatureCards() {
  return (
    <div className="py-24 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Powerful Features
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Everything you need for private, secure journaling
          </p>
        </motion.div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              whileHover={{ y: -8, scale: 1.02 }}
              className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all"
            >
              {/* Icon */}
              <div
                className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-6`}
              >
                <feature.icon className="w-7 h-7 text-white" />
              </div>

              {/* Content */}
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
