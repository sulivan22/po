"use client";

import { useState } from "react";

import { useToast } from "@/components/toast-provider";
import { CompetitionKey } from "@/lib/types";

export function AdminSyncButton({ competitionKey, label }: { competitionKey: CompetitionKey; label: string }) {
  const [loading, setLoading] = useState(false);
  const { pushToast } = useToast();

  async function handleSync() {
    setLoading(true);
    const response = await fetch("/api/admin/sync", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ competitionKey })
    });
    const payload = await response.json();
    setLoading(false);

    if (!response.ok) {
      pushToast({
        title: payload.error ?? "No se pudo ejecutar la sincronización.",
        tone: "error"
      });
      return;
    }

    pushToast({
      title:
        payload.eventsProcessed === 0
          ? `${label}: todavía no hay partidos sincronizables.`
          : `${label}: ${payload.eventsProcessed} partidos, ${payload.updatedEntries} entries actualizadas.`,
      tone: "success"
    });
  }

  return (
    <button className="primary-button" type="button" onClick={handleSync} disabled={loading}>
      {loading ? `Sincronizando ${label}...` : `Sync ${label}`}
    </button>
  );
}
