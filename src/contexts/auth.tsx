"use client";

import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import type { ApiUser } from "@/lib/types";

interface AuthContextType {
  user: ApiUser | null;
  loading: boolean;
  isAuthenticated: boolean;
  logout: () => Promise<void>;
  login: (email: string, password: string) => Promise<ApiUser>;
  register: (name: string, email: string, password: string, role?: string) => Promise<ApiUser>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  isAuthenticated: false,
  logout: async () => {},
  login: async () => { throw new Error("not implemented"); },
  register: async () => { throw new Error("not implemented"); },
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<ApiUser | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }

    api.auth.me()
      .then((res) => setUser(res.data))
      .catch(() => {
        localStorage.removeItem("token");
        document.cookie = "token=; path=/; max-age=0";
      })
      .finally(() => setLoading(false));
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const res = await api.auth.login(email, password);
    localStorage.setItem("token", res.data.token);
    document.cookie = `token=${res.data.token}; path=/; max-age=604800; SameSite=Lax`;
    setUser(res.data.user);
    return res.data.user;
  }, []);

  const register = useCallback(async (name: string, email: string, password: string, role?: string) => {
    const res = await api.auth.register(name, email, password, role);
    localStorage.setItem("token", res.data.token);
    document.cookie = `token=${res.data.token}; path=/; max-age=604800; SameSite=Lax`;
    setUser(res.data.user);
    return res.data.user;
  }, []);

  const logout = useCallback(async () => {
    try {
      await api.auth.logout();
    } catch {
      // ignore
    }
    localStorage.removeItem("token");
    document.cookie = "token=; path=/; max-age=0";
    setUser(null);
    router.push("/login");
  }, [router]);

  return (
    <AuthContext.Provider value={{ user, loading, isAuthenticated: !!user, logout, login, register }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
