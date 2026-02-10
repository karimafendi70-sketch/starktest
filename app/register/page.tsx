"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Check, X, RefreshCw } from 'lucide-react';
import {
  generateRandomAvatar,
  generateRandomColorAvatar,
  hashPassword,
} from '@/lib/auth';
import {
  createUser,
  isMaxUsersReached,
  validateUsername,
  validatePassword,
} from '@/lib/multi-user';
import { useUser } from '@/lib/user-context';
import { generateSalt, uint8ArrayToBase64 } from '@/lib/crypto';

export default function RegisterPage() {
  const router = useRouter();
  const { setCurrentUser } = useUser();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [avatar, setAvatar] = useState(generateRandomAvatar());
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Check if max users reached
  useEffect(() => {
    if (isMaxUsersReached()) {
      router.push('/users');
    }
  }, [router]);

  const passwordValidation = validatePassword(password);
  const usernameValidation = validateUsername(username);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setIsSubmitting(true);

    try {
      // Validate username
      if (!usernameValidation.valid) {
        setErrors({ username: usernameValidation.error || 'Invalid username' });
        setIsSubmitting(false);
        return;
      }

      // Validate password
      if (!passwordValidation.valid) {
        setErrors({ password: passwordValidation.error || 'Invalid password' });
        setIsSubmitting(false);
        return;
      }

      // Check password confirmation
      if (password !== confirmPassword) {
        setErrors({ confirmPassword: 'Passwords do not match' });
        setIsSubmitting(false);
        return;
      }

      // Hash password
      const passwordHash = await hashPassword(password);

      // Generate encryption salt
      const salt = generateSalt();
      const saltB64 = uint8ArrayToBase64(salt);

      // Create user
      const newUser = createUser(username, passwordHash, avatar, saltB64);

      if (newUser) {
        // Auto-login
        setCurrentUser(newUser);
        
        // Redirect to journal setup
        router.push('/journal/setup');
      }
    } catch (error: any) {
      setErrors({ general: error.message || 'Failed to create user' });
      setIsSubmitting(false);
    }
  };

  const regenerateAvatar = () => {
    // Alternate between emoji and color avatars
    if (avatar.startsWith('#')) {
      setAvatar(generateRandomAvatar());
    } else {
      setAvatar(generateRandomColorAvatar());
    }
  };

  const getStrengthColor = () => {
    if (!password) return 'bg-gray-300';
    switch (passwordValidation.strength) {
      case 'strong': return 'bg-green-500';
      case 'medium': return 'bg-yellow-500';
      default: return 'bg-red-500';
    }
  };

  const getStrengthWidth = () => {
    if (!password) return '0%';
    switch (passwordValidation.strength) {
      case 'strong': return '100%';
      case 'medium': return '66%';
      default: return '33%';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700 flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8">
          <h1 className="text-3xl font-bold text-center mb-2">Create Account</h1>
          <p className="text-gray-600 dark:text-gray-400 text-center mb-8">
            Set up your encrypted journal profile
          </p>

          {errors.general && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400 text-sm">
              {errors.general}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Avatar Selector */}
            <div>
              <label className="block text-sm font-medium mb-2">Choose Avatar</label>
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 flex items-center justify-center rounded-full text-3xl" style={{ backgroundColor: avatar.startsWith('#') ? avatar : 'transparent' }}>
                  {avatar.startsWith('#') ? username.substring(0, 2).toUpperCase() || '?' : avatar}
                </div>
                <button
                  type="button"
                  onClick={regenerateAvatar}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  <RefreshCw className="w-4 h-4" />
                  Randomize
                </button>
              </div>
            </div>

            {/* Username */}
            <div>
              <label className="block text-sm font-medium mb-2">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className={`w-full px-4 py-3 border ${
                  errors.username ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700`}
                placeholder="Enter username"
              />
              {errors.username && (
                <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                  <X className="w-4 h-4" />
                  {errors.username}
                </p>
              )}
              {username && usernameValidation.valid && (
                <p className="mt-1 text-sm text-green-500 flex items-center gap-1">
                  <Check className="w-4 h-4" />
                  Username available
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium mb-2">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`w-full px-4 py-3 border ${
                    errors.password ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                  } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700`}
                  placeholder="Enter password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {password && (
                <div className="mt-2">
                  <div className="h-2 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-300 ${getStrengthColor()}`}
                      style={{ width: getStrengthWidth() }}
                    />
                  </div>
                  <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                    Password strength: <span className="font-medium capitalize">{passwordValidation.strength}</span>
                  </p>
                </div>
              )}
              {errors.password && (
                <p className="mt-1 text-sm text-red-500">{errors.password}</p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium mb-2">Confirm Password</label>
              <input
                type={showPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={`w-full px-4 py-3 border ${
                  errors.confirmPassword ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700`}
                placeholder="Confirm password"
              />
              {confirmPassword && password === confirmPassword && (
                <p className="mt-1 text-sm text-green-500 flex items-center gap-1">
                  <Check className="w-4 h-4" />
                  Passwords match
                </p>
              )}
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-500">{errors.confirmPassword}</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting || !usernameValidation.valid || !passwordValidation.valid || password !== confirmPassword}
              className="w-full py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => router.push('/users')}
              className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
            >
              ← Back to Users
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
