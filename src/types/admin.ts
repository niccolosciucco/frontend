export interface AdminTeam {
  id: string;
  name: string;
  base: string;
  principal: string;
  foundedYear: string;
  colorHex: string;
}

export interface AdminDriver {
  id: string;
  name: string;
  teamId: string;
  nationality: string;
  number: string;
}

export interface AdminCircuit {
  id: string;
  name: string;
  location: string;
  country: string;
  lengthKm: string;
  laps: string;
  turns: string;
  drsZones: string;
  lapRecordTime: string;
  lapRecordDriver: string;
  lapRecordYear: string;
  description: string;
}

export interface AdminEvent {
  id: string;
  name: string;
  circuitId: string;
  date: string;
  status: "programmato" | "concluso";
}
