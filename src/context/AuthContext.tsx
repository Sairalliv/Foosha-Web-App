// ── Mock auth context ─────────────────────────────────────────────
// There's no real login yet. This just remembers which "role" you're
// viewing the app as (donor / recipient / admin) so the right layout
// and nav show up, persisted to localStorage so it survives refresh.
//
// When real auth is added (e.g. Supabase Auth), replace the guts of
// this file: `role` would come from the logged-in user's record
// instead of localStorage, and `login`/`logout` would call the real
// auth client. Everything that *consumes* useAuth() elsewhere in the
// app can stay the same.

import { createContext, useContext, useState, useEffect, type ReactNode } from "react";

export type Role = "donor" | "recipient" | "admin" | null;

interface AuthContextValue {
  role: Role;
  setRole: (role: Role) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const STORAGE_KEY = "foosha:role";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [role, setRoleState] = useState<Role>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return (stored as Role) ?? null;
  });

  useEffect(() => {
    if (role) localStorage.setItem(STORAGE_KEY, role);
    else localStorage.removeItem(STORAGE_KEY);
  }, [role]);

  const setRole = (newRole: Role) => setRoleState(newRole);
  const logout = () => setRoleState(null);

  return <AuthContext.Provider value={{ role, setRole, logout }}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
