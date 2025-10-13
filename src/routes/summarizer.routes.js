const express = require("express");
const router = express.Router();
const summarizerController = require("../controllers/summarizer.controller");


router.get("/youtube",summarizerController.recapio);
module.exports = router;
