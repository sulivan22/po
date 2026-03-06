"use client";

import { useState } from "react";

type TabKey = "football" | "formula-1";

const tabs: Array<{ key: TabKey; label: string }> = [
  { key: "football", label: "Fútbol" },
  { key: "formula-1", label: "Formula 1" }
];

export function LandingScoringTabs() {
  const [activeTab, setActiveTab] = useState<TabKey>("football");

  return (
    <div className="landing-tabs">
      <div className="landing-tab-row" role="tablist" aria-label="Sistema de puntuación por competición">
        {tabs.map((tab) => (
          <button
            type="button"
            key={tab.key}
            role="tab"
            className={tab.key === activeTab ? "landing-tab-active" : "landing-tab"}
            onClick={() => setActiveTab(tab.key)}
            aria-selected={tab.key === activeTab}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "football" ? (
        <div className="landing-tab-panel" role="tabpanel">
          <p>Eliges 10 equipos o países y cada posición multiplica los puntos: x10, x9, x8... hasta x1.</p>
          <p>Partido ganado suma 3, empate 1, derrota 0. Cada gol a favor suma 1 y cada gol encajado resta 0.5.</p>
          <p>Bonos por avanzar: octavos +5, cuartos +15, semifinal +30, final +50, 3º puesto +15 y campeón +100.</p>
        </div>
      ) : (
        <div className="landing-tab-panel" role="tabpanel">
          <p>Eliges 11 pilotos, uno por escudería, y los ordenas con multiplicadores: x11, x10, x9... hasta x1.</p>
          <p>El Grand Prix puntúa por posición final: 25, 18, 15, 12, 10, 8, 6, 4, 2 y 1 para top 10.</p>
          <p>La suma final se calcula con el multiplicador de cada puesto elegido en tu alineación.</p>
        </div>
      )}
    </div>
  );
}
