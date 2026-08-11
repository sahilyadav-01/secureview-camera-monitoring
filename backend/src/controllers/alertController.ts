import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middleware/authMiddleware';

const prisma = new PrismaClient();

export const getAlerts = async (req: AuthRequest, res: Response) => {
  try {
    const { severity, status, source } = req.query;

    const where: any = {};
    if (severity && typeof severity === 'string') where.severity = severity;
    if (status && typeof status === 'string') where.status = status;
    if (source && typeof source === 'string') where.source = source;

    const alerts = await prisma.alert.findMany({
      where,
      include: {
        camera: { select: { id: true, name: true, cameraId: true, ipAddress: true, building: true } },
        nvr: { select: { id: true, name: true, ipAddress: true } },
        assignedTo: { select: { id: true, name: true, email: true, role: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    return res.json({ success: true, count: alerts.length, data: alerts });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const updateAlertStatus = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { status, assignedToId } = req.body;

    const alert = await prisma.alert.findUnique({ where: { id } });
    if (!alert) {
      return res.status(404).json({ success: false, message: 'Alert not found.' });
    }

    const updated = await prisma.alert.update({
      where: { id },
      data: {
        status: status || alert.status,
        assignedToId: assignedToId !== undefined ? assignedToId : alert.assignedToId,
        resolvedAt: status === 'RESOLVED' ? new Date() : alert.resolvedAt,
      },
    });

    await prisma.auditLog.create({
      data: {
        action: 'ALERT_STATUS_CHANGE',
        performedById: req.user?.id,
        performedByName: req.user?.name || 'User',
        role: req.user?.role || 'OPERATOR',
        target: `Alert #${alert.id.slice(0, 8)}`,
        details: `Updated alert '${alert.title}' status to ${status}`,
      },
    });

    return res.json({ success: true, data: updated });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
