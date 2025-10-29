


const { Ddownr,ssVid } = require("../services/youtube.service");
const ddownr = new Ddownr()

exports.Ddownr_metadata = async (req, res) => {
  try {
    const url = req.query.url;
    const format = req.query.format;
    if (!url || !format) {
      return res.status(400).json({ status: 400, message: "url dan format wajib diisi" });
    }

    const data = await ddownr.getInfo(url, format);
    res.json({ status: 200, data });
  } catch (error) {
    res.status(500).json({ status: 500, message: error.message });
  }
};

exports.Ddownr_download = async (req, res) => {
  try {
    const progress_url = req.query.progress_url;
    if (!progress_url) {
      return res.status(400).json({ status: 400, message: "progress_url wajib diisi" });
    }

    const data = await ddownr.download(progress_url);
    res.json({ status: 200, data });
  } catch (error) {
    res.status(500).json({ status: 500, message: error.message });
  }
};


exports.ssvid = async(req,res)=>{
  try{
    const url = req.query.url
    const format = req.query.format
   const data = await ssVid.download(url,format)
    res.json({status:200,data})
    
    
  }catch(error){

    
    res.status(500).json({ status: 500, message: error.message });
  }
}