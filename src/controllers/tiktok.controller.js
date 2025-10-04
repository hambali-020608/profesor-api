
const { sstik } = require("../services/tiktok.service");
exports.sstik = async(req,res)=>{
    const url = req.query.url
    const data = await sstik(url)
    res.json({status:200,data})


}