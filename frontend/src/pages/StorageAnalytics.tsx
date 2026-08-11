import React, { useEffect, useState } from 'react';
import { nvrService } from '../services/api';
import { Database, HardDrive, ShieldCheck, AlertTriangle, Calendar, RefreshCw } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

export const StorageAnalytics: React.FC = () => {
  const [summary, setSummary] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    nvrService.getStorageAnalytics().then((res) => {
      setSummary(res.summary);
      setLoading(false);
    });
  }, []);

  const data = summary
    ? [
        { name: 'Used Storage', value: summary.usedStorageTb, color: '#00F0FF' },
        { name: 'Free Storage', value: summary.freeStorageTb, color: '#10B981' },
      ]
    : [];

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-slate-100 font-sans flex items-center gap-2">
          CCTV Storage Analytics & Retention Forecaster
          <span className="text-xs font-mono bg-cyan-950 text-cyan-400 border border-cyan-800 px-2.5 py-0.5 rounded-full font-semibold">
            Retention Analytics
          </span>
        </h1>
        <p className="text-xs font-mono text-slate-400 mt-1">
          SAN/NAS Storage capacity breakdown, continuous recording retention forecasting, and S.M.A.R.T drive metrics
        </p>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="soc-card p-5 rounded-2xl border border-slate-800">
          <p className="text-xs font-mono text-slate-400 uppercase">Total Array Storage</p>
          <p className="text-2xl font-bold font-mono text-slate-100 mt-2">{summary?.totalStorageTb || 48.0} TB</p>
          <p className="text-[11px] font-mono text-slate-500 mt-1">Enterprise SAS Disk Pools</p>
        </div>
        <div className="soc-card p-5 rounded-2xl border border-slate-800">
          <p className="text-xs font-mono text-slate-400 uppercase">Used Storage</p>
          <p className="text-2xl font-bold font-mono text-cyan-400 mt-2">{summary?.usedStorageTb || 32.4} TB</p>
          <p className="text-[11px] font-mono text-slate-500 mt-1">{summary?.usagePercentage || 67.5}% Allocation</p>
        </div>
        <div className="soc-card p-5 rounded-2xl border border-slate-800">
          <p className="text-xs font-mono text-slate-400 uppercase">Free Capacity</p>
          <p className="text-2xl font-bold font-mono text-emerald-400 mt-2">{summary?.freeStorageTb || 15.6} TB</p>
          <p className="text-[11px] font-mono text-slate-500 mt-1">Available for Expansion</p>
        </div>
        <div className="soc-card p-5 rounded-2xl border border-slate-800">
          <p className="text-xs font-mono text-slate-400 uppercase">Est. Retention Days</p>
          <p className="text-2xl font-bold font-mono text-amber-400 mt-2">{summary?.estimatedDaysRemaining || 132} Days</p>
          <p className="text-[11px] font-mono text-slate-500 mt-1">At 4K H.265 Bitrate</p>
        </div>
      </div>

      {/* Visual Chart */}
      <div className="soc-card p-6 rounded-3xl border border-slate-800 space-y-4">
        <h3 className="text-sm font-mono font-bold text-slate-300 uppercase tracking-wider">
          Storage Allocation Distribution
        </h3>
        <div className="h-64 w-full flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={data} innerRadius={70} outerRadius={100} paddingAngle={5} dataKey="value">
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ backgroundColor: '#0B0F17', borderColor: '#1E293B', borderRadius: '12px' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
