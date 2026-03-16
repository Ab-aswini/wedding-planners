-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Organizations (B2B accounts — wedding planners / agencies)
CREATE TABLE organizations (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name          TEXT NOT NULL,
  slug          TEXT UNIQUE NOT NULL,
  owner_id      UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  plan          TEXT NOT NULL DEFAULT 'free' CHECK (plan IN ('free', 'starter', 'pro')),
  plan_expires  TIMESTAMPTZ,
  invite_limit  INT NOT NULL DEFAULT 1,
  razorpay_sub  TEXT,
  logo_url      TEXT,
  brand_color   TEXT DEFAULT '#B8860B',
  created_at    TIMESTAMPTZ DEFAULT now(),
  updated_at    TIMESTAMPTZ DEFAULT now()
);

-- Organization members (team access)
CREATE TABLE org_members (
  id        UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  org_id    UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  user_id   UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role      TEXT NOT NULL DEFAULT 'editor' CHECK (role IN ('owner', 'editor', 'viewer')),
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(org_id, user_id)
);

-- Templates (pre-built by platform admin — me)
CREATE TABLE templates (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name          TEXT NOT NULL,
  slug          TEXT UNIQUE NOT NULL,
  category      TEXT NOT NULL CHECK (category IN ('hindu', 'muslim', 'sikh', 'christian', 'south_indian', 'universal')),
  description   TEXT,
  preview_img   TEXT,
  preview_imgs  JSONB DEFAULT '[]',
  config        JSONB NOT NULL DEFAULT '{}',
  sections      JSONB NOT NULL DEFAULT '[]',
  color_scheme  JSONB DEFAULT '{}',
  fonts         JSONB DEFAULT '{}',
  is_premium    BOOLEAN DEFAULT false,
  is_active     BOOLEAN DEFAULT true,
  created_at    TIMESTAMPTZ DEFAULT now()
);

-- Invites (THE CORE TABLE — each row = one wedding invitation website)
CREATE TABLE invites (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  org_id          UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  template_id     UUID NOT NULL REFERENCES templates(id),
  created_by      UUID REFERENCES auth.users(id),

  -- Identity
  slug            TEXT UNIQUE NOT NULL,
  custom_domain   TEXT,
  status          TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),

  -- Couple
  groom_name      TEXT,
  bride_name      TEXT,
  groom_family    TEXT,
  bride_family    TEXT,
  wedding_date    DATE,
  hashtag         TEXT,

  -- Cultural
  religion        TEXT CHECK (religion IN ('hindu', 'muslim', 'sikh', 'christian', 'universal')),
  mantra          TEXT,
  deity_motif     TEXT DEFAULT 'none' CHECK (deity_motif IN ('ganesha', 'bismillah', 'cross', 'khanda', 'none')),

  -- Story
  story_how       TEXT,
  story_proposal  TEXT,
  story_motto     TEXT,

  -- Media
  photos          JSONB DEFAULT '[]',
  hero_photo      TEXT,
  music_url       TEXT,

  -- Styling
  color_overrides JSONB DEFAULT '{}',
  font_overrides  JSONB DEFAULT '{}',

  -- Guest Info
  dress_code      TEXT,
  parking_info    TEXT,
  accommodation   TEXT,
  additional_info JSONB DEFAULT '{}',

  -- Toggles
  show_rsvp       BOOLEAN DEFAULT true,
  show_countdown  BOOLEAN DEFAULT true,
  show_gallery    BOOLEAN DEFAULT true,
  show_story      BOOLEAN DEFAULT true,
  show_music      BOOLEAN DEFAULT true,

  -- Multi-language
  is_multilingual BOOLEAN DEFAULT false,
  secondary_lang  TEXT,

  -- Analytics
  view_count      INT DEFAULT 0,
  published_at    TIMESTAMPTZ,
  created_at      TIMESTAMPTZ DEFAULT now(),
  updated_at      TIMESTAMPTZ DEFAULT now()
);

-- Events (sub-events within a wedding: Haldi, Mehndi, Sangeet, Wedding, Reception)
CREATE TABLE events (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  invite_id     UUID NOT NULL REFERENCES invites(id) ON DELETE CASCADE,
  name          TEXT NOT NULL,
  date          DATE,
  time_text     TEXT,
  venue_name    TEXT,
  venue_city    TEXT,
  map_link      TEXT,
  accent_color  TEXT,
  sort_order    INT DEFAULT 0,
  is_private    BOOLEAN DEFAULT false,
  guest_group   TEXT DEFAULT 'all',
  created_at    TIMESTAMPTZ DEFAULT now()
);

