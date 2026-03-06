import { redirect } from "next/navigation";
import Link from "next/link";

import { auth } from "@/auth";
import { DashboardWelcomeToast } from "@/components/dashboard-welcome-toast";
import { getCompetitionCatalogItem } from "@/lib/competition-catalog";
import { competitionOptions } from "@/lib/data";
import { getCompetitionLabel, getLeaderboard, getUserEntries, listPorrasByUser } from "@/lib/repositories";

export default async function DashboardPage({
  searchParams
}: {
  searchParams: Promise<{ welcome?: string }>;
}) {
  const session = await auth();
  if (!session?.user) {
    redirect("/signin");
  }

  const params = await searchParams;
  const userId = session.user.email ?? "";
  const [porras, entries] = await Promise.all([listPorrasByUser(userId), getUserEntries(userId)]);
  const leaderboardSummaries = await Promise.all(
    porras.slice(0, 2).map(async (porra) => ({
      porra,
      rows: (await getLeaderboard(porra.slug)).slice(0, 3)
    }))
  );
  const competitionLogos = new Map(
    await Promise.all(
      [...new Set(porras.map((porra) => porra.competitionKey))].map(async (competitionKey) => {
        const catalog = await getCompetitionCatalogItem(competitionKey);
        return [competitionKey, catalog.logo] as const;
      })
    )
  );
  const userTotalPoints = entries.reduce((sum, entry) => sum + entry.totalScore, 0);

  return (
    <div className="page-stack">
      <DashboardWelcomeToast enabled={params.welcome === "1"} userName={session.user.name} />
      <section className="dashboard-hero">
        <div className="card">
          <span className="eyebrow">Dashboard</span>
          <h1>{session.user.name ? `Hola, ${session.user.name}` : "Tu centro de control"}</h1>
          <p>
            Consulta tus puntos, el ranking de tus porras y accede a los flujos de creación o unión con checkout
            reutilizado.
          </p>
          <div className="cta-row">
            <Link href="/porras/new" className="primary-button">
              Crear porra
            </Link>
            <Link href="/porras/join" className="secondary-button">
              Unirse a una porra
            </Link>
          </div>
        </div>

        <div className="card metrics-card">
          <article>
            <span>Tus puntos</span>
            <strong>{userTotalPoints.toFixed(1)}</strong>
          </article>
          <article>
            <span>Porras activas</span>
            <strong>{porras.length}</strong>
          </article>
          <article>
            <span>Competiciones</span>
            <strong>{competitionOptions.length}</strong>
          </article>
        </div>
      </section>

      <section className="two-column">
        <div className="card">
          <div className="section-heading">
            <span className="eyebrow">Tus porras</span>
            {/* <h2>Ligas activas</h2> */}
          </div>
          <div className="porra-list">
            {porras.length > 0 ? (
              porras.map((porra) => (
                <Link className="porra-row" key={porra.slug} href={`/porras/${porra.slug}`}>
                  <div>
                    <strong>{porra.name}</strong>
                    <p className="porra-meta">
                      <span>
                        {porra.slug} · {getCompetitionLabel(porra.competitionKey)}
                      </span>
                      {competitionLogos.get(porra.competitionKey) ? (
                        <img
                          className="competition-inline-logo"
                          src={competitionLogos.get(porra.competitionKey)!}
                          alt={`Logo ${getCompetitionLabel(porra.competitionKey)}`}
                          width="40"
                          height="40"
                        />
                      ) : null}
                    </p>
                  </div>
                  <span>{porra.participantCount} jugadores</span>
                </Link>
              ))
            ) : (
              <div className="empty-state">
                <strong>Aún no estás unido a ninguna porra.</strong>
                <p>Crea una porra nueva o únete a una existente para empezar a sumar puntos.</p>
              </div>
            )}
          </div>
        </div>

        <div className="card">
          <div className="section-heading">
            <span className="eyebrow">Ranking</span>
            <h2>Clasificación de la porra</h2>
          </div>
          {leaderboardSummaries.length > 0 ? (
            <div className="porra-summary-list">
              {leaderboardSummaries.map(({ porra, rows }) => (
                <Link key={porra.slug} href={`/porras/${porra.slug}`} className="porra-summary-card">
                  <strong>{porra.name}</strong>
                  {rows.length > 0 ? (
                    <div className="porra-summary-rows">
                      {rows.map((row, index) => (
                        <div className="porra-summary-row" key={`${porra.slug}-${row.displayName}-${index}`}>
                          <span>
                            #{index + 1} {row.displayName}
                          </span>
                          <strong>{row.totalScore.toFixed(1)} pts</strong>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p>Sin puntuaciones todavía.</p>
                  )}
                </Link>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <strong>No hay rankings para mostrar.</strong>
              <p>Únete a una porra para ver su clasificación.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
