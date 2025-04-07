// import * as cheerio from 'cheerio';

// const response = await fetch('https://tv2.lk21official.cc')
// const html = await response.text()
// const $ = cheerio.load(html)
// const newest_title = $('#newest').find('h3.caption').text()


// // newest_title.map((t)=>{
// //     console.log(t)
// // })
const axios = require('axios')
const cheerio = require('cheerio')

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
 
const lk21 = {
  api: {
    base: "https://tv10.lk21official.life",
    download: "https://dl.lk21.party",
    endpoints: {
      search: "/search.php?s={query}",
      download: {
        page: "/get/{slug}",
        verify: "/verifying.php?slug={slug}"
      }
    },
    headers: {
      'Upgrade-Insecure-Requests': '1',
      'User-Agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/132.0.0.0 Mobile Safari/537.36',
      'Referer':'https://tv10.lk21official.life',

    }
  },
 
  c: (title) => {
    return title.replace('LK21 NONTON ', '').trim();
  },
 
  fix: (url) => {
    if (!url) return '';
    return url.startsWith('//') ? `https:${url}` : url;
  },
 
  isValid: (url) => {
    try {
      return url.startsWith(lk21.api.base);
    } catch {
      return false;
    }
  },
 
  search: async (query) => {
    if (!query?.trim()) {
      return {
        status: false,
        code: 400,
        result: {
          error: "Querynya mana? lu mau nyari film kan? Yaa input judul filmnya lah kocak 🗿."
        }
      };
    }
 
    try {
      const s = `${lk21.api.base}${lk21.api.endpoints.search}`.replace('{query}', encodeURIComponent(query));
      const response = await axios.get(s, {
        headers: lk21.api.headers
      });
      
      const $ = cheerio.load(response.data);
      const results = [];
 
      $('.search-item').each((i, el) => {
        try {
          const $el = $(el);
          const $content = $el.find('.search-content');
          const $poster = $el.find('.search-poster');
          const $link = $content.find('h3 a');
 
          if (!$link.length) return;
 
          const mv = $link.attr('href') || '';
          const title = lk21.c($link.text().trim());
 
          if (!mv || 
              mv.includes('/director/') || 
              title.toLowerCase().includes('series') ||
              mv.includes('/series/')) {
            return;
          }
 
          let thumbnail = $poster.find('img').attr('src') || '';
          thumbnail = lk21.fix(thumbnail);
 
          const link = mv.startsWith('http') ? mv : lk21.api.base + mv;
 
          const metadata = {};
          $content.find('p').each((i, p) => {
            const $p = $(p);
            const text = $p.text().trim();
            
            if (text.toLowerCase().includes('series')) return;
 
            if (text.includes('Genres')) {
              metadata.genres = text.replace('Genres:', '').trim();
            } else if (text.includes('Negara')) {
              metadata.country = text.replace('Negara:', '').trim();
            } else if (text.includes('Rating')) {
              metadata.rating = text.replace('Rating:', '').trim();
            } else if (text.includes('Kualitas')) {
              metadata.quality = text.replace('Kualitas:', '').trim();
            } else if (text.includes('Tahun')) {
              metadata.year = text.replace('Tahun:', '').trim();
            }
          });
 
          const isSeries = Object.values(metadata).some(value => 
            value.toLowerCase().includes('series') || 
            value.toLowerCase().includes('season') ||
            value.toLowerCase().includes('episode')
          );
 
          if (isSeries) return;
 
          results.push({
            title,
            url: link,
            thumbnail,
            ...metadata
          });
 
        } catch (error) {
          console.error(error);
        }
      });
 
      if (results.length === 0) {
        return {
          status: false,
          code: 404,
          result: {
            error: `Film dengan judul "${query}" kagak ada bree di lk21 .. belum diupload keknya 😂`
          }
        };
      }
 
      return {
        status: true,
        code: 200,
        result: {
          query,
          total: results.length,
          movies: results
        }
      };
 
    } catch (error) {
      return {
        status: false,
        code: error.response?.status || 500,
        result: {
          error: "Waduh error bree.. coba lagi nanti yak 👍"
        }
      };
    }
  },
 
  details: async (url) => {
    if (!url?.trim()) {
      return {
        status: false,
        code: 400,
        result: {
          error: "Linknya mana??? Mau ngambil link download film dari lk21 kan?? Yaa iyaa mana link nya 🙈"
        }
      };
    }
 
    if (!lk21.isValid(url)) {
      return {
        status: false,
        code: 400,
        result: {
          error: "Linknya kagak valid bree, pastiin lagi bree kalo link nya dari lk21 yak 👍🏻"
        }
      };
    }
 
    try {
      const response = await axios.get(url, {
        headers: lk21.api.headers
      });
      
      const $ = cheerio.load(response.data);
      const slug = url.split('/').filter(Boolean).pop();
 
      const movieInfo = {
        title: lk21.c($('.social h1').text().trim()),
        poster: lk21.fix($('.content-poster img').attr('src')),
        quality: $('.toggle-more h3 a[href*="/quality/"]').text().trim(),
        country: $('.toggle-more h3 a[href*="/country/"]').text().trim().split(/(?=[A-Z])/).join(', '),
        cast: [],
        director: [],
        genre: [],
        rating: '',
        duration: '',
        releaseDate: '',
        synopsis: '',
        budget: '',
        worldwideGross: '',
        soundtrack: '',
        imdbId: '',
        streaming: [],
        dlink: []
      };
 
      $('.toggle-more .content div').each((i, el) => {
        const $el = $(el);
        const label = $el.find('h2').text().trim().toLowerCase();
        
        switch(label) {
          case 'bintang film':
            $el.find('h3 a').each((i, actor) => {
              movieInfo.cast.push($(actor).text().trim());
            });
            break;
          case 'sutradara':
            $el.find('h3 a').each((i, director) => {
              movieInfo.director.push($(director).text().trim());
            });
            break;
          case 'genre':
            $el.find('h3 a').each((i, genre) => {
              movieInfo.genre.push($(genre).text().trim());
            });
            break;
          case 'imdb':
            const ratingText = $el.find('h3').first().text().trim();
            movieInfo.rating = ratingText.split('/')[0].trim();
            break;
          case 'durasi':
            movieInfo.duration = $el.find('h3').text().trim();
            break;
          case 'diterbitkan':
            movieInfo.releaseDate = $el.find('h3').text().trim();
            break;
        }
      });
 
      const fullText = $('blockquote').text()
        .replace('Synopsis', '')
        .replace(/\s+/g, ' ')
        .replace(movieInfo.title, '')
        .trim();
 
      const bajet = fullText.match(/Budget:\s*(.*?)(?=Worldwide|$)/i);
      const gros = fullText.match(/Worldwide Gross:\s*(.*?)(?=Soundtrack|$)/i);
      const sountrek = fullText.match(/Soundtrack:\s*([^)]+\))/i);
      const releaseDates = fullText.match(/(\d{1,2}\s+[A-Za-z]+\s+\d{4}.*?)(?=tt\d+|$)/i);
      const imdb = fullText.match(/(tt\d+)/i);
 
      movieInfo.synopsis = fullText
        .replace(/Budget:.*$/, '')
        .replace(/Worldwide Gross:.*$/, '')
        .replace(/Soundtrack:.*$/, '')
        .replace(/\d{1,2}\s+[A-Za-z]+\s+\d{4}.*$/, '')
        .replace(/tt\d+/, '')
        .trim();
 
      movieInfo.budget = bajet ? bajet[1].trim() : '';
      movieInfo.worldwideGross = gros ? gros[1].trim() : '';
      movieInfo.soundtrack = sountrek ? sountrek[1].trim() : '';
      movieInfo.releaseDate = releaseDates ? releaseDates[1].trim() : '';
      movieInfo.imdbId = imdb ? imdb[1].trim() : '';
 
      await delay(1000);
      const links = await lk21.getDlink(slug);
      
      if (links.status) {
        movieInfo.streaming = links.result.streaming;
        movieInfo.dlink = links.result.download;
      }
 
      return {
        status: true,
        code: 200,
        result: {
          movie: movieInfo
        }
      };
 
    } catch (error) {
      return {
        status: false,
        code: error.response?.status || 500,
        result: {
          error: "Waduh error bree.. kayaknya filmnya belom ada di lk21 deh.. coba cari yang laen 😅"
        }
      };
    }
  },
 
  getDlink: async (slug) => {
    if (!slug?.trim()) {
      return {
        status: false,
        code: 400,
        result: {
          error: "Slugnya kagak valid bree.. Coba dah liat lagi slug webnya.. dah bener apa kagak 🗿"
        }
      };
    }
 
    try {
      const linx = `${lk21.api.download}${lk21.api.endpoints.download.page}`.replace('{slug}', slug);
      const response = await axios.get(linx, {
        headers: lk21.api.headers
      });
 
      const $ = cheerio.load(response.data);
      const scripts = $('script').get();
      let value = null;
 
      for (const script of scripts) {
        const sc = $(script).html() || '';
        const match = sc.match(/setCookie\('validate',\s*'([^']+)'/);
        if (match && match[1]) {
          value = match[1];
          break;
        }
      }
 
      if (!value) {
        throw new Error('Validate Valuenya kagak ketemu.. Kalo bisa mah coba lagi nanti yah.. ');
      }
      
      await delay(1000);
      const verify = await axios.post(
        `${lk21.api.download}${lk21.api.endpoints.download.verify}`.replace('{slug}', slug),
        new URLSearchParams({
          slug: slug
        }).toString(),
        {
          headers: {
            ...lk21.api.headers,
            'Cookie': `validate=${value}`,
            'Content-Type': 'application/x-www-form-urlencoded',
            'X-Requested-With': 'XMLHttpRequest',
            'Origin': lk21.api.download,
            'Referer': linx
          }
        }
      );
 
      const $verify = cheerio.load(verify.data);
      const dlink = [];
      const streamLink = [];
 
      $verify('a[href*="//"]').each((i, el) => {
        const $link = $verify(el);
        const url = $link.attr('href');
        const text = $link.text().trim();
 
        if (!url) return;
        
        const obj = new URL(url);
        const provider = obj.hostname.split('.')[0].toUpperCase();
        const quality = text.match(/\b\d+p\b/i)?.[0] || '';
 
        const datax = {
          provider,
          url
        };
 
        if (url.includes('lk21.de')) {
          streamLink.push(datax);
        } else {
          dlink.push(datax);
        }
      });
 
      if (dlink.length === 0 && streamLink.length === 0) {
        return {
          status: false,
          code: 404,
          result: {
            error: "Belum ada link download ama link streaming buat film ini bree 🙃"
          }
        };
      }
 
      return {
        status: true,
        code: 200,
        result: {
          streaming: streamLink,
          download: dlink
        }
      };
 
    } catch (error) {
      return {
        status: false,
        code: error.response?.status || 500,
        result: {
          error: "Waduh error bree.. coba lagi nanti yak.. server lagi sibuk kali 😅"
        }
      };
    }
  },

  getTopMovie: async(page)=>{
    try {
      const response = await fetch(`https://tv10.lk21official.life/top-movie-today/page/${page}`);
      const html = await response.text();
      const $ = cheerio.load(html);
      
      // Ambil semua teks dari <script> dalam <article>
      const scriptsText = $('article script').map((i, el) => $(el).text().trim()).get();
      
      // Proses hanya yang valid JSON
      const scriptsJSON = scriptsText.map(text => {
          try {
              // Ambil hanya bagian JSON dengan regex
              const match = text.match(/\{.*\}/s);
              if (match) {
                  return JSON.parse(match[0].replace(/[\u0000-\u001F]+/g, '')); // Hapus karakter kontrol
              }
          } catch (error) {
              console.error('Error parsing JSON:', error);
          }
          return null;
      }).filter(Boolean); // Hapus nilai `null`
      
      return scriptsJSON
      
    }catch{

    }

  },
  getLatestMovie: async(page)=>{
    try {
      const response = await fetch(`https://tv10.lk21official.life/latest/page/${page}`);
      const html = await response.text();
      const $ = cheerio.load(html);
      
      // Ambil semua teks dari <script> dalam <article>
      const scriptsText = $('article script').map((i, el) => $(el).text().trim()).get();
      
      // Proses hanya yang valid JSON
      const scriptsJSON = scriptsText.map(text => {
          try {
              // Ambil hanya bagian JSON dengan regex
              const match = text.match(/\{.*\}/s);
              if (match) {
                  return JSON.parse(match[0].replace(/[\u0000-\u001F]+/g, '')); // Hapus karakter kontrol
              }
          } catch (error) {
              console.error('Error parsing JSON:', error);
          }
          return null;
      }).filter(Boolean); // Hapus nilai `null`
      
      return scriptsJSON
      
    }catch{

    }

  },

  getPopularMovie: async(page)=>{
    try {
      const response = await fetch(`https://tv10.lk21official.life/populer/page/${page}`,
        {
          headers: lk21.api.headers
        }
      );
      const html = await response.text();
      const $ = cheerio.load(html);
      
      // Ambil semua teks dari <script> dalam <article>
      const scriptsText = $('article script').map((i, el) => $(el).text().trim()).get();
      
      // Proses hanya yang valid JSON
      const scriptsJSON = scriptsText.map(text => {
          try {
              // Ambil hanya bagian JSON dengan regex
              const match = text.match(/\{.*\}/s);
              if (match) {
                  return JSON.parse(match[0].replace(/[\u0000-\u001F]+/g, '')); // Hapus karakter kontrol
              }
          } catch (error) {
              console.error('Error parsing JSON:', error);
          }
          return null;
      }).filter(Boolean); // Hapus nilai `null`
      
      return scriptsJSON
      
    }catch{

    }

  }

};



const filmApik = {
BoxOfficeApik:async(page)=>{
  const response = await fetch(`https://filmapik.now/category/box-office/page/${page}`)
  const html = await response.text()
  const $ = cheerio.load(html)
  const posterUrls = [];
  const moviesTitle  = []
  const moviesRating  = []
$('article.item.movies').each((i, el) => {
  const poster = $(el).find('img').attr('src');
  const rating = $(el).find('div.rating').text()
  const title = $(el).find('h3 a').text(); // atau pakai .attr('title') untuk full title
  posterUrls.push(poster)
  moviesTitle.push(title)
  moviesRating.push(rating)
});

// console.log(moviesRating)
return {
  posterUrls,
  moviesTitle,
  moviesRating
}



},
DownloadApik: async()=>{

  const response = await fetch(`https://filmapik.now/${slug}/play`)
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
  return links


}


}


//  filmApik.SearchApik(1)
module.exports = {filmApik}