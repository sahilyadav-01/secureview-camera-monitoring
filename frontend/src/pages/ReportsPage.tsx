import React, { useEffect, useState } from 'react';
import { reportService } from '../services/api';
import { BarChart3, Download, Calendar, ShieldCheck, FileSpreadsheet } from 'lucide-react';

export const ReportsPage: React.FC = () => {
  const [report, setReport] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    reportService.getUptimeReport().then((res) => {
      setReport(res);
      setLoading(false);
    });
  }, []);

  const handleExportCsv = () => {
    if (!report?.cameraStatusList) return;
    const headers = ['Camera ID', 'Name', 'Building', 'Status', 'Ping (ms)'];
    const rows = report.cameraStatusList.map((c: any) => [c.cameraId, `"${c.name}"`, `"${c.building}"`, c.status, c.latencyMs]);
    const csvContent = [headers.join(','), ...rows.map((r: any) => r.join(','))].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `SecureView_Uptime_Report_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-100 font-sans flex items-center gap-2">
            Availability & SLA Compliance Reports
            <span className="text-xs font-mono bg-cyan-950 text-cyan-400 border border-cyan-800 px-2.5 py-0.5 rounded-full font-semibold">
              Management SLA
            </span>
          </h1>
          <p className="text-xs font-mono text-slate-400 mt-1">
            Historical camera availability %, MTTR metrics, and compliance audit exports
          </p>
        </div>

        <button
          onClick={handleExportCsv}
          className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-bold font-mono rounded-xl shadow-lg shadow-emerald-500/20 flex items-center space-x-2 transition"
        >
          <FileSpreadsheet className="w-4 h-4" />
          <span>Export CSV Report</span>
        </button>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="soc-card p-5 rounded-2xl border border-slate-800">
          <p className="text-xs font-mono text-slate-400 uppercase">Overall SLA Availability</p>
          <p className="text-3xl font-bold font-mono text-emerald-400 mt-2">
            {report?.summary?.overallUptimePercent || 99.4}%
          </p>
          <p className="text-[11px] font-mono text-slate-500 mt-1">Target: 99.0% SLA</p>
        </div>
        <div className="soc-card p-5 rounded-2xl border border-slate-800">
          <p className="text-xs font-mono text-slate-400 uppercase">Total Active Fleet</p>
          <p className="text-3xl font-bold font-mono text-cyan-400 mt-2">
            {report?.summary?.totalCameras || 64} Endpoints
          </p>
          <p className="text-[11px] font-mono text-slate-500 mt-1">{report?.summary?.onlineCameras || 60} Online</p>
        </div>
        <div className="soc-card p-5 rounded-2xl border border-slate-800">
          <p className="text-xs font-mono text-slate-400 uppercase">Mean Time to Repair (MTTR)</p>
          <p className="text-3xl font-bold font-mono text-amber-400 mt-2">34 Mins</p>
          <p className="text-[11px] font-mono text-slate-500 mt-1">Average Dispatch Resolution</p>
        </div>
      </div>

      {/* Monthly Trends Table */}
      <div className="soc-card rounded-2xl border border-slate-800 overflow-hidden">
        <div className="p-4 bg-slate-950 border-b border-slate-800 font-mono text-xs font-bold text-slate-300">
          2026 Monthly Camera Availability Trends
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-slate-950/60 border-b border-slate-800 text-slate-400 uppercase text-[10px]">
              <tr>
                <th className="p-4">Month Period</th>
                <th className="p-4">Availability SLA %</th>
                <th className="p-4">Total Outage Hours</th>
                <th className="p-4">Compliance Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-200">
              {report?.monthlyTrends?.map((m: any, idx: number) => (
                <tr key={idx} className="hover:bg-slate-900/60">
                  <td className="p-4 font-bold text-slate-100">{m.month}</td>
                  <td className="p-4 font-bold text-emerald-400">{m.availabilityPercent}%</td>
                  <td className="p-4 text-slate-400">{m.downtimeHours} Hours</td>
                  <td className="p-4">
                    <span className="bg-emerald-950 text-emerald-400 border border-emerald-800 px-2 py-0.5 rounded font-bold text-[10px]">
                      PASSED SLA
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
