import { test } from "@playwright/test";
import * as fs from "fs";

// Date used for 20% penalty (January — oldest, highest penalty)
const PENALTY_DATE_20 = "01/01/2026";

// Date used for 10% penalty (May — more recent, lower penalty)
const PENALTY_DATE_10 = "01/05/2026";

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
    .fill("951004146116");
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
    .fill("Password123");
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
    "Stamping Submission URLs (PENALTY ONLY)\n========================================\n\n",
  );

  // Write a run separator to the permanent log
  const runTimestamp = new Date().toISOString();
  fs.appendFileSync(
    "./test-data/srn-permanent-log.txt",
    `\n=== Run started: ${runTimestamp} (PENALTY ONLY) ===\n`,
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

  for (let i = 1; i <= 400; i++) {
    // Alternate between 10% penalty (1 May) and 20% penalty (1 Jan)
    const isOdd = i % 2 === 1;
    const penaltyDate = isOdd ? PENALTY_DATE_10 : PENALTY_DATE_20;
    const penaltyPercent = isOdd ? "10%" : "20%";

    console.log(
      `--- Loop iteration ${i} of 400 --- [PENALTI ${penaltyPercent}] date=${penaltyDate}`,
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
      .fill(`PBB TESTING ${i}`);
    await page
      .getByRole("textbox", { name: "dd/MM/yyyy" })
      .first()
      .waitFor({ state: "visible", timeout: 20000 });
    await page.getByRole("textbox", { name: "dd/MM/yyyy" }).first().click();
    await page
      .getByRole("textbox", { name: "dd/MM/yyyy" })
      .first()
      .fill(penaltyDate);
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
    // Always use fixed penalty amount for all iterations
    let amountToUse: number;
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
    await page.getByRole("button", { name: "Hantar " }).click();
    await page.getByRole("button", { name: "Batal" }).click();
    await page.getByRole("button", { name: "Hantar " }).click();
    await page.getByRole("button", { name: "Ya, Hantar" }).click();
    // await page.getByRole("button", { name: "OK" }).click();

    await page
      .getByRole("button", { name: "Kembali ke Paparan Utama" })
      .waitFor({ state: "visible", timeout: 20000 });

    await page.goto("https://eds-uat.hasil.gov.my/Home/Index");
    await page.getByRole("heading", { name: "Senarai Permohonan" }).click();

    // Extract and log the SRN - ALL are PENALTY cases
    await page.waitForTimeout(2000);
    const srnElement = await page
      .locator("p.modern-clickable-stamp[data-search]")
      .first();
    const srn = await srnElement.textContent();
    const srnValue = srn?.trim() || "";

    console.log(`SRN (PENALTY ${penaltyPercent}): ${srnValue}`);
    fs.appendFileSync(
      "./test-data/current-url-worker1.txt",
      `SRN: ${srnValue} (${penaltyPercent})\n`,
    );
    fs.appendFileSync(
      "./test-data/srn-permanent-log.txt",
      `[${new Date().toISOString()}] Loop ${i} | SRN: ${srnValue} | PENALTI ${penaltyPercent}\n`,
    );
  }
});
