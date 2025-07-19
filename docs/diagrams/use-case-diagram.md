# Use Case Diagram
## Matt Dinh Blog Platform

**Version**: 1.0  
**Date**: December 2024  
**Status**: Core Use Cases Complete ✅

---

## Use Case Diagram Overview

The Matt Dinh Blog platform serves multiple user types with different goals and permissions. This diagram shows the relationships between actors and the use cases they can perform.

---

## Use Case Diagram

```
┌─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                                    MATT DINH BLOG PLATFORM                                                      │
│                                                           USE CASE DIAGRAM                                                      │
├─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                                                               │
│  ┌─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐ │
│  │                                    EXTERNAL ACTORS                                                                          │ │
│  │                                                                                                                             │ │
│  │  ┌─────────────┐                    ┌─────────────┐                    ┌─────────────┐                                    │ │
│  │  │   Blog      │                    │   Portfolio │                    │   Social    │                                    │ │
│  │  │   Reader    │                    │   Viewer    │                    │   Media     │                                    │ │
│  │  │             │                    │             │                    │   Platform  │                                    │ │
│  │  └─────────────┘                    └─────────────┘                    └─────────────┘                                    │ │
│  │                                                                                                                             │ │
│  └─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘ │
│                                                                                                                               │
│  ┌─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐ │
│  │                                    INTERNAL ACTORS                                                                          │ │
│  │                                                                                                                             │ │
│  │  ┌─────────────┐                    ┌─────────────┐                    ┌─────────────┐                                    │ │
│  │  │   Content   │                    │   System    │                    │   Database  │                                    │ │
│  │  │   Creator   │                    │   Admin     │                    │   System    │                                    │ │
│  │  │   (Admin)   │                    │             │                    │             │                                    │ │
│  │  └─────────────┘                    └─────────────┘                    └─────────────┘                                    │ │
│  │                                                                                                                             │ │
│  └─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘ │
│                                                                                                                               │
│  ┌─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐ │
│  │                                    USE CASES                                                                                │ │
│  │                                                                                                                             │ │
│  │  ┌─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐ │ │
│  │  │                              BLOG READER USE CASES                                                                       │ │ │
│  │  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐                │ │ │
│  │  │  │ ✅ Browse   │  │ ✅ Read     │  │ ✅ Search   │  │ ✅ Filter   │  │ ✅ Switch   │  │ ✅ Share    │                │ │ │
│  │  │  │ ✅ Posts    │  │ ✅ Content  │  │ ✅ Posts    │  │ ✅ By Cat   │  │ ✅ Language │  │ ✅ Posts    │                │ │ │
│  │  │  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘                │ │ │
│  │  └─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘ │ │
│  │                                                                                                                             │ │
│  │  ┌─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐ │ │
│  │  │                            PORTFOLIO VIEWER USE CASES                                                                     │ │ │
│  │  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐                │ │ │
│  │  │  │ 🔄 Browse   │  │ 🔄 View     │  │ 🔄 Filter   │  │ 🔄 Contact  │  │ 🔄 Download │  │ 🔄 Rate     │                │ │ │
│  │  │  │ 🔄 Projects │  │ 🔄 Details  │  │ 🔄 By Tech  │  │ 🔄 Creator  │  │ 🔄 Assets   │  │ 🔄 Projects │                │ │ │
│  │  │  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘                │ │ │
│  │  └─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘ │ │
│  │                                                                                                                             │ │
│  │  ┌─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐ │ │
│  │  │                           CONTENT CREATOR USE CASES                                                                       │ │ │
│  │  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐                │ │ │
│  │  │  │ ✅ Create   │  │ ✅ Edit     │  │ ✅ Delete   │  │ ✅ Publish  │  │ ✅ Upload   │  │ ✅ Manage   │                │ │ │
│  │  │  │ ✅ Posts    │  │ ✅ Posts    │  │ ✅ Posts    │  │ ✅ Posts    │  │ ✅ Images   │  │ ✅ Categories│                │ │ │
│  │  │  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘                │ │ │
│  │  └─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘ │ │
│  │                                                                                                                             │ │
│  │  ┌─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐ │ │
│  │  │                             SYSTEM ADMIN USE CASES                                                                        │ │ │
│  │  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐                │ │ │
│  │  │  │ ✅ Manage   │  │ ✅ Monitor  │  │ ✅ Backup   │  │ ✅ Configure│  │ ✅ Security │  │ ✅ Analytics│                │ │ │
│  │  │  │ ✅ Users    │  │ ✅ System   │  │ ✅ Data     │  │ ✅ Settings │  │ ✅ Policies │  │ ✅ Reports  │                │ │ │
│  │  │  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘                │ │ │
│  │  └─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘ │ │
│  │                                                                                                                             │ │
│  │  ┌─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐ │ │
│  │  │                            DATABASE SYSTEM USE CASES                                                                      │ │ │
│  │  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐                │ │ │
│  │  │  │ ✅ Store    │  │ ✅ Retrieve │  │ ✅ Update   │  │ ✅ Delete   │  │ ✅ Index    │  │ ✅ Backup   │                │ │ │
│  │  │  │ ✅ Data     │  │ ✅ Data     │  │ ✅ Data     │  │ ✅ Data     │  │ ✅ Content  │  │ ✅ Data     │                │ │ │
│  │  │  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘                │ │ │
│  │  └─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘ │ │
│  └─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘ │
│                                                                                                                               │
│  ┌─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐ │
│  │                                    RELATIONSHIPS                                                                             │ │
│  │                                                                                                                             │ │
│  │  Blog Reader ──────► Browse Posts, Read Content, Search Posts, Filter By Category, Switch Language, Share Posts            │ │
│  │  Portfolio Viewer ──► Browse Projects, View Details, Filter By Technology, Contact Creator, Download Assets, Rate Projects │ │
│  │  Content Creator ───► Create Posts, Edit Posts, Delete Posts, Publish Posts, Upload Images, Manage Categories              │ │
│  │  System Admin ──────► Manage Users, Monitor System, Backup Data, Configure Settings, Security Policies, Analytics Reports  │ │
│  │  Database System ───► Store Data, Retrieve Data, Update Data, Delete Data, Index Content, Backup Data                     │ │
│  │  Social Media ──────► Share Posts, Rate Content, Comment on Posts, Follow Creator                                         │ │
│  │                                                                                                                             │ │
│  └─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## Detailed Use Case Descriptions

### 1. Blog Reader Use Cases (✅ Complete)

#### 1.1 Browse Posts
- **Actor**: Blog Reader
- **Description**: User can browse through all published blog posts
- **Preconditions**: User has access to the blog
- **Main Flow**:
  1. User visits blog page
  2. System displays list of published posts
  3. User can navigate through posts
  4. User can see post thumbnails and summaries
- **Postconditions**: User can see all available blog posts

#### 1.2 Read Content
- **Actor**: Blog Reader
- **Description**: User can read full blog post content
- **Preconditions**: User has selected a blog post
- **Main Flow**:
  1. User clicks on a blog post
  2. System displays full post content
  3. User can read the complete article
  4. User can see images and formatting
- **Postconditions**: User has read the complete blog post

#### 1.3 Search Posts
- **Actor**: Blog Reader
- **Description**: User can search for specific content
- **Preconditions**: User is on blog page
- **Main Flow**:
  1. User enters search terms
  2. System searches through post titles and content
  3. System displays relevant results
  4. User can click on search results
- **Postconditions**: User finds relevant content

#### 1.4 Filter By Category
- **Actor**: Blog Reader
- **Description**: User can filter posts by category
- **Preconditions**: User is on blog page
- **Main Flow**:
  1. User selects a category
  2. System filters posts by selected category
  3. System displays filtered results
  4. User can browse category-specific posts
- **Postconditions**: User sees posts from selected category

#### 1.5 Switch Language
- **Actor**: Blog Reader
- **Description**: User can switch between Vietnamese and English
- **Preconditions**: User is viewing content
- **Main Flow**:
  1. User clicks language switcher
  2. System changes interface language
  3. System loads content in selected language
  4. User sees content in preferred language
- **Postconditions**: Content is displayed in selected language

#### 1.6 Share Posts
- **Actor**: Blog Reader
- **Description**: User can share posts on social media
- **Preconditions**: User is viewing a blog post
- **Main Flow**:
  1. User clicks share button
  2. System provides sharing options
  3. User selects social platform
  4. System generates share link
- **Postconditions**: Post is shared on selected platform

### 2. Portfolio Viewer Use Cases (🔄 In Progress)

#### 2.1 Browse Projects
- **Actor**: Portfolio Viewer
- **Description**: User can browse portfolio projects
- **Preconditions**: User has access to portfolio
- **Main Flow**:
  1. User visits portfolio page
  2. System displays list of projects
  3. User can navigate through projects
  4. User can see project thumbnails
- **Postconditions**: User can see all available projects

#### 2.2 View Details
- **Actor**: Portfolio Viewer
- **Description**: User can view detailed project information
- **Preconditions**: User has selected a project
- **Main Flow**:
  1. User clicks on a project
  2. System displays project details
  3. User can see project description
  4. User can view project images
- **Postconditions**: User has viewed complete project details

#### 2.3 Filter By Technology
- **Actor**: Portfolio Viewer
- **Description**: User can filter projects by technology
- **Preconditions**: User is on portfolio page
- **Main Flow**:
  1. User selects a technology
  2. System filters projects by technology
  3. System displays filtered results
  4. User can browse technology-specific projects
- **Postconditions**: User sees projects using selected technology

#### 2.4 Contact Creator
- **Actor**: Portfolio Viewer
- **Description**: User can contact Matt about opportunities
- **Preconditions**: User is viewing portfolio
- **Main Flow**:
  1. User clicks contact button
  2. System displays contact form
  3. User fills out contact information
  4. User submits contact request
- **Postconditions**: Contact request is sent to Matt

### 3. Content Creator Use Cases (✅ Complete)

#### 3.1 Create Posts
- **Actor**: Content Creator (Admin)
- **Description**: Admin can create new blog posts
- **Preconditions**: Admin is logged in
- **Main Flow**:
  1. Admin accesses post creation form
  2. Admin enters post title and content
  3. Admin uploads images if needed
  4. Admin saves post as draft or publishes
- **Postconditions**: New blog post is created

#### 3.2 Edit Posts
- **Actor**: Content Creator (Admin)
- **Description**: Admin can edit existing blog posts
- **Preconditions**: Admin is logged in and post exists
- **Main Flow**:
  1. Admin selects post to edit
  2. Admin modifies post content
  3. Admin updates images if needed
  4. Admin saves changes
- **Postconditions**: Blog post is updated

#### 3.3 Delete Posts
- **Actor**: Content Creator (Admin)
- **Description**: Admin can delete blog posts
- **Preconditions**: Admin is logged in and post exists
- **Main Flow**:
  1. Admin selects post to delete
  2. System asks for confirmation
  3. Admin confirms deletion
  4. System removes post from database
- **Postconditions**: Blog post is deleted

#### 3.4 Publish Posts
- **Actor**: Content Creator (Admin)
- **Description**: Admin can publish draft posts
- **Preconditions**: Admin is logged in and post exists as draft
- **Main Flow**:
  1. Admin selects draft post
  2. Admin clicks publish button
  3. System changes post status to published
  4. Post becomes visible to readers
- **Postconditions**: Blog post is published and visible

#### 3.5 Upload Images
- **Actor**: Content Creator (Admin)
- **Description**: Admin can upload images for posts
- **Preconditions**: Admin is logged in
- **Main Flow**:
  1. Admin clicks upload image button
  2. Admin selects image file
  3. System processes and optimizes image
  4. System stores image and returns URL
- **Postconditions**: Image is uploaded and available

#### 3.6 Manage Categories
- **Actor**: Content Creator (Admin)
- **Description**: Admin can manage content categories
- **Preconditions**: Admin is logged in
- **Main Flow**:
  1. Admin accesses category management
  2. Admin creates, edits, or deletes categories
  3. Admin assigns categories to posts
  4. System updates category relationships
- **Postconditions**: Categories are managed properly

### 4. System Admin Use Cases (✅ Complete)

#### 4.1 Manage Users
- **Actor**: System Admin
- **Description**: Admin can manage user accounts
- **Preconditions**: Admin is logged in with admin privileges
- **Main Flow**:
  1. Admin accesses user management
  2. Admin views user list
  3. Admin can create, edit, or delete users
  4. Admin can assign user roles
- **Postconditions**: User accounts are managed

#### 4.2 Monitor System
- **Actor**: System Admin
- **Description**: Admin can monitor system performance
- **Preconditions**: Admin is logged in with admin privileges
- **Main Flow**:
  1. Admin accesses system dashboard
  2. Admin views performance metrics
  3. Admin monitors error logs
  4. Admin checks system health
- **Postconditions**: System is monitored

#### 4.3 Backup Data
- **Actor**: System Admin
- **Description**: Admin can backup system data
- **Preconditions**: Admin is logged in with admin privileges
- **Main Flow**:
  1. Admin initiates backup process
  2. System creates backup of database
  3. System stores backup securely
  4. Admin receives backup confirmation
- **Postconditions**: System data is backed up

#### 4.4 Configure Settings
- **Actor**: System Admin
- **Description**: Admin can configure system settings
- **Preconditions**: Admin is logged in with admin privileges
- **Main Flow**:
  1. Admin accesses settings page
  2. Admin modifies system configuration
  3. Admin saves settings changes
  4. System applies new settings
- **Postconditions**: System settings are updated

#### 4.5 Security Policies
- **Actor**: System Admin
- **Description**: Admin can manage security policies
- **Preconditions**: Admin is logged in with admin privileges
- **Main Flow**:
  1. Admin accesses security settings
  2. Admin configures authentication policies
  3. Admin sets up access controls
  4. Admin configures data protection
- **Postconditions**: Security policies are configured

#### 4.6 Analytics Reports
- **Actor**: System Admin
- **Description**: Admin can view analytics reports
- **Preconditions**: Admin is logged in with admin privileges
- **Main Flow**:
  1. Admin accesses analytics dashboard
  2. Admin views user engagement metrics
  3. Admin analyzes content performance
  4. Admin generates reports
- **Postconditions**: Analytics data is available

### 5. Database System Use Cases (✅ Complete)

#### 5.1 Store Data
- **Actor**: Database System
- **Description**: System stores data in database
- **Preconditions**: Data is provided by application
- **Main Flow**:
  1. Application sends data to database
  2. Database validates data
  3. Database stores data securely
  4. Database confirms storage
- **Postconditions**: Data is stored in database

#### 5.2 Retrieve Data
- **Actor**: Database System
- **Description**: System retrieves data from database
- **Preconditions**: Valid query is provided
- **Main Flow**:
  1. Application sends query to database
  2. Database processes query
  3. Database returns requested data
  4. Application receives data
- **Postconditions**: Requested data is retrieved

#### 5.3 Update Data
- **Actor**: Database System
- **Description**: System updates existing data
- **Preconditions**: Data exists and update is authorized
- **Main Flow**:
  1. Application sends update request
  2. Database validates update
  3. Database updates data
  4. Database confirms update
- **Postconditions**: Data is updated

#### 5.4 Delete Data
- **Actor**: Database System
- **Description**: System deletes data from database
- **Preconditions**: Data exists and deletion is authorized
- **Main Flow**:
  1. Application sends delete request
  2. Database validates deletion
  3. Database removes data
  4. Database confirms deletion
- **Postconditions**: Data is deleted

#### 5.5 Index Content
- **Actor**: Database System
- **Description**: System indexes content for search
- **Preconditions**: Content exists in database
- **Main Flow**:
  1. Database analyzes content
  2. Database creates search indexes
  3. Database optimizes search performance
  4. Database maintains indexes
- **Postconditions**: Content is indexed for search

#### 5.6 Backup Data
- **Actor**: Database System
- **Description**: System creates data backups
- **Preconditions**: Data exists in database
- **Main Flow**:
  1. System initiates backup process
  2. System creates backup copy
  3. System stores backup securely
  4. System confirms backup completion
- **Postconditions**: Data is backed up

---

## Use Case Relationships

### Include Relationships
- **Browse Posts** includes **Filter By Category**
- **Read Content** includes **Switch Language**
- **Create Posts** includes **Upload Images**
- **Edit Posts** includes **Upload Images**
- **Manage Users** includes **Security Policies**

### Extend Relationships
- **Search Posts** extends **Browse Posts**
- **Share Posts** extends **Read Content**
- **Contact Creator** extends **View Details**
- **Analytics Reports** extends **Monitor System**

### Generalization Relationships
- **Content Creator** is a specialized type of **System Admin**
- **Blog Reader** and **Portfolio Viewer** are types of **External User**

---

## Current Implementation Status

### ✅ **Fully Implemented Use Cases**
- All Blog Reader use cases (6/6)
- All Content Creator use cases (6/6)
- All System Admin use cases (6/6)
- All Database System use cases (6/6)

### 🔄 **In Progress Use Cases**
- Portfolio Viewer use cases (6/6) - Needs server-side rendering fix

### 🟢 **Future Use Cases**
- Advanced search capabilities
- Comment system
- Newsletter subscription
- Social media integration
- Advanced analytics

---

**Diagram Version**: 1.0  
**Last Updated**: December 2024  
**Status**: Core use cases complete and functional 