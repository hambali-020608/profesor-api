const axios = require('axios')

class Ddownr {
    
    async Progress(progress_url){
    try {
        let progress = await axios.get(progress_url)
        while(progress.data.success < 1){
            await new Promise(resolve => setTimeout(resolve, 1000))
            progress = await axios.get(progress_url)
        }
        return progress.data
    } catch (err) {
        throw new Error("Gagal fetch progress: " + err.message)
    }
}

    async getInfo(url,format){
        const baseurl = `https://p.savenow.to/ajax/download.php?copyright=0&format=${format}&url=${url}&api=dfcb6d76f2f6a9894gjkege8a4ab232222`
        const request = await axios.get(baseurl)
        return request.data
    }

    async download(progress_url){
        const downloadResult = await this.Progress(progress_url)
        return {
        downloadResult
        }
    }
}

/*
  ada cf, skrep not work
  base   : https://ssvid.net/
  update : 9 september 2025
  note   : bisa langsung masukin url youtube
           atau query di dalam fungsi .download
           format tersedia : mp3, 360p, 720p, 1080p
  node   : v24.5.0
  by     : wolep
*/
 
const ssVid = {
    get baseUrl() {
        return {
            origin: 'https://ssvid.net'
        }
    },
 
    get baseHeaders() {
        return {
            'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
            'origin': this.baseUrl.origin,
            'referer': this.baseUrl.origin + '/youtube-to-mp3'
        }
    },
 
    validateFormat: function (userFormat) {
        const validFormat = ['mp3', '360p', '720p', '1080p']
        if (!validFormat.includes(userFormat)) throw Error(`invalid format!. available formats: ${validFormat.join(', ')}`)
    },
 
    handleFormat: function (userFormat, searchJson) {
        this.validateFormat(userFormat)
        let result
        if (userFormat == 'mp3') {
            result = searchJson.links?.mp3?.mp3128?.k
        } else {
            let selectedFormat
            const allFormats = Object.entries(searchJson.links.mp4)
 
            const quality = allFormats.map(v => v[1].q).filter(v => /\d+p/.test(v)).map(v => parseInt(v)).sort((a, b) => b - a).map(v => v + 'p')
            if (!quality.includes(userFormat)) {
                selectedFormat = quality[0]
                console.log(`format ${userFormat} gak ada. auto fallback ke best available yaitu ${selectedFormat}`)
            } else {
                selectedFormat = userFormat
            }
            const find = allFormats.find(v => v[1].q == selectedFormat)
            result = find?.[1]?.k
        }
        if (!result) throw Error(`${userFormat} gak ada cuy. aneh`)
        return result
    },
 
    hit: async function (path, payload) {
        try {
            const body = new URLSearchParams(payload)
            const opts = { headers: this.baseHeaders, body, 'method': 'post' }
            const r = await fetch(`${this.baseUrl.origin}${path}`, opts)
            console.log('hit', path)
            if (!r.ok) throw Error(`${r.status} ${r.statusText}\n${await r.text()}`)
            const j = await r.json()
            return j
        } catch (e) {
            throw Error(`${path}\n${e.message}`)
        }
    },
 
    download: async function (queryOrYtUrl, userFormat = 'mp3') {
        this.validateFormat(userFormat)
 
        // first hit
        let search
        search = await this.hit('/api/ajax/search', {
            "query": queryOrYtUrl,
            "cf_token": "",
            "vt": "youtube"
        })
 
        if (search.p == 'search') {
            if (!search?.items?.length) throw Error(`hasil pencarian ${queryOrYtUrl} tidak ada`)
            const { v, t } = search.items[0]
            const videoUrl = 'https://www.youtube.com/watch?v=' + v
            console.log(`[found]\ntitle : ${t}\nurl   : ${videoUrl}`)
 
            // first hit again...
            search = await this.hit('/api/ajax/search', {
                "query": videoUrl,
                "cf_token": "",
                "vt": "youtube"
            })
 
        }
 
        const vid = search.vid
        const k = this.handleFormat(userFormat, search)
 
        // second hit
        const convert = await this.hit('/api/ajax/convert', {
            k, vid
        })
 
        if (convert.c_status == 'CONVERTING') {
            let convert2
            const limit = 5
            let attempt = 0
            do {
                attempt++
                // third hit
                console.log (`cek convert ${attempt}/${limit}`)
                convert2 = await this.hit('/api/convert/check?hl=en', {
                    vid,
                    b_id: convert.b_id
                })
                if (convert2.c_status == 'CONVERTED') {
                    return convert2
                }
                await new Promise(re => setTimeout(re, 5000))
            } while (attempt < limit && convert2.c_status == 'CONVERTING')
            throw Error('file belum siap / status belum di ketahui')
 
        } else {
            return convert
        }
    },
 
}
 
// cara pakai
// yt.download("https://youtu.be/vOh2rSH9hEE?si=-eB_xbdM3HNwpK9E", "720p")
//     .then(console.log)
//     .catch(e => {
//         console.log(e.message)
//     })
 

module.exports = { Ddownr,ssVid }
