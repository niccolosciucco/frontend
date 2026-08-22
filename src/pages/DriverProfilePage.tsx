import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchPilotaStats } from "../api/pilotaStatsApi";
import type { PilotaStats } from "../types/pilotaStats";

export default function DriverProfilePage() {
  const { pilotaId } = useParams<{ pilotaId: string }>();
  const navigate = useNavigate();
  const [stats, setStats] = useState<PilotaStats | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!pilotaId) return;
    setLoading(true);
    setError(null);
    fetchPilotaStats(pilotaId)
      .then(setStats)
      .catch(() => setError("Impossibile caricare i dati del pilota."))
      .finally(() => setLoading(false));
  }, [pilotaId]);

  if (loading) {
    return (
      <div className="text-body-secondary" style={{ fontSize: 13 }}>
        Caricamento in corso…
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div>
        <div className="text-danger mb-3" style={{ fontSize: 14 }}>
          {error ?? "Pilota non trovato."}
        </div>
        <button
          className="btn btn-outline-secondary btn-sm"
          onClick={() => navigate(-1)}
        >
          ← Torna indietro
        </button>
      </div>
    );
  }

  return (
    <div>
      <button
        className="btn btn-outline-secondary btn-sm mb-3"
        onClick={() => navigate(-1)}
      >
        ← Torna indietro
      </button>

      <div className="d-flex align-items-center gap-3 mb-4">
        <div
          className="pw-avatar"
          style={{ width: 56, height: 56, fontSize: 18 }}
        >
          {stats.number}
        </div>
        <div>
          <div className="fs-4 fw-semibold">{stats.pilotaName}</div>
          <div className="pw-mono text-body-secondary" style={{ fontSize: 13 }}>
            {stats.teamName} · {stats.nationality}
          </div>
        </div>
      </div>

      <div className="row g-3">
        <div className="col-6 col-md-4 col-lg-2">
          <div className="pw-card">
            <div className="pw-metric-label">PUNTI</div>
            <div className="pw-metric-value">{stats.points}</div>
          </div>
        </div>
        <div className="col-6 col-md-4 col-lg-2">
          <div className="pw-card">
            <div className="pw-metric-label">GARE</div>
            <div className="pw-metric-value">{stats.races}</div>
          </div>
        </div>
        <div className="col-6 col-md-4 col-lg-2">
          <div className="pw-card">
            <div className="pw-metric-label">VITTORIE</div>
            <div className="pw-metric-value">{stats.wins}</div>
          </div>
        </div>
        <div className="col-6 col-md-4 col-lg-2">
          <div className="pw-card">
            <div className="pw-metric-label">PODI</div>
            <div className="pw-metric-value">{stats.podiums}</div>
          </div>
        </div>
        <div className="col-6 col-md-4 col-lg-2">
          <div className="pw-card">
            <div className="pw-metric-label">GIRI VELOCI</div>
            <div className="pw-metric-value">{stats.fastestLaps}</div>
          </div>
        </div>
        <div className="col-6 col-md-4 col-lg-2">
          <div className="pw-card">
            <div className="pw-metric-label">RITIRI</div>
            <div className="pw-metric-value">{stats.dnfs}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
