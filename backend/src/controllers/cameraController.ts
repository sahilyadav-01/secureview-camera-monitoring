import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middleware/authMiddleware';

const prisma = new PrismaClient();

export const getCameras = async (req: AuthRequest, res: Response) => {
  try {
    const { locationId, status, building, zone, search } = req.query;

    const where: any = {};
    if (locationId && typeof locationId === 'string') where.locationId = locationId;
    if (status && typeof status === 'string') where.status = status;
    if (building && typeof building === 'string') where.building = building;
    if (zone && typeof zone === 'string') where.zone = zone;
    if (search && typeof search === 'string') {
      where.OR = [
        { name: { contains: search } },
        { cameraId: { contains: search } },
        { ipAddress: { contains: search } },
        { zone: { contains: search } },
      ];
    }

    const cameras = await prisma.camera.findMany({
      where,
      include: {
        location: true,
        nvr: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return res.json({ success: true, count: cameras.length, data: cameras });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getCameraById = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const camera = await prisma.camera.findUnique({
      where: { id },
      include: {
        location: true,
        nvr: true,
        healthLogs: {
          take: 20,
          orderBy: { checkedAt: 'desc' },
        },
        alerts: {
          take: 10,
          orderBy: { createdAt: 'desc' },
        },
        incidents: {
          take: 5,
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!camera) {
      return res.status(404).json({ success: false, message: 'Camera not found.' });
    }

    return res.json({ success: true, data: camera });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const createCamera = async (req: AuthRequest, res: Response) => {
  try {
    const {
      name,
      cameraId,
      ipAddress,
      macAddress,
      locationId,
      building,
      floor,
      zone,
      cameraType,
      manufacturer,
      model,
      serialNumber,
      protocol,
      rtspUrl,
      onvifEnabled,
      nvrId,
      channelNumber,
      resolution,
      fps,
      floorX,
      floorY,
    } = req.body;

    if (!name || !cameraId || !ipAddress || !macAddress || !serialNumber || !rtspUrl) {
      return res.status(400).json({ success: false, message: 'Missing required camera fields.' });
    }

    const newCamera = await prisma.camera.create({
      data: {
        name,
        cameraId,
        ipAddress,
        macAddress,
        locationId,
        building: building || 'Main Building',
        floor: floor || 'Floor 1',
        zone: zone || 'General Zone',
        cameraType: cameraType || 'DOME',
        manufacturer: manufacturer || 'Generic',
        model: model || 'Standard IP Cam',
        serialNumber,
        protocol: protocol || 'RTSP',
        rtspUrl,
        onvifEnabled: onvifEnabled ?? true,
        nvrId,
        channelNumber: channelNumber || 1,
        resolution: resolution || '1080p',
        fps: fps || 30,
        floorX: floorX ?? 50.0,
        floorY: floorY ?? 50.0,
        status: 'ONLINE',
        recordingStatus: 'RECORDING',
      },
    });

    // Record Audit Log
    await prisma.auditLog.create({
      data: {
        action: 'CAMERA_CREATE',
        performedById: req.user?.id,
        performedByName: req.user?.name || 'Admin',
        role: req.user?.role || 'SUPER_ADMIN',
        target: newCamera.cameraId,
        details: `Created new IP Camera '${newCamera.name}' at IP ${newCamera.ipAddress}`,
      },
    });

    return res.status(201).json({ success: true, data: newCamera });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const updateCamera = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const existing = await prisma.camera.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Camera not found.' });
    }

    const updated = await prisma.camera.update({
      where: { id },
      data: updateData,
    });

    await prisma.auditLog.create({
      data: {
        action: 'CAMERA_UPDATE',
        performedById: req.user?.id,
        performedByName: req.user?.name || 'Admin',
        role: req.user?.role || 'SUPER_ADMIN',
        target: updated.cameraId,
        details: `Updated parameters for camera '${updated.name}'`,
      },
    });

    return res.json({ success: true, data: updated });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteCamera = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const camera = await prisma.camera.findUnique({ where: { id } });
    if (!camera) {
      return res.status(404).json({ success: false, message: 'Camera not found.' });
    }

    await prisma.camera.delete({ where: { id } });

    await prisma.auditLog.create({
      data: {
        action: 'CAMERA_DELETE',
        performedById: req.user?.id,
        performedByName: req.user?.name || 'Admin',
        role: req.user?.role || 'SUPER_ADMIN',
        target: camera.cameraId,
        details: `Deleted IP Camera '${camera.name}' (${camera.ipAddress})`,
      },
    });

    return res.json({ success: true, message: `Camera ${camera.cameraId} deleted successfully.` });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const testConnection = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const camera = await prisma.camera.findUnique({ where: { id } });
    if (!camera) {
      return res.status(404).json({ success: false, message: 'Camera not found.' });
    }

    // Diagnostics simulation
    const isOnline = camera.status !== 'OFFLINE';
    const pingTimeMs = isOnline ? Math.floor(Math.random() * 20) + 5 : 999;
    const tcp554 = isOnline;
    const rtspOk = isOnline;
    const onvifOk = isOnline && camera.onvifEnabled;

    const result = {
      cameraId: camera.cameraId,
      ipAddress: camera.ipAddress,
      ping: { ok: isOnline, latencyMs: pingTimeMs },
      tcpPort554: { ok: tcp554, service: 'RTSP Stream Socket' },
      rtspHandshake: { ok: rtspOk, codec: 'H.264 / AAC' },
      onvifProbe: { ok: onvifOk, profile: 'Profile S' },
      overallStatus: isOnline ? 'ONLINE' : 'OFFLINE',
      testedAt: new Date().toISOString(),
    };

    // Save diagnostic health log
    await prisma.healthLog.create({
      data: {
        cameraId: camera.id,
        pingOk: isOnline,
        pingMs: pingTimeMs,
        tcpPort554: tcp554,
        rtspOk: rtspOk,
        onvifOk: onvifOk,
        status: isOnline ? 'ONLINE' : 'OFFLINE',
      },
    });

    return res.json({ success: true, diagnostic: result });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
