# 📋 PM2 Command Guide - Quick Summary

## ✅ Complete Command Guide Created!

**Location:** `test-data/COMMAND-GUIDE.txt`

---

## 📊 What's Included

The guide contains **ALL** PM2 commands for your project:

### 1. **Quick Start Commands**
- View status: `npm run bots:status`
- Start all: `npm run bots:all`
- Stop all: `npm run bots:stop-all`

### 2. **Individual Script Commands (25+ scripts)**
Each script has 4 commands:
- `:one` - Run once
- `:forever` - Start with PM2 (auto-restart)
- `:logs` - View logs
- `:stop` - Stop PM2 process

### 3. **Script Categories Covered**
✅ E2E workflows (e2e, e2e-penalty, e2e-dev, etc.)  
✅ Login scripts (login, login2)  
✅ Stamping workflows (3 variants)  
✅ SRN Pump - Latest  
✅ SRN Pump - Dikecualikan (+ 3 workers)  
✅ SRN Pump - Missing Phone (+ 2 workers)  
✅ SRN Pump - Missing Phone Staff FEDS (NEW!)  
✅ SRN Pump - Penalty Only  
✅ SRN Pump - Normal  
✅ SRN Pump - Normal Syarikat (+ 2 workers)  
✅ SRN Dev  
✅ Generate PDF  

### 4. **Crash Recovery Commands**
- Check progress: `cat test-data/progress-*.txt`
- Reset progress: `del test-data\progress-*.txt`
- View permanent log: `cat test-data/srn-permanent-log.txt`

### 5. **Multi-Worker Patterns**
- Staggered start commands (60s delay)
- Stop-both commands
- Stop-all commands (for 3-worker setups)

### 6. **Monitoring & Debugging**
- PM2 logs, status, monitoring
- Troubleshooting tips
- Progress file reference table

### 7. **Playwright & Docker Commands**
- Test execution commands
- Docker run commands
- Report viewing

---

## 🎯 Quick Access Examples

### Your NEW Script (Missing Phone Staff FEDS)
```bash
# Start
npm run srn-pump-latest-dikecualiakn-missing-phone-staff-feds:forever

# View logs
npm run srn-pump-latest-dikecualiakn-missing-phone-staff-feds:logs

# Stop
npm run srn-pump-latest-dikecualiakn-missing-phone-staff-feds:stop

# Check progress
cat test-data/srn-pump-missing-phone-staff-feds-progress.txt

# Reset and restart
npm run srn-pump-latest-dikecualiakn-missing-phone-staff-feds:stop
del test-data\srn-pump-missing-phone-staff-feds-progress.txt
npm run srn-pump-latest-dikecualiakn-missing-phone-staff-feds:forever
```

### Multi-Worker Example
```bash
# Start both workers with 60s delay
npm run srn-pump-normal-syarikat:staggered

# Stop both workers
npm run srn-pump-normal-syarikat:stop-both
```

---

## 📂 File Location

**Full Guide:** `test-data/COMMAND-GUIDE.txt`

The file contains:
- ✅ All 25+ PM2 scripts with full commands
- ✅ Crash recovery instructions
- ✅ Multi-worker coordination patterns
- ✅ Troubleshooting section
- ✅ Progress file reference table
- ✅ Common workflows
- ✅ Monitoring commands

---

## 🎉 Summary

You now have:
1. ✅ Crash recovery on 23 of 25 scripts
2. ✅ Complete PM2 command reference in `test-data/COMMAND-GUIDE.txt`
3. ✅ Quick reference guide in `CRASH-RECOVERY-QUICK-REF.md`
4. ✅ Full technical guide in `CRASH-RECOVERY-GUIDE.md`
5. ✅ Implementation summary in `IMPLEMENTATION-COMPLETE.md`

**Everything is production-ready!** 🚀
