import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middleware/authMiddleware';

const prisma = new PrismaClient();

export const getAuditLogs = async (req: AuthRequest, res: Response) => {
  try {
    const { action, role, search } = req.query;

    const where: any = {};
    if (action && typeof action === 'string') where.action = action;
    if (role && typeof role === 'string') where.role = role;
    if (search && typeof search === 'string') {
      where.OR = [
        { performedByName: { contains: search } },
        { target: { contains: search } },
        { details: { contains: search } },
      ];
    }

    const logs = await prisma.auditLog.findMany({
      where,
      orderBy: { timestamp: 'desc' },
      take: 100,
    });

    return res.json({ success: true, count: logs.length, data: logs });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
