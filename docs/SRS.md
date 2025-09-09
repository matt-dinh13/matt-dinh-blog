# Software Requirements Specification (SRS)
## Matt Dinh Blog Platform

**Version**: 3.0  
**Date**: January 9, 2025  
**Status**: Production Ready ✅  
**Next Review**: Quarterly maintenance

---

## 1. Introduction

### 1.1 Purpose
This Software Requirements Specification (SRS) document describes the functional and non-functional requirements for the Matt Dinh Blog Platform. The system is a modern, bilingual blog and portfolio platform built with Next.js 15 and Supabase, now fully deployed to production with advanced shared images management capabilities.

### 1.2 Scope
The system provides:
- **Content Management**: Blog posts and portfolio projects with rich text editing
- **Shared Images Management**: Entity-scoped image storage and retrieval
- **Bilingual Support**: Vietnamese and English content management
- **Admin Interface**: Comprehensive content and image management
- **Public Interface**: User-friendly blog and portfolio showcase
- **Production Infrastructure**: Vercel deployment with Supabase backend

### 1.3 Definitions and Acronyms
- **SRS**: Software Requirements Specification
- **API**: Application Programming Interface
- **CRUD**: Create, Read, Update, Delete
- **RTE**: Rich Text Editor
- **I18n**: Internationalization
- **L10n**: Localization
- **SSR**: Server-Side Rendering
- **CSR**: Client-Side Rendering
- **RLS**: Row Level Security
- **CDN**: Content Delivery Network

---

## 2. Overall Description

### 2.1 Product Perspective
The Matt Dinh Blog Platform is a standalone web application that serves as both a personal blog and portfolio showcase. The system integrates with:
- **Supabase**: Database, authentication, and storage services
- **Vercel**: Hosting and deployment platform
- **Next.js**: React framework for web applications

### 2.2 Product Functions
- **Content Management System**: Create, edit, and manage blog posts and portfolio projects
- **Shared Images Library**: Entity-scoped image storage and management
- **Bilingual Content Management**: Vietnamese and English content support
- **Admin Dashboard**: Comprehensive management interface
- **Public Website**: User-facing blog and portfolio showcase
- **Search Functionality**: Content search across all pages
- **Activity Logging**: System activity tracking and monitoring

### 2.3 User Classes and Characteristics
- **Admin Users**: Content creators and system administrators
- **Public Users**: Website visitors and content consumers
- **System Administrators**: Platform maintenance and configuration

### 2.4 Operating Environment
- **Production**: Vercel hosting with Supabase backend
- **Development**: Local development with Supabase development instance
- **Browsers**: Modern browsers supporting ES6+ and React 18
- **Mobile**: Responsive design for mobile devices

---

## 3. Specific Requirements

### 3.1 Functional Requirements

#### 3.1.1 Authentication and Authorization

**FR-001: User Authentication**
- **Description**: System shall provide secure user authentication
- **Input**: Email and password
- **Processing**: Validate credentials against Supabase Auth
- **Output**: Authenticated user session
- **Priority**: High
- **Implementation**: `src/components/AuthProvider.tsx`

**FR-002: Route Protection**
- **Description**: System shall protect admin routes from unauthorized access
- **Input**: Route access request
- **Processing**: Check user authentication status
- **Output**: Allow access or redirect to login
- **Priority**: High
- **Implementation**: `src/components/ProtectedRoute.tsx`

**FR-003: Session Management**
- **Description**: System shall maintain user sessions securely
- **Input**: User authentication state
- **Processing**: Manage session tokens and refresh
- **Output**: Persistent user session
- **Priority**: High
- **Implementation**: `src/components/AuthProvider.tsx`

#### 3.1.2 Content Management System

**FR-004: Blog Post Creation**
- **Description**: System shall allow creation of new blog posts
- **Input**: Title, content, metadata, images
- **Processing**: Validate input, process images, store in database
- **Output**: New blog post with unique ID
- **Priority**: High
- **Implementation**: `src/app/admin/blog/new/page.tsx`

