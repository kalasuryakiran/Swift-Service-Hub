import React, { createContext, useContext, useState } from 'react';
import { User, Role } from '@/types';

// Hardcoded users
const USERS: Record<string, { password: string; role: Role; displayName: string }> = {
  admin: { password: 'admin123', role: 'admin', displayName: 'Admin User' },
  john: { password: 'john123', role: 'user', displayName: 'John Doe' },
  sarah: { password: 'sarah123', role: 'user', displayName: 'Sarah Smith' },
};

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = (username: string, password: string): boolean => {
    const record = USERS[username.toLowerCase()];
    if (record && record.password === password) {
      setUser({ username, role: record.role, displayName: record.displayName });
      return true;
    }
    return false;
  };

  const logout = () => setUser(null);

  return <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
