/*
  # Initial Schema for APK Store

  1. New Tables
    - `users` - Store user profile information
    - `apps` - Store app details including metadata and download counts
    - `categories` - Store predefined app categories
  
  2. Security
    - Enable RLS on all tables
    - Set up policies for authenticated and anonymous users
    - Ensure users can only modify their own data
  
  3. Functions
    - Create function to increment download count safely
*/

-- Create users table that extends the auth.users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Create apps table to store app details
CREATE TABLE IF NOT EXISTS apps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  version TEXT NOT NULL,
  package_name TEXT NOT NULL,
  category TEXT NOT NULL,
  icon_url TEXT NOT NULL,
  screenshots TEXT[] NOT NULL,
  file_size BIGINT NOT NULL,
  file_url TEXT NOT NULL,
  download_count INTEGER DEFAULT 0 NOT NULL,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Insert default categories
INSERT INTO categories (name, slug) VALUES
  ('Games', 'games'),
  ('Entertainment', 'entertainment'),
  ('Social', 'social'),
  ('Productivity', 'productivity'),
  ('Education', 'education'),
  ('Health & Fitness', 'health-fitness'),
  ('Communication', 'communication'),
  ('Tools', 'tools'),
  ('Photography', 'photography'),
  ('Music', 'music'),
  ('Business', 'business'),
  ('Finance', 'finance'),
  ('Lifestyle', 'lifestyle'),
  ('Travel', 'travel'),
  ('Food & Drink', 'food-drink'),
  ('Shopping', 'shopping'),
  ('Other', 'other');

-- Create a function to increment download count
CREATE OR REPLACE FUNCTION increment_download_count(app_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE apps
  SET download_count = download_count + 1
  WHERE id = app_id;
END;
$$ LANGUAGE plpgsql;

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE apps ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- User policies
-- Users can read all user profiles
CREATE POLICY "Anyone can read user profiles"
  ON users FOR SELECT
  USING (true);

-- Users can update their own profile
CREATE POLICY "Users can update their own profile"
  ON users FOR UPDATE
  USING (auth.uid() = id);

-- App policies
-- Anyone can read apps
CREATE POLICY "Anyone can read apps"
  ON apps FOR SELECT
  USING (true);

-- Authenticated users can insert their own apps
CREATE POLICY "Authenticated users can insert their own apps"
  ON apps FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own apps
CREATE POLICY "Users can update their own apps"
  ON apps FOR UPDATE
  USING (auth.uid() = user_id);

-- Users can delete their own apps
CREATE POLICY "Users can delete their own apps"
  ON apps FOR DELETE
  USING (auth.uid() = user_id);

-- Category policies
-- Anyone can read categories
CREATE POLICY "Anyone can read categories"
  ON categories FOR SELECT
  USING (true);

-- Create a trigger to update the updated_at column
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_users_updated_at
BEFORE UPDATE ON users
FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_apps_updated_at
BEFORE UPDATE ON apps
FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Create auth triggers to handle new user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();