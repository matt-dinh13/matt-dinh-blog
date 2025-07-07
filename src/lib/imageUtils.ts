import heic2any from 'heic2any';
import imageCompression from 'browser-image-compression';

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
    console.error('Error extracting file path from URL:', error);
    return null;
  }
}

/**
 * Clean up old thumbnail file from Supabase Storage
 */
export async function cleanupOldThumbnail(oldThumbnailUrl: string | null, supabase: any): Promise<void> {
  if (!oldThumbnailUrl) return;
  
  try {
    const filePath = extractFilePathFromUrl(oldThumbnailUrl);
    if (!filePath) {
      console.warn('Could not extract file path from URL:', oldThumbnailUrl);
      return;
    }
    
    console.log('Cleaning up old thumbnail:', filePath);
    
    const { error } = await supabase.storage
      .from('blog-images')
      .remove([filePath]);
    
    if (error) {
      console.error('Error deleting old thumbnail:', error);
      // Don't throw error - cleanup failure shouldn't prevent the main operation
    } else {
      console.log('Successfully deleted old thumbnail:', filePath);
    }
  } catch (error) {
    console.error('Error in cleanupOldThumbnail:', error);
    // Don't throw error - cleanup failure shouldn't prevent the main operation
  }
}

/**
 * Convert HEIC file to JPG using multiple fallback methods
 */
export async function convertHeicToJpg(file: File): Promise<ImageConversionResult> {
  try {
    console.log('Attempting HEIC conversion for:', file.name);
    
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
      
      console.log('HEIC conversion successful with heic2any');
      return {
        file: convertedFile,
        preview: URL.createObjectURL(convertedFile),
        success: true
      };
    } catch (heicError) {
      console.log('heic2any failed, trying alternative methods:', heicError);
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
      
      console.log('HEIC conversion successful with reduced quality');
      return {
        file: convertedFile,
        preview: URL.createObjectURL(convertedFile),
        success: true
      };
    } catch (heicError2) {
      console.log('heic2any with reduced quality also failed:', heicError2);
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
      
      console.log('HEIC conversion successful with Canvas API');
      return {
        file: convertedFile,
        preview: URL.createObjectURL(convertedFile),
        success: true
      };
    } catch (canvasError) {
      console.log('Canvas API conversion failed:', canvasError);
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
      
      console.log('HEIC conversion successful with PNG intermediate');
      return {
        file: convertedFile,
        preview: URL.createObjectURL(convertedFile),
        success: true
      };
    } catch (pngError) {
      console.log('PNG intermediate conversion failed:', pngError);
    }

    // If all methods fail, throw a comprehensive error
    throw new Error('All HEIC conversion methods failed. This HEIC file appears to use an unsupported format variant. Please try converting it to JPG using your device\'s Photos app, or use an online converter like CloudConvert.com');

  } catch (error: any) {
    console.error('HEIC conversion completely failed:', error);
    return {
      file: file,
      preview: '',
      success: false,
      error: error.message || 'HEIC conversion failed'
    };
  }
}

/**
 * Process any image file (JPG, PNG, HEIC) and convert to JPG if needed
 */
export async function processImageFile(file: File): Promise<ImageConversionResult> {
  try {
    // Check if it's a HEIC file
    if (file.type === 'image/heic' || file.name.toLowerCase().endsWith('.heic')) {
      console.log('Processing HEIC file:', file.name);
      return await convertHeicToJpg(file);
    }
    
    // For JPG and PNG files, just compress them
    if (file.type === 'image/jpeg' || file.type === 'image/jpg' || file.type === 'image/png') {
      console.log('Processing JPG/PNG file:', file.name);
      
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
    
  } catch (error: any) {
    console.error('Image processing failed:', error);
    return {
      file: file,
      preview: '',
      success: false,
      error: error.message || 'Image processing failed'
    };
  }
}

/**
 * Validate file size and type
 */
export function validateImageFile(file: File): { valid: boolean; error?: string } {
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