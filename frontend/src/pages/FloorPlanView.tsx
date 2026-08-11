import React, { useEffect, useState } from 'react';
import { cameraService } from '../services/api';
import { Camera } from '../types';
import { CameraDetailModal } from '../components/CameraDetailModal';
import { MapPin, Layers, Radio, Eye, ShieldCheck, AlertTriangle } from 'lucide-react';

export const FloorPlanView: React.FC = () => {
  const [cameras, setCameras] = useState<Camera[]>([]);
  const [selectedCamera, setSelectedCamera] = useState<Camera | null>(null);
  const [activeFloor, setActiveFloor] = useState('Floor 1');

  useEffect(() => {
    cameraService.getAll().then((res) => setCameras(res.data || []));
  }, []);

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-100 font-sans flex items-center gap-2">
            Interactive Building Floor Plan & Camera Map
            <span className="text-xs font-mono bg-cyan-950 text-cyan-400 border border-cyan-800 px-2 py-0.5 rounded-full font-semibold">
              Spatial Placement
            </span>
          </h1>
          <p className="text-xs font-mono text-slate-400 mt-1">
            Visual spatial telemetry map with live camera status nodes and click diagnostics
          </p>
        </div>

        {/* Floor Switcher */}
        <div className="flex items-center space-x-2 bg-slate-900 p-1.5 rounded-xl border border-slate-800 self-start sm:self-auto text-xs font-mono">
          <Layers className="w-4 h-4 text-cyan-400 ml-2" />
          {['Floor 1', 'Floor 2', 'Floor 4', 'Sub-Level 1'].map((floor) => (
            <button
              key={floor}
              onClick={() => setActiveFloor(floor)}
              className={`px-3 py-1.5 rounded-lg transition font-semibold ${
                activeFloor === floor ? 'bg-cyan-500 text-black shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              {floor}
            </button>
          ))}
        </div>
      </div>

      {/* Blueprint Visual Canvas container */}
      <div className="soc-card rounded-3xl border border-slate-800 p-6 relative min-h-[500px] overflow-hidden flex flex-col justify-between">
        {/* Architectural Grid Background */}
        <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px] opacity-40 pointer-events-none" />

        {/* Blueprint Room Divider Overlay */}
        <div className="absolute inset-8 border-2 border-dashed border-slate-700/60 rounded-2xl pointer-events-none p-6 flex flex-col justify-between">
          <div className="flex justify-between text-[11px] font-mono text-slate-400 font-bold uppercase">
            <span>WEST WING / LOBBY AREA</span>
            <span>NORTH DATA CENTER VAULT</span>
          </div>
          <div className="flex justify-between text-[11px] font-mono text-slate-400 font-bold uppercase">
            <span>SOUTH EXECUTIVE SUITES</span>
            <span>EAST PERIMETER GATE</span>
          </div>
        </div>

        {/* Camera Nodes */}
        <div className="relative z-10 w-full h-[440px]">
          {cameras.map((cam, idx) => {
            const isOnline = cam.status === 'ONLINE';
            const posX = cam.floorX || 20 + (idx * 25) % 70;
            const posY = cam.floorY || 30 + (idx * 30) % 60;

            return (
              <div
                key={cam.id}
                style={{ left: `${posX}%`, top: `${posY}%` }}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 group cursor-pointer"
                onClick={() => setSelectedCamera(cam)}
              >
                {/* Node Pin Marker */}
                <div className="relative flex items-center justify-center">
                  <span
                    className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition shadow-xl ${
                      isOnline
                        ? 'bg-emerald-950/90 border-emerald-400 text-emerald-400 shadow-emerald-500/20 group-hover:scale-125'
                        : 'bg-rose-950/90 border-rose-500 text-rose-400 shadow-rose-500/20 animate-bounce'
                    }`}
                  >
                    <Radio className="w-5 h-5" />
                  </span>

                  {/* Pulse */}
                  {isOnline && (
                    <span className="absolute inset-0 rounded-full bg-emerald-400 animate-ping opacity-25 pointer-events-none" />
                  )}
                </div>

                {/* Node Hover Tooltip */}
                <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 hidden group-hover:flex flex-col bg-slate-950 border border-slate-800 p-3 rounded-xl shadow-2xl z-30 whitespace-nowrap text-xs font-mono space-y-1">
                  <div className="font-bold text-slate-100 flex items-center space-x-1.5">
                    <span className={`w-2 h-2 rounded-full ${isOnline ? 'bg-emerald-400' : 'bg-rose-500'}`} />
                    <span>{cam.name}</span>
                  </div>
                  <div className="text-[10px] text-cyan-400">
                    {cam.cameraId} | IP: {cam.ipAddress}
                  </div>
                  <div className="text-[10px] text-slate-400">
                    {cam.zone} • {cam.resolution}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Legend Footer */}
        <div className="relative z-10 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono text-slate-400">
          <div className="flex items-center space-x-6">
            <span className="flex items-center space-x-2">
              <span className="w-3 h-3 rounded-full bg-emerald-400" />
              <span>Online Endpoint</span>
            </span>
            <span className="flex items-center space-x-2">
              <span className="w-3 h-3 rounded-full bg-rose-500" />
              <span>Offline Alert</span>
            </span>
          </div>
          <span>Click any camera node for detailed diagnostic drawer</span>
        </div>
      </div>

      <CameraDetailModal camera={selectedCamera} onClose={() => setSelectedCamera(null)} />
    </div>
  );
};
