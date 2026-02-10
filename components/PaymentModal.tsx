"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, CreditCard, Check } from "lucide-react";

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function PaymentModal({ isOpen, onClose, onSuccess }: PaymentModalProps) {
  const handlePayment = () => {
    // Placeholder for payment integration (Stripe/Paddle)
    alert(
      "Payment integration placeholder!\n\nIn production, this would:\n1. Open Stripe/Paddle checkout\n2. Process payment\n3. Activate subscription\n\nFor demo purposes, clicking OK will activate your subscription."
    );
    
    if (onSuccess) {
      onSuccess();
    }
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
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
