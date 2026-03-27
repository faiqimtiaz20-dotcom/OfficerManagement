import { createContext, useContext, useState, ReactNode } from "react";
import { mockDb, resolveDemoLogin } from "@/data/mockDb";

export type Role =
  | "SUPER_ADMIN"
  | "ADMIN"
  | "HR"
  | "OPS"
  | "SCHEDULER"
  | "FINANCE"
  | "OFFICER";

export interface User {
  id: string;
  name: string;
  role: Role;
}

interface AuthContextValue {
  user: User | null;
  /** Demo: email or username + password (matches seed / mockDb). Returns user on success. */
  login: (identifier: string, password: string) => User | null;
  loginAs: (role: Role) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const MOCK_USERS: Record<Role, User> = mockDb.authUsers as unknown as Record<Role, User>;

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = (identifier: string, password: string): User | null => {
    const resolved = resolveDemoLogin(identifier, password);
    if (!resolved) return null;
    const next: User = {
      id: resolved.id,
      name: resolved.name,
      role: resolved.role as Role,
    };
    setUser(next);
    return next;
  };

  const loginAs = (role: Role) => {
    setUser(MOCK_USERS[role]);
  };

  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, loginAs, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
}

