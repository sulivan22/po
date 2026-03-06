import Link from "next/link";

import { LeaderboardRow } from "@/lib/types";

export function LeaderboardTable({ rows, porraSlug }: { rows: LeaderboardRow[]; porraSlug: string }) {
  return (
    <div className="card">
      <div className="section-heading">
        <span className="eyebrow">Ranking</span>
        <h2>Clasificación de la porra</h2>
      </div>

      <div className="leaderboard">
        {rows.map((row, index) => (
          <Link
            className="leaderboard-row"
            key={`${row.userId}-${row.displayName}`}
            href={`/porras/${porraSlug}/ranking/${encodeURIComponent(row.userId)}`}
          >
            <div>
              <p className="leaderboard-rank">#{index + 1}</p>
              <strong>{row.displayName}</strong>
            </div>
            <div>
              <p>{row.totalScore.toFixed(1)} pts</p>
              <span>{row.prizeProjection}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
