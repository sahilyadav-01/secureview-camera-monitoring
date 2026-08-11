import { describe, it, expect } from 'vitest';

describe('Camera Management & Status Diagnostic Test Suite', () => {
  const mockCameras = [
    {
      id: 'cam-01',
      name: 'HQ Main Lobby',
      ipAddress: '192.168.10.101',
      status: 'ONLINE',
      recordingStatus: 'RECORDING',
      building: 'Building A',
      floor: 'Floor 1',
    },
    {
      id: 'cam-02',
      name: 'HQ West Gate',
      ipAddress: '192.168.10.104',
      status: 'OFFLINE',
      recordingStatus: 'STOPPED',
      building: 'Building A',
      floor: 'Ground Exterior',
    },
    {
      id: 'cam-03',
      name: 'WH Loading Dock',
      ipAddress: '192.168.20.101',
      status: 'ONLINE',
      recordingStatus: 'RECORDING',
      building: 'Facility B',
      floor: 'Floor 1',
    },
  ];

  it('should filter cameras correctly by status', () => {
    const onlineCameras = mockCameras.filter((c) => c.status === 'ONLINE');
    const offlineCameras = mockCameras.filter((c) => c.status === 'OFFLINE');

    expect(onlineCameras.length).toBe(2);
    expect(offlineCameras.length).toBe(1);
    expect(offlineCameras[0].name).toBe('HQ West Gate');
  });

  it('should filter cameras by building/location', () => {
    const bldgACameras = mockCameras.filter((c) => c.building === 'Building A');
    expect(bldgACameras.length).toBe(2);
  });

  it('should format RTSP streaming URL securely', () => {
    const rawRtsp = 'rtsp://admin:secret@192.168.10.101:554/h264/ch1/main';
    const sanitizedRtsp = rawRtsp.replace(/\/\/[^:]+:[^@]+@/, '//***:***@');

    expect(sanitizedRtsp).toBe('rtsp://***:***@192.168.10.101:554/h264/ch1/main');
    expect(sanitizedRtsp).not.toContain('secret');
  });
});
