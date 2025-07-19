# System Architecture Diagram
## Matt Dinh Blog Platform

**Version**: 2.0  
**Date**: December 2024  
**Status**: Core Features Complete ✅

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER                            │
├─────────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐            │
│  │   Desktop   │  │   Tablet    │  │   Mobile    │            │
│  │   Browser   │  │   Browser   │  │   Browser   │            │
│  └─────────────┘  └─────────────┘  └─────────────┘            │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                     PRESENTATION LAYER                         │
├─────────────────────────────────────────────────────────────────┤
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │                    Next.js 15 App                          │ │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐        │ │
│  │  │   Server    │  │   Client    │  │   Static    │        │ │
│  │  │ Components  │  │ Components  │  │ Generation  │        │ │
│  │  └─────────────┘  └─────────────┘  └─────────────┘        │ │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐        │ │
│  │  │   App       │  │   Pages     │  │   API       │        │ │
│  │  │   Router    │  │   Router    │  │   Routes    │        │ │
│  │  └─────────────┘  └─────────────┘  └─────────────┘        │ │
│  └─────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                      INTEGRATION LAYER                         │
├─────────────────────────────────────────────────────────────────┤
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │                    Supabase Client                          │ │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐        │ │
│  │  │   Database  │  │   Auth      │  │   Storage   │        │ │
│  │  │   Client    │  │   Client    │  │   Client    │        │ │
│  │  └─────────────┘  └─────────────┘  └─────────────┘        │ │
│  └─────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                       SERVICE LAYER                            │
├─────────────────────────────────────────────────────────────────┤
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │                    Supabase Platform                        │ │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐        │ │
│  │  │ PostgreSQL  │  │   Auth      │  │   Storage   │        │ │
│  │  │  Database   │  │   Service   │  │   Service   │        │ │
│  │  │             │  │             │  │             │        │ │
│  │  │ ✅ RLS      │  │ ✅ JWT      │  │ ✅ Images   │        │ │
│  │  │ ✅ Views    │  │ ✅ Sessions │  │ ✅ Files    │        │ │
│  │  │ ✅ Triggers │  │ ✅ Roles    │  │ ✅ CDN      │        │ │
│  │  └─────────────┘  └─────────────┘  └─────────────┘        │ │
│  └─────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                      DEPLOYMENT LAYER                          │
├─────────────────────────────────────────────────────────────────┤
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │                    Vercel Platform                          │ │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐        │ │
│  │  │   Edge      │  │   Server    │  │   Static    │        │ │
│  │  │   Network   │  │   Functions │  │   Assets    │        │ │
│  │  │             │  │             │  │             │        │ │
│  │  │ ✅ CDN      │  │ ✅ SSR      │  │ ✅ Images   │        │ │
│  │  │ ✅ Caching  │  │ ✅ API      │  │ ✅ CSS/JS   │        │ │
│  │  │ ✅ SSL      │  │ ✅ Auth     │  │ ✅ Fonts    │        │ │
│  │  └─────────────┘  └─────────────┘  └─────────────┘        │ │
│  └─────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

---

## Component Architecture

### Frontend Components (✅ Complete)

```
src/
├── app/                          # App Router (Next.js 15)
│   ├── [lang]/                   # Internationalized routes ✅
│   │   ├── blog/                 # Blog pages ✅
│   │   │   ├── [slug]/           # Individual posts ✅
│   │   │   └── page.tsx          # Blog list ✅
│   │   └── page.tsx              # Homepage ✅
│   ├── admin/                    # Admin panel ✅
│   │   ├── blog/                 # Blog management ✅
│   │   ├── categories/           # Category management ✅
│   │   └── page.tsx              # Admin dashboard ✅
│   ├── about/                    # About page ✅
│   ├── portfolio/                # Portfolio page 🔄
│   └── api/                      # API routes ✅
├── components/                   # Reusable components ✅
│   ├── Navigation.tsx            # Site navigation ✅
│   ├── BlogPostCard.tsx          # Blog post cards ✅
│   ├── RichTextEditor.tsx        # Content editor ✅
│   ├── LanguageSwitcher.tsx      # Language toggle ✅
│   └── AdminLayout.tsx           # Admin layout ✅
├── lib/                          # Utility functions ✅
│   ├── supabase-server.ts        # Server client ✅
│   ├── supabase.ts               # Client client ✅
│   └── utils.ts                  # Helper functions ✅
└── types/                        # TypeScript definitions ✅
```

### Database Schema (✅ Complete)

```
Database Tables:
├── blog_posts                    # Main post data ✅
│   ├── id (SERIAL PRIMARY KEY)   ✅
│   ├── slug (VARCHAR UNIQUE)     ✅
│   ├── status (TEXT)             ✅
│   ├── published_at (TIMESTAMP)  ✅
│   └── created_at (TIMESTAMP)    ✅
├── blog_post_translations        # Bilingual content ✅
│   ├── id (SERIAL PRIMARY KEY)   ✅
│   ├── blog_post_id (FOREIGN KEY) ✅
│   ├── language_code (VARCHAR)   ✅
│   ├── title (TEXT)              ✅
│   ├── summary (TEXT)            ✅
│   └── content (TEXT)            ✅
├── categories                    # Content categories ✅
│   ├── id (SERIAL PRIMARY KEY)   ✅
│   ├── slug (VARCHAR UNIQUE)     ✅
│   └── created_at (TIMESTAMP)    ✅
├── category_translations         # Category names ✅
│   ├── id (SERIAL PRIMARY KEY)   ✅
│   ├── category_id (FOREIGN KEY) ✅
│   ├── language_code (VARCHAR)   ✅
│   └── name (TEXT)               ✅
├── users                         # User accounts ✅
│   ├── id (UUID PRIMARY KEY)     ✅
│   ├── email (VARCHAR)           ✅
│   └── role (TEXT)               ✅
├── about_me                      # About page content 🔄
└── about_me_translations         # About translations 🔄
```

