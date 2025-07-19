# Software Requirements Specification (SRS)
## Matt Dinh Blog Platform

**Document Version:** 1.1  
**Date:** January 19, 2025  
**Author:** Matt Dinh  
**Project:** Personal Blog & Portfolio Platform

---

## 1. Introduction

### 1.1 Purpose
This document provides a detailed specification of the software requirements for the Matt Dinh Blog platform, a bilingual personal blog and portfolio system built with Next.js and Supabase.

### 1.2 Scope
The system encompasses a complete content management platform with public-facing blog and portfolio features, administrative interface, and bilingual support for English and Vietnamese languages.

### 1.3 Definitions and Acronyms
- **CMS:** Content Management System
- **SSR:** Server-Side Rendering
- **SSG:** Static Site Generation
- **API:** Application Programming Interface
- **UI/UX:** User Interface/User Experience
- **SEO:** Search Engine Optimization
- **i18n:** Internationalization
- **RLS:** Row Level Security
- **JPG:** Joint Photographic Experts Group (image format)

### 1.4 References
- Next.js Documentation: https://nextjs.org/docs
- Supabase Documentation: https://supabase.com/docs
- Tailwind CSS Documentation: https://tailwindcss.com/docs

---

## 2. System Overview

### 2.1 System Architecture
The platform follows a modern web application architecture:
- **Frontend:** Next.js 15 with App Router
- **Backend:** Supabase (PostgreSQL + Auth + Storage)
- **Styling:** Tailwind CSS
- **Deployment:** Vercel
- **Database:** PostgreSQL with Row Level Security (RLS)
- **Image Processing:** Client-side resizing and format conversion

### 2.2 System Context
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Public Users  │    │   Admin Users   │    │   External APIs │
└─────────┬───────┘    └─────────┬───────┘    └─────────┬───────┘
          │                      │                      │
          └──────────────────────┼──────────────────────┘
                                 │
                    ┌─────────────▼─────────────┐
                    │      Next.js App          │
                    │   (Frontend + API Routes) │
                    └─────────────┬─────────────┘
                                  │
                    ┌─────────────▼─────────────┐
                    │       Supabase            │
                    │  (Database + Auth + File) │
                    └───────────────────────────┘
