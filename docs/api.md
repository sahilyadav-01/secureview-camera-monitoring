# SecureView REST & WebSocket API Documentation

Base URL: `/api/v1`

## 🔑 Authentication Endpoints

- `POST /api/v1/auth/login`
  - Body: `{ "email": "admin@secureview.local", "password": "..." }`
  - Response: `{ "token": "jwt...", "user": { ... } }`

- `POST /api/v1/auth/refresh`
  - Refresh access token

- `GET /api/v1/auth/me`
  - Get current authenticated profile and permissions

## 📹 Camera Management

- `GET /api/v1/cameras`
  - Query params: `location`, `status`, `building`, `floor`, `search`
- `GET /api/v1/cameras/:id`
  - Fetch detailed camera metadata, RTSP settings, and uptime logs
- `POST /api/v1/cameras`
  - Add camera
- `PUT /api/v1/cameras/:id`
  - Update camera specs
- `DELETE /api/v1/cameras/:id`
  - Remove camera
- `POST /api/v1/cameras/:id/test-connection`
  - Trigger live ICMP/TCP/RTSP diagnostic check

## 💾 NVR & Storage Management

- `GET /api/v1/nvrs`
  - List registered NVR units with channel load and storage usage
- `POST /api/v1/nvrs`
  - Register NVR unit
- `GET /api/v1/storage/analytics`
  - Summary of total storage, free space, retention estimation, disk health

## 🚨 Alerts & Incident Management

- `GET /api/v1/alerts`
  - List active & historical alerts by severity (`CRITICAL`, `HIGH`, `MEDIUM`, `LOW`)
- `PATCH /api/v1/alerts/:id/status`
  - Change alert state (`ACKNOWLEDGED`, `INVESTIGATING`, `RESOLVED`)
- `GET /api/v1/incidents`
  - List IT incident tickets
- `POST /api/v1/incidents`
  - Log new downtime or hardware failure ticket

## 📜 Audit Logs & Reports

- `GET /api/v1/audit-logs`
  - Search administrative action history
- `GET /api/v1/reports/uptime`
  - Fetch availability percentage reports and export CSV payload
