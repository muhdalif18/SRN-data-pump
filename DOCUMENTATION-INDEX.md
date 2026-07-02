# 📚 SRN Data Pump - Documentation Index

## Quick Links

| Document | Purpose | Location |
|----------|---------|----------|
| **PM2 Commands** | Complete command reference | [test-data/COMMAND-GUIDE.txt](test-data/COMMAND-GUIDE.txt) |
| **Crash Recovery Guide** | Technical implementation details | [CRASH-RECOVERY-GUIDE.md](CRASH-RECOVERY-GUIDE.md) |
| **Quick Reference** | Common crash recovery tasks | [CRASH-RECOVERY-QUICK-REF.md](CRASH-RECOVERY-QUICK-REF.md) |
| **Implementation Complete** | Summary of what was done | [IMPLEMENTATION-COMPLETE.md](IMPLEMENTATION-COMPLETE.md) |
| **Command Guide Summary** | Overview of command guide | [COMMAND-GUIDE-SUMMARY.md](COMMAND-GUIDE-SUMMARY.md) |
| **Project Setup** | Architecture and setup | [CLAUDE.md](CLAUDE.md) |

---

## 🎯 What You Need to Know

### 1. All Scripts Have Crash Recovery ✅
- **23 of 25 scripts** now automatically resume after crash
- PM2 restarts failed scripts automatically
- Progress is saved after each iteration
- No manual intervention needed

### 2. Complete PM2 Command Reference ✅
- **ALL commands** documented in `test-data/COMMAND-GUIDE.txt`
- Organized by script category
- Includes multi-worker coordination
- Monitoring and debugging commands

### 3. Your New Script is Ready ✅
```bash
# SRN-PUMP-LATEST-DIKECUALIAKN-MISSING-PHONE-STAFF-FEDS
npm run srn-pump-latest-dikecualiakn-missing-phone-staff-feds:forever
npm run srn-pump-latest-dikecualiakn-missing-phone-staff-feds:logs
npm run srn-pump-latest-dikecualiakn-missing-phone-staff-feds:stop
```

---

## 🚀 Common Tasks

### Start a Script with Crash Recovery
```bash
npm run srn-pump-latest:forever
# Automatically resumes after crash!
```

### Check Current Progress
```bash
cat test-data/progress-srn-pump-latest.txt
```

### Reset Progress (Start from Iteration 1)
```bash
npm run srn-pump-latest:stop
del test-data\progress-srn-pump-latest.txt
npm run srn-pump-latest:forever
```

### View All Running Scripts
```bash
npm run bots:status
```

### Stop All Scripts
```bash
npm run bots:stop-all
```

---

## 📋 Documentation by Task

### Need to: Run Scripts
→ Read: [test-data/COMMAND-GUIDE.txt](test-data/COMMAND-GUIDE.txt)  
→ Section: Individual Script Commands

### Need to: Understand Crash Recovery
→ Read: [CRASH-RECOVERY-GUIDE.md](CRASH-RECOVERY-GUIDE.md)  
→ Section: How It Works

### Need to: Quick Reference
→ Read: [CRASH-RECOVERY-QUICK-REF.md](CRASH-RECOVERY-QUICK-REF.md)  
→ All common commands in one page

### Need to: Multi-Worker Setup
→ Read: [test-data/COMMAND-GUIDE.txt](test-data/COMMAND-GUIDE.txt)  
→ Section: Multi-Worker Patterns

### Need to: Troubleshooting
→ Read: [CRASH-RECOVERY-GUIDE.md](CRASH-RECOVERY-GUIDE.md)  
→ Section: Troubleshooting

### Need to: Project Architecture
→ Read: [CLAUDE.md](CLAUDE.md)  
→ Complete project documentation

---

## 📊 Implementation Summary

### Completed: 2026-07-02

✅ **Crash Recovery**: 23 of 25 scripts  
✅ **PM2 Configuration**: All scripts configured  
✅ **Documentation**: 6 comprehensive guides  
✅ **Command Reference**: Complete PM2 command list  
✅ **Progress Tracking**: Automatic save/resume  
✅ **Git Integration**: Progress files ignored  

