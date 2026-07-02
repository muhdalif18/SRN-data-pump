# Final Workers Setup - Complete

## Total Workers: 6

You now have **6 workers** available across 3 different spec types!

## Available Workers

### 1. SRN-PUMP-NORMAL-SYARIKAT (2 workers)
- **Worker1**: `SRN-PUMP-NORMAL-SYARIKAT.spec.ts` (Chromium, headed)
- **Worker2**: `SRN-PUMP-NORMAL-SYARIKAT-worker2.spec.ts` (Edge, headless)

### 2. SRN-PUMP-LATEST-DIKECUALIAKN (3 workers)
- **Worker1**: `SRN-PUMP-LATEST-DIKECUALIAKN.spec.ts` (Chromium, headed)
- **Worker2**: `SRN-PUMP-LATEST-DIKECUALIAKN-worker2.spec.ts` (Edge, headless)
- **Worker3**: `SRN-PUMP-LATEST-DIKECUALIAKN-worker3.spec.ts` (Edge, headless)

### 3. SRN-PUMP-LATEST-DIKECUALIAKN-MISSING-PHONE (2 workers)
- **Worker1**: `SRN-PUMP-LATEST-DIKECUALIAKN-MISSING-PHONE.spec.ts` (Chromium, headed)
- **Worker2**: `SRN-PUMP-LATEST-DIKECUALIAKN-MISSING-PHONE-worker2.spec.ts` (Edge, headless) ✨ **NEW**

## Output Files

### SYARIKAT
- Worker1: `test-data/current-url-worker1.txt`, `test-data/srn-pump-normal-syarikat-progress.txt`
- Worker2: `test-data/current-url-worker2-syarikat.txt`, `test-data/srn-pump-normal-syarikat-worker2-progress.txt`

### DIKECUALIAKN
- Worker1: `test-data/current-url-worker1.txt`
- Worker2: `test-data/current-url-worker2-dikecualiakn.txt`
- Worker3: `test-data/current-url-worker3-dikecualiakn.txt`

### MISSING-PHONE
- Worker1: `test-data/current-url-worker1.txt`
- Worker2: `test-data/current-url-worker2-missing-phone.txt` ✨ **NEW**

### Shared
- All workers: `test-data/srn-permanent-log.txt` (with worker identifier)

## Quick Commands

### MISSING-PHONE (NEW)
```bash
# Run both workers
npm run srn-pump-latest-dikecualiakn-missing-phone:forever
npm run srn-pump-latest-dikecualiakn-missing-phone-worker2:forever

# Staggered start (60s delay)
npm run srn-pump-latest-dikecualiakn-missing-phone:staggered

# Monitor logs
npm run srn-pump-latest-dikecualiakn-missing-phone:logs
npm run srn-pump-latest-dikecualiakn-missing-phone-worker2:logs

# Stop both
npm run srn-pump-latest-dikecualiakn-missing-phone:stop-both
```

### Run All 6 Workers
```bash
npm run srn-pump-normal-syarikat:forever
npm run srn-pump-normal-syarikat-worker2:forever
npm run srn-pump-latest-dikecualiakn:forever
npm run srn-pump-latest-dikecualiakn-worker2:forever
npm run srn-pump-latest-dikecualiakn-worker3:forever
npm run srn-pump-latest-dikecualiakn-missing-phone-worker2:forever
```

### Run All Headless (5 workers)
```bash
npm run srn-pump-normal-syarikat-worker2:forever
npm run srn-pump-latest-dikecualiakn-worker2:forever
npm run srn-pump-latest-dikecualiakn-worker3:forever
npm run srn-pump-latest-dikecualiakn-missing-phone-worker2:forever
```

## Console Prefixes

- **Worker1**: No prefix (e.g., `SRN: 12345`)
- **Worker2**: `[WORKER2]` prefix (e.g., `[WORKER2] SRN: 12345`)
- **Worker3**: `[WORKER3]` prefix (e.g., `[WORKER3] SRN: 12345`)

## Complete Worker List

| # | Spec | Worker | Browser | Mode | Output File |
|---|------|--------|---------|------|-------------|
| 1 | SYARIKAT | Worker1 | Chromium | Headed | current-url-worker1.txt |
| 2 | SYARIKAT | Worker2 | Edge | Headless | current-url-worker2-syarikat.txt |
| 3 | DIKECUALIAKN | Worker1 | Chromium | Headed | current-url-worker1.txt |
| 4 | DIKECUALIAKN | Worker2 | Edge | Headless | current-url-worker2-dikecualiakn.txt |
| 5 | DIKECUALIAKN | Worker3 | Edge | Headless | current-url-worker3-dikecualiakn.txt |
| 6 | MISSING-PHONE | Worker1 | Chromium | Headed | current-url-worker1.txt |
| 7 | MISSING-PHONE | Worker2 | Edge | Headless | current-url-worker2-missing-phone.txt |

## Example Scenarios

### Scenario 1: Maximum Throughput (All Headless)
Run only headless workers for best performance:
```bash
npm run srn-pump-normal-syarikat-worker2:forever
npm run srn-pump-latest-dikecualiakn-worker2:forever
npm run srn-pump-latest-dikecualiakn-worker3:forever
npm run srn-pump-latest-dikecualiakn-missing-phone-worker2:forever
```

### Scenario 2: DIKECUALIAKN Family (4 workers)
Run all DIKECUALIAKN and MISSING-PHONE workers:
```bash
npm run srn-pump-latest-dikecualiakn:forever
npm run srn-pump-latest-dikecualiakn-worker2:forever
npm run srn-pump-latest-dikecualiakn-worker3:forever
npm run srn-pump-latest-dikecualiakn-missing-phone-worker2:forever
```

### Scenario 3: One of Each (3 workers)
```bash
npm run srn-pump-normal-syarikat-worker2:forever
npm run srn-pump-latest-dikecualiakn-worker2:forever
npm run srn-pump-latest-dikecualiakn-missing-phone-worker2:forever
```

## Resource Requirements

### Light Load (1-3 workers)
- **RAM**: 4-6GB
- **CPU**: 2-4 cores
- **Recommendation**: Use headless workers only

### Medium Load (4-5 workers)
- **RAM**: 8-10GB
- **CPU**: 4-6 cores
- **Recommendation**: Mix of headed and headless

### Heavy Load (6+ workers)
- **RAM**: 12GB+
- **CPU**: 8+ cores
- **Recommendation**: Mostly or all headless workers

## Monitor All Workers

```bash
# View all logs in real-time
pm2 logs

# Check status
npm run bots:status

# PM2 monitoring dashboard
pm2 monit
```

## Stop All Workers

```bash
# Nuclear option - stop everything
npm run bots:stop-all
```

## Features Summary

✅ **6 Total Workers** - Maximum throughput across 3 spec types
✅ **Independent Output Files** - No file conflicts
✅ **Headless Mode** - Worker2 and Worker3 variants run in background
✅ **Auto-Restart** - PM2 automatically restarts on crashes
✅ **Console Prefixes** - Easy to identify which worker is logging
✅ **Progress Tracking** - SYARIKAT workers resume from last iteration
✅ **Staggered Start** - Commands available to prevent login conflicts

---

**Created**: 2026-07-02
**Total Workers**: 6
**Spec Types**: 3 (SYARIKAT, DIKECUALIAKN, MISSING-PHONE)
**Headless Workers**: 4
**Headed Workers**: 3
