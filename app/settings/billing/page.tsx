"use client";

import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useTrial } from '@/lib/trial-context';
import { ArrowLeft, CreditCard, Check, X } from 'lucide-react';

export default function BillingSettings() {
  const router = useRouter();
  const { trialStatus, activateSubscription } = useTrial();

  const handleUpgrade = () => {
    router.push('/pricing');
  };

  const handleActivateSubscription = () => {
    activateSubscription();
    alert('Subscription activated! (Demo mode)');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <button
            onClick={() => router.push('/settings')}
            className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Settings
          </button>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Billing & Subscription
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage your subscription and billing preferences
          </p>
        </motion.div>

        {/* Trial Status (if active) */}
        {trialStatus.isActive && !trialStatus.hasSubscription && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-8"
          >
            <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl p-6 text-white shadow-lg">
              <h2 className="text-2xl font-bold mb-2">Free Trial Active</h2>
              <p className="text-white/90 mb-4">
                {trialStatus.daysRemaining} {trialStatus.daysRemaining === 1 ? 'day' : 'days'} remaining
              </p>
              <div className="w-full bg-white/20 rounded-full h-2 mb-4">
                <div
                  className="bg-white h-2 rounded-full transition-all"
                  style={{ width: `${(trialStatus.daysRemaining / 3) * 100}%` }}
                />
              </div>
              <p className="text-sm text-white/80">
                Enjoy all premium features during your trial period
              </p>
            </div>
          </motion.section>
        )}

        {/* Current Plan */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
            <div className="flex items-start gap-4 mb-6">
              <div className="p-3 rounded-lg bg-green-100 dark:bg-green-900">
                <CreditCard className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                  Current Plan
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {trialStatus.hasSubscription ? 'Premium Subscription' : 'Free Trial'}
                </p>
              </div>
            </div>

            {trialStatus.hasSubscription ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                  <div>
                    <p className="font-semibold text-green-900 dark:text-green-100">
                      Premium Monthly
                    </p>
                    <p className="text-sm text-green-700 dark:text-green-300">
                      €4.99/month
                    </p>
                  </div>
                  <Check className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>

                <div className="space-y-2">
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    Premium Features Included:
                  </h3>
                  <ul className="space-y-2">
                    {[
                      'Unlimited journal entries',
                      'Photo uploads & gallery',
                      'Voice-to-text transcription',
                      'Advanced search & filters',
                      'Export & backup options',
                      'Priority support',
                    ].map((feature) => (
                      <li key={feature} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                  <button
                    onClick={() => alert('Subscription management (Demo mode)')}
                    className="w-full px-4 py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                  >
                    Manage Subscription
                  </button>
                  <button
                    onClick={() => {
                      if (confirm('Are you sure you want to cancel your subscription?')) {
                        alert('Subscription cancelled (Demo mode)');
                      }
                    }}
                    className="w-full mt-3 px-4 py-3 bg-red-600 hover:bg-red-500 text-white rounded-lg transition-colors"
                  >
                    Cancel Subscription
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                  <p className="text-sm text-blue-800 dark:text-blue-200">
                    You're currently on the free trial. Upgrade to Premium to continue enjoying all features after your trial ends.
                  </p>
                </div>

                <button
                  onClick={handleUpgrade}
                  className="w-full px-6 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white rounded-lg transition-all font-semibold text-lg shadow-lg"
                >
                  Upgrade to Premium - €4.99/month
                </button>

                {/* Demo: Activate Subscription Button */}
                <button
                  onClick={handleActivateSubscription}
                  className="w-full px-4 py-3 bg-green-600 hover:bg-green-500 text-white rounded-lg transition-colors text-sm"
                >
                  🎭 Demo: Activate Subscription
                </button>
              </div>
            )}
          </div>
        </motion.section>

        {/* Payment Method (if subscribed) */}
        {trialStatus.hasSubscription && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-8"
          >
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Payment Method
              </h2>
              <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <CreditCard className="w-8 h-8 text-gray-400" />
                <div className="flex-1">
                  <p className="font-medium text-gray-900 dark:text-white">
                    •••• •••• •••• 4242
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Expires 12/2025
                  </p>
                </div>
              </div>
              <button
                onClick={() => alert('Update payment method (Demo mode)')}
                className="mt-4 w-full px-4 py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                Update Payment Method
              </button>
            </div>
          </motion.section>
        )}

        {/* Billing History */}
        {trialStatus.hasSubscription && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Billing History
              </h2>
              <div className="space-y-3">
                {[
                  { date: 'Feb 1, 2024', amount: '€4.99', status: 'Paid' },
                  { date: 'Jan 1, 2024', amount: '€4.99', status: 'Paid' },
                  { date: 'Dec 1, 2023', amount: '€4.99', status: 'Paid' },
                ].map((invoice, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
                  >
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {invoice.date}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Monthly subscription
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {invoice.amount}
                      </p>
                      <p className="text-sm text-green-600 dark:text-green-400">
                        {invoice.status}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.section>
        )}
      </div>
    </div>
  );
}
