const fs = require('fs');
const path = require('path');

// List of test files to update
const testFiles = [
  'tests/SRN-PUMP-LATEST-DIKECUALIAKN.spec.ts',
  'tests/SRN-PUMP-NORMAL-SYARIKAT.spec.ts',
  'tests/SRN-PUMP-NORMAL.spec.ts',
  'tests/SRN-PUMP-LATEST-DIKECUALIAKN-PENALTY-ONLY.spec.ts',
  'tests/SRN-PUMP-LATEST-DIKECUALIAKN-DEV-NEW.spec.ts',
  'tests/e2e-combine-penalti-without-penalty-worker2.spec.ts',
  'tests/e2e-combine-penalti-without-penalty.spec.ts',
  'tests/e2e-dev.spec.ts',
  'tests/e2e-ejen-duti-kompaun.spec.ts',
  'tests/e2e-ejen-duti-setem.spec.ts',
  'tests/e2e-penalty.spec.ts',
  'tests/e2e.spec.ts',
  'tests/login.spec.ts',
  'tests/login2.spec.ts',
  'tests/SRN_dev.spec.ts',
  'tests/SRN-PUMP-LATEST.spec.ts',
  'tests/SRN-pump-peranan.spec.ts',
  'tests/stamping-peranan-ejen-duti-setem.spec.ts',
  'tests/stamping-peranan-ejen-firma-guaman.spec.ts',
  'tests/stamping.spec.ts',
  'tests/SRN-PUMP-LATEST-DIKECUALIAKN-DEV.spec.ts',
  'tests/SRN-PUMP-LATEST-DIKECUALIAKN-DS7.spec.ts',
  'tests/SRN-PUMP-LATEST-DIKECUALIAKN-OPTIMIZED.spec.ts',
  'tests/SRN-PUMP-LATEST-DIKECUALIAKN-QA.spec.ts',
  'tests/Objection.spec.ts',
];

function addProgressTracking(filePath) {
  console.log(`Processing: ${filePath}`);

  let content = fs.readFileSync(filePath, 'utf-8');

  // Skip if already has progress tracking
  if (content.includes('progressFile') || content.includes('Progress tracking')) {
    console.log(`  ⏭️  Skipped (already has progress tracking)`);
    return;
  }

  // Extract script name from file path for unique progress file
  const scriptName = path.basename(filePath, '.spec.ts');
  const progressFile = `progress-${scriptName}.txt`;

  // Find the loop pattern: for (let i = 1; i <= NUMBER; i++)
  const loopRegex = /for \(let i = 1; i <= (\d+); i\+\+\) \{/;
  const loopMatch = content.match(loopRegex);

  if (!loopMatch) {
    console.log(`  ⏭️  Skipped (no loop found)`);
    return;
  }

  const maxIterations = loopMatch[1];

  // Check if file has FLOW_PATTERN (for penalty calculation)
  const hasFlowPattern = content.includes('FLOW_PATTERN');

  // 1. Add progress tracking code before the loop
  const progressTrackingCode = `
  // Progress tracking: Read last completed iteration
  const progressFile = "./test-data/${progressFile}";
  let startIteration = 1;

  if (fs.existsSync(progressFile)) {
    try {
      const lastCompleted = parseInt(fs.readFileSync(progressFile, "utf-8").trim(), 10);
      if (!isNaN(lastCompleted) && lastCompleted > 0) {
        startIteration = lastCompleted + 1;
        console.log(\`Resuming from iteration \${startIteration} (last completed: \${lastCompleted})\`);
        fs.appendFileSync(
          "./test-data/srn-permanent-log.txt",
          \`[\${new Date().toISOString()}] Resuming from iteration \${startIteration}\\n\`,
        );
      }
    } catch (err) {
      console.log("Could not read progress file, starting from iteration 1");
    }
  }
`;

  const penaltyCalculationCode = hasFlowPattern ? `
  // Calculate penalty occurrence count for resumed runs
  let penaltyOccurrenceCount = 0;
  for (let j = 1; j < startIteration; j++) {
    const flowType = FLOW_PATTERN[(j - 1) % FLOW_PATTERN.length];
    if (flowType === "PENALTY") {
      penaltyOccurrenceCount++;
    }
  }
` : `  let penaltyOccurrenceCount = 0;
`;

  // Replace the penaltyOccurrenceCount declaration and loop start
  const beforeLoopPattern = hasFlowPattern
    ? /let penaltyOccurrenceCount = 0;\s+for \(let i = 1; i <= (\d+); i\+\+\) \{/
    : /for \(let i = 1; i <= (\d+); i\+\+\) \{/;

  const replacement = hasFlowPattern
    ? `${progressTrackingCode}${penaltyCalculationCode}
  for (let i = startIteration; i <= ${maxIterations}; i++) {`
    : `${progressTrackingCode}
  for (let i = startIteration; i <= ${maxIterations}; i++) {`;

  content = content.replace(beforeLoopPattern, replacement);

  // 2. Find the end of the loop and add progress save
  // Look for common patterns at loop end
  const loopEndPatterns = [
    /(\s+await page\.goto\([^)]+\);\s+)\s*\}/,  // ends with page.goto
    /(\s+await page\.waitForTimeout\(\d+\);\s+)\s*\}/,  // ends with waitForTimeout
    /(\s+console\.log\([^)]+\);\s+)\s*\}/,  // ends with console.log
  ];

  let patternFound = false;
  for (const pattern of loopEndPatterns) {
    if (pattern.test(content)) {
      content = content.replace(
        pattern,
        `$1
    // Save progress after successful iteration
    fs.writeFileSync(progressFile, i.toString());
    console.log(\`Progress saved: iteration \${i} completed\`);
  }`
      );
      patternFound = true;
      break;
    }
  }

  if (!patternFound) {
    console.log(`  ⚠️  Could not find loop end pattern, manual adjustment needed`);
  }

  // Write the updated content
  fs.writeFileSync(filePath, content, 'utf-8');
  console.log(`  ✅ Updated successfully`);
}

console.log('Adding progress tracking to test files...\n');

for (const file of testFiles) {
  try {
    addProgressTracking(file);
  } catch (err) {
    console.log(`  ❌ Error: ${err.message}`);
  }
}

console.log('\n✅ Migration complete!');
console.log('\nNote: Review the changes and manually adjust any files that need it.');
