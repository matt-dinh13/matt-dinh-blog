# System Architecture Diagram
## Matt Dinh Blog Platform

**Version**: 2.0  
**Date**: December 2024  
**Status**: Core Features Complete ✅

---

## Architecture Overview

```mermaid
graph TB
    %% Client Layer
    subgraph "Client Layer"
        DB[Desktop Browser]
        TB[Tablet Browser]
        MB[Mobile Browser]
    end
    
    %% Presentation Layer
    subgraph "Presentation Layer"
        subgraph "Next.js 15 App"
            SC[Server Components]
            CC[Client Components]
            SG[Static Generation]
            AR[App Router]
            PR[Pages Router]
            API[API Routes]
        end
    end
    
    %% Integration Layer
    subgraph "Integration Layer"
        subgraph "Supabase Client"
            DC[Database Client]
            AC[Auth Client]
            STC[Storage Client]
        end
    end
    
    %% Service Layer
    subgraph "Service Layer"
        subgraph "Supabase Platform"
            PD[(PostgreSQL Database<br/>✅ RLS<br/>✅ Views<br/>✅ Triggers)]
            AS[Auth Service<br/>✅ JWT<br/>✅ Sessions<br/>✅ Roles]
            SS[Storage Service<br/>✅ Images<br/>✅ Files<br/>✅ CDN]
        end
    end
    
    %% Deployment Layer
    subgraph "Deployment Layer"
        subgraph "Vercel Platform"
            EN[Edge Network<br/>✅ CDN<br/>✅ Caching<br/>✅ SSL]
            SF[Server Functions<br/>✅ SSR<br/>✅ API<br/>✅ Auth]
            SA[Static Assets<br/>✅ Images<br/>✅ CSS/JS<br/>✅ Fonts]
        end
    end
    
    %% Connections
    DB --> SC
    TB --> SC
    MB --> SC
    
    SC --> DC
    CC --> AC
    SG --> STC
    
    DC --> PD
    AC --> AS
    STC --> SS
    
    PD --> EN
    AS --> SF
    SS --> SA
    
    %% Styling
    classDef client fill:#e3f2fd,stroke:#1976d2,stroke-width:2px
    classDef presentation fill:#f3e5f5,stroke:#7b1fa2,stroke-width:2px
    classDef integration fill:#e8f5e8,stroke:#388e3c,stroke-width:2px
    classDef service fill:#fff3e0,stroke:#f57c00,stroke-width:2px
    classDef deployment fill:#fce4ec,stroke:#c2185b,stroke-width:2px
    
    class DB,TB,MB client
    class SC,CC,SG,AR,PR,API presentation
    class DC,AC,STC integration
    class PD,AS,SS service
    class EN,SF,SA deployment
```

---

## Component Architecture

### Frontend Components (✅ Complete)

```mermaid
graph TD
    subgraph "src/"
        subgraph "app/"
            LANG["[lang]/"]
            ADMIN["admin/"]
            ABOUT["about/"]
            PORTFOLIO["portfolio/"]
            API["api/"]
            
            subgraph "LANG"
                BLOG["blog/"]
                HOME["page.tsx"]
                
                subgraph "BLOG"
                    SLUG["[slug]/"]
                    BLOGPAGE["page.tsx"]
                end
            end
            
            subgraph "ADMIN"
                ADMINBLOG["blog/"]
                CATEGORIES["categories/"]
                ADMINPAGE["page.tsx"]
            end
        end
        
        subgraph "components/"
            NAV["Navigation.tsx"]
            BPC["BlogPostCard.tsx"]
            RTE["RichTextEditor.tsx"]
            LS["LanguageSwitcher.tsx"]
            AL["AdminLayout.tsx"]
        end
        
        subgraph "lib/"
            SS["supabase-server.ts"]
            SC["supabase.ts"]
            UTILS["utils.ts"]
        end
        
        subgraph "types/"
            TYPES["TypeScript definitions"]
        end
    end
    
    %% Styling
    classDef folder fill:#e1f5fe,stroke:#01579b,stroke-width:2px
    classDef file fill:#f3e5f5,stroke:#4a148c,stroke-width:2px
    classDef component fill:#e8f5e8,stroke:#388e3c,stroke-width:2px
    
    class LANG,ADMIN,ABOUT,PORTFOLIO,API,BLOG,ADMINBLOG,CATEGORIES folder
    class HOME,SLUG,BLOGPAGE,ADMINPAGE,NAV,BPC,RTE,LS,AL,SS,SC,UTILS,TYPES file
    class BPC,RTE,LS,AL component
```

