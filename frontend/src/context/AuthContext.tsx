import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { api, ApiError, setAuthToken, type Role, type User } from "../lib/api";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, role: Role) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const USER_KEY = "smartgrade_user";
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const clearSession = () => {
    setUser(null);
    setAuthToken(null);
    localStorage.removeItem(USER_KEY);
  };

  useEffect(() => {
    const storedToken = localStorage.getItem("smartgrade_token");
    const storedUser = localStorage.getItem(USER_KEY);
    const onUnauthorized = () => clearSession();
    window.addEventListener("smartgrade:unauthorized", onUnauthorized);
    if (!storedToken || !storedUser) {
      clearSession();
      setIsLoading(false);
    } else {
      try {
        const parsed = JSON.parse(storedUser) as User;
        if (typeof parsed.id !== "number" || (parsed.role !== "STUDENT" && parsed.role !== "PROFESSOR")) throw new Error("Stored user data is invalid");
        setUser(parsed);
        api.me().then((freshUser) => {
          setUser(freshUser);
          localStorage.setItem(USER_KEY, JSON.stringify(freshUser));
        }).catch((cause) => { if (cause instanceof ApiError && cause.status === 401) clearSession(); }).finally(() => setIsLoading(false));
      } catch {
        clearSession();
        setIsLoading(false);
      }
    }
    return () => window.removeEventListener("smartgrade:unauthorized", onUnauthorized);
  }, []);

  const saveAuth = (token: string, authenticatedUser: User) => {
    setAuthToken(token);
    localStorage.setItem(USER_KEY, JSON.stringify(authenticatedUser));
    setUser(authenticatedUser);
  };

  const login = async (email: string, password: string) => {
    const result = await api.login({ email, password });
    saveAuth(result.token, result.user);
  };

  const register = async (name: string, email: string, password: string, role: Role) => {
    const result = await api.register({ name, email, password, role });
    saveAuth(result.token, result.user);
  };

  const logout = () => clearSession();

  return <AuthContext.Provider value={{ user, isLoading, login, register, logout, isAuthenticated: !!user }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
}
