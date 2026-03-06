"use client";

import { useMemo, useState } from "react";

import { CheckoutButton } from "@/components/checkout-button";
import { CompetitionKey } from "@/lib/types";

export function CreatePorraPaymentStep({ competitionKey }: { competitionKey: CompetitionKey }) {
  const [amountEuro, setAmountEuro] = useState("10");

  const amountCents = useMemo(() => {
    const parsed = Number(amountEuro.replace(",", "."));
    if (!Number.isFinite(parsed) || parsed <= 0) {
      return 0;
    }
    return Math.round(parsed * 100);
  }, [amountEuro]);

  return (
    <div className="create-payment-step">
      <label>
        Precio para acceder a la porra (€)
        <input
          type="number"
          min="1"
          step="0.50"
          value={amountEuro}
          onChange={(event) => setAmountEuro(event.target.value)}
          placeholder="10"
        />
      </label>
      <CheckoutButton
        mode="create"
        competitionKey={competitionKey}
        amountCents={amountCents}
        buttonLabel={`Pagar ${amountCents > 0 ? (amountCents / 100).toFixed(2) : "0.00"}€ y continuar`}
      />
    </div>
  );
}