### Database Schema (✅ Complete)

```mermaid
erDiagram
    blog_posts {
        serial id PK
        varchar slug UK
        text status
        timestamp published_at
        timestamp created_at
        varchar thumbnail_url
        int category_id FK
        uuid author_id FK
        int view_count
    }
    
    blog_post_translations {
        serial id PK
        int blog_post_id FK
        varchar language_code
        text title
        text summary
        text content
        text meta_title
        text meta_description
        timestamp created_at
        timestamp updated_at
    }
    
    categories {
        serial id PK
        varchar slug UK
        timestamp created_at
    }
    
    category_translations {
        serial id PK
        int category_id FK
        varchar language_code
        text name
        timestamp created_at
    }
    
    users {
        uuid id PK
        varchar email
        text role
        timestamp created_at
    }
    
    about_me {
        serial id PK
        varchar slug UK
        timestamp created_at
    }
    
    about_me_translations {
        serial id PK
        int about_me_id FK
        varchar language_code
        text title
        text content
        timestamp created_at
        timestamp updated_at
    }
    
    blog_posts ||--o{ blog_post_translations : "has translations"
    blog_posts }o--|| categories : "belongs to"
    categories ||--o{ category_translations : "has translations"
    blog_posts }o--|| users : "created by"
    about_me ||--o{ about_me_translations : "has translations"
```

---

## Data Flow Architecture

### Content Display Flow (✅ Complete)

```mermaid
sequenceDiagram
    participant U as User
    participant N as Next.js App Router
    participant S as Server Component
    participant SC as Supabase Server Client
    participant DB as PostgreSQL Database
    participant C as Client Hydration
    
    U->>N: Request Page
    N->>S: Route to Server Component
    S->>SC: Query Database
    SC->>DB: Execute Query
    DB-->>SC: Return Results
    SC-->>S: Data
    S->>S: Server-Side Rendering
    S-->>N: HTML Response
    N-->>U: Rendered Page
    U->>C: Client Hydration
    C->>C: Interactive Features
```

### Admin Content Management Flow (✅ Complete)

```mermaid
sequenceDiagram
    participant A as Admin
    participant SA as Supabase Auth
    participant PR as Protected Routes
    participant AI as Admin Interface
    participant RTE as Rich Text Editor
    participant SS as Supabase Storage
    participant DB as Database
    
    A->>SA: Login
    SA-->>A: JWT Token
    A->>PR: Access Admin Area
    PR->>AI: Load Interface
    A->>RTE: Edit Content
    A->>SS: Upload Images
    SS-->>A: Image URLs
    A->>DB: Save Content
    DB-->>A: Confirmation
    A->>A: Content Published
```

### Language Switching Flow (✅ Complete)

```mermaid
sequenceDiagram
    participant U as User
    participant URL as URL Update
    participant SC as Server Component
    participant LQ as Language-Specific Query
    participant TD as Translation Data
    participant CR as Content Rendering
    participant UI as UI Update
    
    U->>URL: Select Language
    URL->>SC: Update Route
    SC->>LQ: Query with Language
    LQ->>TD: Get Translations
    TD-->>LQ: Translation Data
    LQ-->>SC: Language Data
    SC->>CR: Render Content
    CR->>UI: Update Interface
    UI-->>U: New Language Display
```

---

## Technology Stack

