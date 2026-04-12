-- ============================================================
-- Migration 005 : Table de configuration dynamique
-- ============================================================

-- Config générale (clé/valeur pour les textes, labels, paramètres)
CREATE TABLE app_config (
  cle TEXT PRIMARY KEY,
  valeur TEXT NOT NULL,
  categorie TEXT DEFAULT 'general',
  description TEXT,
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE app_config ENABLE ROW LEVEL SECURITY;
CREATE POLICY "allow_all" ON app_config FOR ALL USING (true) WITH CHECK (true);

-- Données initiales
INSERT INTO app_config (cle, valeur, categorie, description) VALUES
  ('app_titre', 'MyLevain Agro', 'ui', 'Titre principal de l''app'),
  ('campagne', 'Campagne 2026', 'ui', 'Sous-titre campagne'),
  ('stock_surnageant', '10', 'protocole', 'Stock total surnageant en litres'),
  ('volume_par_passage', '24', 'protocole', 'Volume total par passage en litres'),
  ('seuil_mildiou_eleve', '3', 'scoring', 'Score mildiou à partir duquel le risque est élevé (0-5)'),
  ('seuil_mildiou_moyen', '1.5', 'scoring', 'Score mildiou à partir duquel le risque est moyen (0-5)'),
  ('seuil_vigueur_faible', '2.5', 'scoring', 'Score vigueur en dessous duquel on recommande un traitement'),
  ('seuil_phytotoxicite', '2', 'scoring', 'Note brûlures/nécroses à partir de laquelle on alerte');

-- Rendre les modalités éditables (déjà dans referentiel_modalites)
-- On ajoute un champ "actif" pour pouvoir désactiver sans supprimer
ALTER TABLE referentiel_modalites ADD COLUMN IF NOT EXISTS actif BOOLEAN DEFAULT true;