**FR-005: Blog Post Editing**
- **Description**: System shall allow editing of existing blog posts
- **Input**: Blog post ID, updated content
- **Processing**: Validate changes, update database, process images
- **Output**: Updated blog post
- **Priority**: High
- **Implementation**: `src/app/admin/blog/edit/[id]/page.tsx`

**FR-006: Blog Post Deletion**
- **Description**: System shall allow safe deletion of blog posts
- **Input**: Blog post ID, confirmation
- **Processing**: Validate deletion, remove from database, cleanup images
- **Output**: Deleted blog post confirmation
- **Priority**: Medium
- **Implementation**: `src/app/admin/blog/edit/[id]/AdminBlogEditForm.tsx`

**FR-007: Portfolio Project Creation**
- **Description**: System shall allow creation of new portfolio projects
- **Input**: Project details, content, images, links
- **Processing**: Validate input, process images, store in database
- **Output**: New portfolio project with unique ID
- **Priority**: High
- **Implementation**: `src/app/admin/portfolio/new/page.tsx`

**FR-008: Portfolio Project Editing**
- **Description**: System shall allow editing of existing portfolio projects
- **Input**: Project ID, updated content
- **Processing**: Validate changes, update database, process images
- **Output**: Updated portfolio project
- **Priority**: High
- **Implementation**: `src/app/admin/portfolio/edit/[id]/page.tsx`

**FR-009: Content Status Management**
- **Description**: System shall manage draft and published content status
- **Input**: Content ID, status change
- **Processing**: Update status in database
- **Output**: Updated content status
- **Priority**: High
- **Implementation**: `src/app/admin/blog/edit/[id]/AdminBlogEditForm.tsx`

#### 3.1.3 Shared Images Management System

**FR-010: Entity-Scoped Image Storage**
- **Description**: System shall store images scoped to specific content entities
- **Input**: Image file, entity type, entity ID
- **Processing**: Upload to Supabase Storage, store metadata in database
- **Output**: Image URL and metadata
- **Priority**: High
- **Implementation**: `src/app/api/shared-images/route.ts`

**FR-011: Blog Post Image Association**
- **Description**: System shall associate images with specific blog posts
- **Input**: Image URL, blog post ID
- **Processing**: Create association in shared_images table
- **Output**: Image-blog post association
- **Priority**: High
- **Implementation**: `src/components/SharedImagesLibrary.tsx`

**FR-012: Portfolio Image Association**
- **Description**: System shall associate images with specific portfolio projects
- **Input**: Image URL, portfolio project ID
- **Processing**: Create association in shared_images table
- **Output**: Image-portfolio association
- **Priority**: High
- **Implementation**: `src/components/SharedImagesLibrary.tsx`

**FR-013: Temporary Image Storage**
- **Description**: System shall store images temporarily during content creation
- **Input**: Image file, temporary storage flag
- **Processing**: Store in temporary location, track in state
- **Output**: Temporary image reference
- **Priority**: Medium
- **Implementation**: `src/components/RichTextEditor.tsx`

**FR-014: Image Library Display**
- **Description**: System shall display images in rich text editor library
- **Input**: Entity type, entity ID
- **Processing**: Query images for specific entity
- **Output**: Image library with thumbnails
- **Priority**: High
- **Implementation**: `src/components/SharedImagesLibrary.tsx`

**FR-015: Cross-Entity Image Separation**
- **Description**: System shall maintain complete separation between different content types
- **Input**: Entity type, entity ID
- **Processing**: Filter images by entity type and ID
- **Output**: Entity-specific image list
- **Priority**: High
- **Implementation**: `src/app/api/shared-images/route.ts`

**FR-016: Image Cleanup**
- **Description**: System shall clean up unused images automatically
- **Input**: Content deletion request
- **Processing**: Identify orphaned images, remove from storage
- **Output**: Cleanup confirmation
- **Priority**: Medium
- **Implementation**: `src/app/api/shared-images/route.ts`

**FR-017: Admin Image Management**
- **Description**: System shall provide admin interface for image management
- **Input**: Admin user access
- **Processing**: Display all images with entity information
- **Output**: Image management interface
- **Priority**: Medium
- **Implementation**: `src/app/admin/shared-images/page.tsx`

