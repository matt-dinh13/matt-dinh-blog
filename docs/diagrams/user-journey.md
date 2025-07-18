# User Journey Diagrams

## Admin User Journey

```mermaid
journey
    title Admin User Journey
    section Authentication
      Login to Admin Panel: 5: Admin
      Enter Credentials: 4: Admin
      Access Dashboard: 5: Admin
    section Content Management
      Create New Blog Post: 5: Admin
      Edit Existing Post: 4: Admin
      Upload Images: 3: Admin
      Publish Content: 5: Admin
    section Portfolio Management
      Add Portfolio Project: 4: Admin
      Update Project Details: 3: Admin
      Manage Project Status: 3: Admin
    section Analytics
      View Dashboard Stats: 4: Admin
      Check Page Views: 3: Admin
      Review User Activity: 3: Admin
    section Maintenance
      Manage Categories: 2: Admin
      Update Tags: 2: Admin
      System Settings: 2: Admin
```

## Reader Journey

```mermaid
journey
    title Reader Journey
    section Discovery
      Visit Homepage: 5: Reader
      Browse Blog Posts: 5: Reader
      Search for Content: 4: Reader
      Filter by Category: 3: Reader
    section Content Consumption
      Read Blog Post: 5: Reader
      View Reading Time: 4: Reader
      Check Related Posts: 3: Reader
      Share Content: 3: Reader
    section Navigation
      Switch Language: 4: Reader
      Navigate Portfolio: 3: Reader
      View About Page: 3: Reader
    section Engagement
      Bookmark Content: 2: Reader
      Return for Updates: 4: Reader
      Recommend to Others: 3: Reader
```

## Visitor Journey

```mermaid
journey
    title First-Time Visitor Journey
    section Initial Contact
      Land on Homepage: 5: Visitor
      Read Hero Section: 4: Visitor
      Explore Navigation: 4: Visitor
    section Content Exploration
      Browse Latest Posts: 4: Visitor
      Check Portfolio: 3: Visitor
      Read About Page: 3: Visitor
    section Language Experience
      Notice Bilingual Support: 4: Visitor
      Switch Language: 3: Visitor
      Compare Content: 2: Visitor
    section Conversion
      Bookmark Site: 3: Visitor
      Share with Others: 2: Visitor
      Return Later: 4: Visitor
```

## User Flow Diagrams

### Admin Content Creation Flow

```mermaid
flowchart TD
    Start([Start]) --> Login[Login to Admin]
    Login --> Dashboard[Access Dashboard]
    Dashboard --> CreatePost[Create New Post]
    CreatePost --> FillForm[Fill Post Form]
    FillForm --> UploadImage[Upload Thumbnail]
    UploadImage --> AddContent[Add Content EN/VI]
    AddContent --> AddTags[Add Categories/Tags]
    AddTags --> Preview[Preview Post]
    Preview --> Publish{Ready to Publish?}
    Publish -->|Yes| PublishPost[Publish Post]
    Publish -->|No| EditPost[Edit Post]
    EditPost --> FillForm
    PublishPost --> Success[Post Published]
    Success --> End([End])
```

### Reader Content Discovery Flow

```mermaid
flowchart TD
    Start([Visit Site]) --> Homepage[Land on Homepage]
    Homepage --> BrowsePosts[Browse Latest Posts]
    BrowsePosts --> SelectPost[Select Post to Read]
    SelectPost --> ReadPost[Read Full Post]
    ReadPost --> CheckRelated[Check Related Posts]
    CheckRelated --> Search{Want to Search?}
    Search -->|Yes| SearchContent[Search for Content]
    Search -->|No| ContinueBrowsing[Continue Browsing]
    SearchContent --> SearchResults[View Search Results]
    SearchResults --> SelectFromResults[Select from Results]
    SelectFromResults --> ReadPost
    ContinueBrowsing --> BrowsePosts
    ReadPost --> End([End Session])
```

### Language Switching Flow

```mermaid
flowchart TD
    Start([User on Site]) --> CurrentLang[Current Language Content]
    CurrentLang --> SwitchLang[Click Language Switcher]
    SwitchLang --> CheckPref[Check Language Preference]
    CheckPref --> UpdateURL[Update URL with Language]
    UpdateURL --> LoadContent[Load Content in New Language]
    LoadContent --> UpdateUI[Update UI Language]
    UpdateUI --> SavePref[Save Language Preference]
    SavePref --> NewLang[New Language Content]
    NewLang --> Continue[Continue Browsing]
    Continue --> End([End])
```

