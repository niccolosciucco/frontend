import type { DriverState, TireCompound } from "../types/race";

export interface StrategyResult {
  estimatedPosition: number;
  pitStopSeconds: number;
  projectedGapSeconds: number;
  undercutSucceeded: boolean;
  comparisonLaps: { lap: number; attuale: number; simulata: number }[];
}

const PIT_STOP_BASE_SECONDS = 2.3;
const COMPOUND_PIT_PENALTY: Record<TireCompound, number> = {
  soft: 0,
  medium: 0.1,
  hard: 0.2,
};
const COMPOUND_UNDERCUT_GAIN: Record<TireCompound, number> = {
  soft: 0.5,
  medium: 0.35,
  hard: 0.2,
};
const DEGRADATION_FACTOR = 0.4;
const LAPS_TO_PROJECT = 6;

export function simulateStrategy(
  driver: DriverState,
  pitLap: number,
  compound: TireCompound,
): StrategyResult {
  const pitStopSeconds = Number(
    (PIT_STOP_BASE_SECONDS + COMPOUND_PIT_PENALTY[compound]).toFixed(1),
  );
  const degradationPerLap = (driver.tireWearPercent / 100) * DEGRADATION_FACTOR;
  const undercutGainPerLap = COMPOUND_UNDERCUT_GAIN[compound];

  const comparisonLaps: StrategyResult["comparisonLaps"] = [];
  let attualeGap = driver.gapSeconds;
  let simulataGap = driver.gapSeconds;

  for (let i = 1; i <= LAPS_TO_PROJECT; i++) {
    const lap = pitLap + i;
    attualeGap += degradationPerLap;
    if (i === 1) simulataGap += pitStopSeconds;
    simulataGap = Math.max(0, simulataGap - undercutGainPerLap);

    comparisonLaps.push({
      lap,
      attuale: Number(attualeGap.toFixed(2)),
      simulata: Number(simulataGap.toFixed(2)),
    });
  }

  const finalAttuale = comparisonLaps[comparisonLaps.length - 1].attuale;
  const finalSimulata = comparisonLaps[comparisonLaps.length - 1].simulata;
  const undercutSucceeded = finalSimulata < finalAttuale;

  return {
    estimatedPosition: undercutSucceeded
      ? Math.max(1, driver.position - 1)
      : driver.position,
    pitStopSeconds,
    projectedGapSeconds: finalSimulata,
    undercutSucceeded,
    comparisonLaps,
  };
}
