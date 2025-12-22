#!/usr/bin/env node
import { io as ioclient } from 'socket.io-client';
import fetch from 'node-fetch';
import fs from 'fs';
import path from 'path';

/**
 * Enhanced load test with detailed reporting
 * Tests tracking pressure and generates diagnostic report
 */

const BASE_URL = process.env.BASE_URL || 'http://localhost:5000';
const ORDER_ID = process.env.ORDER_ID;
const TOKEN = process.env.TOKEN || '';
const DURATION_SEC = Number(process.env.DURATION_SEC || 120);
const SOCKET_RATE_HZ = Number(process.env.SOCKET_RATE_HZ || 10);
const HTTP_RATE_HZ = Number(process.env.HTTP_RATE_HZ || 5);
const METRICS_INTERVAL_SEC = Number(process.env.METRICS_INTERVAL_SEC || 10);

if (!ORDER_ID) {
  console.error('❌ ORDER_ID env is required');
  console.log('Example: $env:ORDER_ID = "674848a6aa76dc66e01b1833"');
  process.exit(1);
}

const report = {
  config: { BASE_URL, ORDER_ID, DURATION_SEC, SOCKET_RATE_HZ, HTTP_RATE_HZ },
  startTime: new Date().toISOString(),
  endTime: null,
  http: {
    sent: 0,
    success: 0,
    errors: 0,
    timeouts: 0,
    latencies: [],
    slowRequests: 0, // >1000ms
    verySlowRequests: 0, // >2000ms
  },
  socket: {
    sent: 0,
    connected: true,
    disconnects: 0,
    errors: 0,
  },
  metrics: [],
  verdict: null,
};

let lat = 12.9716, lng = 77.5946;
function step() {
  lat += (Math.random() - 0.5) * 0.0002;
  lng += (Math.random() - 0.5) * 0.0002;
}

console.log('🚀 Starting enhanced load test...');
console.log('📊 Config:', { BASE_URL, ORDER_ID, DURATION_SEC, SOCKET_RATE_HZ, HTTP_RATE_HZ });
console.log('');

const endAt = Date.now() + DURATION_SEC * 1000;

// Socket client
const socket = ioclient(BASE_URL, { transports: ['websocket'], reconnection: false });

socket.on('connect', () => {
  console.log('✓ Socket connected:', socket.id);
  report.socket.connected = true;
  socket.emit('joinOrder', ORDER_ID);
});

socket.on('disconnect', (reason) => {
  console.log('⚠️  Socket disconnected:', reason);
  report.socket.connected = false;
  report.socket.disconnects++;
});

socket.on('connect_error', (err) => {
  console.error('❌ Socket error:', err.message);
  report.socket.errors++;
});

// Socket emit loop
let sockTimer;
if (SOCKET_RATE_HZ > 0) {
  const socketIntervalMs = Math.floor(1000 / SOCKET_RATE_HZ);
  sockTimer = setInterval(() => {
    if (Date.now() >= endAt) return;
    step();
    socket.emit('sendLocation', { orderId: ORDER_ID, lat, lng });
    report.socket.sent++;
  }, socketIntervalMs);
}

// HTTP loop with latency tracking
let httpTimer;
async function postLocation() {
  if (Date.now() >= endAt) return;
  
  step();
  const t0 = Date.now();
  report.http.sent++;
  
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000); // 5s timeout
    
    const res = await fetch(`${BASE_URL}/api/orders/${ORDER_ID}/location`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(TOKEN ? { Authorization: `Bearer ${TOKEN}` } : {}),
      },
      body: JSON.stringify({ lat, lng }),
      signal: controller.signal,
    });
    
    clearTimeout(timeout);
    const latency = Date.now() - t0;
    report.http.latencies.push(latency);
    
    if (latency > 1000) report.http.slowRequests++;
    if (latency > 2000) report.http.verySlowRequests++;
    if (latency > 500) console.warn(`⏱️  HTTP slow: ${latency}ms`);
    
    if (res.ok) {
      report.http.success++;
    } else {
      report.http.errors++;
      console.error(`❌ HTTP ${res.status}:`, await res.text());
    }
  } catch (e) {
    const latency = Date.now() - t0;
    if (e.name === 'AbortError') {
      report.http.timeouts++;
      console.error('❌ HTTP timeout after 5s');
    } else {
      report.http.errors++;
      console.error('❌ HTTP error:', e.message);
    }
    report.http.latencies.push(latency);
  }
}

