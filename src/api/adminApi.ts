import { axiosClient } from "./axiosClient";
import type {
  AdminTeam,
  AdminDriver,
  AdminCircuit,
  AdminEvent,
} from "../types/admin";

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
    throw new Error(extractErrorMessage(error, "Impossibile creare il team."), {
      cause: error,
    });
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
      { cause: error },
    );
  }
}

export async function deleteTeam(id: string): Promise<void> {
  try {
    await axiosClient.delete(`/team/${id}`);
  } catch (error) {
    throw new Error(
      extractErrorMessage(error, "Impossibile eliminare il team."),
      { cause: error },
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
      { cause: error },
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
      { cause: error },
    );
  }
}

export async function deletePilota(id: string): Promise<void> {
  try {
    await axiosClient.delete(`/piloti/${id}`);
  } catch (error) {
    throw new Error(
      extractErrorMessage(error, "Impossibile eliminare il pilota."),
      { cause: error },
    );
  }
}

// --- Circuito ---

interface CircuitoResponseDto {
  id: string;
  name: string;
  location: string;
  country: string;
  lengthKm: number;
  laps: number;
  turns: number;
  drsZones: number;
  lapRecordTime: string | null;
  lapRecordDriver: string | null;
  lapRecordYear: number | null;
  description: string | null;
}

function circuitoFromDto(dto: CircuitoResponseDto): AdminCircuit {
  return {
    id: dto.id,
    name: dto.name,
    location: dto.location,
    country: dto.country,
    lengthKm: String(dto.lengthKm),
    laps: String(dto.laps),
    turns: String(dto.turns),
    drsZones: String(dto.drsZones),
    lapRecordTime: dto.lapRecordTime ?? "",
    lapRecordDriver: dto.lapRecordDriver ?? "",
    lapRecordYear: dto.lapRecordYear ? String(dto.lapRecordYear) : "",
    description: dto.description ?? "",
  };
}

function circuitoToRequest(circuito: AdminCircuit) {
  return {
    name: circuito.name,
    location: circuito.location,
    country: circuito.country,
    lengthKm: Number(circuito.lengthKm),
    laps: Number(circuito.laps),
    turns: Number(circuito.turns),
    drsZones: Number(circuito.drsZones),
    lapRecordTime: circuito.lapRecordTime || null,
    lapRecordDriver: circuito.lapRecordDriver || null,
    lapRecordYear: circuito.lapRecordYear
      ? Number(circuito.lapRecordYear)
      : null,
    description: circuito.description || null,
  };
}

export async function fetchCircuiti(): Promise<AdminCircuit[]> {
  const { data } = await axiosClient.get<CircuitoResponseDto[]>("/circuiti");
  return data.map(circuitoFromDto);
}

export async function createCircuito(
  circuito: AdminCircuit,
): Promise<AdminCircuit> {
  try {
    const { data } = await axiosClient.post<CircuitoResponseDto>(
      "/circuiti",
      circuitoToRequest(circuito),
    );
    return circuitoFromDto(data);
  } catch (error) {
    throw new Error(
      extractErrorMessage(error, "Impossibile creare il circuito."),
      { cause: error },
    );
  }
}

export async function updateCircuito(
  id: string,
  circuito: AdminCircuit,
): Promise<AdminCircuit> {
  try {
    const { data } = await axiosClient.put<CircuitoResponseDto>(
      `/circuiti/${id}`,
      circuitoToRequest(circuito),
    );
    return circuitoFromDto(data);
  } catch (error) {
    throw new Error(
      extractErrorMessage(error, "Impossibile aggiornare il circuito."),
      { cause: error },
    );
  }
}

export async function deleteCircuito(id: string): Promise<void> {
  try {
    await axiosClient.delete(`/circuiti/${id}`);
  } catch (error) {
    throw new Error(
      extractErrorMessage(error, "Impossibile eliminare il circuito."),
      { cause: error },
    );
  }
}

// --- Evento ---

interface EventoResponseDto {
  id: string;
  name: string;
  circuitoId: string;
  circuitoName: string;
  date: string;
  status: "PROGRAMMATO" | "CONCLUSO";
}

function eventoFromDto(dto: EventoResponseDto): AdminEvent {
  return {
    id: dto.id,
    name: dto.name,
    circuitId: dto.circuitoId,
    date: dto.date,
    status: dto.status === "PROGRAMMATO" ? "programmato" : "concluso",
  };
}

function eventoToRequest(evento: AdminEvent) {
  return {
    name: evento.name,
    circuitoId: evento.circuitId,
    date: evento.date,
    status: evento.status === "programmato" ? "PROGRAMMATO" : "CONCLUSO",
  };
}

export async function fetchEventi(): Promise<AdminEvent[]> {
  const { data } = await axiosClient.get<EventoResponseDto[]>("/eventi");
  return data.map(eventoFromDto);
}

export async function createEvento(evento: AdminEvent): Promise<AdminEvent> {
  try {
    const { data } = await axiosClient.post<EventoResponseDto>(
      "/eventi",
      eventoToRequest(evento),
    );
    return eventoFromDto(data);
  } catch (error) {
    throw new Error(
      extractErrorMessage(error, "Impossibile creare l'evento."),
      { cause: error },
    );
  }
}

export async function updateEvento(
  id: string,
  evento: AdminEvent,
): Promise<AdminEvent> {
  try {
    const { data } = await axiosClient.put<EventoResponseDto>(
      `/eventi/${id}`,
      eventoToRequest(evento),
    );
    return eventoFromDto(data);
  } catch (error) {
    throw new Error(
      extractErrorMessage(error, "Impossibile aggiornare l'evento."),
      { cause: error },
    );
  }
}

export async function deleteEvento(id: string): Promise<void> {
  try {
    await axiosClient.delete(`/eventi/${id}`);
  } catch (error) {
    throw new Error(
      extractErrorMessage(error, "Impossibile eliminare l'evento."),
      { cause: error },
    );
  }
}
