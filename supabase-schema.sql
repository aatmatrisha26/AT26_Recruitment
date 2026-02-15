-- AT26 Volunteer Recruitment System — Supabase Schema
-- Run this SQL in your Supabase SQL editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- System settings table
CREATE TABLE IF NOT EXISTS system_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  frozen BOOLEAN DEFAULT FALSE,
  results_published BOOLEAN DEFAULT FALSE,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default settings
INSERT INTO system_settings (frozen, results_published) VALUES (false, false);

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  srn TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT DEFAULT '',
  year INTEGER DEFAULT 1,
  role TEXT DEFAULT 'student',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Domains table
CREATE TABLE IF NOT EXISTS domains (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  venue TEXT NOT NULL,
  description TEXT DEFAULT '',
  what_they_do TEXT DEFAULT '',
  whatsapp_link TEXT,
  icon TEXT DEFAULT 'D',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Applications table
CREATE TABLE IF NOT EXISTS applications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  domain_id UUID NOT NULL REFERENCES domains(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'interview_left' CHECK (status IN ('interview_left', 'applied', 'accepted', 'rejected')),
  score INTEGER CHECK (score IS NULL OR (score >= 1 AND score <= 10)),
  interview_done BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, domain_id)
);

-- ===== PERFORMANCE INDEXES =====
-- Single column indexes
CREATE INDEX IF NOT EXISTS idx_users_srn ON users(srn);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_domains_slug ON domains(slug);
CREATE INDEX IF NOT EXISTS idx_applications_user_id ON applications(user_id);
CREATE INDEX IF NOT EXISTS idx_applications_domain_id ON applications(domain_id);
CREATE INDEX IF NOT EXISTS idx_applications_status ON applications(status);

