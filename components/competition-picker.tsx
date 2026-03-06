import Link from "next/link";

import { getCompetitionCatalog } from "@/lib/competition-catalog";
import { TeamAvatar } from "@/components/team-avatar";

export async function CompetitionPicker({
  basePath,
  title
}: {
  basePath: "/porras/new" | "/porras/join";
  title: string;
}) {
  const competitions = await getCompetitionCatalog();

  return (
    <section className="competition-modal">
      <div className="card competition-modal-card">
        <div className="section-heading">
          <span className="eyebrow">Competición</span>
          <h1>{title}</h1>
        </div>
        <div className="competition-grid">
          {competitions.map((competition) => (
            <Link
              key={competition.key}
              href={`${basePath}?competition=${competition.key}`}
              className="competition-card"
            >
              <h2 className="competition-card-title">{competition.label}</h2>
              <div className="competition-card-logo">
                {competition.logo ? (
                  <img
                    className={`competition-badge ${
                      competition.key === "champions-league" ? "competition-badge-dark" : ""
                    }`}
                    src={competition.logo}
                    alt={`Logo de ${competition.label}`}
                    width="110"
                    height="110"
                  />
                ) : (
                  <TeamAvatar
                    team={{
                      code: competition.key,
                      name: competition.label,
                      region: competition.label,
                      competitionKey: competition.key
                    }}
                    size={110}
                  />
                )}
              </div>
              <h3>{competition.subtitle}</h3>
              <p>{competition.description}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
