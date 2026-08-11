import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middleware/authMiddleware';

const prisma = new PrismaClient();

export const getNvrs = async (req: AuthRequest, res: Response) => {
  try {
    const nvrs = await prisma.nvr.findMany({
      include: {
        location: true,
        cameras: {
          select: {
            id: true,
            name: true,
            cameraId: true,
            status: true,
            channelNumber: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return res.json({ success: true, count: nvrs.length, data: nvrs });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const createNvr = async (req: AuthRequest, res: Response) => {
  try {
    const { name, ipAddress, vendor, model, serialNumber, totalChannels, storageTotalTb, locationId } = req.body;

    if (!name || !ipAddress || !vendor || !serialNumber) {
      return res.status(400).json({ success: false, message: 'Missing required NVR fields.' });
    }

    const nvr = await prisma.nvr.create({
      data: {
        name,
        ipAddress,
        vendor,
        model: model || 'Standard NVR',
        serialNumber,
        totalChannels: totalChannels || 32,
        storageTotalTb: storageTotalTb || 10.0,
        locationId,
      },
    });

    await prisma.auditLog.create({
      data: {
        action: 'NVR_CREATE',
        performedById: req.user?.id,
        performedByName: req.user?.name || 'Admin',
        role: req.user?.role || 'SUPER_ADMIN',
        target: nvr.name,
        details: `Registered new NVR Recorder ${nvr.name} (${nvr.ipAddress})`,
      },
    });

    return res.status(201).json({ success: true, data: nvr });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getStorageAnalytics = async (req: AuthRequest, res: Response) => {
  try {
    const nvrs = await prisma.nvr.findMany();
    
    let totalStorageTb = 0;
    let usedStorageTb = 0;
    
    nvrs.forEach((n: any) => {
      totalStorageTb += n.storageTotalTb;
      usedStorageTb += n.storageUsedTb;
    });

    const freeStorageTb = Math.max(0, totalStorageTb - usedStorageTb);
    const usagePercentage = totalStorageTb > 0 ? ((usedStorageTb / totalStorageTb) * 100).toFixed(1) : 0;
    const estimatedDaysRemaining = Math.floor(freeStorageTb * 8.5); // ~8.5 days per TB at standard bitrate

    return res.json({
      success: true,
      summary: {
        totalStorageTb,
        usedStorageTb: parseFloat(usedStorageTb.toFixed(2)),
        freeStorageTb: parseFloat(freeStorageTb.toFixed(2)),
        usagePercentage: Number(usagePercentage),
        estimatedDaysRemaining,
        activeNvrs: nvrs.length,
      },
      nvrBreakdown: nvrs,
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
