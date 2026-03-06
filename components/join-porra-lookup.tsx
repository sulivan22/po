"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

import { useToast } from "@/components/toast-provider";

type PorraLookupResponse = {
  porra: {
    slug: string;
    name: string;
    ownerId: string;
    entryFeeCents: number;
  };
};

export function JoinPorraLookup() {
  const [slug, setSlug] = useState("");
  const [loading, setLoading] = useState(false);
  const [candidate, setCandidate] = useState<PorraLookupResponse["porra"] | null>(null);
  const router = useRouter();
  const { data: session } = useSession();
  const { pushToast } = useToast();

  async function searchPorra() {
    if (!slug.trim()) {
      pushToast({ title: "Introduce el nombre único de la porra.", tone: "warning" });
      return;
    }

    setLoading(true);
    const response = await fetch(`/api/porras/${encodeURIComponent(slug.trim())}`);
    const payload = await response.json();
    setLoading(false);

    if (!response.ok) {
      pushToast({ title: payload.error ?? "No se encontró la porra.", tone: "error" });
      return;
    }

    if (payload.porra.ownerId === session?.user?.email) {
      pushToast({
        title: "No puedes unirte a una porra que has creado.",
        tone: "warning"
      });
      setCandidate(null);
      return;
    }

    setCandidate(payload.porra);
  }

  function confirmJoin() {
    if (!candidate) {
      return;
    }
    router.push(`/porras/join?slug=${encodeURIComponent(candidate.slug)}`);
  }

  return (
    <section className="card">
      <div className="section-heading">
        <span className="eyebrow">Paso 1</span>
        <h1>Busca la porra a la que te quieres unir</h1>
      </div>
      <div className="join-lookup-row">
        <input
          value={slug}
          onChange={(event) => setSlug(event.target.value)}
          placeholder="nombre-unico-porra"
        />
        <button className="primary-button" type="button" onClick={searchPorra} disabled={loading}>
          {loading ? "Buscando..." : "Buscar porra"}
        </button>
      </div>

      {candidate ? (
        <div className="join-confirm-modal">
          <strong>¿Quieres unirte a la porra {candidate.name} creada por {candidate.ownerId}?</strong>
          <p>Importe de entrada: {(candidate.entryFeeCents / 100).toFixed(2)}€</p>
          <div className="cta-row">
            <button className="primary-button" type="button" onClick={confirmJoin}>
              Sí, continuar
            </button>
            <button className="ghost-button" type="button" onClick={() => setCandidate(null)}>
              Cancelar
            </button>
          </div>
        </div>
      ) : null}
    </section>
  );
}
