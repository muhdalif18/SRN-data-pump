import { test, chromium, firefox, webkit } from "@playwright/test";
import * as fs from "fs";

// Override to use Firefox browser
test.use({
  browserName: "firefox",
  headless: true,
});

const namaList = ["Form of Transfer of Securites"];

// Flow pattern: repeats every 4 iterations
// 1=Duti Dikecualikan, 2=No penalty, 3=Penalty, 4=No penalty
type FlowType = "NO_PENALTY" | "PENALTY" | "DUTI_DIKECUALIKAN";
const FLOW_PATTERN: FlowType[] = [
  "DUTI_DIKECUALIKAN",
  "NO_PENALTY",
  "PENALTY",
  "NO_PENALTY",
];

// Penalty scenarios alternate between two dates each time "PENALTY" fires:
// 1 January -> Penalti 20%, 1 May -> Penalti 10%
const PENALTY_DATE_JAN = "01/01/2026";
const PENALTY_DATE_MAY = "01/05/2026";

// Format today's date as dd/MM/yyyy for "tarikh biasa"
function getCurrentDate(): string {
  const d = new Date();
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = d.getFullYear();
  return `${dd}/${mm}/${yyyy}`;
}

test("test", async ({ page }) => {
  test.setTimeout(4 * 60 * 60 * 1000); // 4 hours

  // Clear browser cache and cookies before starting
  const client = await page.context().newCDPSession(page);
  await client.send("Network.clearBrowserCache");
  await client.send("Network.clearBrowserCookies");

  // Load addresses data
  const addressesData = JSON.parse(
    fs.readFileSync("./test-data/addresses_my.json", "utf-8"),
  );
  const addresses = addressesData.INDIVIDU;

  //EDS SIDE
  await page.goto("https://mytax-dev.hasil.gov.my/web/");
  await page.waitForTimeout(3000);
  await page.reload();
  await page.waitForTimeout(6000);
  await page
    .getByRole("combobox")
    .waitFor({ state: "visible", timeout: 20000 });
  await page.waitForTimeout(3000);

  await page.getByRole("combobox").selectOption("1");
  await page
    .getByRole("textbox", { name: "No. Pengenalan" })
    .waitFor({ state: "visible", timeout: 20000 });
  await page.getByRole("textbox", { name: "No. Pengenalan" }).click();
  await page.waitForTimeout(3000);
  await page
    .getByRole("textbox", { name: "No. Pengenalan" })
    .waitFor({ state: "visible", timeout: 20000 });
  await page
    .getByRole("textbox", { name: "No. Pengenalan" })
    .fill("721101086035");
  await page.waitForTimeout(2000);
  await page
    .getByRole("button", { name: "Hantar" })
    .waitFor({ state: "visible", timeout: 20000 });
  await page.getByRole("button", { name: "Hantar" }).click();
  await page
    .getByRole("textbox", { name: "Sila Masukkan Kata Laluan" })
    .waitFor({ state: "visible", timeout: 20000 });
  await page
    .getByRole("textbox", { name: "Sila Masukkan Kata Laluan" })
    .click();
  await page
    .getByRole("textbox", { name: "Sila Masukkan Kata Laluan" })
    .fill("Passw0rd");
  await page
    .getByText("Percubaan Log Masuk Anda : 0 /")
    .waitFor({ state: "visible", timeout: 20000 });
  await page.getByText("Percubaan Log Masuk Anda : 0 /").click();
  await page
    .getByText("Anda Ada 5 Percubaan Lagi")
    .waitFor({ state: "visible", timeout: 20000 });
  await page.getByText("Anda Ada 5 Percubaan Lagi").click();
  await page.getByText("Anda Ada 5 Percubaan Lagi").click();
  await page
    .getByRole("textbox", { name: "Sila Masukkan Kata Laluan" })
    .waitFor({ state: "visible", timeout: 20000 });
  await page
    .getByRole("textbox", { name: "Sila Masukkan Kata Laluan" })
    .click();
  await page.getByRole("button", { name: "Log Masuk" }).click();

  await page
    .getByText("Mulai 1 Januari 2023, format")
    .waitFor({ state: "visible", timeout: 20000 });
  await page.getByText("Mulai 1 Januari 2023, format").click();
  await page.getByRole("button", { name: "Ok" }).click();
  await page.waitForTimeout(5000);

  await page
    .getByText("Perkhidmatan ezHasil")
    .waitFor({ state: "visible", timeout: 20000 });
  await page.getByText("Perkhidmatan ezHasil").click();
  await page

    .getByText("Duti Setem 2.0 (UAT) e-Duti")
    .waitFor({ state: "visible", timeout: 20000 });

  await page.getByText("Duti Setem 2.0 (UAT) e-Duti").click();

  // Wait for new tab to open when clicking e-Duti Setem
  const [newPage] = await Promise.all([
    page.context().waitForEvent("page"),
    page.getByRole("link", { name: "e-Duti Setem" }).click(),
  ]);

  // Switch to the new tab
  await newPage.waitForLoadState();
  page = newPage;

  await page.waitForTimeout(7000);

  // Clear the URL log file before starting
  fs.writeFileSync(
    "./test-data/current-url-worker1.txt",
    "Stamping Submission URLs\n========================\n\n",
  );

  // Write a run separator to the permanent log
  const runTimestamp = new Date().toISOString();
  fs.appendFileSync(
    "./test-data/srn-permanent-log.txt",
    `\n=== Run started: ${runTimestamp} ===\n`,
  );

  // Loop 40 times starting from the stamping upload
  // If a penalty amount is needed, pick one fixed amount per run and reuse it for all penalty SRNs
  // Allow overriding the fixed penalty amount via the PENALTY_AMOUNT environment variable.
  const configuredPenaltyEnv = process.env.PENALTY_AMOUNT;
  let fixedPenaltyAmount: number | null = null;
  if (configuredPenaltyEnv) {
    const parsed = Number(
      String(configuredPenaltyEnv).replace(/[^0-9.-]/g, ""),
    );
    if (!Number.isNaN(parsed) && parsed > 0) {
      fixedPenaltyAmount = parsed;
      console.log(
        `Using configured penalty amount from env: ${fixedPenaltyAmount}`,
      );
      fs.appendFileSync(
        "./test-data/srn-permanent-log.txt",
        `[${new Date().toISOString()}] Configured fixed penalty amount: ${fixedPenaltyAmount}\n`,
      );
    } else {
      console.log(
        `Invalid PENALTY_AMOUNT env value: ${configuredPenaltyEnv}, ignoring.`,
      );
    }
  }
  // If no configured value provided, use the project default fixed penalty amount
  if (fixedPenaltyAmount === null) {
    fixedPenaltyAmount = 427183954;
    console.log(`Default fixed penalty amount set: ${fixedPenaltyAmount}`);
    fs.appendFileSync(
      "./test-data/srn-permanent-log.txt",
      `[${new Date().toISOString()}] Default fixed penalty amount set: ${fixedPenaltyAmount}\n`,
    );
  }

  // Progress tracking: Read last completed iteration
  const progressFile = "./test-data/srn-pump-missing-phone-progress.txt";
  let startIteration = 1;

  if (fs.existsSync(progressFile)) {
    try {
      const lastCompleted = parseInt(fs.readFileSync(progressFile, "utf-8").trim(), 10);
      if (!isNaN(lastCompleted) && lastCompleted > 0) {
        startIteration = lastCompleted + 1;
        console.log(`Resuming from iteration ${startIteration} (last completed: ${lastCompleted})`);
        fs.appendFileSync(
          "./test-data/srn-permanent-log.txt",
          `[${new Date().toISOString()}] Resuming from iteration ${startIteration}\n`,
        );
      }
    } catch (err) {
      console.log("Could not read progress file, starting from iteration 1");
    }
  }

  // Calculate penalty occurrence count for resumed runs
  let penaltyOccurrenceCount = 0;
  for (let j = 1; j < startIteration; j++) {
    const flowType = FLOW_PATTERN[(j - 1) % FLOW_PATTERN.length];
    if (flowType === "PENALTY") {
      penaltyOccurrenceCount++;
    }
  }

  for (let i = startIteration; i <= 400; i++) {
    const flowType = FLOW_PATTERN[(i - 1) % FLOW_PATTERN.length];
    const isPenalty = flowType === "PENALTY";
    const isDutiDikecualikan = flowType === "DUTI_DIKECUALIKAN";
    let isPenaltyJan = false;
    if (isPenalty) {
      isPenaltyJan = penaltyOccurrenceCount % 2 === 0;
      penaltyOccurrenceCount++;
    }
    const dateToUse = isPenalty
      ? isPenaltyJan
        ? PENALTY_DATE_JAN
        : PENALTY_DATE_MAY
      : getCurrentDate();
    const docTitlePrefix = isPenalty
      ? isPenaltyJan
        ? "Penalti 20% "
        : "Penalti 10% "
      : isDutiDikecualikan
        ? "Duti Dikecualikan "
        : "";
    const flowLabel = isPenalty
      ? isPenaltyJan
        ? "PENALTI 20% (JAN)"
        : "PENALTI 10% (MAY)"
      : isDutiDikecualikan
        ? "DUTI DIKECUALIKAN"
        : "NO PENALTY";
    console.log(
      `--- Loop iteration ${i} of XX --- [${flowLabel}] date=${dateToUse}`,
    );

    await page.goto("https://eds-uat.hasil.gov.my/stamping/upload");
    //await page.locator('a[href="/stamping/upload"]').click();
    await page.waitForTimeout(5000);
    await page
      .getByRole("button", { name: "Faham" })
      .waitFor({ state: "visible", timeout: 20000 });
    await page.getByRole("button", { name: "Faham" }).click();
    await page
      .locator("#fileInput_single")
      .setInputFiles("./test-data/image (19).png");

    await page
      .getByRole("button", { name: "Hantar" })
      .waitFor({ state: "visible", timeout: 20000 });
    await page.getByRole("button", { name: "Hantar" }).click();
    await page.getByRole("button", { name: "Teruskan tanpa AI" }).click();
    await page
      .getByRole("option", { name: "DS 2: Pindah Milik Saham" })
      .waitFor({ state: "visible", timeout: 20000 });
    await page
      .getByRole("option", { name: "DS 2: Pindah Milik Saham" })
      .click();
    await page.waitForTimeout(5000);
    await page
      .getByText("Tempat Surat Cara Ditandatangan*")
      .waitFor({ state: "visible", timeout: 20000 });
    await page.getByText("Tempat Surat Cara Ditandatangan*").click();
    await page.locator("#DocTitleStep0").click();
    await page
      .locator("#DocTitleStep0")
      .fill(
        `${docTitlePrefix}DEMO FOR OBJECTION AND APPEAL. STRICLY DONT USE. ${i}`,
      );
    await page
      .getByRole("textbox", { name: "dd/MM/yyyy" })
      .first()
      .waitFor({ state: "visible", timeout: 20000 });
    await page.getByRole("textbox", { name: "dd/MM/yyyy" }).first().click();
    await page
      .getByRole("textbox", { name: "dd/MM/yyyy" })
      .first()
      .fill(dateToUse);
    await page
      .getByRole("textbox", { name: "dd/MM/yyyy" })
      .first()
      .press("Enter");
    await page.getByText("Tempat Surat Cara Ditandatangan*").click();

    await page.getByRole("radio", { name: "Luar Malaysia" }).check();
    await page.getByRole("radio", { name: "Malaysia", exact: true }).check();
    await page.waitForTimeout(6000);
    await page
      .locator("button.nextBtn:has(span:text-is('Seterusnya'))")
      .first()
      .click({ force: true });
    await page.waitForTimeout(3000);

    await page
      .getByRole("checkbox", { name: "Saya / Syarikat sebagai" })
      .waitFor({ state: "visible", timeout: 20000 });
    await page
      .getByRole("checkbox", { name: "Saya / Syarikat sebagai" })
      .check();
    /*  await page
      .getByLabel("A. PIHAK PERTAMA")
      .locator("div")
      .filter({ hasText: /^Bandar$/ })
      .click();
    await page
      .getByLabel("A. PIHAK PERTAMA")
      .locator("div")
      .filter({ hasText: /^Negeri$/ })
      .click(); */

    await page
      .locator('input[name="StampingForm.FormAIndividualList[0].TelNo"]')
      .click();
    await page
      .locator('input[name="StampingForm.FormAIndividualList[0].TelNo"]')
      .press("ControlOrMeta+a");
    await page
      .locator('input[name="StampingForm.FormAIndividualList[0].TelNo"]')
      .fill("0199999999");
    await page.locator("#fld-email-ind-0Step1").click();
    await page.locator("#fld-email-ind-0Step1").press("ControlOrMeta+a");
    await page.locator("#fld-email-ind-0Step1").fill("test@gmail.com");
    await page.waitForTimeout(3000);
    await page.getByRole("button", { name: "Seterusnya " }).click();

    await page
      .locator('input[name="StampingForm.FormBIndividualList[0].Name"]')
      .waitFor({ state: "visible", timeout: 20000 });

    await page
      .locator('input[name="StampingForm.FormBIndividualList[0].Name"]')
      .click();
    await page
      .locator('input[name="StampingForm.FormBIndividualList[0].Name"]')
      .fill("Shamsul Yusuf Haslam");
    await page.locator("#IsCitizen_0").selectOption("1");
    await page.locator("#isRoles1_0").check();
    await page
      .locator('input[name="StampingForm.FormBIndividualList[0].IcNo"]')
      .click();
    await page
      .locator('input[name="StampingForm.FormBIndividualList[0].IcNo"]')
      .fill("590511025908");
    await page
      .locator('input[name="StampingForm.FormBIndividualList[0].IcNo"]')
      .press("Tab");
    await page
      .getByText("Nombor Pengenalan Cukai (TIN)* Nombor TIN berjaya diisi.")
      .click();
    await page
      .locator('input[name="StampingForm.FormBIndividualList[0].TelNo"]')
      .click();
    await page
      .locator('input[name="StampingForm.FormBIndividualList[0].TelNo"]')
      .fill("0199184911");
    await page
      .locator('input[name="StampingForm.FormBIndividualList[0].TelNo"]')
      .press("Tab");
    await page.locator("#fld-email-ind-0-Step2").click();
    await page.locator("#fld-email-ind-0-Step2").fill("aaa@gmail.com");

    // Pick a random address from addresses_my.json
    const randomAddr = addresses[Math.floor(Math.random() * addresses.length)];

    await page
      .locator('input[name="StampingForm.FormBIndividualList[0].Addr1"]')
      .click();
    await page
      .locator('input[name="StampingForm.FormBIndividualList[0].Addr1"]')
      .fill(randomAddr.Addr1);
    await page
      .locator('input[name="StampingForm.FormBIndividualList[0].Addr2"]')
      .click();
    await page
      .locator('input[name="StampingForm.FormBIndividualList[0].Addr2"]')
      .fill(randomAddr.Addr2);
    await page
      .locator('input[name="StampingForm.FormBIndividualList[0].Addr3"]')
      .click();
    await page
      .locator('input[name="StampingForm.FormBIndividualList[0].Addr3"]')
      .fill(randomAddr.Addr3);
    await page
      .locator('input[name="StampingForm.FormBIndividualList[0].Postcode"]')
      .click();
    await page
      .locator('input[name="StampingForm.FormBIndividualList[0].Postcode"]')
      .fill("50000");
    await page.waitForTimeout(4000);

    await page.getByRole("button", { name: "Seterusnya " }).click();

    await page
      .getByRole("radio", { name: "Ada", exact: true })
      .waitFor({ state: "visible", timeout: 10000 });

    // Generate random numbers between 5-7 digits
    const randomDigits = Math.floor(Math.random() * 3) + 4; // Random between 5-7
    const minValue = Math.pow(4, randomDigits - 1);
    const maxValue = Math.pow(4, randomDigits) - 1;
    const randomNumber =
      Math.floor(Math.random() * (maxValue - minValue + 1)) + minValue;
    const formattedNumber = randomNumber.toLocaleString("en-US");

    await page.getByRole("radio", { name: "Ada", exact: true }).check();
    await page.getByRole("radio", { name: "Tiada" }).check();
    await page.getByRole("radio", { name: "Saham Biasa" }).check();
    await page.locator("#StampingForm_formC_2_ShrTot").click();
    await page.locator("#StampingForm_formC_2_ShrTot").fill("30000000");
    await page.locator("#StampingForm_formC_2_ShrTot").press("Tab");
    await page.locator("#StampingForm_formC_2_ShrTrf").fill("30000000");
    await page.getByRole("radio", { name: "Ringgit Malaysia" }).check();
    await page.getByRole("textbox", { name: "0.00" }).click();
    // Use a fixed amount for penalty flows (picked once per run), random otherwise
    let amountToUse: number;
    if (isPenalty) {
      if (fixedPenaltyAmount === null) {
        fixedPenaltyAmount =
          Math.floor(Math.random() * (900000000 - 100000000 + 1)) + 100000000;
        console.log(`Fixed penalty amount selected: ${fixedPenaltyAmount}`);
        fs.appendFileSync(
          "./test-data/srn-permanent-log.txt",
          `[${new Date().toISOString()}] Fixed penalty amount selected: ${fixedPenaltyAmount}\n`,
        );
      }
      amountToUse = fixedPenaltyAmount;
    } else {
      amountToUse =
        Math.floor(Math.random() * (900000000 - 100000000 + 1)) + 100000000;
    }

    await page
      .getByRole("textbox", { name: "0.00" })
      .fill(amountToUse.toLocaleString("en-US"));
    await page.locator("#statusSelect").selectOption("1");
    // Wait for status change auto-prefill to settle
    await page.waitForTimeout(1500);

    const openCal = page.locator(".flatpickr-calendar.open");

    // Open calendar and pick the first enabled day in the currently shown month
    await page.locator("#section1 input[placeholder='dd/MM/yyyy']").click();
    await page.waitForTimeout(3000);
    await openCal.waitFor({ state: "visible", timeout: 20000 });
    await openCal
      .locator(
        ".flatpickr-day:not(.flatpickr-disabled):not(.prevMonthDay):not(.nextMonthDay)",
      )
      .first()
      .click();

    await page.locator("#transactionReason").selectOption("1");

    await page.getByRole("button", { name: "Seterusnya " }).click();
    await page
      .getByText("Maklumat Syarikat *")
      .waitFor({ state: "visible", timeout: 20000 });
    await page.getByText("Maklumat Syarikat *").click();
    await page.locator("#StampingForm_formC_2_CompName").click();
    await page
      .locator("#StampingForm_formC_2_CompName")
      .fill("SYARIKAT ABAH SAYA");
    await page.locator("#StampingForm_formC_2_CompRegOld").click();
    await page
      .locator("#StampingForm_formC_2_CompName")
      .fill("SYARIKAT ABAH SAYA1");
    await page.locator("#StampingForm_formC_2_CompRegOld").fill("2331");
    await page.getByText("Nombor Pendaftaran Syarikat *").click();
    await page.locator("#StampingForm_formC_2_CompRegOld").click();
    await page.locator("#StampingForm_formC_2_CompRegOld").fill("23311");
    await page.locator("#StampingForm_formC_2_CompRegNew").click();
    await page.locator("#StampingForm_formC_2_CompRegNew").fill("11231231");
    await page.getByText("Aktiviti Utama Syarikat *").click();
    await page.locator("#compAct").selectOption("13");
    await page.locator("#StampingForm_formC_2_CompAddr1").click();
    await page.locator("#StampingForm_formC_2_CompAddr1").fill("SYAAA11");
    await page.locator("#StampingForm_formC_2_CompAddr2").click();
    await page.locator("#StampingForm_formC_2_CompAddr2").fill("sss");
    await page.locator("#StampingForm_formC_2_CompPostcode").click();
    await page.locator("#StampingForm_formC_2_CompPostcode").fill("60000");
    await page.waitForTimeout(5000);

    await page.getByRole("button", { name: "Seterusnya " }).click();

    await page
      .locator("h5.mb-3.fw-bold", { hasText: "Peremitan / Pengecualian" })
      .waitFor({ state: "visible", timeout: 10000 });

    /*  await page.getByRole("radio", { name: "Ada", exact: true }).check();
    await page.getByRole("radio", { name: "Tiada" }).check(); */
    await page.getByRole("button", { name: "Seterusnya " }).click();

    // Upload document - intercept file chooser to handle native dialog
    await page
      .locator(
        'button.upload-btn[data-bs-model="StampingForm.SupportingDocFiles"]',
      )
      .click();
    await page.waitForTimeout(2000);

    // Wait for modal to be visible
    await page
      .locator("#uploadModal")
      .waitFor({ state: "visible", timeout: 20000 });

    // Set up file chooser handler BEFORE clicking Tambah Fail
    const fileChooserPromise = page.waitForEvent("filechooser");

    // Click Tambah Fail - this will trigger the file chooser
    await page.locator("button#btnAddFile").click();

    // Handle the file chooser
    const fileChooser = await fileChooserPromise;
    await fileChooser.setFiles("./test-data/image (19).png");
    await page.waitForTimeout(2000);

    // Click Simpan Fail button
    await page.locator("button#btnSaveUpload").click();
    await page.waitForTimeout(2000);

    await page.getByRole("button", { name: "Seterusnya " }).click();

    await page
      .locator("label")
      .filter({ hasText: "Saya seperti nama dan Nombor" })
      .click();
    await page
      .getByRole("radio", { name: "Pihak Pertama", exact: true })
      .check();
    await page.getByRole("button", { name: "Hantar " }).click();
    await page.getByRole("button", { name: "Batal" }).click();
    await page.getByRole("button", { name: "Hantar " }).click();
    await page.getByRole("button", { name: "Ya, Hantar" }).click();
    // await page.getByRole("button", { name: "OK" }).click();

    await page
      .getByRole("button", { name: "Kembali ke Paparan Utama" })
      .waitFor({ state: "visible", timeout: 20000 });

    await page.goto("https://eds-uat.hasil.gov.my/Home/Index");
    await page.getByRole("heading", { name: "Senarai Permohonan" }).click();

    // Extract and log the SRN
    await page.waitForTimeout(2000);
    const srnElement = await page
      .locator("p.modern-clickable-stamp[data-search]")
      .first();
    const srn = await srnElement.textContent();
    const srnValue = srn?.trim() || "";
    console.log(`SRN: ${srnValue}`);
    fs.appendFileSync(
      "./test-data/current-url-worker1.txt",
      `SRN: ${srnValue}\n`,
    );
    fs.appendFileSync(
      "./test-data/srn-permanent-log.txt",
      `[${new Date().toISOString()}] Loop ${i} | SRN: ${srnValue} | ${flowLabel}\n`,
    );

    await page.getByRole("cell", { name: "LHDNM Proses" }).first().click();

    //HITS SIDE
    await page.goto("https://hitspre2.hasil.gov.my/Dashboard/Login");

    await page.waitForTimeout(5000);

    await page.locator(".login-screen").click();
    await page.locator("#Input_UsernameVal").click();
    await page
      .locator("#Input_UsernameVal")
      .fill("userstds_pahang_pr@hasil.gov.my");
    await page.locator("#Input_UsernameVal").click();
    await page.locator("#Input_PasswordVal").click();
    await page.locator("#Input_PasswordVal").fill("900101019039");
    await page.getByRole("button", { name: "Login" }).click();
    await page.waitForTimeout(2000);
    /*  await page.getByRole("link", { name: "Duti Setem " }).click();
    await page.getByRole("link", { name: "Taksiran Duti Setem" }).click(); */
    await page.goto("https://hitspre2.hasil.gov.my/HITS_DT/Dashboard_Taksiran");

    await page.waitForTimeout(2000);
    /* await page
      .getByRole("link", { name: "Carian" })
      .waitFor({ state: "visible", timeout: 20000 });
    await page.getByRole("link", { name: "Carian" }).first().click(); */
    await page.goto(
      "https://hitspre2.hasil.gov.my/HITS_DT/carian_dashboard?SRN2=0",
    );
    await page.waitForTimeout(2000);
    await page
      .getByRole("radio", { name: "No TIN" })
      .waitFor({ state: "visible", timeout: 20000 });
    await page.getByRole("radio", { name: "No TIN" }).check();
    await page.getByRole("radio", { name: "No. Rujukan Setem" }).check();
    await page.getByPlaceholder(" ").click();
    await page.getByPlaceholder(" ").click();
    await page.getByPlaceholder(" ").fill(srnValue);
    await page.getByRole("button", { name: " Cari" }).click();

    // Capture Nama Pemegang SRN
    await page.waitForTimeout(2000);
    const namaPemegangElement = await page.locator(
      'div.columns-item:has-text("Nama Pemegang SRN") + div.columns-item span[data-expression][style*="font-weight: bold"]',
    );
    await namaPemegangElement.waitFor({ state: "visible", timeout: 20000 });
    const namaPemegang = await namaPemegangElement.textContent();
    const namaPemegangValue = namaPemegang?.trim() || "";
    console.log(`Nama Pemegang SRN: ${namaPemegangValue}`);
    fs.appendFileSync(
      "./test-data/current-url-worker1.txt",
      `Nama Pemegang SRN: ${namaPemegangValue}\n`,
    );
    fs.appendFileSync(
      "./test-data/srn-permanent-log.txt",
      `[${new Date().toISOString()}] Loop ${i} | Nama: ${namaPemegangValue}\n`,
    );

    // Read JSON file to find user credentials
    const usersData = JSON.parse(
      fs.readFileSync("./test-data/users_pre2.json", "utf-8"),
    );

    // Find the user by name
    const user: any = usersData.find(
      (row: any) => row.nama?.toUpperCase() === namaPemegangValue.toUpperCase(),
    );

    if (!user) {
      throw new Error(`User credentials not found for: ${namaPemegangValue}`);
    }

    console.log(`Found user credentials - Username: ${user.loginId}`);

    // Logout from HITS
    await page.locator(".submenu-icon").click();
    await page.getByRole("link", { name: " Log Keluar" }).click();
    await page.waitForTimeout(5000);

    // Login again with the user's credentials
    await page
      .locator("#Input_UsernameVal")
      .waitFor({ state: "visible", timeout: 20000 });
    await page.locator("#Input_UsernameVal").click();
    await page.locator("#Input_UsernameVal").fill(user.loginId);
    await page.locator("#Input_PasswordVal").click();
    await page.locator("#Input_PasswordVal").fill(user.password);
    await page.getByRole("button", { name: "Login" }).click();
    await page.waitForTimeout(3000);

    /*  await page.getByRole("link", { name: "Duti Setem " }).click();
    await page.waitForTimeout(2000);
    await page.getByRole("link", { name: "Taksiran Duti Setem" }).click(); */
    await page.goto("https://hitspre2.hasil.gov.my/HITS_DT/Dashboard_Taksiran");

    await page.waitForTimeout(5000);
    /*   await page
      .getByRole("link", { name: "Carian" })
      .waitFor({ state: "visible", timeout: 20000 });
    await page.getByRole("link", { name: "Carian" }).click();
    await page.waitForTimeout(2000); */
    await page.goto(
      "https://hitspre2.hasil.gov.my/HITS_DT/carian_dashboard?SRN2=0",
    );
    await page.waitForTimeout(2000);
    await page.getByRole("radio", { name: "No TIN" }).check();
    await page.getByRole("radio", { name: "No. Rujukan Setem" }).check();
    await page.getByPlaceholder(" ").click();
    await page.getByPlaceholder(" ").click();
    await page.getByPlaceholder(" ").fill(srnValue);
    await page.getByRole("button", { name: " Cari" }).click();
    await page.waitForTimeout(2000);
    await page
      .getByText("Negeri")
      .waitFor({ state: "visible", timeout: 20000 });
    await page.getByText("Negeri").click();
    await page
      .getByText("No. Rujukan Setem (SRN)")
      .waitFor({ state: "visible", timeout: 20000 });
    await page.getByText("No. Rujukan Setem (SRN)").click();
    await page
      .getByLabel("Maklumat Permohonan Penyeteman")
      .getByText("Status")
      .click();
    await page
      .getByLabel("Maklumat Permohonan Penyeteman")
      .getByText("Jenis Penyeteman")
      .click();
    await page.getByText("Nama Surat Cara").click();
    await page.getByText("Nama Pemegang SRN").click();
    await page
      .getByRole("button", { name: "Senarai Taksiran" })
      .waitFor({ state: "visible", timeout: 20000 });
    await page.getByRole("button", { name: "Senarai Taksiran" }).click();
    await page.waitForTimeout(2000);
    await page.getByRole("button", { name: "Senarai Taksiran" }).click();
    await page.waitForTimeout(4000);
    await page.locator("tr.table-row").nth(1).click();
    await page.waitForTimeout(5000);
    await page
      .getByRole("button", { name: "Sedia Untuk Taksiran Duti" })
      .waitFor({ state: "visible", timeout: 20000 });
    await page
      .getByRole("button", { name: "Sedia Untuk Taksiran Duti" })
      .click();
    await page.waitForTimeout(2000);
    await page
      .getByText("Pengesahan Tindakan")
      .waitFor({ state: "visible", timeout: 20000 });
    await page.getByText("Pengesahan Tindakan").click();
    await page.waitForTimeout(3000);
    await page.getByText("Adakah Anda Ingin Teruskan").click();
    await page.waitForTimeout(3000);
    await page
      .getByRole("button", { name: "Ya" })
      .waitFor({ state: "visible", timeout: 20000 });
    await page.getByRole("button", { name: "Ya" }).click();
    await page.waitForTimeout(5000);
    if (await page.getByRole("button", { name: "Ya" }).isVisible()) {
      await page.getByRole("button", { name: "Ya" }).click();
      await page.waitForTimeout(2000);
   /*  }
    await page
      .getByText("Tindakan - Taksiran Duti")
      .nth(1)
      .waitFor({ state: "visible", timeout: 20000 });
    await page.getByText("Tindakan - Taksiran Duti").nth(1).click();
    await page.waitForTimeout(3000); */

    if (isDutiDikecualikan) {
      //Duti Dikecualikan
      await page
        .getByText("Jenis Duti", { exact: true })
        .waitFor({ state: "visible", timeout: 20000 });
      await page.getByText("Jenis Duti", { exact: true }).click();
      await page.getByRole("combobox").selectOption("3");
      await page
        .getByText("Perubahan ini akan")
        .waitFor({ state: "visible", timeout: 20000 });
      await page.getByText("Perubahan ini akan").click();
      await page.getByRole("button", { name: "Ya" }).click();
      await page.getByText("Jenis Peremitan / Pengecualian").click();
      await page.getByRole("combobox").nth(1).selectOption("1");
      await page
        .getByText("Jumlah Perlu Dibayar :")
        .waitFor({ state: "visible", timeout: 20000 });
      await page.getByText("Jumlah Perlu Dibayar :").click();
    }

    //
    await page
      .getByRole("button", { name: "Prebiu Notis" })
      .waitFor({ state: "visible", timeout: 20000 });
    await page.getByRole("button", { name: "Prebiu Notis" }).click();
    await page.waitForTimeout(5000);

    await page
      .locator("i.fa-times")
      .waitFor({ state: "visible", timeout: 20000 });
    await page.locator("i.fa-times").click();
    await page.waitForTimeout(2000);

    await page
      .getByRole("button", { name: "Hantar" })
      .waitFor({ state: "visible", timeout: 20000 });
    await page.getByRole("button", { name: "Hantar" }).click();
    await page.waitForTimeout(2000);
    await page
      .getByRole("button", { name: "Ya" })
      .waitFor({ state: "visible", timeout: 20000 });
    await page.getByRole("button", { name: "Ya" }).click();
    await page.waitForTimeout(5000);
    /*  await page
      .getByRole("link", { name: "Carian" })
      .waitFor({ state: "visible", timeout: 20000 });
    await page.getByRole("link", { name: "Carian" }).click(); */
    await page.goto(
      "https://hitspre2.hasil.gov.my/HITS_DT/carian_dashboard?SRN2=0",
    );
    await page.waitForTimeout(2000);
    await page
      .getByPlaceholder(" ")
      .waitFor({ state: "visible", timeout: 20000 });
    await page.getByPlaceholder(" ").click();
    await page.getByPlaceholder(" ").fill(srnValue);
    await page
      .getByRole("button", { name: " Cari" })
      .waitFor({ state: "visible", timeout: 20000 });
    await page.getByRole("button", { name: " Cari" }).click();
    await page.waitForTimeout(3000);

    // Capture Nama Pemegang SRN for endorsement
    await page.waitForTimeout(2000);
    const namaPemegangElementEndorse = await page.locator(
      'div.columns-item:has-text("Nama Pemegang SRN") + div.columns-item span[data-expression][style*="font-weight: bold"]',
    );
    const namaPemegangEndorse = await namaPemegangElementEndorse.textContent();
    const namaPemegangValueEndorse = namaPemegangEndorse?.trim() || "";
    console.log(`Nama Pemegang SRN (Endorsement): ${namaPemegangValueEndorse}`);
    fs.appendFileSync(
      "./test-data/current-url-worker1.txt",
      `Nama Pemegang SRN (Endorsement): ${namaPemegangValueEndorse}\n`,
    );
    fs.appendFileSync(
      "./test-data/srn-permanent-log.txt",
      `[${new Date().toISOString()}] Loop ${i} | Endorsement Nama: ${namaPemegangValueEndorse}\n`,
    );

    // Read JSON file to find user credentials for endorsement
    const usersDataEndorse = JSON.parse(
      fs.readFileSync("./test-data/users_pre2.json", "utf-8"),
    );

    // Find the user by name
    const userEndorse: any = usersDataEndorse.find(
      (row: any) =>
        row.nama?.toUpperCase() === namaPemegangValueEndorse.toUpperCase(),
    );

    if (!userEndorse) {
      throw new Error(
        `User credentials not found for endorsement: ${namaPemegangValueEndorse}`,
      );
    }

    console.log(
      `Found user credentials for endorsement - Username: ${userEndorse.loginId}`,
    );

    // Logout from HITS
    await page.locator(".submenu-icon").click();
    await page.getByRole("link", { name: " Log Keluar" }).click();
    await page.waitForTimeout(5000);

    // Login again with the endorsement user's credentials
    await page
      .locator("#Input_UsernameVal")
      .waitFor({ state: "visible", timeout: 20000 });
    await page.locator("#Input_UsernameVal").click();
    await page.locator("#Input_UsernameVal").fill(userEndorse.loginId);
    await page.locator("#Input_PasswordVal").click();
    await page.locator("#Input_PasswordVal").fill(userEndorse.password);
    await page.getByRole("button", { name: "Login" }).click();
    await page.waitForTimeout(4000);

    /* await page.getByRole("link", { name: "Duti Setem " }).click();
    await page.waitForTimeout(2000);
    await page.getByRole("link", { name: "Taksiran Duti Setem" }).click();
    await page.waitForTimeout(5000); */
    /*  await page
      .getByRole("link", { name: "Carian" })
      .waitFor({ state: "visible", timeout: 20000 });
    await page.getByRole("link", { name: "Carian" }).click(); */
    await page.goto(
      "https://hitspre2.hasil.gov.my/HITS_DT/carian_dashboard?SRN2=0",
    );
    await page.waitForTimeout(2000);
    await page.getByRole("radio", { name: "No TIN" }).check();
    await page.getByRole("radio", { name: "No. Rujukan Setem" }).check();
    await page.getByPlaceholder(" ").click();
    await page.getByPlaceholder(" ").fill(srnValue);
    await page.getByRole("button", { name: " Cari" }).click();
    await page.waitForTimeout(3000);

    await page.locator("tr.table-row").nth(1).click();
    await page.waitForTimeout(3000);
    await page.getByText("Tidak Indors").click();
    await page.getByText("Indors", { exact: true }).click();
    await page.getByRole("button", { name: "Hantar" }).click();
    await page
      .getByText("Pengesahan Tindakan")
      .waitFor({ state: "visible", timeout: 20000 });
    await page.getByText("Pengesahan Tindakan").click();
    await page.waitForTimeout(2000);

    await page.getByRole("button", { name: "Ya" }).click();

    await page.waitForTimeout(7000);
    // Wait for Senarai Tindakan to appear

    /* await page
      .getByRole("link", { name: "Carian" })
      .waitFor({ state: "visible", timeout: 20000 });
    await page.getByRole("link", { name: "Carian" }).click(); */
    await page.goto(
      "https://hitspre2.hasil.gov.my/HITS_DT/carian_dashboard?SRN2=0",
    );

    // Save progress after successful iteration
    fs.writeFileSync(progressFile, i.toString());
    console.log(`Progress saved: iteration ${i} completed`);
  }
});
