"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useUser } from '@/lib/user-context';
import { useAuth } from '@/lib/auth-context';
import { UserAvatar } from '@/components/UserAvatar';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { deleteAccount } from '@/lib/deletion';
import { 
  ArrowLeft, 
  User, 
  Mail,
  Calendar,
  Key,
  Trash2,
  AlertTriangle
} from 'lucide-react';

export default function AccountSettings() {
  const router = useRouter();
  const { currentUser } = useUser();
  const { logout } = useAuth();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleChangePassword = async () => {
    if (!currentUser) return;

    if (newPassword !== confirmPassword) {
      alert('New passwords do not match');
      return;
    }

    if (newPassword.length < 8) {
      alert('Password must be at least 8 characters');
      return;
    }

    // In a real app, this would verify current password and update
    alert('Password changed successfully (Demo mode)');
    setShowChangePassword(false);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  const handleDeleteAccount = async (password?: string) => {
    if (!currentUser) return;

    try {
      await deleteAccount(currentUser.id);
      logout();
      router.push('/');
    } catch (error) {
      alert('Failed to delete account');
    }
  };

  if (!currentUser) {
    return null;
  }

  const accountAge = Math.floor(
    (Date.now() - new Date(currentUser.createdAt).getTime()) / (1000 * 60 * 60 * 24)
  );

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
            Account
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage your profile and account settings
          </p>
        </motion.div>

        {/* Profile Information */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
              Profile Information
            </h2>

            <div className="flex items-center gap-6 mb-6">
              <UserAvatar user={currentUser} size="large" />
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {currentUser.username}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  User ID: {currentUser.id.substring(0, 8)}...
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <User className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Username
                  </p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {currentUser.username}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <Calendar className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Member Since
                  </p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {new Date(currentUser.createdAt).toLocaleDateString()} ({accountAge} days ago)
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Change Password */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
            <div className="flex items-start gap-4 mb-4">
              <div className="p-3 rounded-lg bg-blue-100 dark:bg-blue-900">
                <Key className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                  Password
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Change your account password
                </p>
              </div>
            </div>

            {!showChangePassword ? (
              <button
                onClick={() => setShowChangePassword(true)}
                className="w-full px-4 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors"
              >
                Change Password
              </button>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Current Password
                  </label>
                  <input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="Enter current password"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    New Password
                  </label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="Enter new password (min 8 characters)"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="Confirm new password"
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={handleChangePassword}
                    className="flex-1 px-4 py-3 bg-green-600 hover:bg-green-500 text-white rounded-lg transition-colors"
                  >
                    Update Password
                  </button>
                  <button
                    onClick={() => {
                      setShowChangePassword(false);
                      setCurrentPassword('');
                      setNewPassword('');
                      setConfirmPassword('');
                    }}
                    className="px-4 py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </motion.section>

        {/* Danger Zone */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 rounded-xl p-6">
            <div className="flex items-start gap-4 mb-4">
              <div className="p-3 rounded-lg bg-red-100 dark:bg-red-900">
                <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold text-red-900 dark:text-red-100 mb-1">
                  Danger Zone
                </h2>
                <p className="text-sm text-red-700 dark:text-red-300">
                  Once you delete your account, there is no going back. Please be certain.
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowDeleteDialog(true)}
              className="w-full px-4 py-3 bg-red-600 hover:bg-red-500 text-white rounded-lg transition-colors flex items-center justify-center gap-2 font-semibold"
            >
              <Trash2 className="w-5 h-5" />
              Delete Account Permanently
            </button>
          </div>
        </motion.section>

        {/* Delete Confirmation Dialog */}
        {showDeleteDialog && (
          <ConfirmDialog
            isOpen={showDeleteDialog}
            type="password"
            title="Delete Account?"
            message="This will permanently delete your account and all journal entries. This action cannot be undone. Please enter your password to confirm."
            dangerLevel="high"
            requirePassword={true}
            onConfirm={handleDeleteAccount}
            onCancel={() => setShowDeleteDialog(false)}
          />
        )}
      </div>
    </div>
  );
}
