const express = require("express");
const router = express.Router();
const yts = require( 'yt-search' );
const { spotidown, SpotifyDown } = require('../function/spotify');
const { ytdl } = require('../function/youtube');
const { ddownr } = require('../function/ddownr');
const { downloadSpotify } = require('../function/spotiLink')
const path = require('path')
const {islamai}= require('../function/muslimAi')
const {clipto} = require('../function/youtubeDown')
const {sstik} = require('../function/tiktok')
// Simulasi data produk
// API Endpoint: Mendapatkan semua produk
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

// search spotify
router.get('/api/spotify/search',async(req,res)=>{
const spotiyUrl= req.query.search
const downloadSpotify = new SpotifyDown(spotiyUrl)
await downloadSpotify.download()
res.json(downloadSpotify.metadata)
})
// download spotify
router.get('/api/spotify/download',async(req,res)=>{
const spotiyUrl= req.query.url
const music = await downloadSpotify(spotiyUrl)
res.json(music)


})

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

module.exports = router;
