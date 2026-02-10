"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, CreditCard, Check } from "lucide-react";

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function PaymentModal({ isOpen, onClose, onSuccess }: PaymentModalProps) {
  const [showPlaceholder, setShowPlaceholder] = useState(false);

  const handlePayment = () => {
    // Show placeholder message in modal UI instead of alert
    setShowPlaceholder(true);
  };

  const handleConfirm = () => {
    if (onSuccess) {
      onSuccess();
    }
    setShowPlaceholder(false);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-6"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-card border border-border rounded-xl p-6 w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-foreground">Subscribe Now</h2>
              <button
                onClick={onClose}
                className="p-1 hover:bg-accent rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {showPlaceholder ? (
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                  <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                    Payment Integration Placeholder
                  </h3>
                  <p className="text-sm text-blue-800 dark:text-blue-200 mb-3">
                    In production, this would:
                  </p>
                  <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1 list-disc list-inside">
                    <li>Open Stripe/Paddle checkout</li>
                    <li>Process secure payment</li>
                    <li>Activate subscription</li>
                  </ul>
                  <p className="text-sm text-blue-800 dark:text-blue-200 mt-3">
                    For demo purposes, clicking Confirm will activate your subscription.
                  </p>
                </div>
                <button
                  onClick={handleConfirm}
                  className="w-full px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-semibold"
                >
                  Confirm Demo Activation
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Plan Details */}
                <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg p-6">
                  <h3 className="text-2xl font-bold mb-2">Premium Plan</h3>
                  <div className="flex items-baseline gap-2 mb-4">
                    <span className="text-4xl font-bold">€4.99</span>
                    <span className="text-white/80">/month</span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4" />
                      <span>Unlimited journal entries</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4" />
                      <span>Beautiful book reading mode</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4" />
                      <span>End-to-end encryption</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4" />
                      <span>Export & backup features</span>
                    </div>
                  </div>
                </div>

                {/* Payment Button */}
                <button
                  onClick={handlePayment}
                  className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-semibold text-lg"
                >
                  <CreditCard className="w-5 h-5" />
                  Continue to Payment
                </button>

                {/* Info */}
                <p className="text-xs text-muted-foreground text-center">
                  Secure payment powered by Stripe. Cancel anytime.
                </p>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
