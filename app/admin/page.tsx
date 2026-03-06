import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { AdminSyncButton } from "@/components/admin-sync-button";
import { competitionOptions } from "@/lib/data";
import { getUserRoleByEmail, listPorras } from "@/lib/repositories";

export default async function AdminPage() {
  const session = await auth();
  const role = await getUserRoleByEmail(session?.user?.email);

  if (!session?.user || role !== "admin") {
    redirect("/signin");
  }

  const porras = await listPorras();

  return (
    <div className="page-stack">
      <section className="card">
        <span className="eyebrow">Admin</span>
        <h1>Control operativo</h1>
        <p>
          Rol requerido: admin. La protección dura debe completarse en middleware o en cada acción sensible cuando
          conectes la base real.
        </p>
        <div className="stat-grid">
          <article className="stat-card">
            <span>Usuario actual</span>
            <strong>{session?.user?.email ?? "Invitado"}</strong>
          </article>
          <article className="stat-card">
            <span>Porras activas</span>
            <strong>{porras.length}</strong>
          </article>
          <article className="stat-card">
            <span>Acciones</span>
            <strong>Sync + cierre</strong>
          </article>
        </div>
      </section>

      <section className="card">
        <div className="section-heading">
          <span className="eyebrow">Sincronización</span>
          <h2>TheSportsDB</h2>
        </div>
        <p>
          Endpoint preparado para importar resultados y recalcular estadísticas de países. Úsalo tras configurar la
          API key y la tarea programada.
        </p>
        <div className="cta-row">
          {competitionOptions.map((competition) => (
            <AdminSyncButton key={competition.key} competitionKey={competition.key} label={competition.label} />
          ))}
        </div>
      </section>
    </div>
  );
}
