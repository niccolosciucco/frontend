import { useState } from "react";
import { CIRCUITS } from "../data/circuits";

export default function CircuitsPage() {
  const [selectedCircuitId, setSelectedCircuitId] = useState(CIRCUITS[0].id);
  const selectedCircuit =
    CIRCUITS.find((c) => c.id === selectedCircuitId) ?? CIRCUITS[0];

  return (
    <div>
      <div className="mb-4">
        <div className="fs-4 fw-semibold">Circuiti</div>
        <div className="pw-mono text-body-secondary" style={{ fontSize: 13 }}>
          Schede tecniche dei tracciati del calendario
        </div>
      </div>

      <div className="row g-3 mb-4">
        {CIRCUITS.map((circuit) => {
          const isSelected = circuit.id === selectedCircuit.id;
          return (
            <div className="col-6 col-md-4 col-lg-3" key={circuit.id}>
              <button
                type="button"
                onClick={() => setSelectedCircuitId(circuit.id)}
                className="btn w-100 text-start p-3 h-100"
                style={{
                  background: isSelected
                    ? "var(--pw-panel-2)"
                    : "var(--pw-panel)",
                  border: `1px solid ${isSelected ? "var(--pw-purple)" : "var(--pw-border)"}`,
                  borderRadius: 8,
                  color: "var(--pw-text)",
                }}
              >
                <div style={{ fontSize: 14, fontWeight: 600 }}>
                  {circuit.location}
                </div>
                <div
                  className="pw-mono"
                  style={{ fontSize: 11, color: "var(--pw-text-dim)" }}
                >
                  {circuit.country}
                </div>
              </button>
            </div>
          );
        })}
      </div>

      <div className="pw-card">
        <div className="row g-4">
          <div className="col-lg-7">
            <div className="fs-5 fw-semibold">{selectedCircuit.name}</div>
            <div
              className="pw-mono text-body-secondary mb-3"
              style={{ fontSize: 13 }}
            >
              {selectedCircuit.location}, {selectedCircuit.country}
            </div>
            <p
              style={{
                fontSize: 14,
                color: "var(--pw-text-dim)",
                lineHeight: 1.6,
              }}
            >
              {selectedCircuit.description}
            </p>

            <div className="pw-metric-label mt-3">RECORD SUL GIRO</div>
            <div className="d-flex align-items-baseline gap-2">
              <span className="pw-metric-value">
                {selectedCircuit.lapRecordTime}
              </span>
              <span style={{ fontSize: 13, color: "var(--pw-text-dim)" }}>
                {selectedCircuit.lapRecordDriver} ·{" "}
                {selectedCircuit.lapRecordYear}
              </span>
            </div>
          </div>

          <div className="col-lg-5">
            <div className="row g-3">
              <div className="col-6">
                <div
                  className="pw-card"
                  style={{ background: "var(--pw-panel-2)" }}
                >
                  <div className="pw-metric-label">LUNGHEZZA</div>
                  <div className="pw-metric-value">
                    {selectedCircuit.lengthKm.toFixed(3)} km
                  </div>
                </div>
              </div>
              <div className="col-6">
                <div
                  className="pw-card"
                  style={{ background: "var(--pw-panel-2)" }}
                >
                  <div className="pw-metric-label">GIRI GARA</div>
                  <div className="pw-metric-value">{selectedCircuit.laps}</div>
                </div>
              </div>
              <div className="col-6">
                <div
                  className="pw-card"
                  style={{ background: "var(--pw-panel-2)" }}
                >
                  <div className="pw-metric-label">CURVE</div>
                  <div className="pw-metric-value">{selectedCircuit.turns}</div>
                </div>
              </div>
              <div className="col-6">
                <div
                  className="pw-card"
                  style={{ background: "var(--pw-panel-2)" }}
                >
                  <div className="pw-metric-label">ZONE DRS</div>
                  <div className="pw-metric-value">
                    {selectedCircuit.drsZones}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
