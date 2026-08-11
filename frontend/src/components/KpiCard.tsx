import React from 'react';
import { LucideIcon } from 'lucide-react';

interface KpiCardProps {
  title: string;
  value: string | number;
  subtext?: string;
  icon: LucideIcon;
  color?: 'cyan' | 'green' | 'red' | 'amber' | 'blue';
  trend?: string;
}

export const KpiCard: React.FC<KpiCardProps> = ({ title, value, subtext, icon: Icon, color = 'cyan', trend }) => {
  const colorStyles = {
    cyan: {
      bg: 'bg-cyan-500/10',
      border: 'border-cyan-500/30',
      text: 'text-cyan-400',
      glow: 'shadow-cyan-500/5',
    },
    green: {
      bg: 'bg-emerald-500/10',
      border: 'border-emerald-500/30',
      text: 'text-emerald-400',
      glow: 'shadow-emerald-500/5',
    },
    red: {
      bg: 'bg-rose-500/10',
      border: 'border-rose-500/30',
      text: 'text-rose-400',
      glow: 'shadow-rose-500/5',
    },
    amber: {
      bg: 'bg-amber-500/10',
      border: 'border-amber-500/30',
      text: 'text-amber-400',
      glow: 'shadow-amber-500/5',
    },
    blue: {
      bg: 'bg-blue-500/10',
      border: 'border-blue-500/30',
      text: 'text-blue-400',
      glow: 'shadow-blue-500/5',
    },
  }[color];

  return (
    <div className={`soc-card soc-card-hover p-5 rounded-2xl border ${colorStyles.border} ${colorStyles.glow}`}>
      <div className="flex items-center justify-between">
        <span className="text-xs font-mono font-semibold text-slate-400 uppercase tracking-wider">{title}</span>
        <div className={`p-2.5 rounded-xl ${colorStyles.bg} ${colorStyles.text}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
      <div className="mt-3 flex items-baseline justify-between">
        <span className="text-2xl font-bold font-mono text-slate-100">{value}</span>
        {trend && <span className="text-[11px] font-mono font-semibold text-cyan-400">{trend}</span>}
      </div>
      {subtext && <p className="text-[11px] font-mono text-slate-500 mt-1">{subtext}</p>}
    </div>
  );
};
