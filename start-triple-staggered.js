// Script to start 3 SRN Pump scripts with staggered delays
const { exec } = require('child_process');

function runCommand(command) {
  return new Promise((resolve, reject) => {
    console.log(`\n>>> Running: ${command}`);
    exec(command, (error, stdout, stderr) => {
      if (stdout) console.log(stdout);
      if (stderr) console.error(stderr);
      if (error && !command.includes('pm2 start')) {
        reject(error);
      } else {
        resolve();
      }
    });
  });
}

function delay(seconds) {
  console.log(`\n⏳ Waiting ${seconds} seconds...`);
  return new Promise(resolve => setTimeout(resolve, seconds * 1000));
}

async function main() {
  console.log('=== Starting 3 SRN Pump Scripts with 2-Minute Delays ===\n');

  // Start Script 1
  console.log('📌 Starting Script 1: DIKECUALIAKN');
  await runCommand('pm2 start ecosystem.config.cjs --only srn-pump-latest-dikecualiakn-forever');
  console.log('✅ Script 1 started - Chrome window 1 will open soon!');

  // Wait 2 minutes
  await delay(120);

  // Start Script 2
  console.log('\n📌 Starting Script 2: MISSING-PHONE');
  await runCommand('pm2 start ecosystem.config.cjs --only srn-pump-latest-dikecualiakn-missing-phone-forever');
  console.log('✅ Script 2 started - Chrome window 2 will open soon!');

  // Wait 2 minutes
  await delay(120);

  // Start Script 3
  console.log('\n📌 Starting Script 3: STAFF-FEDS');
  await runCommand('pm2 start ecosystem.config.cjs --only srn-pump-latest-dikecualiakn-missing-phone-staff-feds-forever');
  console.log('✅ Script 3 started - Chrome window 3 will open soon!');

  console.log('\n🎉 All 3 scripts started!');
  console.log('You should now see 3 separate Chrome windows.');
  console.log('\nCommands:');
  console.log('  Check status: npm run bots:status');
  console.log('  View logs: npm run srn-pump-triple:logs-all');
  console.log('  Stop all: npm run srn-pump-triple:stop-all');
}

main().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
