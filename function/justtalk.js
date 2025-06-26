const cheerio = require('cheerio')
const api = "https://www.mikelevylaw.com"

const justtalk= {
    Movies:async(page)=>{
        let movies = []
        const response = await fetch(`${api}/page/${page}`)
        const data = await response.text()
    const $ = cheerio.load(data)
    
    $('.gmr-item-modulepost').each((i, el) => {
      const moviesTitle = $(el).find('h2.entry-title a').text().trim();
      const posterUrls = $(el).find('img.wp-post-image').attr('src');

      if (moviesTitle && posterUrls) {
        movies.push({ moviesTitle, posterUrls });
      }
    });

    // console.log(result);
    return movies
  

    },

    latestMovies:async(page=1)=>{
        let movies = []
        const response = await fetch(`${api}/page/${page}`)
        const data = await response.text()
    const $ = cheerio.load(data)
       const articles = $('#gmr-main-load article');

    articles.each((i, article) => {
      const titleTag = $(article).find('h2.entry-title a');
      const imgTag = $(article).find('img.wp-post-image');

      const title = titleTag.text().trim() || 'N/A';
      const poster = imgTag.attr('src') || 'N/A';
      movies.push({
        moviesTitle:title,
        posterUrls:poster
      })



    //   console.log(`Title: ${title}`);
    //   console.log(`Poster: ${poster}`);
    //   console.log('---');
    });

        return movies
    },
    search:async(query)=>{
        const response = await fetch(`${api}/?s=${query}&post_type%5B%5D=post&post_type%5B%5D=tv`)
        const data = await response.text()
  const $ = cheerio.load(data)
  const movies = [];
  
  $('#gmr-main-load article').each((i, el) => {
            const title = $(el).find('.entry-title a').text().trim();
            const link = $(el).find('.entry-title a').attr('href');
            const image = $(el).find('.content-thumbnail a img').attr('src');
            const rating = $(el).find('.gmr-rating-item').text().trim();
            const duration = $(el).find('.gmr-duration-item').text().trim();
            const quality = $(el).find('.gmr-quality-item a').text().trim();
            const genres = [];
            console.log(title)
            $(el).find('.gmr-movie-on a[rel="category tag"]').each((i, g) => {
                genres.push($(g).text().trim());
            });
            const country = $(el).find('.gmr-movie-on span[itemprop="contentLocation"] a').text().trim();
    
            movies.push({
                title,
                // link,
                image,
                rating,
                duration,
                quality,
                genres,
                source:'justtalk',
                country
            });
        });
        return movies
    
        // console.log(movies)
      
        // console.log(data)
    }   ,

    streaming:async(slug,player=1)=>{
        const cleanedSlug = slug.toLowerCase()
  .replace(/\s*\((\d{4})\)/, '-$1')    // ganti (2023) jadi -2023
  .replace(/\s+/g, '-')                // ganti spasi dengan tanda -
  .replace(/[^a-z0-9\-]/g, '');        // hilangkan semua kecuali huruf, angka, dan tanda minus// hilangkan karakter selain huruf, angka, dan -
        const response = await fetch(`${api}/${cleanedSlug}/?player=${player}`)
        const data = await response.text()
        const $ = cheerio.load(data)
        const streamUrl = $('.gmr-embed-responsive iframe').attr('src');
        
// Ambil data
const title = $('.gmr-movie-data-top .entry-title').text().trim();
const ratingValue = $('[itemprop="ratingValue"]').text().trim();
const ratingCount = $('[itemprop="ratingCount"]').text().trim();
const description = $('.entry-content.entry-content-single p').first().text().trim();
const author = $('.entry-author [itemprop="name"]').text().trim();
const postDate = $('.entry-date.published').text().trim();

const genre = [];
$('.gmr-moviedata strong:contains("Genre:")').nextAll('a').each((i, el) => {
    genre.push($(el).text().trim());
});

const year = $('.gmr-moviedata strong:contains("Year:")').next('a').text().trim();
const duration = $('.gmr-moviedata strong:contains("Duration:")').next().text().trim();
const country = $('.gmr-moviedata strong:contains("Country:")').next().text().trim();
const release = $('.gmr-moviedata strong:contains("Release:")').next().text().trim();
const language = $('.gmr-moviedata strong:contains("Language:")').next().text().trim();
const director = $('.gmr-moviedata strong:contains("Director:")').next().text().trim();

const cast = [];
$('.gmr-moviedata strong:contains("Cast:")').nextAll('[itemprop="name"]').each((i, el) => {
    cast.push($(el).text().trim());
});

// Gabung semua data ke dalam objek
const movieData = {
    title,
    rating: {
        value: ratingValue,
        votes: ratingCount
    },
    description,
    author,
    postDate,
    genre,
    year,
    duration,
    country,
    release,
    language,
    director,
    cast,
    streamUrl,
    
};

console.log(movieData);
return movieData
// console.log('Stream URL:', streamUrl);


        

    }
}

// justtalk.streaming('dont-mess-with-grandma')


// justtalk.search('dont-mess-with-grandma')
module.exports = {justtalk}
