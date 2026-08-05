import { createContext, type ReactNode } from "react";
import { useLiveRaceData } from "../hooks/useLiveRaceData";
import type { RaceState } from "../types/race";

export const RaceDataContext = createContext<RaceState | undefined>(undefined);

export function RaceDataProvider({ children }: { children: ReactNode }) {
  const race = useLiveRaceData(3000);
  return (
    <RaceDataContext.Provider value={race}>{children}</RaceDataContext.Provider>
  );
}
