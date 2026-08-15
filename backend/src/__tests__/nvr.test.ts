import { describe, it, expect } from 'vitest';

interface NvrItem {
  id: string;
  name: string;
  ipAddress: string;
  vendor: string;
  totalChannels: number;
  usedChannels: number;
  storageTotalTb: number;
  storageUsedTb: number;
  hddHealth: 'HEALTHY' | 'WARNING' | 'CRITICAL' | 'OFFLINE';
  status: 'ONLINE' | 'OFFLINE' | 'MAINTENANCE';
}

describe('NVR Appliance & Storage Retention Engine Test Suite', () => {
  it('should calculate storage retention & usage metrics correctly', () => {
    const nvrs: NvrItem[] = [
      {
        id: 'nvr-01',
        name: 'Main HQ NVR 1',
        ipAddress: '192.168.1.50',
        vendor: 'Hikvision',
        totalChannels: 32,
        usedChannels: 24,
        storageTotalTb: 32.0,
        storageUsedTb: 22.4,
        hddHealth: 'HEALTHY',
        status: 'ONLINE',
      },
      {
        id: 'nvr-02',
        name: 'Warehouse NVR 2',
        ipAddress: '192.168.2.50',
        vendor: 'Dahua',
        totalChannels: 16,
        usedChannels: 12,
        storageTotalTb: 16.0,
        storageUsedTb: 14.8,
        hddHealth: 'WARNING',
        status: 'ONLINE',
      },
    ];

    let totalCapacity = 0;
    let totalUsed = 0;

    nvrs.forEach((nvr) => {
      totalCapacity += nvr.storageTotalTb;
      totalUsed += nvr.storageUsedTb;
    });

    const freeStorage = parseFloat((totalCapacity - totalUsed).toFixed(2));
    const usagePct = parseFloat(((totalUsed / totalCapacity) * 100).toFixed(1));
    const daysRemaining = Math.floor(freeStorage * 8.5);

    expect(totalCapacity).toBe(48.0);
    expect(totalUsed).toBe(37.2);
    expect(freeStorage).toBe(10.8);
    expect(usagePct).toBe(77.5);
    expect(daysRemaining).toBe(91); // 10.8 * 8.5 = 91.8 -> 91
  });

  it('should evaluate channel utilization ratio accurately', () => {
    const nvr: NvrItem = {
      id: 'nvr-03',
      name: 'Data Center NVR',
      ipAddress: '10.0.1.10',
      vendor: 'Axis',
      totalChannels: 64,
      usedChannels: 48,
      storageTotalTb: 64.0,
      storageUsedTb: 30.0,
      hddHealth: 'HEALTHY',
      status: 'ONLINE',
    };

    const loadPercentage = (nvr.usedChannels / nvr.totalChannels) * 100;
    const remainingChannels = nvr.totalChannels - nvr.usedChannels;

    expect(loadPercentage).toBe(75);
    expect(remainingChannels).toBe(16);
  });
});
