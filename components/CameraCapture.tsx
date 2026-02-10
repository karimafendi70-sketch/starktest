"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, X, RefreshCw, Check } from "lucide-react";
import {
  requestCameraAccess,
  stopCameraStream,
  capturePhotoFromVideo,
  isCameraSupported,
} from "@/lib/camera";

interface CameraCapture Props {
  onCapture: (photoDataUrl: string) => void;
  onClose: () => void;
}

export function CameraCapture({ onCapture, onClose }: CameraCaptureProps) {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Initialize camera on mount
  useEffect(() => {
    if (!isCameraSupported()) {
      setError('Camera is not supported on this device');
      return;
    }

    startCamera();

    return () => {
      if (stream) {
        stopCameraStream(stream);
      }
    };
  }, [facingMode]);

  const startCamera = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const mediaStream = await requestCameraAccess({ facingMode });
      setStream(mediaStream);
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to access camera');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCapture = () => {
    if (!videoRef.current || !canvasRef.current) return;
    
    try {
      const photoDataUrl = capturePhotoFromVideo(videoRef.current, canvasRef.current);
      setCapturedPhoto(photoDataUrl);
    } catch (err) {
      setError('Failed to capture photo');
    }
  };

  const handleConfirm = () => {
    if (capturedPhoto) {
      onCapture(capturedPhoto);
      handleClose();
    }
  };

  const handleRetake = () => {
    setCapturedPhoto(null);
  };

  const handleFlipCamera = () => {
    if (stream) {
      stopCameraStream(stream);
    }
    setFacingMode(prev => prev === 'user' ? 'environment' : 'user');
  };

  const handleClose = () => {
    if (stream) {
      stopCameraStream(stream);
    }
    onClose();
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
        onClick={handleClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="relative w-full max-w-2xl bg-gray-900 rounded-2xl overflow-hidden shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 bg-gray-800">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <Camera className="w-5 h-5" />
              Camera
            </h3>
            <button
              onClick={handleClose}
              className="p-2 hover:bg-gray-700 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-white" />
            </button>
          </div>

          {/* Camera view */}
          <div className="relative aspect-video bg-black">
            {error ? (
              <div className="absolute inset-0 flex items-center justify-center text-red-400 p-8 text-center">
                <div>
                  <p className="text-lg font-semibold mb-2">Camera Error</p>
                  <p className="text-sm">{error}</p>
                </div>
              </div>
            ) : isLoading ? (
              <div className="absolute inset-0 flex items-center justify-center text-white">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
                  <p>Loading camera...</p>
                </div>
              </div>
            ) : capturedPhoto ? (
              <img
                src={capturedPhoto}
                alt="Captured"
                className="w-full h-full object-contain"
              />
            ) : (
              <>
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                />
                <canvas ref={canvasRef} className="hidden" />
              </>
            )}
          </div>

          {/* Controls */}
          <div className="p-6 bg-gray-800">
            {capturedPhoto ? (
              <div className="flex items-center justify-center gap-4">
                <button
                  onClick={handleRetake}
                  className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors flex items-center gap-2"
                >
                  <RefreshCw className="w-5 h-5" />
                  Retake
                </button>
                <button
                  onClick={handleConfirm}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors flex items-center gap-2"
                >
                  <Check className="w-5 h-5" />
                  Use Photo
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-center gap-4">
                <button
                  onClick={handleFlipCamera}
                  className="p-4 bg-gray-700 hover:bg-gray-600 rounded-full transition-colors"
                  title="Flip camera"
                >
                  <RefreshCw className="w-6 h-6 text-white" />
                </button>
                <button
                  onClick={handleCapture}
                  disabled={!stream || isLoading}
                  className="w-16 h-16 bg-white hover:bg-gray-200 rounded-full transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  <div className="w-14 h-14 border-4 border-gray-900 rounded-full"></div>
                </button>
                <div className="w-16"></div>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
