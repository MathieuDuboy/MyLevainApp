"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ObservationForm } from "@/components/forms/ObservationForm";
import { useDemo } from "@/components/DemoProvider";
import { DEMO_OBSERVATIONS } from "@/lib/demo-data";
import { supabase } from "@/lib/supabase/client";
import { dupliquerObservation } from "@/lib/duplication";
import type { Observation, ObservationFormData } from "@/lib/types";

export default function NewObservationPage() {
  const searchParams = useSearchParams();
  const { isDemo } = useDemo();
  const duplicateId = searchParams.get("duplicate");
  const [initialData, setInitialData] = useState<ObservationFormData | undefined>(undefined);
  const [loading, setLoading] = useState(!!duplicateId);

  useEffect(() => {
    if (!duplicateId) return;

    // In demo mode, find the observation from demo data
    if (isDemo) {
      const source = DEMO_OBSERVATIONS.find((o) => o.id === duplicateId);
      if (source) {
        setInitialData(dupliquerObservation(source));
      }
      setLoading(false);
      return;
    }

    // In real mode, fetch from Supabase
    async function loadSource() {
      const { data, error } = await supabase
        .from("observations")
        .select("*")
        .eq("id", duplicateId)
        .single();
      if (!error && data) {
        setInitialData(dupliquerObservation(data as Observation));
      }
      setLoading(false);
    }
    loadSource();
  }, [duplicateId, isDemo]);

  if (loading) {
    return (
      <div className="text-center py-16">
        <div className="text-4xl mb-3 animate-pulse">📋</div>
        <p className="text-gray-400">Chargement du modèle...</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-xl font-bold gradient-text mb-4">
        {initialData ? "📋 Nouvelle observation (depuis modèle)" : "📝 Nouvelle observation"}
      </h1>
      <ObservationForm initialData={initialData} />
    </div>
  );
}
