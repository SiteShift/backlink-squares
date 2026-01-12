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

  -- Position on grid (100 cols x 1000 rows = 100,000 max, but we use 10 cols x 1000 rows)
  row_index INTEGER NOT NULL CHECK (row_index >= 0 AND row_index < 1000),
  col_index INTEGER NOT NULL CHECK (col_index >= 0 AND col_index < 10),

  -- Purchase info
  purchased BOOLEAN DEFAULT FALSE,
  purchase_group_id UUID,

  -- Site info (null if not purchased)
  -- NOTE: email is intentionally NOT stored here to prevent PII exposure via RLS
  -- Email is stored only in purchase_groups table (not publicly readable)
  site_url TEXT,
  site_name TEXT,
  logo_url TEXT,

  -- Meta
  purchased_at TIMESTAMP WITH TIME ZONE,

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
  currency TEXT DEFAULT 'usd',
  stripe_session_id TEXT,
  stripe_payment_intent TEXT,

  -- Site info
  site_url TEXT NOT NULL,
  site_name TEXT NOT NULL,
  logo_url TEXT,
  email TEXT NOT NULL,

  -- Status: pending (checkout in progress), completed (paid), failed (error), expired (TTL exceeded)
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'expired')),

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
-- ATOMIC RESERVATION FUNCTION
-- ============================================
-- Prevents race conditions by atomically reserving squares
-- Returns the count of successfully reserved squares

CREATE OR REPLACE FUNCTION reserve_squares(
  p_squares JSONB,
  p_purchase_group_id UUID
)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_inserted_count INTEGER;
BEGIN
  -- Insert squares with ON CONFLICT DO NOTHING
  -- This atomically attempts to reserve all squares
  WITH inserted AS (
    INSERT INTO squares (row_index, col_index, purchased, purchase_group_id)
    SELECT
      (square->>'row')::INTEGER,
      (square->>'col')::INTEGER,
      FALSE,
      p_purchase_group_id
    FROM jsonb_array_elements(p_squares) AS square
    ON CONFLICT (row_index, col_index) DO NOTHING
    RETURNING id
  )
  SELECT COUNT(*) INTO v_inserted_count FROM inserted;

  RETURN v_inserted_count;
END;
$$;

-- ============================================
-- CLEANUP STALE RESERVATIONS FUNCTION
-- ============================================
-- Marks stale pending purchase groups as expired and releases their squares
-- If user pays late, self-heal will re-insert squares from Stripe metadata
-- This allows expired squares to be purchased by others while still supporting late payments

CREATE OR REPLACE FUNCTION cleanup_stale_reservations(
  p_ttl_minutes INTEGER DEFAULT 30
)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_expired_count INTEGER;
BEGIN
  -- Mark stale purchase groups as expired AND release their squares
  -- This is safe because:
  -- 1. If user pays late, self-heal will re-insert squares from Stripe metadata
  -- 2. If squares were taken by someone else, that's a legitimate sale
  WITH expired AS (
    UPDATE purchase_groups
    SET status = 'expired'
    WHERE status = 'pending'
    AND created_at < NOW() - (p_ttl_minutes || ' minutes')::INTERVAL
    RETURNING id
  )
  SELECT COUNT(*) INTO v_expired_count FROM expired;

  -- Release squares from expired reservations (clear purchase_group_id)
  -- This makes them available for new purchases
  UPDATE squares
  SET purchase_group_id = NULL
  WHERE purchased = FALSE
  AND purchase_group_id IN (
    SELECT id FROM purchase_groups WHERE status = 'expired'
  );

  RETURN v_expired_count;
END;
$$;

-- Index for delta polling (fetch squares updated since timestamp)
CREATE INDEX IF NOT EXISTS idx_squares_updated_at ON squares(updated_at);

-- ============================================
-- SAFE SQUARE COMPLETION FUNCTION
-- ============================================
-- Safely marks squares as purchased, only if they're available
-- Returns count of squares successfully marked as purchased
-- Does NOT overwrite squares purchased by others

CREATE OR REPLACE FUNCTION complete_purchase_squares(
  p_squares JSONB,
  p_purchase_group_id UUID,
  p_site_url TEXT,
  p_site_name TEXT,
  p_logo_url TEXT
)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_completed_count INTEGER := 0;
  v_square RECORD;
BEGIN
  FOR v_square IN SELECT * FROM jsonb_array_elements(p_squares) AS square
  LOOP
    -- Try to insert or update, but only if not purchased by others
    INSERT INTO squares (row_index, col_index, purchased, purchase_group_id, site_url, site_name, logo_url, purchased_at)
    VALUES (
      (v_square.square->>'row')::INTEGER,
      (v_square.square->>'col')::INTEGER,
      TRUE,
      p_purchase_group_id,
      p_site_url,
      p_site_name,
      p_logo_url,
      NOW()
    )
    ON CONFLICT (row_index, col_index) DO UPDATE SET
      purchased = TRUE,
      purchase_group_id = p_purchase_group_id,
      site_url = p_site_url,
      site_name = p_site_name,
      logo_url = p_logo_url,
      purchased_at = NOW()
    WHERE
      -- Only update if: not purchased, or belongs to same purchase group
      squares.purchased = FALSE
      OR squares.purchase_group_id = p_purchase_group_id;

    IF FOUND THEN
      v_completed_count := v_completed_count + 1;
    END IF;
  END LOOP;

  RETURN v_completed_count;
END;
$$;

-- ============================================
-- RPC FUNCTION PERMISSIONS
-- ============================================
-- CRITICAL: Lock down SECURITY DEFINER functions to service_role only
-- These functions can modify data, so anon/public must NOT be able to call them

-- Revoke execute from public/anon/authenticated users
REVOKE EXECUTE ON FUNCTION reserve_squares(JSONB, UUID) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION reserve_squares(JSONB, UUID) FROM anon;
REVOKE EXECUTE ON FUNCTION reserve_squares(JSONB, UUID) FROM authenticated;

REVOKE EXECUTE ON FUNCTION cleanup_stale_reservations(INTEGER) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION cleanup_stale_reservations(INTEGER) FROM anon;
REVOKE EXECUTE ON FUNCTION cleanup_stale_reservations(INTEGER) FROM authenticated;

REVOKE EXECUTE ON FUNCTION complete_purchase_squares(JSONB, UUID, TEXT, TEXT, TEXT) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION complete_purchase_squares(JSONB, UUID, TEXT, TEXT, TEXT) FROM anon;
REVOKE EXECUTE ON FUNCTION complete_purchase_squares(JSONB, UUID, TEXT, TEXT, TEXT) FROM authenticated;

-- Grant execute only to service_role (used by server-side API routes)
GRANT EXECUTE ON FUNCTION reserve_squares(JSONB, UUID) TO service_role;
GRANT EXECUTE ON FUNCTION cleanup_stale_reservations(INTEGER) TO service_role;
GRANT EXECUTE ON FUNCTION complete_purchase_squares(JSONB, UUID, TEXT, TEXT, TEXT) TO service_role;

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

INSERT INTO squares (row_index, col_index, purchased, purchase_group_id, site_url, site_name, purchased_at)
VALUES
  (0, 2, true, '550e8400-e29b-41d4-a716-446655440001', 'https://ahrefs.com', 'Ahrefs', NOW()),
  (0, 7, true, '550e8400-e29b-41d4-a716-446655440002', 'https://moz.com', 'Moz', NOW()),
  (1, 1, true, '550e8400-e29b-41d4-a716-446655440003', 'https://semrush.com', 'SEMrush', NOW());
*/
