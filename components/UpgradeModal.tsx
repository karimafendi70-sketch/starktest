"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Crown, Check } from "lucide-react";
import { useRouter } from "next/navigation";

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  daysRemaining?: number;
  isExpired?: boolean;
}

export function UpgradeModal({
  isOpen,
  onClose,
  daysRemaining = 0,
  isExpired = false,
}: UpgradeModalProps) {
  const router = useRouter();

  const handleViewPricing = () => {
    router.push('/pricing');
    onClose();
  };

  const features = [
    'Unlimited journal entries with encryption',
    'Beautiful book reading mode',
    'Photo journal with encrypted storage',
    'Voice-to-text transcription',
    'Advanced search and filters',
    'Calendar heatmap and statistics',
    'Biometric unlock (fingerprint/Face ID)',
    'Guest mode for sharing',
    'Priority support',
    'All future features included',
  ];

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="relative w-full max-w-2xl bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="relative bg-gradient-to-r from-purple-600 to-blue-600 p-8 text-white">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <Crown className="w-12 h-12" />
              <h2 className="text-3xl font-bold">
                {isExpired ? 'Your Trial Has Ended' : `${daysRemaining} ${daysRemaining === 1 ? 'Day' : 'Days'} Left!`}
              </h2>
            </div>

            <p className="text-white/90 text-lg">
              {isExpired
                ? 'Subscribe to continue accessing your encrypted journal'
                : 'Unlock the full potential of your journal with Premium'}
            </p>
          </div>

          {/* Content */}
          <div className="p-8">
            {isExpired && (
              <div className="mb-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                <p className="text-yellow-800 dark:text-yellow-200">
                  <strong>Don't worry!</strong> Your data is safe and encrypted. Subscribe to regain access.
                </p>
              </div>
            )}

            {/* Features */}
            <div className="mb-8">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                What you'll get with Premium:
              </h3>
              <div className="grid md:grid-cols-2 gap-3">
                {features.map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-start gap-3"
                  >
                    <Check className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Pricing */}
            <div className="mb-8 p-6 bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-xl border border-purple-200 dark:border-purple-800">
              <div className="flex items-baseline justify-center gap-2 mb-2">
                <span className="text-4xl font-bold text-gray-900 dark:text-white">€4.99</span>
                <span className="text-xl text-gray-600 dark:text-gray-400">/month</span>
              </div>
              <p className="text-center text-gray-600 dark:text-gray-400">
                or €29.99/year <span className="font-semibold text-green-600 dark:text-green-400">(Save 50%)</span>
              </p>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-3">
              <button
                onClick={handleViewPricing}
                className="w-full py-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-xl font-semibold text-lg transition-all shadow-lg flex items-center justify-center gap-2"
              >
                <Crown className="w-5 h-5" />
                {isExpired ? 'Subscribe Now' : 'Upgrade to Premium'}
              </button>
              
              {!isExpired && (
                <button
                  onClick={onClose}
                  className="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
                >
                  Maybe later
                </button>
              )}
            </div>

            {/* Trust signals */}
            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700 text-center space-y-2">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                🔒 Secure payment • ✅ Cancel anytime • 💯 30-day money-back
              </p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
