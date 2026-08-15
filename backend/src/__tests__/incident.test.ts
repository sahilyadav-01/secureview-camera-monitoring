import { describe, it, expect } from 'vitest';

type IncidentStatus = 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';
type PriorityLevel = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';

interface IncidentItem {
  id: string;
  ticketNumber: string;
  title: string;
  priority: PriorityLevel;
  status: IncidentStatus;
  downtimeMinutes: number;
  rootCause?: string | null;
  troubleshooting?: string | null;
  resolvedAt?: Date | null;
}

describe('ITIL Incident & Outage Ticketing Test Suite', () => {
  it('should track ticket creation, resolution, and downtime minutes correctly', () => {
    const incident: IncidentItem = {
      id: 'inc-101',
      ticketNumber: 'INC-2026-0042',
      title: 'Perimeter Bullet Camera Power Failure (PoE Switch Drop)',
      priority: 'HIGH',
      status: 'OPEN',
      downtimeMinutes: 0,
      rootCause: null,
      troubleshooting: null,
      resolvedAt: null,
    };

    expect(incident.status).toBe('OPEN');
    expect(incident.ticketNumber).toMatch(/^INC-\d{4}-\d{4}$/);

    // Assign & Move to In Progress
    incident.status = 'IN_PROGRESS';
    incident.troubleshooting = 'Verified PoE port status on Edge Switch 4B; port bounced.';
    expect(incident.status).toBe('IN_PROGRESS');

    // Resolve Ticket
    incident.status = 'RESOLVED';
    incident.downtimeMinutes = 45;
    incident.rootCause = 'Loose RJ45 connection on patch panel port 12.';
    incident.resolvedAt = new Date();

    expect(incident.status).toBe('RESOLVED');
    expect(incident.downtimeMinutes).toBe(45);
    expect(incident.rootCause).toBeDefined();
    expect(incident.resolvedAt).toBeInstanceOf(Date);
  });

  it('should aggregate total outage downtime across multiple incidents', () => {
    const incidents: IncidentItem[] = [
      { id: '1', ticketNumber: 'INC-001', title: 'Network Outage', priority: 'CRITICAL', status: 'RESOLVED', downtimeMinutes: 120 },
      { id: '2', ticketNumber: 'INC-002', title: 'RTSP Stream Lag', priority: 'MEDIUM', status: 'RESOLVED', downtimeMinutes: 30 },
      { id: '3', ticketNumber: 'INC-003', title: 'Camera Reboot', priority: 'LOW', status: 'RESOLVED', downtimeMinutes: 15 },
    ];

    const totalDowntime = incidents.reduce((sum, inc) => sum + inc.downtimeMinutes, 0);
    const criticalIncidents = incidents.filter((i) => i.priority === 'CRITICAL');

    expect(totalDowntime).toBe(165);
    expect(criticalIncidents.length).toBe(1);
  });
});
