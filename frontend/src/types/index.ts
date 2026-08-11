export type Role = 'SUPER_ADMIN' | 'IT_ADMIN' | 'SECURITY_OPERATOR' | 'VIEWER';

export type CameraStatus = 'ONLINE' | 'OFFLINE' | 'UNREACHABLE' | 'MAINTENANCE';
export type RecordingStatus = 'RECORDING' | 'STOPPED' | 'ERROR';
export type AlertSeverity = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
export type AlertStatus = 'OPEN' | 'ACKNOWLEDGED' | 'INVESTIGATING' | 'RESOLVED';
export type IncidentStatus = 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';
export type NvrHealth = 'HEALTHY' | 'WARNING' | 'CRITICAL' | 'OFFLINE';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  department: string;
  avatarUrl?: string;
}

export interface Location {
  id: string;
  name: string;
  code: string;
  address: string;
  building: string;
  floors: number;
}

export interface Nvr {
  id: string;
  name: string;
  ipAddress: string;
  vendor: string;
  model: string;
  serialNumber: string;
  totalChannels: number;
  usedChannels: number;
  storageTotalTb: number;
  storageUsedTb: number;
  hddHealth: NvrHealth;
  status: string;
  firmwareVersion: string;
  location?: Location;
  cameras?: Camera[];
}

export interface Camera {
  id: string;
  name: string;
  cameraId: string;
  ipAddress: string;
  macAddress: string;
  locationId?: string;
  location?: Location;
  building: string;
  floor: string;
  zone: string;
  cameraType: 'DOME' | 'BULLET' | 'PTZ' | 'THERMAL' | '360_PANORAMIC';
  manufacturer: string;
  model: string;
  serialNumber: string;
  protocol: string;
  rtspUrl: string;
  onvifEnabled: boolean;
  nvrId?: string;
  nvr?: Nvr;
  channelNumber: number;
  resolution: string;
  fps: number;
  status: CameraStatus;
  recordingStatus: RecordingStatus;
  streamUrl?: string;
  installDate: string;
  latencyMs: number;
  lastCheckedAt: string;
  floorX?: number;
  floorY?: number;
  healthLogs?: HealthLog[];
  alerts?: Alert[];
  incidents?: Incident[];
}

export interface HealthLog {
  id: string;
  cameraId: string;
  pingOk: boolean;
  pingMs: number;
  tcpPort554: boolean;
  rtspOk: boolean;
  onvifOk: boolean;
  status: string;
  checkedAt: string;
}

export interface Alert {
  id: string;
  title: string;
  description: string;
  severity: AlertSeverity;
  status: AlertStatus;
  source: string;
  cameraId?: string;
  camera?: Partial<Camera>;
  nvrId?: string;
  nvr?: Partial<Nvr>;
  assignedToId?: string;
  assignedTo?: Partial<User>;
  resolvedAt?: string;
  createdAt: string;
}

export interface Incident {
  id: string;
  ticketNumber: string;
  title: string;
  description: string;
  cameraId?: string;
  camera?: Partial<Camera>;
  priority: string;
  status: IncidentStatus;
  rootCause?: string;
  troubleshooting?: string;
  downtimeMinutes: number;
  assignedToId?: string;
  assignedTo?: Partial<User>;
  createdAt: string;
}

export interface AuditLog {
  id: string;
  action: string;
  performedByName: string;
  role: string;
  target: string;
  details: string;
  ipAddress: string;
  timestamp: string;
}