#### 3.1.4 Rich Text Editor

**FR-018: Rich Text Editing**
- **Description**: System shall provide rich text editing capabilities
- **Input**: Text content, formatting commands
- **Processing**: Render rich text editor with toolbar
- **Output**: Formatted content
- **Priority**: High
- **Implementation**: `src/components/RichTextEditor.tsx`

**FR-019: Image Upload Integration**
- **Description**: System shall integrate image upload with rich text editor
- **Input**: Image file selection
- **Processing**: Upload image, insert into editor
- **Output**: Image embedded in content
- **Priority**: High
- **Implementation**: `src/components/RichTextEditor.tsx`

**FR-020: Markdown Support**
- **Description**: System shall support markdown formatting
- **Input**: Markdown text
- **Processing**: Parse and render markdown
- **Output**: Formatted HTML content
- **Priority**: High
- **Implementation**: `src/components/RichTextEditor.tsx`

**FR-021: Image Processing**
- **Description**: System shall process images for optimization
- **Input**: Image file
- **Processing**: Resize, compress, convert format
- **Output**: Optimized image file
- **Priority**: High
- **Implementation**: `src/lib/imageUtils.ts`

#### 3.1.5 Internationalization

**FR-022: Language Switching**
- **Description**: System shall allow switching between Vietnamese and English
- **Input**: Language selection
- **Processing**: Update UI and content language
- **Output**: Localized interface
- **Priority**: High
- **Implementation**: `src/components/LanguageSwitcher.tsx`

**FR-023: Bilingual Content Management**
- **Description**: System shall manage content in both languages
- **Input**: Content in Vietnamese and English
- **Processing**: Store and retrieve language-specific content
- **Output**: Bilingual content display
- **Priority**: High
- **Implementation**: `src/app/[lang]/` routes

**FR-024: Language-Specific URLs**
- **Description**: System shall provide language-specific URLs
- **Input**: Content request with language prefix
- **Processing**: Route to appropriate language content
- **Output**: Language-specific content page
- **Priority**: High
- **Implementation**: `src/app/[lang]/` routing

**FR-025: Localized Date Formatting**
- **Description**: System shall format dates according to language preference
- **Input**: Date value, language setting
- **Processing**: Apply language-specific date formatting
- **Output**: Localized date display
- **Priority**: Medium
- **Implementation**: `src/components/BlogCard.tsx`

#### 3.1.6 Public Interface

**FR-026: Blog Listing**
- **Description**: System shall display paginated list of blog posts
- **Input**: Page request
- **Processing**: Query published blog posts, paginate results
- **Output**: Blog post list page
- **Priority**: High
- **Implementation**: `src/app/blog/page.tsx`

**FR-027: Individual Blog Post**
- **Description**: System shall display individual blog post content
- **Input**: Blog post slug
- **Processing**: Query blog post by slug, render content
- **Output**: Blog post detail page
- **Priority**: High
- **Implementation**: `src/app/blog/[slug]/page.tsx`

**FR-028: Portfolio Listing**
- **Description**: System shall display portfolio projects
- **Input**: Page request
- **Processing**: Query published portfolio projects
- **Output**: Portfolio listing page
- **Priority**: High
- **Implementation**: `src/app/portfolio/page.tsx`

**FR-029: Individual Portfolio Project**
- **Description**: System shall display individual portfolio project
- **Input**: Portfolio project slug
- **Processing**: Query project by slug, render content
- **Output**: Portfolio project detail page
- **Priority**: High
- **Implementation**: `src/app/portfolio/[slug]/page.tsx`

**FR-030: Search Functionality**
- **Description**: System shall provide content search
- **Input**: Search query
- **Processing**: Search across blog posts and portfolio projects
- **Output**: Search results page
- **Priority**: Medium
- **Implementation**: `src/app/search/page.tsx`

#### 3.1.7 Administrative Interface

