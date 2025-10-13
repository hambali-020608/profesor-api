
const { RecapioClient } = require("../services/youtubesummarizer.service");
exports.recapio = async(req,res)=>{
    const url = req.query.url
    const urlObj = new URL(url);
    urlObj.search = ""; // hapus query params
    
const cleanUrl = urlObj.toString()
    const recapio = new RecapioClient(cleanUrl)
      const videoData = await recapio.start();
//   console.log("Info Video:", videoData);

  const summary = await recapio.sendMessage(
    "Extract the most important bullet points from this video, organized in a clear, structured format.",
  );
const data = {
    video_info:videoData,
     summary   
}

    res.json({status:200,data})


}