import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  type TooltipProps,
} from "recharts";
import { formatLapTime, formatGap } from "../utils/format";
import { useRaceData } from "../context/useRaceData";

const CHART_LINE_COLORS = ["#9b5de5", "#8a8d95"];

function ChartTooltip({
  active,
  payload,
  label,
}: TooltipProps<number, string>) {
  if (!active || !payload?.length) return null;
  return (
    <div className="pw-chart-tooltip">
      <div>Giro {label}</div>
      {payload.map((entry) => (
        <div key={entry.dataKey} style={{ color: entry.color }}>
          {entry.dataKey}: {formatLapTime(entry.value as number)}
        </div>
      ))}
    </div>
  );
}

export default function DashboardPage() {
  const race = useRaceData();
  const topTwoDrivers = race.drivers.slice(0, 2);

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-4">
        <div>
          <div className="fs-4 fw-semibold">{race.trackName}</div>
          <div className="pw-mono text-body-secondary" style={{ fontSize: 13 }}>
            Giro {race.currentLap} di {race.totalLaps}, asciutto
          </div>
        </div>
        <div className="d-flex gap-2">
          {race.isFinished ? (
            <span
              className="pw-badge"
              style={{
                background: "rgba(236,235,228,0.12)",
                color: "var(--pw-text)",
              }}
            >
              Bandiera a scacchi
            </span>
          ) : (
            <>
              <span className="pw-badge pw-badge-green">Bandiera verde</span>
              <span className="pw-badge pw-badge-purple">Drs attivo</span>
            </>
          )}
        </div>
      </div>

      <div className="row g-3 mb-3">
        <div className="col-lg-8">
          <div className="pw-card h-100">
            <div className="pw-card-title">Classifica in tempo reale</div>
            {race.drivers.map((driver) => (
              <div className="pw-standings-row" key={driver.id}>
                <div className="pw-position">{driver.position}</div>
                <div className="pw-avatar">{driver.code}</div>
                <div className="flex-grow-1" style={{ minWidth: 0 }}>
                  <div className="pw-driver-name">{driver.name}</div>
                  <div className="pw-driver-team">{driver.team}</div>
                </div>
                <span
                  className={`pw-tire-dot ${driver.tireCompound}`}
                  aria-hidden="true"
                />
                <div className="pw-gap">{formatGap(driver.gapSeconds)}</div>
                <div className="pw-laptime">
                  {formatLapTime(driver.lastLapSeconds)}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="col-lg-4 d-flex flex-column gap-3">
          <div className="row g-3">
            <div className="col-6">
              <div className="pw-card">
                <div className="pw-metric-label">GIRO VELOCE</div>
                <div className="pw-metric-value">
                  {formatLapTime(race.fastestLapTime)}
                </div>
                <div className="pw-metric-sub">{race.fastestLapDriver}</div>
              </div>
            </div>
            <div className="col-6">
              <div className="pw-card">
                <div className="pw-metric-label">VELOCITÀ MAX</div>
                <div className="pw-metric-value">
                  {Math.round(race.topSpeed)} km/h
                </div>
                <div className="pw-metric-sub">Rettilineo principale</div>
              </div>
            </div>
          </div>

          <div className="pw-card flex-grow-1">
            <div className="pw-card-title">Andamento tempi giro</div>
            <ResponsiveContainer width="100%" height={140}>
              <LineChart data={race.lapTimeHistory}>
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
                <YAxis hide domain={["dataMin - 0.3", "dataMax + 0.3"]} />
                <Tooltip content={<ChartTooltip />} />
                {topTwoDrivers.map((driver, index) => (
                  <Line
                    key={driver.code}
                    type="monotone"
                    dataKey={driver.code}
                    stroke={CHART_LINE_COLORS[index]}
                    strokeWidth={1.5}
                    dot={false}
                    isAnimationActive={false}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
            <div
              className="d-flex gap-3 pw-mono"
              style={{ fontSize: 11, color: "var(--pw-text-dim)" }}
            >
              {topTwoDrivers.map((driver, index) => (
                <span key={driver.code}>
                  <span
                    aria-hidden="true"
                    style={{
                      display: "inline-block",
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      background: CHART_LINE_COLORS[index],
                      marginRight: 4,
                    }}
                  />
                  {driver.code}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="pw-card">
        <div className="pw-card-title">Telemetria piloti</div>
        <div className="row g-3">
          {race.drivers.map((driver) => (
            <div className="col-6 col-md-3" key={driver.id}>
              <div
                className="pw-card"
                style={{ background: "var(--pw-panel-2)" }}
              >
                <div
                  className="fw-semibold mb-2 pw-mono"
                  style={{ fontSize: 13 }}
                >
                  {driver.code}
                </div>

                <div className="pw-metric-label" style={{ marginBottom: 2 }}>
                  Usura gomme
                </div>
                <div className="pw-progress-track">
                  <div
                    className="pw-progress-fill"
                    style={{
                      width: `${driver.tireWearPercent}%`,
                      background: "var(--pw-yellow)",
                    }}
                  />
                </div>

                <div className="pw-metric-label" style={{ marginBottom: 2 }}>
                  Carburante
                </div>
                <div className="pw-progress-track">
                  <div
                    className="pw-progress-fill"
                    style={{
                      width: `${driver.fuelPercent}%`,
                      background: "var(--pw-purple)",
                    }}
                  />
                </div>

                <div className="pw-metric-label" style={{ marginBottom: 2 }}>
                  Ers
                </div>
                <div className="pw-progress-track" style={{ marginBottom: 0 }}>
                  <div
                    className="pw-progress-fill"
                    style={{
                      width: `${driver.ersPercent}%`,
                      background: "var(--pw-green)",
                    }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
