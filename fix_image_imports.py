import os
import re

# Files that need Image import added
files_to_fix = [
    'src/app/admin/blog/edit/[id]/AdminBlogEditForm.tsx',
    'src/app/admin/blog/new/page.tsx',
    'src/app/admin/portfolio/edit/[id]/page.tsx',
    'src/app/admin/portfolio/new/page.tsx',
    'src/app/admin/shared-images/page.tsx',
    'src/app/blog/[slug]/ArticleDetailsClient.tsx',
    'src/app/portfolio/PortfolioClientWrapper.tsx',
    'src/app/portfolio/PortfolioListClient.tsx',
    'src/components/AdminLayout.tsx',
    'src/components/BlogCard.tsx',
    'src/components/SharedImagesLibrary.tsx'
]

def add_image_import(file_path):
    if not os.path.exists(file_path):
        print(f"File not found: {file_path}")
        return False
    
    with open(file_path, 'r') as f:
        content = f.read()
    
    # Check if Image is already imported
    if 'import Image from' in content:
        print(f"Image already imported in {file_path}")
        return True
    
    # Find the first import statement
    lines = content.split('\n')
    import_line = 0
    
    for i, line in enumerate(lines):
        if line.strip().startswith('import '):
            import_line = i
            break
    
    # Add Image import after the last import
    lines.insert(import_line + 1, "import Image from 'next/image'")
    
    # Write back
    with open(file_path, 'w') as f:
        f.write('\n'.join(lines))
    
    print(f"Added Image import to {file_path}")
    return True

# Fix each file
for file_path in files_to_fix:
    add_image_import(file_path)

print("Image import fixes complete!")