### Frontend Technologies (✅ Complete)
- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **React Hook Form** - Form management
- **React Query** - Data fetching and caching

### Backend Technologies (✅ Complete)
- **Supabase** - Backend-as-a-Service
- **PostgreSQL** - Relational database
- **Row Level Security (RLS)** - Data security
- **JWT Authentication** - User authentication
- **Supabase Storage** - File storage

### Deployment & Infrastructure (✅ Complete)
- **Vercel** - Hosting and deployment
- **Edge Network** - Global CDN
- **Serverless Functions** - API endpoints
- **Automatic SSL** - Security certificates
- **Git Integration** - Continuous deployment

### Development Tools (✅ Complete)
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **TypeScript** - Type checking
- **Git** - Version control
- **VS Code** - Development environment

---

## Security Architecture

### Authentication & Authorization (✅ Complete)
- **JWT Tokens** - Secure session management
- **Row Level Security** - Database-level access control
- **Role-based Access** - User permission management
- **Protected Routes** - Client-side route protection
- **Server-side Validation** - API endpoint security

### Data Protection (✅ Complete)
- **HTTPS/SSL** - Encrypted data transmission
- **Input Validation** - XSS and injection prevention
- **CSRF Protection** - Cross-site request forgery prevention
- **Content Security Policy** - XSS mitigation
- **Rate Limiting** - API abuse prevention

### Infrastructure Security (✅ Complete)
- **Vercel Security** - Platform-level protection
- **Supabase Security** - Database and storage security
- **Environment Variables** - Secure configuration management
- **Regular Updates** - Security patch management
- **Backup Strategy** - Data recovery protection

---

## Performance Architecture

### Frontend Performance (✅ Complete)
- **Server-Side Rendering** - Fast initial page loads
- **Static Generation** - Pre-built pages for better performance
- **Image Optimization** - Next.js Image component
- **Code Splitting** - Lazy loading of components
- **Caching Strategy** - Browser and CDN caching

### Backend Performance (✅ Complete)
- **Database Indexing** - Optimized query performance
- **Connection Pooling** - Efficient database connections
- **Query Optimization** - Minimal database round trips
- **Caching Layer** - Redis-like caching (Supabase)
- **CDN Distribution** - Global content delivery

### Monitoring & Analytics (✅ Complete)
- **Vercel Analytics** - Performance monitoring
- **Error Tracking** - Application error monitoring
- **User Analytics** - User behavior tracking
- **Performance Metrics** - Core Web Vitals tracking
- **Uptime Monitoring** - System availability tracking

---

## Scalability Architecture

### Horizontal Scaling (✅ Complete)
- **Serverless Functions** - Automatic scaling
- **Edge Network** - Global distribution
- **Database Scaling** - Supabase managed scaling
- **Storage Scaling** - Automatic storage expansion
- **CDN Scaling** - Global content distribution

### Vertical Scaling (✅ Complete)
- **Database Optimization** - Query and index optimization
- **Code Optimization** - Bundle size and performance optimization
- **Image Optimization** - Compression and format optimization
- **Caching Strategy** - Multi-level caching
- **Resource Management** - Efficient resource utilization

---

## Disaster Recovery

### Backup Strategy (✅ Complete)
- **Database Backups** - Automated daily backups
- **File Backups** - Storage bucket backups
- **Code Backups** - Git repository backups
- **Configuration Backups** - Environment variable backups
- **Recovery Procedures** - Documented recovery processes

### High Availability (✅ Complete)
- **Multi-region Deployment** - Vercel edge network
- **Database Redundancy** - Supabase managed redundancy
- **CDN Distribution** - Global content availability
- **Failover Procedures** - Automatic failover mechanisms
- **Monitoring Alerts** - Proactive issue detection

---

*This system architecture diagram provides a comprehensive overview of the Matt Dinh Blog platform's technical implementation. The architecture is designed for scalability, security, and performance while maintaining simplicity and maintainability.* 