const axios = require("axios");




async function Spotimp3(url) {
  try {
    // Step 1: Ambil detail lagu
    const resSongDetail = await axios.get(
      `https://spotmp3.app/api/song-details?url=${encodeURIComponent(url)}`,
      {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Mobile Safari/537.36",
          Referer: "https://spotmp3.app/",
        },
        timeout: 20000,
      }
    );

    // console.log("Song Detail:", resSongDetail.data);

    // Step 2: Request download
    const resDownload = await axios.post(
      "https://spotmp3.app/api/download",
      { url }, // body (JSON)
      {
        responseType: "arraybuffer",
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Mobile Safari/537.36",
          Referer: "https://spotmp3.app/",
          "Content-Type": "application/json",
        },
        timeout: 20000,
      }
    );

    // console.log("Download Info:", resDownload.data);

    return{
      status: true,
      data:{
        detailSongs: resSongDetail.data,
        downloadBinary: resDownload.data
      }
    }
  } catch (err) {
    console.error("Axios error:", err.message);
  }
}

// Spotimp3("https://open.spotify.com/track/26KhLgFuPymkm1uiZkc6Rv")
module.exports = { Spotimp3 };

