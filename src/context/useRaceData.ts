import { useContext } from "react";
import { RaceDataContext } from "./RaceDataContext";

export function useRaceData() {
  const ctx = useContext(RaceDataContext);
  if (!ctx)
    throw new Error("useRaceData deve essere usato dentro RaceDataProvider");
  return ctx;
}