if (HTTP_RATE_HZ > 0) {
  const httpIntervalMs = Math.floor(1000 / HTTP_RATE_HZ);
  httpTimer = setInterval(postLocation, httpIntervalMs);
}

// Metrics collection
async function collectMetrics() {
  try {
    const res = await fetch(`${BASE_URL}/api/metrics`, { timeout: 3000 });
    if (res.ok) {
      const data = await res.json();
      const snapshot = {
        timestamp: Date.now(),
        memory: data.data?.memory || {},
        sockets: data.data?.sockets || {},
        mongo: data.data?.mongo || {},
      };
      report.metrics.push(snapshot);
      
      const mb = (bytes) => (bytes / 1024 / 1024).toFixed(1);
      console.log(`📈 Metrics: RSS=${mb(snapshot.memory.rss)}MB, Heap=${mb(snapshot.memory.heapUsed)}MB, Clients=${snapshot.sockets.clients || 0}`);
    }
  } catch (e) {
    console.warn('⚠️  Metrics fetch failed:', e.message);
  }
}

// Initial metrics
await collectMetrics();

// Periodic metrics
const metricsTimer = setInterval(collectMetrics, METRICS_INTERVAL_SEC * 1000);

// Progress updates
const progressTimer = setInterval(() => {
  const elapsed = Math.floor((Date.now() - (endAt - DURATION_SEC * 1000)) / 1000);
  const remaining = Math.max(0, DURATION_SEC - elapsed);
  const successRate = report.http.sent > 0 ? ((report.http.success / report.http.sent) * 100).toFixed(1) : 0;
  console.log(`⏳ Progress: ${elapsed}/${DURATION_SEC}s | HTTP: ${report.http.sent} sent, ${successRate}% OK | Socket: ${report.socket.sent} sent`);
}, 15000);

// Cleanup and report generation
setTimeout(async () => {
  clearInterval(sockTimer);
  clearInterval(httpTimer);
  clearInterval(metricsTimer);
  clearInterval(progressTimer);
  
  // Final metrics
  await collectMetrics();
  
  socket.close();
  report.endTime = new Date().toISOString();
  
  console.log('\n');
  console.log('✅ Load test completed!');
  console.log('');
  console.log('📊 Summary:');
  console.log(`   HTTP Requests: ${report.http.sent} sent, ${report.http.success} success, ${report.http.errors} errors, ${report.http.timeouts} timeouts`);
  console.log(`   Socket Events: ${report.socket.sent} sent, ${report.socket.disconnects} disconnects`);
  console.log(`   Slow Requests: ${report.http.slowRequests} (>1s), ${report.http.verySlowRequests} (>2s)`);
  
  if (report.http.latencies.length > 0) {
    const sorted = [...report.http.latencies].sort((a, b) => a - b);
    const p50 = sorted[Math.floor(sorted.length * 0.5)];
    const p95 = sorted[Math.floor(sorted.length * 0.95)];
    const p99 = sorted[Math.floor(sorted.length * 0.99)];
    const avg = sorted.reduce((a, b) => a + b, 0) / sorted.length;
    
    report.http.stats = { min: sorted[0], max: sorted[sorted.length - 1], avg, p50, p95, p99 };
    console.log(`   Latency: min=${sorted[0]}ms, avg=${avg.toFixed(0)}ms, p50=${p50}ms, p95=${p95}ms, p99=${p99}ms, max=${sorted[sorted.length - 1]}ms`);
  }
  
  // Save report
  const reportPath = path.join(process.cwd(), 'load-test-report.json');
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  console.log('');
  console.log(`💾 Report saved to: ${reportPath}`);
  console.log('');
  console.log('🔍 Run analyzer: npm run analyze-report');
  
  process.exit(0);
}, DURATION_SEC * 1000 + 500);
