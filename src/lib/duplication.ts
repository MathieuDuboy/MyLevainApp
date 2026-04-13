import type { Observation, ObservationFormData } from "@/lib/types";

/**
 * Duplique une observation existante comme modèle pour une nouvelle saisie.
 * - Met à jour la date au jour courant (YYYY-MM-DD)
 * - Met à jour l'heure à l'heure courante (HH:MM)
 * - Met à jour le mois selon la nouvelle date
 * - Vide les champs météo (seront re-remplis par GPS ou manuellement)
 * - Copie tous les autres champs (parcelle, rang, modalité, indicateurs plante, maladies, grappes, rendement, commentaires)
 * - Supprime id, created_at, score_plante, score_sanitaire (recalculés à la soumission)
 *
 * Exigences : 12.1, 12.2, 12.3, 12.4
 */
export function dupliquerObservation(source: Observation): ObservationFormData {
  const now = new Date();
  const date = now.toISOString().split("T")[0];
  const heure = now.toTimeString().slice(0, 5);
  const mois = now.toLocaleString("fr-FR", { month: "long" });

  const {
    id: _id,
    created_at: _createdAt,
    score_plante: _scorePlante,
    score_sanitaire: _scoreSanitaire,
    ...rest
  } = source;

  return {
    ...rest,
    // Nouvelle date/heure
    date,
    heure,
    mois,
    // Météo vidée (sera re-remplie par GPS ou manuellement)
    meteo: null,
    temperature: null,
    humidite: null,
    vent: null,
    pluie_recente: null,
    derniere_pluie: null,
    humidite_sol: null,
  };
}
