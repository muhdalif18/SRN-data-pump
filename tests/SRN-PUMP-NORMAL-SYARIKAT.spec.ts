import { test } from "@playwright/test";
import * as fs from "fs";

// Format today's date as dd/MM/yyyy
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

  // Load SSM companies data
  const companiesData = JSON.parse(
    fs.readFileSync("./test-data/ssm-companies.json", "utf-8"),
  );
  const companies = companiesData.companies;

  //EDS SIDE
  await page.goto("https://mytax-dev.hasil.gov.my/web/");
  await page.waitForTimeout(3000);
  await page.reload({ waitUntil: "load" });
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
    .fill("900220035533");
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
    "Stamping Submission URLs\n========================\n\n",
  );

  // Write a run separator to the permanent log
  const runTimestamp = new Date().toISOString();
  fs.appendFileSync(
    "./test-data/srn-permanent-log.txt",
    `\n=== Run started: ${runTimestamp} ===\n`,
  );

  // Progress tracking file
  const progressFile = "./test-data/srn-pump-normal-syarikat-progress.txt";

  // Read last completed iteration, default to 0 if file doesn't exist
  let startIteration = 1;
  if (fs.existsSync(progressFile)) {
    const lastCompleted = parseInt(
      fs.readFileSync(progressFile, "utf-8").trim(),
      10,
    );
    startIteration = lastCompleted + 1;
    console.log(
      `Resuming from iteration ${startIteration} (last completed: ${lastCompleted})`,
    );
  } else {
    console.log("Starting fresh from iteration 1");
  }

  // If we've completed all 100, reset to 1
  if (startIteration > 100) {
    startIteration = 1;
    console.log("All iterations completed, starting new cycle from 1");
  }

  // Loop for normal submissions only (no penalty, no duti dikecualikan)
  for (let i = startIteration; i <= 100; i++) {
    const dateToUse = getCurrentDate();
    // Use modulo to cycle through companies array (0-33 repeats for 100 iterations)
    const companyIndex = (i - 1) % companies.length;
    const currentCompany = companies[companyIndex];
    console.log(
      `--- Loop iteration ${i} of 100 --- [NORMAL] date=${dateToUse} --- Company: ${currentCompany.name}`,
    );

    await page.goto("https://eds-uat.hasil.gov.my/stamping/upload");
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
    await page.locator("#DocTitleStep0").fill(`Bank Testing ${i}`);
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
    ////
    await page
      .getByLabel("A. PIHAK PERTAMA")
      .getByText("Syarikat / Perniagaan Milikan")
      .click();
    await page
      .locator('input[name="StampingForm.FormACompanyList[0].CompanyName"]')
      .click();
    await page
      .locator('input[name="StampingForm.FormACompanyList[0].CompanyName"]')
      .fill(currentCompany.name);
    await page.locator("#KategoriPembayarDuti").selectOption("4");
    await page
      .locator(
        'input[name="StampingForm.FormACompanyList[0].NewCompanyRegistrationNo"]',
      )
      .click();
    await page
      .locator(
        'input[name="StampingForm.FormACompanyList[0].NewCompanyRegistrationNo"]',
      )
      .fill(currentCompany.registrationNo);
    await page
      .locator('input[name="StampingForm.FormACompanyList[0].TelNo"]')
      .click();
    await page
      .locator('input[name="StampingForm.FormACompanyList[0].TelNo"]')
      .fill("0199188888");
    await page.locator("#fld-email-com-0Step1").click();
    await page.locator("#fld-email-com-0Step1").fill("test@gmail.com");
    await page
      .locator(
        'input[name="StampingForm.FormACompanyList[0].CompStatus"][value="1"]',
      )
      .check();
    await page
      .locator('input[name="StampingForm.FormACompanyList[0].ADDR1"]')
      .click();
    await page.locator("#fld-email-com-0Step1").fill("test@gmail.com");

    const randomAddr = addresses[Math.floor(Math.random() * addresses.length)];

    await page
      .locator('input[name="StampingForm.FormACompanyList[0].ADDR1"]')
      .fill(randomAddr.Addr1);
    await page
      .locator('input[name="StampingForm.FormACompanyList[0].ADDR2"]')
      .click();
    await page
      .locator('input[name="StampingForm.FormACompanyList[0].ADDR1"]')
      .fill(randomAddr.Addr1);
    await page
      .locator('input[name="StampingForm.FormACompanyList[0].ADDR2"]')
      .fill(randomAddr.Addr2);
    await page
      .locator('input[name="StampingForm.FormACompanyList[0].ADDR3"]')
      .click();
    await page
      .locator('input[name="StampingForm.FormACompanyList[0].ADDR3"]')
      .fill(randomAddr.Addr3);
    await page
      .locator('input[name="StampingForm.FormACompanyList[0].Postcode"]')
      .click();
    await page
      .locator('input[name="StampingForm.FormACompanyList[0].Postcode"]')
      .fill("60000");

    ////
    await page.waitForTimeout(4000);
    await page.getByRole("button", { name: "Seterusnya " }).click();

    await page.waitForTimeout(4000);
    await page
      .getByRole("checkbox", { name: "Saya / Syarikat sebagai" })
      .waitFor({ state: "visible", timeout: 20000 });
    await page
      .getByRole("checkbox", { name: "Saya / Syarikat sebagai" })
      .check();
    await page.waitForTimeout(3000);
    await page.getByRole("button", { name: "Seterusnya " }).click();

    await page
      .getByRole("radio", { name: "Ada", exact: true })
      .waitFor({ state: "visible", timeout: 10000 });

    await page.getByRole("radio", { name: "Ada", exact: true }).check();
    await page.getByRole("radio", { name: "Tiada" }).check();
    await page.getByRole("radio", { name: "Saham Biasa" }).check();
    await page.locator("#StampingForm_formC_2_ShrTot").click();
    await page.locator("#StampingForm_formC_2_ShrTot").fill("30000000");
    await page.locator("#StampingForm_formC_2_ShrTot").press("Tab");
    await page.locator("#StampingForm_formC_2_ShrTrf").fill("30000000");
    await page.getByRole("radio", { name: "Ringgit Malaysia" }).check();
    await page.getByRole("textbox", { name: "0.00" }).click();

    // Random amount for normal submissions
    const randomAmount =
      Math.floor(Math.random() * (900000000 - 100000000 + 1)) + 100000000;

    await page
      .getByRole("textbox", { name: "0.00" })
      .fill(randomAmount.toLocaleString("en-US"));
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

    // Pick a random company from SSM data
    const randomCompany =
      companies[Math.floor(Math.random() * companies.length)];

    await page
      .locator("#StampingForm_formC_2_CompName")
      .fill(randomCompany.name);
    await page.locator("#StampingForm_formC_2_CompRegOld").click();
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

    await page.getByRole("button", { name: "Seterusnya " }).click();

    // Wait for upload section to be visible
    await page
      .locator(
        'button.upload-btn[data-bs-model="StampingForm.SupportingDocFiles"]',
      )
      .waitFor({ state: "visible", timeout: 20000 });

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

    // Wait for declaration section to be visible
    await page
      .locator("label")
      .filter({ hasText: "Saya seperti nama dan Nombor" })
      .waitFor({ state: "visible", timeout: 20000 });

    await page
      .locator("label")
      .filter({ hasText: "Saya seperti nama dan Nombor" })
      .click();
    await page
      .getByRole("radio", { name: "Wakil Pihak Pertama", exact: true })
      .check();
    await page.getByRole("button", { name: "Hantar " }).click();
    await page.getByRole("button", { name: "Batal" }).click();
    await page.getByRole("button", { name: "Hantar " }).click();
    await page.getByRole("button", { name: "Ya, Hantar" }).click();

    await page
      .getByRole("button", { name: "Kembali ke Paparan Utama" })
      .waitFor({ state: "visible", timeout: 20000 });

    // Wait for the PDF download button and extract SRN from downloaded filename
    await page.waitForTimeout(2000);
    await page
      .getByText("Cetak Slip Pengesahan")
      .waitFor({ state: "visible", timeout: 20000 });

    // Set up download handler before clicking
    const downloadPromise = page.waitForEvent("download");
    await page.getByText("Cetak Slip Pengesahan").click();
    const download = await downloadPromise;

    // Extract SRN from filename: Slip_Pengesahan_9992619817932717.pdf
    const filename = download.suggestedFilename();
    const srnMatch = filename.match(/Slip_Pengesahan_(\d+)\.pdf/);
    const srnValue = srnMatch ? srnMatch[1] : "";
    console.log(`SRN extracted from PDF: ${srnValue}`);

    // Save the PDF to test-data folder with original filename
    await download.saveAs(`./test-data/${filename}`);

    // Log the SRN
    fs.appendFileSync(
      "./test-data/current-url-worker1.txt",
      `SRN: ${srnValue}\n`,
    );
    fs.appendFileSync(
      "./test-data/srn-permanent-log.txt",
      `[${new Date().toISOString()}] Loop ${i} | SRN: ${srnValue} | NORMAL\n`,
    );

    await page.goto("https://eds-uat.hasil.gov.my/Home/Index");
    await page.getByRole("heading", { name: "Senarai Permohonan" }).click();

    // Save progress after successful completion
    fs.writeFileSync(progressFile, i.toString());
    console.log(`Progress saved: iteration ${i} completed`);
  }
});
