const {Spotimp3} = require("../services/spotify.service");

exports.spotidetail = async (req, res, next) => {
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

  
}
exports.spotidownload = async (req, res, next) => {
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
    music.pipe(res);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
}
