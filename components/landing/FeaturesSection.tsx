'use client';

export default function FeaturesSection() {
  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-6">
        <h2 className="text-4xl font-bold text-center mb-16">Why Choose Us?</h2>
        
        <div className="grid md:grid-cols-3 gap-12">
          <div className="text-center">
            <div className="w-20 h-20 mx-auto mb-6 bg-blue-100 rounded-2xl flex items-center justify-center">
              <span className="text-4xl">🔒</span>
            </div>
            <h3 className="text-2xl font-semibold mb-4">Truly Private</h3>
            <p className="text-gray-600">
              Military-grade AES-256 encryption. Your data stays on your device or encrypted in cloud. Zero tracking.
            </p>
          </div>
          
          <div className="text-center">
            <div className="w-20 h-20 mx-auto mb-6 bg-purple-100 rounded-2xl flex items-center justify-center">
              <span className="text-4xl">📸</span>
            </div>
            <h3 className="text-2xl font-semibold mb-4">Photo Journaling</h3>
            <p className="text-gray-600">
              Encrypted photos with camera access. Voice-to-text transcription. Capture memories your way.
            </p>
          </div>
          
          <div className="text-center">
            <div className="w-20 h-20 mx-auto mb-6 bg-pink-100 rounded-2xl flex items-center justify-center">
              <span className="text-4xl">📖</span>
            </div>
            <h3 className="text-2xl font-semibold mb-4">Beautiful Reading</h3>
            <p className="text-gray-600">
              Cozy book mode with vintage design. 6 gorgeous themes. Reading experience like a real book.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
