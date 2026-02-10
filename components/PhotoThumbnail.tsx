"use client";

import { motion } from "framer-motion";
import { X } from "lucide-react";

interface PhotoThumbnailProps {
  photoDataUrl: string;
  caption?: string;
  onClick?: () => void;
  onRemove?: () => void;
  className?: string;
}

export function PhotoThumbnail({
  photoDataUrl,
  caption,
  onClick,
  onRemove,
  className = "",
}: PhotoThumbnailProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className={`relative group cursor-pointer ${className}`}
      onClick={onClick}
    >
      <div className="relative aspect-square overflow-hidden rounded-lg shadow-md">
        <img
          src={photoDataUrl}
          alt={caption || 'Photo'}
          className="w-full h-full object-cover transition-transform group-hover:scale-110"
        />
        
        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
        
        {/* Remove button */}
        {onRemove && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onRemove();
            }}
            className="absolute top-2 right-2 p-1.5 bg-red-500 hover:bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
            aria-label="Remove photo"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
      
      {/* Caption */}
      {caption && (
        <p className="mt-2 text-xs text-gray-600 dark:text-gray-400 truncate">
          {caption}
        </p>
      )}
    </motion.div>
  );
}
