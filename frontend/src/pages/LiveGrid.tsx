import React, { useState, useEffect } from 'react';
import { CameraStreamCard } from '../components/CameraStreamCard';
import { CameraDetailModal } from '../components/CameraDetailModal';
import { cameraService } from '../services/api';
import { Camera } from '../types';
import { LayoutGrid, Grid3x3, Square, Search, Filter, RefreshCw, ZoomIn, Move, Sun } from 'lucide-react';

export const LiveGrid: React.FC = () => {
  const [cameras, setCameras] = useState<Camera[]>([]);
  const [gridLayout, setGridLayout] = useState<'1x1' | '2x2' | '3x3' | '4x4'>('2x2');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCamera, setSelectedCamera] = useState<Camera | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchCameras = async () => {
    try {
      setLoading(true);
      const res = await cameraService.getAll();
      setCameras(res.data || []);
    } catch (err) {
      console.error('Error fetching live grid cameras:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCameras();
  }, []);

  const filteredCameras = cameras.filter((cam) => {
    const matchesStatus = statusFilter === 'ALL' || cam.status === statusFilter;
    const matchesSearch =
      cam.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cam.cameraId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cam.building.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const getGridClass = () => {
    switch (gridLayout) {
      case '1x1':
        return 'grid-cols-1 max-w-4xl mx-auto';
      case '2x2':
        return 'grid-cols-1 sm:grid-cols-2';
      case '3x3':
        return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3';
      case '4x4':
        return 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4';
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-[1600px] mx-auto">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-100 font-sans flex items-center gap-2">
            Live Surveillance Grid
            <span className="text-xs font-mono bg-cyan-950 text-cyan-400 border border-cyan-800 px-2 py-0.5 rounded-full font-semibold">
              RTSP Transcoding Gateway
            </span>
          </h1>
          <p className="text-xs font-mono text-slate-400 mt-1">
            Real-time IP camera multi-channel matrix feed view
          </p>
        </div>

        {/* Layout Matrix Selectors */}
        <div className="flex items-center space-x-2 bg-slate-900/90 p-1.5 rounded-xl border border-slate-800 self-start md:self-auto">
          <span className="text-xs font-mono text-slate-500 px-2 font-semibold">Matrix:</span>
          <button
            onClick={() => setGridLayout('1x1')}
            className={`p-2 rounded-lg transition text-xs font-mono font-bold flex items-center space-x-1 ${
              gridLayout === '1x1' ? 'bg-cyan-500 text-black shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Square className="w-4 h-4" />
            <span>1x1</span>
          </button>
          <button
            onClick={() => setGridLayout('2x2')}
            className={`p-2 rounded-lg transition text-xs font-mono font-bold flex items-center space-x-1 ${
              gridLayout === '2x2' ? 'bg-cyan-500 text-black shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            <LayoutGrid className="w-4 h-4" />
            <span>2x2</span>
          </button>
          <button
            onClick={() => setGridLayout('3x3')}
            className={`p-2 rounded-lg transition text-xs font-mono font-bold flex items-center space-x-1 ${
              gridLayout === '3x3' ? 'bg-cyan-500 text-black shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Grid3x3 className="w-4 h-4" />
            <span>3x3</span>
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 soc-card p-4 rounded-2xl border border-slate-800">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
          <input
            type="text"
            placeholder="Search camera name, IP, zone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs font-mono text-slate-200 focus:outline-none focus:border-cyan-500"
          />
        </div>

        <div className="flex items-center space-x-3 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-slate-500" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-mono text-cyan-400 focus:outline-none"
          >
            <option value="ALL">All Statuses</option>
            <option value="ONLINE">🟢 Online Only</option>
            <option value="OFFLINE">🔴 Offline Only</option>
            <option value="UNREACHABLE">🟡 Unreachable</option>
          </select>

          <button
            onClick={fetchCameras}
            className="p-2 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded-xl border border-slate-800 text-xs font-mono flex items-center space-x-1"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* CCTV Grid Render */}
      <div className={`grid gap-4 ${getGridClass()}`}>
        {filteredCameras.map((cam) => (
          <CameraStreamCard key={cam.id} camera={cam} onSelect={(c) => setSelectedCamera(c)} />
        ))}
      </div>

      {/* Drawer */}
      <CameraDetailModal camera={selectedCamera} onClose={() => setSelectedCamera(null)} onRefresh={fetchCameras} />
    </div>
  );
};
