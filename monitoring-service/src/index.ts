import cron from 'node-cron';
import dotenv from 'dotenv';
import { runHealthCheckCycle } from './healthChecker';

dotenv.config();

console.log('📡 SecureView Camera Health Monitoring Service Starting...');

// Run diagnostic check immediately upon startup
runHealthCheckCycle();

// Schedule diagnostic check every 30 seconds
cron.schedule('*/30 * * * * *', () => {
  runHealthCheckCycle();
});

console.log('⏰ Diagnostic Cron Scheduler Active (Running every 30s).');
