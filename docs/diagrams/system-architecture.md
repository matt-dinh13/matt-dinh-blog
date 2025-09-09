# System Architecture Diagrams
## Matt Dinh Blog Platform

**Version**: 3.0  
**Date**: January 9, 2025  
**Status**: Production Ready ✅

---

## 1. High-Level System Architecture

```mermaid
graph TB
    subgraph "Client Layer"
        A[Web Browser] --> B[Next.js App]
        A --> C[Mobile Browser]
    end
    
    subgraph "Application Layer"
        B --> D[React Components]
        B --> E[API Routes]
        B --> F[Server Components]
    end
    
    subgraph "External Services"
        G[Vercel CDN] --> B
        H[Supabase Auth] --> B
        I[Supabase Database] --> E
        J[Supabase Storage] --> E
    end
    
    subgraph "Data Layer"
        I --> K[(PostgreSQL)]
        J --> L[(File Storage)]
        M[(Activity Logs)] --> I
    end
    
    D --> E
    E --> H
    E --> I
    E --> J
    F --> I
```

---

## 2. Database Architecture

```mermaid
erDiagram
    users ||--o{ blog_posts : creates
    users ||--o{ portfolio_projects : creates
    users ||--o{ shared_images : uploads
    users ||--o{ activity_log : performs
    
    languages ||--o{ blog_post_translations : supports
    languages ||--o{ portfolio_project_translations : supports
    languages ||--o{ tag_translations : supports
    
    blog_posts ||--o{ blog_post_translations : has
    blog_posts ||--o{ blog_post_tags : tagged
    blog_posts ||--o{ shared_images : contains
    
    portfolio_projects ||--o{ portfolio_project_translations : has
    portfolio_projects ||--o{ shared_images : contains
    
    tags ||--o{ blog_post_tags : used_in
    tags ||--o{ tag_translations : translated
    
    users {
        uuid id PK
        string email
        string full_name
        string avatar_url
        timestamp created_at
        timestamp updated_at
    }
    
    languages {
        int id PK
        string code UK
        string name
        string native_name
        boolean is_default
        timestamp created_at
    }
    
    blog_posts {
        int id PK
        string slug UK
        string thumbnail_url
        string status
        uuid author_id FK
        timestamp published_at
        timestamp created_at
        timestamp updated_at
    }
    
    blog_post_translations {
        int id PK
        int blog_post_id FK
        string language_code FK
        string title
        text summary
        text content
        string meta_title
        string meta_description
        timestamp created_at
        timestamp updated_at
    }
    
    portfolio_projects {
        int id PK
        string slug UK
        string thumbnail_url
        string project_url
        string github_url
        string[] technologies
        string status
        uuid author_id FK
        timestamp published_at
        timestamp created_at
        timestamp updated_at
    }
    
    portfolio_project_translations {
        int id PK
        int portfolio_project_id FK
        string language_code FK
        string title
        text description
        text content
        string meta_title
        string meta_description
        timestamp created_at
        timestamp updated_at
    }
    
    tags {
        int id PK
        string slug UK
        timestamp created_at
    }
    
    tag_translations {
        int id PK
        int tag_id FK
        string language_code FK
        string name
        timestamp created_at
    }
    
    blog_post_tags {
        int blog_post_id FK
        int tag_id FK
    }
    
    shared_images {
        int id PK
        string entity_type
        int entity_id
        string image_url
        string original_filename
        int file_size
        timestamp uploaded_at
        uuid uploaded_by FK
        boolean is_active
    }
    
    activity_log {
        bigint id PK
        uuid actor_id FK
        string action
        string entity_type
        int entity_id
        jsonb details
        timestamp created_at
    }
```

---

## 3. Shared Images Management Architecture

```mermaid
graph TB
    subgraph "Client Side"
        A[Rich Text Editor] --> B[Image Upload Component]
        A --> C[Shared Images Library]
        D[Admin Image Management] --> E[Image List Component]
    end
    
    subgraph "API Layer"
        F[/api/shared-images] --> G[GET: Retrieve Images]
        F --> H[POST: Upload Image]
        F --> I[DELETE: Remove Image]
    end
    
    subgraph "Database Layer"
        J[(shared_images table)] --> K[Entity-Scoped Storage]
        L[(blog_posts table)] --> K
        M[(portfolio_projects table)] --> K
    end
    
    subgraph "Storage Layer"
        N[Supabase Storage] --> O[blog-images bucket]
        P[Image Processing] --> O
    end
    
    B --> F
    C --> F
    E --> F
    G --> J
    H --> J
    H --> N
    I --> J
    K --> L
    K --> M
    P --> O
```

---

## 4. Authentication and Authorization Flow

