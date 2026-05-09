# DS7 Automation - Playwright Tests

## Prerequisites
- Docker Desktop installed ([Download here](https://www.docker.com/products/docker-desktop))

**Windows users:** After installing Docker Desktop, add your user to docker-users group:
1. Open PowerShell as Administrator
2. Run: `net localgroup docker-users "YOUR_USERNAME" /add`
3. Restart your computer

## Quick Start

1. Pull and run the image:
```bash
docker run -v $(pwd)/test-data:/app/test-data matalep00/ds7-automation:latest
```

That's it! The tests will run and results will be saved to `test-data/` folder.

**Check if tests passed:**
- ✅ If successful: You'll see "1 passed" in green at the end
- ❌ If failed: You'll see error messages in red with details
- Exit code 0 = success, non-zero = failure

**To save the full test report:**
```powershell
docker run -v ${PWD}/test-data:/app/test-data -v ${PWD}/playwright-report:/app/playwright-report matalep00/ds7-automation:latest
```
Then open `playwright-report/index.html` in a browser to see detailed results with screenshots.

## For Windows PowerShell:
```powershell
docker run -v ${PWD}/test-data:/app/test-data matalep00/ds7-automation:latest
```

## View Results
After running, check `test-data/current-url.txt` for submission URLs and SRNs.

---

## For Maintainers: How to Push to Docker Hub

1. Build the image:
```bash
docker build -t matalep00/ds7-automation:latest .
```

2. Login to Docker Hub:
```bash
docker login
```

3. Push the image:
```bash
docker push matalep00/ds7-automation:latest
```

## Running Specific Tests

Run login.spec.ts:
```bash
docker-compose run playwright npx playwright test login.spec.ts
```

Run login2.spec.ts (HITS login):
```bash
docker-compose run playwright npx playwright test login2.spec.ts
```

## View Test Results

After running tests, check:
- `test-data/current-url.txt` - Contains submission URLs and SRNs
- `playwright-report/` - HTML test report

## Troubleshooting

If you get permission errors on Linux/Mac:
```bash
sudo chown -R $USER:$USER test-data playwright-report
```

## Without Docker (Alternative)

If you prefer not to use Docker:
```bash
npm install
npx playwright install --with-deps
npx playwright test login.spec.ts
```
