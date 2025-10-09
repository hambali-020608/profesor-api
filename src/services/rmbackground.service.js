/**
 * CR Ponta Sensei
 * CH https://whatsapp.com/channel/0029VagslooA89MdSX0d1X1z
 * WEB https://codeteam.my.id
**/
const axios = require('axios')

async function removeBg(fileUpload) {
  try {
    const form = new FormData()

    

form.append("file", fileUpload)

    const res = await axios.post("https://removebg.one/api/predict/v2", form, {
      headers: {
        ...form.getHeaders(),
        "accept": "application/json, text/plain, */*",
        "locale": "en-US",
        "platform": "PC",
        "product": "REMOVEBG",
        "sec-ch-ua": "\"Chromium\";v=\"127\", \"Not)A;Brand\";v=\"99\", \"Microsoft Edge Simulate\";v=\"127\", \"Lemur\";v=\"127\"",
        "sec-ch-ua-mobile": "?1",
        "sec-ch-ua-platform": "\"Android\"",
        "Referer": "https://removebg.one/upload"
      }
    })
    return res.data
  } catch (e) {
    console.error("❌ Gagal:", e.message)
  }
}
module.exports = {removeBg}