import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { CheckoutButton } from "@/components/checkout-button";
import { JoinPorraLookup } from "@/components/join-porra-lookup";
import { PickWizard } from "@/components/pick-wizard";
import { getCompetitionCatalogItem } from "@/lib/competition-catalog";
import { getPorraBySlug } from "@/lib/repositories";

export default async function JoinPorraPage({
  searchParams
}: {
  searchParams: Promise<{ slug?: string; session_id?: string; checkout?: string }>;
}) {
  const session = await auth();
  if (!session?.user) {
    redirect("/signin");
  }

  const params = await searchParams;
  const slug = params.slug?.trim().toLowerCase() ?? "";
  const hasReturnedFromCheckout = Boolean(params.session_id);

  if (!slug) {
    return <JoinPorraLookup />;
  }

  const porra = await getPorraBySlug(slug);
  if (!porra) {
    return <JoinPorraLookup />;
  }
  if (porra.ownerId === session.user.email) {
    return (
      <div className="page-stack">
        <JoinPorraLookup />
        <section className="card">
          <strong>No puedes unirte a una porra que has creado.</strong>
        </section>
      </div>
    );
  }

  const competitionKey = porra.competitionKey;
  const competition = await getCompetitionCatalogItem(competitionKey);
  const teams = competition.teams;
  const amount = (porra.entryFeeCents / 100).toFixed(2);

  return (
    <div className="page-stack">
      {!hasReturnedFromCheckout ? (
        <section className="card flow-card">
          <div className="section-heading">
            <span className="eyebrow">Paso 1</span>
            <h1>Únete a una porra de {competition.label}</h1>
          </div>
          <p>
            Confirma el pago de {amount}€ para unirte a <strong>{porra.name}</strong>. Después completa tu selección.
          </p>
          <CheckoutButton
            mode="join"
            competitionKey={competitionKey}
            porraSlug={porra.slug}
            amountCents={porra.entryFeeCents}
            buttonLabel={`Pagar ${amount}€ y continuar`}
          />
        </section>
      ) : null}

      <PickWizard teams={teams} mode="join" competitionKey={competitionKey} defaultSlug={porra.slug} />
    </div>
  );
}
