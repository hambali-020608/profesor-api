const cheerio = require('cheerio')

const layarDrama = {

    api:{
        base:'https://layardrama21.club'
    },
    SearchMovies:async(slug)=>{
        const request = await fetch(`https://layardrama21.club/?s=${slug}&post_type%5B%5D=post&post_type%5B%5D=tv`) 
        const data = await request.text()
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
            $(el).find('.gmr-movie-on a[rel="category tag"]').each((i, g) => {
                genres.push($(g).text().trim());
            });
            const country = $(el).find('.gmr-movie-on span[itemprop="contentLocation"] a').text().trim();
    
            movies.push({
                title,
                link,
                image,
                rating,
                duration,
                quality,
                genres,
                country
            });
        });
    
        return movies
        // console.log(data)
        
    },
    StreamMovies:async(slug)=>{
        const request = await fetch(`https://layardrama21.club/${slug}`) 
        const data = await request.text()
        const $ = cheerio.load(data)
        const movies = [];



    }
    




}

// layarDrama.SearchMovies('deadpool')
module.exports ={layarDrama}