---

## Data Flow Architecture

### Content Display Flow (✅ Complete)

```
1. User Request
   └── Next.js App Router
       └── Server Component
           └── Supabase Server Client
               └── PostgreSQL Database
                   └── Query Results
                       └── Server-Side Rendering
                           └── HTML Response
                               └── Client Hydration
                                   └── Interactive Features
```

### Admin Content Management Flow (✅ Complete)

```
1. Admin Login
   └── Supabase Auth
       └── JWT Token
           └── Protected Routes
               └── Admin Interface
                   └── Rich Text Editor
                       └── Image Upload
                           └── Supabase Storage
                               └── Database Update
                                   └── Content Published
```

### Language Switching Flow (✅ Complete)

```
1. Language Selection
   └── URL Update
       └── Server Component
           └── Language-Specific Query
               └── Translation Data
                   └── Content Rendering
                       └── UI Update
```

---

## Security Architecture

### Authentication & Authorization (✅ Complete)

```
┌─────────────────────────────────────────────────────────────────┐
│                        SECURITY LAYER                          │
├─────────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐            │
│  │   Public    │  │   Protected │  │   Admin     │            │
│  │   Routes    │  │   Routes    │  │   Routes    │            │
│  │             │  │             │  │             │            │
│  │ ✅ Blog     │  │ ✅ User     │  │ ✅ Admin    │            │
│  │ ✅ About    │  │ ✅ Profile  │  │ ✅ Content  │            │
│  │ ✅ Portfolio│  │ ✅ Settings │  │ ✅ Users    │            │
│  └─────────────┘  └─────────────┘  └─────────────┘            │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                    ROW LEVEL SECURITY                          │
├─────────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐            │
│  │   Public    │  │   User      │  │   Admin     │            │
│  │   Access    │  │   Access    │  │   Access    │            │
│  │             │  │             │  │             │            │
│  │ ✅ Read     │  │ ✅ Read     │  │ ✅ Full     │            │
│  │ ✅ Published│  │ ✅ Own Data │  │ ✅ CRUD     │            │
│  │ ✅ Content  │  │ ✅ Profile  │  │ ✅ All Data │            │
│  └─────────────┘  └─────────────┘  └─────────────┘            │
└─────────────────────────────────────────────────────────────────┘
```

---

## Performance Architecture

### Caching Strategy (✅ Complete)

```
┌─────────────────────────────────────────────────────────────────┐
│                        CACHING LAYER                           │
├─────────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐            │
│  │   Browser   │  │   CDN       │  │   Database  │            │
│  │   Cache     │  │   Cache     │  │   Cache     │            │
│  │             │  │             │  │             │            │
│  │ ✅ Static   │  │ ✅ Images   │  │ ✅ Queries  │            │
│  │ ✅ CSS/JS   │  │ ✅ Assets   │  │ ✅ Results  │            │
│  │ ✅ Fonts    │  │ ✅ HTML     │  │ ✅ Views    │            │
│  └─────────────┘  └─────────────┘  └─────────────┘            │
└─────────────────────────────────────────────────────────────────┘
```

### Optimization Features (✅ Complete)

- ✅ **Server-Side Rendering**: Fast initial page loads
- ✅ **Static Generation**: Pre-built pages for performance
- ✅ **Image Optimization**: Automatic resizing and format conversion
- ✅ **Code Splitting**: Lazy loading of components
- ✅ **Database Indexing**: Optimized queries
- ✅ **CDN Integration**: Global content delivery

---

## Current Status Summary

### ✅ **Fully Implemented**
- **Frontend Architecture**: Next.js 15 with App Router
- **Backend Integration**: Supabase platform integration
- **Database Design**: PostgreSQL with RLS policies
- **Authentication**: Supabase Auth with JWT
- **Content Management**: Full CRUD operations
- **Internationalization**: Bilingual support
- **Admin Panel**: Complete administrative interface
- **Media Management**: Image upload and optimization
- **Security**: Row Level Security and authentication
- **Performance**: Server-side rendering and caching

### 🔄 **In Progress**
- **Portfolio Features**: Needs server-side rendering fix
- **Service Role Key**: Missing environment variable
- **About Me Database**: Tables need to be created

### 🟢 **Future Enhancements**
- **Advanced Search**: Full-text search capabilities
- **Analytics**: User engagement tracking
- **Comment System**: User interaction features
- **Email Newsletter**: Subscriber management

---

## Technology Stack

### Frontend
- ✅ **Next.js 15**: React framework with App Router
- ✅ **TypeScript**: Type-safe development
- ✅ **Tailwind CSS**: Utility-first styling
- ✅ **React**: Component-based UI

### Backend
- ✅ **Supabase**: Backend-as-a-Service
- ✅ **PostgreSQL**: Relational database
- ✅ **Row Level Security**: Database security
- ✅ **JWT Authentication**: Secure authentication

### Deployment
- ✅ **Vercel**: Hosting and deployment platform
- ✅ **Edge Network**: Global CDN
- ✅ **Serverless Functions**: API endpoints
- ✅ **Automatic Scaling**: Performance optimization

---

**Diagram Version**: 2.0  
**Last Updated**: December 2024  
**Status**: Core architecture complete and functional 