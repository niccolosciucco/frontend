import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { axiosClient } from "../api/axiosClient";
import { createMockToken } from "../auth/mockAuth";
import "./LoginPage.css";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const { data } = await axiosClient.post("/auth/login", {
        email,
        password,
      });
      login(data.token);
      navigate("/dashboard");
    } catch {
      setError("Credenziali non valide. Controlla email e password.");
    } finally {
      setLoading(false);
    }
  };

  const handleMockLogin = (role: "ADMIN" | "USER") => {
    const token = createMockToken(
      role === "ADMIN" ? "admin.demo" : "viewer.demo",
      role,
    );
    login(token);
    navigate("/dashboard");
  };

  return (
    <div className="pw-login-page">
      <div className="pw-status-bar">
        <span className="pw-status-dot" aria-hidden="true" />
        SESSIONE: LIBERE 2 · PISTA ASCIUTTA · MONZA
      </div>

      <div className="pw-login-body">
        <div className="pw-telemetry-panel">
          <svg
            className="pw-track-outline"
            viewBox="0 0 400 300"
            aria-hidden="true"
          >
            <path
              d="M40,220 C40,120 120,60 200,60 C280,60 300,140 260,180 C220,220 160,200 160,150 C160,100 220,90 260,110 C320,140 340,200 300,240 C260,280 120,280 60,240 C20,215 40,220 40,220 Z"
              fill="none"
              stroke="#ecebe4"
              strokeWidth="2"
            />
          </svg>

          <div className="pw-telemetry-eyebrow">TELEMETRIA LIVE</div>
          <div className="pw-telemetry-track">Autodromo Nazionale Monza</div>

          <div className="pw-sector-row">
            <span className="pw-sector-label">Settore 1</span>
            <span className="pw-sector-time purple">0:24.881</span>
          </div>
          <div className="pw-sector-row">
            <span className="pw-sector-label">Settore 2</span>
            <span className="pw-sector-time green">0:31.204</span>
          </div>
          <div className="pw-sector-row">
            <span className="pw-sector-label">Settore 3</span>
            <span className="pw-sector-time yellow">0:19.902</span>
          </div>

          <div className="pw-lap-counter">
            <div className="pw-lap-counter-value">34/58</div>
            <div className="pw-lap-counter-label">GIRO CORRENTE</div>
          </div>
        </div>

        <div className="pw-login-panel">
          <div className="pw-login-card">
            <div className="pw-sector-strip" aria-hidden="true">
              <span className="pw-sector" />
              <span className="pw-sector" />
              <span className="pw-sector" />
            </div>

            <div className="pw-wordmark">PitWall Pro</div>
            <div className="pw-tagline">ACCESSO MURETTO BOX</div>

            {error && (
              <div className="pw-error" role="alert">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate>
              <div className="pw-field">
                <label className="pw-field-label" htmlFor="pw-email">
                  EMAIL
                </label>
                <input
                  id="pw-email"
                  type="email"
                  className="pw-field-input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  required
                />
              </div>

              <div className="pw-field">
                <label className="pw-field-label" htmlFor="pw-password">
                  CHIAVE DI ACCESSO
                </label>
                <input
                  id="pw-password"
                  type="password"
                  className="pw-field-input"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  required
                />
              </div>

              <button type="submit" className="pw-submit" disabled={loading}>
                {loading ? "Accesso in corso…" : "Accedi al muretto"}
              </button>
            </form>

            <div className="pw-dev-divider">MODALITÀ SVILUPPO</div>
            <div className="pw-dev-buttons">
              <button
                className="pw-dev-btn viewer"
                onClick={() => handleMockLogin("USER")}
              >
                Entra come viewer
              </button>
              <button
                className="pw-dev-btn admin"
                onClick={() => handleMockLogin("ADMIN")}
              >
                Entra come admin
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
