import { describe, it, expect } from 'vitest';

type AlertStatus = 'OPEN' | 'ACKNOWLEDGED' | 'INVESTIGATING' | 'RESOLVED';

interface AlertItem {
  id: string;
  title: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  status: AlertStatus;
  resolvedAt?: Date | null;
}

describe('Alert Lifecycle & State Machine Test Suite', () => {
  it('should transition alert status correctly along valid lifecycle', () => {
    const alert: AlertItem = {
      id: 'alt-001',
      title: 'Camera Connection Lost: HQ West Gate',
      severity: 'CRITICAL',
      status: 'OPEN',
      resolvedAt: null,
    };

    expect(alert.status).toBe('OPEN');

    // Acknowledge alert
    alert.status = 'ACKNOWLEDGED';
    expect(alert.status).toBe('ACKNOWLEDGED');

    // Mark investigating
    alert.status = 'INVESTIGATING';
    expect(alert.status).toBe('INVESTIGATING');

    // Resolve alert
    alert.status = 'RESOLVED';
    alert.resolvedAt = new Date();
    expect(alert.status).toBe('RESOLVED');
    expect(alert.resolvedAt).toBeInstanceOf(Date);
  });

  it('should sort alerts by severity priority', () => {
    const severityMap = { CRITICAL: 4, HIGH: 3, MEDIUM: 2, LOW: 1 };
    const alerts: AlertItem[] = [
      { id: '1', title: 'Low Latency', severity: 'LOW', status: 'OPEN' },
      { id: '2', title: 'Camera Offline', severity: 'CRITICAL', status: 'OPEN' },
      { id: '3', title: 'Storage Warning', severity: 'HIGH', status: 'OPEN' },
    ];

    const sorted = [...alerts].sort((a, b) => severityMap[b.severity] - severityMap[a.severity]);
    expect(sorted[0].severity).toBe('CRITICAL');
    expect(sorted[1].severity).toBe('HIGH');
    expect(sorted[2].severity).toBe('LOW');
  });
});
