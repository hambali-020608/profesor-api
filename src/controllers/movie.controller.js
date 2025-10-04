const { filmApik } = require("../services/movie.service");

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
    const data = await filmApik.DownloadApik(slug)
    res.json(data)
   
};

exports.filmApikSearch = async (req, res) => {
   const query = req.query.q
    const data = await filmApik.SearchApik(query)
    res.json(data)
   
};
