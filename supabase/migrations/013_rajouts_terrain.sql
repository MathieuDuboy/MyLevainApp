-- ============================================================
-- Migration 013 : Rajouts terrain (rajouts.txt)
-- Protocoles, Produits, Score sol, Rendement enrichi, Marquage pieds
-- IDEMPOTENT
-- ============================================================

-- ---- 1. Table Protocoles ----
CREATE TABLE IF NOT EXISTS protocoles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE NOT NULL,
  label TEXT NOT NULL,
  type TEXT DEFAULT 'sequentiel' CHECK (type IN ('sequentiel', 'meme_temps', 'simple')),
  description TEXT,
  actif BOOLEAN DEFAULT true,
  ordre INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

INSERT INTO protocoles (code, label, type, description, ordre) VALUES
  ('P0', '100% surnageant', 'simple', '100% surnageant sur toute la parcelle', 0),
  ('P1S', 'Surnageant + phyto 100%', 'sequentiel', 'Surnageant selon modalité + cuivre ou phyto 100%', 1),
  ('P2S', 'Surnageant + phyto 50%', 'sequentiel', 'Surnageant selon modalité + cuivre ou phyto 50%', 2),
  ('P3S', 'Surnageant + phyto 25%', 'sequentiel', 'Surnageant selon modalité + cuivre ou phyto 25%', 3),
  ('P1MT', 'Surnageant + phyto 100% (simultané)', 'meme_temps', 'Surnageant selon modalité + cuivre ou phyto 100% en même temps', 4),
  ('P2MT', 'Surnageant + phyto 50% (simultané)', 'meme_temps', 'Surnageant selon modalité + cuivre ou phyto 50% en même temps', 5),
  ('P3MT', 'Surnageant + phyto 25% (simultané)', 'meme_temps', 'Surnageant selon modalité + cuivre ou phyto 25% en même temps', 6)
ON CONFLICT (code) DO NOTHING;

-- ---- 2. Table Produits MyLevain ----
CREATE TABLE IF NOT EXISTS produits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE NOT NULL,
  label TEXT NOT NULL,
  type TEXT DEFAULT 'levain' CHECK (type IN ('levain', 'phyto', 'autre')),
  origine TEXT,
  description TEXT,
  actif BOOLEAN DEFAULT true,
  ordre INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

INSERT INTO produits (code, label, type, origine, description, ordre) VALUES
  ('S1', 'Surnageant blé', 'levain', 'Blé', 'Surnageant actuel issu du blé', 0),
  ('S2', 'Surnageant seigle', 'levain', 'Seigle', 'Surnageant actuel issu du seigle', 1),
  ('L1', 'Levain culot', 'levain', 'Culot de cuve', 'Levain issu du culot de cuve', 2)
ON CONFLICT (code) DO NOTHING;

-- ---- 3. Observations — champs terrain manquants ----
ALTER TABLE observations ADD COLUMN IF NOT EXISTS compaction INTEGER;
ALTER TABLE observations ADD COLUMN IF NOT EXISTS poids_100_baies REAL;
ALTER TABLE observations ADD COLUMN IF NOT EXISTS nb_grappes_10_ceps INTEGER;
ALTER TABLE observations ADD COLUMN IF NOT EXISTS poids_grappes_10_ceps REAL;
ALTER TABLE observations ADD COLUMN IF NOT EXISTS pieds_marques TEXT;
ALTER TABLE observations ADD COLUMN IF NOT EXISTS score_sol_global REAL;

-- ---- 4. Traitements — champs enrichis ----
ALTER TABLE traitements ADD COLUMN IF NOT EXISTS protocole_id UUID REFERENCES protocoles(id);
ALTER TABLE traitements ADD COLUMN IF NOT EXISTS produit_levain_id UUID REFERENCES produits(id);
ALTER TABLE traitements ADD COLUMN IF NOT EXISTS produit_phyto_id UUID REFERENCES produits(id);
ALTER TABLE traitements ADD COLUMN IF NOT EXISTS ph_avant REAL;
ALTER TABLE traitements ADD COLUMN IF NOT EXISTS ph_apres REAL;
ALTER TABLE traitements ADD COLUMN IF NOT EXISTS origine_eau TEXT;
ALTER TABLE traitements ADD COLUMN IF NOT EXISTS dilution TEXT;
ALTER TABLE traitements ADD COLUMN IF NOT EXISTS vent_direction TEXT;
ALTER TABLE traitements ADD COLUMN IF NOT EXISTS vent_vitesse REAL;
ALTER TABLE traitements ADD COLUMN IF NOT EXISTS pression_atmo REAL;
ALTER TABLE traitements ADD COLUMN IF NOT EXISTS date_derniere_pluie DATE;
ALTER TABLE traitements ADD COLUMN IF NOT EXISTS surface_m2 REAL;
ALTER TABLE traitements ADD COLUMN IF NOT EXISTS pieds_marques TEXT;

-- ---- 5. Parcelles — identifiant métier ----
ALTER TABLE parcelles ADD COLUMN IF NOT EXISTS code_metier TEXT;

-- ---- 6. Zones culture — surface m2 ----
ALTER TABLE zones_culture ADD COLUMN IF NOT EXISTS surface_m2 REAL;