-- RSVPs
CREATE TABLE rsvps (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  invite_id     UUID NOT NULL REFERENCES invites(id) ON DELETE CASCADE,
  guest_name    TEXT NOT NULL,
  attending     BOOLEAN,
  guest_count   INT DEFAULT 1,
  message       TEXT,
  event_ids     UUID[],
  phone         TEXT,
  created_at    TIMESTAMPTZ DEFAULT now()
);

-- Invite Views (analytics)
CREATE TABLE invite_views (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  invite_id     UUID NOT NULL REFERENCES invites(id) ON DELETE CASCADE,
  ip_hash       TEXT,
  user_agent    TEXT,
  referrer      TEXT,
  viewed_at     TIMESTAMPTZ DEFAULT now()
);

-- Indexes
CREATE INDEX idx_invites_org ON invites(org_id);
CREATE INDEX idx_invites_slug ON invites(slug);
CREATE INDEX idx_invites_status ON invites(status);
CREATE INDEX idx_events_invite ON events(invite_id);
CREATE INDEX idx_rsvps_invite ON rsvps(invite_id);
CREATE INDEX idx_invite_views_invite ON invite_views(invite_id);
CREATE INDEX idx_org_members_user ON org_members(user_id);

-- Row Level Security
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE org_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE invites ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE rsvps ENABLE ROW LEVEL SECURITY;
ALTER TABLE invite_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE templates ENABLE ROW LEVEL SECURITY;

-- Templates are publicly readable
CREATE POLICY "Templates are viewable by everyone" ON templates
  FOR SELECT USING (is_active = true);

-- Org members can see their org
CREATE POLICY "Users can view their orgs" ON organizations
  FOR SELECT USING (
    id IN (SELECT org_id FROM org_members WHERE user_id = auth.uid())
  );

-- Org owners can update their org
CREATE POLICY "Owners can update their org" ON organizations
  FOR UPDATE USING (
    id IN (SELECT org_id FROM org_members WHERE user_id = auth.uid() AND role = 'owner')
  );

-- Members can view org members
CREATE POLICY "Members can view org members" ON org_members
  FOR SELECT USING (
    org_id IN (SELECT org_id FROM org_members WHERE user_id = auth.uid())
  );

-- Invites: org members can CRUD
CREATE POLICY "Org members can view invites" ON invites
  FOR SELECT USING (
    org_id IN (SELECT org_id FROM org_members WHERE user_id = auth.uid())
  );

CREATE POLICY "Org members can create invites" ON invites
  FOR INSERT WITH CHECK (
    org_id IN (SELECT org_id FROM org_members WHERE user_id = auth.uid() AND role IN ('owner', 'editor'))
  );

CREATE POLICY "Org members can update invites" ON invites
  FOR UPDATE USING (
    org_id IN (SELECT org_id FROM org_members WHERE user_id = auth.uid() AND role IN ('owner', 'editor'))
  );

CREATE POLICY "Org members can delete invites" ON invites
  FOR DELETE USING (
    org_id IN (SELECT org_id FROM org_members WHERE user_id = auth.uid() AND role = 'owner')
  );

-- Events: follow invite access
CREATE POLICY "Events follow invite access" ON events
  FOR ALL USING (
    invite_id IN (
      SELECT id FROM invites WHERE org_id IN (
        SELECT org_id FROM org_members WHERE user_id = auth.uid()
      )
    )
  );

-- RSVPs: anyone can INSERT (guests), org members can SELECT
CREATE POLICY "Anyone can submit RSVP" ON rsvps
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Org members can view RSVPs" ON rsvps
  FOR SELECT USING (
    invite_id IN (
      SELECT id FROM invites WHERE org_id IN (
        SELECT org_id FROM org_members WHERE user_id = auth.uid()
      )
    )
  );

-- Views: anyone can insert, org members can read
CREATE POLICY "Anyone can log views" ON invite_views
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Org members can view analytics" ON invite_views
  FOR SELECT USING (
    invite_id IN (
      SELECT id FROM invites WHERE org_id IN (
        SELECT org_id FROM org_members WHERE user_id = auth.uid()
      )
    )
  );

-- Updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_updated_at_organizations
BEFORE UPDATE ON organizations FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER set_updated_at_invites
BEFORE UPDATE ON invites FOR EACH ROW EXECUTE FUNCTION update_updated_at();
