# Supabase Integration Setup Guide

Your blog is now fully integrated with Supabase! Here's how to get everything working with real data.

## 🎉 What's Been Updated

✅ **Blog List Page** - Now fetches posts from Supabase  
✅ **Individual Blog Posts** - Now fetches from Supabase by slug  
✅ **Homepage** - Now shows latest posts from Supabase  
✅ **Portfolio List** - Now fetches projects from Supabase  
✅ **Admin Panel** - Already connected to Supabase for creating posts  

## 🚀 Quick Start

### 1. Run the Database Migration

First, make sure your Supabase database is set up with the correct schema:

1. Go to your Supabase project dashboard
2. Navigate to the SQL Editor
3. Run the migration script: `supabase-migration.sql`

### 2. Seed Sample Data

To see your blog working with real data, run the seed script:

1. In the Supabase SQL Editor, run: `scripts/seed-data.sql`
2. This will create sample blog posts and portfolio projects

### 3. Test Your Blog

Now you can:
- Visit your homepage to see the latest blog posts
- Click on blog posts to read the full articles
- Visit the portfolio page to see your projects
- Use the admin panel to create new posts

## 📝 How It Works

### Blog Posts Flow
1. **Admin Panel** → Creates posts in `blog_posts` table
2. **Blog List** → Fetches published posts with translations
3. **Individual Posts** → Fetches specific post by slug
4. **Homepage** → Shows latest 4 published posts

### Multi-Language Support
- Posts are stored in `blog_posts` table
- Content is in `blog_post_translations` table
- Tags are in `tags` and `tag_translations` tables
- Language switching works automatically

### Portfolio Projects Flow
1. **Admin Panel** → Creates projects in `portfolio_projects` table
2. **Portfolio List** → Fetches published projects with translations
3. **Individual Projects** → Fetches specific project by slug

## 🔧 Creating New Content

### Via Admin Panel
1. Go to `/admin`
2. Click "Add New Blog Post" or "Add New Portfolio Project"
3. Fill in the form and publish
4. Your content will immediately appear on the blog!

### Via Supabase Dashboard
You can also create content directly in the Supabase dashboard:
1. Go to your Supabase project
2. Navigate to Table Editor
3. Add records to the appropriate tables

## 📊 Database Schema

### Blog Posts
- `blog_posts` - Main post data (slug, status, dates)
- `blog_post_translations` - Multi-language content
- `tags` - Tag definitions
- `tag_translations` - Multi-language tag names
- `blog_post_tags` - Links posts to tags

### Portfolio Projects
- `portfolio_projects` - Main project data
- `portfolio_project_translations` - Multi-language content

### Languages
- `languages` - Supported languages (en, vi)

## 🎨 Customization

### Adding New Languages
1. Insert new language in `languages` table
2. Add translations for existing content
3. Update the language switcher if needed

### Modifying the Design
- All styling is in the client components
- Colors and layout can be customized in the CSS classes
- The `cardTextColor` style object controls text colors

### Adding New Features
- The Supabase queries are in the client components
- You can modify the queries to add filtering, search, etc.
- The admin panel can be extended for more content types

## 🐛 Troubleshooting

### No Posts Showing
- Check that posts have `status = 'published'`
- Ensure translations exist for the current language
- Verify the Supabase connection in `.env.local`

### Admin Panel Not Working
- Make sure you're logged in
- Check that RLS policies allow authenticated users
- Verify the user has the correct permissions

### Language Switching Issues
- Ensure translations exist for both languages
- Check that the language codes match (en, vi)
- Verify the LanguageProvider is working

## 🔒 Security

The database uses Row Level Security (RLS) with these policies:
- **Public**: Can view published posts and projects
- **Authenticated**: Can view all content and create new content
- **Ownership**: Can edit/delete their own content

## 📈 Next Steps

1. **Add Real Content** - Replace sample data with your actual blog posts
2. **Customize Design** - Adjust colors, layout, and styling
3. **Add Features** - Implement search, categories, comments
4. **SEO Optimization** - Add meta tags, sitemap, analytics
5. **Deploy** - Deploy to Vercel, Netlify, or your preferred platform

## 🆘 Need Help?

If you encounter any issues:
1. Check the browser console for errors
2. Verify your Supabase connection
3. Check the database schema matches the migration
4. Ensure all environment variables are set correctly

Your blog is now fully functional with Supabase! 🎉 