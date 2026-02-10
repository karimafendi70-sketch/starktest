/**
 * Camera utilities for accessing device camera
 * Uses getUserMedia API for live camera access
 */

export interface CameraOptions {
  facingMode?: 'user' | 'environment'; // front or back camera
  width?: number;
  height?: number;
}

/**
 * Check if camera API is supported
 */
export function isCameraSupported(): boolean {
  return !!(
    navigator.mediaDevices &&
    navigator.mediaDevices.getUserMedia
  );
}

/**
 * Request camera access
 */
export async function requestCameraAccess(
  options: CameraOptions = {}
): Promise<MediaStream> {
  if (!isCameraSupported()) {
    throw new Error('Camera API is not supported in this browser');
  }

  const constraints: MediaStreamConstraints = {
    video: {
      facingMode: options.facingMode || 'user',
      width: options.width ? { ideal: options.width } : undefined,
      height: options.height ? { ideal: options.height } : undefined,
    },
    audio: false,
  };

  try {
    const stream = await navigator.mediaDevices.getUserMedia(constraints);
    return stream;
  } catch (error) {
    console.error('Camera access error:', error);
    throw new Error('Failed to access camera. Please grant camera permissions.');
  }
}

/**
 * Stop camera stream
 */
export function stopCameraStream(stream: MediaStream): void {
  stream.getTracks().forEach(track => track.stop());
}

/**
 * Capture photo from video element
 */
export function capturePhotoFromVideo(
  videoElement: HTMLVideoElement,
  canvasElement: HTMLCanvasElement
): string {
  const context = canvasElement.getContext('2d');
  if (!context) {
    throw new Error('Failed to get canvas context');
  }

  // Set canvas size to video size
  canvasElement.width = videoElement.videoWidth;
  canvasElement.height = videoElement.videoHeight;

  // Draw video frame to canvas
  context.drawImage(videoElement, 0, 0);

  // Return as base64 data URL
  return canvasElement.toDataURL('image/jpeg', 0.9);
}

/**
 * List available cameras
 */
export async function listCameras(): Promise<MediaDeviceInfo[]> {
  if (!isCameraSupported()) {
    return [];
  }

  try {
    const devices = await navigator.mediaDevices.enumerateDevices();
    return devices.filter(device => device.kind === 'videoinput');
  } catch (error) {
    console.error('Failed to enumerate devices:', error);
    return [];
  }
}
