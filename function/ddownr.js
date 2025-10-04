// import axios from "axios"
const axios = require('axios')


class Ddownr {
    constructor(url,format){
        this.url = url
        this.format = format
        this.baseurl = `https://p.savenow.to/ajax/download.php?copyright=0&format=${this.format}&url=${this.url}&api=dfcb6d76f2f6a9894gjkege8a4ab232222`
    }

    async Progress(progress_url){
        let progress = await axios.get(progress_url)
        while(progress.data.success < 1){
    progress = await axios.get(progress)

}
return progress
    }
    async getInfo(){
            const request = await axios.get(this.baseurl)
            return request.data
    }
    async download(){
        const metadata =await this.getInfo()
        const downloadResult = await this.Progress(metadata.progress_url)
        return{
            metadata,
            downloadResult
        }



    }

}

module.exports = {Ddownr}