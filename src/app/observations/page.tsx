"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import { useDemo } from "@/components/DemoProvider";
import { DEMO_OBSERVATIONS } from "@/lib/demo-data";
import { Observation } from "@/lib/types";
import { SelectField } from "@/components/ui/SelectField";
import { ListSkeleton } from "@/components/Skeleton";

function DetailRow({ label, value, unit }: { label: string; value: unknown; unit?: string }) {
  if (value === null || value === undefined || value === "") return null;
  return (
    <div className="flex justify-between py-1 border-b border-gray-50 last:border-0">
      <span className="text-xs text-gray-500">{label}</span>
      <span className="text-xs font-medium text-gray-800">{String(value)}{unit ? ` ${unit}` : ""}</span>
    </div>
  );
}

function ScoreBadge({ label, value, color }: { label: string; value: number | null; color: string }) {
  if (value === null) return null;
  const bg = color === "green" ? "bg-emerald-50 text-emerald-700" : color === "orange" ? "bg-amber-50 text-amber-700" : "bg-blue-50 text-blue-700";
  return (
    <div className={`${bg} rounded-xl px-3 py-2 text-center`}>
      <div className="text-lg font-bold">{value}</div>
      <div className="text-[10px] font-medium">{label}</div>
    </div>
  );
}

function ObservationDetail({ obs }: { obs: Observation }) {
  return (
    <div className="mt-3 pt-3 border-t border-gray-100 space-y-3 animate-fadeIn">
      {/* Scores */}
      <div className="grid grid-cols-2 gap-2">
        <ScoreBadge label="Score plante" value={obs.score_plante} color="green" />
        <ScoreBadge label="Score sanitaire" value={obs.score_sanitaire} color="orange" />
      </div>

      {/* Météo */}
      {(obs.meteo || obs.temperature !== null || obs.humidite !== null) && (
        <div className="glass rounded-xl p-3">
          <div className="text-xs font-semibold text-gray-600 mb-1.5">🌤️ Météo</div>
          <DetailRow label="Conditions" value={obs.meteo} />
          <DetailRow label="Température" value={obs.temperature} unit="°C" />
          <DetailRow label="Humidité air" value={obs.humidite} unit="%" />
          <DetailRow label="Vent" value={obs.vent} />
          <DetailRow label="Pluie récente" value={obs.pluie_recente === true ? "Oui" : obs.pluie_recente === false ? "Non" : null} />
          <DetailRow label="Dernière pluie" value={obs.derniere_pluie} />
          <DetailRow label="Humidité sol" value={obs.humidite_sol} />
        </div>
      )}

      {/* Traitement appliqué */}
      {(obs.volume_applique_l !== null || obs.cuivre !== null) && (
        <div className="glass rounded-xl p-3">
          <div className="text-xs font-semibold text-gray-600 mb-1.5">💧 Traitement appliqué</div>
          <DetailRow label="Surnageant" value={obs.surnageant_l} unit="L" />
          <DetailRow label="Eau" value={obs.eau_l} unit="L" />
          <DetailRow label="Volume total" value={obs.volume_applique_l} unit="L" />
          <DetailRow label="pH surnageant" value={obs.ph_surnageant} />
          <DetailRow label="Cuivre" value={obs.cuivre === true ? "Oui" : obs.cuivre === false ? "Non" : null} />
          <DetailRow label="Date surnageant" value={obs.date_surnageant} />
          <DetailRow label="Date cuivre" value={obs.date_cuivre} />
        </div>
      )}

      {/* État plante */}
      <div className="glass rounded-xl p-3">
        <div className="text-xs font-semibold text-gray-600 mb-1.5">🌿 État de la plante</div>
        <div className="grid grid-cols-2 gap-x-4">
          <DetailRow label="Vigueur" value={obs.vigueur} unit="/5" />
          <DetailRow label="Croissance" value={obs.croissance} unit="/5" />
          <DetailRow label="Homogénéité" value={obs.homogeneite} unit="/5" />
          <DetailRow label="Couleur feuilles" value={obs.couleur_feuilles} unit="/5" />
          <DetailRow label="Épaisseur feuilles" value={obs.epaisseur_feuilles} unit="/5" />
          <DetailRow label="Turgescence" value={obs.turgescence} unit="/5" />
        </div>
      </div>

      {/* Symptômes */}
      {(obs.brulures !== null || obs.necroses !== null || obs.deformations !== null) && (
        <div className="glass rounded-xl p-3">
          <div className="text-xs font-semibold text-gray-600 mb-1.5">⚠️ Symptômes</div>
          <DetailRow label="Brûlures" value={obs.brulures} unit="/5" />
          <DetailRow label="Nécroses" value={obs.necroses} unit="/5" />
          <DetailRow label="Déformations" value={obs.deformations} unit="/5" />
        </div>
      )}

      {/* Maladies */}
      {(obs.mildiou_presence !== null || obs.mildiou_intensite !== null) && (
        <div className="glass rounded-xl p-3">
          <div className="text-xs font-semibold text-gray-600 mb-1.5">🦠 Maladies</div>
          <DetailRow label="Mildiou présence" value={obs.mildiou_presence} unit="/5" />
          <DetailRow label="Mildiou intensité" value={obs.mildiou_intensite} unit="%" />
          <DetailRow label="Localisation" value={obs.localisation_mildiou} />
          <DetailRow label="Progression" value={obs.progression} />
          <DetailRow label="Pression mildiou" value={obs.pression_mildiou} unit="/3" />
        </div>
      )}

      {/* Grappes & Rendement */}
      {(obs.nb_grappes_par_cep !== null || obs.nombre_grappes !== null || obs.rendement_estime !== null) && (
        <div className="glass rounded-xl p-3">
          <div className="text-xs font-semibold text-gray-600 mb-1.5">🍇 Grappes & Rendement</div>
          <DetailRow label="Nb grappes/cep" value={obs.nb_grappes_par_cep} />
          <DetailRow label="Taille grappes" value={obs.taille_grappes} unit="/5" />
          <DetailRow label="Homogénéité grappes" value={obs.homogeneite_grappes} unit="/5" />
          <DetailRow label="Nombre grappes" value={obs.nombre_grappes} />
          <DetailRow label="Poids moyen grappe" value={obs.poids_moyen_grappe} unit="g" />
          <DetailRow label="Rendement estimé" value={obs.rendement_estime} unit="kg/ha" />
          <DetailRow label="Rendement réel" value={obs.rendement_reel} unit="kg/ha" />
        </div>
      )}

      {/* Commentaires */}
      {obs.commentaires && (
        <div className="glass rounded-xl p-3">
          <div className="text-xs font-semibold text-gray-600 mb-1">💬 Commentaires</div>
          <p className="text-xs text-gray-700">{obs.commentaires}</p>
        </div>
      )}
    </div>
  );
}

