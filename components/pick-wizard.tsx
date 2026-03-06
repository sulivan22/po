"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { TeamAvatar } from "@/components/team-avatar";
import { useToast } from "@/components/toast-provider";
import { getCompetitionOption } from "@/lib/data";
import { CompetitionKey, Team } from "@/lib/types";

type WizardProps = {
  teams: Team[];
  mode: "create" | "join";
  competitionKey: CompetitionKey;
  defaultSlug?: string;
};

export function PickWizard({ teams, mode, competitionKey, defaultSlug = "" }: WizardProps) {
  const competition = getCompetitionOption(competitionKey);
  const requiredPickCount = competition.pickCount;
  const [displayName, setDisplayName] = useState("");
  const [porraSlug, setPorraSlug] = useState(defaultSlug);
  const [porraName, setPorraName] = useState("");
  const [selected, setSelected] = useState<string[]>([]);
  const [paymentReady, setPaymentReady] = useState(false);
  const [checkingPayment, setCheckingPayment] = useState(false);
  const [activeSessionId, setActiveSessionId] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const { pushToast } = useToast();
  const urlSessionId = searchParams.get("session_id") ?? "";
  const blockedToastShownRef = useRef(false);
  const paymentToastShownRef = useRef<string | null>(null);
  const recoveredToastShownRef = useRef(false);

  const availableTeams = useMemo(
    () => teams.filter((team) => !selected.includes(team.code)),
    [teams, selected]
  );

  useEffect(() => {
    if (!urlSessionId) {
      return;
    }

    setActiveSessionId(urlSessionId);
  }, [urlSessionId]);

  useEffect(() => {
    if (urlSessionId) {
      return;
    }

    let cancelled = false;

    async function recoverPayment() {
      const response = await fetch(
        `/api/payments/recover?mode=${mode}&competitionKey=${competitionKey}${
          mode === "join" && defaultSlug ? `&porraSlug=${encodeURIComponent(defaultSlug)}` : ""
        }`
      );
      const payload = await response.json();

      if (cancelled || !response.ok) {
        return;
      }

      setActiveSessionId(payload.stripeSessionId);

      if (!recoveredToastShownRef.current) {
        recoveredToastShownRef.current = true;
        pushToast({
          title: "Wizard recuperado. Puedes continuar con tu selección.",
          tone: "info"
        });
      }
    }

    void recoverPayment();

    return () => {
      cancelled = true;
    };
  }, [competitionKey, defaultSlug, mode, pushToast, urlSessionId]);

  useEffect(() => {
    if (activeSessionId) {
      blockedToastShownRef.current = false;
      return;
    }

    if (!blockedToastShownRef.current) {
      blockedToastShownRef.current = true;
      pushToast({
        title: "Primero completa el checkout para desbloquear el wizard.",
        tone: "warning"
      });
    }
  }, [activeSessionId, pushToast]);

  useEffect(() => {
    if (!activeSessionId) {
      setPaymentReady(false);
      return;
    }

    let cancelled = false;
    const storageKey = `wizard:${mode}:${competitionKey}:${activeSessionId}`;

    async function validatePayment() {
      setCheckingPayment(true);
      const response = await fetch(`/api/payments/${activeSessionId}`);
      const payload = await response.json();

      if (cancelled) {
        return;
      }

      setCheckingPayment(false);

      if (!response.ok) {
        setPaymentReady(false);
        pushToast({
          title: payload.error ?? "No se pudo validar el pago.",
          tone: "error"
        });
        return;
      }

      if (payload.paymentStatus !== "paid") {
        setPaymentReady(false);
        pushToast({
          title: "El pago sigue pendiente. Espera unos segundos y recarga.",
          tone: "info"
        });
        return;
      }

      if (payload.competitionKey !== competitionKey) {
        setPaymentReady(false);
        pushToast({
          title: "Ese pago pertenece a otra competición.",
          tone: "error"
        });
        return;
      }

      setPaymentReady(true);

      if (paymentToastShownRef.current !== activeSessionId) {
        paymentToastShownRef.current = activeSessionId;
        pushToast({
          title: `Pago confirmado. Ya puedes guardar tus ${requiredPickCount} selecciones.`,
          tone: "success"
        });
      }

      const draft = window.localStorage.getItem(storageKey);
      if (!draft) {
        return;
      }

      const parsed = JSON.parse(draft) as {
        displayName?: string;
        porraSlug?: string;
        porraName?: string;
        selected?: string[];
      };

      setDisplayName(parsed.displayName ?? "");
      setPorraSlug(parsed.porraSlug ?? defaultSlug);
      setPorraName(parsed.porraName ?? "");
      setSelected(parsed.selected ?? []);
    }

    void validatePayment();

    return () => {
      cancelled = true;
    };
  }, [activeSessionId, competitionKey, defaultSlug, mode, pushToast, requiredPickCount]);

  useEffect(() => {
    if (!activeSessionId || !paymentReady) {
      return;
    }

    const storageKey = `wizard:${mode}:${competitionKey}:${activeSessionId}`;
    window.localStorage.setItem(
      storageKey,
      JSON.stringify({
        displayName,
        porraSlug,
        porraName,
        selected
      })
    );
  }, [activeSessionId, competitionKey, displayName, mode, paymentReady, porraName, porraSlug, selected]);

  function notifyBlockedSelection() {
    pushToast({
      title: "Primero completa el checkout para desbloquear el wizard.",
      tone: "warning"
    });
  }

  function handlePick(teamCode: string) {
    if (!paymentReady) {
      notifyBlockedSelection();
      return;
    }

    if (selected.length >= requiredPickCount || selected.includes(teamCode)) {
      return;
    }

    if (competitionKey === "formula-1") {
      const selectedTeams = new Set(
        selected
          .map((code) => teams.find((team) => team.code === code)?.groupCode)
          .filter(Boolean)
      );
      const currentGroup = teams.find((team) => team.code === teamCode)?.groupCode;
      if (currentGroup && selectedTeams.has(currentGroup)) {
        pushToast({
          title: "En Formula 1 solo puedes elegir un piloto por escudería.",
          tone: "info"
        });
        return;
      }
    }

    setSelected((current) => [...current, teamCode]);
  }

  async function submit() {
    if (!paymentReady || !activeSessionId) {
      notifyBlockedSelection();
      return;
    }

    const missingFields: string[] = [];
    if (!displayName.trim()) {
      missingFields.push("Nombre visible");
    }
    if (mode === "create" && !porraName.trim()) {
      missingFields.push("Nombre de la porra");
    }
    if (!porraSlug.trim()) {
      missingFields.push("Nombre único de la porra");
    }
    if (selected.length !== requiredPickCount) {
      missingFields.push(`Seleccionar ${requiredPickCount} ${competitionKey === "formula-1" ? "pilotos" : "equipos"}`);
    }

    if (missingFields.length > 0) {
      pushToast({
        title: `Faltan datos: ${missingFields.join(", ")}.`,
        tone: "warning"
      });
      return;
    }

    const picks = selected.map((teamCode, index) => ({ rank: index + 1, teamCode }));
    const response = await fetch("/api/porras", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        mode,
        displayName: displayName.trim(),
        porraSlug: porraSlug.trim(),
        porraName: porraName.trim(),
        competitionKey,
        stripeSessionId: activeSessionId,
        picks
      })
    });

    const payload = await response.json();

    if (!response.ok) {
      pushToast({
        title: payload.error ?? "No se pudo guardar la selección.",
        tone: "error"
      });
      return;
    }

    pushToast({
      title: payload.message ?? "Selección guardada.",
      tone: "success"
    });

    window.localStorage.removeItem(`wizard:${mode}:${competitionKey}:${activeSessionId}`);
    router.push("/dashboard");
  }

  return (
    <section className="card">
      <div className="section-heading">
        <span className="eyebrow">Wizard</span>
        <h2>{mode === "create" ? "Crear porra" : "Unirse a una porra"}</h2>
      </div>
      {checkingPayment ? <p className="helper-text">Validando pago...</p> : null}

      <div className="form-grid">
        <label>
          Nombre visible
          <input
            value={displayName}
            onChange={(event) => setDisplayName(event.target.value)}
            placeholder="Tu nombre en el ranking"
            disabled={!paymentReady}
          />
        </label>

        {mode === "create" ? (
          <>
            <label>
              Nombre de la porra
              <input
                value={porraName}
                onChange={(event) => setPorraName(event.target.value)}
                placeholder="Liga de amigos"
                disabled={!paymentReady}
              />
            </label>
            <label>
              Nombre único
              <input
                value={porraSlug}
                onChange={(event) => setPorraSlug(event.target.value)}
                placeholder="liga-de-amigos"
                disabled={!paymentReady}
              />
            </label>
          </>
        ) : (
          <label>
            Nombre único de la porra
            <input value={porraSlug} placeholder="elite-2026" disabled />
          </label>
        )}
      </div>

      <div className="picker-layout">
        <div className="picker-panel">
          <h3>{competitionKey === "world-cup" ? "Países disponibles" : competitionKey === "formula-1" ? "Pilotos disponibles" : "Equipos disponibles"}</h3>
          <div className="team-grid">
            {availableTeams.map((team) => (
              <button
                key={team.code}
                className={`team-chip ${paymentReady ? "" : "team-chip-blocked"}`}
                onClick={() => handlePick(team.code)}
                type="button"
                disabled={!paymentReady}
              >
                {competitionKey === "formula-1" ? (
                  <span className="pilot-chip-line">
                    {team.groupImage ? <img className="constructor-badge" src={team.groupImage} alt="" width="20" height="20" /> : null}
                    <span>{team.name}</span>
                    <TeamAvatar team={team} />
                  </span>
                ) : (
                  <>
                    <TeamAvatar team={team} />
                    <span>{team.name}</span>
                  </>
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="picker-panel">
          <h3>Tus {requiredPickCount} selecciones</h3>
          <ol className="rank-list">
            {selected.map((code, index) => {
              const team = teams.find((item) => item.code === code)!;
              return (
                <li key={code}>
                  <span className="rank-pill">#{index + 1}</span>
                  {competitionKey === "formula-1" ? (
                    <span className="pilot-chip-line">
                      {team.groupImage ? <img className="constructor-badge" src={team.groupImage} alt="" width="20" height="20" /> : null}
                      <span>{team.name}</span>
                      <TeamAvatar team={team} />
                    </span>
                  ) : (
                    <>
                      <TeamAvatar team={team} />
                      <span>{team.name}</span>
                    </>
                  )}
                </li>
              );
            })}
          </ol>

          <div className="wizard-actions">
            <button
              className="ghost-button"
              type="button"
              onClick={() => setSelected((current) => current.slice(0, -1))}
              disabled={!paymentReady || selected.length === 0}
            >
              Eliminar último
            </button>
            <button
              className="primary-button"
              type="button"
              onClick={submit}
              disabled={
                !paymentReady ||
                !displayName.trim() ||
                !porraSlug.trim() ||
                (mode === "create" && !porraName.trim()) ||
                selected.length !== requiredPickCount
              }
            >
              Guardar selección
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
