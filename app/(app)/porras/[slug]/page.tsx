import { notFound } from "next/navigation";

import { InviteFriendButton } from "@/components/invite-friend-button";
import { LeaderboardTable } from "@/components/leaderboard-table";
import { getCompetitionCatalogItem } from "@/lib/competition-catalog";
import { payoutRules } from "@/lib/data";
import { getCompetitionLabel, getLeaderboard, getPorraBySlug } from "@/lib/repositories";

export default async function PorraDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const porra = await getPorraBySlug(slug);

  if (!porra) {
    notFound();
  }

  const leaderboard = await getLeaderboard(slug);
  const competition = await getCompetitionCatalogItem(porra.competitionKey);
  const totalCollected = (porra.participantCount * porra.entryFeeCents) / 100;
  const platformFee = totalCollected * 0.1;
  const prizePool = totalCollected * 0.9;

  return (
    <div className="page-stack">
      <section className="card">
        <div className="detail-header">
          <div>
            <span className="eyebrow">Porra</span>
            <h1>{porra.name}</h1>
          </div>
          <InviteFriendButton
            slug={slug}
            porraName={porra.name}
            competitionLabel={getCompetitionLabel(porra.competitionKey)}
          />
        </div>
        <p className="porra-detail-meta">
          {competition.logo ? (
            <img
              className="competition-inline-logo"
              src={competition.logo}
              alt={`Logo ${getCompetitionLabel(porra.competitionKey)}`}
              width="50"
              height="50"
            />
          ) : null}
          <span>
            {getCompetitionLabel(porra.competitionKey)} · {porra.participantCount} participantes. Bote estimado:{" "}
            {prizePool.toFixed(2)}€.
          </span>
        </p>
        <p className="helper-text">
          Recaudado: {totalCollected.toFixed(2)}€ · Plataforma (10%): {platformFee.toFixed(2)}€ · Premio (90%):{" "}
          {prizePool.toFixed(2)}€
        </p>
        <div className="stat-grid">
          {payoutRules.map((rule) => (
            <article className="stat-card" key={rule.place}>
              <span>{rule.label}</span>
              <strong>{((prizePool * rule.percentage) / 100).toFixed(2)}€</strong>
            </article>
          ))}
        </div>
      </section>

      <LeaderboardTable rows={leaderboard} porraSlug={slug} />
    </div>
  );
}
