import React, { useState } from 'react';
import { Camera } from '../types';
import { cameraService } from '../services/api';
import { X, Activity, Server, Radio, ShieldCheck, AlertTriangle, RefreshCw, Cpu, HardDrive } from 'lucide-react';

interface CameraDetailModalProps {
  camera: Camera | null;
  onClose: () => void;
  onRefresh?: () => void;
}

export const CameraDetailModal: React.FC<CameraDetailModalProps> = ({ camera, onClose, onRefresh }) => {
  const [testing, setTesting] = useState(false);
  const [diagnosticResult, setDiagnosticResult] = useState<any>(null);

  if (!camera) return null;

  const handleTestConnection = async () => {
    setTesting(true);
    setDiagnosticResult(null);
    try {
      const res = await cameraService.testConnection(camera.id);
      setDiagnosticResult(res.diagnostic);
      if (onRefresh) onRefresh();
    } catch (err: any) {
      setDiagnosticResult({ error: err.message || 'Diagnostic execution failed' });
    } finally {
      setTesting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#131A26] border border-slate-800 rounded-3xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col">
        {/* Modal Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between sticky top-0 bg-[#131A26] z-10">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-cyan-500/10 border border-cyan-500/30 rounded-2xl text-cyan-400">
              <Radio className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                {camera.name}
                <span className="text-xs font-mono bg-slate-900 border border-slate-800 px-2 py-0.5 rounded text-cyan-400">
                  {camera.cameraId}
                </span>
              </h2>
              <p className="text-xs text-slate-400 font-mono">
                {camera.building} • {camera.floor} • {camera.zone}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-6">
          {/* Quick Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
              <p className="text-[11px] font-mono text-slate-400 uppercase">Connection State</p>
              <p className={`text-base font-bold mt-1 font-mono ${camera.status === 'ONLINE' ? 'text-emerald-400' : 'text-rose-400'}`}>
                {camera.status}
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
              <p className="text-[11px] font-mono text-slate-400 uppercase">Ping Latency</p>
              <p className="text-base font-bold mt-1 font-mono text-cyan-400">{camera.latencyMs} ms</p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
              <p className="text-[11px] font-mono text-slate-400 uppercase">Resolution / FPS</p>
              <p className="text-base font-bold mt-1 font-mono text-slate-200">
                {camera.resolution} @ {camera.fps}fps
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
              <p className="text-[11px] font-mono text-slate-400 uppercase">ONVIF Support</p>
              <p className="text-base font-bold mt-1 font-mono text-emerald-400">
                {camera.onvifEnabled ? 'ENABLED' : 'DISABLED'}
              </p>
            </div>
          </div>

          {/* Network & Hardware Specs */}
          <div className="bg-slate-950/60 p-5 rounded-2xl border border-slate-800/80 space-y-3">
            <h3 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <Cpu className="w-4 h-4 text-cyan-400" /> Network & Media Endpoint Profile
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
              <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
                <span className="text-slate-500">IP Address:</span>{' '}
                <span className="text-cyan-400 font-semibold">{camera.ipAddress}</span>
              </div>
              <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
                <span className="text-slate-500">MAC Address:</span>{' '}
                <span className="text-slate-200 font-semibold">{camera.macAddress}</span>
              </div>
              <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
                <span className="text-slate-500">Manufacturer & Model:</span>{' '}
                <span className="text-slate-200 font-semibold">
                  {camera.manufacturer} {camera.model}
                </span>
              </div>
              <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
                <span className="text-slate-500">Serial Number:</span>{' '}
                <span className="text-slate-200 font-semibold">{camera.serialNumber}</span>
              </div>
              <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 sm:col-span-2 truncate">
                <span className="text-slate-500">RTSP Stream URI:</span>{' '}
                <span className="text-emerald-400 font-semibold text-[11px] truncate">{camera.rtspUrl}</span>
              </div>
            </div>
          </div>

          {/* Connection Test Action */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">Live Diagnostic Engine</h3>
              <button
                onClick={handleTestConnection}
                disabled={testing}
                className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-black text-xs font-bold rounded-xl transition flex items-center space-x-2 shadow-lg shadow-cyan-500/20 disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${testing ? 'animate-spin' : ''}`} />
                <span>{testing ? 'Probing ICMP & RTSP...' : 'Run Diagnostics Test'}</span>
              </button>
            </div>

            {diagnosticResult && (
              <div className="p-4 rounded-2xl bg-slate-950 border border-cyan-500/40 text-xs font-mono space-y-2">
                <p className="text-cyan-400 font-bold flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4" /> Diagnostic Probe Summary
                </p>
                <div className="grid grid-cols-2 gap-2 text-slate-300">
                  <div>ICMP Ping: {diagnosticResult.ping?.ok ? '🟢 OK' : '🔴 FAILED'} ({diagnosticResult.ping?.latencyMs}ms)</div>
                  <div>TCP Port 554: {diagnosticResult.tcpPort554?.ok ? '🟢 OPEN' : '🔴 CLOSED'}</div>
                  <div>RTSP Handshake: {diagnosticResult.rtspHandshake?.ok ? '🟢 VERIFIED' : '🔴 FAILED'}</div>
                  <div>ONVIF Profile: {diagnosticResult.onvifProbe?.ok ? '🟢 READY' : '🟡 N/A'}</div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/80 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl transition"
          >
            Close Drawer
          </button>
        </div>
      </div>
    </div>
  );
};
