"use client";

import { useState, ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, X } from "lucide-react";

export type ConfirmationType = 'simple' | 'password' | 'text-input';
export type DangerLevel = 'low' | 'medium' | 'high';

interface ConfirmDialogProps {
  isOpen: boolean;
  type: ConfirmationType;
  title: string;
  message: string | ReactNode;
  dangerLevel?: DangerLevel;
  confirmText?: string;
  cancelText?: string;
  requirePassword?: boolean;
  requireTextMatch?: string;
  onConfirm: (password?: string) => void;
  onCancel: () => void;
}

export function ConfirmDialog({
  isOpen,
  type,
  title,
  message,
  dangerLevel = 'medium',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  requirePassword,
  requireTextMatch,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const [inputValue, setInputValue] = useState('');
  const [error, setError] = useState('');

  const handleConfirm = () => {
    setError('');

    // Validate based on type
    if (type === 'password' && requirePassword) {
      if (!inputValue.trim()) {
        setError('Password is required');
        return;
      }
      onConfirm(inputValue);
    } else if (type === 'text-input' && requireTextMatch) {
      if (inputValue.toLowerCase() !== requireTextMatch.toLowerCase()) {
        setError(`Please type "${requireTextMatch}" to confirm`);
        return;
      }
      onConfirm();
    } else {
      onConfirm();
    }

    setInputValue('');
  };

  const handleCancel = () => {
    setInputValue('');
    setError('');
    onCancel();
  };

  const getDangerColor = () => {
    switch (dangerLevel) {
      case 'low':
        return 'bg-blue-600 hover:bg-blue-500';
      case 'medium':
        return 'bg-yellow-600 hover:bg-yellow-500';
      case 'high':
        return 'bg-red-600 hover:bg-red-500';
      default:
        return 'bg-gray-600 hover:bg-gray-500';
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
        onClick={handleCancel}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="relative w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className={`
            p-6 
            ${dangerLevel === 'high' ? 'bg-red-50 dark:bg-red-900/20' : 
              dangerLevel === 'medium' ? 'bg-yellow-50 dark:bg-yellow-900/20' : 
              'bg-blue-50 dark:bg-blue-900/20'}
          `}>
            <div className="flex items-start gap-3">
              <AlertTriangle className={`
                w-6 h-6 flex-shrink-0 mt-0.5
                ${dangerLevel === 'high' ? 'text-red-600 dark:text-red-400' : 
                  dangerLevel === 'medium' ? 'text-yellow-600 dark:text-yellow-400' : 
                  'text-blue-600 dark:text-blue-400'}
              `} />
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {title}
                </h3>
              </div>
              <button
                onClick={handleCancel}
                className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 space-y-4">
            <div className="text-gray-700 dark:text-gray-300">
              {typeof message === 'string' ? <p>{message}</p> : message}
            </div>

            {/* Password Input */}
            {type === 'password' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Enter your password to confirm
                </label>
                <input
                  type="password"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleConfirm()}
                  placeholder="Password"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  autoFocus
                />
              </div>
            )}

            {/* Text Input */}
            {type === 'text-input' && requireTextMatch && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Type <span className="font-bold text-red-600">"{requireTextMatch}"</span> to confirm
                </label>
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleConfirm()}
                  placeholder={requireTextMatch}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  autoFocus
                />
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 p-6 bg-gray-50 dark:bg-gray-900">
            <button
              onClick={handleCancel}
              className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              {cancelText}
            </button>
            <button
              onClick={handleConfirm}
              className={`px-4 py-2 text-white rounded-lg transition-colors ${getDangerColor()}`}
            >
              {confirmText}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
