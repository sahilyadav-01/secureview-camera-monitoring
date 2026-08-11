import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Grid,
  Video,
  Activity,
  MapPin,
  HardDrive,
  Database,
  Bell,
  Wrench,
  BarChart3,
  FileText,
} from 'lucide-react';

const NAV_ITEMS = [
  { path: '/', label: 'Overview Dashboard', icon: LayoutDashboard },
  { path: '/live-grid', label: 'Live Video Grid', icon: Grid },
  { path: '/cameras', label: 'Camera Management', icon: Video },
  { path: '/health', label: 'Health Diagnostics', icon: Activity },
  { path: '/floor-plans', label: 'Floor Plans & Map', icon: MapPin },
  { path: '/nvr', label: 'NVR / DVR Management', icon: HardDrive },
  { path: '/storage', label: 'Storage Analytics', icon: Database },
  { path: '/alerts', label: 'Alerts Center', icon: Bell },
  { path: '/incidents', label: 'IT Incidents', icon: Wrench },
  { path: '/reports', label: 'Reports & Availability', icon: BarChart3 },
  { path: '/audit-logs', label: 'Audit Trail', icon: FileText },
];

export const Sidebar: React.FC = () => {
  return (
    <aside className="w-64 bg-[#0F1521] border-r border-slate-800 flex flex-col justify-between hidden md:flex shrink-0">
      <div className="py-6 px-4 space-y-1">
        <p className="px-3 text-[11px] font-mono font-semibold text-slate-500 uppercase tracking-wider mb-2">
          SOC Navigation
        </p>
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center space-x-3 px-3 py-2.5 rounded-xl font-medium text-xs transition ${
                  isActive
                    ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 shadow-lg shadow-cyan-500/5'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                }`
              }
            >
              <Icon className="w-4 h-4" />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </div>

      {/* Footer Info */}
      <div className="p-4 border-t border-slate-800/80 bg-slate-950/40">
        <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
          <span>Engine Status</span>
          <span className="text-emerald-400 font-semibold">100% HEALTHY</span>
        </div>
        <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
          <div className="bg-gradient-to-r from-cyan-500 to-emerald-400 h-full w-[96%] rounded-full"></div>
        </div>
      </div>
    </aside>
  );
};
