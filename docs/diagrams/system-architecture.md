# System Architecture Diagram

## High-Level System Architecture

```mermaid
graph TB
    %% User Layer
    subgraph "Users"
        Admin[Admin User]
        Reader[Reader/Visitor]
        Mobile[Mobile User]
    end

    %% Frontend Layer
    subgraph "Frontend (Next.js 15)"
        Pages[Pages & Components]
        API_Routes[API Routes]
        Middleware[Middleware]
        Auth_Provider[Auth Provider]
        Language_Provider[Language Provider]
        Rich_Text_Editor[Rich Text Editor]
        Image_Processor[Image Processor]
    end

    %% Backend Services
    subgraph "Backend Services (Supabase)"
        Auth[Authentication]
        Database[(PostgreSQL Database)]
        Storage[File Storage]
        RLS[Row Level Security]
        RealTime[Real-time Subscriptions]
    end

    %% External Services
    subgraph "External Services"
        Vercel[Vercel Hosting]
        CDN[Global CDN]
        Analytics[Analytics]
    end

    %% Database Tables
    subgraph "Database Schema"
        Users[Users Table]
        Posts[Blog Posts Table]
        Translations[Translations Table]
        Categories[Categories Table]
        Tags[Tags Table]
        Portfolio[Portfolio Table]
        Views[Page Views Table]
        Media[Media Table]
    end

    %% Connections
    Admin --> Pages
    Reader --> Pages
    Mobile --> Pages

    Pages --> API_Routes
    API_Routes --> Middleware
    Middleware --> Auth_Provider
    Auth_Provider --> Language_Provider

    Rich_Text_Editor --> Image_Processor
    Image_Processor --> Storage

    API_Routes --> Auth
    API_Routes --> Database
    API_Routes --> Storage
    API_Routes --> RealTime

    Auth --> RLS
    Database --> RLS
    Storage --> RLS

    Pages --> Vercel
    Vercel --> CDN
    Vercel --> Analytics

    Database --> Users
    Database --> Posts
    Database --> Translations
    Database --> Categories
    Database --> Tags
    Database --> Portfolio
    Database --> Views
    Database --> Media

    %% Styling
    classDef userClass fill:#e1f5fe,stroke:#01579b,stroke-width:2px
    classDef frontendClass fill:#f3e5f5,stroke:#4a148c,stroke-width:2px
    classDef backendClass fill:#e8f5e8,stroke:#1b5e20,stroke-width:2px
    classDef externalClass fill:#fff3e0,stroke:#e65100,stroke-width:2px
    classDef databaseClass fill:#fce4ec,stroke:#880e4f,stroke-width:2px

    class Admin,Reader,Mobile userClass
    class Pages,API_Routes,Middleware,Auth_Provider,Language_Provider,Rich_Text_Editor,Image_Processor frontendClass
    class Auth,Database,Storage,RLS,RealTime backendClass
    class Vercel,CDN,Analytics externalClass
    class Users,Posts,Translations,Categories,Tags,Portfolio,Views,Media databaseClass
```

## Component Architecture

```mermaid
graph LR
    %% Core Components
    subgraph "Core Components"
        Layout[Layout Component]
        Navigation[Navigation]
        Footer[Footer]
        AuthProvider[Auth Provider]
        LanguageProvider[Language Provider]
    end

    %% Page Components
    subgraph "Page Components"
        HomePage[Home Page]
        BlogPage[Blog Page]
        PostPage[Post Detail Page]
        PortfolioPage[Portfolio Page]
        AdminPage[Admin Page]
        LoginPage[Login Page]
    end

    %% UI Components
    subgraph "UI Components"
        BlogCard[Blog Card]
        PostCard[Post Card]
        SearchBar[Search Bar]
        LoadingSpinner[Loading Spinner]
        Tooltip[Tooltip]
        Breadcrumbs[Breadcrumbs]
        ImageDisplay[Image Display]
    end

    %% Admin Components
    subgraph "Admin Components"
        AdminLayout[Admin Layout]
        AdminDashboard[Admin Dashboard]
        PostEditor[Post Editor]
        RichTextEditor[Rich Text Editor]
        MediaManager[Media Manager]
        UserManager[User Manager]
        ImageProcessor[Image Processor]
    end

    %% Data Layer
    subgraph "Data Layer"
        SupabaseClient[Supabase Client]
        Utils[Utility Functions]
        Constants[Constants]
        Types[Type Definitions]
        ImageUtils[Image Utilities]
    end

    %% Connections
    Layout --> Navigation
    Layout --> Footer
    Layout --> AuthProvider
    Layout --> LanguageProvider

    HomePage --> BlogCard
    BlogPage --> PostCard
    PostPage --> Breadcrumbs
    PostPage --> ImageDisplay
    PortfolioPage --> PostCard
    AdminPage --> AdminLayout
    LoginPage --> AuthProvider

    AdminLayout --> AdminDashboard
    AdminLayout --> PostEditor
    AdminLayout --> MediaManager
    AdminLayout --> UserManager

    PostEditor --> RichTextEditor
    RichTextEditor --> ImageProcessor
    ImageProcessor --> ImageUtils

    BlogCard --> SupabaseClient
    PostCard --> SupabaseClient
    SearchBar --> SupabaseClient
    PostEditor --> SupabaseClient
    ImageDisplay --> SupabaseClient

    SupabaseClient --> Utils
    Utils --> Constants
    Utils --> Types
    ImageUtils --> Utils

    %% Styling
    classDef coreClass fill:#e3f2fd,stroke:#1565c0,stroke-width:2px
    classDef pageClass fill:#f1f8e9,stroke:#33691e,stroke-width:2px
    classDef uiClass fill:#fff8e1,stroke:#f57f17,stroke-width:2px
    classDef adminClass fill:#fce4ec,stroke:#c2185b,stroke-width:2px
    classDef dataClass fill:#f3e5f5,stroke:#7b1fa2,stroke-width:2px

    class Layout,Navigation,Footer,AuthProvider,LanguageProvider coreClass
    class HomePage,BlogPage,PostPage,PortfolioPage,AdminPage,LoginPage pageClass
    class BlogCard,PostCard,SearchBar,LoadingSpinner,Tooltip,Breadcrumbs,ImageDisplay uiClass
    class AdminLayout,AdminDashboard,PostEditor,RichTextEditor,MediaManager,UserManager,ImageProcessor adminClass
    class SupabaseClient,Utils,Constants,Types,ImageUtils dataClass
```

