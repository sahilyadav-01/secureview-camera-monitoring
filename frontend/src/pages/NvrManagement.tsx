import React, { useEffect, useState } from 'react';
import { nvrService } from '../services/api';
import { Nvr } from '../types';
import { HardDrive, Server, ShieldCheck, AlertTriangle, RefreshCw, Cpu, Layers } from 'lucide-react';

export const NvrManagement: React.FC = () => {
  const [nvrs, setNvrs] = useState<Nvr[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchNvrs = async () => {
    try {
      setLoading(true);
      const res = await nvrService.getAll();
      setNvrs(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNvrs();
  }, []);

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-100 font-sans flex items-center gap-2">
            NVR & DVR Recorder Management
            <span className="text-xs font-mono bg-cyan-950 text-cyan-400 border border-cyan-800 px-2.5 py-0.5 rounded-full font-semibold">
              Storage Nodes
            </span>
          </h1>
          <p className="text-xs font-mono text-slate-400 mt-1">
            Network Video Recorders, SAN/NAS storage arrays, channel loads, and S.M.A.R.T HDD health
          </p>
        </div>

        <button
          onClick={fetchNvrs}
          className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 rounded-xl text-xs font-mono flex items-center space-x-2 transition"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh NVR Nodes</span>
        </button>
      </div>

      {/* NVR Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {nvrs.map((nvr) => {
          const usagePercent = Math.round((nvr.storageUsedTb / nvr.storageTotalTb) * 100);
          return (
            <div key={nvr.id} className="soc-card soc-card-hover p-6 rounded-3xl border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-3 bg-cyan-500/10 border border-cyan-500/30 rounded-2xl text-cyan-400">
                    <HardDrive className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-100">{nvr.name}</h3>
                    <p className="text-xs font-mono text-cyan-400">{nvr.ipAddress}</p>
                  </div>
                </div>
                <span className="text-[10px] font-mono font-bold bg-emerald-950 text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-800">
                  {nvr.status}
                </span>
              </div>

              {/* Hardware Specifications */}
              <div className="bg-slate-950/80 p-3 rounded-2xl border border-slate-800/80 text-xs font-mono space-y-1.5 text-slate-300">
                <div className="flex justify-between">
                  <span className="text-slate-500">Vendor / Model:</span>
                  <span className="font-semibold">{nvr.vendor} {nvr.model}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Serial Number:</span>
                  <span>{nvr.serialNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Firmware:</span>
                  <span className="text-cyan-400">{nvr.firmwareVersion}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Channels Active:</span>
                  <span className="text-emerald-400 font-bold">{nvr.usedChannels} / {nvr.totalChannels} Channels</span>
                </div>
              </div>

              {/* Storage Usage Bar */}
              <div className="space-y-1.5 font-mono text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-400">Disk Capacity</span>
                  <span className="text-slate-200 font-bold">
                    {nvr.storageUsedTb} TB / {nvr.storageTotalTb} TB ({usagePercent}%)
                  </span>
                </div>
                <div className="w-full bg-slate-950 h-2.5 rounded-full overflow-hidden border border-slate-800">
                  <div
                    className={`h-full rounded-full transition-all ${
                      usagePercent > 80 ? 'bg-gradient-to-r from-amber-500 to-rose-500' : 'bg-gradient-to-r from-cyan-500 to-emerald-400'
                    }`}
                    style={{ width: `${usagePercent}%` }}
                  />
                </div>
              </div>

              {/* HDD Health Badge */}
              <div className="pt-2 flex items-center justify-between text-xs font-mono border-t border-slate-800/80">
                <span className="text-slate-500">S.M.A.R.T Health:</span>
                <span
                  className={`font-bold flex items-center gap-1 ${
                    nvr.hddHealth === 'HEALTHY' ? 'text-emerald-400' : 'text-amber-400'
                  }`}
                >
                  <ShieldCheck className="w-4 h-4" /> {nvr.hddHealth}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
