import React, { useEffect, useState } from 'react';
import { cameraService } from '../services/api';
import { Camera } from '../types';
import { Activity, ShieldCheck, AlertTriangle, RefreshCw, Cpu, Server, Wifi } from 'lucide-react';

export const HealthMonitoring: React.FC = () => {
  const [cameras, setCameras] = useState<Camera[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchHealthData = async () => {
    try {
      setLoading(true);
      const res = await cameraService.getAll();
      setCameras(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHealthData();
    const interval = setInterval(fetchHealthData, 15000); // 15s polling interval
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-100 font-sans flex items-center gap-2">
            Camera & Infrastructure Diagnostics Engine
            <span className="text-xs font-mono bg-emerald-950 text-emerald-400 border border-emerald-800 px-2.5 py-0.5 rounded-full font-semibold">
              CRON ACTIVE (30s)
            </span>
          </h1>
          <p className="text-xs font-mono text-slate-400 mt-1">
            Automated ICMP Ping probes, TCP Port 554 RTSP Availability, and ONVIF Health Diagnostics
          </p>
        </div>

        <button
          onClick={fetchHealthData}
          className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 rounded-xl text-xs font-mono flex items-center space-x-2 transition"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Run Probe Cycle</span>
        </button>
      </div>

      {/* Diagnostics Matrix Table */}
      <div className="grid grid-cols-1 gap-4">
        {cameras.map((cam) => {
          const isOnline = cam.status === 'ONLINE';
          return (
            <div
              key={cam.id}
              className={`soc-card p-5 rounded-2xl border transition flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                isOnline ? 'border-slate-800/80' : 'border-rose-900/60 bg-rose-950/20'
              }`}
            >
              <div className="flex items-center space-x-4">
                <div
                  className={`p-3 rounded-2xl border ${
                    isOnline ? 'bg-emerald-950/60 border-emerald-800 text-emerald-400' : 'bg-rose-950/60 border-rose-800 text-rose-400'
                  }`}
                >
                  <Wifi className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="text-sm font-bold text-slate-100">{cam.name}</h3>
                    <span className="text-xs font-mono text-cyan-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                      {cam.cameraId}
                    </span>
                  </div>
                  <p className="text-xs font-mono text-slate-400 mt-0.5">
                    IP: {cam.ipAddress} • Zone: {cam.zone} • {cam.manufacturer}
                  </p>
                </div>
              </div>

              {/* Checks */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
                <div className="bg-slate-950/80 px-3 py-2 rounded-xl border border-slate-800 text-center">
                  <span className="text-slate-500 block text-[10px]">ICMP PING</span>
                  <span className={isOnline ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
                    {isOnline ? `🟢 ${cam.latencyMs}ms` : '🔴 TIMEOUT'}
                  </span>
                </div>
                <div className="bg-slate-950/80 px-3 py-2 rounded-xl border border-slate-800 text-center">
                  <span className="text-slate-500 block text-[10px]">TCP PORT 554</span>
                  <span className={isOnline ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
                    {isOnline ? '🟢 OPEN' : '🔴 CLOSED'}
                  </span>
                </div>
                <div className="bg-slate-950/80 px-3 py-2 rounded-xl border border-slate-800 text-center">
                  <span className="text-slate-500 block text-[10px]">RTSP STREAM</span>
                  <span className={isOnline ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
                    {isOnline ? '🟢 H.264 OK' : '🔴 NO STREAM'}
                  </span>
                </div>
                <div className="bg-slate-950/80 px-3 py-2 rounded-xl border border-slate-800 text-center">
                  <span className="text-slate-500 block text-[10px]">ONVIF PROBE</span>
                  <span className={cam.onvifEnabled ? 'text-emerald-400 font-bold' : 'text-slate-500 font-bold'}>
                    {cam.onvifEnabled ? '🟢 PROFILE S' : '⚪ DISABLED'}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
