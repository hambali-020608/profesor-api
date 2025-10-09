// swagger.generate.js
const swaggerAutogen = require('swagger-autogen')();

const outputFile = './docs/swagger_output.json'; // hasil
const endpointsFiles = [
  './src/routes/index.js', // file yang berisi daftar router
  './src/routes/rmbg.js',
  './src/routes/spotify.routes.js',
  './src/routes/tiktok.routes.js',
  './src/routes/youtube.routes.js',
  './src/routes/movies.routes.js',
  
  // tambahkan file route spesifik bila perlu:
  // './src/routes/spotify.routes.js',
  // './src/routes/tiktok.routes.js',
  // dll
];

// Template dasar (info, servers, securityDefinitions, dsb)
const doc = {
  info: {
    title: 'Profesor API',
    description: 'Free and useful api'
  },
  host: 'profesor-api.vercel.app/', // ganti sesuai domain ketika deploy
  schemes: ['https'],
  // definisikan security jika ada
 
  definitions: {
      }
};

swaggerAutogen(outputFile, endpointsFiles, doc).then(() => {
  console.log('✅ Swagger JSON generated in', outputFile);
});
