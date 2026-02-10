"use client";

import { motion } from 'framer-motion';
import { Quote } from 'lucide-react';

const testimonials = [
  {
    quote: "Finally, a journal that truly respects my privacy. No cloud sync means my thoughts stay mine.",
    author: "Sarah K.",
    role: "Privacy Advocate",
    avatar: "💜",
  },
  {
    quote: "The encryption gives me peace of mind. I can write anything without worrying about data breaches.",
    author: "Michael R.",
    role: "Security Professional",
    avatar: "🔐",
  },
  {
    quote: "Book reading mode is gorgeous! It feels like writing in a real diary but with digital convenience.",
    author: "Emma L.",
    role: "Daily Journaler",
    avatar: "📖",
  },
];

export function Testimonials() {
  return (
    <div className="py-24 bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
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
            Loved by Journalers
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            See what people are saying about their experience
          </p>
        </motion.div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.author}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15, duration: 0.5 }}
              whileHover={{ y: -8 }}
              className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg relative"
            >
              {/* Quote Icon */}
              <Quote className="w-10 h-10 text-purple-200 dark:text-purple-900 mb-4" />

              {/* Quote */}
              <p className="text-gray-700 dark:text-gray-300 text-lg mb-6 italic">
                "{testimonial.quote}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-2xl">
                  {testimonial.avatar}
                </div>
                <div>
                  <div className="font-bold text-gray-900 dark:text-white">
                    {testimonial.author}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {testimonial.role}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Additional Quote */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="mt-16 text-center"
        >
          <p className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-gray-200 italic max-w-4xl mx-auto">
            "Journaling isn't just about recording events; it's about understanding yourself. 
            This app makes that journey both beautiful and secure."
          </p>
          <p className="mt-4 text-gray-600 dark:text-gray-400">
            — The Benefits of Private Journaling
          </p>
        </motion.div>
      </div>
    </div>
  );
}
