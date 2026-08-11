import React, { useEffect, useState } from 'react';
import { incidentService } from '../services/api';
import { Incident } from '../types';
import { Wrench, Clock, AlertOctagon, CheckCircle2, Plus, RefreshCw, FileText } from 'lucide-react';

export const IncidentCenter: React.FC = () => {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchIncidents = async () => {
    try {
      setLoading(true);
      const res = await incidentService.getAll();
      setIncidents(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIncidents();
  }, []);

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-100 font-sans flex items-center gap-2">
            IT Infrastructure Incident & Outage Management
            <span className="text-xs font-mono bg-cyan-950 text-cyan-400 border border-cyan-800 px-2.5 py-0.5 rounded-full font-semibold">
              ITIL Workflow
            </span>
          </h1>
          <p className="text-xs font-mono text-slate-400 mt-1">
            Hardware failures, fiber line outages, PoE switch troubleshooting, and downtime tracking
          </p>
        </div>

        <button
          onClick={fetchIncidents}
          className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 rounded-xl text-xs font-mono flex items-center space-x-2 transition"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Tickets</span>
        </button>
      </div>

      {/* Ticket List */}
      <div className="space-y-4">
        {incidents.map((inc) => (
          <div key={inc.id} className="soc-card p-6 rounded-3xl border border-slate-800 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center space-x-3">
                <span className="text-xs font-mono font-bold bg-cyan-950 text-cyan-400 px-2.5 py-1 rounded-lg border border-cyan-800">
                  {inc.ticketNumber}
                </span>
                <h3 className="text-sm font-bold text-slate-100">{inc.title}</h3>
              </div>

              <div className="flex items-center space-x-2 font-mono text-xs">
                <span className="px-2.5 py-1 bg-slate-900 border border-slate-800 rounded-lg text-slate-300 font-semibold">
                  Priority: {inc.priority}
                </span>
                <span
                  className={`px-2.5 py-1 rounded-lg font-bold ${
                    inc.status === 'RESOLVED' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-rose-950 text-rose-400 border border-rose-800'
                  }`}
                >
                  {inc.status}
                </span>
              </div>
            </div>

            <p className="text-xs font-mono text-slate-300">{inc.description}</p>

            <div className="bg-slate-950/80 p-4 rounded-2xl border border-slate-800 text-xs font-mono space-y-2">
              <div>
                <span className="text-slate-500 font-semibold">Root Cause:</span>{' '}
                <span className="text-cyan-400">{inc.rootCause || 'Under investigation'}</span>
              </div>
              <div>
                <span className="text-slate-500 font-semibold">Troubleshooting Steps:</span>{' '}
                <span className="text-slate-300">{inc.troubleshooting || 'Dispatched technician to site'}</span>
              </div>
              <div className="flex items-center space-x-4 pt-1 text-[11px] text-slate-400">
                <span className="flex items-center space-x-1">
                  <Clock className="w-3.5 h-3.5 text-amber-400" />
                  <span>Downtime Duration: {inc.downtimeMinutes} Mins</span>
                </span>
                <span>Logged: {new Date(inc.createdAt).toLocaleString()}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
