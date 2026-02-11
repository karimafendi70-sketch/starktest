'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { useTheme } from '@/lib/theme-context';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { Navbar } from '@/components/Navbar';
import { MobileBottomNav } from '@/components/MobileBottomNav';
import { ThemeToggle } from '@/components/ThemeToggle';
import { exportData, importData, deleteAllData } from '@/lib/db';
import {
  User,
  Palette,
  Shield,
  Download,
  Upload,
  Trash2,
  Info,
  Moon,
  Sun,
  Bell,
  Save,
} from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

export default function SettingsPage() {
  const router = useRouter();
  const { isAuthenticated, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  
  const [activeSection, setActiveSection] = useState('appearance');
  const [loading, setLoading] = useState(false);
  
  // Profile settings
  const [username, setUsername] = useState('User');
  const [email, setEmail] = useState('');
  
  // Appearance settings
  const [fontSize, setFontSize] = useState('medium');
  const [accentColor, setAccentColor] = useState('purple');
  
  // Notifications
  const [dailyReminder, setDailyReminder] = useState(false);
  const [reminderTime, setReminderTime] = useState('20:00');

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/journal/login');
      return;
    }

    // Load saved settings from localStorage
    const savedUsername = localStorage.getItem('journal-username');
    const savedEmail = localStorage.getItem('journal-email');
    const savedFontSize = localStorage.getItem('journal-font-size');
    const savedAccentColor = localStorage.getItem('journal-accent-color');
    
    if (savedUsername) setUsername(savedUsername);
    if (savedEmail) setEmail(savedEmail);
    if (savedFontSize) setFontSize(savedFontSize);
    if (savedAccentColor) setAccentColor(savedAccentColor);
  }, [isAuthenticated, router]);

  const handleSaveProfile = () => {
    localStorage.setItem('journal-username', username);
    localStorage.setItem('journal-email', email);
    toast.success('Profile saved successfully!');
  };

  const handleSaveAppearance = () => {
    localStorage.setItem('journal-font-size', fontSize);
    localStorage.setItem('journal-accent-color', accentColor);
    toast.success('Appearance settings saved!');
  };

  const handleExport = async () => {
    try {
      setLoading(true);
      const data = await exportData();
      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `journal-backup-${Date.now()}.json`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success('Data exported successfully!');
    } catch (error) {
      console.error('Error exporting data:', error);
      toast.error('Failed to export data');
    } finally {
      setLoading(false);
    }
  };

  const handleImport = async () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      try {
        setLoading(true);
        const text = await file.text();
        await importData(text);
        toast.success('Data imported successfully!');
        setTimeout(() => window.location.reload(), 1500);
      } catch (error) {
        console.error('Error importing data:', error);
        toast.error('Failed to import data. Please check the file format.');
      } finally {
        setLoading(false);
      }
    };
    input.click();
  };

  const handleDeleteAll = async () => {
    if (
      window.confirm(
        '⚠️ WARNING: This will delete ALL your journal entries and reset the app. This action cannot be undone. Are you absolutely sure?'
      )
    ) {
      if (window.prompt('Type "DELETE" to confirm') === 'DELETE') {
        try {
          setLoading(true);
          await deleteAllData();
          toast.success('All data deleted');
          logout();
          router.push('/');
        } catch (error) {
          console.error('Error deleting all data:', error);
          toast.error('Failed to delete data');
        } finally {
          setLoading(false);
        }
      }
    }
  };

  const sections = [
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'privacy', label: 'Privacy & Security', icon: Shield },
    { id: 'data', label: 'Data & Storage', icon: Download },
    { id: 'about', label: 'About', icon: Info },
  ];

  return (
    <div className="min-h-screen bg-background dark:bg-gray-900 pb-16 md:pb-0">
      <Navbar />
      <Toaster position="top-right" />

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Settings</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage your preferences and account</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
              <nav className="space-y-2">
                {sections.map(({ id, label, icon: Icon }) => (
                  <button
                    key={id}
                    onClick={() => setActiveSection(id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                      activeSection === id
                        ? 'bg-purple-600 text-white'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{label}</span>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              {loading && (
                <div className="flex justify-center py-12">
                  <LoadingSpinner size="large" />
                </div>
              )}

              {!loading && activeSection === 'appearance' && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Appearance</h2>
                  
                  <div className="space-y-6">
                    {/* Theme */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Theme
                      </label>
                      <div className="flex items-center gap-4">
                        <ThemeToggle />
                        <span className="text-gray-600 dark:text-gray-400">
                          Current: {theme === 'dark' ? 'Dark' : 'Light'} Mode
                        </span>
                      </div>
                    </div>

                    {/* Font Size */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Font Size
                      </label>
                      <select
                        value={fontSize}
                        onChange={(e) => setFontSize(e.target.value)}
                        className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white"
                      >
                        <option value="small">Small</option>
                        <option value="medium">Medium</option>
                        <option value="large">Large</option>
                      </select>
                    </div>

                    {/* Accent Color */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Accent Color
                      </label>
                      <div className="flex gap-3">
                        {['purple', 'blue', 'green', 'pink', 'orange'].map((color) => (
                          <button
                            key={color}
                            onClick={() => setAccentColor(color)}
                            className={`w-12 h-12 rounded-lg bg-${color}-500 hover:scale-110 transition-transform ${
                              accentColor === color ? 'ring-4 ring-offset-2 ring-gray-400 dark:ring-gray-600' : ''
                            }`}
                          />
                        ))}
                      </div>
                    </div>

                    <button
                      onClick={handleSaveAppearance}
                      className="flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                    >
                      <Save className="w-5 h-5" />
                      Save Changes
                    </button>
                  </div>
                </div>
              )}

              {activeSection === 'privacy' && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Privacy & Security</h2>
                  
                  <div className="space-y-6">
                    <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                      <p className="text-green-800 dark:text-green-300">
                        <strong>🔒 Your data is secure:</strong> All journal entries are encrypted locally using AES-256 encryption.
                        Your password never leaves your device.
                      </p>
                    </div>

                    <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                      <p className="text-blue-800 dark:text-blue-300">
                        <strong>💾 Local Storage:</strong> Your journal is stored entirely on your device using IndexedDB.
                        No cloud sync, no servers, no tracking.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {activeSection === 'data' && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Data & Storage</h2>
                  
                  <div className="space-y-6">
                    {/* Export */}
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Export Data</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                        Download all your journal entries as a JSON file
                      </p>
                      <button
                        onClick={handleExport}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        <Download className="w-5 h-5" />
                        Export All Entries
                      </button>
                    </div>

                    {/* Import */}
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Import Data</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                        Import journal entries from a backup file
                      </p>
                      <button
                        onClick={handleImport}
                        className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                      >
                        <Upload className="w-5 h-5" />
                        Import Entries
                      </button>
                    </div>

                    {/* Danger Zone */}
                    <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                      <h3 className="font-semibold text-red-600 dark:text-red-400 mb-2">Danger Zone</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                        Permanently delete all your journal entries. This action cannot be undone.
                      </p>
                      <button
                        onClick={handleDeleteAll}
                        className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                      >
                        <Trash2 className="w-5 h-5" />
                        Delete All Data
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {activeSection === 'about' && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">About</h2>
                  
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">App Version</p>
                      <p className="text-lg font-semibold text-gray-900 dark:text-white">1.0.0</p>
                    </div>

                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Features</p>
                      <ul className="list-disc list-inside space-y-1 text-gray-700 dark:text-gray-300">
                        <li>End-to-end encrypted journal entries</li>
                        <li>Mood tracking and analytics</li>
                        <li>Calendar view</li>
                        <li>Tag management</li>
                        <li>Dark mode support</li>
                        <li>Photo attachments</li>
                        <li>Voice input</li>
                        <li>Export/Import capabilities</li>
                      </ul>
                    </div>

                    <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Made with ❤️ for privacy-conscious journaling
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      <MobileBottomNav />
    </div>
  );
}
