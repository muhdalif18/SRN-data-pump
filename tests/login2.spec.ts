import { test, expect } from "@playwright/test";
import * as fs from "fs";

test("HITS Login", async ({ page }) => {
  // Set viewport size to ensure elements are visible
  await page.setViewportSize({ width: 1920, height: 1080 });

  // Use hardcoded SRN for independent testing
  const srn = "9992696738962163";

  console.log(`Using SRN: ${srn}`);

  // Navigate to HITS system
  await page.goto("https://hitspre2.hasil.gov.my/Dashboard/Login");
  await page.locator(".login-screen").click();
  await page.locator("#Input_UsernameVal").click();
  await page.locator("#Input_UsernameVal").fill("userstds11@hasil.gov.my");
  await page.locator("#Input_UsernameVal").click();
  await page.locator("#Input_PasswordVal").click();
  await page.locator("#Input_PasswordVal").fill("990101019011");
  await page.getByRole("button", { name: "Login" }).click();
  await page.getByRole("link", { name: "Duti Setem " }).click();
  await page.getByRole("link", { name: "Taksiran Duti Setem" }).click();
  await page.getByRole("link", { name: "Carian" }).click();
  await page.getByRole("radio", { name: "No TIN" }).check();
  await page.getByRole("radio", { name: "No. Rujukan Setem" }).check();
  await page.getByPlaceholder(" ").click();
  await page.getByPlaceholder(" ").click();
  await page.getByPlaceholder(" ").fill("9992670232692500");
  await page.getByRole("button", { name: " Cari" }).click();

  // Capture Nama Pemegang SRN
  await page.waitForTimeout(2000);
  const namaPemegangElement = await page.locator(
    'div.columns-item:has-text("Nama Pemegang SRN") + div.columns-item span[data-expression][style*="font-weight: bold"]',
  );
  const namaPemegang = await namaPemegangElement.textContent();
  const namaPemegangValue = namaPemegang?.trim() || "";
  console.log(`Nama Pemegang SRN: ${namaPemegangValue}`);
  fs.appendFileSync(
    "./test-data/current-url.txt",
    `Nama Pemegang SRN: ${namaPemegangValue}\n`,
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
  await page.waitForTimeout(3000);

  // Login again with the user's credentials
  await page.locator("#Input_UsernameVal").waitFor({ state: "visible" });
  await page.locator("#Input_UsernameVal").click();
  await page.locator("#Input_UsernameVal").fill(user.loginId);
  await page.locator("#Input_PasswordVal").click();
  await page.locator("#Input_PasswordVal").fill(user.password);
  await page.getByRole("button", { name: "Login" }).click();
  await page.waitForTimeout(5000);

  await page.getByRole("link", { name: "Duti Setem " }).click();
  await page.getByRole("link", { name: "Taksiran Duti Setem" }).click();
  await page.getByRole("link", { name: "Carian" }).click();
  await page.getByRole("radio", { name: "No TIN" }).check();
  await page.getByRole("radio", { name: "No. Rujukan Setem" }).check();
  await page.getByPlaceholder(" ").click();
  await page.getByPlaceholder(" ").click();
  await page.getByPlaceholder(" ").fill("9992670232692500");
  await page.getByRole("button", { name: " Cari" }).click();

  await page.getByText("Negeri").waitFor({ state: "visible" });
  await page.getByText("Negeri").click();
  await page.getByText("No. Rujukan Setem (SRN)").waitFor({ state: "visible" });
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
    .waitFor({ state: "visible" });
  await page.getByRole("button", { name: "Senarai Taksiran" }).click();
  await page.getByRole("button", { name: "Senarai Taksiran" }).click();
  await page.getByRole("link", { name: "-", exact: true }).click();
  await page
    .getByRole("button", { name: "Sedia Untuk Taksiran Duti" })
    .waitFor({ state: "visible" });
  await page.getByRole("button", { name: "Sedia Untuk Taksiran Duti" }).click();
  await page.getByText("Pengesahan Tindakan").waitFor({ state: "visible" });
  await page.getByText("Pengesahan Tindakan").click();
  await page.getByText("Adakah Anda Ingin Teruskan").click();
  await page.getByRole("button", { name: "Ya" }).waitFor({ state: "visible" });
  await page.getByRole("button", { name: "Ya" }).click();
  await page
    .getByText("Tindakan - Taksiran Duti")
    .waitFor({ state: "visible" });
  await page.getByText("Tindakan - Taksiran Duti").nth(1).click();
  await page
    .getByRole("button", { name: "Prebiu Notis" })
    .waitFor({ state: "visible" });
  await page.getByRole("button", { name: "Prebiu Notis" }).click();

  await page.locator("i.fa-times").waitFor({ state: "visible" });
  await page.locator("i.fa-times").click();
  await page
    .getByRole("button", { name: "Hantar" })
    .waitFor({ state: "visible" });
  await page.getByRole("button", { name: "Hantar" }).click();
  await page.getByRole("button", { name: "Ya" }).waitFor({ state: "visible" });
  await page.getByRole("button", { name: "Ya" }).click();
  await page.getByRole("link", { name: "Carian" }).click();
  await page.getByPlaceholder(" ").waitFor({ state: "visible" });
  await page.getByPlaceholder(" ").click();
  await page.getByPlaceholder(" ").fill("9992670232692500");
  await page
    .getByRole("button", { name: " Cari" })
    .waitFor({ state: "visible" });
  await page.getByRole("button", { name: " Cari" }).click();
  await page.getByRole("link", { name: "-", exact: true }).click();
  await page.getByText("Tidak Indors").click();
  await page.getByText("Indors", { exact: true }).click();
  await page.getByRole("button", { name: "Hantar" }).click();
  await page.getByText("Pengesahan Tindakan").click();
  await page.getByText("Adakah anda pasti untuk").click();
  await page.getByRole("button", { name: "Ya" }).click();
});
