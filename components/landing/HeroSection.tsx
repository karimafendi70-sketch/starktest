'use client';

import Link from 'next/link';

export default function HeroSection() {
  return (
    <section className="min-h-screen flex items-center bg-gradient-to-br from-purple-600 via-violet-600 to-blue-600">
      <div className="container mx-auto px-6 py-20">
        <nav className="flex justify-between items-center mb-20">
          <div className="text-white text-2xl font-bold">🔒 SecureJournal</div>
          <div className="flex gap-4">
            <Link href="/users" className="text-white hover:text-purple-100 transition-colors">
              Login
            </Link>
            <Link 
              href="/users" 
              className="bg-white text-purple-600 px-6 py-2 rounded-lg font-semibold hover:bg-purple-50 transition-colors"
            >
              Get Started
            </Link>
          </div>
        </nav>
        
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="text-white">
            <h1 className="text-6xl font-bold leading-tight mb-6">
              Your Private Journal,<br/>
              Encrypted & Beautiful ✨
            </h1>
            <p className="text-xl mb-8 text-purple-100">
              Write freely. Everything stays private.<br/>
              Military-grade encryption. Zero tracking.
            </p>
            <div className="flex gap-4">
              <Link 
                href="/users" 
                className="bg-white text-purple-600 px-8 py-4 rounded-xl font-semibold text-lg hover:scale-105 transition-transform inline-block"
              >
                Start Free Trial →
              </Link>
              <button className="border-2 border-white text-white px-8 py-4 rounded-xl font-semibold hover:bg-white hover:text-purple-600 transition-all">
                Watch Demo ▶
              </button>
            </div>
            <p className="text-sm text-purple-200 mt-4">3-day trial, no card required</p>
          </div>
          
          <div className="relative">
            <div className="bg-white rounded-2xl shadow-2xl p-4">
              {/* Placeholder for screenshot - use actual journal screenshot */}
              <div className="aspect-video bg-gradient-to-br from-purple-100 to-blue-100 rounded-xl flex items-center justify-center text-gray-500">
                [Beautiful Journal Screenshot]
              </div>
            </div>
          </div>
        </div>
        
        <div className="text-center mt-16 text-white text-lg">
          💙 10,000+ people trust us with their memories
        </div>
      </div>
    </section>
  );
}