```mermaid
sequenceDiagram
    participant U as User
    participant C as Client
    participant A as Supabase Auth
    participant D as Database
    participant P as Protected Route
    
    U->>C: Enter credentials
    C->>A: Authenticate user
    A->>D: Validate credentials
    D-->>A: User data
    A-->>C: JWT token
    C->>C: Store token in session
    U->>C: Access admin route
    C->>P: Check authentication
    P->>A: Validate token
    A-->>P: Token valid
    P-->>C: Allow access
    C-->>U: Show admin interface
```

---

## 5. Content Management Flow

```mermaid
flowchart TD
    A[Admin Login] --> B[Select Content Type]
    B --> C{Blog or Portfolio?}
    C -->|Blog| D[Blog Management]
    C -->|Portfolio| E[Portfolio Management]
    
    D --> F[Create/Edit Blog Post]
    E --> G[Create/Edit Portfolio Project]
    
    F --> H[Rich Text Editor]
    G --> H
    
    H --> I[Upload Images]
    I --> J[Shared Images Library]
    J --> K[Select Images]
    K --> L[Insert into Content]
    
    L --> M[Save Content]
    M --> N[Update Database]
    N --> O[Activity Log]
    O --> P[Content Published]
```

---

## 6. Image Processing Pipeline

```mermaid
flowchart LR
    A[Image Upload] --> B[File Validation]
    B --> C{Valid File?}
    C -->|No| D[Show Error]
    C -->|Yes| E[Image Compression]
    E --> F[Format Conversion]
    F --> G[Upload to Storage]
    G --> H[Store Metadata]
    H --> I[Update UI]
    I --> J[Image Available]
    
    D --> K[Retry Upload]
    K --> A
```

---

## 7. Internationalization Architecture

```mermaid
graph TB
    subgraph "Client Side"
        A[Language Switcher] --> B[Language Provider]
        B --> C[Content Components]
    end
    
    subgraph "Routing Layer"
        D[/[lang]/blog] --> E[Language Detection]
        D --> F[/[lang]/portfolio]
        D --> G[/[lang]/about]
    end
    
    subgraph "Database Layer"
        H[Translation Tables] --> I[blog_post_translations]
        H --> J[portfolio_project_translations]
        H --> K[tag_translations]
    end
    
    subgraph "Content Layer"
        L[Vietnamese Content] --> H
        M[English Content] --> H
    end
    
    A --> B
    B --> C
    E --> H
    F --> H
    G --> H
```

---

## 8. Production Deployment Architecture

```mermaid
graph TB
    subgraph "CDN Layer"
        A[Vercel Edge Network] --> B[Static Assets]
        A --> C[Image CDN]
    end
    
    subgraph "Application Layer"
        D[Vercel Functions] --> E[Next.js App]
        E --> F[API Routes]
        E --> G[Server Components]
    end
    
    subgraph "Database Layer"
        H[Supabase Production] --> I[PostgreSQL]
        H --> J[Auth Service]
        H --> K[Storage Service]
    end
    
    subgraph "Monitoring"
        L[Vercel Analytics] --> E
        M[Supabase Monitoring] --> H
    end
    
    A --> E
    F --> H
    G --> H
    E --> L
    H --> M
```

---

## 9. Security Architecture

```mermaid
graph TB
    subgraph "Client Security"
        A[HTTPS Only] --> B[Secure Cookies]
        B --> C[JWT Tokens]
    end
    
    subgraph "Application Security"
        D[Input Validation] --> E[SQL Injection Prevention]
        E --> F[XSS Protection]
        F --> G[CSRF Protection]
    end
    
    subgraph "Database Security"
        H[Row Level Security] --> I[User Isolation]
        I --> J[Data Encryption]
    end
    
    subgraph "Storage Security"
        K[File Validation] --> L[Virus Scanning]
        L --> M[Access Controls]
    end
    
    A --> D
    D --> H
    H --> K
```

---

## 10. Performance Optimization Architecture

```mermaid
graph TB
    subgraph "Client Optimization"
        A[Code Splitting] --> B[Lazy Loading]
        B --> C[Image Optimization]
    end
    
    subgraph "Server Optimization"
        D[SSR/SSG] --> E[Edge Caching]
        E --> F[Database Indexing]
    end
    
    subgraph "CDN Optimization"
        G[Static Assets] --> H[Image CDN]
        H --> I[Edge Locations]
    end
    
    subgraph "Database Optimization"
        J[Query Optimization] --> K[Connection Pooling]
        K --> L[Read Replicas]
    end
    
    A --> D
    D --> G
    G --> J
```

---

## 11. Monitoring and Logging Architecture

