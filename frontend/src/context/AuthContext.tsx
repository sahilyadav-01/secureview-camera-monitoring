import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Role } from '../types';

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (token: string, user: User) => void;
  logout: () => void;
  switchRoleDemo: (role: Role) => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const DEMO_USERS: Record<Role, User> = {
  SUPER_ADMIN: {
    id: 'user-001',
    name: 'Alexander Wright',
    email: 'admin@secureview.local',
    role: 'SUPER_ADMIN',
    department: 'Global Security & Infrastructure',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
  },
  IT_ADMIN: {
    id: 'user-002',
    name: 'Sarah Chen',
    email: 'it.admin@secureview.local',
    role: 'IT_ADMIN',
    department: 'Network Operations Center',
    avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150',
  },
  SECURITY_OPERATOR: {
    id: 'user-003',
    name: 'Marcus Vance',
    email: 'operator@secureview.local',
    role: 'SECURITY_OPERATOR',
    department: 'Physical Security SOC',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
  },
  VIEWER: {
    id: 'user-004',
    name: 'Elena Rostova',
    email: 'viewer@secureview.local',
    role: 'VIEWER',
    department: 'Compliance & Audit',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150',
  },
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('secureview_user');
    return savedUser ? JSON.parse(savedUser) : DEMO_USERS.SUPER_ADMIN;
  });

  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem('secureview_token') || 'demo-jwt-token-2026';
  });

  const login = (newToken: string, newUser: User) => {
    setToken(newToken);
    setUser(newUser);
    localStorage.setItem('secureview_token', newToken);
    localStorage.setItem('secureview_user', JSON.stringify(newUser));
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('secureview_token');
    localStorage.removeItem('secureview_user');
  };

  const switchRoleDemo = (role: Role) => {
    const newUser = DEMO_USERS[role];
    setUser(newUser);
    localStorage.setItem('secureview_user', JSON.stringify(newUser));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        logout,
        switchRoleDemo,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