## Page Navigation Flow

```mermaid
graph TD
    Homepage[Homepage] --> Blog[Blog Page]
    Homepage --> Portfolio[Portfolio Page]
    Homepage --> About[About Page]
    Homepage --> Search[Search Page]
    
    Blog --> PostDetail[Post Detail Page]
    Blog --> CategoryPage[Category Page]
    Blog --> TagPage[Tag Page]
    
    Portfolio --> ProjectDetail[Project Detail Page]
    
    PostDetail --> RelatedPosts[Related Posts]
    PostDetail --> CategoryPage
    PostDetail --> TagPage
    
    Search --> SearchResults[Search Results]
    SearchResults --> PostDetail
    
    CategoryPage --> PostDetail
    TagPage --> PostDetail
    
    %% Admin Routes
    Homepage --> Login[Login Page]
    Login --> AdminDashboard[Admin Dashboard]
    AdminDashboard --> PostEditor[Post Editor]
    AdminDashboard --> PortfolioEditor[Portfolio Editor]
    AdminDashboard --> UserManagement[User Management]
    
    %% Styling
    classDef publicClass fill:#e8f5e8,stroke:#2e7d32,stroke-width:2px
    classDef adminClass fill:#fce4ec,stroke:#c2185b,stroke-width:2px
    classDef detailClass fill:#e3f2fd,stroke:#1565c0,stroke-width:2px
    
    class Homepage,Blog,Portfolio,About,Search publicClass
    class Login,AdminDashboard,PostEditor,PortfolioEditor,UserManagement adminClass
    class PostDetail,ProjectDetail,CategoryPage,TagPage,SearchResults,RelatedPosts detailClass
```

## Authentication Flow

```mermaid
sequenceDiagram
    participant U as User
    participant P as Page
    participant M as Middleware
    participant A as Auth Provider
    participant S as Supabase
    participant D as Database

    %% Login Flow
    U->>P: Access Admin Page
    P->>M: Check Authentication
    M->>A: Get Current Session
    A->>S: Validate Session
    S->>D: Query User Data
    D-->>S: User Data
    S-->>A: Session Status
    A-->>M: Authentication Result
    
    alt Authenticated
        M-->>P: Allow Access
        P-->>U: Show Admin Page
    else Not Authenticated
        M-->>P: Redirect to Login
        P-->>U: Show Login Page
        U->>P: Enter Credentials
        P->>A: Login Request
        A->>S: Authenticate User
        S->>D: Verify Credentials
        D-->>S: User Verification
        S-->>A: Authentication Result
        A-->>P: Login Result
        P-->>U: Redirect to Admin
    end

    %% Logout Flow
    U->>P: Click Logout
    P->>A: Logout Request
    A->>S: Clear Session
    S-->>A: Session Cleared
    A-->>P: Logout Complete
    P-->>U: Redirect to Home
```

## Content Management Workflow

```mermaid
stateDiagram-v2
    [*] --> Draft: Create Post
    Draft --> Review: Submit for Review
    Review --> Draft: Request Changes
    Review --> Published: Approve
    Published --> Draft: Edit
    Published --> Archived: Archive
    Archived --> Draft: Restore
    Draft --> [*]: Delete
    Review --> [*]: Reject
    Published --> [*]: Delete
    Archived --> [*]: Delete
```

## User Experience Metrics

```mermaid
graph LR
    subgraph "User Satisfaction Metrics"
        PageLoad[Page Load Time]
        Navigation[Navigation Ease]
        Content[Content Quality]
        Mobile[Mobile Experience]
    end
    
    subgraph "Engagement Metrics"
        TimeOnSite[Time on Site]
        PageViews[Page Views]
        BounceRate[Bounce Rate]
        ReturnVisits[Return Visits]
    end
    
    subgraph "Content Metrics"
        ReadTime[Reading Time]
        ShareCount[Share Count]
        SearchQueries[Search Queries]
        CategoryViews[Category Views]
    end
    
    subgraph "Technical Metrics"
        Uptime[Uptime]
        ErrorRate[Error Rate]
        Performance[Performance Score]
        Accessibility[Accessibility Score]
    end
``` 