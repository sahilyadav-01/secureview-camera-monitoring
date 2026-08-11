import React, { useState } from 'react';
import { cameraService } from '../services/api';
import { X, Plus, Video } from 'lucide-react';

interface AddCameraModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const AddCameraModal: React.FC<AddCameraModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    cameraId: `CAM-HQ-${Math.floor(100 + Math.random() * 900)}`,
    ipAddress: '192.168.10.120',
    macAddress: `00:1A:2B:3C:${Math.floor(10 + Math.random() * 89)}:${Math.floor(10 + Math.random() * 89)}`,
    building: 'Building A',
    floor: 'Floor 1',
    zone: 'Security Gate',
    cameraType: 'DOME' as 'DOME' | 'BULLET' | 'PTZ' | 'THERMAL' | '360_PANORAMIC',
    manufacturer: 'Hikvision',
    model: 'DS-2CD2143G0-I',
    serialNumber: `CAM-SN-${Math.floor(10000 + Math.random() * 90000)}`,
    rtspUrl: 'rtsp://admin:pass@192.168.10.120:554/h264/ch1/main/av_stream',
    resolution: '4K Ultra HD',
    fps: 30,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await cameraService.create(formData);
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to add camera');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#131A26] border border-slate-800 rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl">
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-cyan-500/10 border border-cyan-500/30 rounded-xl text-cyan-400">
              <Video className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-100">Register IP Camera</h2>
              <p className="text-xs text-slate-400 font-mono">Provision new RTSP / ONVIF video endpoint</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs font-mono">
          {error && <div className="p-3 bg-rose-950/80 border border-rose-800 text-rose-300 rounded-xl">{error}</div>}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-400 mb-1">Camera Name</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-100 focus:border-cyan-500 focus:outline-none"
                placeholder="e.g. Lobby Entrance North"
              />
            </div>
            <div>
              <label className="block text-slate-400 mb-1">Camera ID Code</label>
              <input
                type="text"
                required
                value={formData.cameraId}
                onChange={(e) => setFormData({ ...formData, cameraId: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-cyan-400 focus:border-cyan-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-slate-400 mb-1">IP Address</label>
              <input
                type="text"
                required
                value={formData.ipAddress}
                onChange={(e) => setFormData({ ...formData, ipAddress: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-cyan-400 focus:border-cyan-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-slate-400 mb-1">MAC Address</label>
              <input
                type="text"
                required
                value={formData.macAddress}
                onChange={(e) => setFormData({ ...formData, macAddress: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200 focus:border-cyan-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-slate-400 mb-1">Building & Floor</label>
              <input
                type="text"
                value={formData.building}
                onChange={(e) => setFormData({ ...formData, building: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200"
              />
            </div>
            <div>
              <label className="block text-slate-400 mb-1">Zone Area</label>
              <input
                type="text"
                value={formData.zone}
                onChange={(e) => setFormData({ ...formData, zone: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200"
              />
            </div>
            <div>
              <label className="block text-slate-400 mb-1">Camera Form Factor</label>
              <select
                value={formData.cameraType}
                onChange={(e) => setFormData({ ...formData, cameraType: e.target.value as any })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200"
              >
                <option value="DOME">Dome Camera</option>
                <option value="BULLET">Bullet Camera</option>
                <option value="PTZ">PTZ Speed Dome</option>
                <option value="THERMAL">Thermal Camera</option>
                <option value="360_PANORAMIC">360° Panoramic</option>
              </select>
            </div>
            <div>
              <label className="block text-slate-400 mb-1">Manufacturer</label>
              <input
                type="text"
                value={formData.manufacturer}
                onChange={(e) => setFormData({ ...formData, manufacturer: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-slate-400 mb-1">RTSP Stream URL</label>
              <input
                type="text"
                required
                value={formData.rtspUrl}
                onChange={(e) => setFormData({ ...formData, rtspUrl: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-emerald-400 focus:border-cyan-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="pt-4 flex justify-end space-x-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl hover:bg-slate-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 bg-cyan-500 text-black font-bold rounded-xl hover:bg-cyan-400 shadow-lg shadow-cyan-500/20 disabled:opacity-50"
            >
              {loading ? 'Registering...' : 'Provision Camera'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
