/*
  # Create Wonderflow Audiences and Messaging Tables

  ## Overview
  This migration sets up the database schema for the Wonderflow Chrome Extension,
  including tables for marketing audiences and messaging content.

  ## New Tables
  
  ### `audiences`
  Stores marketing audience segments
  - `id` (uuid, primary key) - Unique identifier for the audience
  - `user_id` (uuid, foreign key) - References auth.users, owner of the audience
  - `name` (text) - Name of the audience segment
  - `description` (text) - Detailed description of the audience
  - `created_at` (timestamptz) - Timestamp when audience was created
  - `updated_at` (timestamptz) - Timestamp of last update

  ### `messages`
  Stores messaging content for audiences
  - `id` (uuid, primary key) - Unique identifier for the message
  - `audience_id` (uuid, foreign key) - References audiences table
  - `user_id` (uuid, foreign key) - References auth.users, owner of the message
  - `title` (text) - Message title
  - `content` (text) - Message content/body
  - `message_type` (text) - Type of message (email, push, sms, etc.)
  - `created_at` (timestamptz) - Timestamp when message was created
  - `updated_at` (timestamptz) - Timestamp of last update

  ## Security
  - Enable RLS on all tables
  - Users can only read/write their own audiences and messages
  - Policies enforce authentication and ownership checks
*/

-- Create audiences table
CREATE TABLE IF NOT EXISTS audiences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  description text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create messages table
CREATE TABLE IF NOT EXISTS messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  audience_id uuid REFERENCES audiences(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  content text NOT NULL,
  message_type text DEFAULT 'email',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE audiences ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Policies for audiences table
CREATE POLICY "Users can view own audiences"
  ON audiences FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own audiences"
  ON audiences FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own audiences"
  ON audiences FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own audiences"
  ON audiences FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Policies for messages table
CREATE POLICY "Users can view own messages"
  ON messages FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own messages"
  ON messages FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own messages"
  ON messages FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own messages"
  ON messages FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_audiences_user_id ON audiences(user_id);
CREATE INDEX IF NOT EXISTS idx_messages_user_id ON messages(user_id);
CREATE INDEX IF NOT EXISTS idx_messages_audience_id ON messages(audience_id);