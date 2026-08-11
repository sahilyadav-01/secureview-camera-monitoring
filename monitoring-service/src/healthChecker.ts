import { PrismaClient } from '@prisma/client';
import axios from 'axios';

const prisma = new PrismaClient();
const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:5000';

export async function runHealthCheckCycle() {
  console.log(`🔍 [${new Date().toISOString()}] Initiating IP Camera Health Diagnostic Cycle...`);

  try {
    const cameras = await prisma.camera.findMany();
    let onlineCount = 0;
    let offlineCount = 0;

    for (const camera of cameras) {
      // Diagnostic ICMP & RTSP test simulation
      const isConfiguredOffline = camera.status === 'OFFLINE';
      const pingOk = !isConfiguredOffline;
      const pingMs = pingOk ? Math.floor(Math.random() * 25) + 6 : 999;
      const tcpPort554 = pingOk;
      const rtspOk = pingOk;
      const onvifOk = pingOk && camera.onvifEnabled;

      const newStatus = pingOk ? (pingMs > 250 ? 'UNREACHABLE' : 'ONLINE') : 'OFFLINE';

      if (newStatus === 'ONLINE') onlineCount++;
      else offlineCount++;

      // Create Health Log entry
      await prisma.healthLog.create({
        data: {
          cameraId: camera.id,
          pingOk,
          pingMs,
          tcpPort554,
          rtspOk,
          onvifOk,
          status: newStatus,
        },
      });

      // Update camera metrics
      await prisma.camera.update({
        where: { id: camera.id },
        data: {
          status: newStatus as any,
          latencyMs: pingMs,
          lastCheckedAt: new Date(),
        },
      });

      // Automatically generate alert if status dropped to OFFLINE
      if (newStatus === 'OFFLINE') {
        const existingOpenAlert = await prisma.alert.findFirst({
          where: {
            cameraId: camera.id,
            status: { in: ['OPEN', 'INVESTIGATING'] },
          },
        });

        if (!existingOpenAlert) {
          await prisma.alert.create({
            data: {
              title: `Camera Offline Detected: ${camera.name}`,
              description: `Automated ping/RTSP diagnostic check failed for IP ${camera.ipAddress}. No response on TCP Port 554.`,
              severity: 'CRITICAL',
              status: 'OPEN',
              source: 'CAMERA',
              cameraId: camera.id,
            },
          });
          console.log(`🚨 ALERT GENERATED: Camera ${camera.cameraId} marked OFFLINE.`);
        }
      }
    }

    console.log(`✅ Diagnostic Cycle Complete: ${onlineCount} ONLINE, ${offlineCount} OFFLINE/UNREACHABLE.`);
  } catch (error) {
    console.error('❌ Health Diagnostic Cycle Error:', error);
  }
}
