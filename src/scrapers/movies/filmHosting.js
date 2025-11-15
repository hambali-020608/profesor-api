
// import * as cheerio from 'cheerio';
const cheerio = require('cheerio')
const axios = require('axios');
const FormData = require('form-data');
class hostingHola{
  constructor(){
    this.baseUrl="https://hostingaloha.com/"
  }

    async init() {
    try {
      const res = await fetch(this.baseUrl, { redirect: "follow" }); // auto follow redirect
      if (res.ok) {
        // kalau domain berubah, ambil domain final dari res.url
        const finalUrl = new URL(res.url);
        const base = `${finalUrl.origin}/`;
        if (base !== this.baseUrl) {
          console.log(`🌐 Redirect terdeteksi: ${this.baseUrl} → ${base}`);
          this.baseUrl = base;
        } else {
          console.log(`✅ Domain aktif: ${this.baseUrl}`);
        }
      } else {
        throw new Error("Gagal mengakses domain awal");
      }
    } catch (err) {
      console.error("❌ Gagal mendeteksi domain aktif:", err.message);
    }
  }
  
  async getIndoMovies(page) {
    if (!this.baseUrl) await this.init();
    await this.init(); // pastikan baseUrl terbaru setiap kali dipanggil
    const data = [];
    const response = await fetch(`${this.baseUrl}country/indonesia/page/${page}`);
    const html = await response.text();
    const $ = cheerio.load(html);

    $("article.item").each((i, el) => {
      const title = $(el).find("h2.entry-title").text().trim();
      const linkStream = $(el).find("a").attr("href");
      let encodeurl = Buffer.from(linkStream).toString('base64');
      // const decoded = Buffer.from(encodeurl, "base64").toString("utf8");

      const poster = $(el).find("img").attr("src");
      const rating = $(el).find("div.gmr-rating-item").text().trim();
      const duration = $(el).find("div.gmr-duration-item").text().trim();
      let slug = linkStream.replace(this.baseUrl, "").replace(/^\/|\/$/g, "");;
      let type = "Movies";
       if (slug.includes("tv")) {
       type = "TV-Shows";
    slug =  slug.replace("tv/","")
      }
      

      data.push({ title, linkStream, poster, rating, duration, slug ,type, encodeurl });
    });

    return data;
  }

async ajaxMovieRequest(postId,player="p2"){
  await this.init();

  const formData = new FormData();
  formData.append("action", "muvipro_player_content");
  formData.append("post_id", postId);
  formData.append("tab", player);
console.log(this.baseUrl)
  const ajaxUrl = `${this.baseUrl}/wp-admin/admin-ajax.php`;

console.log(ajaxUrl)
  try {
    const response = await axios.post(ajaxUrl, formData, {
      headers: {
        ...formData.getHeaders(), // penting! biar axios tahu boundary form-data
        "User-Agent":

          "Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Mobile Safari/537.36",
        "Accept": "*/*",
        //  Cookie:
        //   "_ga=GA1.1.528776697.1762410628; HstCfa4817503=1762410628468; HstCmu4817503=1762410628468; HstCnv4817503=6; HstCns4817503=14; HstCla4817503=1762660879450; HstPn4817503=15; HstPt4817503=63; _ga_3CGR74STBG=GS2.1.s1762662910$o9$g0$t1762662910$j60$l0$h0; _ga_KHRQH5CXEW=GS2.1.s1762662910$o9$g0$t1762662910$j60$l0$h0",
        "Origin": "https://giselelubsen.com",
      
        // "Priority": "u=1, i",
        //  DNT: "1",
      },
      maxRedirects: 5,
      timeout: 15000,
      validateStatus: (status) => status < 500, // biar error 4xx tetap bisa dibaca
    });

    const html = response.data;
    console.log(html)
    const $ = cheerio.load(html);
    
    const iframeUrl = $("iframe").attr("src");

    console.log("🎬 Response loaded, iframe URL:", iframeUrl);
    return iframeUrl || null;

  } catch (err) {
    console.error("❌ Gagal memuat player:", err.message);
    if (err.response) {
      console.error("Status:", err.response.status);
      console.error("Body:", err.response.data);
    }
    return null;
  }

    
}
  async getStreaming(slug = "", url,type="Movies",player) {

    if (!this.baseUrl) await this.init();
       // const decoded = Buffer.from(encodeurl, "base64").toString("utf8");
    const targetUrl = url || `${this.baseUrl}${slug}`;
    const response = await fetch(targetUrl, { redirect: "follow" });
    const html = await response.text();
    
    // console.log(html)
    const $ = cheerio.load(html);
    if (type === "TV-Shows") {
    const listSeriesLink = [];
    $('div.gmr-listseries > a').each((i, el) => {
      const episodeTitle = $(el).text().trim();
      const episodeLink = $(el).attr('href');
      listSeriesLink.push({ episodeTitle, episodeLink });
    });
    return { listSeriesLink };
    
  }
  // const listPlayer = []
  const idMovie = $('div#muvipro_player_content_id').attr('data-id');
  const StreamingUrl = await this.ajaxMovieRequest(idMovie)
   // === ambil informasi utama ===

    const title = $("h1.entry-title").text().trim();
    const description = $(".entry-content p").first().text().trim();
    const rating = $(".gmr-meta-rating").text().trim() || null;
    const date = $(".entry-meta time").first().text().trim();
    const updated = $(".entry-meta time").last().text().trim();
   const cast = [];
     $('[itemprop="actors"] [itemprop="name"]').each((i, el) => {
      const name = $(el).text().trim();
      if (name) cast.push(name);
    });
    const views = $(".views").text().trim();

    // === ambil detail film ===
    const details = {};
    $(".mvic-desc .mvic-info p").each((i, el) => {
      const text = $(el).text().trim();
      const [key, value] = text.split(":").map(s => s.trim());
      if (key && value) details[key.toLowerCase()] = value;
    });

    // === ambil link download ===
    const downloads = [];
    $(".gmr-download-list a").each((i, el) => {
      const link = $(el).attr("href");
      const label = $(el).text().trim();
      downloads.push({ label, link });
    });

  
  return { idMovie,StreamingUrl
    , title, description, rating, downloads,cast
  };
  }
  async searchMovies(query) {
    if (!this.baseUrl) await this.init();
    const data = [];
    const response = await fetch(`${this.baseUrl}?s=${encodeURIComponent(query)}`);
    const html = await response.text();
    const $ = cheerio.load(html);
    
    $("article.item").each((i, el) => {
      console.log(el)
      const title = $(el).find("h2.entry-title").text().trim();
      const linkStream = $(el).find("a").attr("href");
      let encodeurl = Buffer.from(linkStream).toString('base64');
      // const decoded = Buffer.from(encodeurl, "base64").toString("utf8");

      const poster = $(el).find("img").attr("src");
      const rating = $(el).find("div.gmr-rating-item").text().trim();
      const duration = $(el).find("div.gmr-duration-item").text().trim();
      let slug = linkStream.replace(this.baseUrl, "").replace(/^\/|\/$/g, "");;
      let type = "Movies";
       if (slug.includes("tv")) {
       type = "TV-Shows";
    slug =  slug.replace("tv/","")
      }
      

      data.push({ title, linkStream, poster, rating, duration, slug ,type, encodeurl })
    })
    return data
  }
  
// async getDramaStream(slug = "", player = 1) {
}


// (async () => {
//   const filmHosting = new hostingHola();

//   // Ganti slug di bawah dengan path film nyata di situs kamu
//   const result = await filmHosting.getStream('jalan-pulang-2025');
//   console.log("\n✅ Hasil Akhir:");
//   console.log(result);
// })();


// const filmHosting = new hostingHola()
// filmHosting.getStream('pabrik-gula-2025')

module.exports = {hostingHola}