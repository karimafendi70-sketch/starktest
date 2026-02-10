/**
 * Image processing utilities
 * Handles compression, resizing, and thumbnail generation
 */

export interface ProcessedImage {
  dataUrl: string;
  width: number;
  height: number;
  size: number;
  format: string;
}

/**
 * Compress image to target size
 */
export async function compressImage(
  dataUrl: string,
  maxSizeBytes: number = 2 * 1024 * 1024 // 2MB default
): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        reject(new Error('Failed to get canvas context'));
        return;
      }

      // Calculate new dimensions while maintaining aspect ratio
      let width = img.width;
      let height = img.height;
      const maxDimension = 1920;

      if (width > maxDimension || height > maxDimension) {
        if (width > height) {
          height = (height / width) * maxDimension;
          width = maxDimension;
        } else {
          width = (width / height) * maxDimension;
          height = maxDimension;
        }
      }

      canvas.width = width;
      canvas.height = height;
      ctx.drawImage(img, 0, 0, width, height);

      // Try different quality levels to meet size requirement
      let quality = 0.9;
      let result = canvas.toDataURL('image/jpeg', quality);
      
      while (result.length > maxSizeBytes * 1.37 && quality > 0.1) {
        quality -= 0.1;
        result = canvas.toDataURL('image/jpeg', quality);
      }

      resolve(result);
    };

    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = dataUrl;
  });
}

/**
 * Generate thumbnail from image
 */
export async function generateThumbnail(
  dataUrl: string,
  size: number = 150
): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        reject(new Error('Failed to get canvas context'));
        return;
      }

      // Calculate dimensions for square thumbnail
      const minDimension = Math.min(img.width, img.height);
      const sx = (img.width - minDimension) / 2;
      const sy = (img.height - minDimension) / 2;

      canvas.width = size;
      canvas.height = size;
      
      // Draw cropped and scaled image
      ctx.drawImage(
        img,
        sx,
        sy,
        minDimension,
        minDimension,
        0,
        0,
        size,
        size
      );

      resolve(canvas.toDataURL('image/jpeg', 0.8));
    };

    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = dataUrl;
  });
}

/**
 * Get image metadata
 */
export async function getImageMetadata(dataUrl: string): Promise<{
  width: number;
  height: number;
  size: number;
  format: string;
}> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    
    img.onload = () => {
      // Extract format from data URL
      const formatMatch = dataUrl.match(/^data:(.+);base64,/);
      const format = formatMatch ? formatMatch[1] : 'image/jpeg';
      
      // Calculate size (approximate from base64)
      const base64Length = dataUrl.split(',')[1].length;
      const size = Math.floor((base64Length * 3) / 4);

      resolve({
        width: img.width,
        height: img.height,
        size,
        format,
      });
    };

    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = dataUrl;
  });
}

/**
 * Convert file to data URL
 */
export function fileToDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
}

/**
 * Validate image file
 */
export function isValidImageFile(file: File): boolean {
  const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
  const maxSize = 10 * 1024 * 1024; // 10MB

  return validTypes.includes(file.type) && file.size <= maxSize;
}
