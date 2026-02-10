"use client";

import { useTrial } from "@/lib/trial-context";
import { motion } from "framer-motion";
import { Clock, Crown } from "lucide-react";
import Link from "next/link";

export function TrialBanner() {
  const { trialStatus } = useTrial();

  // Don't show banner if user has subscription
  if (trialStatus.hasSubscription) {
    return null;
  }

  // Don't show banner if trial is not started yet
  if (!trialStatus.startDate) {
    return null;
  }

  // Show expired message
  if (trialStatus.isExpired) {
    return (
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-destructive text-destructive-foreground px-4 py-3 text-center text-sm font-medium"
      >
        <div className="flex items-center justify-center gap-2">
          <Clock className="w-4 h-4" />
          <span>Your free trial has expired.</span>
          <Link
            href="/pricing"
            className="underline hover:no-underline ml-2 font-bold"
          >
            Upgrade Now
          </Link>
        </div>
      </motion.div>
    );
  }

  // Show trial countdown
  const getDaysText = (days: number) => {
    if (days === 0) return "Less than 1 day";
    if (days === 1) return "1 day";
    return `${days} days`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-3 text-center text-sm font-medium"
    >
      <div className="flex items-center justify-center gap-2">
        <Crown className="w-4 h-4" />
        <span>
          Free trial: <strong>{getDaysText(trialStatus.daysRemaining)}</strong> remaining
        </span>
        <Link
          href="/pricing"
          className="underline hover:no-underline ml-2 font-bold"
        >
          See Plans
        </Link>
      </div>
    </motion.div>
  );
}
