"use client";

import { motion } from 'framer-motion';
import { Lock, Key, Shield, CheckCircle } from 'lucide-react';

export function EncryptionExplainer() {
  const steps = [
    {
      icon: Key,
      title: 'Your Password',
      description: 'Creates unique encryption key',
    },
    {
      icon: Lock,
      title: 'AES-256 Encryption',
      description: 'Military-grade encryption',
    },
    {
      icon: Shield,
      title: 'Local Storage',
      description: 'Encrypted data on your device',
    },
    {
      icon: CheckCircle,
      title: 'Complete Privacy',
      description: 'Only you can decrypt',
    },
  ];

  return (
    <div className="py-24 bg-white dark:bg-gray-800">
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
            Why Encryption Matters
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Your thoughts deserve the highest level of protection
          </p>
        </motion.div>

        {/* Encryption Flow */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-16">
          {steps.map((step, index) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15, duration: 0.5 }}
              className="relative"
            >
              {/* Connection Line */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-12 left-full w-full h-0.5 bg-gradient-to-r from-purple-500 to-blue-500" />
              )}

              {/* Step */}
              <div className="relative bg-gray-50 dark:bg-gray-700 rounded-xl p-6 text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
                  <step.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-bold text-gray-900 dark:text-white mb-2">
                  {step.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center"
        >
          <div className="p-6">
            <div className="text-4xl font-bold text-purple-600 dark:text-purple-400 mb-2">
              256-bit
            </div>
            <p className="text-gray-600 dark:text-gray-400">
              Military-grade encryption standard
            </p>
          </div>
          <div className="p-6">
            <div className="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2">
              0%
            </div>
            <p className="text-gray-600 dark:text-gray-400">
              Data sent to cloud or servers
            </p>
          </div>
          <div className="p-6">
            <div className="text-4xl font-bold text-green-600 dark:text-green-400 mb-2">
              100%
            </div>
            <p className="text-gray-600 dark:text-gray-400">
              Private and secure on your device
            </p>
          </div>
        </motion.div>

        {/* Trust Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="mt-12 text-center"
        >
          <div className="inline-flex items-center gap-3 px-6 py-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-full">
            <Shield className="w-5 h-5 text-green-600 dark:text-green-400" />
            <span className="font-medium text-green-900 dark:text-green-100">
              Used by privacy-conscious individuals worldwide
            </span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
