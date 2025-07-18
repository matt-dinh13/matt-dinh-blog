# Software Requirements Specification (SRS)
## Matt Dinh Blog Platform

**Document Version:** 1.0  
**Date:** July 17, 2025  
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
- **FR-013:** Rich text editing with HTML content support
- **FR-014:** Image upload and management for post thumbnails
- **FR-015:** Category and tag assignment for posts

#### 3.2.2 Portfolio Projects
- **FR-016:** Create portfolio projects with detailed descriptions
- **FR-017:** Edit project information and media
- **FR-018:** Delete projects with confirmation
- **FR-019:** Project status management (active/inactive)
- **FR-020:** Image gallery support for project showcases

#### 3.2.3 Categories and Tags
- **FR-021:** Create and manage content categories
- **FR-022:** Create and manage content tags
- **FR-023:** Assign categories and tags to blog posts
- **FR-024:** Filter content by categories and tags

### 3.3 Public Interface

#### 3.3.1 Blog Display
- **FR-025:** Display blog posts in chronological order
- **FR-026:** Pagination support for large content collections
- **FR-027:** Individual blog post pages with full content
- **FR-028:** Related posts suggestions
- **FR-029:** Social sharing capabilities

#### 3.3.2 Portfolio Display
- **FR-030:** Display portfolio projects in grid layout
- **FR-031:** Individual project detail pages
- **FR-032:** Project filtering and sorting options

#### 3.3.3 Search Functionality
- **FR-033:** Search blog posts by title and content
- **FR-034:** Search results with relevance ranking
- **FR-035:** Search suggestions and autocomplete
- **FR-036:** Search within specific categories or tags

### 3.4 Internationalization

#### 3.4.1 Language Support
- **FR-037:** Full English language support
- **FR-038:** Full Vietnamese language support
- **FR-039:** Language switching without page reload
- **FR-040:** Persistent language preference storage
- **FR-041:** Bilingual content management for all posts

#### 3.4.2 Content Localization
- **FR-042:** Separate content for each language
- **FR-043:** Language-specific URLs and routing
- **FR-044:** Localized date and time formatting
- **FR-045:** Reading time estimates for each language

### 3.5 Administrative Features

#### 3.5.1 Dashboard
- **FR-046:** Overview of content statistics
- **FR-047:** Recent activity and changes
- **FR-048:** Quick access to common functions
- **FR-049:** System status and health indicators

#### 3.5.2 Analytics
- **FR-050:** Page view tracking and statistics
- **FR-051:** Popular content identification
- **FR-052:** User engagement metrics
- **FR-053:** Traffic source analysis

---

## 4. Non-Functional Requirements

### 4.1 Performance Requirements
- **NFR-001:** Page load time must be <3 seconds on 3G connection
- **NFR-002:** Search results must return within 1 second
- **NFR-003:** Image optimization must reduce file sizes by >50%
- **NFR-004:** Database queries must complete within 500ms
- **NFR-005:** API responses must be cached appropriately

### 4.2 Security Requirements
- **NFR-006:** All admin routes must require authentication
- **NFR-007:** Passwords must be hashed using bcrypt
- **NFR-008:** HTTPS must be enforced for all connections
- **NFR-009:** Input validation must prevent XSS attacks
- **NFR-010:** CSRF protection must be implemented
- **NFR-011:** Rate limiting must prevent abuse

### 4.3 Usability Requirements
- **NFR-012:** Interface must be responsive on all device sizes
- **NFR-013:** Navigation must be intuitive and accessible
- **NFR-014:** Error messages must be clear and actionable
- **NFR-015:** Loading states must provide user feedback
- **NFR-016:** WCAG 2.1 AA accessibility compliance

### 4.4 Reliability Requirements
- **NFR-017:** System uptime must be >99.9%
- **NFR-018:** Data backup must occur daily
- **NFR-019:** Error logging must capture all system errors
- **NFR-020:** Graceful degradation for non-critical features

