import express from 'express';
import http from 'http';
import { Server as SocketIOServer } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes';
import cameraRoutes from './routes/cameraRoutes';
import alertRoutes from './routes/alertRoutes';
import nvrRoutes from './routes/nvrRoutes';
import incidentRoutes from './routes/incidentRoutes';
import auditRoutes from './routes/auditRoutes';
import reportRoutes from './routes/reportRoutes';

dotenv.config();

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 5000;

// Enable Socket.IO
const io = new SocketIOServer(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/cameras', cameraRoutes);
app.use('/api/v1/alerts', alertRoutes);
app.use('/api/v1/nvrs', nvrRoutes);
app.use('/api/v1/incidents', incidentRoutes);
app.use('/api/v1/audit-logs', auditRoutes);
app.use('/api/v1/reports', reportRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'HEALTHY', timestamp: new Date().toISOString(), service: 'SecureView Backend API' });
});

// Socket.IO Events
io.on('connection', (socket) => {
  console.log(`🔌 Client connected to SecureView WebSockets: ${socket.id}`);

  socket.on('disconnect', () => {
    console.log(`❌ Client disconnected: ${socket.id}`);
  });
});

// Export Socket.IO for monitoring worker or broadcast helpers
export { io };

server.listen(PORT, () => {
  console.log(`🚀 SecureView Backend Gateway running on http://localhost:${PORT}`);
});
