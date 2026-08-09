import type {
  AdminTeam,
  AdminDriver,
  AdminCircuit,
  AdminEvent,
} from "../types/admin";

export const SEED_TEAMS: AdminTeam[] = [
  {
    id: "redbull",
    name: "Red Bull Racing",
    base: "Milton Keynes, Regno Unito",
    principal: "Christian Horner",
    foundedYear: "2005",
    colorHex: "#1E41FF",
  },
  {
    id: "mclaren",
    name: "McLaren",
    base: "Woking, Regno Unito",
    principal: "Andrea Stella",
    foundedYear: "1963",
    colorHex: "#FF8000",
  },
  {
    id: "ferrari",
    name: "Ferrari",
    base: "Maranello, Italia",
    principal: "Frédéric Vasseur",
    foundedYear: "1929",
    colorHex: "#E8002D",
  },
  {
    id: "mercedes",
    name: "Mercedes",
    base: "Brackley, Regno Unito",
    principal: "Toto Wolff",
    foundedYear: "1970",
    colorHex: "#27F4D2",
  },
];

export const SEED_DRIVERS: AdminDriver[] = [
  {
    id: "ver",
    name: "Max Verstappen",
    teamId: "redbull",
    nationality: "NED",
    number: "1",
  },
  {
    id: "nor",
    name: "Lando Norris",
    teamId: "mclaren",
    nationality: "GBR",
    number: "4",
  },
  {
    id: "lec",
    name: "Charles Leclerc",
    teamId: "ferrari",
    nationality: "MON",
    number: "16",
  },
  {
    id: "ham",
    name: "Lewis Hamilton",
    teamId: "ferrari",
    nationality: "GBR",
    number: "44",
  },
  {
    id: "rus",
    name: "George Russell",
    teamId: "mercedes",
    nationality: "GBR",
    number: "63",
  },
];

export const SEED_CIRCUITS: AdminCircuit[] = [
  {
    id: "monza",
    name: "Autodromo Nazionale Monza",
    location: "Monza",
    country: "Italia",
    lengthKm: "5.793",
    laps: "53",
  },
  {
    id: "suzuka",
    name: "Suzuka International Racing Course",
    location: "Suzuka",
    country: "Giappone",
    lengthKm: "5.807",
    laps: "53",
  },
  {
    id: "jeddah",
    name: "Jeddah Corniche Circuit",
    location: "Gedda",
    country: "Arabia Saudita",
    lengthKm: "6.174",
    laps: "50",
  },
];

export const SEED_EVENTS: AdminEvent[] = [
  {
    id: "evt-monza",
    name: "Gp d'Italia",
    circuitId: "monza",
    date: "2026-09-06",
    status: "programmato",
  },
  {
    id: "evt-suzuka",
    name: "Gp del Giappone",
    circuitId: "suzuka",
    date: "2026-04-05",
    status: "concluso",
  },
  {
    id: "evt-jeddah",
    name: "Gp dell'Arabia Saudita",
    circuitId: "jeddah",
    date: "2026-03-08",
    status: "concluso",
  },
];
