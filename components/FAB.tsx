"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { Plus, FileText, Camera, Mic, Calendar } from "lucide-react";

export function FAB() {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const actions = [
    {
      icon: <FileText className="w-5 h-5" />,
      label: "New Entry",
      onClick: () => {
        router.push("/journal/new");
        setIsOpen(false);
      },
    },
    {
      icon: <Camera className="w-5 h-5" />,
      label: "Quick Photo",
      onClick: () => {
        router.push("/gallery");
        setIsOpen(false);
      },
    },
    {
      icon: <Mic className="w-5 h-5" />,
      label: "Voice Note",
      onClick: () => {
        router.push("/journal/new?voice=true");
        setIsOpen(false);
      },
    },
    {
      icon: <Calendar className="w-5 h-5" />,
      label: "View All",
      onClick: () => {
        router.push("/journal");
        setIsOpen(false);
      },
    },
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
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
          />
        )}
      </AnimatePresence>

      {/* Action Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="fixed bottom-24 right-4 md:right-8 z-50 flex flex-col gap-3"
          >
            {actions.map((action, index) => (
              <motion.button
                key={action.label}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: index * 0.05 }}
                onClick={action.onClick}
                className="flex items-center gap-3 bg-white rounded-full px-4 py-3 shadow-lg hover:shadow-xl transition-all group"
              >
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                  {action.icon}
                </div>
                <span className="font-medium text-gray-900 pr-2">{action.label}</span>
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main FAB Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="fixed bottom-6 right-4 md:right-8 z-50 w-14 h-14 md:w-16 md:h-16 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 shadow-xl flex items-center justify-center text-white hover:shadow-2xl transition-shadow"
      >
        <motion.div
          animate={{ rotate: isOpen ? 45 : 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        >
          <Plus className="w-6 h-6 md:w-8 md:h-8" />
        </motion.div>
      </motion.button>
    </>
  );
}
