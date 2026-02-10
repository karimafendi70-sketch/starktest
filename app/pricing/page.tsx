"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Check, Crown, ArrowLeft } from "lucide-react";
import { useTrial } from "@/lib/trial-context";
import { PaymentModal } from "@/components/PaymentModal";

export default function PricingPage() {
  const router = useRouter();
  const { trialStatus, activateSubscription } = useTrial();
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const handleStartTrial = () => {
    // Trial auto-starts on first visit, just navigate to journal
    router.push("/journal");
  };

  const handleUpgrade = () => {
    setShowPaymentModal(true);
  };

  const handlePaymentSuccess = () => {
    activateSubscription();
    router.push("/journal");
  };

  const features = [
    "Unlimited journal entries",
    "Beautiful book reading mode with page flip animations",
    "Quick notes mode (unencrypted)",
    "Private diary mode with AES-256 encryption",
    "Mood tracking and tags",
    "Search and filter entries",
    "Calendar view",
    "Export and backup features",
    "Dark mode support",
    "Completely offline - no cloud sync",
    "Your data never leaves your device",
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700">
      {/* Header */}
      <header className="p-6">
        <button
          onClick={() => router.push("/")}
          className="flex items-center gap-2 text-white hover:text-white/80 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Home
        </button>
      </header>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 pb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <Crown className="w-16 h-16 mx-auto mb-4 text-yellow-300" />
          <h1 className="text-5xl font-bold text-white mb-4">
            Simple, Transparent Pricing
          </h1>
          <p className="text-xl text-white/80">
            Start with a 3-day free trial. No credit card required.
          </p>
        </motion.div>

        {/* Pricing Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white rounded-2xl shadow-2xl overflow-hidden"
        >
          <div className="p-8 md:p-12">
            {/* Free Trial Section */}
            {!trialStatus.hasSubscription && !trialStatus.isExpired && (
              <div className="mb-8 p-6 bg-gradient-to-r from-purple-100 to-blue-100 rounded-xl">
                <div className="flex items-center gap-3 mb-3">
                  <Crown className="w-6 h-6 text-purple-600" />
                  <h3 className="text-2xl font-bold text-gray-900">
                    Free Trial - 3 Days
                  </h3>
                </div>
                <p className="text-gray-700 mb-4">
                  Get full access to all features for 3 days. No credit card required.
                </p>
                {!trialStatus.startDate ? (
                  <button
                    onClick={handleStartTrial}
                    className="w-full py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-semibold text-lg hover:from-purple-700 hover:to-blue-700 transition-all"
                  >
                    Start Free Trial
                  </button>
                ) : (
                  <div className="text-center py-2">
                    <p className="text-gray-600">
                      Trial active: <strong>{trialStatus.daysRemaining} days remaining</strong>
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Premium Plan */}
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Premium Plan</h2>
              <div className="flex items-baseline justify-center gap-2">
                <span className="text-5xl font-bold text-gray-900">€4.99</span>
                <span className="text-2xl text-gray-600">/month</span>
              </div>
              <p className="text-gray-600 mt-2">or €29.99/year (save 50%)</p>
            </div>

            {/* Features List */}
            <div className="mb-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Everything you need:
              </h3>
              <div className="grid md:grid-cols-2 gap-3">
                {features.map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: 0.3 + index * 0.05 }}
                    className="flex items-start gap-3"
                  >
                    <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">{feature}</span>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* CTA Button */}
            {trialStatus.hasSubscription ? (
              <div className="text-center py-6 bg-green-50 rounded-xl">
                <Check className="w-12 h-12 mx-auto mb-3 text-green-600" />
                <p className="text-xl font-bold text-green-900">
                  You're subscribed! 🎉
                </p>
                <p className="text-green-700 mt-2">
                  Enjoy unlimited access to all features
                </p>
                <button
                  onClick={() => router.push("/journal")}
                  className="mt-4 px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  Go to Journal
                </button>
              </div>
            ) : (
              <button
                onClick={handleUpgrade}
                className="w-full py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-semibold text-lg hover:from-purple-700 hover:to-blue-700 transition-all shadow-lg"
              >
                {trialStatus.isExpired ? "Subscribe Now" : "Upgrade to Premium"}
              </button>
            )}

            {/* Trust Signals */}
            <div className="mt-8 text-center space-y-2">
              <p className="text-sm text-gray-600">
                🔒 Secure payment powered by Stripe
              </p>
              <p className="text-sm text-gray-600">
                ✅ Cancel anytime, no questions asked
              </p>
              <p className="text-sm text-gray-600">
                💯 30-day money-back guarantee
              </p>
            </div>
          </div>
        </motion.div>

        {/* FAQ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-12 text-white"
        >
          <h2 className="text-2xl font-bold mb-6 text-center">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
              <h3 className="font-bold mb-2">Is my data safe?</h3>
              <p className="text-white/80">
                Absolutely! All diary entries are encrypted with AES-256 encryption and stored
                locally on your device. We never see or have access to your data.
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
              <h3 className="font-bold mb-2">Can I cancel anytime?</h3>
              <p className="text-white/80">
                Yes! You can cancel your subscription at any time. No questions asked, no hidden fees.
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
              <h3 className="font-bold mb-2">What happens after the trial?</h3>
              <p className="text-white/80">
                After your 3-day trial ends, you'll need to subscribe to continue using the app.
                Your data will remain safe and accessible once you subscribe.
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Payment Modal */}
      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        onSuccess={handlePaymentSuccess}
      />
    </div>
  );
}
