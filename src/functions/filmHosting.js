const puppeteer = require("puppeteer-core");
const chromium = require("@sparticuz/chromium");
const os = require("os");

// Helper delay
function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Setup browser (agar tidak buka-tutup setiap kali fungsi jalan)
async function launchBrowser() {
  const isLocal = os.platform() === "win32" || os.platform() === "darwin";
  const browser = await puppeteer.launch({
    args: chromium.args,
    executablePath: isLocal
      ? "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe"
      : await chromium.executablePath(),
    headless: isLocal ? false : chromium.headless,
  });
  const page = await browser.newPage();
  return { browser, page };
}

// 1️⃣ Dapatkan jumlah / daftar player yang tersedia
// async function getAvailablePlayers(url) {
//   const { browser, page } = await launchBrowser();
//   await page.goto(url, { waitUntil: "networkidle2" });

//   // Ambil semua id player (misal #player1, #player2, ...)
//   const availablePlayers = await page.$$eval("[id^='player']", (els) =>
//     els.map((el) => el.id)
//   );

//   await browser.close();
//   return availablePlayers;
// }

// 2️⃣ Ambil iframe dari player tertentu
async function getStream(url,player="player1") {
  const { browser, page } = await launchBrowser();
  await page.goto(url, { waitUntil: "networkidle2" });

  const selector = `#${player}`;
  const exists = await page.$(selector);
  if (!exists) {
    await browser.close();
    throw new Error(`Player ${playerIndex} tidak ditemukan.`);
  }

  await page.click(selector);
  await delay(2000); // tunggu konten ganti

  // Ambil iframe src
  const iframeSrc = await page.$$eval("iframe", (frames) => {
    const valid = frames
      .map((f) => f.src)
      .filter((src) => src && src.startsWith("http"));
    return valid.length > 0 ? valid[0] : null;
  });

  await browser.close();
  return iframeSrc;
}

// 🚀 Contoh penggunaan
// (async () => {
//   const url = "https://giselelubsen.com/jalan-pulang-2025";

//   // Cek dulu player yang tersedia
//   // const players = await getAvailablePlayers(url);
//   // console.log("🎮 Player yang tersedia:", players);

//   // Ambil hanya player ke-2 (misalnya)
//   const iframe = await getIframeFromPlayer(url, 2);
//   console.log("🎬 Iframe player 2:", iframe);
// })();


module.exports = { getStream };
