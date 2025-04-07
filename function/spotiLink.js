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

module.exports = {downloadSpotify}