## Image Processing Flow

```mermaid
sequenceDiagram
    participant U as Admin User
    participant E as Rich Text Editor
    participant P as Image Processor
    participant S as Supabase Storage
    participant D as Database
    participant R as Reader

    %% Image Upload Flow
    U->>E: Upload Image
    E->>P: Process Image
    P->>P: Resize to 800px width
    P->>P: Convert to JPG format
    P->>P: Optimize quality
    P->>S: Upload processed image
    S-->>P: Return image URL
    P-->>E: Insert image in content
    E->>D: Save content with image URL
    D-->>E: Confirm save
    E-->>U: Show updated content

    %% Image Display Flow
    R->>R: Visit blog post
    R->>D: Fetch post content
    D-->>R: Return content with image URLs
    R->>S: Request image
    S-->>R: Serve optimized image
    R-->>R: Display image in content
```

## Content Rendering Flow

```mermaid
sequenceDiagram
    participant S as Server
    participant C as Client
    participant D as Database
    participant R as Reader

    %% Server-Side Rendering
    S->>D: Fetch blog post content
    D-->>S: Return Markdown content
    S->>S: Pass raw content to client
    S-->>C: Send HTML with raw content

    %% Client-Side Processing
    C->>C: Parse Markdown content
    C->>C: Convert image syntax to HTML
    C->>C: Render content safely
    C-->>R: Display content with images

    %% Hydration Safety
    Note over S,C: No server-side Markdown processing
    Note over C,R: Client-side image conversion prevents hydration errors
```

## Data Flow Architecture

```mermaid
sequenceDiagram
    participant U as User
    participant P as Pages
    participant A as API Routes
    participant M as Middleware
    participant S as Supabase
    participant D as Database

    %% Authentication Flow
    U->>P: Access Admin Page
    P->>M: Check Authentication
    M->>S: Validate Session
    S-->>M: Session Valid/Invalid
    M-->>P: Allow/Deny Access
    P-->>U: Show Admin Page/Login

    %% Content Creation Flow
    U->>P: Create Blog Post
    P->>A: Submit Post Data
    A->>S: Store in Database
    S-->>A: Confirm Storage
    A-->>P: Success Response
    P-->>U: Show Success Message

    %% Image Upload Flow
    U->>P: Upload Image in Editor
    P->>A: Process Image
    A->>S: Store Image
    S-->>A: Return Image URL
    A-->>P: Update Content
    P-->>U: Show Image in Editor

    %% Content Display Flow
    U->>P: View Blog Post
    P->>A: Fetch Post Data
    A->>S: Query Database
    S-->>A: Return Post Data
    A-->>P: Send Post Data
    P-->>U: Display Post with Images
```

## Updated Architecture Notes

### Image Processing Components
- **Rich Text Editor**: TipTap-based editor with image upload integration
- **Image Processor**: Client-side image processing with Canvas API
- **Image Utilities**: Helper functions for image manipulation and optimization
- **Image Display**: Responsive image rendering component

### Content Rendering Strategy
- **Server**: Passes raw Markdown content to client
- **Client**: Converts Markdown images to HTML using regex
- **Hydration Safety**: Prevents server/client mismatches
- **Performance**: Fast rendering without external libraries

### Storage Architecture
- **Supabase Storage**: Secure file storage with public read access
- **Image Organization**: Structured folder system for different content types
- **Optimization**: Automatic format conversion and compression
- **CDN**: Global content delivery through Vercel

---

*Last updated: January 19, 2025* 