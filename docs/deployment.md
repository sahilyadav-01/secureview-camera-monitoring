# SecureView Deployment Guide

This document covers local development setup, containerized deployment via Docker Compose, and production deployment options.

## 🚀 Quick Start (Local Development)

### 1. Prerequisites
- Node.js 18+ or 20+
- npm 9+
- Docker & Docker Compose (optional for postgres/redis)

### 2. Environment Setup
```bash
cp .env.example .env
```

### 3. Run Backend & Seed Data
```bash
cd backend
npm install
npx prisma db push
npm run seed
npm run dev
```

### 4. Run Monitoring Service
```bash
cd monitoring-service
npm install
npm run dev
```

### 5. Run Frontend
```bash
cd frontend
npm install
npm run dev
```
Open `http://localhost:3000` in your browser.

## 🐳 Docker Deployment

To launch the full stack with isolated containers for PostgreSQL, Redis, Node Backend, Monitoring Worker, and Nginx Frontend:

```bash
docker-compose up -d --build
```

Access:
- Frontend SOC Dashboard: `http://localhost:3000`
- Backend API: `http://localhost:5000/api/v1`
- Monitoring Diagnostics: `http://localhost:5001`
