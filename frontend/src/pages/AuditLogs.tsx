import React, { useEffect, useState } from 'react';
import { auditService } from '../services/api';
import { AuditLog } from '../types';
import { FileText, Shield, User, Clock, Search, RefreshCw } from 'lucide-react';

export const AuditLogs: React.FC = () => {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const res = await auditService.getLogs();
      setLogs(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const filtered = logs.filter(
    (l) =>
      l.performedByName.toLowerCase().includes(search.toLowerCase()) ||
      l.action.toLowerCase().includes(search.toLowerCase()) ||
      l.details.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-100 font-sans flex items-center gap-2">
            Enterprise Security Audit Trail
            <span className="text-xs font-mono bg-cyan-950 text-cyan-400 border border-cyan-800 px-2.5 py-0.5 rounded-full font-semibold">
              Immutable Trail
            </span>
          </h1>
          <p className="text-xs font-mono text-slate-400 mt-1">
            Complete administrative audit log of camera modifications, configuration changes, user logins, and alert actions
          </p>
        </div>

        <button
          onClick={fetchLogs}
          className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 rounded-xl text-xs font-mono flex items-center space-x-2 transition"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Audit Feed</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="soc-card p-4 rounded-2xl border border-slate-800">
        <div className="relative max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
          <input
            type="text"
            placeholder="Search action, user, or details..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs font-mono text-slate-200 focus:outline-none focus:border-cyan-500"
          />
        </div>
      </div>

      {/* Log Feed Table */}
      <div className="soc-card rounded-2xl border border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-slate-950/80 border-b border-slate-800 text-slate-400 uppercase text-[10px]">
              <tr>
                <th className="p-4">Timestamp</th>
                <th className="p-4">User Operator</th>
                <th className="p-4">Action Event</th>
                <th className="p-4">Target Resource</th>
                <th className="p-4">Event Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-200">
              {filtered.map((log) => (
                <tr key={log.id} className="hover:bg-slate-900/60 transition">
                  <td className="p-4 text-slate-400">
                    {new Date(log.timestamp).toLocaleString()}
                  </td>
                  <td className="p-4">
                    <div className="font-bold text-slate-100">{log.performedByName}</div>
                    <div className="text-[10px] text-cyan-400">{log.role}</div>
                  </td>
                  <td className="p-4">
                    <span className="bg-slate-900 border border-slate-800 px-2 py-1 rounded text-cyan-400 font-semibold text-[11px]">
                      {log.action}
                    </span>
                  </td>
                  <td className="p-4 text-slate-300 font-semibold">{log.target}</td>
                  <td className="p-4 text-slate-400 max-w-xs truncate">{log.details}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
