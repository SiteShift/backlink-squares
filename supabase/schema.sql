-- SEO Backlinks Grid Database Schema
-- Run this in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- SQUARES TABLE
-- ============================================
-- The main grid - each row represents a square position

CREATE TABLE IF NOT EXISTS squares (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  -- Position on grid
  row_index INTEGER NOT NULL,
  col_index INTEGER NOT NULL CHECK (col_index >= 0 AND col_index < 10),

  -- Purchase info
  purchased BOOLEAN DEFAULT FALSE,
  purchase_group_id UUID,

  -- Site info (null if not purchased)
  site_url TEXT,
  site_name TEXT,
  logo_url TEXT,

  -- Meta
  purchased_at TIMESTAMP WITH TIME ZONE,
  email TEXT,

  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- Unique constraint on position
  UNIQUE(row_index, col_index)
);

-- Index for fast grid loading
CREATE INDEX IF NOT EXISTS idx_squares_position ON squares(row_index, col_index);
CREATE INDEX IF NOT EXISTS idx_squares_purchased ON squares(purchased);
CREATE INDEX IF NOT EXISTS idx_squares_purchase_group ON squares(purchase_group_id);

-- ============================================
-- PURCHASE GROUPS TABLE
-- ============================================
-- Groups multi-square purchases together

CREATE TABLE IF NOT EXISTS purchase_groups (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  -- Dimensions
  width INTEGER NOT NULL CHECK (width >= 1 AND width <= 3),
  height INTEGER NOT NULL CHECK (height >= 1 AND height <= 3),
  square_count INTEGER NOT NULL CHECK (square_count >= 1 AND square_count <= 9),

  -- Payment
  amount_cents INTEGER NOT NULL,
  currency TEXT DEFAULT 'gbp',
  stripe_session_id TEXT,
  stripe_payment_intent TEXT,

  -- Site info
  site_url TEXT NOT NULL,
  site_name TEXT NOT NULL,
  logo_url TEXT,
  email TEXT NOT NULL,

  -- Status
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed')),

  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE
);

-- Index for status queries
CREATE INDEX IF NOT EXISTS idx_purchase_groups_status ON purchase_groups(status);
CREATE INDEX IF NOT EXISTS idx_purchase_groups_email ON purchase_groups(email);

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================

-- Enable RLS
ALTER TABLE squares ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchase_groups ENABLE ROW LEVEL SECURITY;

-- Public read access to squares (for grid display)
CREATE POLICY "Squares are publicly readable" ON squares
  FOR SELECT USING (true);

-- Only service role can insert/update/delete squares
CREATE POLICY "Service role can manage squares" ON squares
  FOR ALL USING (auth.role() = 'service_role');

-- Public can read their own purchase groups (via email)
CREATE POLICY "Purchase groups readable by service role" ON purchase_groups
  FOR SELECT USING (auth.role() = 'service_role');

-- Only service role can manage purchase groups
CREATE POLICY "Service role can manage purchase groups" ON purchase_groups
  FOR ALL USING (auth.role() = 'service_role');

-- ============================================
-- STORAGE BUCKET FOR LOGOS
-- ============================================
-- Run this in the Supabase dashboard under Storage

-- Create a public bucket for logos
-- INSERT INTO storage.buckets (id, name, public) VALUES ('public', 'public', true);

-- Allow public access to read logos
-- CREATE POLICY "Public read access for logos" ON storage.objects
--   FOR SELECT USING (bucket_id = 'public');

-- Allow authenticated uploads
-- CREATE POLICY "Service role can upload logos" ON storage.objects
--   FOR INSERT WITH CHECK (bucket_id = 'public' AND auth.role() = 'service_role');

-- ============================================
-- FUNCTIONS
-- ============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger for squares table
CREATE TRIGGER update_squares_updated_at
  BEFORE UPDATE ON squares
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- SAMPLE DATA (Optional - for testing)
-- ============================================

-- Uncomment to insert sample purchased squares for testing
/*
INSERT INTO purchase_groups (id, width, height, square_count, amount_cents, site_url, site_name, email, status, completed_at)
VALUES
  ('550e8400-e29b-41d4-a716-446655440001', 1, 1, 1, 100, 'https://ahrefs.com', 'Ahrefs', 'test@example.com', 'completed', NOW()),
  ('550e8400-e29b-41d4-a716-446655440002', 1, 1, 1, 100, 'https://moz.com', 'Moz', 'test@example.com', 'completed', NOW()),
  ('550e8400-e29b-41d4-a716-446655440003', 1, 1, 1, 100, 'https://semrush.com', 'SEMrush', 'test@example.com', 'completed', NOW());

INSERT INTO squares (row_index, col_index, purchased, purchase_group_id, site_url, site_name, purchased_at, email)
VALUES
  (0, 2, true, '550e8400-e29b-41d4-a716-446655440001', 'https://ahrefs.com', 'Ahrefs', NOW(), 'test@example.com'),
  (0, 7, true, '550e8400-e29b-41d4-a716-446655440002', 'https://moz.com', 'Moz', NOW(), 'test@example.com'),
  (1, 1, true, '550e8400-e29b-41d4-a716-446655440003', 'https://semrush.com', 'SEMrush', NOW(), 'test@example.com');
*/
