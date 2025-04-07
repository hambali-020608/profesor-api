const axios = require('axios');
 
async function islamai(question) {
    const url = 'https://vercel-server-psi-ten.vercel.app/chat';
    const data = {
        text: question,
        array: [
            {
                content: "Assalamualaikum",
                role: "user"
            },
            {
                content: "Waalaikumsalam",
                role: "assistant"
            }
        ]
    };
 
    try {
        const response = await axios.post(url, data, {
            headers: {
                'Content-Type': 'application/json',
                'User-Agent': 'Mozilla/5.0 (Android 10; Mobile; rv:131.0) Gecko/131.0 Firefox/131.0',
                'Referer': 'https://islamandai.com/'
            }
        });
        return response.data
    } catch (error) {
        console.error('Error sending request:', error);
    }
}
// (async () => {
//         const question = "What is the meaning of life?";
//         const response = await islamai(question);
//         console.log(response)
//         // Output: Metadata semua response
//       })();
module.exports = { islamai };