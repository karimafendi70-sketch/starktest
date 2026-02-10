"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, Calendar, Link as LinkIcon } from "lucide-react";
import { Photo } from "@/types/photo";

interface PhotoLightboxProps {
  photos: Photo[];
  currentIndex: number;
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (direction: 'prev' | 'next') => void;
}

export function PhotoLightbox({
  photos,
  currentIndex,
  isOpen,
  onClose,
  onNavigate,
}: PhotoLightboxProps) {
  const currentPhoto = photos[currentIndex];

  if (!isOpen || !currentPhoto) return null;

  const handlePrevious = () => {
    if (currentIndex > 0) {
      onNavigate('prev');
    }
  };

  const handleNext = () => {
    if (currentIndex < photos.length - 1) {
      onNavigate('next');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') onClose();
    if (e.key === 'ArrowLeft') handlePrevious();
    if (e.key === 'ArrowRight') handleNext();
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
        onClick={onClose}
        onKeyDown={handleKeyDown}
        tabIndex={0}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors z-10"
          aria-label="Close lightbox"
        >
          <X className="w-6 h-6 text-white" />
        </button>

        {/* Navigation buttons */}
        {currentIndex > 0 && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              handlePrevious();
            }}
            className="absolute left-4 p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors z-10"
            aria-label="Previous photo"
          >
            <ChevronLeft className="w-6 h-6 text-white" />
          </button>
        )}

        {currentIndex < photos.length - 1 && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleNext();
            }}
            className="absolute right-4 p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors z-10"
            aria-label="Next photo"
          >
            <ChevronRight className="w-6 h-6 text-white" />
          </button>
        )}

        {/* Photo container */}
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.2 }}
          className="relative max-w-7xl max-h-[90vh] w-full px-16"
          onClick={(e) => e.stopPropagation()}
        >
          <img
            src={currentPhoto.encryptedData}
            alt={currentPhoto.caption || 'Photo'}
            className="w-full h-full object-contain rounded-lg"
          />

          {/* Photo info */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 rounded-b-lg">
            {currentPhoto.caption && (
              <p className="text-white text-lg mb-2">{currentPhoto.caption}</p>
            )}
            <div className="flex items-center gap-4 text-white/70 text-sm">
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {new Date(currentPhoto.timestamp).toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric'
                })}
              </div>
              <div className="flex items-center gap-1">
                <LinkIcon className="w-4 h-4" />
                Linked to journal entry
              </div>
            </div>
          </div>

          {/* Counter */}
          <div className="absolute top-4 left-4 px-3 py-1 bg-black/60 rounded-full text-white text-sm">
            {currentIndex + 1} / {photos.length}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
