"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Eye, EyeOff, AlertCircle } from "lucide-react";
import { getUserById, getAllUsers, User } from "@/lib/multi-user";
import { verifyPassword } from "@/lib/auth";
import { useUser } from "@/lib/user-context";
import { UserAvatar } from "@/components/UserAvatar";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setCurrentUser } = useUser();
  
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load users and pre-select if userId is provided
  useEffect(() => {
    const allUsers = getAllUsers();
    setUsers(allUsers);
    
    const userId = searchParams.get('userId');
    if (userId) {
      const user = getUserById(userId);
      if (user) {
        setSelectedUser(user);
      }
    } else if (allUsers.length === 1) {
      // Auto-select if only one user exists
      setSelectedUser(allUsers[0]);
    }
  }, [searchParams]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    if (!selectedUser) {
      setError("Please select a user");
      return;
    }
    
    setIsSubmitting(true);

    try {
      // Verify password
      const isValid = await verifyPassword(password, selectedUser.passwordHash);
      
      if (isValid) {
        // Login successful
        setCurrentUser(selectedUser);
        router.push("/journal");
      } else {
        setError("Incorrect password");
        setPassword("");
      }
    } catch (err) {
      setError("Login failed. Please try again.");
    } finally {
      setIsSubmitting(false);
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
          <h1 className="text-3xl font-bold text-center mb-2">Welcome Back</h1>
          <p className="text-gray-600 dark:text-gray-400 text-center mb-8">
            Sign in to access your encrypted journal
          </p>

          {error && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400 text-sm flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            {/* User Selector */}
            <div>
              <label className="block text-sm font-medium mb-3">Select User</label>
              <div className="space-y-2">
                {users.map((user) => (
                  <button
                    key={user.id}
                    type="button"
                    onClick={() => setSelectedUser(user)}
                    className={`w-full p-4 rounded-lg border-2 transition-all flex items-center gap-3 ${
                      selectedUser?.id === user.id
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                    }`}
                  >
                    <UserAvatar user={user} size="medium" />
                    <span className="font-medium">{user.username}</span>
                  </button>
                ))}
              </div>
              {users.length === 0 && (
                <p className="text-sm text-gray-500 text-center py-4">
                  No users found. Please create an account first.
                </p>
              )}
            </div>

            {/* Password */}
            {selectedUser && (
              <div>
                <label className="block text-sm font-medium mb-2">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700"
                    placeholder="Enter your password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting || !selectedUser || !password}
              className="w-full py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Logging in...' : 'Login'}
            </button>
          </form>

          <div className="mt-6 space-y-3 text-center">
            <button
              onClick={() => router.push('/register')}
              className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
            >
              Create New Account
            </button>
            <br />
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
