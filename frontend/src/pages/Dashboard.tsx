import React, { useEffect, useState } from 'react';
import { KpiCard } from '../components/KpiCard';
import { CameraStreamCard } from '../components/CameraStreamCard';
import { CameraDetailModal } from '../components/CameraDetailModal';
import { cameraService, alertService, nvrService } from '../services/api';
import { Camera, Alert } from '../types';
import { Video, Activity, AlertTriangle, HardDrive, ShieldCheck, ArrowUpRight, Radio, RefreshCw } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const UPTIME_CHART_DATA = [
  { time: '00:00', uptime: 99.8, latency: 12 },
  { time: '04:00', uptime: 100.0, latency: 10 },
  { time: '08:00', uptime: 98.4, latency: 18 },
  { time: '12:00', uptime: 99.2, latency: 15 },
  { time: '16:00', uptime: 99.9, latency: 11 },
  { time: '20:00', uptime: 99.6, latency: 14 },
];

export const Dashboard: React.FC = () => {
  const [cameras, setCameras] = useState<Camera[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [storageSummary, setStorageSummary] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedCamera, setSelectedCamera] = useState<Camera | null>(null);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [camRes, alertRes, nvrRes] = await Promise.all([
        cameraService.getAll(),
        alertService.getAll(),
        nvrService.getStorageAnalytics(),
      ]);
      setCameras(camRes.data || []);
      setAlerts(alertRes.data || []);
      setStorageSummary(nvrRes.summary || null);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const onlineCount = cameras.filter((c) => c.status === 'ONLINE').length;
  const offlineCount = cameras.filter((c) => c.status === 'OFFLINE').length;
  const recordingCount = cameras.filter((c) => c.recordingStatus === 'RECORDING').length;
  const criticalAlertsCount = alerts.filter((a) => a.severity === 'CRITICAL' && a.status !== 'RESOLVED').length;

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-100 flex items-center gap-2 font-sans">
            Security Operations Center (SOC)
            <span className="text-xs font-mono bg-cyan-950 text-cyan-400 border border-cyan-800 px-2.5 py-0.5 rounded-full font-semibold">
              REAL-TIME FEED
            </span>
          </h1>
          <p className="text-xs font-mono text-slate-400 mt-1">Enterprise CCTV Infrastructure & Monitoring Overview</p>
        </div>

        <button
          onClick={loadDashboardData}
          className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 rounded-xl text-xs font-mono flex items-center space-x-2 transition"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Telemetry</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          title="Total Cameras"
          value={cameras.length || 64}
          subtext="Configured RTSP Endpoints"
          icon={Video}
          color="cyan"
          trend="+2 Added"
        />
        <KpiCard
          title="Online Cameras"
          value={onlineCount || 60}
          subtext={`${((onlineCount / (cameras.length || 1)) * 100).toFixed(1)}% Fleet Availability`}
          icon={ShieldCheck}
          color="green"
          trend="99.2% Uptime"
        />
        <KpiCard
          title="Offline Incidents"
          value={offlineCount || 4}
          subtext="Requires Network Dispatch"
          icon={AlertTriangle}
          color="red"
          trend="Critical"
        />
        <KpiCard
          title="Storage Utilized"
          value={`${storageSummary?.usagePercentage || 71.5}%`}
          subtext={`${storageSummary?.usedStorageTb || 14.2} TB / ${storageSummary?.totalStorageTb || 20} TB`}
          icon={HardDrive}
          color="amber"
          trend="8.5 Days Free"
        />
      </div>

      {/* Live Stream Priority Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-mono font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
            <Radio className="w-4 h-4 text-cyan-400" /> Priority Camera Feeds
          </h2>
          <a href="/live-grid" className="text-xs font-mono text-cyan-400 hover:underline flex items-center gap-1">
            View All Multi-Grid <ArrowUpRight className="w-3.5 h-3.5" />
          </a>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {cameras.slice(0, 4).map((cam) => (
            <CameraStreamCard key={cam.id} camera={cam} onSelect={(c) => setSelectedCamera(c)} />
          ))}
        </div>
      </div>

      {/* Analytics & Alerts Twin Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Network & Uptime Chart */}
        <div className="lg:col-span-2 soc-card p-5 rounded-2xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider">
                Fleet Availability & Network Latency (24h)
              </h3>
              <p className="text-[11px] font-mono text-slate-400">ICMP Response Time & Camera Handshake Health</p>
            </div>
            <span className="text-xs font-mono text-emerald-400 font-bold bg-emerald-950/60 px-2.5 py-1 rounded-full border border-emerald-800">
              Avg Ping: 14ms
            </span>
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={UPTIME_CHART_DATA}>
                <defs>
                  <linearGradient id="colorUptime" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00F0FF" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#00F0FF" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="time" stroke="#475569" fontSize={11} fontFamily="JetBrains Mono" />
                <YAxis domain={[95, 100]} stroke="#475569" fontSize={11} fontFamily="JetBrains Mono" />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0B0F17', borderColor: '#1E293B', borderRadius: '12px', fontSize: '11px' }}
                />
                <Area type="monotone" dataKey="uptime" stroke="#00F0FF" strokeWidth={2} fillOpacity={1} fill="url(#colorUptime)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Live System Alerts feed */}
        <div className="soc-card p-5 rounded-2xl border border-slate-800 space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-400" /> Active System Alerts
              </h3>
              <span className="text-[10px] font-mono bg-rose-950 text-rose-400 px-2 py-0.5 rounded-full font-bold">
                {criticalAlertsCount} CRITICAL
              </span>
            </div>

            <div className="space-y-2.5 max-h-64 overflow-y-auto pr-1">
              {alerts.slice(0, 4).map((alert) => (
                <div key={alert.id} className="p-3 bg-slate-950/80 rounded-xl border border-slate-800/80 space-y-1">
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${
                        alert.severity === 'CRITICAL' ? 'bg-rose-950 text-rose-400' : 'bg-amber-950 text-amber-400'
                      }`}
                    >
                      {alert.severity}
                    </span>
                    <span className="text-[10px] font-mono text-slate-500">
                      {new Date(alert.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-xs font-semibold text-slate-200 truncate">{alert.title}</p>
                  <p className="text-[11px] font-mono text-slate-400 line-clamp-1">{alert.description}</p>
                </div>
              ))}
            </div>
          </div>

          <a
            href="/alerts"
            className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-slate-300 text-center text-xs font-mono font-semibold rounded-xl border border-slate-800 transition block mt-3"
          >
            Manage Alert Lifecycle & Dispatch
          </a>
        </div>
      </div>

      {/* Modal Drawer */}
      <CameraDetailModal camera={selectedCamera} onClose={() => setSelectedCamera(null)} onRefresh={loadDashboardData} />
    </div>
  );
};
