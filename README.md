# SecureView — Enterprise IP Camera Monitoring & Infrastructure Platform

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18-cyan)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-20-green)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-4-lightgrey)](https://expressjs.com/)
[![Prisma](https://img.shields.io/badge/Prisma-5-purple)](https://www.prisma.io/)
[![Vitest](https://img.shields.io/badge/Vitest-1.3-yellow)](https://vitest.dev/)
[![Docker](https://img.shields.io/badge/Docker-Compose-blue)](https://www.docker.com/)

`SecureView` is a production-grade **CCTV & IP Camera Management & Monitoring Platform** designed for IT Infrastructure Engineers and Security Operations Center (SOC) teams. 

It delivers real-time visibility and control over enterprise video surveillance infrastructure through automated **ICMP/TCP/RTSP health diagnostics**, **alert lifecycle management**, **NVR/DVR storage analytics**, **interactive spatial floor plans**, **ITIL incident ticketing**, **RBAC**, and **immutable security audit logs**.

---

## 🚀 System Architecture & Data Flow

```text
                                  ┌──────────────────────────────┐
                                  │   Web Browser SOC Dashboard  │
                                  │ React 18 + TS + Tailwind CSS │
                                  └──────────────┬───────────────┘
                                                 │ HTTPS / Socket.IO
                                                 ▼
                                  ┌──────────────────────────────┐
                                  │      Backend API Gateway     │
                                  │   Node.js + Express + TS     │
                                  └──────────────┬───────────────┘
                                                 │
                  ┌──────────────────────────────┼──────────────────────────────┐
                  ▼                              ▼                              ▼
          ┌───────────────┐              ┌───────────────┐              ┌───────────────┐
          │  PostgreSQL   │              │  Redis Cache  │              │ Socket.IO Hub │
          │ (or SQLite)   │              │ & PubSub      │              │  Real-time    │
          └───────────────┘              └───────────────┘              └───────────────┘
                                                 │
                                                 ▼
                                  ┌──────────────────────────────┐
                                  │    Monitoring Worker Engine  │
                                  │ ICMP/TCP/RTSP Diagnostic Svc │
                                  └──────────────┬───────────────┘
                                                 │
                    ┌────────────────────────────┼────────────────────────────┐
                    ▼                            ▼                            ▼
              IP Cameras                     NVR / DVR                   Network
             (RTSP/ONVIF)                     Storage                   Equipment
```

### Core Architecture Components

| Service | Technology | Port | Description |
|---|---|---|---|
| **Frontend SOC App** | React 18, Vite, TypeScript, Tailwind | `:3000` | Single-page SOC monitoring dashboard with real-time Socket.IO subscriptions. |
| **Backend API Gateway** | Node.js, Express, Prisma ORM | `:5000` | REST API gateway, WebSocket hub, JWT authentication, and audit logger. |
| **Monitoring Engine** | Node.js, Cron, Socket.IO Client | `:5001` | Asynchronous worker performing ICMP ping, RTSP socket probes, and ONVIF health checks. |
| **Database** | PostgreSQL 15 (or SQLite fallback) | `:5432` | Relational storage for camera metadata, NVR configurations, alerts, and audit logs. |
| **Cache & Queue** | Redis 7 | `:6379` | Fast caching, rate-limiting, and PubSub message transport. |

---

## ✨ Key Enterprise Capabilities

### 1. 📺 Live Multi-Channel CCTV Grid & Stream Player
- **Dynamic Matrix Layouts:** Toggle between `1x1`, `2x2` (4 channels), `3x3` (9 channels), and `4x4` (16 channels) video walls.
- **RTSP/HLS Player:** Stream player simulation with live OSD timestamps, frame rate indicators (FPS), resolution tags, snapshot tool, and PTZ controls.

### 2. ⚙️ Automated Health Diagnostics Engine
- **Multi-Protocol Diagnostics:** Background worker performing periodic ICMP pings, TCP Port 554 RTSP socket probes, and HTTP ONVIF profile discovery every 30 seconds.
- **Real-Time State Machine:** Automatic state updates (`ONLINE` ➔ `UNREACHABLE` ➔ `OFFLINE`) broadcasted to SOC dashboards via Socket.IO events.

### 3. 🚨 Alert Lifecycle Management
- **Automated Alert Triggers:** Generates operational alerts on camera/NVR packet loss or latency spikes (>300ms).
- **Incident Workflow:** Structured state transition pipeline (`OPEN` ➔ `ACKNOWLEDGED` ➔ `INVESTIGATING` ➔ `RESOLVED`) with assigned security operators.

### 4. 🗺️ Interactive Spatial Floor Map Editor & Viewer
- **Architectural Layout View:** Architectural building floor maps with interactive camera markers.
- **Status Halos:** Camera markers glow according to live connection status (`ONLINE`, `UNREACHABLE`, `OFFLINE`).
- **Draggable Coordinate Placement:** Real-time marker positioning and click-to-preview video drawers.

### 5. 💾 NVR / DVR & Storage Retention Analytics
- **Storage Pool Utilization:** Monitor NVR channel load, storage capacity, RAID configurations, and S.M.A.R.T HDD diagnostic metrics.
- **Retention Forecaster:** Predictive calculator estimating continuous recording days remaining based on H.264/H.265 bitrates and resolution.

### 6. 🛠️ ITIL Incident Ticketing System
- **Hardware & Network Outages:** Track downtime in minutes, document root cause analysis (RCA), assign IT technicians, and log resolution steps.

### 7. 📊 Executive SLA Reports & Data Export
- **Uptime SLA Metrics:** Generate availability reports across locations and camera models with CSV data export.

### 8. 🔐 Role-Based Access Control (RBAC) & Audit Trail
- **Granular User Roles:** `Super Admin`, `IT Admin`, `Security Operator`, and `Viewer`.
- **Immutable Security Log:** Comprehensive audit log tracking every administrative action, camera modification, and alert resolution with actor IP address.

---

## 🛠️ Technology Stack

- **Frontend:** React 18, TypeScript, Vite, Tailwind CSS, Lucide Icons, Recharts, Socket.IO Client, React Router DOM.
- **Backend:** Node.js, Express, TypeScript, Prisma ORM, JWT Authentication, bcryptjs, Socket.IO, Zod validation.
- **Monitoring Service:** Node.js, `node-cron`, `axios`, TCP socket checkers, Socket.IO Client.
- **Testing & Quality:** Vitest for backend unit tests, TypeScript strict mode, ESLint.
- **DevOps & Infra:** Docker, Docker Compose, Nginx, GitHub Actions CI/CD pipeline, Environment template configurations.

---

## ⚡ Quick Start & Setup Guide

### 1. Prerequisites
- **Node.js** v18.x or v20.x
- **npm** v9.x+ or **pnpm**
- **Docker & Docker Compose** *(optional for containerized setup)*

### 2. Clone Repository & Setup Environment
```bash
# Clone repository
git clone https://github.com/your-username/secureview.git
cd secureview

# Create root environment file
cp .env.example .env
```

### 3. Setup Backend & Seed Database
```bash
cd backend
npm install

# Push Prisma schema to SQLite (or configured PostgreSQL)
npx prisma db push

# Seed initial production demo data
npm run seed

# Start backend dev server (Port 5000)
npm run dev
```

### 4. Start Health Monitoring Service
```bash
cd ../monitoring-service
npm install

# Start monitoring diagnostic worker (Port 5001)
npm run dev
```

### 5. Start Frontend SOC Web App
```bash
cd ../frontend
npm install

# Start Vite dev server (Port 3000)
npm run dev
```
Open **`http://localhost:3000`** in your browser.

---

## 🔑 Pre-Seeded Demo Accounts

| Role | Email | Password | Permissions |
|---|---|---|---|
| **Super Admin** | `admin@secureview.local` | `SecureView2026!` | Full system control, user management, audit logs, NVR & camera config. |
| **IT Admin** | `it.admin@secureview.local` | `SecureView2026!` | Camera CRUD, NVR configuration, storage analytics, incident resolution. |
| **Security Operator** | `operator@secureview.local` | `SecureView2026!` | Live CCTV grid monitoring, spatial floor map, alert acknowledgment, PTZ control. |
| **Viewer** | `viewer@secureview.local` | `SecureView2026!` | Read-only view of live feeds and basic uptime status. |

---

## 🐳 Docker Deployment

To build and run all services in isolated containers (PostgreSQL, Redis, Backend, Monitoring Engine, Nginx Frontend):

```bash
docker-compose up -d --build
```

### Container Endpoints:
- **Frontend SOC Dashboard:** `http://localhost:3000`
- **Backend API Gateway:** `http://localhost:5000/api/v1`
- **Monitoring Service:** `http://localhost:5001`
- **PostgreSQL Database:** `localhost:5432`
- **Redis Cache:** `localhost:6379`

To stop and remove containers:
```bash
docker-compose down -v
```

---

## 🧪 Testing & Code Quality

### Backend Unit & Integration Tests
Execute the Vitest test suite covering authentication, camera endpoints, health diagnostic workers, operational alerts, NVR storage retention, ITIL incident lifecycle, and security audit logging (7 test suites, 17 unit tests):
```bash
cd backend
npm test
```

### TypeScript Type Verification
```bash
# Verify Backend
cd backend && npm run type-check

# Verify Frontend
cd frontend && npm run type-check

# Verify Monitoring Service
cd monitoring-service && npm run type-check
```

---

## 📡 REST API Summary

Base URL: `/api/v1`

| Category | Endpoint | Method | Description |
|---|---|---|---|
| **Auth** | `/api/v1/auth/login` | `POST` | Authenticate user & issue JWT token. |
| **Auth** | `/api/v1/auth/me` | `GET` | Retrieve current user profile & permissions. |
| **Cameras** | `/api/v1/cameras` | `GET` / `POST` | List all cameras or provision a new camera. |
| **Cameras** | `/api/v1/cameras/:id` | `GET` / `PUT` / `DELETE` | Retrieve, update, or delete specific camera. |
| **Cameras** | `/api/v1/cameras/:id/test-connection` | `POST` | Trigger immediate diagnostic probe. |
| **NVRs** | `/api/v1/nvrs` | `GET` / `POST` | Fetch registered NVR appliances or add new unit. |
| **Storage** | `/api/v1/storage/analytics` | `GET` | Summary of SAN/NAS utilization and retention forecast. |
| **Alerts** | `/api/v1/alerts` | `GET` | Filter operational alerts by severity and status. |
| **Alerts** | `/api/v1/alerts/:id/status` | `PATCH` | Update alert workflow state (`ACKNOWLEDGED`, `RESOLVED`). |
| **Incidents**| `/api/v1/incidents` | `GET` / `POST` | Retrieve or create ITIL incident tickets. |
| **Audit** | `/api/v1/audit-logs` | `GET` | Query security audit log history. |
| **Reports** | `/api/v1/reports/uptime` | `GET` | Retrieve camera SLA availability percentages. |

*For detailed API payload specifications, see [docs/api.md](docs/api.md).*

---

## 📁 Repository Structure

```text
secureview/
├── .github/
│   └── workflows/          # GitHub Actions CI/CD Pipeline
├── backend/                # Express API Gateway & WebSocket Server
│   ├── prisma/             # Database Schema & Seeder Script
│   │   ├── schema.prisma
│   │   └── seed.ts
│   └── src/
│       ├── __tests__/      # Vitest Suite (Auth, Cameras, Health)
│       ├── controllers/    # API Controllers
│       ├── middleware/     # Auth & Role RBAC Middlewares
│       ├── routes/         # Express Router Modules
│       ├── services/       # Diagnostics & Socket.IO Services
│       └── server.ts       # Application Entry Point
├── frontend/               # React 18 + Vite SOC Dashboard App
│   ├── src/
│   │   ├── components/     # UI Components (Camera Cards, Header, Sidebar)
│   │   ├── pages/          # 12 SOC Views (LiveGrid, FloorPlan, Alerts, etc.)
│   │   ├── context/        # Auth & Real-Time Socket Contexts
│   │   ├── services/       # Axios API Client
│   │   └── types/          # TypeScript Domain Interfaces
│   └── nginx.conf          # Production Reverse Proxy Config
├── monitoring-service/     # Asynchronous ICMP/TCP/RTSP Health Diagnostics Worker
│   └── src/
│       ├── checker.ts      # Diagnostic Ping & Socket Logic
│       └── index.ts        # Cron Scheduler & Broadcast Dispatcher
├── docs/                   # Platform Technical Specifications
│   ├── api.md              # REST & WebSocket API Contract
│   ├── architecture.md     # Architecture Blueprint & Data Flow
│   ├── database.md         # Data Models & Schema Design
│   └── deployment.md       # Production Deployment Guide
├── docker-compose.yml      # Multi-container orchestration specification
├── .env.example            # Master environment template
├── LICENSE                 # MIT License
└── README.md               # Project documentation homepage
```

---

## 📚 Technical Documentation

For deeper architectural and deployment details, consult the documentation in `docs/`:

- 📐 **[Architecture Blueprint](docs/architecture.md):** In-depth view of RTSP transcoding, diagnostic loops, and system components.
- 🔌 **[API Specifications](docs/api.md):** Complete REST API contracts and WebSocket event schema.
- 🗄️ **[Database & Schema Design](docs/database.md):** Entity-relationship diagrams and field descriptions.
- 🚀 **[Deployment Guide](docs/deployment.md):** Production hardening, SSL termination, and Docker configuration.

---

## 📄 License

Distributed under the **MIT License**. See [LICENSE](LICENSE) for more information.
