"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { useDemo } from "@/components/DemoProvider";
import { DEMO_VIGNOBLES, DEMO_PARCELLES, DEMO_ANALYSES } from "@/lib/demo-data";
import { MODALITES_REF } from "@/lib/constants";
import { DernierTraitementCard } from "@/components/traitements/DernierTraitementCard";

const VIGNOBLES_DATA: Record<string, { nom: string; localisation: string; parcelles: { id: string; nom: string }[] }> = {
  "a1000000-0000-0000-0000-000000000001": {
    nom: "Piotte", localisation: "Bordeaux",
    parcelles: [{ id: "b1000000-0000-0000-0000-000000000001", nom: "Parcelle principale" }],
  },
  "a1000000-0000-0000-0000-000000000002": {
    nom: "Pape Clément", localisation: "Pessac-Léognan",
    parcelles: [{ id: "b1000000-0000-0000-0000-000000000002", nom: "Parcelle test" }],
  },
};

function AnalyseSolCard({ analyse }: { analyse: typeof DEMO_ANALYSES[0] }) {
  return (
    <div className="glass rounded-2xl p-4 space-y-2">
      <div className="flex justify-between items-center">
        <span className="text-sm font-semibold text-gray-700">🧪 Analyse sol — {analyse.phase}</span>
        <span className="text-xs text-gray-400">{analyse.date_prelevement}</span>
      </div>
      <div className="grid grid-cols-3 gap-2 text-xs">
        <div className="bg-emerald-50 rounded-lg p-2 text-center">
          <div className="font-bold text-emerald-700">{analyse.ph}</div>
          <div className="text-emerald-600">pH</div>
        </div>
        <div className="bg-amber-50 rounded-lg p-2 text-center">
          <div className="font-bold text-amber-700">{analyse.matiere_organique_pct}%</div>
          <div className="text-amber-600">MO</div>
        </div>
        <div className="bg-blue-50 rounded-lg p-2 text-center">
          <div className="font-bold text-blue-700">{analyse.score_sante_sol}/5</div>
          <div className="text-blue-600">Score sol</div>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2 text-xs">
        {analyse.cuivre_total != null && (
          <div className="flex justify-between py-1 border-b border-gray-50">
            <span className="text-gray-500">Cu total</span>
            <span className="font-medium">{analyse.cuivre_total} mg/kg</span>
          </div>
        )}
        {analyse.cuivre_biodisponible != null && (
          <div className="flex justify-between py-1 border-b border-gray-50">
            <span className="text-gray-500">Cu biodispo.</span>
            <span className="font-medium">{analyse.cuivre_biodisponible} mg/kg</span>
          </div>
        )}
        {analyse.biomasse_microbienne != null && (
          <div className="flex justify-between py-1 border-b border-gray-50">
            <span className="text-gray-500">Biomasse</span>
            <span className="font-medium">{analyse.biomasse_microbienne}</span>
          </div>
        )}
        {analyse.respiration_sol != null && (
          <div className="flex justify-between py-1 border-b border-gray-50">
            <span className="text-gray-500">Respiration</span>
            <span className="font-medium">{analyse.respiration_sol}</span>
          </div>
        )}
        {analyse.calcium != null && (
          <div className="flex justify-between py-1 border-b border-gray-50">
            <span className="text-gray-500">Calcium</span>
            <span className="font-medium">{analyse.calcium}</span>
          </div>
        )}
        {analyse.magnesium != null && (
          <div className="flex justify-between py-1 border-b border-gray-50">
            <span className="text-gray-500">Magnésium</span>
            <span className="font-medium">{analyse.magnesium}</span>
          </div>
        )}
      </div>
      {analyse.score_contamination_metaux != null && (
        <div className="text-xs text-gray-500">
          Score contamination métaux : <span className="font-medium text-orange-600">{analyse.score_contamination_metaux}/5</span>
        </div>
      )}
    </div>
  );
}