### Scripts with Crash Recovery
- e2e, e2e-penalty, e2e-dev
- e2e-ejen-duti-setem, e2e-ejen-duti-kompaun
- e2e-combine-penalti-without-penalty (+ worker2)
- login, stamping (+ peranan variants)
- SRN-PUMP-LATEST (+ peranan)
- SRN-PUMP-LATEST-DIKECUALIAKN (+ 3 workers + variants)
- SRN-PUMP-LATEST-DIKECUALIAKN-MISSING-PHONE (+ worker2)
- SRN-PUMP-LATEST-DIKECUALIAKN-MISSING-PHONE-STAFF-FEDS ⭐ NEW
- SRN-PUMP-PENALTY-ONLY
- SRN-PUMP-NORMAL (+ SYARIKAT with worker2)
- SRN_dev
- And more...

### Scripts Excluded (Correctly)
- Objection.spec.ts (only 1 iteration)
- login2.spec.ts (no loop)

---

## 🎯 Getting Started

### First Time Setup
1. Install dependencies: `npm install`
2. Install Playwright browsers: `npx playwright install --with-deps`
3. Review available scripts: `cat test-data/COMMAND-GUIDE.txt`

### Running Your First Script
```bash
# Start a script
npm run e2e:forever

# View logs
npm run e2e:logs

# Check status
npm run bots:status

# Stop when done
npm run e2e:stop
```

### If Script Crashes
**Nothing to do!** PM2 automatically:
1. Restarts the script (after 10 seconds)
2. Script reads progress file
3. Resumes from last completed iteration
4. Continues until completion

You'll see in logs:
```
Resuming from iteration 10 (last completed: 9)
```

---

## 📁 File Structure

```
SRN-data-pump/
├── tests/                          # Test scripts (23 with crash recovery)
├── test-data/
│   ├── COMMAND-GUIDE.txt          # ⭐ Complete PM2 command reference
│   ├── progress-*.txt             # Progress files (auto-created)
│   ├── srn-permanent-log.txt      # Permanent log across all runs
│   └── current-url-worker*.txt    # SRN traces
├── CRASH-RECOVERY-GUIDE.md        # Technical guide
├── CRASH-RECOVERY-QUICK-REF.md    # Quick reference
├── IMPLEMENTATION-COMPLETE.md     # Implementation summary
├── COMMAND-GUIDE-SUMMARY.md       # Command guide overview
├── DOCUMENTATION-INDEX.md         # ⭐ This file
├── CLAUDE.md                      # Project documentation
├── ecosystem.config.cjs           # PM2 configuration
├── package.json                   # NPM scripts
└── playwright.config.ts           # Playwright configuration
```

---

## 🎓 Best Practices

### DO ✅
- Use `:forever` for long-running jobs
- Check `:logs` to monitor progress
- Use `bots:status` to see all running scripts
- Delete progress files to reset (when needed)
- Use staggered starts for multi-worker scripts

### DON'T ❌
- Don't delete progress files while script is running
- Don't manually edit progress files
- Don't run same script multiple times (use workers instead)
- Don't commit progress files to git (already ignored)

---

## 🔍 Need Help?

### Check These First
1. **Logs**: `npm run <script>:logs`
2. **Status**: `npm run bots:status`
3. **Progress**: `cat test-data/progress-<script>.txt`
4. **Command Guide**: `cat test-data/COMMAND-GUIDE.txt`

### Common Issues
- **Script won't stop**: `pm2 delete <script>-forever`
- **Progress seems wrong**: Delete progress file and restart
- **Multiple scripts running**: `npm run bots:stop-all`
- **Need to start fresh**: Delete all progress files

---

## 📞 Support

All documentation is self-contained in this repository:
- Technical details → [CRASH-RECOVERY-GUIDE.md](CRASH-RECOVERY-GUIDE.md)
- Commands → [test-data/COMMAND-GUIDE.txt](test-data/COMMAND-GUIDE.txt)
- Quick tasks → [CRASH-RECOVERY-QUICK-REF.md](CRASH-RECOVERY-QUICK-REF.md)

---

**Last Updated**: 2026-07-02  
**Status**: ✅ Production Ready  
**Coverage**: 100% of applicable scripts  

🎉 **Your automation suite is now fully crash-resilient!** 🎉
