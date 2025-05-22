/*
  # Add app publishing and version management

  1. Changes
    - Add publish status to apps table
    - Add version history table
    - Add functions for app publishing and version updates
  
  2. Security
    - Enable RLS on version_history table
    - Add policies for version management
*/

-- Add publish status to apps table
ALTER TABLE apps ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'rejected'));
ALTER TABLE apps ADD COLUMN IF NOT EXISTS publish_date TIMESTAMPTZ;

-- Create version history table
CREATE TABLE IF NOT EXISTS version_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  app_id UUID REFERENCES apps(id) ON DELETE CASCADE,
  version TEXT NOT NULL,
  changelog TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_size BIGINT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  created_by UUID REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Enable RLS
ALTER TABLE version_history ENABLE ROW LEVEL SECURITY;

-- Version history policies
CREATE POLICY "Anyone can read version history"
  ON version_history FOR SELECT
  USING (true);

CREATE POLICY "Users can add versions to their apps"
  ON version_history FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM apps 
      WHERE apps.id = version_history.app_id 
      AND apps.user_id = auth.uid()
    )
  );

-- Function to publish an app
CREATE OR REPLACE FUNCTION publish_app(app_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE apps
  SET 
    status = 'published',
    publish_date = CASE 
      WHEN publish_date IS NULL THEN now()
      ELSE publish_date
    END
  WHERE id = app_id AND user_id = auth.uid();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;