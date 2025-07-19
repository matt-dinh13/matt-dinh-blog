# Refactoring Guide - Matt Dinh Blog

## 🚀 **Quick Start for Refactoring**

### Before Making Changes
1. **Kill existing processes**
   ```bash
   pkill -f "next dev"
   lsof -ti:3000,3001,3002,3003,3004,3005 | xargs kill -9 2>/dev/null
   ```

2. **Clean build cache**
   ```bash
   rm -rf .next
   ```

3. **Test current build**
   ```bash
   npm run build
   ```

### After Making Changes
1. **Build to check for errors**
   ```bash
   npm run build
   ```

2. **Start development server**
   ```bash
   npm run dev
   ```

3. **Test functionality**
   - Check shared images in both languages
   - Verify create/edit article consistency
   - Test image upload and insertion

## 🔧 **Common Refactoring Patterns**

### 1. **Component Updates**
```bash
# Use search_replace for precise edits
search_replace file_path old_string new_string

# Use edit_file for larger changes
edit_file target_file instructions code_edit
```

### 2. **API Changes**
- Always test API endpoints after changes
- Check database constraints
- Verify authentication and permissions

### 3. **Database Migrations**
- Use CASCADE when dropping functions
- Test migrations on development first
- Keep backup of current schema

## 📁 **Critical Files - Don't Break These**

### Core Components
- `src/app/admin/blog/edit/[id]/AdminBlogEditForm.tsx` - Edit article functionality
- `src/app/admin/blog/new/page.tsx` - Create article functionality
- `src/components/SharedImagesLibrary.tsx` - Shared images display
- `src/components/RichTextEditor.tsx` - Rich text editor with image support

### API Endpoints
- `src/app/api/shared-images/route.ts` - Shared images API
- `src/lib/supabase-server.ts` - Database connection
- `src/lib/imageUtils.ts` - Image processing utilities

### Database
- `scripts/create-shared-images-table.sql` - Shared images table
- `scripts/add-captions-to-shared-images.sql` - Caption support

## ⚠️ **Common Issues and Solutions**

### Build Errors
1. **TypeScript Errors**
   - Check import statements
   - Verify type definitions
   - Fix unused variables

2. **ESLint Warnings**
   - Fix unescaped entities (`&ldquo;` instead of `"`)
   - Add missing dependencies to useEffect
   - Remove unused imports

3. **Next.js Warnings**
   - Replace `<img>` with `<Image>` for optimization
   - Fix missing dependencies in hooks

### Runtime Errors
1. **Database Connection Issues**
   - Check environment variables
   - Verify Supabase configuration
   - Test API endpoints

2. **Component Errors**
   - Check prop types
   - Verify state management
   - Test component isolation

## 🎯 **Testing Checklist**

### Before Committing Changes
- [ ] Build successful (`npm run build`)
- [ ] No TypeScript errors
- [ ] ESLint warnings only (no errors)
- [ ] Development server starts (`npm run dev`)
- [ ] Shared images work in both languages
- [ ] Create/edit article pages consistent
- [ ] Image upload and insertion working
- [ ] Hover preview functionality
- [ ] Responsive design on mobile

### Manual Testing
1. **Create New Article**
   - Test Vietnamese and English content
   - Verify thumbnail upload
   - Check category and tag selection

2. **Edit Existing Article**
   - Test shared images panel
   - Verify image hover preview
   - Test manual image insertion
   - Check language switching

3. **Image Management**
   - Upload image in Vietnamese
   - Verify it appears in English panel
   - Test hover preview
   - Test manual insertion

## 🔄 **Rollback Strategy**

### If Build Fails
1. **Check git status**
   ```bash
   git status
   git diff
   ```

2. **Revert changes**
   ```bash
   git checkout -- filename
   # or
   git reset --hard HEAD
   ```

3. **Restore from backup**
   - Check `CONVERSATION_BACKUP.md`
   - Restore specific files if needed

### If Runtime Errors
1. **Check server logs**
   - Look for error messages
   - Check API endpoint responses

2. **Test individual components**
   - Isolate the problematic component
   - Test with minimal props

3. **Database issues**
   - Check Supabase dashboard
   - Verify table structure
   - Test API endpoints directly

## 📚 **Documentation Updates**

### When Making Changes
1. **Update CONVERSATION_BACKUP.md**
   - Document what was changed
   - Note any issues encountered
   - Update status and next steps

2. **Update feature documentation**
   - `docs/SHARED_IMAGES_FEATURE.md`
   - `docs/BRD.md` (if business requirements change)
   - `docs/FRD.md` (if functional requirements change)

3. **Update this guide**
   - Add new patterns
   - Document new issues
   - Update testing checklist

## 🚀 **Performance Optimization**

### Current Warnings to Address
1. **Image Optimization**
   ```tsx
   // Replace this:
   <img src={imageUrl} alt="description" />
   
   // With this:
   import Image from 'next/image'
   <Image src={imageUrl} alt="description" width={400} height={300} />
   ```

2. **React Hook Dependencies**
   ```tsx
   // Add missing dependencies:
   useEffect(() => {
     fetchData()
   }, [fetchData]) // Add fetchData to dependency array
   ```

3. **Unused Imports**
   ```tsx
   // Remove unused imports:
   // import { unusedFunction } from './utils' // Remove this line
   ```

## 🎯 **Best Practices**

### Code Organization
1. **Keep components focused**
   - Single responsibility
   - Clear prop interfaces
   - Proper error handling

2. **Use TypeScript effectively**
   - Define proper interfaces
   - Use strict type checking
   - Avoid `any` types

3. **Follow React patterns**
   - Use hooks properly
   - Manage state efficiently
   - Handle side effects correctly

### Testing Strategy
1. **Component testing**
   - Test individual components
   - Mock dependencies
   - Test edge cases

2. **Integration testing**
   - Test component interactions
   - Test API integration
   - Test user workflows

3. **Manual testing**
   - Test on different devices
   - Test with different data
   - Test error scenarios

---

## 📞 **Emergency Contacts**

### If Something Breaks
1. **Check this guide first**
2. **Review CONVERSATION_BACKUP.md**
3. **Test individual components**
4. **Rollback if necessary**

### Key Commands
```bash
# Kill all processes
pkill -f "next dev"

# Clean build
rm -rf .next && npm run build

# Start fresh
npm run dev

# Check status
git status && npm run build
```

---

**Remember**: Always test your changes before committing. The goal is to maintain a working system while improving the codebase.

**Last Updated**: January 2025
**Version**: 1.0.0 