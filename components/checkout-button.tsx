"use client";

import { useState } from "react";

import { useToast } from "@/components/toast-provider";
import { CompetitionKey } from "@/lib/types";

export function CheckoutButton({
  mode,
  porraSlug,
  competitionKey,
  amountCents,
  buttonLabel
}: {
  mode: "create" | "join";
  porraSlug?: string;
  competitionKey?: CompetitionKey;
  amountCents?: number;
  buttonLabel?: string;
}) {
  const [loading, setLoading] = useState(false);
  const { pushToast } = useToast();

  async function startCheckout() {
    setLoading(true);
    const response = await fetch("/api/stripe/checkout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ mode, porraSlug, competitionKey, amountCents })
    });

    const payload = await response.json();
    setLoading(false);

    if (payload.url) {
      window.location.href = payload.url;
      return;
    }

    pushToast({
      title: payload.error ?? "No se pudo iniciar el checkout.",
      tone: "error"
    });
  }

  return (
    <div className="checkout-stack">
      <button className="primary-button" onClick={startCheckout} disabled={loading}>
        {loading
          ? "Redirigiendo..."
          : buttonLabel ?? `Pagar ${((amountCents ?? 0) / 100).toFixed(2)}€ y continuar`}
      </button>
    </div>
  );
}
