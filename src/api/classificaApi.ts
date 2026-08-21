import { axiosClient } from "./axiosClient";
import type { PilotaStanding, TeamStanding } from "../types/classifica";

export async function fetchClassificaPiloti(): Promise<PilotaStanding[]> {
  const { data } =
    await axiosClient.get<PilotaStanding[]>("/classifica/piloti");
  return data;
}

export async function fetchClassificaCostruttori(): Promise<TeamStanding[]> {
  const { data } = await axiosClient.get<TeamStanding[]>(
    "/classifica/costruttori",
  );
  return data;
}