export default function ObservationsPage() {
  const router = useRouter();
  const { isDemo } = useDemo();
  const [observations, setObservations] = useState<Observation[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterRang, setFilterRang] = useState("");
  const [filterMois, setFilterMois] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    if (isDemo) {
      setObservations(DEMO_OBSERVATIONS);
      setLoading(false);
      return;
    }
    async function load() {
      const { data, error } = await supabase
        .from("observations")
        .select("*")
        .order("date", { ascending: false })
        .limit(100);
      if (!error && data) setObservations(data as Observation[]);
      setLoading(false);
    }
    load();
  }, [isDemo]);

  const filtered = observations.filter((o) => {
    if (filterRang && o.rang !== Number(filterRang)) return false;
    if (filterMois && o.mois !== filterMois) return false;
    return true;
  });

  return (
    <div>
      <h1 className="text-xl font-bold gradient-text mb-4">📋 Historique</h1>

      <div className="flex gap-3 mb-4">
        <Link href="/observations/new" className="flex-1 btn-primary text-center text-sm !py-2.5 !text-sm">
          📝 Nouvelle
        </Link>
        <Link href="/observations/batch" className="flex-1 glass text-center text-sm py-2.5 font-medium text-emerald-700 rounded-2xl">
          📋 Saisie par lot
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <SelectField label="Rang" value={filterRang} onChange={setFilterRang} options={["1","2","3","4","5","6","7"]} placeholder="Tous" />
        <SelectField label="Mois" value={filterMois} onChange={setFilterMois} options={["mars","avril","mai","juin","juillet","août","septembre","octobre","novembre","décembre"]} placeholder="Tous" />
      </div>

      <p className="text-xs text-gray-400 mb-2">{filtered.length} observation{filtered.length !== 1 ? "s" : ""}</p>

      {loading ? (
        <ListSkeleton count={4} />
      ) : filtered.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-4xl mb-3">🌱</div>
          <p className="text-gray-400 mb-4">Aucune observation pour le moment</p>
          <Link href="/observations/new" className="inline-block btn-primary px-6 !py-3 !text-sm">
            Créer la première observation →
          </Link>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((obs) => {
            const isExpanded = expandedId === obs.id;
            return (
              <div
                key={obs.id}
                className={`glass rounded-2xl p-4 transition-all ${isExpanded ? "ring-2 ring-emerald-400/30" : ""}`}
              >
                {/* Header — clickable to expand */}
                <button
                  type="button"
                  onClick={() => setExpandedId(isExpanded ? null : obs.id)}
                  className="w-full text-left"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-medium text-sm">
                        Rang {obs.rang} — <span className="text-emerald-700">{obs.modalite}</span>
                      </div>
                      <div className="text-xs text-gray-500 mt-0.5">
                        {new Date(obs.date).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}
                        {obs.heure && ` à ${obs.heure}`}
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5">
                      {obs.score_plante !== null && (
                        <span className="bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full text-xs font-medium">
                          🌿 {obs.score_plante}
                        </span>
                      )}
                      {obs.score_sanitaire !== null && (
                        <span className="bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full text-xs font-medium">
                          🛡️ {obs.score_sanitaire}
                        </span>
                      )}
                      <span className={`text-gray-400 text-sm transition-transform ${isExpanded ? "rotate-180" : ""}`}>
                        ▾
                      </span>
                    </div>
                  </div>
                  {!isExpanded && obs.commentaires && (
                    <p className="text-xs text-gray-400 mt-1.5 line-clamp-1">{obs.commentaires}</p>
                  )}
                </button>

                {/* Expanded detail */}
                {isExpanded && <ObservationDetail obs={obs} />}

                {/* Actions */}
                <div className="mt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push(`/observations/new?duplicate=${obs.id}`);
                    }}
                    className="text-xs text-emerald-700 font-medium px-2 py-1 rounded-lg hover:bg-emerald-50 transition-colors"
                  >
                    📋 Dupliquer
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
