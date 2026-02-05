/*
  # Add Tracking Links and Creative Storage Tables

  1. New Tables
    - `creative_folders`
      - `id` (uuid, primary key)
      - `workspace_id` (uuid, foreign key to workspaces)
      - `name` (text) - folder name
      - `parent_folder_id` (uuid, nullable) - for nested folders
      - `color` (text, nullable) - folder color for UI
      - `created_by` (uuid) - user who created the folder
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `creative_assets`
      - `id` (uuid, primary key)
      - `workspace_id` (uuid, foreign key to workspaces)
      - `folder_id` (uuid, nullable, foreign key to creative_folders)
      - `name` (text) - file display name
      - `file_name` (text) - original file name
      - `file_type` (text) - MIME type
      - `file_size` (bigint) - size in bytes
      - `storage_path` (text) - path in Supabase storage
      - `thumbnail_path` (text, nullable) - thumbnail path for images/videos
      - `tags` (text array) - for filtering and search
      - `description` (text, nullable)
      - `created_by` (uuid)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `tracking_links`
      - `id` (uuid, primary key)
      - `workspace_id` (uuid, foreign key to workspaces)
      - `name` (text) - descriptive name for the link
      - `base_url` (text) - the destination URL
      - `utm_source` (text, nullable) - traffic source
      - `utm_medium` (text, nullable) - marketing medium
      - `utm_campaign` (text, nullable) - campaign name
      - `utm_term` (text, nullable) - paid keywords
      - `utm_content` (text, nullable) - content identifier
      - `full_url` (text) - generated full URL with UTM params
      - `short_code` (text, nullable) - optional short code
      - `tags` (text array) - for filtering
      - `click_count` (integer) - track usage
      - `is_active` (boolean) - enable/disable link
      - `created_by` (uuid)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Add policies for workspace members to access their workspace data
    - Only authenticated users can access data
    - Users can only see data from workspaces they belong to

  3. Indexes
    - Index on workspace_id for all tables for efficient filtering
    - Index on folder_id for creative_assets
    - Index on tags for search functionality
*/

-- Create creative_folders table
CREATE TABLE IF NOT EXISTS creative_folders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id uuid NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  name text NOT NULL,
  parent_folder_id uuid REFERENCES creative_folders(id) ON DELETE CASCADE,
  color text DEFAULT '#6B7280',
  created_by uuid NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create creative_assets table
CREATE TABLE IF NOT EXISTS creative_assets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id uuid NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  folder_id uuid REFERENCES creative_folders(id) ON DELETE SET NULL,
  name text NOT NULL,
  file_name text NOT NULL,
  file_type text NOT NULL,
  file_size bigint NOT NULL DEFAULT 0,
  storage_path text NOT NULL,
  thumbnail_path text,
  tags text[] DEFAULT '{}',
  description text,
  created_by uuid NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create tracking_links table
CREATE TABLE IF NOT EXISTS tracking_links (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id uuid NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  name text NOT NULL,
  base_url text NOT NULL,
  utm_source text,
  utm_medium text,
  utm_campaign text,
  utm_term text,
  utm_content text,
  full_url text NOT NULL,
  short_code text,
  tags text[] DEFAULT '{}',
  click_count integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_by uuid NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_creative_folders_workspace ON creative_folders(workspace_id);
CREATE INDEX IF NOT EXISTS idx_creative_folders_parent ON creative_folders(parent_folder_id);
CREATE INDEX IF NOT EXISTS idx_creative_assets_workspace ON creative_assets(workspace_id);
CREATE INDEX IF NOT EXISTS idx_creative_assets_folder ON creative_assets(folder_id);
CREATE INDEX IF NOT EXISTS idx_creative_assets_tags ON creative_assets USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_tracking_links_workspace ON tracking_links(workspace_id);
CREATE INDEX IF NOT EXISTS idx_tracking_links_tags ON tracking_links USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_tracking_links_campaign ON tracking_links(utm_campaign);

-- Enable RLS on all tables
ALTER TABLE creative_folders ENABLE ROW LEVEL SECURITY;
ALTER TABLE creative_assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE tracking_links ENABLE ROW LEVEL SECURITY;

-- RLS Policies for creative_folders
CREATE POLICY "Workspace members can view creative folders"
  ON creative_folders
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM workspace_members
      WHERE workspace_members.workspace_id = creative_folders.workspace_id
      AND workspace_members.user_id = auth.uid()
    )
  );

CREATE POLICY "Workspace members can insert creative folders"
  ON creative_folders
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM workspace_members
      WHERE workspace_members.workspace_id = creative_folders.workspace_id
      AND workspace_members.user_id = auth.uid()
    )
  );

CREATE POLICY "Workspace members can update creative folders"
  ON creative_folders
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM workspace_members
      WHERE workspace_members.workspace_id = creative_folders.workspace_id
      AND workspace_members.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM workspace_members
      WHERE workspace_members.workspace_id = creative_folders.workspace_id
      AND workspace_members.user_id = auth.uid()
    )
  );

CREATE POLICY "Workspace members can delete creative folders"
  ON creative_folders
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM workspace_members
      WHERE workspace_members.workspace_id = creative_folders.workspace_id
      AND workspace_members.user_id = auth.uid()
    )
  );

-- RLS Policies for creative_assets
CREATE POLICY "Workspace members can view creative assets"
  ON creative_assets
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM workspace_members
      WHERE workspace_members.workspace_id = creative_assets.workspace_id
      AND workspace_members.user_id = auth.uid()
    )
  );

CREATE POLICY "Workspace members can insert creative assets"
  ON creative_assets
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM workspace_members
      WHERE workspace_members.workspace_id = creative_assets.workspace_id
      AND workspace_members.user_id = auth.uid()
    )
  );

CREATE POLICY "Workspace members can update creative assets"
  ON creative_assets
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM workspace_members
      WHERE workspace_members.workspace_id = creative_assets.workspace_id
      AND workspace_members.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM workspace_members
      WHERE workspace_members.workspace_id = creative_assets.workspace_id
      AND workspace_members.user_id = auth.uid()
    )
  );

CREATE POLICY "Workspace members can delete creative assets"
  ON creative_assets
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM workspace_members
      WHERE workspace_members.workspace_id = creative_assets.workspace_id
      AND workspace_members.user_id = auth.uid()
    )
  );

-- RLS Policies for tracking_links
CREATE POLICY "Workspace members can view tracking links"
  ON tracking_links
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM workspace_members
      WHERE workspace_members.workspace_id = tracking_links.workspace_id
      AND workspace_members.user_id = auth.uid()
    )
  );

CREATE POLICY "Workspace members can insert tracking links"
  ON tracking_links
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM workspace_members
      WHERE workspace_members.workspace_id = tracking_links.workspace_id
      AND workspace_members.user_id = auth.uid()
    )
  );

CREATE POLICY "Workspace members can update tracking links"
  ON tracking_links
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM workspace_members
      WHERE workspace_members.workspace_id = tracking_links.workspace_id
      AND workspace_members.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM workspace_members
      WHERE workspace_members.workspace_id = tracking_links.workspace_id
      AND workspace_members.user_id = auth.uid()
    )
  );

CREATE POLICY "Workspace members can delete tracking links"
  ON tracking_links
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM workspace_members
      WHERE workspace_members.workspace_id = tracking_links.workspace_id
      AND workspace_members.user_id = auth.uid()
    )
  );