### 4.5 Scalability Requirements
- **NFR-021:** System must support 10,000+ monthly visitors
- **NFR-022:** Database must handle 1000+ blog posts
- **NFR-023:** File storage must scale to 10GB+ of content
- **NFR-024:** Performance must not degrade with content growth

---

## 5. System Architecture

### 5.1 Frontend Architecture
```
src/
├── app/                    # Next.js App Router
│   ├── admin/             # Admin pages
│   ├── blog/              # Blog pages
│   ├── portfolio/         # Portfolio pages
│   ├── api/               # API routes
│   └── layout.tsx         # Root layout
├── components/            # Reusable components
│   ├── ui/               # Basic UI components
│   ├── forms/            # Form components
│   └── layout/           # Layout components
├── lib/                  # Utilities and helpers
│   ├── supabase.ts       # Supabase client
│   ├── utils.ts          # Utility functions
│   └── constants.ts      # Application constants
└── types/                # TypeScript type definitions
```

### 5.2 Database Schema
```sql
-- Core tables
users (id, email, full_name, created_at, updated_at)
blog_posts (id, slug, status, published_at, created_at, updated_at)
blog_post_translations (blog_post_id, language_code, title, summary, content)
portfolio_projects (id, slug, status, created_at, updated_at)
portfolio_translations (project_id, language_code, title, description, content)

-- Organization tables
categories (id, slug, created_at)
category_translations (category_id, language_code, name, description)
tags (id, slug, created_at)
tag_translations (tag_id, language_code, name)

-- Relationship tables
blog_post_tags (blog_post_id, tag_id)
blog_post_categories (blog_post_id, category_id)

-- Analytics tables
page_views (id, page_url, user_agent, ip_address, created_at)
activity_logs (id, user_id, action, details, created_at)
```

### 5.3 API Design
```typescript
// Blog Posts API
GET /api/posts - List blog posts
GET /api/posts/[slug] - Get specific post
POST /api/posts - Create new post
PUT /api/posts/[id] - Update post
DELETE /api/posts/[id] - Delete post

// Portfolio API
GET /api/projects - List portfolio projects
GET /api/projects/[slug] - Get specific project
POST /api/projects - Create new project
PUT /api/projects/[id] - Update project
DELETE /api/projects/[id] - Delete project

// Search API
GET /api/search?q=query - Search content
GET /api/search/suggestions?q=query - Get search suggestions
```

---

## 6. Data Models

### 6.1 Blog Post Model
```typescript
interface BlogPost {
  id: number;
  slug: string;
  status: 'draft' | 'published';
  thumbnail_url: string | null;
  published_at: string | null;
  created_at: string;
  updated_at: string;
  translations: BlogPostTranslation[];
  categories: Category[];
  tags: Tag[];
  view_count: number;
}

interface BlogPostTranslation {
  blog_post_id: number;
  language_code: 'en' | 'vi';
  title: string;
  summary: string;
  content: string;
}
```

### 6.2 Portfolio Project Model
```typescript
interface PortfolioProject {
  id: number;
  slug: string;
  status: 'active' | 'inactive';
  thumbnail_url: string | null;
  created_at: string;
  updated_at: string;
  translations: PortfolioTranslation[];
}

interface PortfolioTranslation {
  project_id: number;
  language_code: 'en' | 'vi';
  title: string;
  description: string;
  content: string;
}
```

### 6.3 User Model
```typescript
interface User {
  id: string;
  email: string;
  full_name: string;
  role: 'admin' | 'editor' | 'viewer';
  created_at: string;
  updated_at: string;
  last_login: string | null;
}
```

---

## 7. User Interface Requirements

