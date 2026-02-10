"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, Calendar, Loader2 } from "lucide-react";
import { Photo } from "@/types/photo";
import { PhotoLightbox } from "@/components/PhotoLightbox";
import { getAllPhotosForUser } from "@/lib/photo-storage";
import { useAuth } from "@/lib/auth-context";
import { useUser } from "@/lib/user-context";

export function PhotoGallery() {
  const router = useRouter();
  const { cryptoKey } = useAuth();
  const { currentUser } = useUser();
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [filterDate, setFilterDate] = useState<string>('');

  useEffect(() => {
    loadPhotos();
  }, [cryptoKey, currentUser]);

  const loadPhotos = async () => {
    if (!cryptoKey || !currentUser) return;

    try {
      setLoading(true);
      const userPhotos = await getAllPhotosForUser(currentUser.id, cryptoKey);
      // Sort by timestamp (newest first)
      userPhotos.sort((a, b) => 
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );
      setPhotos(userPhotos);
    } catch (error) {
      console.error('Failed to load photos:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredPhotos = filterDate
    ? photos.filter(photo => photo.timestamp.startsWith(filterDate))
    : photos;

  const handleNavigate = (direction: 'prev' | 'next') => {
    if (selectedIndex === null) return;

    if (direction === 'prev' && selectedIndex > 0) {
      setSelectedIndex(selectedIndex - 1);
    } else if (direction === 'next' && selectedIndex < filteredPhotos.length - 1) {
      setSelectedIndex(selectedIndex + 1);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.push('/journal')}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Photo Gallery
              </h1>
            </div>

            {/* Filter */}
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-gray-500" />
              <input
                type="date"
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
              {filterDate && (
                <button
                  onClick={() => setFilterDate('')}
                  className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Gallery Grid */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
          </div>
        ) : filteredPhotos.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-500 dark:text-gray-400 text-lg">
              {filterDate ? 'No photos found for this date' : 'No photos yet'}
            </p>
            <p className="text-gray-400 dark:text-gray-500 text-sm mt-2">
              Add photos to your journal entries to see them here
            </p>
          </div>
        ) : (
          <>
            <div className="mb-4 text-sm text-gray-600 dark:text-gray-400">
              {filteredPhotos.length} {filteredPhotos.length === 1 ? 'photo' : 'photos'}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredPhotos.map((photo, index) => (
                <motion.div
                  key={photo.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className="relative group cursor-pointer aspect-square"
                  onClick={() => setSelectedIndex(index)}
                >
                  <img
                    src={photo.thumbnailUrl}
                    alt={photo.caption || 'Photo'}
                    className="w-full h-full object-cover rounded-lg shadow-md transition-transform group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors rounded-lg" />
                  
                  {/* Date badge */}
                  <div className="absolute bottom-2 left-2 px-2 py-1 bg-black/60 rounded text-white text-xs">
                    {new Date(photo.timestamp).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric'
                    })}
                  </div>
                </motion.div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Lightbox */}
      {selectedIndex !== null && (
        <PhotoLightbox
          photos={filteredPhotos}
          currentIndex={selectedIndex}
          isOpen={selectedIndex !== null}
          onClose={() => setSelectedIndex(null)}
          onNavigate={handleNavigate}
        />
      )}
    </div>
  );
}
