#!/usr/bin/env node
import fs from 'fs';
import path from 'path';

/**
 * Analyzes load test report and determines if server hanging issue is resolved
 */

const reportPath = process.env.REPORT_PATH || path.join(process.cwd(), 'load-test-report.json');

if (!fs.existsSync(reportPath)) {
  console.error('❌ Report not found:', reportPath);
  console.log('Run load test first: npm run loadtest:report');
  process.exit(1);
}

const report = JSON.parse(fs.readFileSync(reportPath, 'utf-8'));

console.log('🔍 Analyzing Load Test Report');
console.log('═'.repeat(60));
console.log('');

const issues = [];
const warnings = [];
const passed = [];

// 1. Check HTTP success rate
console.log('📊 HTTP Performance Analysis');
console.log('─'.repeat(60));

const totalHttp = report.http.sent;
const successRate = totalHttp > 0 ? (report.http.success / totalHttp) * 100 : 0;

console.log(`Total Requests: ${totalHttp}`);
console.log(`Success Rate: ${successRate.toFixed(2)}%`);
console.log(`Errors: ${report.http.errors}`);
console.log(`Timeouts: ${report.http.timeouts}`);

if (report.http.timeouts > 0) {
  issues.push(`${report.http.timeouts} requests timed out (>5s) - SERVER HANGING DETECTED`);
} else {
  passed.push('No request timeouts detected');
}

if (successRate < 95 && totalHttp > 10) {
  issues.push(`Low success rate: ${successRate.toFixed(1)}% (expected >95%)`);
} else if (successRate >= 95) {
  passed.push(`Good success rate: ${successRate.toFixed(1)}%`);
}

// 2. Check latency degradation
console.log('');
console.log('⏱️  Latency Analysis');
console.log('─'.repeat(60));

if (report.http.stats) {
  const { min, max, avg, p50, p95, p99 } = report.http.stats;
  
  console.log(`Min: ${min}ms`);
  console.log(`Avg: ${avg.toFixed(0)}ms`);
  console.log(`P50: ${p50}ms`);
  console.log(`P95: ${p95}ms`);
  console.log(`P99: ${p99}ms`);
  console.log(`Max: ${max}ms`);
  
  if (p95 > 2000) {
    issues.push(`P95 latency too high: ${p95}ms (expected <2000ms)`);
  } else if (p95 > 1000) {
    warnings.push(`P95 latency elevated: ${p95}ms (target <1000ms)`);
  } else {
    passed.push(`P95 latency good: ${p95}ms`);
  }
  
  if (report.http.verySlowRequests > totalHttp * 0.05) {
    warnings.push(`${report.http.verySlowRequests} very slow requests (>2s) - ${((report.http.verySlowRequests / totalHttp) * 100).toFixed(1)}%`);
  }
  
  // Check if latency increases over time (sign of degradation)
  if (report.http.latencies.length > 20) {
    const firstQuarter = report.http.latencies.slice(0, Math.floor(report.http.latencies.length / 4));
    const lastQuarter = report.http.latencies.slice(-Math.floor(report.http.latencies.length / 4));
    
    const avgFirst = firstQuarter.reduce((a, b) => a + b, 0) / firstQuarter.length;
    const avgLast = lastQuarter.reduce((a, b) => a + b, 0) / lastQuarter.length;
    const degradation = ((avgLast - avgFirst) / avgFirst) * 100;
    
    console.log(`Latency Trend: First quarter avg=${avgFirst.toFixed(0)}ms, Last quarter avg=${avgLast.toFixed(0)}ms`);
    
    if (degradation > 50) {
      issues.push(`Latency degradation detected: +${degradation.toFixed(1)}% over test duration - PERFORMANCE DEGRADING`);
    } else if (degradation > 20) {
      warnings.push(`Latency increased: +${degradation.toFixed(1)}% over test duration`);
    } else if (degradation < 10) {
      passed.push(`Stable latency throughout test (${degradation > 0 ? '+' : ''}${degradation.toFixed(1)}%)`);
    }
  }
}

// 3. Check memory leaks
console.log('');
console.log('🧠 Memory Analysis');
console.log('─'.repeat(60));