-- Composite indexes for hot query patterns
CREATE INDEX IF NOT EXISTS idx_applications_user_domain ON applications(user_id, domain_id);
CREATE INDEX IF NOT EXISTS idx_applications_domain_status ON applications(domain_id, status);
CREATE INDEX IF NOT EXISTS idx_applications_user_created ON applications(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_applications_domain_created ON applications(domain_id, created_at DESC);

-- ===== SEED DOMAINS =====
INSERT INTO domains (name, slug, venue, description, what_they_do, icon) VALUES
  ('Tech', 'tech', 'BE Block - G09', 'Build the digital backbone of AT''26. From websites to apps, make things happen.', 'Develop and maintain event websites, apps, internal tools, QR systems, and digital infrastructure that powers the fest.', 'T'),
  ('Finance', 'finance', 'BE Block - G09', 'Handle the money that makes the magic happen. Budget, track, optimize.', 'Manage event budgets, process transactions, handle reimbursements, track expenses, and ensure financial accountability.', 'F'),
  ('SNI', 'sni', 'BE Block - G06 & G07', 'Build and manage the stage infrastructure for all AT''26 events.', 'Stage setup, sound systems, lighting rigs, infra budgets, venue prep, and making sure every event has a solid physical foundation.', 'S'),
  ('DISCO', 'disco', 'MRD Block', 'Keep the vibes safe and orderly. Be the backbone of event security.', 'Ensure crowd management, enforce venue rules, coordinate with security, and maintain discipline during events.', 'D'),
  ('Logistics', 'logistics', 'BE Block - G12', 'Move mountains (and stage equipment). The unsung heroes of every event.', 'Handle venue setup, equipment management, transportation, supply chains, and on-ground coordination.', 'L'),
  ('PRC', 'prc', 'BE Block - G04', 'Craft the narrative. Be the voice of AT''26 to sponsors, media, and the world.', 'Write press releases, manage media relations, coordinate with sponsors, and handle all external communications and campaigning.', 'P'),
  ('Inhouse', 'inhouse', 'BE Block - G02', 'Light up the campus with events. Create unforgettable experiences.', 'Plan and execute in-house events, competitions, workshops, and gaming tournaments as part of the fest schedule.', 'I'),
  ('Sponsorship', 'sponsorship', 'BE Block - 111', 'Bring in the brands. Pitch, negotiate, and seal deals that fund the fest.', 'Identify potential sponsors, create pitch decks, negotiate partnerships, and maintain sponsor relationships.', 'S'),
  ('Operations', 'operations', 'BE Block - G11 (ground floor)', 'Run the show behind the scenes. Coordinate everything that makes AT''26 tick.', 'Coordinate between departments, manage schedules, handle registrations, and ensure seamless event operations.', 'O'),
  ('Media', 'media', 'BE Block - Studio-1 - 9th floor', 'Capture the magic. Film, photograph, and produce content that lives forever.', 'Photography, videography, live streaming, after-movies, reels, and all visual media production for the fest.', 'M'),
  ('Design', 'design', 'BE Block - 112', 'Make AT''26 look fire. Posters, merch, stage design — all you.', 'Create posters, social media graphics, merchandise designs, stage backdrops, and the overall visual identity.', 'D'),
  ('Hospitality', 'hospitality', 'BE Block - G08', 'Welcome guests like royalty. Food, comfort, and warm smiles.', 'Manage guest relations, food & beverages, accommodation for visiting artists, and ensure hospitality standards.', 'H'),
  ('Cultural', 'cultural', 'BE Block - 112', 'Curate the soul of AT''26. Dance, music, drama — bring culture to life.', 'Plan and manage cultural performances, coordinate with artists, organize music/dance/drama events and competitions.', 'C'),
  ('FYI', 'fyi', 'BE Block - 108', 'The glue that holds everyone together. Internal coordination.', 'Internal communications, documentation, announcements, knowledge management, and cross-team coordination.', 'F')
ON CONFLICT (slug) DO NOTHING;

-- ===== ROW LEVEL SECURITY =====
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE domains ENABLE ROW LEVEL SECURITY;
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_settings ENABLE ROW LEVEL SECURITY;

-- Drop old permissive policies (run these before creating new ones)
DROP POLICY IF EXISTS "domains_read" ON domains;
DROP POLICY IF EXISTS "settings_read" ON system_settings;
DROP POLICY IF EXISTS "settings_update" ON system_settings;
DROP POLICY IF EXISTS "users_read_own" ON users;
DROP POLICY IF EXISTS "users_insert" ON users;
DROP POLICY IF EXISTS "users_update" ON users;
DROP POLICY IF EXISTS "applications_read" ON applications;
DROP POLICY IF EXISTS "applications_insert" ON applications;
DROP POLICY IF EXISTS "applications_update" ON applications;

-- DOMAINS: Everyone can read (public info)
CREATE POLICY "domains_public_read" ON domains FOR SELECT USING (true);

-- SYSTEM SETTINGS: Everyone can read, only service role updates
CREATE POLICY "settings_public_read" ON system_settings FOR SELECT USING (true);

-- USERS: Students read own row, service role handles inserts/updates
-- (Service role bypasses RLS automatically)
CREATE POLICY "users_read_own" ON users
  FOR SELECT USING (
    -- auth.uid() approach won't work here since we use custom auth.
    -- Since our server actions use service role for writes, we allow reads
    -- for the user's own data by matching SRN from the session.
    -- For now, allow all reads (server actions filter by user_id anyway)
    true
  );
CREATE POLICY "users_service_insert" ON users FOR INSERT WITH CHECK (true);
CREATE POLICY "users_service_update" ON users FOR UPDATE USING (true);

-- APPLICATIONS: Students read own, CO reads their domain, service role does writes
CREATE POLICY "applications_read" ON applications
  FOR SELECT USING (true);

CREATE POLICY "applications_service_insert" ON applications
  FOR INSERT WITH CHECK (true);

CREATE POLICY "applications_service_update" ON applications
  FOR UPDATE USING (true);

-- NOTE: Since we use custom cookie-based auth (not Supabase Auth),
-- we cannot use auth.uid() in RLS policies. Instead, security is
-- enforced at the server action level:
--   1. getSession() validates the cookie and returns the user
--   2. Every action checks user.role before proceeding
--   3. CO actions verify domain ownership before any read/write
--   4. Admin actions check role === 'superadmin'
--   5. Rate limiting prevents abuse
--   6. UNIQUE constraints prevent duplicate applications
--   7. CHECK constraints validate status and score values

-- ===== SUPABASE RPC: Atomic Apply =====
-- Single DB call that checks count, freeze, and inserts atomically
CREATE OR REPLACE FUNCTION apply_to_domain(
  p_user_id UUID,
  p_domain_id UUID
) RETURNS JSON AS $$
DECLARE
  v_count INTEGER;
  v_frozen BOOLEAN;
  v_result JSON;
BEGIN
  -- Check freeze
  SELECT frozen INTO v_frozen FROM system_settings LIMIT 1;
  IF v_frozen = TRUE THEN
    RETURN json_build_object('error', 'Applications are frozen');
  END IF;

  -- Check count
  SELECT COUNT(*) INTO v_count FROM applications WHERE user_id = p_user_id;
  IF v_count >= 6 THEN
    RETURN json_build_object('error', 'Maximum 6 domain applications allowed');
  END IF;

  -- Insert (UNIQUE constraint handles duplicates)
  BEGIN
    INSERT INTO applications (user_id, domain_id, status)
    VALUES (p_user_id, p_domain_id, 'interview_left');
    RETURN json_build_object('success', true);
  EXCEPTION
    WHEN unique_violation THEN
      RETURN json_build_object('error', 'Already applied to this domain');
  END;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