```mermaid
graph TB
    subgraph "Application Monitoring"
        A[Error Tracking] --> B[Performance Monitoring]
        B --> C[User Analytics]
    end
    
    subgraph "Database Monitoring"
        D[Query Performance] --> E[Connection Monitoring]
        E --> F[Storage Monitoring]
    end
    
    subgraph "Infrastructure Monitoring"
        G[Server Health] --> H[CDN Performance]
        H --> I[Uptime Monitoring]
    end
    
    subgraph "Logging System"
        J[Activity Logs] --> K[Error Logs]
        K --> L[Audit Logs]
    end
    
    A --> D
    D --> G
    G --> J
```

---

## 12. Data Flow Architecture

```mermaid
flowchart TD
    A[User Input] --> B[Client Validation]
    B --> C[API Request]
    C --> D[Server Validation]
    D --> E[Database Query]
    E --> F[Data Processing]
    F --> G[Response Generation]
    G --> H[Client Update]
    H --> I[UI Rendering]
    
    J[Error Handling] --> K[User Feedback]
    L[Activity Logging] --> M[Audit Trail]
    
    B --> J
    D --> J
    E --> J
    F --> L
    G --> L
```

---

## 13. Component Architecture

```mermaid
graph TB
    subgraph "Layout Components"
        A[AdminLayout] --> B[Navigation]
        A --> C[Sidebar]
        D[PublicLayout] --> E[Header]
        D --> F[Footer]
    end
    
    subgraph "Content Components"
        G[BlogCard] --> H[BlogList]
        I[PortfolioCard] --> J[PortfolioList]
        K[RichTextEditor] --> L[SharedImagesLibrary]
    end
    
    subgraph "Utility Components"
        M[LanguageSwitcher] --> N[LanguageProvider]
        O[AuthProvider] --> P[ProtectedRoute]
        Q[SearchBar] --> R[SearchResults]
    end
    
    subgraph "Admin Components"
        S[AdminDashboard] --> T[ContentManagement]
        U[ImageManagement] --> V[ActivityLog]
    end
    
    A --> G
    A --> I
    A --> K
    D --> G
    D --> I
    M --> N
    O --> P
    S --> U
```

---

## 14. API Architecture

```mermaid
graph TB
    subgraph "Public APIs"
        A[/api/increment-view] --> B[View Counter]
        C[/api/shared-images] --> D[Image Management]
    end
    
    subgraph "Admin APIs"
        E[/api/admin/blog] --> F[Blog Management]
        G[/api/admin/portfolio] --> H[Portfolio Management]
        I[/api/admin/categories] --> J[Category Management]
    end
    
    subgraph "Utility APIs"
        K[/api/setup-about-me] --> L[About Me Setup]
        M[/api/setup-portfolio] --> N[Portfolio Setup]
        O[/api/update-image-url] --> P[Image URL Update]
    end
    
    subgraph "Database Layer"
        Q[(PostgreSQL)] --> R[Data Storage]
        S[(Supabase Storage)] --> T[File Storage]
    end
    
    A --> Q
    C --> S
    E --> Q
    G --> Q
    I --> Q
    K --> Q
    M --> Q
    O --> S
```

---

## 15. Deployment Pipeline

```mermaid
flowchart LR
    A[Code Commit] --> B[GitHub]
    B --> C[Vercel Build]
    C --> D[Tests]
    D --> E{Build Success?}
    E -->|No| F[Build Failed]
    E -->|Yes| G[Deploy to Vercel]
    G --> H[Environment Variables]
    H --> I[Database Migration]
    I --> J[Production Ready]
    
    F --> K[Fix Issues]
    K --> A
```

---

## Conclusion

The system architecture diagrams provide a comprehensive view of the Matt Dinh Blog Platform's production-ready architecture, including:

- **High-Level System Architecture**: Overall system components and relationships
- **Database Architecture**: Complete database schema with entity relationships
- **Shared Images Management**: Entity-scoped image storage and retrieval system
- **Authentication Flow**: Secure user authentication and authorization
- **Content Management Flow**: Complete content creation and management process
- **Production Deployment**: Live production infrastructure
- **Security Architecture**: Comprehensive security measures
- **Performance Optimization**: System performance and scalability features
- **Monitoring and Logging**: System monitoring and audit capabilities

All architectural components have been successfully implemented and deployed to production, providing a robust, scalable, and secure platform for content management and portfolio showcasing.

---

**Document Approval:**
- **System Architect:** Matt Dinh
- **Technical Lead:** Matt Dinh
- **Infrastructure Lead:** Matt Dinh
- **Date:** January 9, 2025

---

*Last updated: January 9, 2025*

---

**Production Deployment Update (2025-01-09):**
- All architectural components successfully implemented and deployed
- Shared Images Management architecture fully operational
- Production infrastructure and monitoring systems in place
- System ready for ongoing architectural enhancements and maintenance
