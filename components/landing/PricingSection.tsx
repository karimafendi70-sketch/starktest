"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Check } from "lucide-react";

export function PricingSection() {
  const router = useRouter();

  const features = [
    "Unlimited entries & photos",
    "AES-256 encryption",
    "Voice-to-text",
    "Book reading mode",
    "Statistics & insights",
    "Multi-user support (5 users)",
    "Export & backup",
    "Tag & mood tracking",
    "Offline-first",
    "Regular updates",
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="container-responsive">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-xl text-gray-600">
            Start free, upgrade anytime
          </p>
        </motion.div>

        {/* Pricing Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-lg mx-auto"
        >
          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border-2 border-purple-500">
            {/* Badge */}
            <div className="bg-gradient-to-br from-purple-600 to-blue-600 text-white text-center py-3 font-semibold">
              ⭐ Most Popular
            </div>

            <div className="p-10">
              {/* Pricing */}
              <div className="text-center mb-8">
                <div className="flex items-baseline justify-center gap-2 mb-2">
                  <span className="text-5xl font-bold text-gray-900">€4.99</span>
                  <span className="text-gray-600">/month</span>
                </div>
                <div className="text-gray-600">
                  or <span className="font-bold text-purple-600">€29.99/year</span> (save 50%)
                </div>
              </div>

              {/* Features List */}
              <div className="space-y-3 mb-8">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                      <Check className="w-4 h-4 text-green-600" />
                    </div>
                    <span className="text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>

              {/* CTA */}
              <motion.button
                onClick={() => router.push("/users")}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-4 bg-gradient-to-br from-purple-600 to-blue-600 text-white rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all mb-4"
              >
                Start Free Trial
              </motion.button>

              <p className="text-center text-sm text-gray-500">
                3-day trial, no credit card required
              </p>
            </div>
          </div>
        </motion.div>

        {/* Testimonials */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-20"
        >
          <h3 className="text-3xl font-bold text-center text-gray-900 mb-12">
            What People Say
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Sarah M.",
                role: "Daily User",
                text: "The best journaling app I've ever used. The encryption gives me peace of mind.",
                rating: 5,
              },
              {
                name: "James K.",
                role: "Writer",
                text: "Book mode is incredible! Feels like writing in a real journal but better.",
                rating: 5,
              },
              {
                name: "Emily R.",
                role: "Student",
                text: "I love the voice-to-text feature. Makes journaling so much easier!",
                rating: 5,
              },
            ].map((testimonial, index) => (
              <div
                key={index}
                className="bg-white rounded-xl p-6 shadow-md"
              >
                <div className="flex mb-3">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <span key={i} className="text-yellow-400 text-xl">⭐</span>
                  ))}
                </div>
                <p className="text-gray-700 mb-4 italic">"{testimonial.text}"</p>
                <div>
                  <div className="font-bold text-gray-900">{testimonial.name}</div>
                  <div className="text-sm text-gray-500">{testimonial.role}</div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
