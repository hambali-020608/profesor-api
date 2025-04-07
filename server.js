const express = require("express");
const swaggerUi = require("swagger-ui-express");
const YAML = require("yamljs");
const cors = require("cors");
const path = require("path");

// Load file dokumentasi Swagger
const swaggerDocument = YAML.load(path.join(__dirname, "docs", "api-docs.yaml"));

const app = express();
app.use(cors({origin:'*'}))
app.use(express.json());

// Import API routes
const apiRoutes = require("./routes/api");
app.use("/", apiRoutes);

// Tambahkan Swagger UI di `/docs`
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server berjalan di http://localhost:${PORT}`);
    console.log(`Dokumentasi API: http://localhost:${PORT}/docs`);
});
