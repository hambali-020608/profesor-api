// filmHosting.js
const puppeteer = require("puppeteer-core");
const chromium = require("@sparticuz/chromium");
const os = require("os");

/**
 * Fungsi universal untuk ambil semua iframe dari halaman
 * Bisa jalan di lokal (Windows/Linux/Mac) maupun di serverless (Vercel, Netlify, dsb)
 */
async function getStream(url) {
  const isLocal = os.platform() === "win32" || os.platform() === "darwin";

  const browser = await puppeteer.launch({
    args: chromium.args,
    executablePath: isLocal
      ? "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe" // ubah sesuai lokasi Chrome kamu
      : await chromium.executablePath(),
    headless: isLocal ? false : chromium.headless,
  });

  const page = await browser.newPage();
  await page.goto(url, { waitUntil: "networkidle2" });

  // Tunggu iframe muncul
  await page.waitForSelector(".tab-content-ajax iframe", { timeout: 10000 }).catch(() => {});

  // Ambil semua iframe src
  const iframes = await page.$$eval(".tab-content-ajax iframe", (frames) =>
    frames.map((f) => f.src)
  );
  console.log("Found iframes:", iframes);

  await browser.close();
  return iframes;
}

module.exports = { getStream };
