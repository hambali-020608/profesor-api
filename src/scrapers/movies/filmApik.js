
// import * as cheerio from 'cheerio';
const cheerio = require('cheerio')

const axios = require('axios');

const filmApik = {


  BoxOfficeApik: async (page) => {
    const data = [];
    const response = await fetch(`https://filmapik.coupons/category/box-office/page/${page}`);
    const html = await response.text();
    const $ = cheerio.load(html);
  
    $('article.item.movies').each((i, el) => {
      const poster = $(el).find('img').attr('src');
      const rating = $(el).find('div.rating').text();
      const title = $(el).find('h3 a').text();
      
      data.push({
        posterUrls: poster,
        moviesTitle: title,
        Type:"Movies",
        moviesRating: rating
      });
    });
  
    return { data };
  },
  TrendingApik: async (page) => {
    let data = [];
    const response = await fetch(`https://filmapik.coupons/trending-2/page/${page}`);
    const html = await response.text();
    const $ = cheerio.load(html);
    
    $('article.item.movies').each((i, el) => {
      const poster = $(el).find('img').attr('src');
      const rating = $(el).find('div.rating').text();
      const title = $(el).find('h3 a').text();
      
      data.push({
        posterUrls: poster,
        Type:"Movies",
        moviesTitle: title,
        moviesRating: rating
      });
    });
  
    return { data };
  },
  LatestApik: async (page) => {
    let data = [];
  const baseurl = "https://filmapik.channel"
    const response = await fetch(`https://filmapik.channel/latest/page/${page}`);
    const html = await response.text();
    const $ = cheerio.load(html);
    
    $('article.item.movies').each((i, el) => {
      const poster = $(el).find('img').attr('src');
      const rating = $(el).find('div.rating').text();
      const title = $(el).find('h3 a').text();
    const slug = $(el).find('a').attr('href').replace(baseurl,'').replace('/','');
      
      data.push({
        posterUrls: poster,
        slug,
        moviesTitle: title,
        Type:"Movies",
        moviesRating: rating
      });
    });
  
    return { data };
  },

DownloadApik: async(slug,type="Movies")=>{

  if(type ==="Movies"){
const response = await fetch(`https://filmapik.channel/nonton-film-${slug}-subtitle-indonesia/play`)
  const data = await response.text()
  const $ = cheerio.load(data)
  const links = [];
  
  
  // Karena semua <ul> punya class yang sama dan ID yang sama (tidak valid HTML),
  // kita bisa loop berdasarkan struktur DOM-nya
  $('#playeroptions > ul').each((i, el) => {
      const server = $(el).find('.server_title').text().trim();
      const li = $(el).find('li.dooplay_player_option');
      const url = li.attr('data-url');
      const quality = li.find('.title').text().trim();
      

      links.push({
          server,
          quality,
          url
      });
  });
  let title = $('h1[itemprop="name"]').text().trim();
 title = title.replace('Nonton Film',"")
  title = title.replace('Filmapik','')

  const genres = [];
  $('.sgeneros a').each((i, el) => {
    genres.push($(el).text().trim());
  });

  let director = $('span.tagline:contains("Director") a').first().text().trim();
  
  const actors = [];
  $('span[itemprop="actor"] a').each((i, el) => {
    actors.push($(el).text().trim());
  });

  const country = $('span.country:contains("Country") a').text().trim();

  let duration = $('span.runtime').text().replace('Duration', '').trim();
   duration = duration.replace(':', '').trim();

  const quality = $('span.country:contains("Quality") a').text().trim();

  const releaseYear = $('span.country:contains("Release") a').text().trim();

  const imdb = $('#repimdb strong').text().trim();

  const resolution = $('span.country:contains("Resolusi") a').text().trim();

  const synopsis = $('.sbox h2:contains("Synopsis")')
    .next('.wp-content')
    .text()
    .trim();
    
    return {
    title,
    genres,
    director,
    actors,
    source:'filmapik',
    country,
    duration,
    quality,
    slug,
    releaseYear,
    imdb,
    resolution,
    synopsis,
    links
  };
  
  
}
  if(type ==="TV-Shows"){
    function extractUrlFromStyle(style) {
  if (!style) return null;
  const m = style.match(/url\((['"]?)(.*?)\1\)/i);
  return m ? m[2] : null;
}

/**
 * Normalisasi href relatif menjadi absolute menggunakan baseUrl jika perlu
 */
function normalizeUrl(href, baseUrl) {
  if (!href) return null;
  try {
    return new URL(href, baseUrl).href;
  } catch (e) {
    return href;
  }
}

const baseUrl = 'https://filmapik.channel';
    
const response = await fetch(`https://filmapik.channel/tvshows/nonton-${slug}-sub-indo/`)

const data = await response.text()
const $ = cheerio.load(data)
    // Breadcrumbs
 
  // Judul utama
  const title = $('h1').first().text().trim();

  // Poster image
  const poster = $('.poster img').attr('src') || $('.poster img').attr('data-src');

  // Backdrop dari style
  const backdropStyle = $('.tvshow_backdrop').attr('style') || '';
  const backdrop = extractUrlFromStyle(backdropStyle);

  // Genres (di dalam .sgeneros a)
  const genres = $('.sgeneros a').map((i, el) => $(el).text().trim()).get();

  // Director, Stars, Networks — cari span.tagline yang mengandung kata kunci
  function findLinksFromTagline(keyword) {
    const el = $('span.tagline').filter((i, s) => $(s).text().includes(keyword)).first();
    if (!el || el.length === 0) return [];
    return el.find('a').map((i, a) => ({
      name: $(a).text().trim(),
      href: normalizeUrl($(a).attr('href'), baseUrl)
    })).get();
  }
  const directors = findLinksFromTagline('Director');
  const stars = findLinksFromTagline('Stars');
  
  // Series status & duration
  // Status mis. di: <div class="info-more"><span>Series Status : Ended</span>...
  const infoSpans = $('.info-more span').map((i, el) => $(el).text().trim()).get();
  // coba cari yang memuat "Series Status" dan "Duration"
  const seriesStatus = infoSpans.find(s => /Series Status/i.test(s))?.split(':').pop().trim() || null;
  // itemprop duration jika ada
  const duration = $('[itemprop="duration"].runtime').text().trim() || (infoSpans.find(s => /Duration/i.test(s))?.split(':').pop().trim() || null);

  // Seasons & episodes
  const seasons = [];
  $('#seasons .se-c').each((i, se) => {
    const $se = $(se);
    // season number bisa di .se-t atau di judul .title
    const seasonNumberText = $se.find('.se-t').first().text().trim() || $se.find('.title').first().text().trim();
    // Normalisasi angka
    const seasonNumber = (seasonNumberText.match(/\d+/) || [null])[0];

    const seasonTitle = $se.find('.title').first().text().trim() || `Season ${seasonNumber || i+1}`;

    const episodes = [];
    $se.find('ul.episodios li').each((j, li) => {
      const a = $(li).find('a').first();
      const epText = a.text().trim() || $(li).text().trim();
      const epHref = normalizeUrl(a.attr('href'));
      // optional: parse episode index dari class seperti mark-1-3 -> season-episode
      const cls = $(li).attr('class') || '';
      let epIndex = null;
      const cm = cls.match(/mark-(\d+)-(\d+)/);
      if (cm) {
        epIndex = { season: parseInt(cm[1], 10), episode: parseInt(cm[2], 10) };
      }
      episodes.push({
        text: epText,
        href: epHref,
        index: epIndex
      });
    });

    seasons.push({
      season: seasonNumber ? parseInt(seasonNumber, 10) : (i + 1),
      title: seasonTitle,
      episodes
    });
  });

  // Cast names (jika mau nama saja)
  const castNames = stars.map(s => s.name);

  // Kembalikan objek ringkas
  return {
    title,
    poster: normalizeUrl(poster, baseUrl),
    backdrop: normalizeUrl(backdrop, baseUrl),
    genres,
    directors,
    stars,
    castNames,

    seriesStatus,
    duration,
    seasons
  };
}
  
  
  // const cleanedSlug = slugify(slug)        // hilangkan semua kecuali huruf, angka, dan tanda minus
  
  // return links


},

StreamingDrama:async(slug)=>{
  const response = await fetch(`https://filmapik.channel${slug}`)
  const data = await response.text()
  const $ = cheerio.load(data)
  // --- ambil data penting ---
const title = $("h1").text().trim();
const poster = $(".sheader .poster img").attr("src");
const imdb = $("#repimdb strong").text().trim();
const duration = $(".runtime").text().replace("Duration : ", "").trim();
const release = $(".country a").text().trim();
const genres = $(".sgeneros a").map((i, el) => $(el).text()).get();
const director = $("span.tagline:contains('Director') a").text();
const networks = $("span.tagline:contains('Networks') a").text();

// semua link episode

const servers = [];

$('#playeroptions ul').each((i, el) => {
  const serverTitle = $(el).find('.server_title').text().trim();

  $(el).find('li.dooplay_player_option').each((j, li) => {
    servers.push({
      server: serverTitle.replace(/\s+/g, ' ').trim(),
      name: $(li).find('.title').text().trim(),
      url: $(li).attr('data-url'),
      type: $(li).attr('data-type'),
      postId: $(li).attr('data-post'),
      num: $(li).attr('data-nume'),
    });
  });
});
const episodes = [];
$(".episodios li a").each((i, el) => {
  episodes.push({
    title: $(el).text(),
    url: $(el).attr("href"),
  });
});

// link download
const downloadLinks = [];
$("#download a").each((i, el) => {
  downloadLinks.push({
    text: $(el).text().trim(),
    url: $(el).attr("href"),
  });
});

// kumpulkan semua data
const result = {
  title,
  poster,
  imdb,
  duration,
  release,
  genres,
  director,
  networks,
  episodes,
  downloadLinks,
  servers
};

return result;

},
SearchApik: async(search)=>{
  const response = await axios.get(`https://filmapik.channel/?s=${search}`,{
    timeout: 10000,
  });
  
  const html = await response.data
  const $ = cheerio.load(html);
  const data = [];

 $('.result-item').each((i, el) => {
  let title = $(el).find('.title a').text().trim();
  let detailUrl = title.replace('Nonton Film', '').replace('Subtitle Indonesia', '');
  const poster = $(el).find('img').attr('src');

  // Ambil isi <span> seperti "MoviesIMDb 5.5" atau "TV-ShowsTMDb 8END"
  const spanText = $(el).find('span').text().trim();

  let type = '';
  let rating = '';
  let status = '';

  if (spanText.includes('IMDb')) {
    // Format: MoviesIMDb 5.5
    type = spanText.split('IMDb')[0].trim(); // "Movies"
    rating = spanText.replace(/.*IMDb\s*/i, '').trim(); // "5.5"
  } else if (spanText.includes('TMDb')) {
    // Format: TV-ShowsTMDb 8END
    type = spanText.split('TMDb')[0].trim(); // "TV-Shows"
    const match = spanText.match(/TMDb\s*([\d.]+)([A-Za-z]*)/);
    if (match) {
      rating = match[1]; // "8"
      status = match[2]; // "END"
    }
  }

  let synopsis = $(el).find('.contenido p').text().replace('ALUR CERITA :', '').trim();
  synopsis = synopsis.replace('–', '').replace('ULASAN :', '');

  data.push({
    title,
    detailUrl,
    poster,
    type,
    rating,
    status,
    source: 'filmapik',
    synopsis,
  });
});

  return data;


}



}

module.exports = {filmApik}