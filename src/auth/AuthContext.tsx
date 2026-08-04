import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { jwtDecode } from "jwt-decode";

type Role = "ADMIN" | "USER";

interface DecodedToken {
  sub: string;
  role: Role;
  exp: number;
}

interface AuthContextValue {
  role: Role | null;
  username: string | null;
  isAuthenticated: boolean;
  login: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function decode(token: string | null): DecodedToken | null {
  if (!token) return null;
  try {
    return jwtDecode<DecodedToken>(token);
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() =>
    localStorage.getItem("pitwall_token"),
  );
  const decoded = decode(token);

  useEffect(() => {
    if (decoded && decoded.exp * 1000 < Date.now()) {
      localStorage.removeItem("pitwall_token");
      setToken(null);
    }
  }, [decoded]);

  const login = (newToken: string) => {
    localStorage.setItem("pitwall_token", newToken);
    setToken(newToken);
  };

  const logout = () => {
    localStorage.removeItem("pitwall_token");
    setToken(null);
  };

  const value: AuthContextValue = {
    role: decoded?.role ?? null,
    username: decoded?.sub ?? null,
    isAuthenticated: !!token,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth deve essere usato dentro AuthProvider");
  return ctx;
}
