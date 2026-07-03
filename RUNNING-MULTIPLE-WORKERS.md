# Running Multiple Specs Simultaneously

## Overview
You can now run SRN-PUMP-NORMAL-SYARIKAT and SRN-PUMP-LATEST-DIKECUALIAKN (or any other spec) at the same time using the worker2 variant.

## Key Differences Between Worker1 and Worker2

### Worker1 (SRN-PUMP-NORMAL-SYARIKAT.spec.ts)
- **Browser**: Chromium (headed mode - visible browser)
- **Output Files**:
  - `test-data/current-url-worker1.txt`
  - `test-data/srn-pump-normal-syarikat-progress.txt`
- **Test Results**: `test-results/` (default)
- **Console Prefix**: None

### Worker2 (SRN-PUMP-NORMAL-SYARIKAT-worker2.spec.ts)
- **Browser**: Edge (headless mode - no visible browser)
- **Output Files**:
  - `test-data/current-url-worker2-syarikat.txt`
  - `test-data/srn-pump-normal-syarikat-worker2-progress.txt`
- **Test Results**: `test-results-worker2/`
- **Console Prefix**: `[WORKER2]`

### Shared Files
Both workers share:
- `test-data/srn-permanent-log.txt` (all SRNs logged here with worker identifier)
- `test-data/ssm-companies.json` (company data)
- `test-data/addresses_my.json` (address data)

## How to Run

### Option 1: Run Both Workers at the Same Time (Immediate Start)
```bash
# Start worker1
npm run srn-pump-normal-syarikat:forever

# Start worker2 (in another terminal or same terminal)
npm run srn-pump-normal-syarikat-worker2:forever
```

### Option 2: Run with Staggered Start (60 seconds delay)
This prevents both workers from logging in at the exact same time:
```bash
npm run srn-pump-normal-syarikat:staggered
```
This will:
1. Start worker1 immediately
2. Wait 60 seconds
3. Start worker2

### Option 3: Run Worker1 + Different Spec (e.g., DIKECUALIAKN)
```bash
# Start worker1 (Syarikat spec - headed Chromium)
npm run srn-pump-normal-syarikat:forever

# Start another spec (e.g., DIKECUALIAKN - headed Chromium)
npm run srn-pump-latest-dikecualiakn:forever
```

**Note**: Running two headed browsers simultaneously will show both browser windows on screen.

## Monitoring

### View Logs for Both Workers
```bash
# Worker1 logs
npm run srn-pump-normal-syarikat:logs

# Worker2 logs
npm run srn-pump-normal-syarikat-worker2:logs

# View both together
pm2 logs srn-pump-normal-syarikat-forever srn-pump-normal-syarikat-worker2-forever
```

### Check Status
```bash
npm run bots:status
```

## Stopping Workers

### Stop Individual Workers
```bash
# Stop worker1
npm run srn-pump-normal-syarikat:stop

# Stop worker2
npm run srn-pump-normal-syarikat-worker2:stop
```

### Stop Both Workers at Once
```bash
npm run srn-pump-normal-syarikat:stop-both
```

## Progress Tracking

Each worker maintains its own progress file:
- Worker1: Resumes from last iteration in `srn-pump-normal-syarikat-progress.txt`
- Worker2: Resumes from last iteration in `srn-pump-normal-syarikat-worker2-progress.txt`

If a worker crashes:
- PM2 will auto-restart it
- It will resume from the last completed iteration (not start from 1)

## Reset Progress

To start fresh from iteration 1:
```bash
# Reset worker1
del test-data\srn-pump-normal-syarikat-progress.txt

# Reset worker2
del test-data\srn-pump-normal-syarikat-worker2-progress.txt
```

## Example Workflow

```bash
# Start both workers with staggered timing
npm run srn-pump-normal-syarikat:staggered

# Check status
npm run bots:status

# View logs in real-time
pm2 logs

# Later, stop both
npm run srn-pump-normal-syarikat:stop-both
```

## Advantages of Worker2 (Headless)

1. **Less Resource Usage**: Headless mode uses less CPU/memory
2. **No Visual Distraction**: Browser doesn't show on screen
3. **Better for Background**: Can work on other tasks without browser windows in the way
4. **Same Functionality**: All automation works the same, just no visible UI

## Running 3+ Specs Simultaneously

You can run more than 2 specs at once:
```bash
npm run srn-pump-normal-syarikat:forever        # Worker1 - Syarikat (headed)
npm run srn-pump-normal-syarikat-worker2:forever # Worker2 - Syarikat (headless)
npm run srn-pump-latest-dikecualiakn:forever     # Worker3 - DIKECUALIAKN (headed)
```

Just make sure each spec uses different:
- Output files
- Progress tracking files
- Account credentials (if needed)
