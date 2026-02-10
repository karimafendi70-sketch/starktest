"use client";

import { User } from '@/lib/multi-user';
import { getUserInitials } from '@/lib/auth';

interface UserAvatarProps {
  user: User;
  size?: 'small' | 'medium' | 'large';
  className?: string;
}

export function UserAvatar({ user, size = 'medium', className = '' }: UserAvatarProps) {
  const sizeClasses = {
    small: 'w-8 h-8 text-sm',
    medium: 'w-12 h-12 text-lg',
    large: 'w-20 h-20 text-3xl',
  };

  // Check if avatar is an emoji or a color code
  const isEmoji = !user.avatar.startsWith('#');

  if (isEmoji) {
    return (
      <div
        className={`${sizeClasses[size]} ${className} flex items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-blue-500`}
      >
        <span className="text-white">{user.avatar}</span>
      </div>
    );
  }

  // Color-based avatar with initials
  const initials = getUserInitials(user.username);
  
  return (
    <div
      className={`${sizeClasses[size]} ${className} flex items-center justify-center rounded-full font-bold text-white`}
      style={{ backgroundColor: user.avatar }}
    >
      {initials}
    </div>
  );
}
