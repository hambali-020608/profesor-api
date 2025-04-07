const express = require("express");
const swaggerUi = require("swagger-ui-express");
const YAML = require("yamljs");
const cors = require("cors");
const path = require("path");

const app = express();

// Middleware
app.use(cors({ origin: '*' }));
app.use(express.json());

// Solusi 1: Gunakan path relatif yang lebih kompatibel
const swaggerDocument = YAML.load(path.join(__dirname, "docs/api-docs.yaml"));

// Solusi 2: Atau load dokumen secara asynchronous
// const swaggerDocument = require("./docs/api-docs.json"); // Konversi YAML ke JSON dulu

// Import API routes
const apiRoutes = require("../routes/api");
app.use("/", apiRoutes);

// Swagger UI
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Ekspor sebagai Vercel Serverless Function
module.exports = app;