**FR-031: Admin Dashboard**
- **Description**: System shall provide admin dashboard overview
- **Input**: Admin user access
- **Processing**: Display system statistics and quick actions
- **Output**: Admin dashboard page
- **Priority**: High
- **Implementation**: `src/app/admin/page.tsx`

**FR-032: Content Management Interface**
- **Description**: System shall provide content management interface
- **Input**: Admin user access
- **Processing**: Display content management options
- **Output**: Content management interface
- **Priority**: High
- **Implementation**: `src/app/admin/blog/page.tsx`

**FR-033: Activity Logging**
- **Description**: System shall log all administrative activities
- **Input**: Admin action
- **Processing**: Record action in activity log
- **Output**: Activity log entry
- **Priority**: Medium
- **Implementation**: `src/app/admin/activity-log/page.tsx`

**FR-034: Image Management Interface**
- **Description**: System shall provide image management interface
- **Input**: Admin user access
- **Processing**: Display all images with entity information
- **Output**: Image management interface
- **Priority**: Medium
- **Implementation**: `src/app/admin/shared-images/page.tsx`

#### 3.1.8 Unsaved Changes Protection

**FR-035: Unsaved Changes Warning**
- **Description**: System shall warn users about unsaved changes
- **Input**: Navigation attempt with unsaved changes
- **Processing**: Detect unsaved changes, show warning
- **Output**: User confirmation dialog
- **Priority**: High
- **Implementation**: `src/components/hooks/useUnsavedChangesWarning.ts`

**FR-036: Navigation Interception**
- **Description**: System shall intercept navigation attempts
- **Input**: Navigation action (click, back button, etc.)
- **Processing**: Check for unsaved changes, show warning if needed
- **Output**: Allow or block navigation
- **Priority**: High
- **Implementation**: `src/components/hooks/useUnsavedChangesWarning.ts`

### 3.2 Non-Functional Requirements

#### 3.2.1 Performance Requirements

**NFR-001: Page Load Time**
- **Description**: All pages shall load within 3 seconds
- **Measurement**: Time from request to fully rendered page
- **Priority**: High
- **Implementation**: Server-side rendering, image optimization

**NFR-002: Image Processing Time**
- **Description**: Image upload and processing shall complete within 5 seconds
- **Measurement**: Time from upload start to processing completion
- **Priority**: High
- **Implementation**: Client-side image compression

**NFR-003: Database Query Performance**
- **Description**: Database queries shall complete within 1 second
- **Measurement**: Time from query execution to result return
- **Priority**: High
- **Implementation**: Database indexing, query optimization

**NFR-004: Search Performance**
- **Description**: Search results shall be returned within 2 seconds
- **Measurement**: Time from search query to results display
- **Priority**: Medium
- **Implementation**: Search indexing, query optimization

#### 3.2.2 Scalability Requirements

**NFR-005: Content Volume**
- **Description**: System shall support 1000+ blog posts
- **Measurement**: Maximum number of blog posts
- **Priority**: Medium
- **Implementation**: Pagination, database optimization

**NFR-006: Image Storage**
- **Description**: System shall support 10,000+ images
- **Measurement**: Maximum number of stored images
- **Priority**: Medium
- **Implementation**: Supabase Storage, image optimization

**NFR-007: Concurrent Users**
- **Description**: System shall handle 1000+ concurrent users
- **Measurement**: Maximum simultaneous users
- **Priority**: Medium
- **Implementation**: Vercel scaling, CDN

#### 3.2.3 Reliability Requirements

**NFR-008: System Uptime**
- **Description**: System shall maintain 99.9% uptime
- **Measurement**: Percentage of time system is available
- **Priority**: High
- **Implementation**: Vercel hosting, monitoring

**NFR-009: Data Backup**
- **Description**: System shall maintain automated backups
- **Measurement**: Daily automated backups
- **Priority**: High
- **Implementation**: Supabase backup system

**NFR-010: Error Recovery**
- **Description**: System shall recover gracefully from errors
- **Measurement**: Error handling and recovery time
- **Priority**: High
- **Implementation**: Error boundaries, fallback UI

