/* base   : https://v1.yt1s.biz
   node   : vv24.5.0
   note   : bisa pilih quality, bisa download by
            search query. liat cara pakai.
            list quality :
            audio : 64kbps, 96kbps, 128kbps, 256kbps, 320kbps
            video : 144p, 240p, 360p, 480p, 720p, 1080p
            gw test download audio lofi
            10 jam 128kbps. auto ngasih
            url download bejir. ukuran
            file 500MB-an. cuma yg gw 
            tau ada rate limit. maksudnya
            url download nya di kasih
            hanya saja gak boleh spam
            fetch. tunggu aja limit nya
            hilang.. cek response headers
            untuk detailnya.
   by     : wolep
   update : 24 agustus 2025
*/
 
import crypto from "crypto"
 
const yt = {
 
    get baseUrl() {
        return {
            origin: 'https://v1.yt1s.biz'
        }
    },
 
    get baseHeaders() {
        return {
            "accept": "application/json, text/plain, */*",
            "accept-encoding": "gzip, deflate, br, zstd",
            "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36",
            'origin': this.baseUrl.origin
        }
    },
 
    validateString: function ( string, description) {
        if (typeof (string) !== 'string' || !string?.trim()?.length) throw Error(`${description} can't be empty`)
    },
 
    handleFormat: function (userFormat) {
        const validFormat = ['64kbps', '96kbps', '128kbps', '256kbps', '320kbps', '144p', '240p', '360p', '480p', '720p', '1080p']
        if (!validFormat.includes(userFormat)) throw Error(`your format is invalid! just pick one of these. ${validFormat.join(', ')}`)
        const path = /p$/.test(userFormat) ? '/video' : '/audio'
        const quality = userFormat.match(/\d+/)[0]
        return { path, quality }
    },
 
    hit: async function (description, url, opts, returnType = 'text') {
        try {
            const r = await fetch(url, opts)
            if (!r.ok) throw Error(`${r.status} ${r.statusText} ${await r.text() || 'empty response'}`)
            let data
            if (returnType == 'json') {
                data = r.json()
            } else if (returnType == 'text') {
                data = r.text()
            } else {
                throw Error('invalid return type')
            }
            return { data, headers: r.headers }
        } catch (e) {
            throw Error(`hit gagal. ${description}. ${e.message}`)
        }
    },
 
    search: async function (query) {
        this.validateString(query)
        const api = new URL('https://me0xn4hy3i.execute-api.us-east-1.amazonaws.com/staging/api/resolve/resolveYoutubeSearch')
        api.search = new URLSearchParams({
            'search': query
        })
        const { data: json } = await this.hit('search', api, null, 'json')
        return json
    },
 
    getSessionToken: async function () {
        const headers = this.baseHeaders
        const api = 'https://fast.dlsrv.online/'
        console.log('[getting session token]')
        const { headers: h } = await this.hit('get session', api, { headers })
        const result = h.get('x-session-token')
        if (!result) throw Error('session kosong!')
        return result
    },
 
    pow: function (session, path, startNonce = 0) {
        let nonce = startNonce
        let powHash = ''
        while (true) {
            const data = `${session}:${path}:${nonce}`
            powHash = crypto.createHash('SHA256').update(data).digest('hex')
            if (powHash.startsWith('0000')) {
                return {
                    'nonce': nonce.toString(),
                    'powHash': powHash
                }
            }
            nonce++
        }
    },
 
    apiSignature: function (session, path, timestamp) {
        const dataToSign = `${session}:${path}:${timestamp}`
        const secretKey = 'a8d4e2456d59b90c8402fc4f060982aa'
        const result = crypto.createHmac('SHA256',secretKey).update(dataToSign).digest('hex')
        return result
    },
 
    // fungsi utama
    download: async function (videoId, userFormat = '128kbps') {
        this.validateString(videoId,'videoId')
        const { path, quality } = this.handleFormat(userFormat)
        const sessionToken = await this.getSessionToken()
        const timestamp = Date.now().toString()
        const signature = this.apiSignature(sessionToken, path, timestamp)
        const { nonce, powHash } = this.pow(sessionToken, path)
 
        const headers = {
            'content-type': 'application/json',
            'x-api-auth': "Ig9CxOQPYu3RB7GC21sOcgRPy4uyxFKTx54bFDu07G3eAMkrdVqXY9bBatu4WqTpkADrQ",
            'x-session-token': sessionToken,
            'x-signature': signature,
            'x-signature-timestamp': timestamp,
            'nonce': nonce,
            'powhash': powHash,
            ... this.baseHeaders
        }
        const api = `https://fast.dlsrv.online/gateway/${path}`
        const body = JSON.stringify({ videoId, quality })
        console.log('[downloading]')
        const { data: result } = await this.hit('download', api, { headers, body, 'method': 'post' }, 'json')
        return result
    },
 
    // bonus function
    searchAndDownload: async function (query, userFormat = '128kbps') {
        // param validation hehe
        this.validateString(query, 'query')
        this.handleFormat(userFormat)
 
        // cari video
        console.log(`[searching]\n${query}\n`)
        const searchResult = await this.search(query)
        const { videoId, title, duration, views, url } = searchResult?.data?.[0]
        if (!videoId) throw Error(`cannot find video id using search!`)
        const pad = 10
        const w = '[found]' + '\n' + 'title'.padEnd(pad) + title + '\n'
        const o = 'duration'.padEnd(pad) + duration + '\n'
        const l = 'views'.padEnd(pad) + views + '\n'
        const e = 'video id'.padEnd(pad) + videoId + '\n'
        const p = 'url'.padEnd(pad) + url + '\n'
        const print =  w + o + l + e + p
        console.log(print)
 
        // download
        const result = await this.download(videoId, userFormat)
        return result
 
    }
}
 
 
// cara pakai
yt.searchAndDownload('bring me the horizon sleep walking', '128kbps')
    .then(console.log)
    .catch(e => {
        console.log(e)
    })
 
/* output
{
  status: 'tunnel',
  url: 'https://yt1s-worker-6.dlsrv.online/tunnel?id=h2......-aVKvk0EPuYpw',
  filename: 'Bring Me The Horizon - Sleepwalking - BMTHOfficialVEVO (youtube).mp3'
}
 
atauuuuu download using video id
 
yt.download('lir3dzYIhz0','144p')
yt.download('lir3dzYIhz0') -> auto select 128kbps
 
 
*/