# SharedImagesLibrary Component

## Overview
The `SharedImagesLibrary` component displays a grid of shared images for a specific blog post, allowing users to insert images into their content while maintaining aspect ratios and fixed heights.

## Features
- ✅ **Fixed Height Display**: All images maintain a consistent 118px height
- ✅ **Aspect Ratio Preservation**: Images use `object-fit: contain` to maintain proportions
- ✅ **Responsive Grid**: Adapts from 2 columns (mobile) to 4 columns (desktop)
- ✅ **Hover Effects**: Visual feedback with overlay and border color changes
- ✅ **Loading States**: Proper loading, error, and empty state handling
- ✅ **Debug Information**: Shows image IDs for troubleshooting
- ✅ **Caption Support**: Displays captions in the current language
- ✅ **Click to Insert**: Integrates with rich text editor

## File Structure
```
src/components/
├── SharedImagesLibrary.tsx          # Main component
├── SharedImagesLibrary.module.css   # Scoped styles
└── SharedImagesLibrary.md          # This documentation
```

## Props Interface
```typescript
interface SharedImagesLibraryProps {
  blogPostId: number           // ID of the blog post
  language: 'vi' | 'en'        // Current language
  onInsertImage: (imageUrl: string, caption?: string) => void  // Callback for image insertion
  className?: string           // Optional additional CSS classes
}
```

## Data Interface
```typescript
interface SharedImage {
  id: number                   // Unique image ID
  blog_post_id: number         // Associated blog post ID
  image_url: string           // Full image URL
  original_filename: string    // Original file name
  file_size: number           // File size in bytes
  created_at: string          // Creation timestamp
  caption_vi?: string         // Vietnamese caption (optional)
  caption_en?: string         // English caption (optional)
}
```

## Key Implementation Details

### 1. **CSS Modules for Style Isolation**
- Uses CSS modules to prevent global style conflicts
- All styles are scoped to the component
- No dependency on global CSS classes

### 2. **Performance Optimizations**
- `useCallback` for all event handlers to prevent unnecessary re-renders
- Lazy loading for images (`loading="lazy"`)
- Efficient state management with proper error handling

### 3. **Responsive Design**
- Mobile: 2 columns
- Tablet: 3 columns  
- Desktop: 4 columns
- Fixed height containers prevent layout shifts

### 4. **Error Handling**
- Network error handling with user-friendly messages
- Image load/error tracking for debugging
- Graceful fallbacks for missing data

## Usage Example
```tsx
import SharedImagesLibrary from '@/components/SharedImagesLibrary'

function BlogEditor() {
  const handleInsertImage = (imageUrl: string, caption?: string) => {
    // Insert image into rich text editor
    editor.insertImage(imageUrl, caption)
  }

  return (
    <SharedImagesLibrary
      blogPostId={42}
      language="en"
      onInsertImage={handleInsertImage}
      className="mt-4"
    />
  )
}
```

## API Integration
The component fetches data from `/api/shared-images?blogPostId={id}` and expects:
```json
{
  "images": [
    {
      "id": 11,
      "blog_post_id": 42,
      "image_url": "https://...",
      "original_filename": "image.jpg",
      "file_size": 123456,
      "created_at": "2025-01-19T...",
      "caption_vi": "Vietnamese caption",
      "caption_en": "English caption"
    }
  ]
}
```

## Styling Architecture
- **CSS Modules**: Scoped styles prevent conflicts
- **Semantic Class Names**: Clear, descriptive class names
- **Responsive Design**: Mobile-first approach
- **Accessibility**: Proper contrast ratios and hover states

## Maintenance Notes
- ✅ **No Global Dependencies**: Component is self-contained
- ✅ **TypeScript**: Full type safety
- ✅ **Documentation**: Comprehensive inline comments
- ✅ **Error Boundaries**: Proper error handling
- ✅ **Testing Ready**: Pure functions and clear interfaces

## Future Enhancements
- [ ] Image search/filtering
- [ ] Bulk selection
- [ ] Drag and drop reordering
- [ ] Image metadata editing
- [ ] Thumbnail generation
- [ ] Image compression options

## Troubleshooting
1. **Images not displaying**: Check network tab for failed requests
2. **Layout issues**: Verify CSS module is properly imported
3. **Performance**: Monitor image sizes and consider lazy loading
4. **Styling conflicts**: Ensure no global CSS overrides component styles 