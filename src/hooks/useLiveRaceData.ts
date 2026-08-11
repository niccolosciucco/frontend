import { useEffect, useRef, useState } from "react";
import type { DriverState, LapTimeSample, RaceState } from "../types/race";

const INITIAL_DRIVERS: DriverState[] = [
  {
    id: "pia",
    code: "PIA",
    name: "Oscar Piastri",
    team: "McLaren",
    position: 5,
    gapSeconds: 4.508,
    lastLapSeconds: 81.077,
    tireCompound: "soft",
    tireWearPercent: 4,
    fuelPercent: 99,
    ersPercent: 95,
  },
  {
    id: "nor",
    code: "NOR",
    name: "Lando Norris",
    team: "McLaren",
    position: 6,
    gapSeconds: 5.734,
    lastLapSeconds: 81.194,
    tireCompound: "soft",
    tireWearPercent: 5,
    fuelPercent: 99,
    ersPercent: 93,
  },
  {
    id: "rus",
    code: "RUS",
    name: "George Russell",
    team: "Mercedes",
    position: 3,
    gapSeconds: 2.145,
    lastLapSeconds: 80.833,
    tireCompound: "medium",
    tireWearPercent: 3,
    fuelPercent: 100,
    ersPercent: 90,
  },
  {
    id: "ant",
    code: "ANT",
    name: "Kimi Antonelli",
    team: "Mercedes",
    position: 4,
    gapSeconds: 3.29,
    lastLapSeconds: 80.955,
    tireCompound: "medium",
    tireWearPercent: 3,
    fuelPercent: 100,
    ersPercent: 88,
  },
  {
    id: "lec",
    code: "LEC",
    name: "Charles Leclerc",
    team: "Ferrari",
    position: 1,
    gapSeconds: 0,
    lastLapSeconds: 80.512,
    tireCompound: "soft",
    tireWearPercent: 5,
    fuelPercent: 98,
    ersPercent: 92,
  },
  {
    id: "ham",
    code: "HAM",
    name: "Lewis Hamilton",
    team: "Ferrari",
    position: 2,
    gapSeconds: 0.812,
    lastLapSeconds: 80.601,
    tireCompound: "soft",
    tireWearPercent: 6,
    fuelPercent: 98,
    ersPercent: 89,
  },
  {
    id: "ver",
    code: "VER",
    name: "Max Verstappen",
    team: "Red Bull Racing",
    position: 7,
    gapSeconds: 6.981,
    lastLapSeconds: 81.328,
    tireCompound: "medium",
    tireWearPercent: 4,
    fuelPercent: 99,
    ersPercent: 94,
  },
  {
    id: "had",
    code: "HAD",
    name: "Isack Hadjar",
    team: "Red Bull Racing",
    position: 8,
    gapSeconds: 8.24,
    lastLapSeconds: 81.455,
    tireCompound: "medium",
    tireWearPercent: 4,
    fuelPercent: 99,
    ersPercent: 87,
  },
  {
    id: "alo",
    code: "ALO",
    name: "Fernando Alonso",
    team: "Aston Martin",
    position: 9,
    gapSeconds: 9.602,
    lastLapSeconds: 81.601,
    tireCompound: "hard",
    tireWearPercent: 2,
    fuelPercent: 100,
    ersPercent: 85,
  },
  {
    id: "str",
    code: "STR",
    name: "Lance Stroll",
    team: "Aston Martin",
    position: 10,
    gapSeconds: 10.93,
    lastLapSeconds: 81.734,
    tireCompound: "hard",
    tireWearPercent: 2,
    fuelPercent: 100,
    ersPercent: 83,
  },
  {
    id: "sai",
    code: "SAI",
    name: "Carlos Sainz",
    team: "Williams",
    position: 11,
    gapSeconds: 12.301,
    lastLapSeconds: 81.877,
    tireCompound: "medium",
    tireWearPercent: 5,
    fuelPercent: 98,
    ersPercent: 91,
  },
  {
    id: "alb",
    code: "ALB",
    name: "Alex Albon",
    team: "Williams",
    position: 12,
    gapSeconds: 13.689,
    lastLapSeconds: 82.012,
    tireCompound: "medium",
    tireWearPercent: 5,
    fuelPercent: 98,
    ersPercent: 88,
  },
  {
    id: "gas",
    code: "GAS",
    name: "Pierre Gasly",
    team: "Alpine",
    position: 13,
    gapSeconds: 15.104,
    lastLapSeconds: 82.166,
    tireCompound: "soft",
    tireWearPercent: 6,
    fuelPercent: 97,
    ersPercent: 90,
  },
  {
    id: "col",
    code: "COL",
    name: "Franco Colapinto",
    team: "Alpine",
    position: 14,
    gapSeconds: 16.522,
    lastLapSeconds: 82.301,
    tireCompound: "soft",
    tireWearPercent: 7,
    fuelPercent: 97,
    ersPercent: 86,
  },
  {
    id: "oco",
    code: "OCO",
    name: "Esteban Ocon",
    team: "Haas",
    position: 15,
    gapSeconds: 17.98,
    lastLapSeconds: 82.455,
    tireCompound: "hard",
    tireWearPercent: 3,
    fuelPercent: 99,
    ersPercent: 84,
  },
  {
    id: "bea",
    code: "BEA",
    name: "Oliver Bearman",
    team: "Haas",
    position: 16,
    gapSeconds: 19.441,
    lastLapSeconds: 82.598,
    tireCompound: "hard",
    tireWearPercent: 3,
    fuelPercent: 99,
    ersPercent: 82,
  },
  {
    id: "law",
    code: "LAW",
    name: "Liam Lawson",
    team: "Racing Bulls",
    position: 17,
    gapSeconds: 20.933,
    lastLapSeconds: 82.744,
    tireCompound: "medium",
    tireWearPercent: 5,
    fuelPercent: 98,
    ersPercent: 89,
  },
  {
    id: "lin",
    code: "LIN",
    name: "Arvid Lindblad",
    team: "Racing Bulls",
    position: 18,
    gapSeconds: 22.41,
    lastLapSeconds: 82.891,
    tireCompound: "medium",
    tireWearPercent: 6,
    fuelPercent: 98,
    ersPercent: 85,
  },
  {
    id: "hul",
    code: "HUL",
    name: "Nico Hülkenberg",
    team: "Audi",
    position: 19,
    gapSeconds: 23.94,
    lastLapSeconds: 83.045,
    tireCompound: "hard",
    tireWearPercent: 2,
    fuelPercent: 100,
    ersPercent: 80,
  },
  {
    id: "bor",
    code: "BOR",
    name: "Gabriel Bortoleto",
    team: "Audi",
    position: 20,
    gapSeconds: 25.475,
    lastLapSeconds: 83.19,
    tireCompound: "hard",
    tireWearPercent: 2,
    fuelPercent: 100,
    ersPercent: 78,
  },
  {
    id: "per",
    code: "PER",
    name: "Sergio Perez",
    team: "Cadillac",
    position: 21,
    gapSeconds: 27.033,
    lastLapSeconds: 83.348,
    tireCompound: "medium",
    tireWearPercent: 4,
    fuelPercent: 99,
    ersPercent: 83,
  },
  {
    id: "bot",
    code: "BOT",
    name: "Valtteri Bottas",
    team: "Cadillac",
    position: 22,
    gapSeconds: 28.601,
    lastLapSeconds: 83.502,
    tireCompound: "medium",
    tireWearPercent: 4,
    fuelPercent: 99,
    ersPercent: 81,
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
  if (state.currentLap >= state.totalLaps) {
    return { ...state, isFinished: true };
  }

  const nextLap = state.currentLap + 1;

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
          : clamp(driver.gapSeconds + randomDelta(0.4), 0.2, 95);
      const tireWearPercent = clamp(
        driver.tireWearPercent + Math.random() * 2.5,
        0,
        100,
      );
      const fuelPercent = clamp(
        driver.fuelPercent - Math.random() * 1.5,
        0,
        100,
      );
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

  const bestThisTick = nextDrivers.reduce((best, driver) =>
    driver.lastLapSeconds < best.lastLapSeconds ? driver : best,
  );
  const isNewRecord = bestThisTick.lastLapSeconds < state.fastestLapTime;

  return {
    ...state,
    currentLap: nextLap,
    drivers: nextDrivers,
    lapTimeHistory,
    fastestLapTime: isNewRecord
      ? bestThisTick.lastLapSeconds
      : state.fastestLapTime,
    fastestLapDriver: isNewRecord ? bestThisTick.name : state.fastestLapDriver,
    topSpeed: clamp(state.topSpeed + randomDelta(4), 320, 350),
    isFinished: nextLap >= state.totalLaps,
  };
}

export function useLiveRaceData(intervalMs = 3000) {
  const [state, setState] = useState<RaceState>(() => {
    const currentLap = 1;
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
      isFinished: false,
    };
  });

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setState((prev) => {
        if (prev.isFinished) {
          if (intervalRef.current) clearInterval(intervalRef.current);
          return prev;
        }
        return tick(prev);
      });
    }, intervalMs);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [intervalMs]);

  return state;
}
