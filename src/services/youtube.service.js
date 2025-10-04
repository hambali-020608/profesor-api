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

module.exports = { Ddownr }
