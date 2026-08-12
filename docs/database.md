# SecureView Database Schema & Entity Relationship Specification

SecureView uses Prisma ORM with support for PostgreSQL (Production) and SQLite (Development/Test environments).

## 🗄 Entity Relationship Model (ERD)

```text
  ┌───────────┐         1:N         ┌───────────┐
  │ Location  │ ───────────────────>│   Camera  │
  └─────┬─────┘                     └─────┬─────┘
        │ 1:N                             │ 1:N
        ▼                                 ▼
  ┌───────────┐                     ┌───────────┐
  │    NVR    │                     │ HealthLog │
  └─────┬─────┘                     └───────────┘
        │ 1:N                             │ 1:N
        └────────────────┐ ┌──────────────┘
                         ▼ ▼
                    ┌───────────┐
                    │   Alert   │
                    └─────┬─────┘
                          │ N:1
                          ▼
                    ┌───────────┐
                    │ Incident  │
                    └───────────┘
```

## 📋 Data Models Overview

### 1. User (`User`)
Stores operator and administrator credentials, avatars, and RBAC roles.
- `id` (UUID, Primary Key)
- `email` (String, Unique)
- `password` (Hashed String)
- `role` (Enum: `SUPER_ADMIN`, `IT_ADMIN`, `SECURITY_OPERATOR`, `VIEWER`)
- `department` (String)

### 2. Location (`Location`)
Physical sites, facilities, and campus buildings.
- `id` (UUID, Primary Key)
- `name` (String)
- `code` (String, Unique)
- `building` (String)
- `floors` (Int)

### 3. NVR / DVR (`Nvr`)
Network Video Recorder devices and storage nodes.
- `id` (UUID, Primary Key)
- `name` (String)
- `ipAddress` (String, Unique)
- `totalChannels` (Int)
- `usedChannels` (Int)
- `storageTotalTb` (Float)
- `storageUsedTb` (Float)
- `hddHealth` (Enum: `HEALTHY`, `WARNING`, `CRITICAL`, `OFFLINE`)

### 4. Camera (`Camera`)
IP Camera metadata, RTSP parameters, coordinates, and real-time status.
- `id` (UUID, Primary Key)
- `cameraId` (String, Unique identifier e.g., `CAM-HQ-001`)
- `ipAddress` (String, Unique)
- `rtspUrl` (String)
- `onvifEnabled` (Boolean)
- `status` (Enum: `ONLINE`, `OFFLINE`, `UNREACHABLE`, `MAINTENANCE`)
- `recordingStatus` (Enum: `RECORDING`, `STOPPED`, `ERROR`)
- `floorX`, `floorY` (Float coordinates for floor-plan placement)

### 5. Health Log (`HealthLog`)
Periodic diagnostic check results.
- `id` (UUID, Primary Key)
- `cameraId` (Foreign Key -> `Camera`)
- `pingOk` (Boolean)
- `pingMs` (Int)
- `tcpPort554` (Boolean)
- `checkedAt` (Timestamp)

### 6. Alert (`Alert`)
Automated and manual security/hardware alerts.
- `id` (UUID, Primary Key)
- `severity` (Enum: `CRITICAL`, `HIGH`, `MEDIUM`, `LOW`)
- `status` (Enum: `OPEN`, `ACKNOWLEDGED`, `INVESTIGATING`, `RESOLVED`)
- `cameraId`, `nvrId`, `assignedToId` (Optional Foreign Keys)

### 7. Incident (`Incident`)
IT ticketing and downtime tracking.
- `ticketNumber` (String, Unique e.g., `INC-2026-00891`)
- `downtimeMinutes` (Int)
- `status` (Enum: `OPEN`, `IN_PROGRESS`, `RESOLVED`, `CLOSED`)

### 8. Audit Log (`AuditLog`)
Compliance tracking for configuration changes.
- `action`, `performedByName`, `role`, `target`, `timestamp`, `ipAddress`
