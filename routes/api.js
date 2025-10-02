const express = require("express");
const router = express.Router();
const {Spotimp3} = require('../function/spotify')
const yts = require( 'yt-search' );
// const {layarDrama} = require('../function/layardrama')
const {justtalk} = require('../function/justtalk')

const { SpotifyDown } = require('../function/spotify');
const { ytdl } = require('../function/youtube');
const { ddownr } = require('../function/ddownr');
const { downloadSpotify,spotiDown } = require('../function/spotiLink')
const {filmApik} = require('../function/lk21')
const path = require('path')
const {islamai}= require('../function/muslimAi')
const {clipto} = require('../function/youtubeDown')
const {sstik} = require('../function/tiktok')
const {savetube} = require('../function/savetube')
function slugify(str) {
  return decodeURIComponent(str)        // ubah %20 jadi spasi, dll
    .replace(/\((\d{4})\)/, '-$1')      // ubah (2024) → -2024
    .replace(/&/g, '')                  // hilangkan &
    .replace(/\s+/g, '-')               // ganti semua spasi jadi -
    .replace(/[^a-z0-9\-]/gi, '')       // hapus semua karakter aneh
    .replace(/-+/g, '-')                // gabungkan double/triple - jadi satu
    .replace(/^-|-$/g, '')              // hapus tanda - di awal/akhir
    .toLowerCase();                    // ubah jadi lowercase
}

router.get('/', async (req, res) => {
    res.send('halo')
});
router.get('/api/youtube/search', async (req, res) => {
    const videoUrl = req.query.q;
    const r = await yts(videoUrl)
    const videos = r.videos.slice( 0, 3 )
    res.json(videos)
});

// download ddownr
router.get('/api/youtube/v1/download',async(req,res)=>{
    const url = req.query.url
    const format = req.query.format
    const video = await ddownr.download(url,format)
    res.json(video)
})

// yttomp4 pro
router.get('/api/youtube/v2/download',async(req,res)=>{
    const url = req.query.url
    const video = await ytdl(url)
    res.json(video)
})
// clipto
router.get('/api/youtube/v3/download',async(req,res)=>{
    const url = req.query.url
    const video = await clipto(url)
    res.json(video)
})
router.get('/api/youtube/v4/download',async(req,res)=>{
    const url = req.query.url
    const format = req.query.format
    const video = await savetube.download(url,format)
    res.json(video)
})

// search spotify
router.get('/api/spotify/search',async(req,res)=>{
const spotiyUrl= req.query.search
const downloadSpotify = new SpotifyDown(spotiyUrl)
await downloadSpotify.download()
res.json(downloadSpotify.metadata)
})

// download spotify 2
router.get('/api/spotify/download',async(req,res)=>{
const spotiyUrl= req.query.url
const downloadSpotify = new SpotifyDown(spotiyUrl)
await downloadSpotify.downloadLink()
res.json(downloadSpotify.metadata)
})

// download spotify
router.get('/api/spotify/v1/download',async(req,res)=>{
const spotiyUrl= req.query.url
const music = await downloadSpotify(spotiyUrl)
res.json(music)


})
router.get('/api/spotify/v2/download',async(req,res)=>{
const spotiyUrl= req.query.url
const music = await spotiDown.download(spotiyUrl)
res.json(music)


})

router.get('/api/spotify/v3/download', async (req, res) => {
  try {
    const spotifyUrl = req.query.url;
    if (!spotifyUrl) {
      return res.status(400).json({ error: "Missing url parameter" });
    }

    const spotimp3 = new Spotimp3();
    const music = await spotimp3.download(spotifyUrl);
    const musicDetail = await spotimp3.getDetail(spotifyUrl);
    if (!music) {
      return res.status(500).json({ error: "Failed to download track" });
    }

    const title = Array.isArray(musicDetail) 
  ? musicDetail[0]?.title 
  : musicDetail.data?.[0]?.title || "track";

    res.setHeader("Content-Type", "audio/mpeg");
    res.setHeader("Content-Disposition", `attachment; filename=${title}.mp3`);
    return res.send(Buffer.from(music));
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
});

router.get('/api/spotify/v1/detail', async (req, res) => {
   try {
    const q = req.query.q;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    if (!q) {
      return res.status(400).json({ error: "Missing q parameter" });
    }

    const spotimp3 = new Spotimp3();
    const songsResult = await spotimp3.getDetail(q, page, limit);

    if (!songsResult) {
      return res.status(500).json({ error: "Failed to get song detail" });
    }

    return res.json(songsResult);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
});

// tiktok downloader 1
router.get('/api/tik-down/v1',async(req,res)=>{
    const url = req.query.url
    const data = await sstik(url)
    res.json({status:200,data})


})


// muslim ai
router.get('/api/muslimai',async(req,res)=>{
    const text = req.query.question
    const response = await islamai(text)
    res.json(response)


})

// movie downloader

router.get('/api/movies/v1/box-office',async(req,res)=>{
    const page = req.query.page
    const data = await filmApik.BoxOfficeApik(page)
    res.json(data)


})
router.get('/api/movies/v1/trending',async(req,res)=>{
    const page = req.query.page
    const data = await filmApik.TrendingApik(page)
    res.json(data)


})
router.get('/api/movies/v1/latest',async(req,res)=>{
    const page = req.query.page
    const data = await filmApik.LatestApik(page)
    res.json(data)


})
router.get('/api/movies/v1/download',async(req,res)=>{
    const slug = req.query.slug
    const data = await filmApik.DownloadApik(slug)
    res.json(data)
    
    
})
router.get('/api/movies/v1/search',async(req,res)=>{
    const query = req.query.q
    const data = await filmApik.SearchApik(query)
    res.json(data)
    
    
})
router.get('/api/movies/v2/latest',async(req,res)=>{
    const page = req.query.page
    const data = await justtalk.latestMovies(page)
    res.json(data)


})
router.get('/api/movies/v2/movies',async(req,res)=>{
    const page = req.query.page
    const data = await justtalk.Movies(page)
    res.json(data)


})
router.get('/api/movies/v2/streaming',async(req,res)=>{
    const slug = req.query.slug
    console.log(slug)
    const data = await justtalk.streaming(slug)
    res.json(data)


})
router.get('/api/movies/v2/search',async(req,res)=>{
    const query = req.query.q
    const data = await justtalk.search(query)
    res.json(data)


})


module.exports = router;
