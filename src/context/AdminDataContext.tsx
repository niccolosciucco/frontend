import {
  createContext,
  useEffect,
  useState,
  type ReactNode,
  type Dispatch,
  type SetStateAction,
} from "react";
import type {
  AdminTeam,
  AdminDriver,
  AdminCircuit,
  AdminEvent,
} from "../types/admin";
import { SEED_CIRCUITS, SEED_EVENTS } from "../data/adminSeed";
import { fetchTeams, fetchPiloti } from "../api/adminApi";

export interface AdminDataContextValue {
  teams: AdminTeam[];
  setTeams: Dispatch<SetStateAction<AdminTeam[]>>;
  drivers: AdminDriver[];
  setDrivers: Dispatch<SetStateAction<AdminDriver[]>>;
  circuits: AdminCircuit[];
  setCircuits: Dispatch<SetStateAction<AdminCircuit[]>>;
  events: AdminEvent[];
  setEvents: Dispatch<SetStateAction<AdminEvent[]>>;
  teamsLoading: boolean;
  driversLoading: boolean;
}

// eslint-disable-next-line react-refresh/only-export-components
export const AdminDataContext = createContext<
  AdminDataContextValue | undefined
>(undefined);

export function AdminDataProvider({ children }: { children: ReactNode }) {
  const [teams, setTeams] = useState<AdminTeam[]>([]);
  const [drivers, setDrivers] = useState<AdminDriver[]>([]);
  const [circuits, setCircuits] = useState<AdminCircuit[]>(SEED_CIRCUITS);
  const [events, setEvents] = useState<AdminEvent[]>(SEED_EVENTS);
  const [teamsLoading, setTeamsLoading] = useState(true);
  const [driversLoading, setDriversLoading] = useState(true);

  useEffect(() => {
    fetchTeams()
      .then(setTeams)
      .finally(() => setTeamsLoading(false));
  }, []);

  useEffect(() => {
    fetchPiloti()
      .then(setDrivers)
      .finally(() => setDriversLoading(false));
  }, []);

  const value: AdminDataContextValue = {
    teams,
    setTeams,
    drivers,
    setDrivers,
    circuits,
    setCircuits,
    events,
    setEvents,
    teamsLoading,
    driversLoading,
  };

  return (
    <AdminDataContext.Provider value={value}>
      {children}
    </AdminDataContext.Provider>
  );
}
