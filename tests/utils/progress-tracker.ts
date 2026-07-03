import * as fs from "fs";

/**
 * Progress tracker for crash recovery
 * Saves and resumes iteration progress
 */
export class ProgressTracker {
  private progressFile: string;

  constructor(scriptName: string) {
    // Create unique progress file for each script
    this.progressFile = `./test-data/progress-${scriptName}.txt`;
  }

  /**
   * Get the starting iteration number
   * Returns 1 if no progress file exists, otherwise returns last completed + 1
   */
  getStartIteration(): number {
    if (!fs.existsSync(this.progressFile)) {
      return 1;
    }

    try {
      const lastCompleted = parseInt(
        fs.readFileSync(this.progressFile, "utf-8").trim(),
        10
      );
      if (!isNaN(lastCompleted) && lastCompleted > 0) {
        const startIteration = lastCompleted + 1;
        console.log(
          `✓ Resuming from iteration ${startIteration} (last completed: ${lastCompleted})`
        );

        // Log to permanent log if it exists
        if (fs.existsSync("./test-data/srn-permanent-log.txt")) {
          fs.appendFileSync(
            "./test-data/srn-permanent-log.txt",
            `[${new Date().toISOString()}] Resuming from iteration ${startIteration}\n`
          );
        }

        return startIteration;
      }
    } catch (err) {
      console.log("Could not read progress file, starting from iteration 1");
    }

    return 1;
  }

  /**
   * Save progress after successful iteration
   */
  saveProgress(iteration: number): void {
    fs.writeFileSync(this.progressFile, iteration.toString());
    console.log(`✓ Progress saved: iteration ${iteration} completed`);
  }

  /**
   * Reset progress (delete progress file)
   */
  reset(): void {
    if (fs.existsSync(this.progressFile)) {
      fs.unlinkSync(this.progressFile);
      console.log(`✓ Progress reset for ${this.progressFile}`);
    }
  }

  /**
   * Calculate penalty occurrence count for scripts with FLOW_PATTERN
   * Used to maintain correct penalty alternation when resuming
   */
  calculatePenaltyCount(
    startIteration: number,
    flowPattern: Array<string>
  ): number {
    let count = 0;
    for (let j = 1; j < startIteration; j++) {
      const flowType = flowPattern[(j - 1) % flowPattern.length];
      if (flowType === "PENALTY") {
        count++;
      }
    }
    return count;
  }
}
