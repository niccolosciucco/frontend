import { useEffect, useState } from "react";
import { fetchPiloti } from "../api/adminApi";
import { fetchPilotaStats } from "../api/pilotaStatsApi";
import { DriverPhoto } from "../components/DriverPhoto";
import type { AdminDriver } from "../types/admin";
import type { PilotaStats } from "../types/pilotaStats";

const STAT_ROWS: { key: keyof PilotaStats; label: string }[] = [
  { key: "points", label: "Punti" },
  { key: "races", label: "Gare" },
  { key: "wins", label: "Vittorie" },
  { key: "podiums", label: "Podi" },
  { key: "fastestLaps", label: "Giri veloci" },
  { key: "dnfs", label: "Ritiri" },
];

function DriverColumn({
  drivers,
  selectedId,
  onSelect,
  stats,
  loading,
  label,
}: {
  drivers: AdminDriver[];
  selectedId: string;
  onSelect: (id: string) => void;
  stats: PilotaStats | null;
  loading: boolean;
  label: string;
}) {
  return (
    <div className="pw-card h-100">
      <label className="pw-metric-label" htmlFor={`compare-${label}`}>
        {label}
      </label>
      <select
        id={`compare-${label}`}
        className="form-select mb-3"
        value={selectedId}
        onChange={(e) => onSelect(e.target.value)}
      >
        {drivers.map((d) => (
          <option key={d.id} value={d.id}>
            {d.name}
          </option>
        ))}
      </select>

      {loading || !stats ? (
        <div
          className="text-body-secondary text-center py-4"
          style={{ fontSize: 13 }}
        >
          Caricamento…
        </div>
      ) : (
        <div className="d-flex flex-column align-items-center gap-2 py-2">
          <DriverPhoto
            name={stats.pilotaName}
            number={stats.number}
            size={72}
          />
          <div className="fw-semibold" style={{ fontSize: 16 }}>
            {stats.pilotaName}
          </div>
          <div className="pw-mono text-body-secondary" style={{ fontSize: 12 }}>
            {stats.teamName} · {stats.nationality}
          </div>
        </div>
      )}
    </div>
  );
}

export default function DriverComparePage() {
  const [drivers, setDrivers] = useState<AdminDriver[]>([]);
  const [leftId, setLeftId] = useState("");
  const [rightId, setRightId] = useState("");
  const [leftStats, setLeftStats] = useState<PilotaStats | null>(null);
  const [rightStats, setRightStats] = useState<PilotaStats | null>(null);
  const [loadingDrivers, setLoadingDrivers] = useState(true);
  const [loadingLeft, setLoadingLeft] = useState(false);
  const [loadingRight, setLoadingRight] = useState(false);

  useEffect(() => {
    fetchPiloti()
      .then((list) => {
        const sorted = [...list].sort((a, b) =>
          a.name.localeCompare(b.name, "it"),
        );
        setDrivers(sorted);
        if (sorted.length >= 2) {
          setLeftId(sorted[0].id);
          setRightId(sorted[1].id);
        }
      })
      .finally(() => setLoadingDrivers(false));
  }, []);

  useEffect(() => {
    if (!leftId) return;
    setLoadingLeft(true);
    fetchPilotaStats(leftId)
      .then(setLeftStats)
      .finally(() => setLoadingLeft(false));
  }, [leftId]);

  useEffect(() => {
    if (!rightId) return;
    setLoadingRight(true);
    fetchPilotaStats(rightId)
      .then(setRightStats)
      .finally(() => setLoadingRight(false));
  }, [rightId]);

  if (loadingDrivers) {
    return (
      <div className="text-body-secondary" style={{ fontSize: 13 }}>
        Caricamento in corso…
      </div>
    );
  }

  return (
    <div>
      <div className="mb-4">
        <div className="fs-4 fw-semibold">Confronto piloti</div>
        <div className="pw-mono text-body-secondary" style={{ fontSize: 13 }}>
          Statistiche di stagione, fianco a fianco
        </div>
      </div>

      <div className="row g-3 mb-3">
        <div className="col-md-6">
          <DriverColumn
            drivers={drivers}
            selectedId={leftId}
            onSelect={setLeftId}
            stats={leftStats}
            loading={loadingLeft}
            label="Pilota A"
          />
        </div>
        <div className="col-md-6">
          <DriverColumn
            drivers={drivers}
            selectedId={rightId}
            onSelect={setRightId}
            stats={rightStats}
            loading={loadingRight}
            label="Pilota B"
          />
        </div>
      </div>

      {leftStats && rightStats && (
        <div className="pw-card">
          <div className="pw-card-title">Statistiche a confronto</div>
          {STAT_ROWS.map((row) => {
            const leftValue = leftStats[row.key] as number;
            const rightValue = rightStats[row.key] as number;
            const leftWins = leftValue > rightValue;
            const rightWins = rightValue > leftValue;
            return (
              <div className="pw-standings-row" key={row.key}>
                <div
                  className="pw-metric-value text-end"
                  style={{
                    flex: 1,
                    color: leftWins ? "var(--pw-green)" : "var(--pw-text)",
                  }}
                >
                  {leftValue}
                </div>
                <div
                  className="pw-metric-label text-center"
                  style={{ width: 140 }}
                >
                  {row.label}
                </div>
                <div
                  className="pw-metric-value"
                  style={{
                    flex: 1,
                    color: rightWins ? "var(--pw-green)" : "var(--pw-text)",
                  }}
                >
                  {rightValue}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
