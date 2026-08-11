# SecureView Architecture Overview

`SecureView` is designed as a enterprise-grade CCTV & IP Camera Monitoring and Infrastructure Management Platform.

## 🏗 System Design Diagram

```text
                    ┌──────────────────────────────┐
                    │      Web Browser (SOC)       │
                    │ React + TS + Tailwind CSS    │
                    └──────────────┬───────────────┘
                                   │ HTTPS / Socket.IO
                                   ▼
                    ┌──────────────────────────────┐
                    │      Backend API Gateway     │
                    │   Node.js + Express + TS     │
                    └──────────────┬───────────────┘
                                   │
            ┌──────────────────────┼──────────────────────┐
            ▼                      ▼                      ▼
    ┌───────────────┐      ┌───────────────┐      ┌───────────────┐
    │  PostgreSQL   │      │  Redis Cache  │      │ Socket.IO Hub │
    │ Database      │      │ & Queue       │      │  Real-time    │
    └───────────────┘      └───────────────┘      └───────────────┘
                                   │
                                   ▼
                    ┌──────────────────────────────┐
                    │    Monitoring Worker Engine  │
                    │ ICMP/TCP/RTSP Diagnostic Svc │
                    └──────────────┬───────────────┘
                                   │
              ┌────────────────────┼────────────────────┐
              ▼                    ▼                    ▼
        IP Cameras             NVR/DVR               Network
        (RTSP/ONVIF)           Storage              Equipment
```

## 🔐 Role-Based Access Control (RBAC)

1. **Super Admin**: Complete management over users, roles, system parameters, NVR, cameras, and audit logs.
2. **IT Admin**: Camera CRUD, NVR configuration, storage analytics, health alert settings, incident resolution.
3. **Security Operator**: Live monitoring SOC layout grid, interactive floor plans, alert acknowledgment, camera PTZ view.
4. **Viewer**: Read-only camera view and status monitoring.

## 📡 RTSP & Streaming Architecture

Browsers cannot natively render raw `rtsp://` streams due to codec and browser security limits. SecureView uses a transcoding and stream gateway model:
- RTSP streams are transcoded or converted into HLS / WebRTC / Canvas Video payloads.
- Low-latency Canvas/Video Player fallbacks present live simulated and actual stream telemetry.

## ⚙️ Health Diagnostics Service

The Monitoring Worker runs asynchronous background jobs:
1. **ICMP Ping Check**: Ping IP addresses every 15-30s to record latency and connectivity.
2. **TCP Port 554 Check**: Verify RTSP media server socket availability.
3. **HTTP/ONVIF Port Check**: Probe API port status (Port 80/8080).
4. **State Machine & Alerts**: Transitions camera state (ONLINE <-> UNREACHABLE <-> OFFLINE) and automatically generates system alerts.
