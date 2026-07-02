# Multiple Workers Setup - Complete Guide

## Overview

You now have **5 workers** available for running automation scripts simultaneously!

## Available Workers

### SRN-PUMP-NORMAL-SYARIKAT (2 workers)
1. **Worker1**: `SRN-PUMP-NORMAL-SYARIKAT.spec.ts` (Chromium, headed)
2. **Worker2**: `SRN-PUMP-NORMAL-SYARIKAT-worker2.spec.ts` (Edge, headless)

### SRN-PUMP-LATEST-DIKECUALIAKN (3 workers)
1. **Worker1**: `SRN-PUMP-LATEST-DIKECUALIAKN.spec.ts` (Chromium, headed)
2. **Worker2**: `SRN-PUMP-LATEST-DIKECUALIAKN-worker2.spec.ts` (Edge, headless)
3. **Worker3**: `SRN-PUMP-LATEST-DIKECUALIAKN-worker3.spec.ts` (Edge, headless) ✨ NEW

## Output Files

### SYARIKAT Workers
- **Worker1**: `test-data/current-url-worker1.txt`, `test-data/srn-pump-normal-syarikat-progress.txt`
- **Worker2**: `test-data/current-url-worker2-syarikat.txt`, `test-data/srn-pump-normal-syarikat-worker2-progress.txt`

### DIKECUALIAKN Workers
- **Worker1**: `test-data/current-url-worker1.txt`
- **Worker2**: `test-data/current-url-worker2-dikecualiakn.txt`
- **Worker3**: `test-data/current-url-worker3-dikecualiakn.txt` ✨ NEW

### Shared File
- All workers share: `test-data/srn-permanent-log.txt` (with worker identifier)

## Quick Commands

### Run All 3 DIKECUALIAKN Workers
```bash
npm run srn-pump-latest-dikecualiakn:forever
npm run srn-pump-latest-dikecualiakn-worker2:forever
npm run srn-pump-latest-dikecualiakn-worker3:forever
```

### Run Individual Workers
```bash
# SYARIKAT
npm run srn-pump-normal-syarikat:forever
npm run srn-pump-normal-syarikat-worker2:forever

# DIKECUALIAKN
npm run srn-pump-latest-dikecualiakn:forever
npm run srn-pump-latest-dikecualiakn-worker2:forever
npm run srn-pump-latest-dikecualiakn-worker3:forever
```

### Monitor Logs
```bash
# All workers
pm2 logs

# Specific worker
npm run srn-pump-latest-dikecualiakn-worker3:logs

# Multiple workers
pm2 logs srn-pump-latest-dikecualiakn-forever srn-pump-latest-dikecualiakn-worker2-forever srn-pump-latest-dikecualiakn-worker3-forever
```

### Stop Workers
```bash
# Stop all 3 DIKECUALIAKN workers
npm run srn-pump-latest-dikecualiakn:stop-all

# Stop specific worker
npm run srn-pump-latest-dikecualiakn-worker3:stop

# Stop all bots
npm run bots:stop-all
```

## Example Scenarios

### Scenario 1: Maximum DIKECUALIAKN Throughput (3 workers)
Run all 3 DIKECUALIAKN workers:
```bash
npm run srn-pump-latest-dikecualiakn:forever
npm run srn-pump-latest-dikecualiakn-worker2:forever
npm run srn-pump-latest-dikecualiakn-worker3:forever
```

### Scenario 2: All Workers (5 total)
Run everything:
```bash
npm run srn-pump-normal-syarikat:forever
npm run srn-pump-normal-syarikat-worker2:forever
npm run srn-pump-latest-dikecualiakn:forever
npm run srn-pump-latest-dikecualiakn-worker2:forever
npm run srn-pump-latest-dikecualiakn-worker3:forever
```

### Scenario 3: All Headless (4 workers)
Only headless workers for minimal resource usage:
```bash
npm run srn-pump-normal-syarikat-worker2:forever
npm run srn-pump-latest-dikecualiakn-worker2:forever
npm run srn-pump-latest-dikecualiakn-worker3:forever
```

### Scenario 4: DIKECUALIAKN Only - Headless (2 workers)
```bash
npm run srn-pump-latest-dikecualiakn-worker2:forever
npm run srn-pump-latest-dikecualiakn-worker3:forever
```

## Console Output Identification

Worker logs are prefixed for easy identification:
- **Worker1**: No prefix (e.g., `SRN: 12345`)
- **Worker2**: `[WORKER2]` prefix (e.g., `[WORKER2] SRN: 12345`)
- **Worker3**: `[WORKER3]` prefix (e.g., `[WORKER3] SRN: 12345`)

## Browser Modes Summary

| Worker | Browser | Mode | Visible |
|--------|---------|------|---------|
| Worker1 | Chromium | Headed | ✅ Yes |
| Worker2 | Edge | Headless | ❌ No |
| Worker3 | Edge | Headless | ❌ No |

## Resource Considerations

### Light Load (1-2 workers)
- RAM: 4GB minimum
- CPU: 2 cores
- Recommended: Worker2 or Worker3 (headless)

### Medium Load (3-4 workers)
- RAM: 8GB recommended
- CPU: 4 cores
- Recommended: Mix of headed and headless

### Heavy Load (5 workers)
- RAM: 12GB+ recommended
- CPU: 6+ cores
- Recommended: Mostly headless workers

## Performance Tips

1. **Use headless workers** for better performance (Worker2, Worker3)
2. **Stagger start times** to avoid login conflicts (60s delay recommended)
3. **Monitor system resources** with `pm2 monit`
4. **Run fewer workers** if system slows down

## All Available Commands

### DIKECUALIAKN Worker3 (NEW)
```bash
# Run once
npm run srn-pump-latest-dikecualiakn-worker3:one

# Run forever with PM2
npm run srn-pump-latest-dikecualiakn-worker3:forever

# View logs
npm run srn-pump-latest-dikecualiakn-worker3:logs

# Stop worker
npm run srn-pump-latest-dikecualiakn-worker3:stop
```

### Stop All DIKECUALIAKN Workers
```bash
npm run srn-pump-latest-dikecualiakn:stop-all
```

## System Status

Check all running workers:
```bash
npm run bots:status
```

Expected output with all workers running:
```
┌─────┬──────────────────────────────────────────┬─────────┬─────────┐
│ id  │ name                                      │ status  │ restart │
├─────┼──────────────────────────────────────────┼─────────┼─────────┤
│ 0   │ srn-pump-normal-syarikat-forever         │ online  │ 0       │
│ 1   │ srn-pump-normal-syarikat-worker2-forever │ online  │ 0       │
│ 2   │ srn-pump-latest-dikecualiakn-forever     │ online  │ 0       │
│ 3   │ srn-pump-latest-dikecualiakn-worker2-... │ online  │ 0       │
│ 4   │ srn-pump-latest-dikecualiakn-worker3-... │ online  │ 0       │
└─────┴──────────────────────────────────────────┴─────────┴─────────┘
```

## Features

✅ **5 Total Workers** - Maximum throughput
✅ **Independent Output Files** - No file conflicts
✅ **Headless Mode** - Workers 2 & 3 run in background
✅ **Auto-Restart** - PM2 automatically restarts on crashes
✅ **Console Prefixes** - Easy to identify worker logs
✅ **Progress Tracking** - SYARIKAT workers resume from last iteration

---

**Created**: 2026-07-02
**Total Workers**: 5 (2 SYARIKAT + 3 DIKECUALIAKN)
