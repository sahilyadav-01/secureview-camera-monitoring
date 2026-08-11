import React, { useEffect, useState } from 'react';
import { alertService } from '../services/api';
import { Alert } from '../types';
import { useAuth } from '../context/AuthContext';
import { Bell, AlertTriangle, ShieldCheck, CheckCircle2, UserCheck, RefreshCw } from 'lucide-react';

export const AlertCenter: React.FC = () => {
  const { user } = useAuth();
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [filterSeverity, setFilterSeverity] = useState('ALL');
  const [loading, setLoading] = useState(true);

  const loadAlerts = async () => {
    try {
      setLoading(true);
      const res = await alertService.getAll();
      setAlerts(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAlerts();
  }, []);

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      await alertService.updateStatus(id, newStatus, user?.id);
      loadAlerts();
    } catch (err: any) {
      alert(err.message || 'Status update failed');
    }
  };

  const filtered = alerts.filter((a) => filterSeverity === 'ALL' || a.severity === filterSeverity);

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-100 font-sans flex items-center gap-2">
            System Alerts & Incident Response Desk
            <span className="text-xs font-mono bg-rose-950 text-rose-400 border border-rose-800 px-2.5 py-0.5 rounded-full font-semibold">
              Lifecycle Engine
            </span>
          </h1>
          <p className="text-xs font-mono text-slate-400 mt-1">
            Real-time alert dispatch workflow (Open ➔ Acknowledged ➔ Investigating ➔ Resolved)
          </p>
        </div>

        <button
          onClick={loadAlerts}
          className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 rounded-xl text-xs font-mono flex items-center space-x-2 transition"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Alert Queue</span>
        </button>
      </div>

      {/* Severity Filter */}
      <div className="flex items-center space-x-3 text-xs font-mono">
        <span className="text-slate-400">Filter Severity:</span>
        {['ALL', 'CRITICAL', 'HIGH', 'MEDIUM', 'LOW'].map((sev) => (
          <button
            key={sev}
            onClick={() => setFilterSeverity(sev)}
            className={`px-3 py-1.5 rounded-xl border transition ${
              filterSeverity === sev
                ? 'bg-cyan-500 text-black border-cyan-400 font-bold'
                : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
            }`}
          >
            {sev}
          </button>
        ))}
      </div>

      {/* Alert List */}
      <div className="space-y-4">
        {filtered.map((alert) => {
          const isCritical = alert.severity === 'CRITICAL';
          const isResolved = alert.status === 'RESOLVED';

          return (
            <div
              key={alert.id}
              className={`soc-card p-5 rounded-2xl border transition flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                isResolved
                  ? 'border-slate-800/80 opacity-75'
                  : isCritical
                  ? 'border-rose-800/80 bg-rose-950/20'
                  : 'border-amber-800/80 bg-amber-950/20'
              }`}
            >
              <div className="flex items-start space-x-4">
                <div
                  className={`p-3 rounded-2xl border ${
                    isCritical ? 'bg-rose-950 border-rose-800 text-rose-400' : 'bg-amber-950 border-amber-800 text-amber-400'
                  }`}
                >
                  <AlertTriangle className="w-5 h-5" />
                </div>

                <div className="space-y-1">
                  <div className="flex items-center space-x-3">
                    <span
                      className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${
                        isCritical ? 'bg-rose-950 text-rose-400 border-rose-800' : 'bg-amber-950 text-amber-400 border-amber-800'
                      }`}
                    >
                      {alert.severity}
                    </span>
                    <span className="text-xs font-mono text-cyan-400 font-semibold">{alert.source} EVENT</span>
                    <span className="text-xs font-mono text-slate-500">
                      {new Date(alert.createdAt).toLocaleString()}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-slate-100">{alert.title}</h3>
                  <p className="text-xs font-mono text-slate-300">{alert.description}</p>
                </div>
              </div>

              {/* Status Workflow Action */}
              <div className="flex items-center space-x-2 shrink-0 self-end md:self-auto font-mono text-xs">
                {alert.status === 'OPEN' && (
                  <button
                    onClick={() => handleStatusChange(alert.id, 'ACKNOWLEDGED')}
                    className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-black font-bold rounded-xl transition shadow-lg shadow-amber-500/20"
                  >
                    Acknowledge
                  </button>
                )}
                {alert.status === 'ACKNOWLEDGED' && (
                  <button
                    onClick={() => handleStatusChange(alert.id, 'INVESTIGATING')}
                    className="px-3 py-1.5 bg-blue-500 hover:bg-blue-400 text-white font-bold rounded-xl transition"
                  >
                    Set Investigating
                  </button>
                )}
                {alert.status !== 'RESOLVED' && (
                  <button
                    onClick={() => handleStatusChange(alert.id, 'RESOLVED')}
                    className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-black font-bold rounded-xl transition shadow-lg shadow-emerald-500/20"
                  >
                    Resolve Alert
                  </button>
                )}
                {isResolved && (
                  <span className="flex items-center space-x-1.5 bg-emerald-950 border border-emerald-800 text-emerald-400 px-3 py-1 rounded-xl text-xs font-bold">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>RESOLVED</span>
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