export default function VignoblePage() {
  const { id } = useParams<{ id: string }>();
  const { isDemo } = useDemo();

  // In demo mode, look up from demo data
  const demoSite = isDemo ? DEMO_VIGNOBLES.find((v) => v.id === id) : null;
  const demoParcelles = isDemo ? DEMO_PARCELLES.filter((p) => p.vignoble_id === id) : [];
  const demoAnalyses = isDemo ? DEMO_ANALYSES : [];

  // In real mode, use hardcoded data (legacy)
  const realSite = !isDemo ? VIGNOBLES_DATA[id] : null;

  const siteName = demoSite?.nom ?? realSite?.nom;
  const siteLocation = demoSite?.localisation ?? realSite?.localisation;
  const siteType = demoSite?.appellation ?? null;
  const parcelles = isDemo
    ? demoParcelles.map((p) => ({ id: p.id, nom: p.nom, detail: p.cepage }))
    : (realSite?.parcelles ?? []).map((p) => ({ id: p.id, nom: p.nom, detail: null }));

  if (!siteName) {
    return (
      <div className="text-center py-16">
        <div className="text-4xl mb-3">🔍</div>
        <p className="text-gray-400 mb-4">Site non trouvé</p>
        <Link href="/" className="text-sm text-emerald-600 font-medium hover:underline">← Retour</Link>
      </div>
    );
  }

  return (
    <div>
      <Link href="/" className="text-sm text-gray-500 hover:text-emerald-600">← Retour</Link>
      <h1 className="text-xl font-bold gradient-text mt-2 mb-1">{siteName}</h1>
      <p className="text-sm text-gray-500">{siteLocation}</p>
      {siteType && <p className="text-xs text-amber-600 font-medium mt-0.5">{siteType}</p>}

      {/* Parcelles / Zones */}
      <h2 className="text-lg font-bold text-gray-800 mt-6 mb-3">Parcelles</h2>
      <div className="space-y-3 mb-6">
        {parcelles.map((p) => (
          <div key={p.id} className="space-y-2">
            <div className="glass rounded-2xl p-4">
              <div className="font-medium text-gray-800">{p.nom}</div>
              {p.detail && <div className="text-xs text-gray-500 mt-0.5">{p.detail}</div>}
            </div>
            {!isDemo && <DernierTraitementCard parcelleId={p.id} />}
          </div>
        ))}
        {parcelles.length === 0 && (
          <p className="text-sm text-gray-400">Aucune parcelle pour ce site</p>
        )}
      </div>

      {/* Analyses sol (demo) */}
      {isDemo && demoAnalyses.length > 0 && (
        <>
          <h2 className="text-lg font-bold text-gray-800 mb-3">🧪 Analyses de sol</h2>
          <div className="space-y-3 mb-6">
            {demoAnalyses.map((a) => (
              <AnalyseSolCard key={a.id} analyse={a} />
            ))}
          </div>
        </>
      )}

      {/* Protocole */}
      <h2 className="text-lg font-bold text-gray-800 mb-3">Protocole — 7 rangs</h2>
      <div className="space-y-2 mb-6">
        {MODALITES_REF.map((m) => (
          <div key={m.rang} className="glass rounded-2xl p-3 flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center text-sm font-bold">
              {m.rang}
            </div>
            <div className="flex-1">
              <div className="font-medium text-sm text-gray-800">{m.modalite}</div>
              <div className="text-xs text-gray-400">{m.description}</div>
            </div>
            <div className="text-xs text-gray-400 font-mono">
              {m.volume_l > 0 ? `${m.volume_l}L` : "—"}
            </div>
          </div>
        ))}
      </div>

      {/* Actions */}
      <div className="grid grid-cols-2 gap-3">
        <Link href="/observations/new" className="btn-primary text-center !py-3 !text-sm">📝 Observation</Link>
        <Link href="/traitements/new" className="btn-secondary text-center !py-3 !text-sm">💧 Traitement</Link>
        <Link href={`/vignobles/${id}/galerie`} className="glass rounded-2xl p-3 text-center text-sm font-medium text-emerald-700">📷 Galerie</Link>
        <Link href={`/vignobles/${id}/timeline`} className="glass rounded-2xl p-3 text-center text-sm font-medium text-emerald-700">📅 Timeline</Link>
      </div>
    </div>
  );
}
