'use client';

import Link from 'next/link';

export default function PricingSection() {
  return (
    <section className="py-24 bg-gradient-to-br from-purple-600 to-blue-600 text-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Start Your Journey Today</h2>
          <p className="text-xl opacity-90">Try free for 3 days, then just €4.99/month</p>
        </div>
        
        <div className="max-w-md mx-auto bg-white text-gray-900 rounded-3xl p-8 shadow-2xl">
          <div className="text-center mb-6">
            <p className="text-sm text-gray-500 mb-2">Free 3-Day Trial</p>
            <p className="text-5xl font-bold mb-2">€4.99</p>
            <p className="text-gray-600">/month</p>
          </div>
          
          <ul className="space-y-4 mb-8">
            <li className="flex items-center gap-3">
              <span className="text-green-500">✓</span>
              <span>Unlimited entries</span>
            </li>
            <li className="flex items-center gap-3">
              <span className="text-green-500">✓</span>
              <span>End-to-end encryption</span>
            </li>
            <li className="flex items-center gap-3">
              <span className="text-green-500">✓</span>
              <span>Photos & voice</span>
            </li>
            <li className="flex items-center gap-3">
              <span className="text-green-500">✓</span>
              <span>Cloud sync</span>
            </li>
            <li className="flex items-center gap-3">
              <span className="text-green-500">✓</span>
              <span>All themes</span>
            </li>
            <li className="flex items-center gap-3">
              <span className="text-green-500">✓</span>
              <span>Cancel anytime</span>
            </li>
          </ul>
          
          <Link 
            href="/users" 
            className="block w-full bg-purple-600 text-white text-center py-4 rounded-xl font-semibold hover:bg-purple-700 transition-colors"
          >
            Start Free Trial →
          </Link>
          <p className="text-center text-sm text-gray-500 mt-4">No card required</p>
          
          <div className="mt-6 pt-6 border-t text-center">
            <p className="text-sm text-gray-600 mb-2">Or save 50% with annual</p>
            <p className="text-2xl font-bold">€29.99/year 🎉</p>
          </div>
        </div>
      </div>
    </section>
  );
}
