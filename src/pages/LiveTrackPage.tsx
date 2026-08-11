import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useRaceData } from "../context/useRaceData";

const LOOP_DURATION_MS = 9000;
const AVERAGE_LAP_SECONDS = 81;

const TEAM_COLORS: Record<string, string> = {
  McLaren: "#FF8000",
  Mercedes: "#27F4D2",
  Ferrari: "#E8002D",
  "Red Bull Racing": "#1E41FF",
  "Aston Martin": "#00594F",
  Williams: "#00A0DE",
  Alpine: "#0090FF",
  Haas: "#B6BABD",
  "Racing Bulls": "#6C98FF",
  Audi: "#BB0A30",
  Cadillac: "#FFCB05",
};

const TRACK_PATH_D =
  "M 180,400 " +
  "L 630,400 " +
  "C 660,400 675,390 672,375 " +
  "C 668,360 648,362 652,345 " +
  "L 700,290 " +
  "C 730,255 770,260 785,220 " +
  "C 795,195 780,175 755,180 " +
  "L 760,140 " +
  "C 762,110 740,90 705,95 " +
  "L 660,100 " +
  "C 630,103 615,80 585,88 " +
  "L 300,70 " +
  "C 270,66 255,85 275,100 " +
  "C 290,112 270,125 250,115 " +
  "L 210,140 " +
  "C 150,175 110,240 120,310 " +
  "C 125,350 145,385 180,400 " +
  "Z";

export default function LiveTrackPage() {
  const race = useRaceData();
  const navigate = useNavigate();

  const pathRef = useRef<SVGPathElement>(null);
  const dotRefs = useRef<Record<string, SVGCircleElement | null>>({});
  const frameRef = useRef<number | undefined>(undefined);
  const driverCodesRef = useRef(race.drivers.map((d) => d.code));

  const offsetsRef = useRef<Record<string, number>>({});
  useEffect(() => {
    const map: Record<string, number> = {};
    race.drivers.forEach((driver) => {
      map[driver.code] = driver.gapSeconds / AVERAGE_LAP_SECONDS;
    });
    offsetsRef.current = map;
  }, [race.drivers]);

  const isFinishedRef = useRef(race.isFinished);
  useEffect(() => {
    isFinishedRef.current = race.isFinished;
  }, [race.isFinished]);

  useEffect(() => {
    const path = pathRef.current;
    if (!path) return;
    const totalLength = path.getTotalLength();
    const startTime = performance.now();

    const tick = (now: number) => {
      const elapsed = now - startTime;
      const baseProgress = (elapsed % LOOP_DURATION_MS) / LOOP_DURATION_MS;

      driverCodesRef.current.forEach((code) => {
        const dot = dotRefs.current[code];
        if (!dot) return;
        const offset = offsetsRef.current[code] ?? 0;
        const progress = (2 + baseProgress - offset) % 1;
        const point = path.getPointAtLength(progress * totalLength);
        dot.setAttribute("cx", String(point.x));
        dot.setAttribute("cy", String(point.y));
      });

      if (!isFinishedRef.current) {
        frameRef.current = requestAnimationFrame(tick);
      }
    };

    frameRef.current = requestAnimationFrame(tick);
    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, []);

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-4">
        <div>
          <div className="fs-4 fw-semibold">Live: {race.trackName}</div>
          <div className="pw-mono text-body-secondary" style={{ fontSize: 13 }}>
            Giro {race.currentLap} di {race.totalLaps}
            {race.isFinished ? " · Gara conclusa" : ""}
          </div>
        </div>
        <button
          type="button"
          className="btn btn-outline-secondary btn-sm"
          onClick={() => navigate("/dashboard")}
        >
          ← Torna alla dashboard
        </button>
      </div>

      <div className="row g-3">
        <div className="col-lg-8">
          <div className="pw-card">
            <svg
              width="100%"
              viewBox="0 0 900 450"
              role="img"
              aria-label="Posizione delle vetture sul tracciato"
            >
              <path
                ref={pathRef}
                d={TRACK_PATH_D}
                fill="none"
                stroke="var(--pw-panel-2)"
                strokeWidth={28}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d={TRACK_PATH_D}
                fill="none"
                stroke="var(--pw-border)"
                strokeWidth={1}
                strokeDasharray="6 8"
              />
              <g
                className="pw-mono"
                style={{ fontSize: 11, fill: "var(--pw-text-dim)" }}
                aria-hidden="true"
              >
                <text x="330" y="425">
                  Rettilineo Box
                </text>
                <text x="640" y="425">
                  Prima Variante
                </text>
                <text x="740" y="250">
                  Curva Grande
                </text>
                <text x="700" y="80">
                  Lesmo
                </text>
                <text x="420" y="55">
                  Serraglio
                </text>
                <text x="190" y="80">
                  Variante Ascari
                </text>
                <text x="60" y="250">
                  Parabolica
                </text>
              </g>
              {race.drivers.map((driver) => (
                <circle
                  key={driver.id}
                  ref={(el) => {
                    dotRefs.current[driver.code] = el;
                  }}
                  r={7}
                  fill={TEAM_COLORS[driver.team] ?? "var(--pw-text-dim)"}
                  stroke="var(--pw-bg)"
                  strokeWidth={1.5}
                />
              ))}
            </svg>
          </div>
        </div>

        <div className="col-lg-4">
          <div className="pw-card">
            <div className="pw-card-title">Ordine in pista</div>
            {race.drivers.map((driver) => (
              <div className="pw-standings-row" key={driver.id}>
                <div className="pw-position">{driver.position}</div>
                <span
                  aria-hidden="true"
                  style={{
                    display: "inline-block",
                    width: 10,
                    height: 10,
                    borderRadius: "50%",
                    background:
                      TEAM_COLORS[driver.team] ?? "var(--pw-text-dim)",
                    flexShrink: 0,
                  }}
                />
                <div className="flex-grow-1" style={{ minWidth: 0 }}>
                  <div className="pw-driver-name">{driver.name}</div>
                  <div className="pw-driver-team">{driver.team}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
