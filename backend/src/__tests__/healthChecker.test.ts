import { describe, it, expect } from 'vitest';

describe('Camera Health Diagnostic & Ping Test Suite', () => {
  function simulateDiagnosticCheck(camera: { status: string; latencyMs: number; onvifEnabled: boolean }) {
    const isConfiguredOffline = camera.status === 'OFFLINE';
    const pingOk = !isConfiguredOffline;
    const pingMs = pingOk ? camera.latencyMs : 999;
    const tcpPort554 = pingOk;
    const rtspOk = pingOk;
    const onvifOk = pingOk && camera.onvifEnabled;

    const detectedStatus = pingOk ? (pingMs > 250 ? 'UNREACHABLE' : 'ONLINE') : 'OFFLINE';

    return {
      pingOk,
      pingMs,
      tcpPort554,
      rtspOk,
      onvifOk,
      detectedStatus,
      shouldTriggerAlert: detectedStatus === 'OFFLINE' || detectedStatus === 'UNREACHABLE',
    };
  }

  it('should detect ONLINE status for low-latency camera', () => {
    const res = simulateDiagnosticCheck({ status: 'ONLINE', latencyMs: 14, onvifEnabled: true });
    expect(res.pingOk).toBe(true);
    expect(res.tcpPort554).toBe(true);
    expect(res.detectedStatus).toBe('ONLINE');
    expect(res.shouldTriggerAlert).toBe(false);
  });

  it('should detect UNREACHABLE status for high-latency camera (>250ms)', () => {
    const res = simulateDiagnosticCheck({ status: 'ONLINE', latencyMs: 340, onvifEnabled: true });
    expect(res.pingOk).toBe(true);
    expect(res.detectedStatus).toBe('UNREACHABLE');
    expect(res.shouldTriggerAlert).toBe(true);
  });

  it('should trigger CRITICAL alert condition when ping/RTSP fails', () => {
    const res = simulateDiagnosticCheck({ status: 'OFFLINE', latencyMs: 999, onvifEnabled: true });
    expect(res.pingOk).toBe(false);
    expect(res.detectedStatus).toBe('OFFLINE');
    expect(res.shouldTriggerAlert).toBe(true);
  });
});
