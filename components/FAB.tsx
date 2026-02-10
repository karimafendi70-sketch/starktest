'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

export default function FAB() {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  
  const actions = [
    { icon: '📝', label: 'New Entry', href: '/journal/new' },
    { icon: '📸', label: 'Quick Photo', href: '/journal/new?photo=true' },
    { icon: '🎤', label: 'Voice Note', href: '/journal/new?voice=true' },
    { icon: '📅', label: 'View All', href: '/journal' },
  ];
  
  return (
    <>
      {/* Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 z-40"
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>
      
      {/* Menu Items */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed bottom-24 right-6 z-50">
            {actions.map((action, index) => (
              <motion.button
                key={action.label}
                initial={{ opacity: 0, y: 20, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 20, scale: 0.8 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => {
                  router.push(action.href);
                  setIsOpen(false);
                }}
                className="flex items-center gap-3 bg-white shadow-lg rounded-full px-4 py-3 mb-3 hover:scale-105 transition-transform"
              >
                <span className="text-2xl">{action.icon}</span>
                <span className="font-medium whitespace-nowrap pr-2">{action.label}</span>
              </motion.button>
            ))}
          </div>
        )}
      </AnimatePresence>
      
      {/* Main FAB Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-full shadow-2xl flex items-center justify-center z-50 hover:scale-110 transition-transform"
        animate={{ rotate: isOpen ? 45 : 0 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <span className="text-3xl leading-none">+</span>
      </motion.button>
    </>
  );
}
