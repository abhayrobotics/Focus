import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { dashboardRouter } from './routes/dashboard.js';
import { dsaRouter } from './routes/dsa.js';
import { projectsRouter } from './routes/projects.js';
import { interviewRouter } from './routes/interview.js';
import { sessionsRouter } from './routes/sessions.js';
import { parkingLotRouter } from './routes/parkingLot.js';
import { growthRouter } from './routes/growth.js';
import { roadmapRouter } from './routes/roadmap.js';
import { exportRouter } from './routes/export.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distPath = path.resolve(__dirname, '../dist');

const app = express();
const PORT = process.env.PORT || 5050;

app.use(cors());
app.use(express.json());

// API Routers
app.use('/api/dashboard', dashboardRouter);
app.use('/api/dsa', dsaRouter);
app.use('/api/projects', projectsRouter);
app.use('/api/interview', interviewRouter);
app.use('/api/work-sessions', sessionsRouter);
app.use('/api/sessions', sessionsRouter);
app.use('/api/parking-lot', parkingLotRouter);
app.use('/api/growth', growthRouter);
app.use('/api/roadmap', roadmapRouter);
app.use('/api/export', exportRouter);

app.get('/api/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// Serve frontend static assets in production
app.use(express.static(distPath));

app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api')) {
    return next();
  }
  res.sendFile(path.join(distPath, 'index.html'));
});

const server = app.listen(Number(PORT), '0.0.0.0', () => {
  console.log(`\n⚡ CareerOS Backend Server running at http://localhost:${PORT}`);
  console.log(`🎯 API endpoints ready at http://localhost:${PORT}/api\n`);
});

server.on('error', (err: any) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`\n❌ Port ${PORT} is already in use by another process. Please close existing instances or free port ${PORT}.\n`);
  } else {
    console.error('Server error:', err);
  }
});
