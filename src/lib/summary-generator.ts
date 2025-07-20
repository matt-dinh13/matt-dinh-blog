/**
 * Utility functions for generating and managing blog post summaries
 */

/**
 * Generates a summary from blog post content
 * @param content - The full blog post content
 * @param maxLength - Maximum length of the summary (default: 260 characters)
 * @returns Generated summary
 */
export function generateSummary(content: string, maxLength: number = 260): string {
  if (!content || content.trim().length === 0) {
    return ''
  }

  // Remove HTML tags
  const plainText = content.replace(/<[^>]+>/g, '').trim()
  
  if (plainText.length === 0) {
    return ''
  }

  // Remove extra whitespace and normalize
  const normalizedText = plainText.replace(/\s+/g, ' ').trim()
  
  // If content is shorter than max length, return as is
  if (normalizedText.length <= maxLength) {
    return normalizedText
  }

  // Find a good breaking point (end of sentence or word)
  const truncated = normalizedText.substring(0, maxLength)
  
  // Try to break at sentence end
  const lastSentenceEnd = truncated.lastIndexOf('.')
  const lastQuestionEnd = truncated.lastIndexOf('?')
  const lastExclamationEnd = truncated.lastIndexOf('!')
  
  const lastPunctuation = Math.max(lastSentenceEnd, lastQuestionEnd, lastExclamationEnd)
  
  if (lastPunctuation > maxLength * 0.7) { // If punctuation is in the last 30% of the text
    return truncated.substring(0, lastPunctuation + 1).trim()
  }
  
  // Otherwise, break at word boundary
  const lastSpace = truncated.lastIndexOf(' ')
  if (lastSpace > maxLength * 0.8) { // If space is in the last 20% of the text
    return truncated.substring(0, lastSpace).trim() + '...'
  }
  
  // Fallback: just truncate and add ellipsis
  return truncated.trim() + '...'
}

/**
 * Gets the best available summary for a blog post
 * @param content - The full blog post content
 * @param maxLength - Maximum length for generated summary
 * @returns Generated summary from content
 */
export function getBestSummary(content: string, maxLength: number = 260): string {
  // Generate summary directly from content
  return generateSummary(content, maxLength)
}

/**
 * Processes blog post translations to ensure they have summaries
 * @param translations - Array of blog post translations
 * @returns Processed translations with summaries
 */
export function processTranslationsWithSummaries(translations: Array<{
  language_code: string
  title: string
  summary: string
  content: string
}>): Array<{
  language_code: string
  title: string
  summary: string
  content: string
}> {
  return translations.map(translation => ({
    ...translation,
    summary: getBestSummary(translation.content)
  }))
} 