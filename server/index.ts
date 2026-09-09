import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { dashboardRouter } from './routes/dashboard.js';
import { dsaRouter } from './routes/dsa.js';
import { projectsRouter } from './routes/projects.js';
import { interviewRouter } from './routes/interview.js';
import { sessionsRouter } from './routes/sessions.js';
import { parkingLotRouter } from './routes/parkingLot.js';
import { growthRouter } from './routes/growth.js';
import { roadmapRouter } from './routes/roadmap.js';

dotenv.config();

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
app.use('/api/parking-lot', parkingLotRouter);
app.use('/api/growth', growthRouter);
app.use('/api/roadmap', roadmapRouter);

app.get('/api/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
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
