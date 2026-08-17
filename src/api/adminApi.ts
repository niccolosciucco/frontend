import { axiosClient } from "./axiosClient";
import type { AdminTeam, AdminDriver } from "../types/admin";

function extractErrorMessage(error: unknown, fallback: string): string {
  if (
    error &&
    typeof error === "object" &&
    "response" in error &&
    error.response &&
    typeof error.response === "object" &&
    "data" in error.response &&
    error.response.data &&
    typeof error.response.data === "object" &&
    "message" in error.response.data
  ) {
    return String((error.response.data as { message: unknown }).message);
  }
  return fallback;
}

// --- Team ---

interface TeamResponseDto {
  id: string;
  name: string;
  base: string;
  principal: string;
  foundedYear: number;
  colorHex: string;
}

function teamFromDto(dto: TeamResponseDto): AdminTeam {
  return { ...dto, foundedYear: String(dto.foundedYear) };
}

function teamToRequest(team: AdminTeam) {
  return {
    name: team.name,
    base: team.base,
    principal: team.principal,
    foundedYear: Number(team.foundedYear),
    colorHex: team.colorHex,
  };
}

export async function fetchTeams(): Promise<AdminTeam[]> {
  const { data } = await axiosClient.get<TeamResponseDto[]>("/team");
  return data.map(teamFromDto);
}

export async function createTeam(team: AdminTeam): Promise<AdminTeam> {
  try {
    const { data } = await axiosClient.post<TeamResponseDto>(
      "/team",
      teamToRequest(team),
    );
    return teamFromDto(data);
  } catch (error) {
    throw new Error(extractErrorMessage(error, "Impossibile creare il team."));
  }
}

export async function updateTeam(
  id: string,
  team: AdminTeam,
): Promise<AdminTeam> {
  try {
    const { data } = await axiosClient.put<TeamResponseDto>(
      `/team/${id}`,
      teamToRequest(team),
    );
    return teamFromDto(data);
  } catch (error) {
    throw new Error(
      extractErrorMessage(error, "Impossibile aggiornare il team."),
    );
  }
}

export async function deleteTeam(id: string): Promise<void> {
  try {
    await axiosClient.delete(`/team/${id}`);
  } catch (error) {
    throw new Error(
      extractErrorMessage(error, "Impossibile eliminare il team."),
    );
  }
}

// --- Pilota ---

interface PilotaResponseDto {
  id: string;
  name: string;
  teamId: string;
  teamName: string;
  nationality: string;
  number: number;
}

function pilotaFromDto(dto: PilotaResponseDto): AdminDriver {
  return {
    id: dto.id,
    name: dto.name,
    teamId: dto.teamId,
    nationality: dto.nationality,
    number: String(dto.number),
  };
}

function pilotaToRequest(pilota: AdminDriver) {
  return {
    name: pilota.name,
    teamId: pilota.teamId,
    nationality: pilota.nationality,
    number: Number(pilota.number),
  };
}

export async function fetchPiloti(): Promise<AdminDriver[]> {
  const { data } = await axiosClient.get<PilotaResponseDto[]>("/piloti");
  return data.map(pilotaFromDto);
}

export async function createPilota(pilota: AdminDriver): Promise<AdminDriver> {
  try {
    const { data } = await axiosClient.post<PilotaResponseDto>(
      "/piloti",
      pilotaToRequest(pilota),
    );
    return pilotaFromDto(data);
  } catch (error) {
    throw new Error(
      extractErrorMessage(error, "Impossibile creare il pilota."),
    );
  }
}

export async function updatePilota(
  id: string,
  pilota: AdminDriver,
): Promise<AdminDriver> {
  try {
    const { data } = await axiosClient.put<PilotaResponseDto>(
      `/piloti/${id}`,
      pilotaToRequest(pilota),
    );
    return pilotaFromDto(data);
  } catch (error) {
    throw new Error(
      extractErrorMessage(error, "Impossibile aggiornare il pilota."),
    );
  }
}

export async function deletePilota(id: string): Promise<void> {
  try {
    await axiosClient.delete(`/piloti/${id}`);
  } catch (error) {
    throw new Error(
      extractErrorMessage(error, "Impossibile eliminare il pilota."),
    );
  }
}
