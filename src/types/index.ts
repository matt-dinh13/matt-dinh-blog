/**
 * Comprehensive TypeScript type definitions for Matt Dinh Blog
 * This file replaces all 'any' types with proper type safety
 */

// ============================================================================
// Language and Localization Types
// ============================================================================

export type LanguageCode = 'vi' | 'en';

export interface Language {
  code: LanguageCode;
  name: string;
  flag: string;
}

// ============================================================================
// User and Authentication Types
// ============================================================================

export interface User {
  id: string;
  email: string;
  name?: string;
  avatar_url?: string;
  role: 'admin' | 'user';
  created_at: string;
  updated_at: string;
}

export interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

// ============================================================================
// Blog Post Types
// ============================================================================

export interface BlogPostTranslation {
  id: number;
  blog_post_id: number;
  language_code: LanguageCode;
  title: string;
  summary: string;
  content: string;
  meta_title?: string;
  meta_description?: string;
  created_at: string;
  updated_at: string;
}

export interface BlogPost {
  id: number;
  slug: string;
  status: 'draft' | 'published' | 'archived';
  thumbnail_url?: string;
  author_id?: string;
  category_id?: number;
  published_at?: string;
  created_at: string;
  updated_at: string;
  view_count: number;
  blog_post_translations: BlogPostTranslation[];
  categories?: Category;
  tags?: Tag[];
}

export interface BlogPostWithTranslations extends Omit<BlogPost, 'blog_post_translations'> {
  blog_post_translations: BlogPostTranslation[];
}

// ============================================================================
// Category Types
// ============================================================================

export interface CategoryTranslation {
  id: number;
  category_id: number;
  language_code: LanguageCode;
  name: string;
  description?: string;
  created_at: string;
}

export interface Category {
  id: number;
  slug: string;
  created_at: string;
  category_translations: CategoryTranslation[];
}

// ============================================================================
// Tag Types
// ============================================================================

export interface TagTranslation {
  id: number;
  tag_id: number;
  language_code: LanguageCode;
  name: string;
  created_at: string;
}

export interface Tag {
  id: number;
  slug: string;
  created_at: string;
  tag_translations: TagTranslation[];
}

export interface BlogPostTag {
  blog_post_id: number;
  tag_id: number;
}

// ============================================================================
// Portfolio Types
// ============================================================================

export interface PortfolioProjectTranslation {
  id: number;
  portfolio_project_id: number;
  language_code: LanguageCode;
  title: string;
  description: string;
  content: string;
  meta_title?: string;
  meta_description?: string;
  created_at: string;
  updated_at: string;
}

export interface PortfolioProject {
  id: number;
  slug: string;
  thumbnail_url?: string;
  project_url?: string;
  github_url?: string;
  technologies: string[];
  status: 'draft' | 'published' | 'archived';
  author_id?: string;
  published_at?: string;
  created_at: string;
  updated_at: string;
  portfolio_project_translations: PortfolioProjectTranslation[];
}

// ============================================================================
// About Me Types
// ============================================================================

export interface AboutMeTranslation {
  id: number;
  about_me_id: number;
  language_code: LanguageCode;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
}

export interface AboutMe {
  id: number;
  created_at: string;
  updated_at: string;
  about_me_translations: AboutMeTranslation[];
}

// ============================================================================
// Shared Images Types
// ============================================================================

export interface SharedImage {
  id: number;
  file_name: string;
  file_path: string;
  file_size: number;
  mime_type: string;
  alt_text?: string;
  caption?: string;
  created_at: string;
  usage_count: number;
}

// ============================================================================
// Activity Log Types
// ============================================================================

export interface ActivityLog {
  id: number;
  user_id?: string;
  action: string;
  entity_type: 'blog_post' | 'category' | 'tag' | 'portfolio_project' | 'user';
  entity_id?: number;
  details?: Record<string, unknown>;
  ip_address?: string;
  user_agent?: string;
  created_at: string;
}

// ============================================================================
// API Response Types
// ============================================================================

export interface ApiResponse<T = unknown> {
  data?: T;
  error?: {
    message: string;
    code?: string;
    details?: Record<string, unknown>;
  };
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasMore: boolean;
  };
}

// ============================================================================
// Search Types
// ============================================================================

export interface SearchResult {
  type: 'blog_post' | 'portfolio_project';
  id: number;
  title: string;
  summary: string;
  slug: string;
  thumbnail_url?: string;
  language_code: LanguageCode;
  relevance_score: number;
}

export interface SearchFilters {
  language?: LanguageCode;
  category?: string;
  tags?: string[];
  dateRange?: {
    from: string;
    to: string;
  };
  contentType?: 'all' | 'blog' | 'portfolio';
}

// ============================================================================
// Form Types
// ============================================================================

export interface BlogPostFormData {
  slug: string;
  status: 'draft' | 'published';
  thumbnail_url?: string;
  category_id?: number;
  published_at?: string;
  translations: {
    [K in LanguageCode]: {
      title: string;
      summary: string;
      content: string;
      meta_title?: string;
      meta_description?: string;
    };
  };
  tags: number[];
}

export interface PortfolioProjectFormData {
  slug: string;
  status: 'draft' | 'published';
  thumbnail_url?: string;
  project_url?: string;
  github_url?: string;
  technologies: string[];
  published_at?: string;
  translations: {
    [K in LanguageCode]: {
      title: string;
      description: string;
      content: string;
      meta_title?: string;
      meta_description?: string;
    };
  };
}

// ============================================================================
// Component Props Types
// ============================================================================

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  loading?: boolean;
}

export interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: string;
  message?: string;
}

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  onNavigate?: (href: string) => void;
}

// ============================================================================
// Utility Types
// ============================================================================

export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type RequireFields<T, K extends keyof T> = T & Required<Pick<T, K>>;

export type OptionalFields<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

// ============================================================================
// Database Query Types
// ============================================================================

export interface QueryOptions {
  limit?: number;
  offset?: number;
  orderBy?: string;
  orderDirection?: 'asc' | 'desc';
  filters?: Record<string, unknown>;
}

export interface SupabaseError {
  message: string;
  details: string;
  hint: string;
  code: string;
}

// ============================================================================
// Image Processing Types
// ============================================================================

export interface ImageProcessingOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
  format?: 'jpeg' | 'png' | 'webp';
  autoRotate?: boolean;
}

export interface ImageUploadResult {
  url: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
  width?: number;
  height?: number;
}

// ============================================================================
// Export commonly used type unions
// ============================================================================

export type ContentStatus = BlogPost['status'];
export type EntityType = ActivityLog['entity_type'];
export type UserRole = User['role']; 