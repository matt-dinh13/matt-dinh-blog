import React, { useState, useEffect, useCallback } from 'react'
import styles from './SharedImagesLibrary.module.css'

// Types
interface SharedImage {
  id: number
  blog_post_id: number
  image_url: string
  original_filename: string
  file_size: number
  created_at: string
  caption_vi?: string
  caption_en?: string
}

interface SharedImagesLibraryProps {
  blogPostId?: number
  language: 'vi' | 'en'
  onInsertImage: (imageUrl: string, caption?: string) => void
  className?: string
}

// Component
export default function SharedImagesLibrary({ 
  blogPostId, 
  language, 
  onInsertImage, 
  className = '' 
}: SharedImagesLibraryProps) {
  // State
  const [images, setImages] = useState<SharedImage[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Fetch shared images
  const fetchSharedImages = useCallback(async () => {
    try {
      setLoading(true)
      setError('')
      
      const url = typeof blogPostId === 'number' && blogPostId > 0
        ? `/api/shared-images?blogPostId=${blogPostId}`
        : `/api/shared-images`
      const response = await fetch(url)
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: Failed to fetch shared images`)
      }
      
      const data = await response.json()
      console.log('🔍 SharedImagesLibrary: Fetched images:', data)
      setImages(data.images || [])
    } catch (err) {
      console.error('Error fetching shared images:', err)
      setError('Failed to load shared images')
    } finally {
      setLoading(false)
    }
  }, [blogPostId])

  // Effects
  useEffect(() => {
    fetchSharedImages()
  }, [fetchSharedImages])

  // Event handlers
  const handleInsertImage = useCallback((image: SharedImage) => {
    const caption = language === 'vi' ? image.caption_vi : image.caption_en
    onInsertImage(image.image_url, caption)
  }, [language, onInsertImage])

  const handleImageLoad = useCallback((imageId: number) => {
    console.log('✅ Image loaded successfully for ID:', imageId)
  }, [])

  const handleImageError = useCallback((imageId: number) => {
    console.log('❌ Image failed to load for ID:', imageId)
  }, [])

  // Render helpers
  const renderLoadingState = () => (
    <div className={`${styles.loadingContainer} ${className}`}>
      <div className={styles.loadingSpinner}>
        <div className={styles.spinner}></div>
        <span className={styles.loadingText}>Loading shared images...</span>
      </div>
    </div>
  )

  const renderErrorState = () => (
    <div className={`${styles.errorContainer} ${className}`}>
      <div className={styles.errorText}>{error}</div>
    </div>
  )

  const renderEmptyState = () => (
    <div className={`${styles.emptyContainer} ${className}`}>
      <div className={styles.emptyText}>
        No shared images available. Upload images in any language version to see them here.
      </div>
    </div>
  )

  const renderImageCard = (image: SharedImage) => {
    const caption = language === 'vi' ? image.caption_vi : image.caption_en
    
    return (
      <div
        key={image.id}
        className={styles.imageCard}
        onClick={() => handleInsertImage(image)}
      >
        {/* Image container */}
        <div className={styles.imageContainer}>
          {/* Debug info */}
          <div className={styles.debugInfo}>
            ID: {image.id}
          </div>
          
          {/* Image */}
          <img
            src={image.image_url}
            alt={image.original_filename}
            className={styles.image}
            loading="lazy"
            onLoad={() => handleImageLoad(image.id)}
            onError={() => handleImageError(image.id)}
            crossOrigin="anonymous"
          />
          
          {/* Hover overlay */}
          <div className={styles.hoverOverlay}>
            <div className={styles.hoverText}>
              <div className={styles.hoverTextContent}>
                Click to insert
              </div>
            </div>
          </div>
        </div>
        
        {/* Image info */}
        <div className={styles.imageInfo}>
          {image.original_filename}
        </div>
        
        {/* Caption preview */}
        {caption && (
          <div className={styles.captionPreview}>
            &ldquo;{caption}&rdquo;
          </div>
        )}
      </div>
    )
  }

  // Main render
  if (loading) return renderLoadingState()
  if (error) return renderErrorState()
  if (images.length === 0) return renderEmptyState()

  return (
    <div className={`${styles.sharedImagesLibrary} ${className}`}>
      {/* Header */}
      <div className={styles.header}>
        <h3 className={styles.title}>
          📚 Shared Images Library ({images.length})
        </h3>
        <span className={styles.instruction}>
          Click to insert at cursor position
        </span>
      </div>
      
      {/* Image grid */}
      <div className={styles.imageGrid}>
        {images.map(renderImageCard)}
      </div>
    </div>
  )
} 