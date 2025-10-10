const { filmApik } = require("../services/movie.service");
// import {request} from 'undici'
const {request} = require('undici');
exports.filmApikBox = async (req, res) => {
   const page = req.query.page
    const data = await filmApik.BoxOfficeApik(page)
    res.json(data)

};

exports.filmApikTrending = async (req, res) => {
const page = req.query.page
    const data = await filmApik.TrendingApik(page)
    res.json(data)

};

exports.filmApikLatest = async (req, res) => {
const page = req.query.page
    const data = await filmApik.LatestApik(page)
    res.json(data)  

};

exports.filmApikDownload = async (req, res) => {
   const slug = req.query.slug
   const type = req.query.type
    const data = await filmApik.DownloadApik(slug,type)
    // if(type !== "TV-Shows"){
    //         res
    // }
    res.json(data)
   
};

exports.filmApikStream = async (req, res) => {
     const { url } = req.query;
  if(!url) return res.status(400).send('Missing url');


  try {
     const { body, headers } = await request(url);
    res.setHeader('Content-Type', headers['content-type']);
    body.pipe(res);
  } catch(err) {
    res.status(500).send(err.message);
  }
}


exports.filmApikSearch = async (req, res) => {
   const query = req.query.q
    const data = await filmApik.SearchApik(query)
    res.json(data)
   
};
exports.filmApikDramaStream = async (req, res) => {
   const slug = req.query.slug
    const data = await filmApik.StreamingDrama(slug)
    res.json(data)
   
};
