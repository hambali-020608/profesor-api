const axios = require('axios')
async function downloadSpotify(url) {
    const metaDataResponse = await fetch(`https://spotify-down.com/api/metadata?link=${url}`,{
        method:'POST',
        headers:{
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            'referer':'https://spotify-down.com/spotify-downloader-online',
            
        }
    })

    const Metadata= await metaDataResponse.json()

    const Linkresponse = await fetch(`https://spotify-down.com/api/download?link=https://spotify-down.com/api/download?link=${url}&n=${Metadata.data.title}&a=${Metadata.data.album}`,
        {
            method:'GET',
            headers:{
                 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
                 'referer':'https://spotify-down.com/spotify-downloader-online'
            }
        }
    )
    const link = await Linkresponse.json()
    return{
        data:Metadata.data,
        link
        
    }
}

const spotiDown = {
    api: {
        base: 'https://parsevideoapi.videosolo.com',
        endpoints: {
            info: '/spotify-api/'
        }
    },
 
    headers: {
        'authority': 'parsevideoapi.videosolo.com',
        'user-agent': 'Postify/1.0.0',
        'referer': 'https://spotidown.online/',
        'origin': 'https://spotidown.online'
    },
 
    extractId: (url) => {
        const a = [
            /spotify\.com\/track\/([a-zA-Z0-9]{22})/, 
            /spotify:track:([a-zA-Z0-9]{22})/,
            /^([a-zA-Z0-9]{22})$/
        ];
 
        for (const b of a) {
            const match = url.match(b);
            if (match) return match[1];
        }
        return null;
    },
 
    isUrl: (url) => {
        const trackId = spotiDown.extractId(url);
        return {
            valid: !!trackId,
            error: !url ? "Linknya mananya anjirr? lu mau download apa kagak sih? kosong begini inputnya 🗿" : 
                   !trackId ? "Format linknya kagak valid bree 😑" : null,
            url: url?.trim(),
            trackId
        };
    },
 
    download: async (url) => {
        // const validation = spotiDown.isUrl(url);
        // if (!validation.valid) {
        //     return { 
        //         status: false, 
        //         code: 400, 
        //         result: { error: validation.error }
        //     };
        // }
 
        try {
            // const link = validation.trackId.length === 22 && !url.includes('spotify.com') 
            //     ? `https://open.spotify.com/track/${validation.trackId}`
            //     : validation.url;
 
            const response = await axios.post(`${spotiDown.api.base}${spotiDown.api.endpoints.info}`, {
                format: 'web',
                url: url
            }, { headers: spotiDown.headers });
            if (response.data.status === "-4") {
                return {
                    status: false,
                    code: 400,
                    result: {
                        error: "Linknya kagak valid bree, cuman bisa download track doang euy 😂"
                    }
                };
            }
 
            const { metadata } = response.data.data;
            if (!metadata || Object.keys(metadata).length === 0) {
                return {
                    status: false,
                    code: 404,
                    result: {
                        error: "Metadata tracknya kosong bree, ganti link yang lain aja yak.."
                    }
                };
            }
 
            return {
                status: true,
                code: 200,
                result: {
                    title: metadata.name,
                    artist: metadata.artist,
                    album: metadata.album,
                    duration: metadata.duration,
                    image: metadata.image,
                    download: metadata.download,
                    trackId: validation.trackId
                }
            };
        } catch (error) {
            return {
                status: false,
                code: error.response?.status || 500,
                result: { 
                    error: "Kagak bisa ambil data metadatanya bree 🙈"
                }
            };
        }
    }
};
 


module.exports = {downloadSpotify,spotiDown}