```

### 2.3 Design Goals
- **Performance:** Fast loading times and optimal user experience
- **Scalability:** Architecture that can grow with content and traffic
- **Maintainability:** Clean, well-documented codebase
- **Security:** Protected admin area and secure data handling
- **Accessibility:** WCAG 2.1 AA compliance
- **Image Optimization:** Efficient image processing and delivery

---

## 3. Functional Requirements

### 3.1 User Management

#### 3.1.1 Authentication
- **FR-001:** Users must authenticate to access admin functions
- **FR-002:** Authentication must use Supabase Auth with email/password
- **FR-003:** Session management must persist across browser sessions
- **FR-004:** Logout functionality must clear all session data

#### 3.1.2 Authorization
- **FR-005:** Admin routes must be protected from unauthorized access
- **FR-006:** Role-based access control for different admin functions
- **FR-007:** Public routes must be accessible without authentication

### 3.2 Content Management

#### 3.2.1 Blog Posts
- **FR-008:** Create new blog posts with title, content, and metadata
- **FR-009:** Edit existing blog posts with full content management
- **FR-010:** Delete blog posts with confirmation
- **FR-011:** Publish/unpublish posts with status management
- **FR-012:** Support for draft and published states
- **FR-013:** Rich text editing with Markdown content support
- **FR-014:** Image upload and management for post thumbnails
- **FR-015:** Category and tag assignment for posts
- **FR-016:** Inline image upload within rich text editor
- **FR-017:** Automatic image processing (resize, format conversion)
- **FR-018:** Markdown to HTML conversion for image display
- **FR-019:** Hydration-safe content rendering

#### 3.2.2 Portfolio Projects
- **FR-020:** Create portfolio projects with detailed descriptions
- **FR-021:** Edit project information and media
- **FR-022:** Delete projects with confirmation
- **FR-023:** Project status management (active/inactive)
- **FR-024:** Image gallery support for project showcases

#### 3.2.3 Categories and Tags
- **FR-025:** Create and manage content categories
- **FR-026:** Create and manage content tags
- **FR-027:** Assign categories and tags to blog posts
- **FR-028:** Filter content by categories and tags

### 3.3 Public Interface

#### 3.3.1 Blog Display
- **FR-029:** Display blog posts in chronological order
- **FR-030:** Pagination support for large content collections
- **FR-031:** Individual blog post pages with full content
- **FR-032:** Related posts suggestions
- **FR-033:** Social sharing capabilities
- **FR-034:** Proper image rendering in blog content
- **FR-035:** Responsive image display with optimization

#### 3.3.2 Portfolio Display
- **FR-036:** Display portfolio projects in grid layout
- **FR-037:** Individual project detail pages
- **FR-038:** Project filtering and sorting options

#### 3.3.3 Search Functionality
- **FR-039:** Search blog posts by title and content
- **FR-040:** Search results with relevance ranking
- **FR-041:** Search suggestions and autocomplete
- **FR-042:** Search within specific categories or tags

### 3.4 Internationalization

#### 3.4.1 Language Support
- **FR-043:** Full English language support
- **FR-044:** Full Vietnamese language support
- **FR-045:** Language switching without page reload
- **FR-046:** Persistent language preference storage
- **FR-047:** Bilingual content management for all posts

#### 3.4.2 Content Localization
- **FR-048:** Separate content for each language
- **FR-049:** Language-specific URLs and routing
- **FR-050:** Localized date and time formatting
- **FR-051:** Reading time estimates for each language

### 3.5 Administrative Features

#### 3.5.1 Dashboard
- **FR-052:** Overview of content statistics
- **FR-053:** Recent activity and changes
- **FR-054:** Quick access to common functions
- **FR-055:** System status and health indicators

#### 3.5.2 Analytics
- **FR-056:** Page view tracking and statistics
- **FR-057:** Popular content identification
- **FR-058:** User engagement metrics
- **FR-059:** Traffic source analysis

---

## 4. Non-Functional Requirements

### 4.1 Performance Requirements
- **NFR-001:** Page load time must be <3 seconds on 3G connection
- **NFR-002:** Search results must return within 1 second
- **NFR-003:** Image optimization must reduce file sizes by >50%
- **NFR-004:** Database queries must complete within 500ms
- **NFR-005:** API responses must be cached appropriately
- **NFR-006:** Image processing must complete within 5 seconds
- **NFR-007:** Markdown to HTML conversion must be <100ms

### 4.2 Security Requirements
- **NFR-008:** All admin routes must require authentication
- **NFR-009:** Passwords must be hashed using bcrypt
- **NFR-010:** HTTPS must be enforced for all connections
- **NFR-011:** Input validation must prevent XSS attacks
- **NFR-012:** CSRF protection must be implemented
- **NFR-013:** Rate limiting must prevent abuse
- **NFR-014:** Image upload must validate file types and sizes
- **NFR-015:** Storage access must be properly secured

### 4.3 Usability Requirements
- **NFR-016:** Interface must be responsive on all device sizes
- **NFR-017:** Navigation must be intuitive and accessible
- **NFR-018:** Error messages must be clear and actionable
- **NFR-019:** Loading states must provide user feedback
- **NFR-020:** WCAG 2.1 AA accessibility compliance
- **NFR-021:** Image upload must provide progress feedback
- **NFR-022:** Content editing must be intuitive and error-free

### 4.4 Reliability Requirements
- **NFR-023:** System uptime must be >99.9%
- **NFR-024:** Data backup must occur daily
- **NFR-025:** Error logging must capture all system errors
- **NFR-026:** Graceful degradation for non-critical features
- **NFR-027:** Image processing must handle failures gracefully
- **NFR-028:** Content rendering must be consistent across browsers

### 4.5 Scalability Requirements
- **NFR-029:** System must support 10,000+ monthly visitors
- **NFR-030:** Database must handle 1000+ blog posts
- **NFR-031:** File storage must scale to 10GB+ of content
- **NFR-032:** Performance must not degrade with content growth
- **NFR-033:** Image storage must efficiently handle large files
- **NFR-034:** Content delivery must be optimized for global access

---

## 5. Image Management Requirements

### 5.1 Image Upload
- **IMG-001:** Support for common image formats (JPG, PNG, GIF, WebP)
- **IMG-002:** Automatic image resizing to 800px maximum width
- **IMG-003:** Format conversion to JPG for optimization
- **IMG-004:** Client-side image processing before upload
- **IMG-005:** Progress indication during upload process
- **IMG-006:** Error handling for failed uploads

### 5.2 Image Storage
- **IMG-007:** Secure storage in Supabase Storage
- **IMG-008:** Organized folder structure for different content types
- **IMG-009:** Public read access for blog images
- **IMG-010:** Authenticated write access for uploads
- **IMG-011:** Automatic cleanup of orphaned images

### 5.3 Image Display
- **IMG-012:** Responsive image rendering
- **IMG-013:** Lazy loading for performance
- **IMG-014:** Alt text support for accessibility
- **IMG-015:** Proper aspect ratio maintenance
- **IMG-016:** Fallback handling for broken images

### 5.4 Content Integration
- **IMG-017:** Markdown image syntax support
- **IMG-018:** HTML image tag generation
- **IMG-019:** Hydration-safe rendering
- **IMG-020:** Consistent display across languages

---

## 6. Technical Constraints

### 6.1 Browser Support
- Modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile browsers (iOS Safari, Chrome Mobile)
- Progressive enhancement for older browsers

### 6.2 Device Support
- Desktop computers (1920x1080 and above)
- Tablets (768px and above)
- Mobile phones (320px and above)

### 6.3 Network Constraints
- Support for slow 3G connections
- Graceful degradation for offline scenarios
- Efficient caching strategies

---

## 7. System Interfaces

### 7.1 User Interfaces
- Web-based admin interface
- Public-facing blog and portfolio
- Mobile-responsive design
- Accessibility-compliant components

### 7.2 Hardware Interfaces
- Standard web server requirements
- Sufficient storage for image content
- CDN integration for global delivery

### 7.3 Software Interfaces
- Supabase API integration
- Next.js framework
- Vercel deployment platform
- Image processing libraries

---

## 8. Quality Attributes

### 8.1 Performance
- Fast page load times
- Efficient image processing
- Optimized database queries
- Effective caching strategies

### 8.2 Security
- Secure authentication
- Protected admin areas
- Input validation
- Secure file handling

### 8.3 Usability
- Intuitive navigation
- Clear error messages
- Responsive design
- Accessibility compliance

### 8.4 Maintainability
- Clean code structure
- Comprehensive documentation
- Modular architecture
- Version control

---

*Document last updated: January 19, 2025* 