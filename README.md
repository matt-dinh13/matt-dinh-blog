# Matt Dinh Blog

A modern, minimalist personal blog and portfolio built with Next.js 15, Supabase, and Tailwind CSS.

## Features

- **Modern Design**: Clean, navy/white color scheme with excellent readability
- **Blog System**: Full CRUD operations for blog posts with markdown support
- **Portfolio**: Showcase projects with detailed descriptions
- **Admin Panel**: Protected admin interface for content management
- **Authentication**: Secure login system with Supabase Auth
- **Responsive**: Mobile-first design that works on all devices
- **SEO Optimized**: Proper meta tags and structured data
- **Performance**: Fast loading with Next.js optimizations

## Tech Stack

- **Frontend**: Next.js 15, React, TypeScript
- **Styling**: Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Auth, Storage)
- **Deployment**: Vercel (recommended)

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd matt-dinh-blog
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to Settings > API to get your project URL and anon key
3. Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. Set Up Database

1. Go to your Supabase project dashboard
2. Navigate to SQL Editor
3. Copy and paste the contents of `supabase-schema.sql`
4. Run the SQL to create all tables, policies, and sample data

### 5. Create Admin User

1. Go to Authentication > Users in your Supabase dashboard
2. Click "Add User" and create an admin account:
   - Email: `admin@mattdinh.com`
   - Password: `admin123`
   - Full Name: `Matt Dinh`

### 6. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the blog.

## Project Structure

```
src/
├── app/                    # Next.js 15 app directory
│   ├── admin/             # Admin panel pages
│   ├── blog/              # Blog listing and detail pages
│   ├── portfolio/         # Portfolio pages
│   ├── about/             # About page
│   ├── login/             # Authentication page
│   └── layout.tsx         # Root layout
├── components/            # Reusable components
│   ├── Navigation.tsx     # Site navigation
│   ├── Footer.tsx         # Site footer
│   ├── AuthProvider.tsx   # Authentication context
│   ├── ProtectedRoute.tsx # Route protection
│   └── AdminContent.tsx   # Admin dashboard
└── lib/                   # Utility functions
    └── supabase.ts        # Supabase client configuration
```

## Database Schema

### Tables

- **users**: Extended user profiles
- **blog_posts**: Blog articles with content and metadata
- **portfolio_projects**: Portfolio projects with details
- **tags**: Blog post tags
- **blog_post_tags**: Many-to-many relationship between posts and tags

### Key Features

- Row Level Security (RLS) enabled on all tables
- Automatic user profile creation on signup
- Timestamp tracking for all records
- Proper indexing for performance

## Admin Panel

Access the admin panel at `/admin` after logging in with your admin credentials.

### Features

- **Blog Management**: Create, edit, delete blog posts
- **Portfolio Management**: Manage portfolio projects
- **Content Status**: Draft/Published status management
- **Real-time Updates**: Changes reflect immediately

## Customization

### Colors and Styling

The site uses a custom color palette defined in the components:

```typescript
const cardTextColor = { color: 'oklch(21% .034 264.665)' };
```

### Content

- Update the About page content in `src/app/about/page.tsx`
- Modify sample data in `supabase-schema.sql`
- Replace logo and cover images in the `public/` directory

### Navigation

Edit the navigation menu in `src/components/Navigation.tsx`:

```typescript
const menuItems = [
  { name: 'Blog', href: '/blog' },
  { name: 'Portfolio', href: '/portfolio' },
  { name: 'About', href: '/about' },
  { name: 'Admin', href: '/admin' },
]
```

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

### Environment Variables for Production

Make sure to set these in your deployment platform:

```env
NEXT_PUBLIC_SUPABASE_URL=your_production_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_production_supabase_anon_key
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is open source and available under the [MIT License](LICENSE).

## Support

For questions or issues, please open an issue on GitHub or contact Matt Dinh.
# Updated at Sun Jun 29 18:19:29 +07 2025
