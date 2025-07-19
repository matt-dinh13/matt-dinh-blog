# Backup and Restore Guide

## 📁 **Project Backup Strategy**

This guide covers how to backup and restore your Matt Dinh Blog project, including database, files, and configuration.

## 🗄️ **Database Backup (Supabase)**

### **1. Automatic Backups (Supabase)**
Supabase provides automatic daily backups for your database:
- **Retention**: 7 days of daily backups
- **Location**: Managed by Supabase
- **Access**: Via Supabase Dashboard

### **2. Manual Database Export**

#### **Export Schema and Data:**
```sql
-- Run this in Supabase SQL Editor to export your schema
SELECT 
    '-- Database Schema Export for Matt Dinh Blog' as export_info,
    '-- Generated on: ' || NOW() as export_date;

-- Export table structures
SELECT 
    'CREATE TABLE IF NOT EXISTS ' || table_name || ' (' ||
    string_agg(
        column_name || ' ' || data_type || 
        CASE WHEN is_nullable = 'NO' THEN ' NOT NULL' ELSE '' END ||
        CASE WHEN column_default IS NOT NULL THEN ' DEFAULT ' || column_default ELSE '' END,
        ', '
        ORDER BY ordinal_position
    ) || ');' as create_statement
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name IN ('blog_posts', 'blog_post_translations', 'portfolio_projects', 'portfolio_project_translations', 'tags', 'tag_translations', 'languages', 'users', 'blog_post_tags', 'activity_log')
GROUP BY table_name;

-- Export data
SELECT '-- Sample data export (run for each table)' as export_info;
```

#### **Export Specific Tables:**
```sql
-- Export blog posts
SELECT 'INSERT INTO blog_posts (id, slug, status, published_at, created_at, updated_at) VALUES (' ||
       id || ', ''' || slug || ''', ''' || status || ''', ''' || 
       COALESCE(published_at::text, 'NULL') || ''', ''' || 
       created_at || ''', ''' || updated_at || ''');'
FROM blog_posts;

-- Export blog post translations
SELECT 'INSERT INTO blog_post_translations (id, blog_post_id, language_code, title, summary, content, created_at, updated_at) VALUES (' ||
       id || ', ' || blog_post_id || ', ''' || language_code || ''', ''' || 
       REPLACE(title, '''', '''''') || ''', ''' || 
       COALESCE(REPLACE(summary, '''', ''''''), 'NULL') || ''', ''' || 
       REPLACE(content, '''', '''''') || ''', ''' || 
       created_at || ''', ''' || updated_at || ''');'
FROM blog_post_translations;
```

### **3. Database Restore**

#### **From Supabase Backup:**
1. Go to Supabase Dashboard
2. Navigate to Settings → Database
3. Click "Restore from backup"
4. Select the backup point
5. Confirm restoration

#### **From Manual Export:**
```sql
-- Run the exported SQL scripts in Supabase SQL Editor
-- Make sure to run in correct order:
-- 1. Create tables
-- 2. Insert data
-- 3. Create indexes
-- 4. Set up RLS policies
```

## 📂 **File System Backup**

### **1. Project Files Backup**

#### **Essential Files to Backup:**
```
matt-dinh-blog/
├── src/                    # Source code
├── public/                 # Static assets
├── scripts/               # Database scripts
├── docs/                  # Documentation
├── .env.local            # Environment variables (CRITICAL)
├── package.json          # Dependencies
├── next.config.ts        # Next.js configuration
├── tailwind.config.js    # Tailwind configuration
├── tsconfig.json         # TypeScript configuration
└── README.md             # Project documentation
```

#### **Backup Command:**
```bash
# Create a timestamped backup
BACKUP_DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_NAME="matt-dinh-blog-backup-$BACKUP_DATE"

# Create backup directory
mkdir -p backups/$BACKUP_NAME

# Copy essential files
cp -r src/ backups/$BACKUP_NAME/
cp -r public/ backups/$BACKUP_NAME/
cp -r scripts/ backups/$BACKUP_NAME/
cp -r docs/ backups/$BACKUP_NAME/
cp package.json backups/$BACKUP_NAME/
cp next.config.ts backups/$BACKUP_NAME/
cp tailwind.config.js backups/$BACKUP_NAME/
cp tsconfig.json backups/$BACKUP_NAME/
cp README.md backups/$BACKUP_NAME/

# Backup environment file (if exists)
if [ -f .env.local ]; then
    cp .env.local backups/$BACKUP_NAME/
fi

# Create backup archive
tar -czf backups/$BACKUP_NAME.tar.gz -C backups $BACKUP_NAME

# Clean up temporary directory
rm -rf backups/$BACKUP_NAME

echo "Backup created: backups/$BACKUP_NAME.tar.gz"
```

### **2. Environment Variables Backup**

#### **Critical Environment Variables:**
```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Database Configuration
DATABASE_URL=your_database_url

# Authentication
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=your_nextauth_url

# Storage Configuration
SUPABASE_STORAGE_BUCKET=your_storage_bucket
```

#### **Backup Environment Variables:**
```bash
# Export current environment variables
env | grep -E "(NEXT_PUBLIC_SUPABASE|SUPABASE_|DATABASE_|NEXTAUTH_)" > backup_env.txt

# Or manually document them
cat .env.local > backup_env.txt
```

## 🔄 **Restore Procedures**

### **1. Full Project Restore**

#### **From Backup Archive:**
```bash
# Extract backup
tar -xzf backups/matt-dinh-blog-backup-YYYYMMDD_HHMMSS.tar.gz

# Restore files
cp -r matt-dinh-blog-backup-YYYYMMDD_HHMMSS/* ./

# Install dependencies
npm install

# Restore environment variables
cp backup_env.txt .env.local

# Start the project
npm run dev
```

