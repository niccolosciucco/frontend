import {
  createContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { Client } from "@stomp/stompjs";
import { axiosClient } from "../api/axiosClient";
import type { RaceState } from "../types/race";

export const RaceDataContext = createContext<RaceState | undefined>(undefined);

export function RaceDataProvider({ children }: { children: ReactNode }) {
  const [race, setRace] = useState<RaceState | null>(null);
  const clientRef = useRef<Client | null>(null);

  useEffect(() => {
    let isMounted = true;

    // Stato iniziale via REST: chi si collega a metà gara vede subito
    // qualcosa, invece di fissare uno schermo vuoto fino al prossimo tick.
    axiosClient.get<RaceState>("/race/state").then(({ data }) => {
      if (isMounted) setRace((prev) => prev ?? data);
    });

    // Aggiornamenti live via WebSocket: da qui in poi, ogni tick del
    // server arriva a tutti i client connessi, nello stesso istante.
    const client = new Client({
      brokerURL: import.meta.env.VITE_WS_URL,
      reconnectDelay: 5000,
      onConnect: () => {
        client.subscribe("/topic/race", (message) => {
          const nextState: RaceState = JSON.parse(message.body);
          if (isMounted) setRace(nextState);
        });
      },
      onStompError: (frame) => {
        console.error("Errore STOMP:", frame.headers["message"]);
      },
    });

    client.activate();
    clientRef.current = client;

    return () => {
      isMounted = false;
      client.deactivate();
    };
  }, []);

  if (!race) {
    return (
      <div
        className="d-flex align-items-center justify-content-center"
        style={{ minHeight: "60vh" }}
      >
        <div
          className="text-center pw-mono text-body-secondary"
          style={{ fontSize: 13 }}
        >
          Connessione alla gara in corso…
        </div>
      </div>
    );
  }

  return (
    <RaceDataContext.Provider value={race}>{children}</RaceDataContext.Provider>
  );
}
