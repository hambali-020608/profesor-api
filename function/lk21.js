// import * as cheerio from 'cheerio';
const cheerio = require('cheerio')

// const response = await fetch('https://tv2.lk21official.cc')
// const html = await response.text()
// const $ = cheerio.load(html)
// const newest_title = $('#newest').find('h3.caption').text()


// // newest_title.map((t)=>{
// //     console.log(t)
// // })


const filmApik = {
  BoxOfficeApik: async (page) => {
    const data = [];
    const response = await fetch(`https://filmapik.now/category/box-office/page/${page}`);
    const html = await response.text();
    const $ = cheerio.load(html);
  
    $('article.item.movies').each((i, el) => {
      const poster = $(el).find('img').attr('src');
      const rating = $(el).find('div.rating').text();
      const title = $(el).find('h3 a').text();
      
      data.push({
        posterUrls: poster,
        moviesTitle: title,
        moviesRating: rating
      });
    });
  
    return { data };
  },
  TrendingApik: async (page) => {
    let data = [];
    const response = await fetch(`https://filmapik.now/trending-2/page/${page}`);
    const html = await response.text();
    const $ = cheerio.load(html);
    
    $('article.item.movies').each((i, el) => {
      const poster = $(el).find('img').attr('src');
      const rating = $(el).find('div.rating').text();
      const title = $(el).find('h3 a').text();
      
      data.push({
        posterUrls: poster,
        moviesTitle: title,
        moviesRating: rating
      });
    });
  
    return { data };
  },
  LatestApik: async (page) => {
    let data = [];
    const response = await fetch(`https://filmapik.now/latest/page/${page}`);
    const html = await response.text();
    const $ = cheerio.load(html);
    
    $('article.item.movies').each((i, el) => {
      const poster = $(el).find('img').attr('src');
      const rating = $(el).find('div.rating').text();
      const title = $(el).find('h3 a').text();
      
      data.push({
        posterUrls: poster,
        moviesTitle: title,
        moviesRating: rating
      });
    });
  
    return { data };
  },

DownloadApik: async(slug)=>{
  const cleanedSlug = slug.toLowerCase()
  .replace(/\s*\((\d{4})\)/, '-$1') // ganti (2023) jadi -2023
  .replace(/\s+/g, '-')             // ganti spasi dengan tanda -
  .replace(/[^a-z0-9\-]/g, '');     // hilangkan karakter selain huruf, angka, dan -
  const response = await fetch(`https://filmapik.now/nonton-film-${cleanedSlug}-subtitle-indonesia/play`)
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
    country,
    duration,
    quality,
    releaseYear,
    imdb,
    resolution,
    synopsis,
    links
  };


  // return links


},

SearchApik: async(search)=>{
  const response = await fetch(`https://filmapik.now/?s=${search}`);
  const html = await response.text();
  const $ = cheerio.load(html);
  const data = [];

  $('.result-item').each((i, el) => {
    const title = $(el).find('.title a').text().trim();
    let detailUrl = $(el).find('.title a').attr('href');
    detailUrl = detailUrl.replace('https://filmapik.now/nonton-film-'," ")
    detailUrl = detailUrl.replace('-subtitle-indonesia'," ")
    const poster = $(el).find('img').attr('src');
    const rating = $(el).find('.rating').text().replace('IMDb', '').trim();
    let synopsis = $(el).find('.contenido p').text().replace('ALUR CERITA :', '').trim();
    synopsis = synopsis.replace('–','')
    synopsis= synopsis.replace('ULASAN :','')
    data.push({
      title,
      detailUrl,
      poster,
      rating,
      synopsis,
    });
  });

  return data;


}

}



const layarDrama={
  
}
 module.exports = {filmApik}