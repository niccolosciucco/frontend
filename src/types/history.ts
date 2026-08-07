export interface HistoricalResult {
  position: number;
  driverCode: string;
  driverName: string;
  team: string;
  gapText: string;
  status: "finished" | "dnf";
}

export interface HistoricalRace {
  id: string;
  name: string;
  circuit: string;
  date: string;
  laps: number;
  winnerName: string;
  winnerTeam: string;
  fastestLapDriver: string;
  fastestLapTime: string;
  results: HistoricalResult[];
}
