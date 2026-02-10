'use client';

import Link from 'next/link';

interface EmptyStateDashboardProps {
  user: {
    username: string;
  };
}

export default function EmptyStateDashboard({ user }: EmptyStateDashboardProps) {
  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-purple-50 to-blue-50">
      <div className="max-w-3xl w-full text-center">
        <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
          Welcome, {user.username}! 👋
        </h1>
        <p className="text-xl text-gray-600 mb-12">
          Let&apos;s write your first entry
        </p>
        
        {/* Big CTA */}
        <Link href="/journal/new">
          <button className="bg-gradient-to-r from-purple-600 to-blue-600 text-white text-xl px-12 py-6 rounded-2xl hover:scale-105 transition-transform shadow-xl mb-16">
            ✍️ Write Your First Entry
          </button>
        </Link>
        
        {/* Quick Start Guide */}
        <div className="mb-16">
          <h2 className="text-2xl font-semibold mb-8 text-gray-800">🎯 Quick Start Guide</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="text-4xl mb-4">1️⃣</div>
              <h3 className="font-semibold mb-2">Write your thoughts</h3>
              <p className="text-gray-600 text-sm">
                📝 Use the rich editor with formatting tools
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="text-4xl mb-4">2️⃣</div>
              <h3 className="font-semibold mb-2">Add photos & voice</h3>
              <p className="text-gray-600 text-sm">
                📸 Capture memories with camera or voice notes
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="text-4xl mb-4">3️⃣</div>
              <h3 className="font-semibold mb-2">Keep your streak</h3>
              <p className="text-gray-600 text-sm">
                🔥 Write daily to build a writing habit
              </p>
            </div>
          </div>
        </div>
        
        {/* Pro Tips */}
        <div className="bg-blue-50 p-8 rounded-2xl text-left max-w-2xl mx-auto">
          <h3 className="text-xl font-semibold mb-4">✨ Pro Tips</h3>
          <ul className="space-y-3 text-gray-700">
            <li className="flex items-start gap-3">
              <span>🎤</span>
              <span>Try voice-to-text for quick entries</span>
            </li>
            <li className="flex items-start gap-3">
              <span>📖</span>
              <span>Switch to book mode for cozy reading</span>
            </li>
            <li className="flex items-start gap-3">
              <span>🏷️</span>
              <span>Use tags like #work #travel to organize</span>
            </li>
            <li className="flex items-start gap-3">
              <span>🔒</span>
              <span>Your data is encrypted end-to-end</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
