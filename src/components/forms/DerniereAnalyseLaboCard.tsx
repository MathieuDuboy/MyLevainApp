"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { useDemo } from "@/components/DemoProvider";
import { DEMO_ANALYSES } from "@/lib/demo-data";
import type { AnalyseSol } from "@/lib/types";

function Row({ label, value, unit }: { label: string; value: unknown; unit?: string }) {
  if (value === null || value === undefined) return null;
  return (
    <div className="flex justify-between py-0.5">
      <span className="text-gray-500">{label}</span>
      <span className="font-medium text-gray-800">{String(value)}{unit ? ` ${unit}` : ""}</span>
    </div>
  );
}

export function DerniereAnalyseLaboCard({ parcelleId }: { parcelleId: string }) {
  const { isDemo } = useDemo();
  const [analyse, setAnalyse] = useState<AnalyseSol | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isDemo) {
      // Use the most recent demo analysis
      const sorted = [...DEMO_ANALYSES].sort((a, b) => b.date_prelevement.localeCompare(a.date_prelevement));
      setAnalyse(sorted[0] ?? null);
      setLoading(false);
      return;
    }

    async function fetch() {
      const { data } = await supabase
        .from("analyses_sol")
        .select("*")
        .eq("parcelle_id", parcelleId)
        .order("date_prelevement", { ascending: false })
        .limit(1)
        .maybeSingle();
      setAnalyse(data as AnalyseSol | null);
      setLoading(false);
    }
    if (parcelleId) fetch();
    else setLoading(false);
  }, [parcelleId, isDemo]);

  if (loading) return null;
  if (!analyse) {
    return (
      <div className="glass rounded-2xl p-3 text-xs text-gray-400 text-center">
        Aucune analyse labo disponible
      </div>
    );
  }

  return (
    <div className="glass rounded-2xl p-4 space-y-2">
      <div className="flex justify-between items-center">
        <span className="text-xs font-semibold text-gray-700">🧪 Dernière analyse labo</span>
        <span className="text-[10px] text-gray-400">{analyse.date_prelevement} — {analyse.phase}</span>
      </div>
      <div className="grid grid-cols-2 gap-x-4 text-xs">
        <Row label="pH" value={analyse.ph} />
        <Row label="MO" value={analyse.matiere_organique_pct} unit="%" />
        <Row label="Azote" value={analyse.azote_total} />
        <Row label="Phosphore" value={analyse.phosphore} />
        <Row label="Potassium" value={analyse.potassium} />
        <Row label="Calcium" value={analyse.calcium} />
        <Row label="Magnésium" value={analyse.magnesium} />
        <Row label="CEC" value={analyse.cec} />
      </div>
      {(analyse.cuivre_total != null || analyse.cuivre_biodisponible != null) && (
        <div className="grid grid-cols-2 gap-x-4 text-xs pt-1 border-t border-gray-100">
          <Row label="Cu total" value={analyse.cuivre_total} unit="mg/kg" />
          <Row label="Cu biodispo." value={analyse.cuivre_biodisponible} unit="mg/kg" />
          <Row label="Cadmium" value={analyse.cadmium_total} />
          <Row label="Plomb" value={analyse.plomb_total} />
          <Row label="Arsenic" value={analyse.arsenic_total} />
        </div>
      )}
      {(analyse.biomasse_microbienne != null || analyse.respiration_sol != null) && (
        <div className="grid grid-cols-2 gap-x-4 text-xs pt-1 border-t border-gray-100">
          <Row label="Biomasse" value={analyse.biomasse_microbienne} />
          <Row label="Respiration" value={analyse.respiration_sol} />
          <Row label="Score sol" value={analyse.score_sante_sol} unit="/5" />
        </div>
      )}
    </div>
  );
}
