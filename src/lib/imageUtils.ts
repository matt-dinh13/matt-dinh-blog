import { logger } from './logger';
import { SupabaseClient } from '@supabase/supabase-js';

// Check if we're in a browser environment
const isBrowser = typeof window !== 'undefined';

export interface ImageConversionResult {
  file: File;
  preview: string;
  success: boolean;
  error?: string;
}

/**
 * Extract file path from Supabase Storage URL
 */
export function extractFilePathFromUrl(url: string): string | null {
  try {
    // Example URL: https://jpejuoyhuuwlgqvtwtrm.supabase.co/storage/v1/object/public/blog-images/thumbnails/1751912088709-thumbnail-1751912088708.jpg
    const urlObj = new URL(url);
    const pathParts = urlObj.pathname.split('/');
    
    // Find the index after 'object/public'
    const publicIndex = pathParts.findIndex(part => part === 'public');
    if (publicIndex === -1 || publicIndex >= pathParts.length - 1) {
      return null;
    }
    
    // Extract everything after 'public'
    const filePath = pathParts.slice(publicIndex + 1).join('/');
    return filePath;
  } catch (error) {
    logger.error('Error extracting file path from URL', {
      component: 'imageUtils',
      error: error instanceof Error ? error : new Error(String(error)),
      data: { url }
    });
    return null;
  }
}

/**
 * Clean up old thumbnail file from Supabase Storage
 */
export async function cleanupOldThumbnail(oldThumbnailUrl: string | null, supabase: SupabaseClient): Promise<void> {
  if (!oldThumbnailUrl) return;
  
  try {
    const filePath = extractFilePathFromUrl(oldThumbnailUrl);
    if (!filePath) {
      logger.warn('Could not extract file path from URL', {
        component: 'imageUtils',
        data: { oldThumbnailUrl }
      });
      return;
    }
    
    logger.debug('Cleaning up old thumbnail', {
      component: 'imageUtils',
      data: { filePath }
    });
    
    const { error } = await supabase.storage
      .from('blog-images')
      .remove([filePath]);
    
    if (error) {
      logger.error('Error deleting old thumbnail', {
        component: 'imageUtils',
        error: error,
        data: { filePath }
      });
      // Don't throw error - cleanup failure shouldn't prevent the main operation
    } else {
      logger.info('Successfully deleted old thumbnail', {
        component: 'imageUtils',
        data: { filePath }
      });
    }
  } catch (error) {
    logger.error('Error in cleanupOldThumbnail', {
      component: 'imageUtils',
      error: error instanceof Error ? error : new Error(String(error))
    });
    // Don't throw error - cleanup failure shouldn't prevent the main operation
  }
}

/**
 * Convert HEIC file to JPG using multiple fallback methods
 */
