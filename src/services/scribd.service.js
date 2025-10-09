import * as cheerio from 'cheerio'
import axios from 'axios';

const response = await fetch('https://scribdsdownloader.com/download/?url=https://id.scribd.com/document/590255664/Materi-Pemrograman-Dasar&scrape_data=Get+PDF')
async function getDownloadUrl() {
    const text = await response.text();
const $ = cheerio.load(text);
const script = $('script').filter((_, el) => $(el).html().includes('handleClick')).html()
const match = script.match(/handleClick\("([^"]+)"\)/)
console.log(match[1])
const res = await axios.get(match[1],{
    headers:{
        'User-Agent': 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36',
        'Referer':'https://compress-pdf.vietdreamhouse.com/'
    }
})
console.log(res.data)
// return match[1]
}


// async function getDynamicId(pageUrl) {
//   const res = await axios.get(pageUrl);
//   const html = res.data;
//   console.log(html)

//   // Cari ID dari script AJAX
//   const match = html.match('data: "{[^"]+}"');
//   console.log(match)
//   if (match) {
//     return match[1];
//   }
//   throw new Error("ID tidak ditemukan di HTML.");
// }
// const checkUrl = "https://compress-pdf.vietdreamhouse.com/check-status";
// const url = await getDownloadUrl()
// console.log(res.data)

getDownloadUrl()
// const $ = cheerio.load(url)


// console.log(url)

// const dynamicId = await getDynamicId(url);
// console.log(dynamicId)



