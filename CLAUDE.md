# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Setup and execution commands

- Install dependencies:
  - `npm install`
  - `npx playwright install --with-deps`

- Run all Playwright tests:
  - `npm test`

- Run in headed mode:
  - `npm run test:headed`

- Run with Playwright UI:
  - `npm run test:ui`

- Open Playwright HTML report:
  - `npm run report`

- Run single specs (primary workflows):
  - `npm run e2e:one`
  - `npm run login:one`
  - `npm run stamping-peranan-ejen-duti-setem:one`
  - `npm run stamping-peranan-ejen-firma-guaman:one`
  - `npm run e2e-ejen-duti-setem:one`
  - `npm run stamping:one`
  - `npm run login2:one`
  - `npm run e2e-penalty:one`
  - `npm run e2e-combine-penalti-without-penalty:one`
  - `npm run e2e-combine-penalti-without-penalty-worker2:one` (runs with Edge headless, outputs to test-results-worker2)
  - `npm run srn-pump-latest:one`
  - `npm run srn-pump-peranan:one`
  - `npm run srn-dev:one`

- Multi-worker coordination:
  - Staggered start (60s delay): `npm run e2e-combine-penalti-without-penalty:staggered`
  - Stop both workers: `npm run e2e-combine-penalti-without-penalty:stop-both`

- PM2 long-running jobs:
  - Start:
    - `npm run e2e:forever`
    - `npm run login:forever`
    - `npm run stamping-peranan-ejen-duti-setem:forever`
    - `npm run stamping-peranan-ejen-firma-guaman:forever`
    - `npm run e2e-ejen-duti-setem:forever`
    - `npm run stamping:forever`
    - `npm run login2:forever`
    - `npm run e2e-penalty:forever`
    - `npm run e2e-combine-penalti-without-penalty:forever`
    - `npm run srn-pump-latest:forever`
    - `npm run srn-pump-peranan:forever`
    - `npm run srn-dev:forever`
  - Logs:
    - `npm run e2e:logs`
    - `npm run login:logs`
    - `npm run stamping-peranan-ejen-duti-setem:logs`
    - `npm run stamping-peranan-ejen-firma-guaman:logs`
    - `npm run e2e-ejen-duti-setem:logs`
    - `npm run stamping:logs`
    - `npm run login2:logs`
    - `npm run e2e-penalty:logs`
    - `npm run e2e-combine-penalti-without-penalty:logs`
    - `npm run srn-pump-latest:logs`
    - `npm run srn-pump-peranan:logs`
    - `npm run srn-dev:logs`
  - Stop:
    - `npm run e2e:stop`
    - `npm run login:stop`
    - `npm run stamping-peranan-ejen-duti-setem:stop`
    - `npm run stamping-peranan-ejen-firma-guaman:stop`
    - `npm run e2e-ejen-duti-setem:stop`
    - `npm run stamping:stop`
    - `npm run login2:stop`
    - `npm run e2e-penalty:stop`
    - `npm run e2e-combine-penalti-without-penalty:stop`
    - `npm run srn-pump-latest:stop`
    - `npm run srn-pump-peranan:stop`
    - `npm run srn-dev:stop`
  - Status:
    - `npm run bots:status`
  - Manage all bots:
    - `npm run bots:all`
    - `npm run bots:stop-all`

- Docker path from README:
  - `docker run -v ${PWD}/test-data:/app/test-data matalep00/ds7-automation:latest`
  - With report output:
    - `docker run -v ${PWD}/test-data:/app/test-data -v ${PWD}/playwright-report:/app/playwright-report matalep00/ds7-automation:latest`
  - Run specific test via docker-compose:
    - `docker-compose run playwright npx playwright test <spec>`

## High-level architecture

This repository is a Playwright-driven browser automation suite for e-Duti workflows spanning multiple web systems and roles.

### 1) Runtime and orchestration

- Core runtime is configured in `playwright.config.ts`.
- Tests run serially (`workers: 1`, `fullyParallel: false`) and with long timeouts to support heavy end-to-end flows.
- Browser is non-headless and configured to use the real maximized window (`viewport: null`, `--start-maximized`) to avoid layout compression/cutoff issues in UI-heavy pages.
- `ecosystem.config.cjs` maps PM2 app names to specific spec files for persistent/restarting runs, with `autorestart: true` and `restart_delay: 10000`.
- `docker-compose.yml` sets `CI=true`, so Playwright uses CI behavior from `playwright.config.ts` (`retries: 2` instead of local `0`).
- The Docker image default command in `Dockerfile` runs `npx playwright test login.spec.ts`.

### 2) Workflow style in specs

- Specs in `tests/*.spec.ts` are long scenario scripts that combine:
  - login to MyTax/e-Duti,
  - stamping submission creation,
  - SRN extraction,
  - follow-up actions in HITS,
  - repeated iterations (`for` loops) for bulk processing.
- These are stateful system tests, not isolated unit tests; many assertions are implicit via waits/selectors and successful navigation.

### 3) Role-specific variants

- The suite has multiple near-parallel flows with role/account differences:
  - base e2e (`e2e.spec.ts`),
  - ejen duti setem variant (`e2e-ejen-duti-setem.spec.ts`),
  - stamping role flows (`stamping-peranan-ejen-duti-setem.spec.ts`, `stamping-peranan-ejen-firma-guaman.spec.ts`),
  - login-focused scripts (`login.spec.ts`, `login2.spec.ts`),
  - penalty workflows (`e2e-penalty.spec.ts`, `e2e-combine-penalti-without-penalty.spec.ts`),
  - SRN pump variants (`SRN-PUMP-LATEST.spec.ts`, `SRN-pump-peranan.spec.ts`).
- Most maintenance work is selector, timing, and role-switch logic updates across these parallel flows.
- Worker2 variant (`e2e-combine-penalti-without-penalty-worker2.spec.ts`) runs in Edge headless mode with separate output directory for parallel execution with worker1.

### 4) Data dependencies and outputs

- Input data is file-driven from `test-data/`:
  - `addresses_my.json` — address data for form filling
  - `users_pre2.json` — user account data
  - `userstds (2).xlsx` — spreadsheet data source
  - `image (19).png` — file upload artifact
- Scripts append execution artifacts into:
  - `test-data/current-url-worker1.txt` — worker 1 SRN and URL traces
  - `test-data/current-url-worker2.txt` — worker 2 SRN and URL traces
  - `test-data/current-url.txt` — legacy/single-worker SRN traces
  - `test-data/srn-permanent-log.txt` — persistent log across all runs (shared by penalty/pump specs)
- Because tests depend on live systems and credentials, failures often come from session expiry, backend timing variance, or environment/account state rather than code logic alone.

## Project-specific notes for edits

- If adding a new long-running automation spec, wire it in both places:
  1. `ecosystem.config.cjs` (new PM2 app entry with `autorestart: true`, `restart_delay: 10000`, `time: true`)
  2. `package.json` scripts (`:one`, `:forever`, `:logs`, `:stop`)
- Keep selectors and waits resilient for long loops; this codebase is sensitive to UI timing and session continuity across iterations.
- Penalty patterns in specs use alternating date logic: `PENALTY_DATE` (old date like "01/01/2026") triggers penalties, `getCurrentDate()` for normal processing.
- Worker2 specs use `test.use({ channel: "msedge", headless: true })` for parallel execution isolation.
- SRN values are logged to both per-worker files and `srn-permanent-log.txt` for cross-run persistence.
- No `.cursor/rules`, `.cursorrules`, or `.github/copilot-instructions.md` were found in this repository at time of writing.