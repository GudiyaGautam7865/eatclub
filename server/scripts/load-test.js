#!/usr/bin/env node
import { io as ioclient } from 'socket.io-client';
import fetch from 'node-fetch';

/**
 * Quick load test for tracking pressure.
 * - Emits socket `sendLocation` at a configurable rate
 * - Sends HTTP POST /api/orders/:orderId/location at a configurable rate
 * - Logs counts and simple latencies
 *
 * ENV:
 *  BASE_URL                (default: http://localhost:5000)
 *  ORDER_ID                (required)
 *  TOKEN                   (optional Bearer token for HTTP endpoint)
 *  DURATION_SEC            (default: 60)
 *  SOCKET_RATE_HZ          (default: 10)
 *  HTTP_RATE_HZ            (default: 5)
 */

const BASE_URL = process.env.BASE_URL || 'http://localhost:5000';
const ORDER_ID = process.env.ORDER_ID;
const TOKEN = process.env.TOKEN || '';
const DURATION_SEC = Number(process.env.DURATION_SEC || 60);
const SOCKET_RATE_HZ = Number(process.env.SOCKET_RATE_HZ || 10);
const HTTP_RATE_HZ = Number(process.env.HTTP_RATE_HZ || 5);

if (!ORDER_ID) {
  console.error('ORDER_ID env is required');
  process.exit(1);
}

const endAt = Date.now() + DURATION_SEC * 1000;
const httpIntervalMs = HTTP_RATE_HZ > 0 ? Math.floor(1000 / HTTP_RATE_HZ) : 0;
const socketIntervalMs = SOCKET_RATE_HZ > 0 ? Math.floor(1000 / SOCKET_RATE_HZ) : 0;

let httpSent = 0, httpOk = 0, httpErr = 0;
let sockSent = 0;

// Simple path generator: jittered coordinates around a starting point
let lat = 12.9716, lng = 77.5946;
function step() {
  lat += (Math.random() - 0.5) * 0.0002;
  lng += (Math.random() - 0.5) * 0.0002;
}

console.log('Starting load test', { BASE_URL, ORDER_ID, DURATION_SEC, SOCKET_RATE_HZ, HTTP_RATE_HZ });

// Socket client
const socket = ioclient(BASE_URL, { transports: ['websocket'] });
socket.on('connect', () => {
  console.log('Socket connected:', socket.id);
  socket.emit('joinOrder', ORDER_ID);
});

socket.on('disconnect', (reason) => {
  console.log('Socket disconnected:', reason);
});

// Emit loop
let sockTimer;
if (socketIntervalMs > 0) {
  sockTimer = setInterval(() => {
    if (Date.now() >= endAt) return;
    step();
    socket.emit('sendLocation', { orderId: ORDER_ID, lat, lng });
    sockSent++;
  }, socketIntervalMs);
}

// HTTP loop
let httpTimer;
async function postLocation() {
  step();
  const t0 = Date.now();
  httpSent++;
  try {
    const res = await fetch(`${BASE_URL}/api/orders/${ORDER_ID}/location`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(TOKEN ? { Authorization: `Bearer ${TOKEN}` } : {}),
      },
      body: JSON.stringify({ lat, lng }),
    });
    const dt = Date.now() - t0;
    if (dt > 500) console.warn('HTTP slow:', dt, 'ms');
    if (res.ok) httpOk++; else httpErr++;
  } catch (e) {
    httpErr++;
  }
}

if (httpIntervalMs > 0) {
  httpTimer = setInterval(() => {
    if (Date.now() >= endAt) return;
    postLocation();
  }, httpIntervalMs);
}

// Stop and summarize
setTimeout(() => {
  if (sockTimer) clearInterval(sockTimer);
  if (httpTimer) clearInterval(httpTimer);
  socket.close();
  console.log('Done. Summary:', { httpSent, httpOk, httpErr, sockSent });
  process.exit(0);
}, DURATION_SEC * 1000 + 250);