export async function convertHeicToJpg(file: File): Promise<ImageConversionResult> {
  if (!isBrowser) {
    return {
      file: file,
      preview: '',
      success: false,
      error: 'HEIC conversion is only available in browser environment'
    };
  }

  try {
    // Dynamically import heic2any
    const heic2any = (await import('heic2any')).default;
    
    logger.debug('Attempting HEIC conversion', {
      component: 'imageUtils',
      data: { fileName: file.name, fileType: file.type }
    });
    
    // Method 1: Try heic2any with default settings
    try {
      const convertedBlob = await heic2any({
        blob: file,
        toType: 'image/jpeg',
        quality: 0.8
      });
      
      const convertedFile = new File([convertedBlob as Blob], 
        file.name.replace(/\.(heic|HEIC)$/, '.jpg'), 
        { type: 'image/jpeg' }
      );
      
      logger.info('HEIC conversion successful with heic2any', {
        component: 'imageUtils',
        data: { fileName: convertedFile.name, fileSize: convertedFile.size }
      });
      return {
        file: convertedFile,
        preview: URL.createObjectURL(convertedFile),
        success: true
      };
    } catch (heicError) {
      logger.debug('heic2any failed, trying alternative methods', {
        component: 'imageUtils',
        error: heicError instanceof Error ? heicError : new Error(String(heicError))
      });
    }

    // Method 2: Try heic2any with different quality settings
    try {
      const convertedBlob = await heic2any({
        blob: file,
        toType: 'image/jpeg',
        quality: 0.6
      });
      
      const convertedFile = new File([convertedBlob as Blob], 
        file.name.replace(/\.(heic|HEIC)$/, '.jpg'), 
        { type: 'image/jpeg' }
      );
      
      logger.info('HEIC conversion successful with reduced quality', {
        component: 'imageUtils',
        data: { fileName: convertedFile.name, fileSize: convertedFile.size }
      });
      return {
        file: convertedFile,
        preview: URL.createObjectURL(convertedFile),
        success: true
      };
    } catch (heicError2) {
      logger.debug('heic2any with reduced quality also failed', {
        component: 'imageUtils',
        error: heicError2 instanceof Error ? heicError2 : new Error(String(heicError2))
      });
    }

    // Method 3: Try using Canvas API as fallback
    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      const imageLoadPromise = new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
      });
      
      img.src = URL.createObjectURL(file);
      await imageLoadPromise;
      
      canvas.width = img.width;
      canvas.height = img.height;
      ctx?.drawImage(img, 0, 0);
      
      const blob = await new Promise<Blob>((resolve) => {
        canvas.toBlob((blob) => {
          if (blob) resolve(blob);
        }, 'image/jpeg', 0.8);
      });
      
      const convertedFile = new File([blob], 
        file.name.replace(/\.(heic|HEIC)$/, '.jpg'), 
        { type: 'image/jpeg' }
      );
      
      logger.info('HEIC conversion successful with Canvas API', {
        component: 'imageUtils',
        data: { fileName: convertedFile.name, fileSize: convertedFile.size }
      });
      return {
        file: convertedFile,
        preview: URL.createObjectURL(convertedFile),
        success: true
      };
    } catch (canvasError) {
      logger.debug('Canvas API conversion failed', {
        component: 'imageUtils',
        error: canvasError instanceof Error ? canvasError : new Error(String(canvasError))
      });
    }

    // Method 4: Try heic2any with different output format
    try {
      const convertedBlob = await heic2any({
        blob: file,
        toType: 'image/png',
        quality: 0.8
      });
      
      // Then convert PNG to JPG using Canvas
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      const imageLoadPromise = new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
      });
      
      img.src = URL.createObjectURL(convertedBlob as Blob);
      await imageLoadPromise;
      
      canvas.width = img.width;
      canvas.height = img.height;
      ctx?.drawImage(img, 0, 0);
      
      const jpgBlob = await new Promise<Blob>((resolve) => {
        canvas.toBlob((blob) => {
          if (blob) resolve(blob);
        }, 'image/jpeg', 0.8);
      });
      
      const convertedFile = new File([jpgBlob], 
        file.name.replace(/\.(heic|HEIC)$/, '.jpg'), 
        { type: 'image/jpeg' }
      );
      
      logger.info('HEIC conversion successful with PNG intermediate', {
        component: 'imageUtils',
        data: { fileName: convertedFile.name, fileSize: convertedFile.size }
      });
      return {
        file: convertedFile,
        preview: URL.createObjectURL(convertedFile),
        success: true
      };
    } catch (pngError) {
      logger.debug('PNG intermediate conversion failed', {
        component: 'imageUtils',
        error: pngError instanceof Error ? pngError : new Error(String(pngError))
      });
    }

    // If all methods fail, throw a comprehensive error
    throw new Error('All HEIC conversion methods failed. This HEIC file appears to use an unsupported format variant. Please try converting it to JPG using your device\'s Photos app, or use an online converter like CloudConvert.com');

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'HEIC conversion failed';
    logger.error('HEIC conversion completely failed', {
      component: 'imageUtils',
      error: error instanceof Error ? error : new Error(String(error)),
      data: { fileName: file.name }
    });
    return {
      file: file,
      preview: '',
      success: false,
      error: errorMessage
    };
  }
}

/**
 * Process any image file (JPG, PNG, HEIC) and convert to JPG if needed
 */
export async function processImageFile(file: File): Promise<ImageConversionResult> {
  if (!isBrowser) {
    return {
      file: file,
      preview: '',
      success: false,
      error: 'Image processing is only available in browser environment'
    };
  }

  try {
    // Check if it's a HEIC file
    if (file.type === 'image/heic' || file.name.toLowerCase().endsWith('.heic')) {
      logger.debug('Processing HEIC file', {
        component: 'imageUtils',
        data: { fileName: file.name, fileType: file.type }
      });
      return await convertHeicToJpg(file);
    }
    
    // For JPG and PNG files, just compress them
    if (file.type === 'image/jpeg' || file.type === 'image/jpg' || file.type === 'image/png') {
      logger.debug('Processing JPG/PNG file', {
        component: 'imageUtils',
        data: { fileName: file.name, fileType: file.type }
      });
      
      // Dynamically import imageCompression
      const imageCompression = (await import('browser-image-compression')).default;
      
      // Compress the image
      const compressed = await imageCompression(file, { 
        maxSizeMB: 3, 
        useWebWorker: true,
        fileType: 'image/jpeg'
      });
      
      const convertedFile = new File([compressed], 
        file.name.replace(/\.(png|PNG)$/, '.jpg'), 
        { type: 'image/jpeg' }
      );
      
      return {
        file: convertedFile,
        preview: URL.createObjectURL(convertedFile),
        success: true
      };
    }
    
    throw new Error('Unsupported file type. Please use JPG, PNG, or HEIC files.');
    
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Image processing failed';
    logger.error('Image processing failed', {
      component: 'imageUtils',
      error: error instanceof Error ? error : new Error(String(error)),
      data: { fileName: file.name }
    });
    return {
      file: file,
      preview: '',
      success: false,
      error: errorMessage
    };
  }
}

/**
 * Validate file size and type
 */
export function validateImageFile(file: File): { valid: boolean; error?: string } {
  if (!isBrowser) {
    return { valid: false, error: 'File validation is only available in browser environment' };
  }

  const maxSize = 50 * 1024 * 1024; // 50MB
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/heic'];
  
  if (file.size > maxSize) {
    return { valid: false, error: 'File size too large. Maximum size is 50MB.' };
  }
  
  if (!allowedTypes.includes(file.type) && !file.name.toLowerCase().endsWith('.heic')) {
    return { valid: false, error: 'Unsupported file type. Please use JPG, PNG, or HEIC files.' };
  }
  
  return { valid: true };
} 