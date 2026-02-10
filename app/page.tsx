'use client';

export default function LandingPage() {
  return (
    <main>
      {/* Hero Section - Purple gradient background */}
      <section className="min-h-screen bg-gradient-to-br from-purple-600 to-blue-600 text-white p-6">
        <nav className="flex justify-between items-center mb-20 max-w-6xl mx-auto">
          <div className="text-2xl font-bold">🔒 SecureJournal</div>
          <div className="flex gap-4">
            <a href="/login" className="text-white hover:underline">Login</a>
            <a href="/register" className="bg-white text-purple-600 px-6 py-2 rounded-lg font-semibold">
              Get Started
            </a>
          </div>
        </nav>
        
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-6xl font-bold mb-6">
              Your Private Journal,<br/>Encrypted & Beautiful ✨
            </h1>
            <p className="text-xl mb-8 text-purple-100">
              Write freely. Everything stays private.<br/>
              Military-grade encryption. Zero tracking.
            </p>
            <div className="flex gap-4">
              <a href="/register" className="bg-white text-purple-600 px-8 py-4 rounded-xl font-semibold text-lg hover:scale-105 transition-transform inline-block">
                Start Free Trial →
              </a>
              <a href="#features" className="border-2 border-white px-8 py-4 rounded-xl font-semibold hover:bg-white hover:text-purple-600 transition-all inline-block">
                Learn More ↓
              </a>
            </div>
            <p className="text-sm text-purple-200 mt-4">3-day trial, no card required</p>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow-2xl">
            <div className="aspect-video bg-gradient-to-br from-purple-100 to-blue-100 rounded-xl flex items-center justify-center text-gray-500">
              Screenshot Placeholder
            </div>
          </div>
        </div>
        
        <p className="text-center mt-16 text-lg">💙 10,000+ people trust us with their memories</p>
      </section>
      
      {/* Features Section - 3 columns */}
      <section id="features" className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-16">Why Choose Us?</h2>
          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-6 bg-blue-100 rounded-2xl flex items-center justify-center text-4xl">
                🔒
              </div>
              <h3 className="text-2xl font-semibold mb-4">Truly Private</h3>
              <p className="text-gray-600">
                Military-grade AES-256 encryption. Your data stays on your device or encrypted in cloud.
              </p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-6 bg-purple-100 rounded-2xl flex items-center justify-center text-4xl">
                📸
              </div>
              <h3 className="text-2xl font-semibold mb-4">Photo Journaling</h3>
              <p className="text-gray-600">
                Encrypted photos with camera access. Voice-to-text transcription.
              </p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-6 bg-pink-100 rounded-2xl flex items-center justify-center text-4xl">
                📖
              </div>
              <h3 className="text-2xl font-semibold mb-4">Beautiful Reading</h3>
              <p className="text-gray-600">
                Cozy book mode with vintage design. 6 gorgeous themes.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Testimonials */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-16">Loved by Thousands</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-sm">
              <div className="text-yellow-500 text-2xl mb-4">⭐⭐⭐⭐⭐</div>
              <p className="text-gray-700 mb-4">
                "Finally, a journal app that respects my privacy!"
              </p>
              <p className="text-sm text-gray-500">- Sarah K.</p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-sm">
              <div className="text-yellow-500 text-2xl mb-4">⭐⭐⭐⭐⭐</div>
              <p className="text-gray-700 mb-4">
                "The book mode is gorgeous. Best journal app ever."
              </p>
              <p className="text-sm text-gray-500">- John M.</p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-sm">
              <div className="text-yellow-500 text-2xl mb-4">⭐⭐⭐⭐⭐</div>
              <p className="text-gray-700 mb-4">
                "Voice-to-text is a game changer!"
              </p>
              <p className="text-sm text-gray-500">- Emma R.</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Pricing */}
      <section className="py-24 bg-gradient-to-br from-purple-600 to-blue-600 text-white">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-4">Start Your Journey Today</h2>
          <p className="text-xl mb-16 opacity-90">Try free for 3 days, then €4.99/month</p>
          
          <div className="max-w-md mx-auto bg-white text-gray-900 rounded-3xl p-8">
            <div className="text-center mb-6">
              <p className="text-sm text-gray-500 mb-2">Free 3-Day Trial</p>
              <p className="text-5xl font-bold mb-2">€4.99</p>
              <p className="text-gray-600">/month</p>
            </div>
            <ul className="space-y-3 mb-8 text-left">
              <li className="flex items-center gap-3"><span className="text-green-500">✓</span> Unlimited entries</li>
              <li className="flex items-center gap-3"><span className="text-green-500">✓</span> End-to-end encryption</li>
              <li className="flex items-center gap-3"><span className="text-green-500">✓</span> Photos & voice</li>
              <li className="flex items-center gap-3"><span className="text-green-500">✓</span> Cloud sync</li>
              <li className="flex items-center gap-3"><span className="text-green-500">✓</span> All themes</li>
              <li className="flex items-center gap-3"><span className="text-green-500">✓</span> Cancel anytime</li>
            </ul>
            <a href="/register" className="block w-full bg-purple-600 text-white py-4 rounded-xl font-semibold hover:bg-purple-700">
              Start Free Trial →
            </a>
            <p className="text-sm text-gray-500 mt-4">No card required</p>
          </div>
        </div>
      </section>
    </main>
  );
}
