import { test, expect } from "@playwright/test";
import * as fs from "fs";

const namaList = ["Form of Transfer of Securites"];

test("test", async ({ page }) => {
  // Clear browser cache and cookies before starting
  const client = await page.context().newCDPSession(page);
  await client.send("Network.clearBrowserCache");
  await client.send("Network.clearBrowserCookies");

  // Load addresses data
  const addressesData = JSON.parse(
    fs.readFileSync("./test-data/addresses_my.json", "utf-8"),
  );
  const addresses = addressesData.INDIVIDU;

  await page.goto("https://mytax-dev.hasil.gov.my/web/");
  await page.waitForTimeout(3000);

  await page.getByRole("combobox").selectOption("1");
  await page.getByRole("textbox", { name: "No. Pengenalan" }).click();
  await page
    .getByRole("textbox", { name: "No. Pengenalan" })
    .fill("860125085432");
  await page.getByRole("button", { name: "Hantar" }).click();
  await page
    .getByRole("textbox", { name: "Sila Masukkan Kata Laluan" })
    .waitFor({ state: "visible" });
  await page
    .getByRole("textbox", { name: "Sila Masukkan Kata Laluan" })
    .click();
  await page
    .getByRole("textbox", { name: "Sila Masukkan Kata Laluan" })
    .fill("Passw0rd");
  await page
    .getByText("Percubaan Log Masuk Anda : 0 /")
    .waitFor({ state: "visible" });
  await page.getByText("Percubaan Log Masuk Anda : 0 /").click();
  await page
    .getByText("Anda Ada 5 Percubaan Lagi")
    .waitFor({ state: "visible" });
  await page.getByText("Anda Ada 5 Percubaan Lagi").click();
  await page.getByText("Anda Ada 5 Percubaan Lagi").click();
  await page
    .getByRole("textbox", { name: "Sila Masukkan Kata Laluan" })
    .waitFor({ state: "visible" });
  await page
    .getByRole("textbox", { name: "Sila Masukkan Kata Laluan" })
    .click();
  await page.getByRole("button", { name: "Log Masuk" }).click();

  await page
    .getByText("Mulai 1 Januari 2023, format")
    .waitFor({ state: "visible" });
  await page.getByText("Mulai 1 Januari 2023, format").click();
  await page.getByRole("button", { name: "Ok" }).click();
  await page.waitForTimeout(5000);

  //
  await page.getByText("Individu", { exact: true }).click();
  await page.getByText("Firma Pengurusan").click();
  await page.getByText("Firma Ejen Duti Setem").click();
  const page1Promise = page.waitForEvent("popup");
  await page.getByText("HHL RESOURCES SENDIRIAN BERHAD").click();
  const page1 = await page1Promise;
  await page1.waitForLoadState();
  await page.bringToFront();
  await page1.close();
  //

  /* await page.getByText("Perkhidmatan ezHasil").waitFor({ state: "visible" });
  await page.getByText("Perkhidmatan ezHasil").click();
  await page
    .getByText("Duti Setem 2.0 (UAT) e-Duti")
    .waitFor({ state: "visible" });
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
    "./test-data/current-url.txt",
    "Stamping Submission URLs\n========================\n\n",
  );
 */
  // Loop 20 times starting from the stamping upload
  for (let i = 1; i <= 50; i++) {
    console.log(`--- Loop iteration ${i} of XX ---`);

    await page.goto("https://eds-uat.hasil.gov.my/stamping/upload");
    //await page.locator('a[href="/stamping/upload"]').click();
    await page.waitForTimeout(5000);
    await page
      .getByRole("button", { name: "Faham" })
      .waitFor({ state: "visible" });
    await page.getByRole("button", { name: "Faham" }).click();
    await page
      .locator("#fileInput_single")
      .setInputFiles("./test-data/image (19).png");

    await page
      .getByRole("button", { name: "Hantar" })
      .waitFor({ state: "visible" });
    await page.getByRole("button", { name: "Hantar" }).click();
    await page.getByRole("button", { name: "Teruskan tanpa AI" }).click();
    await page
      .getByRole("option", { name: "DS 2: Pindah Milik Saham" })
      .waitFor({ state: "visible" });
    await page
      .getByRole("option", { name: "DS 2: Pindah Milik Saham" })
      .click();
    await page.getByText("Tempat Surat Cara Ditandatangan*").click();
    await page.locator("#DocTitleStep0").click();
    await page.locator("#DocTitleStep0").fill("Form of Transfer of Securites");
    await page
      .locator("span.input-group-text.cursor-pointer")
      .first()
      .waitFor({ state: "visible", timeout: 10000 });
    await page
      .locator("span.input-group-text.cursor-pointer")
      .first()
      .click({ force: true });
    await page.getByLabel("May 8,").first().click();
    await page.getByRole("textbox", { name: "dd/MM/yyyy" }).fill("08/05/2026");
    await page.getByRole("radio", { name: "Luar Malaysia" }).check();
    await page.getByRole("radio", { name: "Malaysia", exact: true }).check();
    await page.getByRole("button", { name: "Seterusnya " }).click();
    await page.getByText("1 Pihak Pertama Simpan").click();
    await page.getByRole("button", { name: "OK" }).click();
    await page
      .locator(".collapse-body > div > div:nth-child(2)")
      .first()
      .click();
    await page
      .locator("#step1_div_nama_surat_cara")
      .getByText("Nama Seperti Dalam Surat Cara*")
      .click();
    await page
      .locator('input[name="StampingForm.FormAIndividualList[0].Name"]')
      .click();
    await page
      .getByRole("checkbox", { name: "Saya / Syarikat sebagai" })
      .check();
    //////////
    await page.waitForTimeout(3000);
    await page
      .locator('input[name="StampingForm.FormACompanyList[0].CompanyName"]')
      .click();
    await page.locator("#KategoriPembayarDuti").selectOption("4");
    await page.waitForTimeout(2000);
    await page
      .locator(
        'input[name="StampingForm.FormACompanyList[0].OldCompanyRegistrationNo"]',
      )
      .click();
    await page
      .locator(
        'input[name="StampingForm.FormACompanyList[0].OldCompanyRegistrationNo"]',
      )
      .fill("123456");
    await page
      .locator(
        'input[name="StampingForm.FormACompanyList[0].OldCompanyRegistrationNo"]',
      )
      .press("Tab");
    await page
      .locator(
        'input[name="StampingForm.FormACompanyList[0].NewCompanyRegistrationNo"]',
      )
      .fill("12345");
    await page
      .getByText(
        "Nombor Pengenalan Cukai (TIN)* Nombor TIN syarikat berjaya dijumpai.",
      )
      .click();
    await page.getByRole("radio").nth(5).check();
    await page
      .locator('input[name="StampingForm.FormACompanyList[0].TelNo"]')
      .click();
    await page
      .locator('input[name="StampingForm.FormACompanyList[0].TelNo"]')
      .fill("0199184955");
    await page.locator("#fld-email-com-0Step1").click();
    await page.locator("#fld-email-com-0Step1").fill("test@gm");
    await page.locator("#fld-email-com-0Step1").press("ControlOrMeta+a");
    await page.locator("#fld-email-com-0Step1").fill("hhhllresoucr@gmail.com");
    const randomCompanyAddr =
      addresses[Math.floor(Math.random() * addresses.length)];

    await page
      .locator('input[name="StampingForm.FormACompanyList[0].ADDR1"]')
      .click();
    await page
      .locator('input[name="StampingForm.FormACompanyList[0].ADDR1"]')
      .fill(randomCompanyAddr.Addr1);
    await page
      .locator('input[name="StampingForm.FormACompanyList[0].ADDR1"]')
      .press("Tab");
    await page
      .locator('input[name="StampingForm.FormACompanyList[0].ADDR2"]')
      .fill(randomCompanyAddr.Addr2);
    await page
      .locator('input[name="StampingForm.FormACompanyList[0].ADDR2"]')
      .press("Tab");
    await page
      .locator('input[name="StampingForm.FormACompanyList[0].ADDR3"]')
      .fill(randomCompanyAddr.Addr3);
    await page
      .locator('input[name="StampingForm.FormACompanyList[0].ADDR3"]')
      .press("ControlOrMeta+b");
    await page
      .locator('input[name="StampingForm.FormACompanyList[0].Postcode"]')
      .click();
    await page
      .locator('input[name="StampingForm.FormACompanyList[0].Postcode"]')
      .fill("60000");
    await page.waitForTimeout(5000);
    await page
      .getByText(
        "Maklumat Pihak Pertama + Tambah Pihak Pertama 1 HHL RESOURCES SENDIRIAN BERHAD",
      )
      .click();
    /////////
    await page.getByRole("button", { name: "Seterusnya " }).click();
    await page
      .locator('input[name="StampingForm.FormBIndividualList[0].Name"]')
      .click();
    await page
      .locator('input[name="StampingForm.FormBIndividualList[0].Name"]')
      .fill("FREDY MERCURY");
    await page.locator("#IsCitizen_0").selectOption("1");
    await page.locator("#isRoles1_0").check();
    await page
      .locator('input[name="StampingForm.FormBIndividualList[0].IcNo"]')
      .click();
    await page
      .locator('input[name="StampingForm.FormBIndividualList[0].IcNo"]')
      .fill("951004146116");
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
    await page
      .locator("div")
      .filter({ hasText: /^Bandar$/ })
      .nth(1)
      .click();
    await page
      .locator("div")
      .filter({ hasText: /^Negeri$/ })
      .nth(1)
      .click();
    await page.getByRole("button", { name: "Seterusnya " }).click();

    // Generate random numbers between 5-7 digits
    const randomDigits = Math.floor(Math.random() * 3) + 5; // Random between 5-7
    const minValue = Math.pow(10, randomDigits - 1);
    const maxValue = Math.pow(10, randomDigits) - 1;
    const randomNumber =
      Math.floor(Math.random() * (maxValue - minValue + 1)) + minValue;
    const formattedNumber = randomNumber.toLocaleString("en-US");

    await page.locator("#saham1").check();
    await page.getByRole("radio", { name: "Saham Keutamaan" }).check();
    await page.locator("#saham1").check();
    await page.locator("#StampingForm_formC_2_ShrTot").click();
    await page.locator("#StampingForm_formC_2_ShrTot").fill(formattedNumber);
    await page.locator("#StampingForm_formC_2_ShrTrf").click();
    await page.locator("#StampingForm_formC_2_ShrTrf").fill(formattedNumber);
    await page.getByText("Ringgit Malaysia", { exact: true }).click();
    await page.getByText("Ringgit Malaysia", { exact: true }).click();
    await page.getByRole("radio", { name: "Matawang Asing" }).check();
    await page.getByRole("radio", { name: "Ringgit Malaysia" }).check();
    await page.getByRole("textbox", { name: "0.00" }).click();
    await page.getByRole("textbox", { name: "0.00" }).fill("00.01");
    await page.getByRole("textbox", { name: "0.00" }).press("ControlOrMeta+a");

    // Generate random number between 10,000,000 - 20,000,000 with first 3 digits the same
    const firstDigit = Math.floor(Math.random() * 9) + 1; // Random digit 1-9
    const remainingDigits = Math.floor(Math.random() * 9000000) + 1000000; // Random 7 digits
    const randomAmount = parseInt(
      `${firstDigit}${firstDigit}${firstDigit}${remainingDigits.toString().substring(1)}`,
    );
    const formattedAmount = randomAmount.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

    await page.getByRole("textbox", { name: "0.00" }).fill(formattedAmount);
    await page.locator("#statusSelect").selectOption("3");
    await page.getByRole("textbox").nth(3).click();
    await page.getByRole("textbox").nth(3).fill("01/05/2026");
    await page
      .locator("#section2 > div > .input-group > .input-group-text")
      .first()
      .waitFor({ state: "visible", timeout: 10000 });
    await page
      .locator("#section2 > div > .input-group > .input-group-text")
      .first()
      .click({ force: true });
    await page
      .locator("#section2")
      .getByText("Tempoh Perakaunan Tamat*")
      .click();
    await page.getByRole("textbox").nth(4).click();
    await page.getByRole("textbox").nth(4).fill("07/05/2026");
    await page.locator("#section2").getByText("Aset Tetap*").click();
    await page.locator("#section2 #StampingForm_formC_2_AssetFixed").click();
    await page
      .locator("#section2 #StampingForm_formC_2_AssetFixed")
      .fill("00.01");
    await page
      .locator("#section2 #StampingForm_formC_2_AssetFixed")
      .press("ControlOrMeta+a");
    await page
      .locator("#section2 #StampingForm_formC_2_AssetFixed")
      .fill("2,121,2121.02");
    await page.locator("#section2").getByText("Aset Tidak Ketara*").click();
    await page.locator("#section2 #StampingForm_formC_2_AssetInt").click();
    await page
      .locator("#section2 #StampingForm_formC_2_AssetInt")
      .fill("1,212,121,2121.02");
    await page.locator("#section2").getByText("Jumlah Aset*").click();
    await page.locator("#section2").getByText("Jumlah Aset*").click();
    await page.locator("#section2 #StampingForm_formC_2_AssetTot").click();
    await page
      .locator("#section2 #StampingForm_formC_2_AssetTot")
      .fill("12,121,2121.01");
    await page.locator("#section2").getByText("Jumlah Liabiliti*").click();
    await page.locator("#section2 #StampingForm_formC_2_AssetLiab").click();
    await page
      .locator("#section2 #StampingForm_formC_2_AssetLiab")
      .fill("12,121,2121.01");
    await page
      .locator("#section2")
      .getByText("Keuntungan Selepas Cukai*")
      .click();
    await page.locator("#section2 #StampingForm_formC_2_ProfitTax").click();
    await page
      .locator("#section2 #StampingForm_formC_2_ProfitTax")
      .fill("12,121,212.121");
    await page.locator("#transactionReason").selectOption("1");
    await page.getByRole("button", { name: "Seterusnya " }).click();
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
    await page
      .locator(
        "#collapse4_MaklumatSyarikatSahamYangDipindahMilik > .accordion-body > fieldset > .form-section > div > .bg-white > div:nth-child(2) > div:nth-child(3)",
      )
      .click();
    await page
      .locator(
        "#collapse4_MaklumatSyarikatSahamYangDipindahMilik > .accordion-body > fieldset > .form-section > div > .bg-white > div:nth-child(2) > div:nth-child(4)",
      )
      .click();
    await page
      .locator("div")
      .filter({ hasText: /^Salinan$/ })
      .click();
    await page.getByRole("button", { name: "Seterusnya " }).click();
    await page.getByRole("radio", { name: "Ada", exact: true }).check();
    await page.getByRole("radio", { name: "Tiada" }).check();
    await page.getByText("Permohonan Peremitan /").click();
    await page.getByRole("button", { name: "Seterusnya " }).click();
    await page.getByRole("button", { name: "Seterusnya " }).click();
    await page.waitForTimeout(2000);
    await page.getByText("Wakil Pihak Pertama").click();
    await page.waitForTimeout(2000);
    await page.getByText("Diri Sendiri").click();
    await page
      .locator("label")
      .filter({ hasText: "Saya seperti nama dan Nombor" })
      .click();
    await page.getByRole("button", { name: "Hantar " }).click();
    await page.getByRole("button", { name: "Batal" }).click();
    await page.getByRole("button", { name: "Hantar " }).click();
    await page.getByRole("button", { name: "Ya, Hantar!" }).click();
    await page.getByRole("button", { name: "OK" }).click();
    await page
      .getByRole("button", { name: "Kembali ke Paparan Utama" })
      .click();
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
    fs.appendFileSync("./test-data/current-url.txt", `SRN: ${srnValue}\n`);

    await page.getByRole("cell", { name: "LHDNM Proses" }).first().click();
  }
});
