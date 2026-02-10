'use client';

export default function TestimonialsSection() {
  return (
    <section className="py-24 bg-gray-50">
      <div className="container mx-auto px-6">
        <h2 className="text-4xl font-bold text-center mb-16">Loved by Thousands</h2>
        
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-2xl shadow-sm">
            <div className="text-yellow-500 text-2xl mb-4">⭐⭐⭐⭐⭐</div>
            <p className="text-gray-700 mb-4">
              &quot;Finally, a journal app that respects my privacy. Love the encryption!&quot;
            </p>
            <p className="text-sm text-gray-500">- Sarah K.</p>
          </div>
          
          <div className="bg-white p-8 rounded-2xl shadow-sm">
            <div className="text-yellow-500 text-2xl mb-4">⭐⭐⭐⭐⭐</div>
            <p className="text-gray-700 mb-4">
              &quot;The book mode is gorgeous. Best journal app I&apos;ve ever used.&quot;
            </p>
            <p className="text-sm text-gray-500">- John M.</p>
          </div>
          
          <div className="bg-white p-8 rounded-2xl shadow-sm">
            <div className="text-yellow-500 text-2xl mb-4">⭐⭐⭐⭐⭐</div>
            <p className="text-gray-700 mb-4">
              &quot;Voice-to-text is a game changer. Write journals while driving!&quot;
            </p>
            <p className="text-sm text-gray-500">- Emma R.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
