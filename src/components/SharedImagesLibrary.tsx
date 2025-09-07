import React, { useState, useEffect, useCallback } from 'react'
import styles from './SharedImagesLibrary.module.css'
import { logger } from '@/lib/logger'

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

interface TempImage {
  url: string
  filename: string
  fileSize: number
}

interface SharedImagesLibraryProps {
  refreshTrigger?: number
  tempImages?: TempImage[]
  // generalized entity
  entityType?: 'blog' | 'portfolio'
  entityId?: number
  // backward compatibility (blog only)
  blogPostId?: number
  language: 'vi' | 'en'
  onInsertImage: (imageUrl: string, caption?: string) => void
  className?: string
}

// Component
export default function SharedImagesLibrary({ tempImages = [], refreshTrigger = 0, 
  entityType,
  entityId,
  blogPostId, 
  language, 
  onInsertImage, 
  className = '' 
}: SharedImagesLibraryProps) {
  // State
  const [images, setImages] = useState<SharedImage[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const effectiveEntityType = entityType || (typeof blogPostId === 'number' ? 'blog' : undefined)
  const effectiveEntityId = typeof entityId === 'number' ? entityId : (typeof blogPostId === 'number' ? blogPostId : undefined)

  // Fetch shared images
  const fetchSharedImages = useCallback(async () => {
    try {
      setLoading(true)
      setError('')
      
      // New entity (no id yet) -> empty
      if (!effectiveEntityType || typeof effectiveEntityId !== 'number') {
        setImages([])
        setLoading(false)
        return
      }

      const params = new URLSearchParams()
      params.set('entityType', effectiveEntityType)
      params.set('entityId', String(effectiveEntityId))
      const url = `/api/shared-images?${params.toString()}`

      const response = await fetch(url)
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: Failed to fetch shared images`)
      }
      
      const data = await response.json()
      logger.debug('Fetched shared images successfully', {
        component: 'SharedImagesLibrary',
        data: { count: data?.images?.length || 0, entityType: effectiveEntityType, entityId: effectiveEntityId }
      })
      setImages(data.images || [])
    } catch (err) {
      logger.error('Error fetching shared images', {
        component: 'SharedImagesLibrary',
        error: err instanceof Error ? err : new Error(String(err)),
        data: { entityType: effectiveEntityType, entityId: effectiveEntityId }
      })
      setError('Failed to load shared images')
    } finally {
      setLoading(false)
    }
  }, [effectiveEntityType, effectiveEntityId])

  // Effects
  useEffect(() => {
    fetchSharedImages()
  }, [fetchSharedImages])

  // Refresh when refreshTrigger changes
  useEffect(() => {
    if (refreshTrigger && effectiveEntityType && typeof effectiveEntityId === 'number') {
      fetchSharedImages()
    }
  }, [refreshTrigger, fetchSharedImages, effectiveEntityType, effectiveEntityId])

  // Event handlers
  const handleInsertImage = useCallback((image: SharedImage) => {
    const caption = language === 'vi' ? image.caption_vi : image.caption_en
    onInsertImage(image.image_url, caption)
  }, [language, onInsertImage])

  const handleImageLoad = useCallback((imageId: number) => {
    logger.debug('Image loaded successfully', {
      component: 'SharedImagesLibrary',
      data: { imageId }
    })
  }, [])

  const handleImageError = useCallback((imageId: number) => {
    logger.warn('Image failed to load', {
      component: 'SharedImagesLibrary',
      data: { imageId }
    })
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
        No images yet. Upload some images to see them here.
      </div>
    </div>
  )

  const renderTempImageCard = (image: TempImage) => {
    return (
      <div 
        key={image.url} 
        className={styles.imageCard}
        onClick={() => onInsertImage(image.url)}
      >
        <div className={styles.imageContainer}>
          <img 
            src={image.url} 
            alt={image.filename}
            className={styles.image}
            onLoad={() => {}}
            onError={() => {}}
          />
        </div>
        <div className={styles.imageInfo}>
          {image.filename}
        </div>
      </div>
    )
  }

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
  if (images.length === 0 && tempImages.length === 0) return renderEmptyState()

  return (
    <div className={`${styles.sharedImagesLibrary} ${className}`}>
      {/* Header */}
      <div className={styles.header}>
        <h3 className={styles.title}>
          📚 Shared Images Library ({images.length + tempImages.length})
        </h3>
        <span className={styles.instruction}>
          Click to insert at cursor position
        </span>
      </div>
      
      {/* Image grid */}
      <div className={styles.imageGrid}>
        {tempImages.map(renderTempImageCard)}
        {images.map(renderImageCard)}
      </div>
    </div>
  )
} 