#### **Database Restore:**
```sql
-- Run in Supabase SQL Editor
-- 1. Drop existing tables (if needed)
DROP TABLE IF EXISTS blog_post_tags CASCADE;
DROP TABLE IF EXISTS tag_translations CASCADE;
DROP TABLE IF EXISTS tags CASCADE;
DROP TABLE IF EXISTS blog_post_translations CASCADE;
DROP TABLE IF EXISTS blog_posts CASCADE;
DROP TABLE IF EXISTS portfolio_project_translations CASCADE;
DROP TABLE IF EXISTS portfolio_projects CASCADE;
DROP TABLE IF EXISTS languages CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS activity_log CASCADE;

-- 2. Run the exported schema and data scripts
-- (from the backup export)
```

### **2. Partial Restore**

#### **Restore Only Database:**
```sql
-- Run exported data scripts in Supabase SQL Editor
-- This preserves your current schema but restores data
```

#### **Restore Only Code:**
```bash
# Restore only source code (preserves database)
cp -r backup/src ./
cp -r backup/public ./
cp package.json ./
npm install
```

## 🛡️ **Backup Security**

### **1. Environment Variables Security**
```bash
# Never commit .env files to git
echo ".env*" >> .gitignore
echo "backup_env.txt" >> .gitignore

# Store environment variables securely
# Use password managers or secure vaults
```

### **2. Database Security**
```sql
-- Backup RLS policies
SELECT 
    'CREATE POLICY "' || policyname || '" ON ' || tablename || ' ' ||
    cmd || ' USING (' || qual || ');' as policy_statement
FROM pg_policies 
WHERE schemaname = 'public';
```

### **3. Storage Security**
```bash
# Backup Supabase storage bucket contents
# Use Supabase CLI or dashboard to export files
```

## 📅 **Backup Schedule**

### **Recommended Backup Schedule:**

#### **Daily:**
- ✅ **Automatic Supabase backups** (handled by Supabase)

#### **Weekly:**
- 📁 **Manual file system backup**
- 🔧 **Environment variables backup**
- 📊 **Database schema export**

#### **Monthly:**
- 🗄️ **Full database export**
- 📦 **Complete project archive**
- 🔍 **Backup verification test**

#### **Before Major Changes:**
- 🚀 **Pre-deployment backup**
- 🔄 **Pre-migration backup**
- 🛠️ **Pre-update backup**

## 🔍 **Backup Verification**

### **1. Database Verification:**
```sql
-- Verify backup integrity
SELECT 
    'blog_posts' as table_name,
    COUNT(*) as record_count
FROM blog_posts
UNION ALL
SELECT 
    'blog_post_translations' as table_name,
    COUNT(*) as record_count
FROM blog_post_translations
UNION ALL
SELECT 
    'portfolio_projects' as table_name,
    COUNT(*) as record_count
FROM portfolio_projects;
```

### **2. File System Verification:**
```bash
# Verify backup files exist
ls -la backups/

# Check file integrity
md5sum backups/matt-dinh-blog-backup-*.tar.gz

# Test restore in temporary directory
mkdir test_restore
tar -xzf backups/matt-dinh-blog-backup-*.tar.gz -C test_restore
ls -la test_restore/
```

### **3. Application Verification:**
```bash
# Test restored application
cd test_restore
npm install
npm run build
npm run dev

# Check if application starts without errors
# Verify database connections
# Test key functionality
```

## 🚨 **Emergency Procedures**

### **1. Complete System Failure:**
```bash
# 1. Restore from latest backup
tar -xzf backups/latest-backup.tar.gz

# 2. Restore environment variables
cp backup_env.txt .env.local

# 3. Restore database from Supabase backup
# Use Supabase dashboard restore feature

# 4. Reinstall dependencies
npm install

# 5. Start application
npm run dev
```

### **2. Database Corruption:**
```sql
-- 1. Restore from Supabase backup
-- Use Supabase dashboard

-- 2. Or restore from manual export
-- Run exported SQL scripts

-- 3. Verify data integrity
-- Run verification queries
```

### **3. Code Issues:**
```bash
# 1. Restore from git (if using version control)
git checkout main
git pull origin main

# 2. Or restore from file backup
cp -r backup/src ./
cp -r backup/public ./

# 3. Reinstall dependencies
npm install
```

## 📋 **Backup Checklist**

### **Before Backup:**
- [ ] **Stop application** (if running)
- [ ] **Commit current changes** to git
- [ ] **Document current state** of application
- [ ] **Verify database connectivity**

### **During Backup:**
- [ ] **Export database schema** and data
- [ ] **Backup source code** and configuration
- [ ] **Backup environment variables**
- [ ] **Backup static assets** and uploads
- [ ] **Create backup archive**

### **After Backup:**
- [ ] **Verify backup integrity**
- [ ] **Test restore procedure**
- [ ] **Document backup location**
- [ ] **Update backup schedule**
- [ ] **Start application** and verify functionality

## 🎯 **Best Practices**

### **1. Regular Backups:**
- **Automate** backup processes where possible
- **Test** restore procedures regularly
- **Document** backup and restore procedures
- **Monitor** backup success/failure

### **2. Security:**
- **Encrypt** sensitive backup files
- **Store** backups in multiple locations
- **Limit** access to backup files
- **Rotate** backup files regularly

### **3. Testing:**
- **Test** restore procedures monthly
- **Verify** backup integrity
- **Document** any issues found
- **Update** procedures as needed

---

**Remember:** Regular backups are your safety net. Test your backup and restore procedures regularly to ensure they work when you need them! 🛡️ 