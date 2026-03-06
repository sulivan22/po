import { Team } from "@/lib/types";

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export function TeamAvatar({ team, size = 28 }: { team: Team; size?: number }) {
  if (team.image) {
    return <img src={team.image} alt="" width={size} height={size} />;
  }

  return (
    <span
      className="team-avatar-fallback"
      style={{ width: size, height: size, minWidth: size, fontSize: Math.max(11, Math.round(size * 0.38)) }}
      aria-hidden="true"
    >
      {getInitials(team.name)}
    </span>
  );
}
