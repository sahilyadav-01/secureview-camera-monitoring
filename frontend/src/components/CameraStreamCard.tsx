import React, { useState, useEffect, useRef } from 'react';
import { Camera } from '../types';
import { Maximize2, RefreshCw, AlertTriangle, Eye, Zap, Radio } from 'lucide-react';

interface CameraStreamCardProps {
  camera: Camera;
  onSelect?: (camera: Camera) => void;
  isCompact?: boolean;
}

export const CameraStreamCard: React.FC<CameraStreamCardProps> = ({ camera, onSelect, isCompact = false }) => {
  const [timestamp, setTimestamp] = useState<string>('');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Live OSD Timestamp update
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setTimestamp(now.toISOString().replace('T', ' ').slice(0, 19) + ' UTC');
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Animated canvas stream simulation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let frame = 0;

    const render = () => {
      frame++;
      ctx.fillStyle = '#080C14';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      if (camera.status === 'OFFLINE') {
        // Render Offline Signal Error Screen
        ctx.fillStyle = '#1E293B';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = '#EF4444';
        ctx.font = 'bold 14px "JetBrains Mono", monospace';
        ctx.textAlign = 'center';
        ctx.fillText('NO RTSP SIGNAL — CAMERA OFFLINE', canvas.width / 2, canvas.height / 2 - 10);

        ctx.fillStyle = '#94A3B8';
        ctx.font = '11px sans-serif';
        ctx.fillText(`IP: ${camera.ipAddress} | Port 554 Failed`, canvas.width / 2, canvas.height / 2 + 12);
        return;
      }

      // Simulated CCTV Scene Graphics
      // Grid lines
      ctx.strokeStyle = '#131C2D';
      ctx.lineWidth = 1;
      for (let x = 0; x < canvas.width; x += 40) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      for (let y = 0; y < canvas.height; y += 40) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      // Animated security motion vector box
      const boxX = (Math.sin(frame * 0.02) * 0.3 + 0.5) * (canvas.width - 80);
      const boxY = (Math.cos(frame * 0.03) * 0.2 + 0.5) * (canvas.height - 60);

      ctx.strokeStyle = '#00F0FF';
      ctx.lineWidth = 2;
      ctx.strokeRect(boxX, boxY, 80, 50);

      ctx.fillStyle = 'rgba(0, 240, 255, 0.15)';
      ctx.fillRect(boxX, boxY, 80, 50);

      ctx.fillStyle = '#00F0FF';
      ctx.font = '9px "JetBrains Mono", monospace';
      ctx.fillText('TARGET DETECTED [98%]', boxX + 4, boxY - 4);

      // Scanline effect
      ctx.fillStyle = 'rgba(255, 255, 255, 0.03)';
      const scanY = (frame * 2) % canvas.height;
      ctx.fillRect(0, scanY, canvas.width, 3);

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [camera]);

  const getStatusBadge = () => {
    switch (camera.status) {
      case 'ONLINE':
        return (
          <span className="flex items-center space-x-1.5 bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 text-[10px] font-mono px-2 py-0.5 rounded-full font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
            <span>LIVE</span>
          </span>
        );
      case 'UNREACHABLE':
        return (
          <span className="flex items-center space-x-1.5 bg-amber-950/80 border border-amber-500/40 text-amber-400 text-[10px] font-mono px-2 py-0.5 rounded-full font-bold">
            <AlertTriangle className="w-3 h-3" />
            <span>LATENCY HIGH</span>
          </span>
        );
      case 'OFFLINE':
      default:
        return (
          <span className="flex items-center space-x-1.5 bg-rose-950/80 border border-rose-500/40 text-rose-400 text-[10px] font-mono px-2 py-0.5 rounded-full font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
            <span>OFFLINE</span>
          </span>
        );
    }
  };

  return (
    <div
      className={`soc-card rounded-2xl overflow-hidden border border-slate-800 flex flex-col group relative ${
        isFullscreen ? 'fixed inset-4 z-50 bg-slate-950 shadow-2xl' : ''
      }`}
    >
      {/* Stream Video Overlay Header */}
      <div className="p-3 bg-slate-950/80 border-b border-slate-800/80 flex items-center justify-between z-10">
        <div className="flex items-center space-x-2 truncate">
          <Radio className={`w-4 h-4 ${camera.status === 'ONLINE' ? 'text-cyan-400' : 'text-slate-500'}`} />
          <h3 className="text-xs font-semibold text-slate-100 truncate">{camera.name}</h3>
        </div>
        <div className="flex items-center space-x-2 shrink-0">
          {getStatusBadge()}
          <span className="text-[10px] font-mono text-slate-400 bg-slate-900 border border-slate-800 px-1.5 py-0.5 rounded">
            {camera.resolution}
          </span>
        </div>
      </div>

      {/* Canvas Stream Window */}
      <div className="relative bg-black flex-1 min-h-[160px] flex items-center justify-center overflow-hidden">
        <canvas ref={canvasRef} width={400} height={225} className="w-full h-full object-cover" />

        {/* Video OSD HUD Overlay */}
        <div className="absolute top-2 left-2 pointer-events-none text-[10px] font-mono text-cyan-400/90 bg-black/60 px-2 py-0.5 rounded border border-cyan-500/20">
          {camera.cameraId} | {camera.ipAddress}
        </div>

        <div className="absolute top-2 right-2 pointer-events-none text-[10px] font-mono text-slate-300 bg-black/60 px-2 py-0.5 rounded">
          {timestamp || '2026-08-11 20:45:00 UTC'}
        </div>

        <div className="absolute bottom-2 left-2 pointer-events-none text-[10px] font-mono text-slate-400 bg-black/60 px-2 py-0.5 rounded flex items-center space-x-2">
          <span>FPS: {camera.status === 'ONLINE' ? camera.fps : 0}</span>
          <span>PING: {camera.latencyMs}ms</span>
        </div>

        {/* Hover Action Overlay */}
        <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-3">
          <button
            onClick={() => onSelect && onSelect(camera)}
            className="p-2.5 rounded-xl bg-cyan-500 text-black hover:bg-cyan-400 font-bold transition shadow-lg shadow-cyan-500/20 flex items-center space-x-1.5 text-xs"
          >
            <Eye className="w-4 h-4" />
            <span>Diagnostics</span>
          </button>
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-2.5 rounded-xl bg-slate-800 text-slate-200 hover:bg-slate-700 transition border border-slate-700 text-xs flex items-center space-x-1.5"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Footer Info Bar */}
      {!isCompact && (
        <div className="p-3 bg-slate-950/60 text-[11px] font-mono text-slate-400 flex items-center justify-between border-t border-slate-800/60">
          <span className="truncate">
            {camera.building} • {camera.floor}
          </span>
          <span className="text-cyan-400 font-semibold truncate">{camera.zone}</span>
        </div>
      )}
    </div>
  );
};