### 7.1 Design System
- **Color Palette:** Navy blue (#1e3a8a), white, gray scale
- **Typography:** Inter font family for modern readability
- **Spacing:** Consistent 8px grid system
- **Components:** Reusable UI components with consistent styling

### 7.2 Responsive Design
- **Mobile:** 320px - 768px
- **Tablet:** 768px - 1024px
- **Desktop:** 1024px+
- **Breakpoints:** Tailwind CSS responsive utilities

### 7.3 Accessibility
- **Keyboard Navigation:** Full keyboard accessibility
- **Screen Readers:** ARIA labels and semantic HTML
- **Color Contrast:** WCAG 2.1 AA compliant contrast ratios
- **Focus Management:** Visible focus indicators

---

## 8. External Interfaces

### 8.1 Supabase Integration
- **Authentication:** Supabase Auth for user management
- **Database:** PostgreSQL with Row Level Security
- **Storage:** Supabase Storage for file management
- **Real-time:** Supabase real-time subscriptions

### 8.2 Vercel Deployment
- **Hosting:** Vercel platform for hosting
- **CDN:** Global content delivery network
- **SSL:** Automatic SSL certificate management
- **CI/CD:** Git-based deployment pipeline

### 8.3 External APIs
- **Search:** Internal search with PostgreSQL full-text search
- **Analytics:** Custom analytics implementation
- **Social Sharing:** Open Graph and Twitter Card meta tags

---

## 9. Quality Attributes

### 9.1 Performance
- **Lighthouse Score:** >90 for all pages
- **Core Web Vitals:** Pass all metrics
- **Bundle Size:** <500KB initial JavaScript
- **Image Optimization:** WebP format with fallbacks

### 9.2 Security
- **Authentication:** Secure session management
- **Authorization:** Role-based access control
- **Data Protection:** Encrypted data transmission
- **Input Validation:** Comprehensive input sanitization

### 9.3 Maintainability
- **Code Quality:** ESLint and Prettier configuration
- **Type Safety:** Full TypeScript implementation
- **Documentation:** Comprehensive code documentation
- **Testing:** Unit and integration test coverage

### 9.4 Scalability
- **Database:** Efficient indexing and query optimization
- **Caching:** Strategic caching implementation
- **CDN:** Global content delivery
- **Monitoring:** Performance and error monitoring

---

## 10. Constraints and Assumptions

### 10.1 Technical Constraints
- **Browser Support:** Modern browsers only (Chrome 90+, Firefox 88+, Safari 14+)
- **JavaScript:** ES2020+ features required
- **Network:** Minimum 3G connection for mobile users
- **Storage:** Local storage for user preferences

### 10.2 Business Constraints
- **Budget:** Limited hosting and development costs
- **Timeline:** Rapid development and deployment
- **Team Size:** Single developer initially
- **Maintenance:** Ongoing technical maintenance required

### 10.3 Assumptions
- **User Behavior:** Primarily read-only audience
- **Content Volume:** Moderate content creation rate
- **Technical Skills:** Users have basic web browsing skills
- **Network:** Reliable internet connectivity

---

## 11. Testing Requirements

### 11.1 Unit Testing
- **Coverage:** >80% code coverage
- **Components:** All React components tested
- **Utilities:** All utility functions tested
- **API Routes:** All API endpoints tested

### 11.2 Integration Testing
- **Database:** Database operations tested
- **Authentication:** Login/logout flow tested
- **Content Management:** CRUD operations tested
- **Search:** Search functionality tested

### 11.3 End-to-End Testing
- **User Flows:** Complete user journeys tested
- **Cross-Browser:** Testing on multiple browsers
- **Mobile:** Mobile device testing
- **Performance:** Load testing and optimization

---

## 12. Deployment and Operations

### 12.1 Deployment Strategy
- **Environment:** Production deployment on Vercel
- **Database:** Supabase production instance
- **Monitoring:** Vercel Analytics and error tracking
- **Backup:** Automated daily database backups

### 12.2 Maintenance
- **Updates:** Regular dependency updates
- **Security:** Security patch management
- **Performance:** Ongoing performance optimization
- **Content:** Regular content updates and management

---

**Document Approval:**
- **Technical Lead:** Matt Dinh
- **Architect:** [To be assigned]
- **Date:** [To be completed] 