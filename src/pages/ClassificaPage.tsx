import { useEffect, useState } from "react";
import {
  fetchClassificaPiloti,
  fetchClassificaCostruttori,
} from "../api/classificaApi";
import type { PilotaStanding, TeamStanding } from "../types/classifica";
import { Link } from "react-router-dom";

export default function ClassificaPage() {
  const [piloti, setPiloti] = useState<PilotaStanding[]>([]);
  const [costruttori, setCostruttori] = useState<TeamStanding[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([fetchClassificaPiloti(), fetchClassificaCostruttori()])
      .then(([p, c]) => {
        setPiloti(p);
        setCostruttori(c);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <div className="mb-4">
        <div className="fs-4 fw-semibold">Classifica campionato</div>
        <div className="pw-mono text-body-secondary" style={{ fontSize: 13 }}>
          Punti calcolati sullo storico gare della stagione
        </div>
      </div>

      {loading ? (
        <div className="text-body-secondary" style={{ fontSize: 13 }}>
          Caricamento in corso…
        </div>
      ) : (
        <div className="row g-3">
          <div className="col-lg-6">
            <div className="pw-card">
              <div className="pw-card-title">Piloti</div>
              {piloti.map((p, index) => (
                <div className="pw-standings-row" key={p.pilotaId}>
                  <div className="pw-position">{index + 1}</div>
                  <div className="flex-grow-1" style={{ minWidth: 0 }}>
                    <Link
                      to={`/piloti/${p.pilotaId}`}
                      className="pw-driver-name text-decoration-none"
                      style={{ color: "var(--pw-text)" }}
                    >
                      {p.pilotaName}
                    </Link>
                    <div className="pw-driver-team">{p.teamName}</div>
                  </div>
                  <div className="pw-mono fw-semibold" style={{ fontSize: 14 }}>
                    {p.points} pt
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="col-lg-6">
            <div className="pw-card">
              <div className="pw-card-title">Costruttori</div>
              {costruttori.map((t, index) => (
                <div className="pw-standings-row" key={t.teamId}>
                  <div className="pw-position">{index + 1}</div>
                  <span
                    aria-hidden="true"
                    style={{
                      width: 10,
                      height: 10,
                      borderRadius: "50%",
                      background: t.colorHex,
                      flexShrink: 0,
                    }}
                  />
                  <div className="flex-grow-1" style={{ minWidth: 0 }}>
                    <div className="pw-driver-name">{t.teamName}</div>
                  </div>
                  <div className="pw-mono fw-semibold" style={{ fontSize: 14 }}>
                    {t.points} pt
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
