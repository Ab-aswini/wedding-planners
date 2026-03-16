-- =============================================
-- InviteForge Demo Seed Data
-- Run this AFTER 001_initial_schema.sql
-- Run this in the Supabase SQL Editor
-- =============================================

-- 1. Seed Templates (these are platform-level, not tied to any user)
INSERT INTO templates (id, name, slug, category, description, preview_img, config, sections, color_scheme, fonts, is_premium, is_active)
VALUES
  (
    'a1b2c3d4-0001-4000-8000-000000000001',
    'City Lights',
    'city',
    'hindu',
    'Dark & gold. Elegant, urban. Perfect for modern Hindu weddings.',
    NULL,
    '{"layout": "classic"}',
    '["hero", "countdown", "story", "events", "gallery", "rsvp", "details", "footer"]',
    '{"primary": "#8B2635", "accent": "#B8860B", "background": "#1a0a0a", "text": "#F5E6D0"}',
    '{"heading": "Playfair Display", "body": "Cormorant Garamond"}',
    false,
    true
  ),
  (
    'a1b2c3d4-0002-4000-8000-000000000002',
    'Beach Breeze',
    'beach',
    'universal',
    'Light, airy, coastal vibes. Great for destination weddings.',
    NULL,
    '{"layout": "modern"}',
    '["hero", "countdown", "story", "events", "gallery", "rsvp", "details", "footer"]',
    '{"primary": "#1a6b7a", "accent": "#e8a87c", "background": "#fdf6ee", "text": "#2d3436"}',
    '{"heading": "Yeseva One", "body": "Josefin Sans"}',
    false,
    true
  ),
  (
    'a1b2c3d4-0003-4000-8000-000000000003',
    'Meenaya',
    'meenaya',
    'south_indian',
    'Rich, traditional. Designed for South Indian ceremonies.',
    NULL,
    '{"layout": "traditional"}',
    '["hero", "countdown", "events", "gallery", "rsvp", "details", "footer"]',
    '{"primary": "#6B0F1A", "accent": "#DAA520", "background": "#1A0505", "text": "#F5DEB3"}',
    '{"heading": "Cinzel", "body": "Fauna One"}',
    true,
    true
  ),
  (
    'a1b2c3d4-0004-4000-8000-000000000004',
    'Nikkah Garden',
    'nikkah-garden',
    'muslim',
    'Emerald & gold. Islamic calligraphy-inspired. Elegant Nikkah invites.',
    NULL,
    '{"layout": "classic"}',
    '["hero", "countdown", "events", "rsvp", "details", "footer"]',
    '{"primary": "#0D5C3E", "accent": "#C8A951", "background": "#0A1A14", "text": "#F0EDE5"}',
    '{"heading": "Bodoni Moda", "body": "Libre Baskerville"}',
    false,
    true
  ),
  (
    'a1b2c3d4-0005-4000-8000-000000000005',
    'Anand Karaj',
    'anand-karaj',
    'sikh',
    'Warm saffron & royal blue. Built for Sikh wedding ceremonies.',
    NULL,
    '{"layout": "classic"}',
    '["hero", "countdown", "events", "gallery", "rsvp", "details", "footer"]',
    '{"primary": "#D4760A", "accent": "#1A3D6D", "background": "#1A1008", "text": "#F5E6D0"}',
    '{"heading": "Great Vibes", "body": "Lato"}',
    true,
    true
  );

-- =============================================
-- DEMO DATA (requires a signed-up user)
-- After you sign up, replace YOUR_USER_ID below
-- with your actual auth.users id from Supabase.
--
-- Or use the /api/seed route instead (easier).
-- =============================================