#### 3.2.4 Security Requirements

**NFR-011: Authentication Security**
- **Description**: System shall use secure authentication
- **Measurement**: Industry-standard security practices
- **Priority**: High
- **Implementation**: Supabase Auth, JWT tokens

**NFR-012: Data Protection**
- **Description**: System shall protect user data
- **Measurement**: Encryption and access controls
- **Priority**: High
- **Implementation**: Row-level security, HTTPS

**NFR-013: File Upload Security**
- **Description**: System shall validate file uploads
- **Measurement**: File type and size validation
- **Priority**: High
- **Implementation**: File validation, virus scanning

#### 3.2.5 Usability Requirements

**NFR-014: Admin Efficiency**
- **Description**: Admin tasks shall be completed efficiently
- **Measurement**: < 5 minutes to create blog post
- **Priority**: High
- **Implementation**: Intuitive UI, keyboard shortcuts

**NFR-015: Mobile Usability**
- **Description**: System shall be fully functional on mobile
- **Measurement**: Responsive design, touch-friendly interface
- **Priority**: High
- **Implementation**: Responsive design, mobile optimization

**NFR-016: Accessibility**
- **Description**: System shall meet WCAG 2.1 AA standards
- **Measurement**: Accessibility compliance testing
- **Priority**: Medium
- **Implementation**: Semantic HTML, ARIA labels

---

## 4. System Architecture

### 4.1 High-Level Architecture
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Vercel CDN    │    │   Next.js App   │    │   Supabase      │
│                 │    │                 │    │                 │
│ • Static Assets │◄──►│ • React Pages   │◄──►│ • PostgreSQL    │
│ • Image CDN     │    │ • API Routes    │    │ • Auth Service  │
│ • Edge Caching  │    │ • SSR/SSG       │    │ • Storage       │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### 4.2 Database Schema

#### 4.2.1 Core Tables
- **users**: User profiles and authentication
- **languages**: Supported languages
- **blog_posts**: Blog post metadata
- **blog_post_translations**: Blog post content by language
- **portfolio_projects**: Portfolio project metadata
- **portfolio_project_translations**: Portfolio content by language
- **tags**: Content tags
- **tag_translations**: Tag names by language
- **blog_post_tags**: Blog post to tag associations

#### 4.2.2 Shared Images Schema
- **shared_images**: Entity-scoped image storage
  - **id**: Primary key
  - **entity_type**: 'blog' or 'portfolio'
  - **entity_id**: ID of the associated content
  - **image_url**: URL of the stored image
  - **original_filename**: Original file name
  - **file_size**: File size in bytes
  - **uploaded_at**: Upload timestamp
  - **uploaded_by**: User who uploaded the image
  - **is_active**: Soft delete flag

#### 4.2.3 Activity Logging Schema
- **activity_log**: System activity tracking
  - **id**: Primary key
  - **actor_id**: User who performed the action
  - **action**: Action performed
  - **entity_type**: Type of entity affected
  - **entity_id**: ID of entity affected
  - **details**: JSON details of the action
  - **created_at**: Timestamp of the action

### 4.3 API Architecture

#### 4.3.1 Shared Images API
- **GET /api/shared-images**: Retrieve images for entity
- **POST /api/shared-images**: Upload new image
- **DELETE /api/shared-images**: Remove image (soft delete)

#### 4.3.2 Content Management API
- **GET /api/admin/blog**: List blog posts
- **POST /api/admin/blog**: Create blog post
- **PUT /api/admin/blog/[id]**: Update blog post
- **DELETE /api/admin/blog/[id]**: Delete blog post

### 4.4 Security Architecture

#### 4.4.1 Authentication Flow
1. User submits credentials
2. Supabase Auth validates credentials
3. JWT token issued and stored
4. Token used for subsequent requests
5. Route protection validates token

#### 4.4.2 Authorization Model
- **Public Routes**: No authentication required
- **Admin Routes**: Authentication required
- **API Routes**: Service role key or user authentication
- **Storage Access**: Public read, authenticated write

---

## 5. Interface Requirements

