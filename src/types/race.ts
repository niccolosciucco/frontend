export type TireCompound = "soft" | "medium" | "hard";

export interface DriverState {
  id: string;
  code: string;
  name: string;
  team: string;
  position: number;
  gapSeconds: number;
  lastLapSeconds: number;
  tireCompound: TireCompound;
  tireWearPercent: number;
  fuelPercent: number;
  ersPercent: number;
}

export interface LapTimeSample {
  lap: number;
  [driverCode: string]: number;
}

export interface RaceState {
  trackName: string;
  currentLap: number;
  totalLaps: number;
  drivers: DriverState[];
  lapTimeHistory: LapTimeSample[];
  fastestLapTime: number;
  fastestLapDriver: string;
  topSpeed: number;
}
