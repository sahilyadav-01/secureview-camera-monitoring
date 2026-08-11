import React, { useEffect, useState } from 'react';
import { cameraService } from '../services/api';
import { Camera } from '../types';
import { CameraDetailModal } from '../components/CameraDetailModal';
import { AddCameraModal } from '../components/AddCameraModal';
import { useAuth } from '../context/AuthContext';
import { Video, Plus, Search, Filter, Trash2, Eye, Activity, RefreshCw, Cpu, CheckCircle, AlertCircle } from 'lucide-react';

export const CameraManagement: React.FC = () => {
  const { user } = useAuth();
  const [cameras, setCameras] = useState<Camera[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedCamera, setSelectedCamera] = useState<Camera | null>(null);
  const [isAddOpen, setIsAddOpen] = useState(false);

  const canManage = user?.role === 'SUPER_ADMIN' || user?.role === 'IT_ADMIN';

  const loadCameras = async () => {
    try {
      setLoading(true);
      const res = await cameraService.getAll();
      setCameras(res.data || []);
    } catch (err) {
      console.error('Failed to load cameras:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCameras();
  }, []);

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to de-provision this IP camera hardware endpoint?')) return;
    try {
      await cameraService.delete(id);
      loadCameras();
    } catch (err: any) {
      alert(err.message || 'Delete failed');
    }
  };

  const filtered = cameras.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.cameraId.toLowerCase().includes(search.toLowerCase()) ||
      c.ipAddress.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-100 font-sans flex items-center gap-2">
            IP Camera Management & Provisioning
            <span className="text-xs font-mono bg-cyan-950 text-cyan-400 border border-cyan-800 px-2 py-0.5 rounded-full font-semibold">
              CRUD Inventory
            </span>
          </h1>
          <p className="text-xs font-mono text-slate-400 mt-1">
            Register, configure RTSP parameters, test connectivity, and maintain hardware specs
          </p>
        </div>

        {canManage && (
          <button
            onClick={() => setIsAddOpen(true)}
            className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-black text-xs font-bold font-mono rounded-xl shadow-lg shadow-cyan-500/20 flex items-center space-x-2 transition self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Add IP Camera</span>
          </button>
        )}
      </div>

      {/* Search & Stats */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 soc-card p-4 rounded-2xl border border-slate-800">
        <div className="relative w-full sm:w-96">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
          <input
            type="text"
            placeholder="Search by Camera Name, IP, ID, Zone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs font-mono text-slate-200 focus:outline-none focus:border-cyan-500"
          />
        </div>

        <button
          onClick={loadCameras}
          className="p-2.5 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded-xl border border-slate-800 text-xs font-mono flex items-center space-x-2"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Reload Table</span>
        </button>
      </div>

      {/* Inventory Table */}
      <div className="soc-card rounded-2xl border border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-slate-950/80 border-b border-slate-800 text-slate-400 uppercase text-[10px]">
              <tr>
                <th className="p-4">Camera Identifier</th>
                <th className="p-4">IP / MAC Address</th>
                <th className="p-4">Location Zone</th>
                <th className="p-4">Hardware Profile</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-200">
              {filtered.map((cam) => (
                <tr key={cam.id} className="hover:bg-slate-900/60 transition">
                  <td className="p-4">
                    <div className="font-bold text-slate-100">{cam.name}</div>
                    <div className="text-[10px] text-cyan-400">{cam.cameraId}</div>
                  </td>
                  <td className="p-4">
                    <div className="font-semibold text-cyan-400">{cam.ipAddress}</div>
                    <div className="text-[10px] text-slate-500">{cam.macAddress}</div>
                  </td>
                  <td className="p-4">
                    <div>{cam.building}</div>
                    <div className="text-[10px] text-slate-400">{cam.zone}</div>
                  </td>
                  <td className="p-4">
                    <div className="text-slate-300">
                      {cam.manufacturer} {cam.model}
                    </div>
                    <div className="text-[10px] text-slate-500">
                      {cam.cameraType} • {cam.resolution}
                    </div>
                  </td>
                  <td className="p-4">
                    <span
                      className={`inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                        cam.status === 'ONLINE'
                          ? 'bg-emerald-950/80 text-emerald-400 border-emerald-800'
                          : 'bg-rose-950/80 text-rose-400 border-rose-800'
                      }`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${cam.status === 'ONLINE' ? 'bg-emerald-400' : 'bg-rose-500'}`} />
                      <span>{cam.status}</span>
                    </span>
                  </td>
                  <td className="p-4 text-right space-x-2">
                    <button
                      onClick={() => setSelectedCamera(cam)}
                      className="p-1.5 bg-slate-900 hover:bg-slate-800 text-cyan-400 rounded-lg border border-slate-800 transition"
                      title="View Details & Test Diagnostics"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    {user?.role === 'SUPER_ADMIN' && (
                      <button
                        onClick={() => handleDelete(cam.id)}
                        className="p-1.5 bg-rose-950/60 hover:bg-rose-900 text-rose-400 rounded-lg border border-rose-800 transition"
                        title="Delete Camera"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modals */}
      <CameraDetailModal camera={selectedCamera} onClose={() => setSelectedCamera(null)} onRefresh={loadCameras} />
      <AddCameraModal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} onSuccess={loadCameras} />
    </div>
  );
};
