import { NextResponse } from "next/server";

import { getLeaderboard, getPorraBySlug, normalizeSlug } from "@/lib/repositories";

export async function GET(_: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug: rawSlug } = await params;
  const slug = normalizeSlug(rawSlug);
  const porra = await getPorraBySlug(slug);

  if (!porra) {
    return NextResponse.json({ error: "Porra no encontrada." }, { status: 404 });
  }

  const leaderboard = await getLeaderboard(slug);
  return NextResponse.json({ porra, leaderboard });
}
