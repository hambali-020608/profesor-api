class SpotifyDown {
    constructor(query) {
      this.query = query;
      this.metadata = []
    }
  
    async download() {
      const response = await fetch(
        `https://api.agatz.xyz/api/spotify?message=${this.query}`
      );
      const data = await response.json();
      const musicList = data.data.slice(0,3)
      for (const music  of musicList){
            try{
                const url = await fetch(`https://api.siputzx.my.id/api/d/spotify?url=${music.externalUrl}`)
                const musicData = await url.json()
                this.metadata.push(musicData)
                
            }catch{

            }
      }
    }

    async downloadLink(){
              const url = await fetch(`https://api.siputzx.my.id/api/d/spotify?url=${this.query}`)
              const musicData = await url.json()
              this.metadata.push(musicData)


    }
  
  }


  
  
  // Contoh Penggunaan
//   (async () => {
//     const music = new SpotifyDown("djo end of beginning");
//     await music.download();
//     console.log(music.metadata); // Output: Metadata semua lagu
//   })();
  
module.exports = {SpotifyDown}