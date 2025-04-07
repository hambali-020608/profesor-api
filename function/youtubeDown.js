async function clipto(url) {
    const response = await fetch('https://www.clipto.com/api/youtube',{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'origin':'https://www.clipto.com',
            'user-agent':'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Mobile Safari/537.36'
    
        },
        body: JSON.stringify({'url':url})
    })
    
    const data = await response.json()
    return data
}

module.exports = {clipto}
