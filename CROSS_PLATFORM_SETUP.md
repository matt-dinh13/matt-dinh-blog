# Cross-Platform Development Setup Guide

## Project Successfully Imported! 🎉

Your Matt Dinh Blog project has been successfully cloned and set up for cross-platform development between Windows and Mac.

## ✅ Completed Setup Steps

1. **Repository Cloned**: Successfully imported from https://github.com/matt-dinh13/matt-dinh-blog
2. **Git Installed**: Git for Windows installed and configured
3. **Node.js Installed**: Node.js v24.6.0 installed and ready
4. **Dependencies Installed**: All npm packages installed (513 packages)
5. **Environment File**: `.env.local` created from `env.example`
6. **PowerShell Configured**: Execution policy set to allow npm scripts

## 🚀 Development Commands

### Start Development Server
```bash
npm run dev
```
The app will be available at: http://localhost:3000

### Other Available Commands
```bash
npm run build     # Build for production
npm start         # Start production server
npm run lint      # Run ESLint
```

## 🔧 Cross-Platform Development

### For Windows (Current Setup)
- **Terminal**: PowerShell (configured and ready)
- **Git**: Git for Windows installed
- **Node.js**: v24.6.0 installed via winget
- **Package Manager**: npm (included with Node.js)

### For Mac Setup
When you switch to Mac, follow these steps:

1. **Install Prerequisites**
   ```bash
   # Install Homebrew (if not already installed)
   /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
   
   # Install Node.js
   brew install node
   
   # Install Git (usually pre-installed)
   brew install git
   ```

2. **Clone and Setup**
   ```bash
   git clone https://github.com/matt-dinh13/matt-dinh-blog.git
   cd matt-dinh-blog
   npm install
   cp env.example .env.local
   npm run dev
   ```

## 📝 Environment Configuration

Your `.env.local` file has been created with default values. **Important**: You'll need to configure these for full functionality:

### Required Supabase Setup
1. **Create Supabase Account**: https://supabase.com
2. **Create New Project**: Follow Supabase onboarding
3. **Get Credentials**: 
   - Project URL
   - Anonymous Key
   - Service Role Key

4. **Update `.env.local`**:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_actual_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_actual_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_actual_service_role_key
   ```

### Database Setup
Run these SQL scripts in your Supabase SQL editor:
- `supabase-schema.sql` - Creates tables and relationships
- `supabase-migration.sql` - Sets up initial data

## 🔄 Git Workflow for Cross-Platform

### Syncing Between Machines
```bash
# Before starting work (pull latest changes)
git pull origin main

# After making changes
git add .
git commit -m "Your commit message"
git push origin main
```

### Branch Strategy (Recommended)
```bash
# Create feature branch
git checkout -b feature/your-feature-name

# Work on your feature, then push
git push origin feature/your-feature-name

# Merge via GitHub Pull Request
```

## 🛠️ Troubleshooting

### Common Windows Issues
1. **PowerShell Script Execution**: Already fixed with `Set-ExecutionPolicy`
2. **Path Issues**: Node.js and Git paths are configured
3. **Line Endings**: Git handles this automatically

### Common Mac Issues
1. **Permission Errors**: Use `sudo` only when necessary
2. **Node Version**: Use `nvm` for version management if needed
3. **Xcode Tools**: Install if Git clone fails: `xcode-select --install`

### Universal Solutions
1. **Clear npm cache**: `npm cache clean --force`
2. **Reinstall dependencies**: `rm -rf node_modules && npm install`
3. **Check Node version**: `node --version` (should be 18+)

## 📱 IDE Recommendations

### Cross-Platform IDEs
- **VS Code**: Excellent TypeScript/React support
- **WebStorm**: Full-featured for JavaScript development
- **Cursor**: AI-powered development environment

### VS Code Extensions
- ES7+ React/Redux/React-Native snippets
- Tailwind CSS IntelliSense
- Auto Rename Tag
- GitLens
- Thunder Client (for API testing)

## 🔒 Security Best Practices

1. **Never commit `.env` files** - Already in `.gitignore`
2. **Use different databases** for development/production
3. **Rotate API keys** regularly
4. **Use environment variables** for all secrets

## 📊 Project Structure Overview

```
matt-dinh-blog/
├── src/
│   ├── app/           # Next.js App Router
│   ├── components/    # React components
│   └── lib/          # Utilities
├── public/           # Static assets
├── supabase/         # Database configs
├── scripts/          # Build scripts
└── docs/            # Documentation
```

## 🚀 Next Steps

1. **Configure Supabase**: Set up your database (required for full functionality)
2. **Start Development**: Run `npm run dev` to begin coding
3. **Explore Features**: Check out the admin panel, blog system, and portfolio
4. **Customize**: Modify content, styling, and features to your needs

## 📞 Support

- **GitHub Issues**: https://github.com/matt-dinh13/matt-dinh-blog/issues
- **Documentation**: Check the README.md and other .md files
- **Supabase Docs**: https://supabase.com/docs

---

**You're all set! Happy coding! 🎯**

Last Updated: $(Get-Date -Format "yyyy-MM-dd HH:mm:ss")
