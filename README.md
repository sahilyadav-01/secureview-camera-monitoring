# SecureView — Enterprise IP Camera Monitoring & Infrastructure Platform

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18-cyan)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-20-green)](https://nodejs.org/)
[![Prisma](https://img.shields.io/badge/Prisma-5-purple)](https://www.prisma.io/)
[![Docker](https://img.shields.io/badge/Docker-Compose-blue)](https://www.docker.com/)

`SecureView` is a production-style **CCTV & IP Camera Management & Monitoring Platform** designed for IT Infrastructure Engineers and Security Operations Center (SOC) teams.

It goes far beyond a traditional CCTV video grid by offering automated **ICMP/TCP/RTSP health diagnostics**, **alert lifecycle management**, **NVR/DVR storage analytics**, **interactive spatial floor plans**, **IT incident ticketing**, **RBAC**, and **immutable security audit logs**.

---

## 🚀 High-Level Architecture

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

---

## ✨ Key Enterprise Modules & Capabilities

1. **📺 Live Multi-Channel CCTV Grid:**
   - Dynamic Matrix Grid switching: `1x1`, `2x2` (4 cameras), `3x3` (9 cameras), `4x4` (16 cameras).
   - RTSP/HLS stream simulation player with live OSD timestamps, frame rate indicators, resolution tags, and full-screen view.

2. **⚙️ Automated Health Diagnostics Engine:**
   - Dedicated background worker performing ICMP ping checks, TCP Port 554 RTSP socket probes, and HTTP ONVIF profile discovery every 30 seconds.
   - Real-time status transitions (`ONLINE` ➔ `UNREACHABLE` ➔ `OFFLINE`) with Socket.IO broadcasts.

3. **🚨 Alert Lifecycle Management:**
   - Automated alert triggers when camera/NVR connectivity fails or latency spikes above 300ms.
   - Full lifecycle workflow: `OPEN` ➔ `ACKNOWLEDGED` ➔ `INVESTIGATING` ➔ `RESOLVED`.

4. **🗺️ Interactive Spatial Floor Plan & Camera Map:**
   - Visual architectural layout of building floors with interactive camera markers glowing with live connection status.
   - Clickable nodes open camera diagnostic drawer.

5. **💾 NVR / DVR & Storage Analytics:**
   - Track NVR recording channels, vendor models, firmware versions, disk capacity utilization, and S.M.A.R.T HDD health metrics.
   - Retention forecaster calculating days remaining based on continuous H.265/4K bitrates.

6. **🛠️ IT Incident & Outage Ticketing System:**
   - Complete ITIL-style incident tickets with root cause analysis, downtime tracking, technician assignment, and troubleshooting logs.

7. **🔐 Role-Based Access Control (RBAC) & Audit Trail:**
   - Roles: `Super Admin`, `IT Admin`, `Security Operator`, `Viewer`.
   - Immutable audit logging tracking every administrative action, camera provisioning event, and alert resolution.

---

## 🛠️ Technology Stack

- **Frontend:** React 18, TypeScript, Vite, Tailwind CSS, Lucide Icons, Recharts, Socket.IO Client, React Router.
- **Backend:** Node.js, Express, TypeScript, Prisma ORM, JWT Authentication, bcryptjs, Socket.IO.
- **Monitoring Service:** Node.js worker, cron scheduler, ICMP/TCP diagnostic socket checkers.
- **DevOps & Infra:** Docker, Docker Compose, Nginx, GitHub Actions CI/CD pipeline, `.env` configurations.

---

## ⚡ Quick Start & Execution Guide

### 1. Repository Setup & Dependencies
```bash
# Clone the repository
git clone https://github.com/your-username/secureview.git
cd secureview

# Setup environment variables
cp .env.example .env
```

### 2. Launch Backend & Seed Production Demo Data
```bash
cd backend
npm install
npx prisma db push
npm run seed
npm run dev
```

### 3. Launch Health Diagnostics Service
```bash
cd ../monitoring-service
npm install
npm run dev
```

### 4. Launch Frontend Web App
```bash
cd ../frontend
npm install
npm run dev
```
Open `http://localhost:3000` in your web browser.

### Default Demo Credentials

| Role | Email | Password |
|---|---|---|
| Super Admin | `admin@secureview.local` | `SecureView2026!` |
| IT Admin | `it.admin@secureview.local` | `SecureView2026!` |
| Security Operator | `operator@secureview.local` | `SecureView2026!` |
| Viewer | `viewer@secureview.local` | `SecureView2026!` |

---

## 🐳 Docker Deployment

To launch all services (PostgreSQL, Redis, Backend, Monitoring Service, Frontend) in isolated Docker containers:

```bash
docker-compose up -d --build
```

---

## 📁 Repository Structure

```text
secureview/
├── frontend/             # React + Vite + TypeScript SOC Dashboard UI
├── backend/              # Node.js + Express + Prisma API Gateway
├── monitoring-service/   # Background ICMP/TCP/RTSP diagnostic engine
├── docs/                 # Architecture, API & Deployment Docs
│   ├── architecture.md
│   ├── api.md
│   └── deployment.md
├── .github/workflows/    # GitHub Actions CI/CD Pipeline
├── docker-compose.yml    # Multi-container orchestration
└── README.md
```

---

## 📄 License

Distributed under the MIT License. See [LICENSE](LICENSE) for details.
