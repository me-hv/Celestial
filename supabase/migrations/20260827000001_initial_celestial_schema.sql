-- CELESTIAL Database Migration: Initial Schema
-- Migration ID: 20260827000001_initial_celestial_schema.sql

-- Enable UUID extension and Trigram text search extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- 1. Scientific Data Sources & Provenance Registry
CREATE TABLE IF NOT EXISTS sources (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  authoritative_body VARCHAR(100) NOT NULL,
  catalog_name VARCHAR(150),
  catalog_version VARCHAR(50),
  citation_url TEXT,
  doi VARCHAR(150),
  bibcode VARCHAR(100),
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Object Classifications (Lookup / Reference Table)
CREATE TABLE IF NOT EXISTS object_classifications (
  code VARCHAR(50) PRIMARY KEY,
  category VARCHAR(50) NOT NULL,
  display_name VARCHAR(100) NOT NULL,
  description TEXT
);

INSERT INTO object_classifications (code, category, display_name, description) VALUES
  ('STAR', 'STELLAR', 'Star', 'Luminous celestial object of plasma'),
  ('TERRESTRIAL_PLANET', 'PLANETARY', 'Terrestrial Planet', 'Rocky planetary body with solid surface'),
  ('GAS_GIANT', 'PLANETARY', 'Gas Giant', 'Massive planet composed mainly of hydrogen and helium'),
  ('ICE_GIANT', 'PLANETARY', 'Ice Giant', 'Giant planet composed mainly of elements heavier than hydrogen and helium'),
  ('DWARF_PLANET', 'PLANETARY', 'Dwarf Planet', 'Celestial body resembling a small planet'),
  ('MOON', 'SATELLITE', 'Natural Satellite / Moon', 'Natural body orbiting a planet or minor planet'),
  ('ASTEROID', 'MINOR_BODY', 'Asteroid', 'Small rocky body orbiting the Sun'),
  ('COMET', 'MINOR_BODY', 'Comet', 'Icy small body that warms and releases gases'),
  ('GALAXY', 'DEEP_SKY', 'Galaxy', 'Gravitationally bound system of stars, stellar remnants, and dark matter'),
  ('NEBULA', 'DEEP_SKY', 'Nebula', 'Distinct luminescent interstellar cloud'),
  ('BLACK_HOLE', 'RELATIVISTIC', 'Black Hole', 'Region of spacetime with extreme gravitational acceleration')
ON CONFLICT (code) DO NOTHING;

-- 3. Canonical Celestial Objects Table
CREATE TABLE IF NOT EXISTS celestial_objects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug VARCHAR(150) UNIQUE NOT NULL,
  canonical_name VARCHAR(255) NOT NULL,
  standard_designation VARCHAR(255),
  classification_code VARCHAR(50) NOT NULL REFERENCES object_classifications(code),
  
  -- Hierarchy & System Relations
  parent_id UUID REFERENCES celestial_objects(id) ON DELETE SET NULL,
  host_system_id UUID REFERENCES celestial_objects(id) ON DELETE SET NULL,
  host_galaxy_id UUID REFERENCES celestial_objects(id) ON DELETE SET NULL,
  
  -- Physical Properties (Scientific Units)
  mass_kg DOUBLE PRECISION,
  mass_solar DOUBLE PRECISION,
  mass_earth DOUBLE PRECISION,
  mean_radius_km DOUBLE PRECISION,
  surface_gravity_ms2 DOUBLE PRECISION,
  density_gcm3 DOUBLE PRECISION,
  mean_temperature_k DOUBLE PRECISION,
  spectral_class VARCHAR(50),
  morphological_type VARCHAR(50),
  atmosphere_composition JSONB DEFAULT '[]'::jsonb,
  
  -- Positional Properties (Equatorial Coordinates J2000)
  right_ascension_deg DOUBLE PRECISION,
  declination_deg DOUBLE PRECISION,
  distance_light_years DOUBLE PRECISION,
  distance_au DOUBLE PRECISION,
  distance_km DOUBLE PRECISION,
  
  -- Orbital Properties (Keplerian Elements)
  semi_major_axis_au DOUBLE PRECISION,
  eccentricity DOUBLE PRECISION,
  orbital_period_days DOUBLE PRECISION,
  inclination_deg DOUBLE PRECISION,
  longitude_ascending_node_deg DOUBLE PRECISION,
  argument_periapsis_deg DOUBLE PRECISION,
  mean_anomaly_epoch_deg DOUBLE PRECISION,
  epoch_julian_date DOUBLE PRECISION,
  
  -- Discovery Metadata
  discovery_year INT,
  discovered_by VARCHAR(255),
  discovery_method VARCHAR(100),
  
  -- Primary Scientific Provenance Reference
  primary_source_id UUID REFERENCES sources(id) ON DELETE SET NULL,
  provenance_record_id VARCHAR(255),
  
  -- Media & Summary
  summary TEXT,
  thumbnail_url TEXT,
  texture_url TEXT,
  
  -- Metadata & Timestamps
  is_featured BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. Object Aliases & Catalog Identifiers (For fast multi-catalog resolution)
CREATE TABLE IF NOT EXISTS object_aliases (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  object_id UUID NOT NULL REFERENCES celestial_objects(id) ON DELETE CASCADE,
  alias_name VARCHAR(255) NOT NULL,
  alias_type VARCHAR(50) NOT NULL, -- e.g. 'BAYER', 'FLAMSTEED', 'CATALOG_HD', 'COMMON', 'HISTORICAL'
  source_id UUID REFERENCES sources(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. Space Missions & Exploration
CREATE TABLE IF NOT EXISTS missions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug VARCHAR(150) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  agency VARCHAR(150) NOT NULL,
  status VARCHAR(50) NOT NULL, -- 'PLANNED', 'ACTIVE', 'COMPLETED', 'FAILED'
  launch_date DATE,
  end_date DATE,
  primary_target_id UUID REFERENCES celestial_objects(id) ON DELETE SET NULL,
  objective TEXT,
  summary TEXT,
  source_id UUID REFERENCES sources(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. Spacecraft / Probes
CREATE TABLE IF NOT EXISTS spacecraft (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  mission_id UUID NOT NULL REFERENCES missions(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  craft_type VARCHAR(100) NOT NULL, -- 'ORBITER', 'LANDER', 'ROVER', 'FLYBY_PROBE', 'SPACE_TELESCOPE'
  status VARCHAR(50) NOT NULL,
  mass_kg DOUBLE PRECISION,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for High-Performance Search & Navigation
CREATE INDEX IF NOT EXISTS idx_celestial_objects_slug ON celestial_objects(slug);
CREATE INDEX IF NOT EXISTS idx_celestial_objects_classification ON celestial_objects(classification_code);
CREATE INDEX IF NOT EXISTS idx_celestial_objects_parent ON celestial_objects(parent_id);
CREATE INDEX IF NOT EXISTS idx_celestial_objects_host_system ON celestial_objects(host_system_id);
CREATE INDEX IF NOT EXISTS idx_celestial_objects_name_trgm ON celestial_objects USING gin (canonical_name gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_object_aliases_name_trgm ON object_aliases USING gin (alias_name gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_missions_slug ON missions(slug);
CREATE INDEX IF NOT EXISTS idx_missions_target ON missions(primary_target_id);

-- Row Level Security (RLS) Policies
ALTER TABLE sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE object_classifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE celestial_objects ENABLE ROW LEVEL SECURITY;
ALTER TABLE object_aliases ENABLE ROW LEVEL SECURITY;
ALTER TABLE missions ENABLE ROW LEVEL SECURITY;
ALTER TABLE spacecraft ENABLE ROW LEVEL SECURITY;

-- Public Read Policies
CREATE POLICY "Allow public read access on sources" ON sources FOR SELECT USING (true);
CREATE POLICY "Allow public read access on classifications" ON object_classifications FOR SELECT USING (true);
CREATE POLICY "Allow public read access on celestial_objects" ON celestial_objects FOR SELECT USING (true);
CREATE POLICY "Allow public read access on object_aliases" ON object_aliases FOR SELECT USING (true);
CREATE POLICY "Allow public read access on missions" ON missions FOR SELECT USING (true);
CREATE POLICY "Allow public read access on spacecraft" ON spacecraft FOR SELECT USING (true);
