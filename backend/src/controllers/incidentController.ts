import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middleware/authMiddleware';

const prisma = new PrismaClient();

export const getIncidents = async (req: AuthRequest, res: Response) => {
  try {
    const { status, priority } = req.query;

    const where: any = {};
    if (status && typeof status === 'string') where.status = status;
    if (priority && typeof priority === 'string') where.priority = priority;

    const incidents = await prisma.incident.findMany({
      where,
      include: {
        camera: { select: { id: true, name: true, cameraId: true, ipAddress: true, building: true } },
        assignedTo: { select: { id: true, name: true, email: true, role: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    return res.json({ success: true, count: incidents.length, data: incidents });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const createIncident = async (req: AuthRequest, res: Response) => {
  try {
    const { title, description, cameraId, priority, assignedToId } = req.body;

    if (!title || !description) {
      return res.status(400).json({ success: false, message: 'Title and description are required.' });
    }

    const ticketNumber = `INC-2026-${Math.floor(1000 + Math.random() * 9000)}`;

    const incident = await prisma.incident.create({
      data: {
        ticketNumber,
        title,
        description,
        cameraId,
        priority: priority || 'HIGH',
        assignedToId,
        status: 'OPEN',
      },
    });

    await prisma.auditLog.create({
      data: {
        action: 'INCIDENT_CREATE',
        performedById: req.user?.id,
        performedByName: req.user?.name || 'Engineer',
        role: req.user?.role || 'IT_ADMIN',
        target: ticketNumber,
        details: `Logged IT incident ticket '${ticketNumber}' for issue: ${title}`,
      },
    });

    return res.status(201).json({ success: true, data: incident });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const updateIncident = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { status, rootCause, troubleshooting, downtimeMinutes, assignedToId } = req.body;

    const incident = await prisma.incident.findUnique({ where: { id } });
    if (!incident) {
      return res.status(404).json({ success: false, message: 'Incident ticket not found.' });
    }

    const updated = await prisma.incident.update({
      where: { id },
      data: {
        status: status || incident.status,
        rootCause: rootCause || incident.rootCause,
        troubleshooting: troubleshooting || incident.troubleshooting,
        downtimeMinutes: downtimeMinutes !== undefined ? Number(downtimeMinutes) : incident.downtimeMinutes,
        assignedToId: assignedToId || incident.assignedToId,
        resolvedAt: status === 'RESOLVED' || status === 'CLOSED' ? new Date() : incident.resolvedAt,
      },
    });

    await prisma.auditLog.create({
      data: {
        action: 'INCIDENT_UPDATE',
        performedById: req.user?.id,
        performedByName: req.user?.name || 'Engineer',
        role: req.user?.role || 'IT_ADMIN',
        target: incident.ticketNumber,
        details: `Updated incident ticket '${incident.ticketNumber}' status to ${status}`,
      },
    });

    return res.json({ success: true, data: updated });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
