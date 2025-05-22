export interface User {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  created_at: string;
}

export interface AppDetails {
  id: string;
  title: string;
  description: string;
  version: string;
  package_name: string;
  category: string;
  icon_url: string;
  screenshots: string[];
  file_size: number;
  file_url: string;
  download_count: number;
  created_at: string;
  updated_at: string;
  user_id: string;
  status: 'draft' | 'published' | 'rejected';
  publish_date?: string;
  user?: User;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
}

export interface AppFilters {
  search?: string;
  category?: string;
  sortBy?: 'newest' | 'popular' | 'alphabetical';
}

export interface VersionHistory {
  id: string;
  app_id: string;
  version: string;
  changelog: string;
  file_url: string;
  file_size: number;
  created_at: string;
  created_by: string;
}