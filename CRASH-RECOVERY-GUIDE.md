# Crash Recovery Guide

## Overview

All test scripts in the `tests/` folder now have automatic crash recovery. If a script crashes or is stopped, PM2 will automatically restart it and it will continue from where it left off.

## How It Works

### 1. Progress Tracking
- Each script saves its progress after completing each iteration
- Progress is saved to unique files in `test-data/` directory
- Format: `test-data/progress-{script-name}.txt`

### 2. Automatic Resume
When a script restarts (via PM2 auto-restart):
1. Reads the progress file
2. Finds the last completed iteration (e.g., iteration 9)
3. Starts from the next iteration (e.g., iteration 10)
4. Maintains correct penalty pattern and date calculations

### 3. Example Flow
```
Run 1: Iterations 1-9 complete → crash at iteration 9 → progress file = "9"
PM2 auto-restart
Run 2: Reads "9" → starts at iteration 10 → continues 10-400
```

## Progress Files

Each script has its own progress file:

| Script | Progress File |
|--------|---------------|
| e2e.spec.ts | `test-data/progress-e2e.txt` |
| e2e-penalty.spec.ts | `test-data/progress-e2e-penalty.txt` |
| e2e-combine-penalti-without-penalty.spec.ts | `test-data/progress-e2e-combine-penalti-without-penalty.txt` |
| e2e-combine-penalti-without-penalty-worker2.spec.ts | `test-data/progress-e2e-combine-penalti-without-penalty-worker2.txt` |
| SRN-PUMP-LATEST.spec.ts | `test-data/progress-SRN-PUMP-LATEST.txt` |
| SRN-PUMP-LATEST-DIKECUALIAKN.spec.ts | `test-data/progress-SRN-PUMP-LATEST-DIKECUALIAKN.txt` |
| SRN-PUMP-LATEST-DIKECUALIAKN-MISSING-PHONE.spec.ts | `test-data/srn-pump-missing-phone-progress.txt` |
| SRN-PUMP-LATEST-DIKECUALIAKN-MISSING-PHONE-STAFF-FEDS.spec.ts | `test-data/srn-pump-missing-phone-staff-feds-progress.txt` |
| SRN-PUMP-LATEST-DIKECUALIAKN-PENALTY-ONLY.spec.ts | `test-data/progress-SRN-PUMP-LATEST-DIKECUALIAKN-PENALTY-ONLY.txt` |
| SRN-PUMP-LATEST-DIKECUALIAKN-OPTIMIZED.spec.ts | `test-data/progress-SRN-PUMP-LATEST-DIKECUALIAKN-OPTIMIZED.txt` |
| SRN-PUMP-NORMAL.spec.ts | `test-data/progress-SRN-PUMP-NORMAL.txt` |
| SRN-PUMP-NORMAL-SYARIKAT.spec.ts | `test-data/srn-pump-normal-syarikat-progress.txt` |
| login.spec.ts | `test-data/progress-login.txt` |
| stamping.spec.ts | `test-data/progress-stamping.txt` |
| And all other test files... | `test-data/progress-{script-name}.txt` |

## Usage

### Normal Operation (No Manual Intervention Needed)
Just run the script with PM2 as usual:

```bash
npm run e2e:forever
npm run srn-pump-latest:forever
npm run e2e-penalty:forever
# etc.
```

If the script crashes:
- PM2 automatically restarts it (after 10 second delay)
- Script reads progress file
- Continues from last completed iteration
- Logs resume point to console and `srn-permanent-log.txt`

### Check Current Progress

```bash
# View progress file for any script
cat test-data/progress-e2e.txt
cat test-data/progress-SRN-PUMP-LATEST.txt
```

### Monitor Logs

```bash
# View logs to see resume messages
npm run e2e:logs
npm run srn-pump-latest:logs

# Look for messages like:
# "Resuming from iteration 10 (last completed: 9)"
# "Progress saved: iteration 10 completed"
```

### Reset Progress (Start from Iteration 1)

If you want to start fresh from iteration 1:

```bash
# Stop the PM2 process
npm run e2e:stop

# Delete the progress file
del test-data\progress-e2e.txt

# Restart PM2
npm run e2e:forever
```

Or for any other script:

```bash
# Example for SRN-PUMP-LATEST
npm run srn-pump-latest:stop
del test-data\progress-SRN-PUMP-LATEST.txt
npm run srn-pump-latest:forever
```

### Reset All Progress Files

```bash
# Delete all progress files
del test-data\progress-*.txt
del test-data\srn-pump-*-progress.txt
```

## Technical Details

### Scripts with FLOW_PATTERN (Penalty Alternation)
Scripts that use `FLOW_PATTERN` (Duti Dikecualikan → No Penalty → Penalty → No Penalty) maintain correct penalty count when resuming:

- Calculates how many penalty iterations occurred before the resume point
- Maintains correct penalty date alternation (Jan 20% → May 10% → Jan 20%...)
- Pattern continues seamlessly

### Logging
All resume events are logged to:
1. Console output (visible in PM2 logs)
2. `test-data/srn-permanent-log.txt` with timestamp

Example log entry:
```
[2026-07-02T14:30:00.000Z] Resuming from iteration 10
```

### Progress Save Timing
Progress is saved **after** each iteration completes successfully:
- After the final action in the loop
- Before moving to the next iteration
- Ensures crash at iteration 9 means 9 was completed

## Troubleshooting

### Progress File Not Created
- Check if `test-data/` directory exists
- Check file permissions
- Script might not have completed even one iteration yet

### Script Always Starts from 1
- Progress file might be corrupted (delete it)
- Check progress file contains valid number: `cat test-data/progress-*.txt`
- Ensure PM2 is running the correct script

### Wrong Iteration Number
- Delete the progress file and restart
- Check `srn-permanent-log.txt` for resume history

### Scripts Without Progress Tracking
Only the migration script (`add-progress-tracking.js`) excluded:
- `login2.spec.ts`
- `Objection.spec.ts` (if no loop found)
- Any non-.spec.ts files

## Files Created

1. **Utility Module**: `tests/utils/progress-tracker.ts`
   - Reusable TypeScript class for future scripts
   - Not currently used by existing scripts (inline implementation used)

2. **Migration Script**: `add-progress-tracking.js`
   - One-time script that added progress tracking to all tests
   - Can be deleted or kept for future reference

3. **Progress Files**: `test-data/progress-*.txt`
   - One per test script
   - Contains single number (last completed iteration)
   - Git-ignored (add to `.gitignore` if needed)

## Best Practices

1. **Don't Delete Progress Files During Active Runs**
   - Stop PM2 first, then delete, then restart

2. **Monitor Progress Files for Long Runs**
   - Periodically check progress: `cat test-data/progress-*.txt`
   - Compare with expected total iterations

3. **Check Logs After Crashes**
   - PM2 logs show resume messages
   - `srn-permanent-log.txt` has permanent record

4. **Add Progress Files to .gitignore**
   ```
   test-data/progress-*.txt
   test-data/*-progress.txt
   ```

## Summary

✅ **22 test scripts updated** with automatic crash recovery
✅ **PM2 auto-restart** continues from last completed iteration  
✅ **No manual intervention** needed for normal operation  
✅ **Penalty patterns preserved** when resuming  
✅ **Full logging** to console and permanent log  

Your automation is now crash-resilient! 🎉
