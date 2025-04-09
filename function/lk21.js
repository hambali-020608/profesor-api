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
TrendingApik:async(page)=>{
  const response = await fetch(`https://filmapik.now/trending-2/page/${page}`)
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


 module.exports = {filmApik}