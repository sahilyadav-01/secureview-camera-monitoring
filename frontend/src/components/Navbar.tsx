import React from 'react';
import { Shield, Bell, Activity, User, Server, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Role } from '../types';

interface NavbarProps {
  alertCount?: number;
}

export const Navbar: React.FC<NavbarProps> = ({ alertCount = 3 }) => {
  const { user, switchRoleDemo, logout } = useAuth();

  const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    switchRoleDemo(e.target.value as Role);
  };

  return (
    <header className="h-16 bg-[#131A26]/90 border-b border-slate-800 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-30">
      {/* Brand & System Mode */}
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
            <Shield className="w-6 h-6 text-black font-bold" />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-wider text-slate-100 flex items-center gap-2">
              SECURE<span className="text-cyan-400">VIEW</span>
              <span className="text-[10px] font-mono bg-cyan-950 text-cyan-400 border border-cyan-800 px-2 py-0.5 rounded-full uppercase font-semibold">
                Enterprise v2.4
              </span>
            </h1>
            <p className="text-xs text-slate-400 font-mono">IP Camera SOC Infrastructure</p>
          </div>
        </div>

        <div className="hidden md:flex items-center space-x-2 pl-6 border-l border-slate-800">
          <div className="flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-800/80 text-emerald-400 text-xs font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            <span>SOC ENGINE ONLINE</span>
          </div>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center space-x-4">
        {/* Quick Role Switcher for Demo */}
        <div className="hidden lg:flex items-center space-x-2 bg-slate-900/80 px-3 py-1.5 rounded-lg border border-slate-800">
          <Server className="w-4 h-4 text-slate-400" />
          <span className="text-xs font-mono text-slate-400">Role Mode:</span>
          <select
            value={user?.role}
            onChange={handleRoleChange}
            className="bg-slate-950 text-cyan-400 text-xs font-mono font-semibold focus:outline-none border-none py-0.5 px-1 rounded cursor-pointer"
          >
            <option value="SUPER_ADMIN">Super Admin</option>
            <option value="IT_ADMIN">IT Admin</option>
            <option value="SECURITY_OPERATOR">Security Operator</option>
            <option value="VIEWER">Viewer (Read Only)</option>
          </select>
        </div>

        {/* Alerts Badge */}
        <button className="relative p-2 text-slate-400 hover:text-cyan-400 hover:bg-slate-800/60 rounded-xl transition">
          <Bell className="w-5 h-5" />
          {alertCount > 0 && (
            <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-rose-500 text-white font-mono text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
              {alertCount}
            </span>
          )}
        </button>

        {/* User Profile */}
        <div className="flex items-center space-x-3 pl-3 border-l border-slate-800">
          {user?.avatarUrl ? (
            <img src={user.avatarUrl} alt={user.name} className="w-8 h-8 rounded-full border border-cyan-500/50" />
          ) : (
            <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-cyan-400 border border-slate-700">
              <User className="w-4 h-4" />
            </div>
          )}
          <div className="hidden sm:block text-left">
            <p className="text-xs font-semibold text-slate-200">{user?.name}</p>
            <p className="text-[10px] font-mono text-cyan-400">{user?.role.replace('_', ' ')}</p>
          </div>
        </div>
      </div>
    </header>
  );
};
