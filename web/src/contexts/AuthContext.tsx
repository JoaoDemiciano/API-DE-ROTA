import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import type { User } from '../types/api';

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const STORAGE_KEY = 'rotaperfeita_auth';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as { user: User };
        setUser(parsed.user);
      } catch {
        localStorage.removeItem(STORAGE_KEY);
      }
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    const data = await authService.login(email, password);
    setUser(data.user);
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ user: data.user, tokens: data.tokens }));
    navigate('/app');
  };

  const register = async (name: string, email: string, password: string) => {
    const data = await authService.register(name, email, password);
    setUser(data.user);
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ user: data.user, tokens: data.tokens }));
    navigate('/app');
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
