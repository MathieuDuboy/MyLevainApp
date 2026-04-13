-- ============================================================
-- Migration 012 : Consolidation structure données (reco.md)
-- Ajout champs sol, biologie, qualité raisin, notifications
-- IDEMPOTENT : rejouable sans erreur
-- ============================================================

-- ---- 1. Analyses sol — champs chimie manquants ----
ALTER TABLE analyses_sol ADD COLUMN IF NOT EXISTS calcium REAL;
ALTER TABLE analyses_sol ADD COLUMN IF NOT EXISTS magnesium REAL;
ALTER TABLE analyses_sol ADD COLUMN IF NOT EXISTS cec REAL;
ALTER TABLE analyses_sol ADD COLUMN IF NOT EXISTS type_analyse TEXT DEFAULT 'labo';
ALTER TABLE analyses_sol ADD COLUMN IF NOT EXISTS analyse_microbiote JSONB;

-- ---- 2. Observations — indicateurs biologiques terrain ----
ALTER TABLE observations ADD COLUMN IF NOT EXISTS vie_biologique_visible INTEGER;
ALTER TABLE observations ADD COLUMN IF NOT EXISTS presence_vers_de_terre INTEGER;
ALTER TABLE observations ADD COLUMN IF NOT EXISTS structure_sol INTEGER;
ALTER TABLE observations ADD COLUMN IF NOT EXISTS odeur_sol INTEGER;

-- ---- 3. Observations — qualité raisin ----
ALTER TABLE observations ADD COLUMN IF NOT EXISTS brix REAL;
ALTER TABLE observations ADD COLUMN IF NOT EXISTS ph_raisin REAL;

-- ---- 4. Scores — score rendement + score global sur observations ----
ALTER TABLE observations ADD COLUMN IF NOT EXISTS score_rendement REAL;
ALTER TABLE observations ADD COLUMN IF NOT EXISTS score_global REAL;

-- ---- 5. Table notifications ----
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  type TEXT NOT NULL DEFAULT 'info',
  message TEXT NOT NULL,
  niveau TEXT DEFAULT 'info' CHECK (niveau IN ('info', 'warning', 'error', 'success')),
  lu BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id, lu);

-- ---- 6. Table user_parcelle (accès vigneron par parcelle) ----
CREATE TABLE IF NOT EXISTS user_parcelle (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  parcelle_id UUID NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, parcelle_id)
);

-- ---- 7. Indice de performance agronomique (KPI par campagne) ----
CREATE TABLE IF NOT EXISTS indice_performance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  zone_culture_id UUID REFERENCES zones_culture(id) ON DELETE CASCADE,
  campagne TEXT NOT NULL,
  reduction_cuivre REAL,
  amelioration_sol REAL,
  rendement_score REAL,
  sante_plante REAL,
  indice_global REAL,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(zone_culture_id, campagne)
);
