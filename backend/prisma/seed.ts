import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting SecureView database seeding...');

  // Clean existing tables
  await prisma.auditLog.deleteMany();
  await prisma.healthLog.deleteMany();
  await prisma.incident.deleteMany();
  await prisma.alert.deleteMany();
  await prisma.camera.deleteMany();
  await prisma.nvr.deleteMany();
  await prisma.location.deleteMany();
  await prisma.user.deleteMany();

  // 1. Create Users
  const passwordHash = await bcrypt.hash('SecureView2026!', 10);

  const superAdmin = await prisma.user.create({
    data: {
      name: 'Alexander Wright',
      email: 'admin@secureview.local',
      password: passwordHash,
      role: 'SUPER_ADMIN',
      department: 'Global Security & Infrastructure',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    },
  });

  const itAdmin = await prisma.user.create({
    data: {
      name: 'Sarah Chen',
      email: 'it.admin@secureview.local',
      password: passwordHash,
      role: 'IT_ADMIN',
      department: 'Network Operations Center',
      avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150',
    },
  });

  const operator = await prisma.user.create({
    data: {
      name: 'Marcus Vance',
      email: 'operator@secureview.local',
      password: passwordHash,
      role: 'SECURITY_OPERATOR',
      department: 'Physical Security SOC',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    },
  });

  const viewer = await prisma.user.create({
    data: {
      name: 'Elena Rostova',
      email: 'viewer@secureview.local',
      password: passwordHash,
      role: 'VIEWER',
      department: 'Compliance & Audit',
      avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150',
    },
  });

  console.log('✅ Created 4 System Users with RBAC roles.');

  // 2. Create Locations
  const hqLocation = await prisma.location.create({
    data: {
      name: 'Corporate Headquarters',
      code: 'HQ-MAIN',
      address: '100 Enterprise Way, Silicon Valley, CA',
      building: 'Building A (Main)',
      floors: 4,
    },
  });

  const warehouseLocation = await prisma.location.create({
    data: {
      name: 'Logistics Center & Warehouse',
      code: 'WH-ALPHA',
      address: '450 Industrial Parkway, Austin, TX',
      building: 'Facility B',
      floors: 2,
    },
  });

  const dataCenterLocation = await prisma.location.create({
    data: {
      name: 'Mission Critical Data Center',
      code: 'DC-WEST',
      address: '888 Server Lane, Ashburn, VA',
      building: 'Bunker 1',
      floors: 1,
    },
  });

  console.log('✅ Created 3 Enterprise Locations.');

  // 3. Create NVRs
  const nvrHQ = await prisma.nvr.create({
    data: {
      name: 'NVR-HQ-CORE-01',
      ipAddress: '192.168.10.200',
      vendor: 'Hikvision',
      model: 'DS-9664NI-I8',
      serialNumber: 'HK-NVR-99210-X',
      totalChannels: 32,
      usedChannels: 12,
      storageTotalTb: 20.0,
      storageUsedTb: 14.2,
      hddHealth: 'HEALTHY',
      status: 'ONLINE',
      firmwareVersion: 'v4.61.020',
      locationId: hqLocation.id,
    },
  });

  const nvrWH = await prisma.nvr.create({
    data: {
      name: 'NVR-WH-LOGISTICS-01',
      ipAddress: '192.168.20.200',
      vendor: 'Dahua',
      model: 'NVR5864-4KS2',
      serialNumber: 'DH-NVR-88219-B',
      totalChannels: 32,
      usedChannels: 8,
      storageTotalTb: 12.0,
      storageUsedTb: 9.8,
      hddHealth: 'WARNING',
      status: 'ONLINE',
      firmwareVersion: 'v4.001.000',
      locationId: warehouseLocation.id,
    },
  });

  const nvrDC = await prisma.nvr.create({
    data: {
      name: 'NVR-DC-SECURE-01',
      ipAddress: '192.168.30.200',
      vendor: 'Axis Communications',
      model: 'S1132 Recorder',
      serialNumber: 'AX-NVR-11200-Z',
      totalChannels: 16,
      usedChannels: 6,
      storageTotalTb: 16.0,
      storageUsedTb: 8.4,
      hddHealth: 'HEALTHY',
      status: 'ONLINE',
      firmwareVersion: 'v10.12.3',
      locationId: dataCenterLocation.id,
    },
  });

  console.log('✅ Created 3 High-Capacity NVR Storage Units.');

  // 4. Create Cameras
  const cameraData = [
    {
      name: 'HQ Main Reception Desk',
      cameraId: 'CAM-HQ-001',
      ipAddress: '192.168.10.101',
      macAddress: '00:1A:2B:3C:4D:01',
      locationId: hqLocation.id,
      building: 'Building A',
      floor: 'Floor 1',
      zone: 'Lobby & Reception',
      cameraType: 'DOME',
      manufacturer: 'Hikvision',
      model: 'DS-2CD2143G0-I',
      serialNumber: 'CAM-SN-10001',
      protocol: 'RTSP',
      rtspUrl: 'rtsp://admin:pass@192.168.10.101:554/h264/ch1/main/av_stream',
      onvifEnabled: true,
      nvrId: nvrHQ.id,
      channelNumber: 1,
      resolution: '4K Ultra HD',
      fps: 30,
      status: 'ONLINE',
      recordingStatus: 'RECORDING',
      latencyMs: 14,
      floorX: 25.0,
      floorY: 35.0,
    },
    {
      name: 'HQ Server Room - Main Rack A',
      cameraId: 'CAM-HQ-002',
      ipAddress: '192.168.10.102',
      macAddress: '00:1A:2B:3C:4D:02',
      locationId: hqLocation.id,
      building: 'Building A',
      floor: 'Floor 2',
      zone: 'IT Data Center',
      cameraType: 'PTZ',
      manufacturer: 'Axis',
      model: 'Q6075-E PTZ',
      serialNumber: 'CAM-SN-10002',
      protocol: 'RTSP',
      rtspUrl: 'rtsp://admin:pass@192.168.10.102:554/h264/ch1/main/av_stream',
      onvifEnabled: true,
      nvrId: nvrHQ.id,
      channelNumber: 2,
      resolution: '1080p Full HD',
      fps: 60,
      status: 'ONLINE',
      recordingStatus: 'RECORDING',
      latencyMs: 8,
      floorX: 75.0,
      floorY: 20.0,
    },
    {
      name: 'HQ Executive Boardroom',
      cameraId: 'CAM-HQ-003',
      ipAddress: '192.168.10.103',
      macAddress: '00:1A:2B:3C:4D:03',
      locationId: hqLocation.id,
      building: 'Building A',
      floor: 'Floor 4',
      zone: 'Executive Suite',
      cameraType: '360_PANORAMIC',
      manufacturer: 'Bosch',
      model: 'FLEXIDOME IP panoramic 7000',
      serialNumber: 'CAM-SN-10003',
      protocol: 'RTSP',
      rtspUrl: 'rtsp://admin:pass@192.168.10.103:554/h264/ch1/main/av_stream',
      onvifEnabled: true,
      nvrId: nvrHQ.id,
      channelNumber: 3,
      resolution: '4K Ultra HD',
      fps: 25,
      status: 'ONLINE',
      recordingStatus: 'RECORDING',
      latencyMs: 18,
      floorX: 45.0,
      floorY: 60.0,
    },
    {
      name: 'HQ West Perimeter Gate',
      cameraId: 'CAM-HQ-004',
      ipAddress: '192.168.10.104',
      macAddress: '00:1A:2B:3C:4D:04',
      locationId: hqLocation.id,
      building: 'Building A',
      floor: 'Ground Exterior',
      zone: 'Perimeter Fence',
      cameraType: 'BULLET',
      manufacturer: 'Dahua',
      model: 'IPC-HFW5831E-ZE',
      serialNumber: 'CAM-SN-10004',
      protocol: 'RTSP',
      rtspUrl: 'rtsp://admin:pass@192.168.10.104:554/h264/ch1/main/av_stream',
      onvifEnabled: true,
      nvrId: nvrHQ.id,
      channelNumber: 4,
      resolution: '4K Ultra HD',
      fps: 30,
      status: 'OFFLINE',
      recordingStatus: 'STOPPED',
      latencyMs: 999,
      floorX: 10.0,
      floorY: 85.0,
    },
    {
      name: 'WH Loading Dock 1 (High Bay)',
      cameraId: 'CAM-WH-001',
      ipAddress: '192.168.20.101',
      macAddress: '00:1A:2B:3C:4E:01',
      locationId: warehouseLocation.id,
      building: 'Facility B',
      floor: 'Floor 1',
      zone: 'Logistics & Shipping',
      cameraType: 'BULLET',
      manufacturer: 'Hikvision',
      model: 'DS-2CD2T85G1-I8',
      serialNumber: 'CAM-SN-20001',
      protocol: 'RTSP',
      rtspUrl: 'rtsp://admin:pass@192.168.20.101:554/h264/ch1/main/av_stream',
      onvifEnabled: true,
      nvrId: nvrWH.id,
      channelNumber: 1,
      resolution: '4K Ultra HD',
      fps: 30,
      status: 'ONLINE',
      recordingStatus: 'RECORDING',
      latencyMs: 22,
      floorX: 30.0,
      floorY: 40.0,
    },
    {
      name: 'WH High-Value Storage Cage',
      cameraId: 'CAM-WH-002',
      ipAddress: '192.168.20.102',
      macAddress: '00:1A:2B:3C:4E:02',
      locationId: warehouseLocation.id,
      building: 'Facility B',
      floor: 'Floor 1',
      zone: 'Secure Storage',
      cameraType: 'PTZ',
      manufacturer: 'Axis',
      model: 'P5655-E PTZ',
      serialNumber: 'CAM-SN-20002',
      protocol: 'RTSP',
      rtspUrl: 'rtsp://admin:pass@192.168.20.102:554/h264/ch1/main/av_stream',
      onvifEnabled: true,
      nvrId: nvrWH.id,
      channelNumber: 2,
      resolution: '1080p Full HD',
      fps: 30,
      status: 'UNREACHABLE',
      recordingStatus: 'ERROR',
      latencyMs: 340,
      floorX: 80.0,
      floorY: 70.0,
    },
    {
      name: 'DC Cage 01 Vault Corridor',
      cameraId: 'CAM-DC-001',
      ipAddress: '192.168.30.101',
      macAddress: '00:1A:2B:3C:4F:01',
      locationId: dataCenterLocation.id,
      building: 'Bunker 1',
      floor: 'Sub-Level 1',
      zone: 'Secure Server Vault',
      cameraType: 'THERMAL',
      manufacturer: 'FLIR',
      model: 'Saros DH-390 Thermal',
      serialNumber: 'CAM-SN-30001',
      protocol: 'RTSP',
      rtspUrl: 'rtsp://admin:pass@192.168.30.101:554/h264/ch1/main/av_stream',
      onvifEnabled: true,
      nvrId: nvrDC.id,
      channelNumber: 1,
      resolution: '1080p Thermal',
      fps: 30,
      status: 'ONLINE',
      recordingStatus: 'RECORDING',
      latencyMs: 5,
      floorX: 50.0,
      floorY: 30.0,
    },
    {
      name: 'HQ Elevator Bank North',
      cameraId: 'CAM-HQ-005',
      ipAddress: '192.168.10.105',
      macAddress: '00:1A:2B:3C:4D:05',
      locationId: hqLocation.id,
      building: 'Building A',
      floor: 'Floor 2',
      zone: 'Elevator Lobby',
      cameraType: 'DOME',
      manufacturer: 'Hikvision',
      model: 'DS-2CD2143G0-I',
      serialNumber: 'CAM-SN-10005',
      protocol: 'RTSP',
      rtspUrl: 'rtsp://admin:pass@192.168.10.105:554/h264/ch1/main/av_stream',
      onvifEnabled: true,
      nvrId: nvrHQ.id,
      channelNumber: 5,
      resolution: '1080p Full HD',
      fps: 30,
      status: 'ONLINE',
      recordingStatus: 'RECORDING',
      latencyMs: 12,
      floorX: 60.0,
      floorY: 40.0,
    },
  ];

  const createdCameras = [];
  for (const cData of cameraData) {
    const camera = await prisma.camera.create({ data: cData as any });
    createdCameras.push(camera);
  }

  console.log(`✅ Created ${createdCameras.length} IP Cameras with RTSP/ONVIF configuration.`);

  // 5. Create Health Logs
  for (const cam of createdCameras) {
    const isOnline = cam.status === 'ONLINE';
    await prisma.healthLog.create({
      data: {
        cameraId: cam.id,
        pingOk: isOnline,
        pingMs: isOnline ? cam.latencyMs : 999,
        tcpPort554: isOnline,
        rtspOk: isOnline,
        onvifOk: isOnline,
        status: cam.status,
      },
    });
  }

  // 6. Create Alerts
  const offlineCam = createdCameras.find((c) => c.status === 'OFFLINE');
  const unreachableCam = createdCameras.find((c) => c.status === 'UNREACHABLE');

  if (offlineCam) {
    await prisma.alert.create({
      data: {
        title: `Camera Connection Lost: ${offlineCam.name}`,
        description: `ICMP Ping and TCP Port 554 RTSP checks failed for IP ${offlineCam.ipAddress}. Camera marked OFFLINE.`,
        severity: 'CRITICAL',
        status: 'OPEN',
        source: 'CAMERA',
        cameraId: offlineCam.id,
      },
    });
  }

  if (unreachableCam) {
    await prisma.alert.create({
      data: {
        title: `High Latency / Packet Loss: ${unreachableCam.name}`,
        description: `RTSP stream ping response time exceeded 300ms (${unreachableCam.latencyMs}ms). Unstable connection detected.`,
        severity: 'HIGH',
        status: 'INVESTIGATING',
        source: 'NETWORK',
        cameraId: unreachableCam.id,
        assignedToId: itAdmin.id,
      },
    });
  }

  await prisma.alert.create({
    data: {
      title: `NVR Storage Warning: ${nvrWH.name}`,
      description: `Storage utilization reached 81.6% (${nvrWH.storageUsedTb}TB / ${nvrWH.storageTotalTb}TB). HDD 3 health reporting S.M.A.R.T reallocated sector count warning.`,
      severity: 'HIGH',
      status: 'OPEN',
      source: 'STORAGE',
      nvrId: nvrWH.id,
      assignedToId: superAdmin.id,
    },
  });

  console.log('✅ Created Active Monitoring Alerts.');

  // 7. Create IT Incidents
  if (offlineCam) {
    await prisma.incident.create({
      data: {
        ticketNumber: 'INC-2026-00891',
        title: `Hardware Failure / Fiber Switch Outage at ${offlineCam.building}`,
        description: `Camera ${offlineCam.cameraId} went offline after power bump. Switch port 14 lost PoE handshaking with camera.`,
        cameraId: offlineCam.id,
        priority: 'CRITICAL',
        status: 'OPEN',
        rootCause: 'PoE Switch Port overload following power bump',
        troubleshooting: 'Dispatched site engineer to replace PoE injector and test Cat6 cable termination.',
        downtimeMinutes: 145,
        assignedToId: itAdmin.id,
      },
    });
  }

  console.log('✅ Created IT Infrastructure Incidents.');

  // 8. Create Audit Logs
  await prisma.auditLog.create({
    data: {
      action: 'SYSTEM_BOOT',
      performedByName: 'System Gateway Engine',
      role: 'SUPER_ADMIN',
      target: 'Platform Core',
      details: 'SecureView Monitoring Services initialized. Socket.IO engine listening on 5000.',
    },
  });

  await prisma.auditLog.create({
    data: {
      action: 'CAMERA_UPDATE',
      performedByName: 'Alexander Wright',
      role: 'SUPER_ADMIN',
      target: 'CAM-HQ-002',
      details: 'Updated camera PTZ preset profiles and enabled 60 FPS H.264 stream profile.',
    },
  });

  console.log('🎉 Database seeding complete successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
