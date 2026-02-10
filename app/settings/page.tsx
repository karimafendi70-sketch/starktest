"use client";

import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  Palette, 
  Shield, 
  CreditCard, 
  User, 
  ChevronRight,
  Lock,
  Bell,
  Globe
} from 'lucide-react';

export default function SettingsPage() {
  const router = useRouter();

  const settingsCategories = [
    {
      icon: <Palette className="w-6 h-6" />,
      title: 'Appearance',
      description: 'Themes, textures, and typography',
      href: '/settings/appearance',
      color: 'from-purple-500 to-pink-500',
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: 'Security & Privacy',
      description: 'Security questions, biometric, guest mode',
      href: '/settings/security',
      color: 'from-blue-500 to-cyan-500',
    },
    {
      icon: <CreditCard className="w-6 h-6" />,
      title: 'Billing & Subscription',
      description: 'Manage your subscription and payments',
      href: '/settings/billing',
      color: 'from-green-500 to-emerald-500',
    },
    {
      icon: <User className="w-6 h-6" />,
      title: 'Account',
      description: 'Profile, password, and account management',
      href: '/settings/account',
      color: 'from-orange-500 to-red-500',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Settings
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage your account preferences and settings
          </p>
        </motion.div>

        {/* Settings Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {settingsCategories.map((category, index) => (
            <motion.button
              key={category.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => router.push(category.href)}
              className="group relative bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm hover:shadow-md transition-all text-left overflow-hidden"
            >
              {/* Gradient background */}
              <div 
                className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-0 group-hover:opacity-5 transition-opacity`}
              />

              <div className="relative z-10">
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 rounded-lg bg-gradient-to-br ${category.color}`}>
                    <div className="text-white">
                      {category.icon}
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors" />
                </div>

                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  {category.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {category.description}
                </p>
              </div>
            </motion.button>
          ))}
        </div>

        {/* Quick Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-12 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-6"
        >
          <div className="flex items-start gap-3">
            <Lock className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
            <div>
              <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-1">
                Your data is secure
              </h4>
              <p className="text-sm text-blue-800 dark:text-blue-200">
                All journal entries are encrypted with AES-256 encryption and stored locally on your device. 
                Your privacy is our top priority.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
