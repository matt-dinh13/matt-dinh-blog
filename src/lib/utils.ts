// Common constants
export const POSTS_PER_PAGE = 6
export const DEFAULT_THUMBNAIL = '/window.svg'
export const NAV_TEXT_COLOR = { color: 'oklch(21% .034 264.665)' }

// Date formatting utility
export function formatDate(dateString: string, language: string): string {
  return new Date(dateString).toLocaleDateString(
    language === 'vi' ? 'vi-VN' : 'en-US',
    { year: 'numeric', month: 'short', day: 'numeric' }
  )
}

// Thumbnail URL utility
export function getThumbnailUrl(thumbnailUrl: string | null): string {
  return thumbnailUrl || DEFAULT_THUMBNAIL
}

// Language utilities
export function getLanguageText(language: string, viText: string, enText: string): string {
  return language === 'vi' ? viText : enText
}

// Debounce utility for search and other input handlers
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout
  return (...args: Parameters<T>) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

// Error handling utility
export function handleError(error: any, context: string): void {
  console.error(`💥 ${context}:`, error)
  if (error?.message) {
    console.error(`💥 ${context} - Message:`, error.message)
  }
  if (error?.stack) {
    console.error(`💥 ${context} - Stack:`, error.stack)
  }
}

// Validation utilities
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export function isValidUrl(url: string): boolean {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

// String utilities
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength).trim() + '...'
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

// Array utilities
export function chunk<T>(array: T[], size: number): T[][] {
  const chunks: T[][] = []
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size))
  }
  return chunks
}

export function unique<T>(array: T[]): T[] {
  return [...new Set(array)]
}

// Object utilities
export function pick<T extends Record<string, any>, K extends keyof T>(obj: T, keys: K[]): Pick<T, K> {
  const result = {} as Pick<T, K>
  keys.forEach(key => {
    if (key in obj) {
      result[key] = obj[key]
    }
  })
  return result
}

/**
 * Calculate reading time for content
 * @param content - The content to calculate reading time for
 * @param languageCode - Language code ('en' or 'vi')
 * @returns Reading time in minutes
 */
export function calculateReadingTime(content: string, languageCode: string = 'en'): number {
  if (!content) return 0;
  
  // Strip HTML tags and get plain text
  const plainText = content.replace(/<[^>]+>/g, '');
  
  // Remove code blocks (content between ``` or `)
  const withoutCodeBlocks = plainText.replace(/```[\s\S]*?```/g, '').replace(/`[^`]*`/g, '');
  
  // Count words (split by whitespace and filter out empty strings)
  const words = withoutCodeBlocks.trim().split(/\s+/).filter(word => word.length > 0);
  
  // Different reading speeds for different languages
  const wordsPerMinute = languageCode === 'vi' ? 180 : 220; // Vietnamese is typically read slower
  
  const readingTime = Math.ceil(words.length / wordsPerMinute);
  
  // Ensure minimum reading time of 1 minute
  return Math.max(1, readingTime);
}

/**
 * Format reading time for display
 * @param minutes - Reading time in minutes
 * @param languageCode - Language code ('en' or 'vi')
 * @returns Formatted reading time string
 */
export function formatReadingTime(minutes: number, languageCode: string = 'en'): string {
  if (languageCode === 'vi') {
    return `${minutes} phút đọc`;
  }
  return `${minutes} min read`;
} 