### 5.1 User Interfaces

#### 5.1.1 Public Interface
- **Homepage**: Hero section, latest posts, call-to-action
- **Blog Listing**: Paginated list of blog posts
- **Blog Post**: Individual post with navigation
- **Portfolio**: Project showcase
- **Search**: Content search interface
- **Navigation**: Language switching, menu

#### 5.1.2 Admin Interface
- **Dashboard**: System overview and quick actions
- **Content Management**: Blog and portfolio management
- **Image Management**: Shared images library
- **Activity Log**: System activity monitoring
- **Settings**: System configuration

### 5.2 Hardware Interfaces
- **Web Browsers**: Modern browsers supporting ES6+
- **Mobile Devices**: Responsive design for mobile
- **Tablets**: Optimized for tablet viewing

### 5.3 Software Interfaces
- **Supabase**: Database, authentication, storage
- **Vercel**: Hosting and deployment
- **Next.js**: React framework
- **Tailwind CSS**: Styling framework

---

## 6. Quality Attributes

### 6.1 Performance
- **Response Time**: < 3 seconds for all pages
- **Throughput**: Support 1000+ concurrent users
- **Resource Usage**: Efficient memory and CPU usage
- **Scalability**: Horizontal scaling capability

### 6.2 Reliability
- **Availability**: 99.9% uptime
- **Fault Tolerance**: Graceful error handling
- **Recovery**: Quick recovery from failures
- **Backup**: Automated data backup

### 6.3 Security
- **Authentication**: Secure user authentication
- **Authorization**: Role-based access control
- **Data Protection**: Encryption and access controls
- **Input Validation**: Comprehensive input validation

### 6.4 Usability
- **Learnability**: Easy to learn and use
- **Efficiency**: Efficient task completion
- **Satisfaction**: User satisfaction with interface
- **Accessibility**: WCAG 2.1 AA compliance

---

## 7. Constraints

### 7.1 Technical Constraints
- **Framework**: Next.js 15 and React 18
- **Database**: Supabase PostgreSQL
- **Hosting**: Vercel platform
- **Browser Support**: Modern browsers only

### 7.2 Business Constraints
- **Budget**: Cost-effective solution
- **Timeline**: Production deployment completed
- **Resources**: Single developer team
- **Maintenance**: Minimal ongoing maintenance

### 7.3 Regulatory Constraints
- **Data Protection**: GDPR compliance considerations
- **Accessibility**: WCAG 2.1 AA compliance
- **Security**: Industry-standard security practices

---

## 8. Assumptions and Dependencies

### 8.1 Assumptions
- **User Behavior**: Users will use modern browsers
- **Content Volume**: Moderate content growth
- **Image Usage**: Reasonable image file sizes
- **Network**: Reliable internet connectivity

### 8.2 Dependencies
- **Supabase**: Database and authentication services
- **Vercel**: Hosting and deployment platform
- **Next.js**: React framework updates
- **Browser Support**: Modern browser features

---

## 9. Appendices

### 9.1 Glossary
- **Entity**: A content item (blog post or portfolio project)
- **Entity Type**: The type of content ('blog' or 'portfolio')
- **Entity ID**: The unique identifier for a content item
- **Shared Images**: Images associated with specific content entities
- **Temporary Storage**: Images stored during content creation
- **Cross-Entity Separation**: Complete isolation between different content types

### 9.2 References
- Next.js Documentation: https://nextjs.org/docs
- Supabase Documentation: https://supabase.com/docs
- React Documentation: https://react.dev
- Tailwind CSS Documentation: https://tailwindcss.com/docs

---

**Document Approval:**
- **Technical Lead:** Matt Dinh
- **System Architect:** Matt Dinh
- **Quality Assurance:** Matt Dinh
- **Date:** January 9, 2025

---

*Last updated: January 9, 2025*

---

**Production Deployment Update (2025-01-09):**
- All software requirements successfully implemented and deployed
- Shared Images Management system with entity-scoped architecture fully operational
- Production infrastructure and security measures in place
- System ready for ongoing development and maintenance
