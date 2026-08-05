import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useRaceData } from "../context/useRaceData";
import {
  simulateStrategy,
  type StrategyResult,
} from "../utils/strategySimulation";
import type { TireCompound } from "../types/race";
import { formatGap } from "../utils/format";

const COMPOUND_LABELS: Record<TireCompound, string> = {
  soft: "Soft",
  medium: "Medium",
  hard: "Hard",
};

export default function StrategyPage() {
  const race = useRaceData();
  const [selectedDriverId, setSelectedDriverId] = useState(race.drivers[0].id);
  const [pitLap, setPitLap] = useState(() =>
    Math.min(race.currentLap + 2, race.totalLaps),
  );
  const [compound, setCompound] = useState<TireCompound>("medium");
  const [result, setResult] = useState<StrategyResult | null>(null);

  useEffect(() => {
    setPitLap((prev) =>
      Math.min(Math.max(prev, race.currentLap), race.totalLaps),
    );
  }, [race.currentLap, race.totalLaps]);

  const selectedDriver =
    race.drivers.find((d) => d.id === selectedDriverId) ?? race.drivers[0];

  const handleSimulate = () => {
    setResult(simulateStrategy(selectedDriver, pitLap, compound));
  };

  return (
    <div>
      <div className="mb-4">
        <div className="fs-4 fw-semibold">Pannello strategia</div>
        <div className="pw-mono text-body-secondary" style={{ fontSize: 13 }}>
          Simula un pit stop e confronta l'effetto sul gap dal leader
        </div>
      </div>

      <div className="row g-3">
        <div className="col-lg-5">
          <div className="pw-card h-100">
            <div className="pw-card-title">Parametri simulazione</div>

            <label className="pw-metric-label" htmlFor="strategy-driver">
              Pilota
            </label>
            <select
              id="strategy-driver"
              className="form-select mb-3"
              value={selectedDriverId}
              onChange={(e) => setSelectedDriverId(e.target.value)}
            >
              {race.drivers.map((driver) => (
                <option key={driver.id} value={driver.id}>
                  {driver.name} — P{driver.position}
                </option>
              ))}
            </select>

            <div className="d-flex justify-content-between align-items-baseline mb-1">
              <label className="pw-metric-label mb-0" htmlFor="strategy-pitlap">
                Giro del pit stop
              </label>
              <span className="pw-mono" style={{ fontSize: 13 }}>
                {pitLap}
              </span>
            </div>
            <input
              id="strategy-pitlap"
              type="range"
              className="form-range mb-3"
              min={race.currentLap}
              max={race.totalLaps}
              value={pitLap}
              onChange={(e) => setPitLap(Number(e.target.value))}
            />

            <label className="pw-metric-label">Mescola al pit stop</label>
            <div className="d-flex gap-2 mb-4">
              {(Object.keys(COMPOUND_LABELS) as TireCompound[]).map((key) => (
                <button
                  key={key}
                  type="button"
                  className={`btn flex-fill ${compound === key ? "btn-primary" : "btn-outline-secondary"}`}
                  onClick={() => setCompound(key)}
                >
                  {COMPOUND_LABELS[key]}
                </button>
              ))}
            </div>

            <button
              type="button"
              className="btn btn-primary w-100"
              onClick={handleSimulate}
            >
              Simula strategia
            </button>
          </div>
        </div>

        <div className="col-lg-7 d-flex flex-column gap-3">
          <div className="row g-3">
            <div className="col-4">
              <div className="pw-card">
                <div className="pw-metric-label">POSIZIONE STIMATA</div>
                <div className="pw-metric-value">
                  {result ? `P${result.estimatedPosition}` : "—"}
                </div>
              </div>
            </div>
            <div className="col-4">
              <div className="pw-card">
                <div className="pw-metric-label">TEMPO IN PIT</div>
                <div className="pw-metric-value">
                  {result ? `${result.pitStopSeconds.toFixed(1)}s` : "—"}
                </div>
              </div>
            </div>
            <div className="col-4">
              <div className="pw-card">
                <div className="pw-metric-label">GAP DAL LEADER</div>
                <div className="pw-metric-value">
                  {result ? formatGap(result.projectedGapSeconds) : "—"}
                </div>
              </div>
            </div>
          </div>

          <div className="pw-card flex-grow-1">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <div className="pw-card-title mb-0">
                Confronto gap sui prossimi giri
              </div>
              {result && (
                <span
                  className={`pw-badge ${result.undercutSucceeded ? "pw-badge-green" : "pw-badge-purple"}`}
                >
                  {result.undercutSucceeded
                    ? "Undercut riuscito"
                    : "Conviene restare in pista"}
                </span>
              )}
            </div>

            {result ? (
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={result.comparisonLaps}>
                  <CartesianGrid
                    stroke="rgba(255,255,255,0.06)"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="lap"
                    tick={{ fontSize: 11, fill: "#8a8d95" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 11, fill: "#8a8d95" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      background: "var(--pw-panel-2)",
                      border: "1px solid var(--pw-border)",
                      borderRadius: 6,
                      fontFamily: "JetBrains Mono, monospace",
                      fontSize: 12,
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                  <Bar
                    dataKey="attuale"
                    name="Strategia attuale"
                    fill="#8a8d95"
                    radius={[3, 3, 0, 0]}
                  />
                  <Bar
                    dataKey="simulata"
                    name="Strategia simulata"
                    fill="#9b5de5"
                    radius={[3, 3, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div
                className="text-body-secondary text-center"
                style={{ fontSize: 13, padding: "40px 0" }}
              >
                Imposta i parametri e premi "Simula strategia" per vedere il
                confronto.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
