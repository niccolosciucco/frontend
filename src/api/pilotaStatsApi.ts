import { axiosClient } from "./axiosClient";
import type { PilotaStats } from "../types/pilotaStats";

export async function fetchPilotaStats(pilotaId: string): Promise<PilotaStats> {
  const { data } = await axiosClient.get<PilotaStats>(
    `/piloti/${pilotaId}/stats`,
  );
  return data;
}
