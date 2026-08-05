import { useEffect, useRef, useState } from "react";
import type { DriverState, LapTimeSample, RaceState } from "../types/race";

const INITIAL_DRIVERS: DriverState[] = [
  {
    id: "ver",
    code: "VER",
    name: "Max Verstappen",
    team: "Red Bull Racing",
    position: 1,
    gapSeconds: 0,
    lastLapSeconds: 81.045,
    tireCompound: "soft",
    tireWearPercent: 58,
    fuelPercent: 48,
    ersPercent: 74,
  },
  {
    id: "nor",
    code: "NOR",
    name: "Lando Norris",
    team: "McLaren",
    position: 2,
    gapSeconds: 2.341,
    lastLapSeconds: 81.31,
    tireCompound: "medium",
    tireWearPercent: 44,
    fuelPercent: 55,
    ersPercent: 62,
  },
  {
    id: "lec",
    code: "LEC",
    name: "Charles Leclerc",
    team: "Ferrari",
    position: 3,
    gapSeconds: 5.812,
    lastLapSeconds: 81.588,
    tireCompound: "medium",
    tireWearPercent: 66,
    fuelPercent: 39,
    ersPercent: 51,
  },
  {
    id: "ham",
    code: "HAM",
    name: "Lewis Hamilton",
    team: "Ferrari",
    position: 4,
    gapSeconds: 11.203,
    lastLapSeconds: 82.014,
    tireCompound: "hard",
    tireWearPercent: 32,
    fuelPercent: 61,
    ersPercent: 39,
  },
  {
    id: "rus",
    code: "RUS",
    name: "George Russell",
    team: "Mercedes",
    position: 5,
    gapSeconds: 14.677,
    lastLapSeconds: 82.201,
    tireCompound: "soft",
    tireWearPercent: 74,
    fuelPercent: 44,
    ersPercent: 82,
  },
];

const TOTAL_LAPS = 58;
const HISTORY_LENGTH = 12;

function randomDelta(range: number) {
  return (Math.random() - 0.5) * 2 * range;
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function buildInitialHistory(
  drivers: DriverState[],
  currentLap: number,
): LapTimeSample[] {
  const history: LapTimeSample[] = [];
  const startLap = Math.max(1, currentLap - HISTORY_LENGTH + 1);
  for (let lap = startLap; lap <= currentLap; lap++) {
    const sample: LapTimeSample = { lap };
    drivers.forEach((driver) => {
      sample[driver.code] = Number(
        (driver.lastLapSeconds + randomDelta(0.6)).toFixed(3),
      );
    });
    history.push(sample);
  }
  return history;
}

function tick(state: RaceState): RaceState {
  let nextLap = state.currentLap + 1;
  let resetLap = false;
  if (nextLap > state.totalLaps) {
    nextLap = 1;
    resetLap = true;
  }

  const nextDrivers = state.drivers
    .map((driver) => {
      const lastLapSeconds = clamp(
        driver.lastLapSeconds + randomDelta(0.35),
        78,
        86,
      );
      const gapSeconds =
        driver.position === 1
          ? 0
          : clamp(driver.gapSeconds + randomDelta(0.4), 0.2, 40);
      const tireWearPercent = resetLap
        ? Math.round(10 + Math.random() * 10)
        : clamp(driver.tireWearPercent + Math.random() * 2.5, 0, 100);
      const fuelPercent = resetLap
        ? 100
        : clamp(driver.fuelPercent - Math.random() * 1.5, 0, 100);
      const ersPercent = clamp(driver.ersPercent + randomDelta(12), 20, 95);
      return {
        ...driver,
        lastLapSeconds,
        gapSeconds,
        tireWearPercent,
        fuelPercent,
        ersPercent,
      };
    })
    .sort((a, b) => a.gapSeconds - b.gapSeconds)
    .map((driver, index) => ({ ...driver, position: index + 1 }));

  const sample: LapTimeSample = { lap: nextLap };
  nextDrivers.forEach((driver) => {
    sample[driver.code] = Number(driver.lastLapSeconds.toFixed(3));
  });
  const lapTimeHistory = [...state.lapTimeHistory, sample].slice(
    -HISTORY_LENGTH,
  );

  const fastest = nextDrivers.reduce((best, driver) =>
    driver.lastLapSeconds < best.lastLapSeconds ? driver : best,
  );

  return {
    ...state,
    currentLap: nextLap,
    drivers: nextDrivers,
    lapTimeHistory,
    fastestLapTime: fastest.lastLapSeconds,
    fastestLapDriver: fastest.name,
    topSpeed: clamp(state.topSpeed + randomDelta(4), 320, 350),
  };
}

export function useLiveRaceData(intervalMs = 3000) {
  const [state, setState] = useState<RaceState>(() => {
    const currentLap = 34;
    const drivers = INITIAL_DRIVERS;
    return {
      trackName: "Gp Monza, Autodromo Nazionale",
      currentLap,
      totalLaps: TOTAL_LAPS,
      drivers,
      lapTimeHistory: buildInitialHistory(drivers, currentLap),
      fastestLapTime: Math.min(...drivers.map((d) => d.lastLapSeconds)),
      fastestLapDriver: drivers[0].name,
      topSpeed: 341,
    };
  });

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setState((prev) => tick(prev));
    }, intervalMs);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [intervalMs]);

  return state;
}
