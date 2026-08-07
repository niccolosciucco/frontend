import { useState } from "react";
import { RACE_HISTORY } from "../data/raceHistory";

export default function HistoryPage() {
  const [selectedRaceId, setSelectedRaceId] = useState(RACE_HISTORY[0].id);
  const selectedRace =
    RACE_HISTORY.find((r) => r.id === selectedRaceId) ?? RACE_HISTORY[0];

  return (
    <div>
      <div className="mb-4">
        <div className="fs-4 fw-semibold">Storico gare</div>
        <div className="pw-mono text-body-secondary" style={{ fontSize: 13 }}>
          Archivio dei risultati della stagione
        </div>
      </div>

      <div className="row g-3">
        <div className="col-lg-4">
          <div className="pw-card">
            <div className="pw-card-title">Gare disputate</div>
            <div className="d-flex flex-column gap-1">
              {RACE_HISTORY.map((race) => {
                const isSelected = race.id === selectedRace.id;
                return (
                  <button
                    key={race.id}
                    type="button"
                    onClick={() => setSelectedRaceId(race.id)}
                    className="btn text-start p-2"
                    style={{
                      background: isSelected
                        ? "var(--pw-panel-2)"
                        : "transparent",
                      borderLeft: isSelected
                        ? "3px solid var(--pw-purple)"
                        : "3px solid transparent",
                      borderRadius: 4,
                      color: "var(--pw-text)",
                    }}
                  >
                    <div style={{ fontSize: 14, fontWeight: 500 }}>
                      {race.name}
                    </div>
                    <div
                      className="pw-mono"
                      style={{ fontSize: 11, color: "var(--pw-text-dim)" }}
                    >
                      {race.date} · {race.winnerName}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="col-lg-8 d-flex flex-column gap-3">
          <div>
            <div className="fs-5 fw-semibold">{selectedRace.name}</div>
            <div
              className="pw-mono text-body-secondary"
              style={{ fontSize: 13 }}
            >
              {selectedRace.circuit} · {selectedRace.date} · {selectedRace.laps}{" "}
              giri
            </div>
          </div>

          <div className="row g-3">
            <div className="col-4">
              <div className="pw-card">
                <div className="pw-metric-label">VINCITORE</div>
                <div className="pw-metric-value" style={{ fontSize: 16 }}>
                  {selectedRace.winnerName}
                </div>
                <div className="pw-metric-sub">{selectedRace.winnerTeam}</div>
              </div>
            </div>
            <div className="col-4">
              <div className="pw-card">
                <div className="pw-metric-label">GIRO VELOCE</div>
                <div className="pw-metric-value">
                  {selectedRace.fastestLapTime}
                </div>
                <div className="pw-metric-sub">
                  {selectedRace.fastestLapDriver}
                </div>
              </div>
            </div>
            <div className="col-4">
              <div className="pw-card">
                <div className="pw-metric-label">GIRI COMPLETATI</div>
                <div className="pw-metric-value">{selectedRace.laps}</div>
                <div className="pw-metric-sub">Distanza di gara</div>
              </div>
            </div>
          </div>

          <div className="pw-card">
            <div className="pw-card-title">Classifica finale</div>
            {selectedRace.results.map((result) => (
              <div className="pw-standings-row" key={result.driverCode}>
                <div className="pw-position">
                  {result.status === "dnf" ? "—" : result.position}
                </div>
                <div className="pw-avatar">{result.driverCode}</div>
                <div className="flex-grow-1" style={{ minWidth: 0 }}>
                  <div className="pw-driver-name">{result.driverName}</div>
                  <div className="pw-driver-team">{result.team}</div>
                </div>
                <div
                  className="pw-gap"
                  style={
                    result.status === "dnf"
                      ? { color: "var(--pw-red)", fontWeight: 600 }
                      : undefined
                  }
                >
                  {result.gapText}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
