
const { justtalk } = require("../services/movie.service");
exports.justtalkLatest = async(req,res)=>{
    const page = req.query.page
    const data = await justtalk.latestMovies(page)
    res.json(data)


}
exports.justtalkMovies = async(req,res)=>{
  
  const page = req.query.page
    const data = await justtalk.Movies(page)
    res.json(data)

}
exports.justtalkStreaming = async(req,res)=>{
     const slug = req.query.slug
    console.log(slug)
    const data = await justtalk.streaming(slug)
    res.json(data)

}
exports.justtalkSearch = async(req,res)=>{
    const query = req.query.q
    const data = await justtalk.search(query)
    res.json(data)

}

