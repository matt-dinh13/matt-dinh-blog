# Matt Dinh Blog

A bilingual (Vietnamese/English) blog and portfolio website built with Next.js 15, Supabase, and TypeScript.

## 🚀 Features

### Core Features
- **Bilingual Support**: Full Vietnamese and English content with language switching
- **Blog System**: Rich text editor with image upload and processing
- **Portfolio**: Project showcase with detailed descriptions
- **Admin Panel**: Complete content management system
- **Responsive Design**: Mobile-first approach with dark/light mode
- **SEO Optimized**: Meta tags, Open Graph, and structured data

### Image Management
- **Rich Text Editor**: TipTap-based editor with image upload
- **Image Processing**: Automatic resizing, format conversion (JPG), and compression
- **Storage**: Supabase storage with optimized image delivery
- **Markdown Support**: Images embedded in Markdown content with HTML rendering

### Technical Stack
- **Frontend**: Next.js 15 (App Router), React 18, TypeScript
- **Styling**: Tailwind CSS with custom color scheme
- **Backend**: Supabase (PostgreSQL, Auth, Storage)
- **Editor**: TipTap with custom extensions
- **Deployment**: Vercel

## 🛠️ Setup

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Supabase account

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd matt-dinh-blog
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create `.env.local` with your Supabase credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   ```

4. **Database Setup**
   Run the SQL scripts in the `scripts/` folder:
   ```bash
   # Execute these in your Supabase SQL editor
   scripts/create-tables.sql
   scripts/seed-data.sql
   ```

5. **Start Development Server**
   ```bash
   npm run dev
   ```

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── [lang]/            # Language-specific routes
│   ├── admin/             # Admin panel
│   ├── api/               # API routes
│   ├── blog/              # Blog pages
│   └── portfolio/         # Portfolio pages
├── components/            # Reusable components
├── lib/                   # Utilities and configurations
└── styles/                # Global styles
```

## 🔧 Key Components

### Rich Text Editor
- **Location**: `src/components/RichTextEditor.tsx`
- **Features**: Image upload, processing, and Markdown conversion
- **Image Processing**: Resizes to 800px width, converts to JPG format

### Blog System
- **Content Storage**: Markdown format in Supabase
- **Image Rendering**: Converts Markdown images to HTML
- **Hydration Safe**: Prevents server/client mismatches

### Admin Panel
- **Authentication**: Supabase Auth integration
- **Content Management**: CRUD operations for posts, categories, tags
- **Image Management**: Upload and processing workflow

## 🚀 Deployment

### Vercel Deployment
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Environment Variables for Production
```env
NEXT_PUBLIC_SUPABASE_URL=your_production_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_production_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_production_service_role_key
```

## 📝 Recent Updates

### Image Upload & Display (Latest)
- ✅ Fixed image upload in rich text editor
- ✅ Implemented image processing (resize, format conversion)
- ✅ Resolved hydration errors with Markdown rendering
- ✅ Added proper image display in blog posts
- ✅ Optimized build process and TypeScript fixes

### Previous Updates
- ✅ Bilingual content management
- ✅ Admin panel with full CRUD operations
- ✅ Portfolio system implementation
- ✅ SEO optimization and meta tags
- ✅ Responsive design improvements

## 🔍 Troubleshooting

### Common Issues

1. **Image Not Displaying**
   - Check Supabase storage permissions
   - Verify image URLs in database content
   - Ensure proper Markdown to HTML conversion

2. **Hydration Errors**
   - Avoid using `marked` library on client side
   - Use simple regex for Markdown image conversion
   - Ensure server/client rendering consistency

3. **Build Errors**
   - Check TypeScript types for Next.js 15 compatibility
   - Verify all imports and component paths
   - Ensure proper Promise handling for params

## 📄 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

---

Built with ❤️ using Next.js and Supabase
