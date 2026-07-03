# Worker2 Setup Complete

## Summary

You now have worker2 variants for both specs, allowing you to run multiple automation workflows simultaneously.

## Available Workers

### 1. SRN-PUMP-NORMAL-SYARIKAT
- **Worker1**: `SRN-PUMP-NORMAL-SYARIKAT.spec.ts` (Chromium, headed)
- **Worker2**: `SRN-PUMP-NORMAL-SYARIKAT-worker2.spec.ts` (Edge, headless)

### 2. SRN-PUMP-LATEST-DIKECUALIAKN
- **Worker1**: `SRN-PUMP-LATEST-DIKECUALIAKN.spec.ts` (Chromium, headed)
- **Worker2**: `SRN-PUMP-LATEST-DIKECUALIAKN-worker2.spec.ts` (Edge, headless)

## Output Files by Worker

### SYARIKAT
- **Worker1**: `test-data/current-url-worker1.txt`, `test-data/srn-pump-normal-syarikat-progress.txt`
- **Worker2**: `test-data/current-url-worker2-syarikat.txt`, `test-data/srn-pump-normal-syarikat-worker2-progress.txt`

### DIKECUALIAKN
- **Worker1**: `test-data/current-url-worker1.txt` (shared with other worker1 specs)
- **Worker2**: `test-data/current-url-worker2-dikecualiakn.txt`

### Shared Files
All workers share: `test-data/srn-permanent-log.txt` (with worker identifier in logs)

## Quick Commands

### Run Both SYARIKAT Workers
```bash
# Staggered start (60s delay)
npm run srn-pump-normal-syarikat:staggered

# Or start separately
npm run srn-pump-normal-syarikat:forever
npm run srn-pump-normal-syarikat-worker2:forever
```

### Run Both DIKECUALIAKN Workers
```bash
# Staggered start (60s delay)
npm run srn-pump-latest-dikecualiakn:staggered

# Or start separately
npm run srn-pump-latest-dikecualiakn:forever
npm run srn-pump-latest-dikecualiakn-worker2:forever
```

### Run SYARIKAT + DIKECUALIAKN Simultaneously (4 workers!)
```bash
# Start all 4 workers
npm run srn-pump-normal-syarikat:forever
npm run srn-pump-normal-syarikat-worker2:forever
npm run srn-pump-latest-dikecualiakn:forever
npm run srn-pump-latest-dikecualiakn-worker2:forever
```

### Monitor Logs
```bash
# All workers
pm2 logs

# Specific worker
npm run srn-pump-normal-syarikat:logs
npm run srn-pump-normal-syarikat-worker2:logs
npm run srn-pump-latest-dikecualiakn:logs
npm run srn-pump-latest-dikecualiakn-worker2:logs
```

### Stop Workers
```bash
# Stop both SYARIKAT workers
npm run srn-pump-normal-syarikat:stop-both

# Stop both DIKECUALIAKN workers
npm run srn-pump-latest-dikecualiakn:stop-both

# Stop individual workers
npm run srn-pump-normal-syarikat:stop
npm run srn-pump-normal-syarikat-worker2:stop
npm run srn-pump-latest-dikecualiakn:stop
npm run srn-pump-latest-dikecualiakn-worker2:stop

# Stop all bots
npm run bots:stop-all
```

## Example Scenarios

### Scenario 1: Run SYARIKAT and DIKECUALIAKN (2 workers)
```bash
npm run srn-pump-normal-syarikat:forever
npm run srn-pump-latest-dikecualiakn:forever
```

### Scenario 2: Run Both SYARIKAT Workers (2 workers)
```bash
npm run srn-pump-normal-syarikat:staggered
```

### Scenario 3: Maximum Throughput (4 workers - all headless)
To maximize throughput with minimal resource usage, run only worker2 variants (all headless):
```bash
npm run srn-pump-normal-syarikat-worker2:forever
npm run srn-pump-latest-dikecualiakn-worker2:forever
```

### Scenario 4: Mixed (2 headed, 2 headless)
```bash
# Headed browsers (visible)
npm run srn-pump-normal-syarikat:forever
npm run srn-pump-latest-dikecualiakn:forever

# Headless browsers (background)
npm run srn-pump-normal-syarikat-worker2:forever
npm run srn-pump-latest-dikecualiakn-worker2:forever
```

## Console Output Identification

Worker logs are prefixed for easy identification:
- **Worker1**: No prefix (e.g., `SRN: 12345`)
- **Worker2**: `[WORKER2]` prefix (e.g., `[WORKER2] SRN: 12345`)

## Features

✅ **Independent Progress Tracking** - SYARIKAT worker2 has its own progress file (DIKECUALIAKN doesn't have progress tracking yet)
✅ **Separate Output Files** - No file conflicts between workers
✅ **Headless Mode** - Worker2 runs in background
✅ **Auto-Restart** - PM2 automatically restarts on crashes
✅ **Console Prefixes** - Easy to identify which worker is logging

## Resource Considerations

- **Headed browsers** (Worker1): Uses more CPU/memory, visible on screen
- **Headless browsers** (Worker2): Uses less CPU/memory, runs in background
- **4 workers simultaneously**: Ensure your system has enough resources (8GB+ RAM recommended)

## Troubleshooting

### Check PM2 Status
```bash
npm run bots:status
```

### View Real-time Logs
```bash
pm2 logs --lines 100
```

### Restart a Worker
```bash
pm2 restart srn-pump-normal-syarikat-forever
```

### Clear Logs
```bash
pm2 flush
```
