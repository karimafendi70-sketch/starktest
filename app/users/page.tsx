"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { UserPlus, Trash2, AlertCircle } from 'lucide-react';
import { getAllUsers, isMaxUsersReached, deleteUser, User } from '@/lib/multi-user';
import { formatLastLogin } from '@/lib/auth';
import { UserAvatar } from '@/components/UserAvatar';

export default function UsersPage() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>(getAllUsers());
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const maxUsersReached = isMaxUsersReached();

  const handleSelectUser = (user: User) => {
    router.push(`/login?userId=${user.id}`);
  };

  const handleCreateUser = () => {
    router.push('/register');
  };

  const handleDeleteUser = (userId: string) => {
    if (deleteConfirm === userId) {
      const success = deleteUser(userId);
      if (success) {
        setUsers(getAllUsers());
        setDeleteConfirm(null);
      }
    } else {
      setDeleteConfirm(userId);
      setTimeout(() => {
        if (deleteConfirm === userId) {
          setDeleteConfirm(null);
        }
      }, 5000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700 flex flex-col items-center justify-center p-6 text-white">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-4xl"
      >
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4">👥 Select User</h1>
          <p className="text-xl text-white/80">
            Choose your profile or create a new one
          </p>
          {maxUsersReached && (
            <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-yellow-500/20 border border-yellow-500/30 rounded-lg text-yellow-100">
              <AlertCircle className="w-5 h-5" />
              <span>Maximum of 5 users reached</span>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {users.map((user) => (
            <motion.div
              key={user.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.03 }}
              className="bg-white/10 backdrop-blur-md border-2 border-white/20 rounded-xl p-6 relative group"
            >
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteUser(user.id);
                }}
                className={`absolute top-2 right-2 p-2 rounded-lg transition-all ${
                  deleteConfirm === user.id
                    ? 'bg-red-500 hover:bg-red-600'
                    : 'bg-white/20 hover:bg-red-500 opacity-0 group-hover:opacity-100'
                }`}
                title={deleteConfirm === user.id ? 'Click again to confirm' : 'Delete user'}
              >
                <Trash2 className="w-4 h-4" />
              </button>

              <button
                onClick={() => handleSelectUser(user)}
                className="w-full text-left"
              >
                <div className="flex flex-col items-center mb-4">
                  <UserAvatar user={user} size="large" className="mb-3" />
                  <h3 className="text-2xl font-bold">{user.username}</h3>
                </div>
                
                <div className="text-sm text-white/60 text-center space-y-1">
                  <p>Last login: {formatLastLogin(user.lastLogin)}</p>
                  <p>Created: {new Date(user.createdAt).toLocaleDateString()}</p>
                </div>

                <div className="mt-4 text-center">
                  <span className="inline-flex items-center px-4 py-2 bg-white/20 rounded-lg text-sm font-medium hover:bg-white/30 transition-colors">
                    Select User →
                  </span>
                </div>
              </button>
            </motion.div>
          ))}

          {!maxUsersReached && (
            <motion.button
              onClick={handleCreateUser}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.03 }}
              className="bg-white/10 backdrop-blur-md border-2 border-white/20 rounded-xl p-6 flex flex-col items-center justify-center min-h-[250px] hover:bg-white/15 transition-all group"
            >
              <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mb-4 group-hover:bg-white/30 transition-colors">
                <UserPlus className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-bold mb-2">Create New User</h3>
              <p className="text-sm text-white/60">
                {users.length === 0 ? 'Get started' : `${5 - users.length} slot${5 - users.length !== 1 ? 's' : ''} remaining`}
              </p>
            </motion.button>
          )}
        </div>

        {users.length === 0 && (
          <div className="text-center text-white/60 mb-8">
            <p>No users yet. Create your first profile to get started!</p>
          </div>
        )}

        <div className="text-center">
          <button
            onClick={() => router.push('/')}
            className="text-white/60 hover:text-white transition-colors"
          >
            ← Back to Home
          </button>
        </div>
      </motion.div>
    </div>
  );
}
