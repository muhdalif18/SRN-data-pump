import { test } from "@playwright/test";
import * as fs from "fs";

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

  // ========================================
  // CONFIGURE YOUR SRN NUMBERS HERE
  // ========================================
  const SRN_LIST = [
    "9992651164365315",
    "9992687262053362",
    "9992623563769456",
    "9992611444022865",
    "9992692741743851",
    "9992610215103769",
    "9992648464041059",
    "9992661497000951",
    "9992680901260439",
  ];

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
    "Stamping Submission URLs\n========================\n\n",
  );

  // Write a run separator to the permanent log
  const runTimestamp = new Date().toISOString();
  fs.appendFileSync(
    "./test-data/srn-permanent-log.txt",
    `\n=== Run started: ${runTimestamp} ===\n`,
  );

  // Loop through each SRN
  for (const currentSRN of SRN_LIST) {
    console.log(`Processing SRN: ${currentSRN}`);

    // Log the current SRN being processed
    fs.appendFileSync(
      "./test-data/srn-permanent-log.txt",
      `Processing SRN: ${currentSRN}\n`,
    );

    for (let i = 1; i <= 1; i++) {
      console.log(`SRN: ${currentSRN} - Iteration: ${i}/1`);

      await page.goto("https://eds-uat.hasil.gov.my/ObjectionAppeal");
      await page
        .getByRole("heading", { name: "Bantahan dan Rayuan" })
        .waitFor({ state: "visible", timeout: 20000 });
      await page.getByRole("heading", { name: "Bantahan dan Rayuan" }).click();
      await page
        .getByRole("heading", { name: "Permohonan Baru" })
        .waitFor({ state: "visible", timeout: 20000 });
      await page.getByRole("heading", { name: "Permohonan Baru" }).click();
      await page.getByText("Asingkan Nombor Rujukan Setem").click();
      await page
        .getByRole("textbox", { name: "Sila Masukkan Nombor Rujukan" })
        .click();
      await page
        .getByRole("textbox", { name: "Sila Masukkan Nombor Rujukan" })
        .fill(currentSRN);
      await page.getByRole("button", { name: "icon Carian" }).click();
      await page
        .getByText("Jenis Rayuan Yang Layak")
        .waitFor({ state: "visible", timeout: 20000 });
      await page.getByText("Jenis Rayuan Yang Layak").click();
      await page
        .getByText(
          "Rayuan Lanjutan Masa Bayaran: Layak membuat permohonan kali pertama",
        )
        .waitFor({ state: "visible", timeout: 20000 });
      await page
        .getByText(
          "Rayuan Lanjutan Masa Bayaran: Layak membuat permohonan kali pertama",
        )
        .click();
      await page.getByRole("button", { name: " Mohon" }).click();
      await page
        .getByText("Jenis Bantahan dan Rayuan:")
        .waitFor({ state: "visible", timeout: 20000 });
      await page.getByText("Jenis Bantahan dan Rayuan:").click();
      await page.getByRole("button", { name: "A. BAHAGIAN A" }).click();
      await page.getByText("Tarikh Cadangan Lanjutan Masa").click();
      await page
        .getByRole("textbox", { name: "Sila nyatakan alasan anda di" })
        .click();
      await page
        .getByRole("textbox", { name: "Sila nyatakan alasan anda di" })
        .fill("a");
      await page.getByRole("button", { name: "C. PERAKUAN" }).click();
      await page.getByText("Saya sebagai*").click();
      await page
        .getByRole("checkbox", { name: "Saya seperti nama dan nombor" })
        .check();
      await page.getByRole("button", { name: "Hantar " }).click();
      await page.getByText("Borang akan dihantar dan").click();
      await page.getByRole("button", { name: "Ya, Hantar" }).click();

      await page
        .getByRole("button", { name: "Kembali ke Dashboard" })
        .waitFor({ state: "visible", timeout: 20000 });
      await page.getByRole("button", { name: "Kembali ke Dashboard" }).click();
      await page
        .getByRole("heading", { name: "Bantahan dan Rayuan" })
        .waitFor({ state: "visible", timeout: 20000 });
      await page.getByRole("heading", { name: "Bantahan dan Rayuan" }).click();
      await page
        .getByText("Asingkan Nombor Rujukan Setem")
        .waitFor({ state: "visible", timeout: 20000 });
      await page.getByText("Asingkan Nombor Rujukan Setem").click();
      await page
        .getByRole("textbox", { name: "Sila Masukkan Nombor Rujukan" })
        .click();
      await page
        .getByRole("textbox", { name: "Sila Masukkan Nombor Rujukan" })
        .fill(currentSRN);
      await page.getByRole("button", { name: "icon Carian" }).click();
      await page
        .getByText(
          "Rayuan Lanjutan Masa Bayaran: Layak membuat permohonan kali kedua",
        )
        .waitFor({ state: "visible", timeout: 20000 });
      await page
        .getByText(
          "Rayuan Lanjutan Masa Bayaran: Layak membuat permohonan kali kedua",
        )
        .click();
      await page.getByRole("button", { name: " Mohon" }).click();
      await page
        .getByText("Jenis Bantahan dan Rayuan:")
        .waitFor({ state: "visible", timeout: 20000 });
      await page.getByText("Jenis Bantahan dan Rayuan:").click();
      await page.getByText("Jumlah Besar Duti Yang Kena").first().click();
      await page.getByRole("button", { name: "A. BAHAGIAN A" }).click();
      await page.getByText("Tarikh Cadangan Lanjutan Masa").click();
      await page.getByRole("textbox", { name: "DD/MM/YYYY" }).click();
      await page.getByRole("combobox").selectOption("11");
      await page.getByLabel("December 1,").click();
      await page
        .getByRole("textbox", { name: "DD/MM/YYYY" })
        .fill("01/12/2026");

      await page
        .getByRole("textbox", { name: "Sila nyatakan alasan anda di" })
        .fill("aaa");
      await page.getByRole("button", { name: "Seterusnya " }).click();
      await page.getByRole("button", { name: "C. PERAKUAN" }).click();
      await page.getByText("Saya sebagai*").click();
      await page
        .getByRole("checkbox", { name: "Saya seperti nama dan nombor" })
        .check();
      await page.getByRole("button", { name: "Hantar " }).click();
      await page.getByText("Borang akan dihantar dan").click();
      await page
        .getByRole("button", { name: "Ya, Hantar" })
        .waitFor({ state: "visible", timeout: 20000 });
      await page.getByRole("button", { name: "Ya, Hantar" }).click();
      await page
        .getByRole("button", { name: "Kembali ke Dashboard" })
        .waitFor({ state: "visible", timeout: 20000 });
      await page.getByRole("button", { name: "Kembali ke Dashboard" }).click();
    }

    console.log(`Completed processing SRN: ${currentSRN}`);
    fs.appendFileSync(
      "./test-data/srn-permanent-log.txt",
      `Completed SRN: ${currentSRN}\n\n`,
    );
  }
});
