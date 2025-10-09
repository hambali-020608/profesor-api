const express = require("express");
const swaggerUi = require("swagger-ui-express");
const YAML = require("yamljs");
const cors = require("cors");
const path = require("path");
const compression = require("compression");
// Load file dokumentasi Swagger
const swaggerDocument = YAML.load(path.join(__dirname, "docs", "api-docs.yaml"));

const app = express();
app.use(cors({origin:'*'}))
app.use(express.json());
app.use(compression());
app.use

// Import API routes
const apiRoutes = require("./src/routes");
// Tambahkan Swagger UI di `/docs`
// app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use("/", apiRoutes);
app.get('/docs-json',(req,res)=>{
      res.json(swaggerDocument);
})
app.get("/docs", (req, res) => {
  res.sendFile(path.join(__dirname, "docs.html"));
});


const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server berjalan di http://localhost:${PORT}`);
    console.log(`Dokumentasi API: http://localhost:${PORT}/docs`);
});