if (report.metrics.length > 1) {
  const firstMetric = report.metrics[0];
  const lastMetric = report.metrics[report.metrics.length - 1];
  
  const rssGrowthMB = (lastMetric.memory.rss - firstMetric.memory.rss) / 1024 / 1024;
  const heapGrowthMB = (lastMetric.memory.heapUsed - firstMetric.memory.heapUsed) / 1024 / 1024;
  const rssGrowthPct = (rssGrowthMB / (firstMetric.memory.rss / 1024 / 1024)) * 100;
  
  console.log(`Initial RSS: ${(firstMetric.memory.rss / 1024 / 1024).toFixed(1)}MB`);
  console.log(`Final RSS: ${(lastMetric.memory.rss / 1024 / 1024).toFixed(1)}MB`);
  console.log(`RSS Growth: ${rssGrowthMB > 0 ? '+' : ''}${rssGrowthMB.toFixed(1)}MB (${rssGrowthPct > 0 ? '+' : ''}${rssGrowthPct.toFixed(1)}%)`);
  console.log(`Heap Growth: ${heapGrowthMB > 0 ? '+' : ''}${heapGrowthMB.toFixed(1)}MB`);
  
  const durationMin = report.config.DURATION_SEC / 60;
  const growthRateMBPerMin = rssGrowthMB / durationMin;
  
  if (rssGrowthPct > 50 && rssGrowthMB > 100) {
    issues.push(`Significant memory growth: +${rssGrowthMB.toFixed(1)}MB (+${rssGrowthPct.toFixed(1)}%) - MEMORY LEAK SUSPECTED`);
  } else if (rssGrowthPct > 30 && rssGrowthMB > 50) {
    warnings.push(`Memory growth detected: +${rssGrowthMB.toFixed(1)}MB (+${rssGrowthPct.toFixed(1)}%)`);
  } else if (rssGrowthMB < 50 || rssGrowthPct < 20) {
    passed.push(`Memory stable: ${rssGrowthMB > 0 ? '+' : ''}${rssGrowthMB.toFixed(1)}MB over ${durationMin.toFixed(0)} min`);
  }
  
  // Check for continuous growth (linear trend)
  if (report.metrics.length >= 5) {
    const memPoints = report.metrics.map(m => m.memory.rss / 1024 / 1024);
    const midPoint = memPoints[Math.floor(memPoints.length / 2)];
    const endPoint = memPoints[memPoints.length - 1];
    const startPoint = memPoints[0];
    
    // If memory keeps growing in second half similar to first half
    const firstHalfGrowth = midPoint - startPoint;
    const secondHalfGrowth = endPoint - midPoint;
    
    if (firstHalfGrowth > 20 && secondHalfGrowth > 20 && secondHalfGrowth / firstHalfGrowth > 0.7) {
      warnings.push(`Continuous memory growth pattern detected - monitor for longer duration`);
    }
  }
}

// 4. Check socket stability
console.log('');
console.log('🔌 Socket Stability Analysis');
console.log('─'.repeat(60));

console.log(`Total Socket Events: ${report.socket.sent}`);
console.log(`Disconnects: ${report.socket.disconnects}`);
console.log(`Errors: ${report.socket.errors}`);

if (report.socket.disconnects > 2) {
  issues.push(`Multiple socket disconnects: ${report.socket.disconnects}`);
} else if (report.socket.disconnects === 0) {
  passed.push('Socket remained stable throughout test');
}

if (report.socket.errors > 0) {
  warnings.push(`${report.socket.errors} socket errors occurred`);
}

// 5. Overall verdict
console.log('');
console.log('═'.repeat(60));
console.log('📋 FINAL VERDICT');
console.log('═'.repeat(60));
console.log('');

if (issues.length === 0 && warnings.length === 0) {
  report.verdict = 'PASSED';
  console.log('✅ STATUS: PASSED - Server is stable!');
  console.log('');
  console.log('🎉 All checks passed:');
  passed.forEach(p => console.log(`   ✓ ${p}`));
  console.log('');
  console.log('💡 The server hanging issue appears to be RESOLVED.');
} else if (issues.length === 0) {
  report.verdict = 'PASSED_WITH_WARNINGS';
  console.log('✅ STATUS: PASSED (with warnings)');
  console.log('');
  if (passed.length > 0) {
    console.log('✓ Passed checks:');
    passed.forEach(p => console.log(`   ✓ ${p}`));
    console.log('');
  }
  console.log('⚠️  Warnings:');
  warnings.forEach(w => console.log(`   ⚠️  ${w}`));
  console.log('');
  console.log('💡 The server is stable but could be optimized further.');
} else {
  report.verdict = 'FAILED';
  console.log('❌ STATUS: FAILED - Issues detected!');
  console.log('');
  console.log('❌ Critical issues:');
  issues.forEach(i => console.log(`   ❌ ${i}`));
  console.log('');
  if (warnings.length > 0) {
    console.log('⚠️  Additional warnings:');
    warnings.forEach(w => console.log(`   ⚠️  ${w}`));
    console.log('');
  }
  console.log('💡 The server hanging issue is NOT fully resolved.');
  console.log('');
  console.log('🔧 Recommended actions:');
  if (report.http.timeouts > 0) {
    console.log('   1. Check server logs for errors during timeouts');
    console.log('   2. Increase TRACKING_PERSIST_INTERVAL_MS (try 10000)');
    console.log('   3. Verify MongoDB connection pool settings');
  }
  if (issues.some(i => i.includes('MEMORY LEAK'))) {
    console.log('   1. Review socket disconnect cleanup');
    console.log('   2. Check for unbounded cache/map growth');
    console.log('   3. Enable heap profiling: node --inspect');
  }
  if (issues.some(i => i.includes('DEGRADING'))) {
    console.log('   1. Reduce tracking write frequency further');
    console.log('   2. Add database write queue monitoring');
    console.log('   3. Consider read replicas for admin queries');
  }
}

console.log('');
console.log('═'.repeat(60));
console.log('');
console.log(`📄 Full report: ${reportPath}`);
console.log('');

// Update report with verdict
report.analysis = { issues, warnings, passed, verdict: report.verdict };
fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));

// Exit code based on verdict
process.exit(report.verdict === 'FAILED' ? 1 : 0);
