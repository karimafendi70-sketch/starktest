"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useTheme } from '@/lib/theme-context';
import { ArrowLeft, Moon, Sun, Check } from 'lucide-react';

const THEMES = [
  { id: 'light', name: 'Light', description: 'Clean and bright' },
  { id: 'dark', name: 'Dark', description: 'Easy on the eyes' },
  { id: 'vintage-book', name: 'Vintage Book', description: 'Classic journal feel' },
];

const TEXTURES = [
  { id: 'none', name: 'None', description: 'Clean and minimal' },
  { id: 'paper', name: 'Paper', description: 'Textured paper background' },
  { id: 'vintage', name: 'Vintage', description: 'Aged paper texture' },
];

export default function AppearanceSettings() {
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();
  const [selectedTheme, setSelectedTheme] = useState<string>(theme);
  const [selectedTexture, setSelectedTexture] = useState('none');

  const handleThemeChange = (themeId: string) => {
    setSelectedTheme(themeId);
    if (themeId === 'dark' && theme === 'light') {
      toggleTheme();
    } else if (themeId === 'light' && theme === 'dark') {
      toggleTheme();
    }
    // Store preference
    localStorage.setItem('preferred-theme', themeId);
  };

  const handleTextureChange = (textureId: string) => {
    setSelectedTexture(textureId);
    localStorage.setItem('preferred-texture', textureId);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <button
            onClick={() => router.push('/settings')}
            className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Settings
          </button>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Appearance
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Customize how your journal looks and feels
          </p>
        </motion.div>

        {/* Theme Selector */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Theme
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {THEMES.map((themeOption) => (
              <button
                key={themeOption.id}
                onClick={() => handleThemeChange(themeOption.id)}
                className={`
                  relative p-6 rounded-xl border-2 transition-all text-left
                  ${selectedTheme === themeOption.id
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600'
                  }
                `}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700">
                    {themeOption.id === 'dark' ? (
                      <Moon className="w-5 h-5" />
                    ) : (
                      <Sun className="w-5 h-5" />
                    )}
                  </div>
                  {selectedTheme === themeOption.id && (
                    <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                  )}
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                  {themeOption.name}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {themeOption.description}
                </p>
              </button>
            ))}
          </div>
        </motion.section>

        {/* Texture Selector */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Background Texture
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {TEXTURES.map((texture) => (
              <button
                key={texture.id}
                onClick={() => handleTextureChange(texture.id)}
                className={`
                  relative p-6 rounded-xl border-2 transition-all text-left
                  ${selectedTexture === texture.id
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600'
                  }
                `}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="text-2xl">📄</div>
                  {selectedTexture === texture.id && (
                    <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                  )}
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                  {texture.name}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {texture.description}
                </p>
              </button>
            ))}
          </div>
        </motion.section>

        {/* Preview Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-8"
        >
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Preview
          </h2>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-8 border border-gray-200 dark:border-gray-700">
            <div className="max-w-md">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                Sample Entry
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                January 15, 2024
              </p>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                This is how your journal entries will look with the current theme and texture settings. 
                The appearance is applied consistently across all your writing.
              </p>
            </div>
          </div>
        </motion.section>

        {/* Save Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-4"
        >
          <p className="text-sm text-green-800 dark:text-green-200">
            ✓ Your preferences are saved automatically
          </p>
        </motion.div>
      </div>
    </div>
  );
}
