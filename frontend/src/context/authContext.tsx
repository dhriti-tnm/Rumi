import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import * as authApi from "../apis/auth";

interface User {
  id: number;
  name: string;
  email: string;
  username: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<void>;
  register: (name: string, username: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      try {
        const token = localStorage.getItem("access_token");

        if (!token) {
          setLoading(false);
          return;
        }

        const res = await authApi.getMe() as any; // Type casting as any for quick fix if TS complains
        
        // FIX: 'res' is already the response object, not the axios wrapper
        if (res.success) { 
          setUser(res.data); 
        } else {
          localStorage.removeItem("access_token");
        }
      } catch {
        localStorage.removeItem("access_token");
      } finally {
        setLoading(false);
      }
    };

    init();
  }, []);

  const login = async (username: string, password: string) => {
    const res = await authApi.login(username, password) as any;
    
    // FIX: Access 'res.success' directly
    if (!res.success) {
      throw new Error(Array.isArray(res.error) ? res.error[0] : res.error || "Something went Wrong!");
    }

    // FIX: res.data is the LoginResponse object
    const access_token = res.data.access_token;
    const userData = res.data.user;
    const refresh_token = res.data.refresh_token;

    localStorage.setItem("access_token", access_token);
    localStorage.setItem("refresh_token", refresh_token);
    setUser(userData);
  };

  const register = async (name: string, username: string, email: string, password: string) => {
    const res = await authApi.register(name, username, email, password) as any;

    // FIX: Access 'res.success' directly
    if (!res.success) {
      throw new Error(Array.isArray(res.error) ? res.error[0] : res.error || "Something went Wrong!");
    }
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } catch {
      // ignore logout API failure
    }

    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, isAuthenticated: !!user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};