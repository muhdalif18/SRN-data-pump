# Crash Recovery - Quick Reference

## ✅ What Changed

All test scripts now automatically resume from the last completed iteration after a crash.

## 🚀 Normal Usage (No Changes Required)

```bash
# Just run your scripts normally with PM2
npm run e2e:forever
npm run srn-pump-latest:forever
npm run e2e-penalty:forever

# PM2 automatically restarts on crash
# Script automatically resumes from last completed iteration
```

## 📊 Check Progress

```bash
# View current progress
cat test-data/progress-e2e.txt
cat test-data/progress-SRN-PUMP-LATEST.txt

# View logs (shows "Resuming from iteration X" messages)
npm run e2e:logs
npm run srn-pump-latest:logs
```

## 🔄 Reset Progress (Start from Iteration 1)

```bash
# 1. Stop PM2
npm run e2e:stop

# 2. Delete progress file
del test-data\progress-e2e.txt

# 3. Restart
npm run e2e:forever
```

## 🧹 Reset All Progress Files

```bash
# Delete all progress files at once
del test-data\progress-*.txt
del test-data\srn-pump-*-progress.txt
```

## 📝 Progress File Naming Pattern

- Most scripts: `test-data/progress-{script-name}.txt`
- Examples:
  - `test-data/progress-e2e.txt`
  - `test-data/progress-SRN-PUMP-LATEST.txt`
  - `test-data/progress-e2e-penalty.txt`

## 📖 Full Documentation

See [CRASH-RECOVERY-GUIDE.md](CRASH-RECOVERY-GUIDE.md) for complete details.

---

**Updated:** 2026-07-02  
**Scripts Updated:** 22 test files  
**PM2 Config:** No changes needed (auto-restart already configured)
