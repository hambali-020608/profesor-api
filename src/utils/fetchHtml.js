const axios = require("axios");
const cheerio = require("cheerio");

/**
 * Ambil HTML dan parse pakai Cheerio
 */
async function fetchHtml(url, timeout = 10000) {
  try {
    const { data } = await axios.get(url, { timeout });
    return cheerio.load(data);
  } catch (err) {
    console.error(`❌ Gagal fetch: ${url}`);
    throw new Error(err.message);
  }
}

module.exports = { fetchHtml };
